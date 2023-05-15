import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Icon, Popover, Tooltip } from 'antd';

import { router } from 'umi';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AdvancedSearchForm from '@/components/AdvancedSearchForm';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import AdvancedSelect from '@/components/AdvancedSelect';
import * as utils from '@/utils/utils';
import { getAuthority } from '@/utils/utils';



const gDictData=[
  {id:1,type:'GuideStatus',k:"0",val:'初稿'},
  {id:2,type:'GuideStatus',k:"1",val:'发布'},
  {id:3,type:'GuideStatus',k:"2",val:'开始申报'},
  {id:4,type:'GuideStatus',k:"3",val:'申报结束'},
  {id:5,type:'GuideStatus',k:"4",val:'审评开始'},
  {id:6,type:'GuideStatus',k:"5",val:'审评结束'},
]

@connect(({CommitReviewModel,loading,user})=>({
  CommitReviewModel,
  user,
  tableLoading:loading.effects['CommitReviewModel/getAdminGuide'] || loading.effects['CommitReviewModel/getUserGuide']
}))
class GuideList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {CommitReviewModel:{pagination}} = this.props;
    this.getGuideList(pagination)
  }

  getGuideList = (payload) => {
    const {dispatch} = this.props;
    const roles = getAuthority()
    switch (roles[0]) {
      case '超级管理员':
        dispatch({
          type:'CommitReviewModel/getAdminGuide',
          payload,
        })
        break;
      default:
        dispatch({
          type:'CommitReviewModel/getUserGuide',
          payload,
        })
        break;
    }
  }

  showTask = ({guideId}) => {
    router.push(`/PersonalProject/CommitGuide/${guideId}`)
  }


  handleStandardTableChange = (value,filtersArg) => {
    const { status = []} = filtersArg;
    const {pageSize:size, current} = value;
    this.getGuideList({current,size,status:status[0]})
  }

  advancedSearch = (value) => {
    const {CommitReviewModel:{guidePagination:{current,size}}}=this.props;
    this.getGuideList({current,size,...value})
  }


  render() {
    const guideStateArr = utils.getDictByType(gDictData, "GuideStatus");
    const filterGuideState = [];
    guideStateArr.map(value => filterGuideState.push({text: value.val, value: value.k}))
    const searchList = [
      {
        title: '任务名称',
        field: 'guideName',
        type: 'input',
      },
      {
        title: '任务状态',
        field: 'status',
        type: 'other',
        renderComponent: () => <AdvancedSelect dataSource={guideStateArr} type="DATADICT" onChange={this.handleStateChange} />
      },
    ];
    const btnList = {
      primaryBtn: [{
        func: this.getGuideList,
        param : {},
        key: 'REFRESH',
      }],
    };
    const columns = [
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 80,
      },
      {
        title: '任务名称',
        dataIndex: 'guideName',
        key: 'guideName',
        align: 'left',
        width: 120,
        render: (record = "") => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 14) {
            data = data.substring(0, 13)
            data += "......"
          }
          return (
            <Popover
              content={record}
              autoAdjustOverflow
              mouseEnterDelay={0.2}
              placement='right'
            >
              {data}
            </Popover>
          )
        },
      },
      {
        title: '任务简称',
        dataIndex: 'guideBrief',
        key: 'guideBrief',
        align: 'left',
        width: 80,
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        width: 80,
        render:  (v)=> utils.getAllDictNameById(gDictData, "GuideStatus", v) || "",
        filters: filterGuideState,
        filterMultiple: false,
      },
      {
        title: '建立时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 85,
      },
      {
        title: '操作',
        width: 140,
        key: 'action',
        dataIndex: 'action',
        align:'center',
        render:(text, record) =>
          <Tooltip title='查看'>
            <a onClick={() => this.showTask(record)}>
              <Icon type="eye" />
            </a>
          </Tooltip>
      },
    ];
    const {CommitReviewModel:{guidePagination,guideData},tableLoading}=this.props;
    const tableData = {
      list:guideData,
      pagination:guidePagination
    }
    return (
      <PageHeaderWrapper title="任务列表">
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.advancedSearch}
          pagination={guidePagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={btnList} />
          <StandardTable
            selectedRows={null}
            loading={tableLoading}
            data={tableData}
            rowKey={record => record.guideId}
            onSelectRow={this.onSelectChange}
            columns={columns}
            onChange={this.handleStandardTableChange}
            rowSelection={null}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default GuideList;
