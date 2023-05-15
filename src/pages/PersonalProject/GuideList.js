import React, {PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import {Card, Popover,Tooltip,Divider,Icon} from 'antd';
import router from 'umi/router';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import GuideDetail from './GuideDetail';
import AdvancedSelect from '../../components/AdvancedSelect';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import StandardTable from '@/components/StandardTable';
import * as utils from "../../utils/utils";


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({guideUserModal, basicdata, personalProjectModal,loading}) => ({
  guideUserModal,
  basicdata,
  personalProjectModal,
  loading: loading.models.guideUserModal,
  loadingList: loading.effects['guideUserModal/fetch'],
  loadingAdd: loading.effects['guideUserModal/addGuide'],
  loadingUpdate: loading.effects['guideUserModal/editGuide'],
}))
class GuideList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      checks: [], // 其他页面的selectedRow
      drawerVisible: false,
      searchMoreParams:{},
      guideId:null
    };
    this.gDictData=[
      {id:1,type:'GuideStatus',k:"0",val:'初稿'},
      {id:2,type:'GuideStatus',k:"1",val:'发布'},
      {id:3,type:'GuideStatus',k:"2",val:'开始申报'},
      {id:4,type:'GuideStatus',k:"3",val:'申报结束'},
      {id:5,type:'GuideStatus',k:"4",val:'审评开始'},
      {id:6,type:'GuideStatus',k:"5",val:'审评结束'},
    ]
  }

  componentDidMount() {
    this.listPage({
      currentPage: 1,
      pageSize: 10,
    });
  }

  listPage = (params) => {
    const { dispatch, guideUserModal: { pagination } } = this.props;
    const { searchMoreParams } = this.state;
    const isParamsUndefined = Object.keys(params || {});
    dispatch({
      type: 'guideUserModal/fetch',
      payload: isParamsUndefined.length !== 0 ? params : { ...pagination, ...searchMoreParams },
    });
    if (isParamsUndefined.length !== 0) {
      const { currentPage, pageSize, ...searchValue } = params;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
    }


    // dispatch({
    //   type: 'guideUserModal/getRules',
    //   payload: {
    //     parentId: 0,
    //   }
    // });
  };

  onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
  };

  // 显示详细任务信息
  showGuideDetail=(id)=>{
    this.setState({
      guideId:id,
      drawerVisible:true
    })
  }

  // 本地拟的字典，到时候改成网络获取！！！
  
  
  // 跳转申报页面
  toDeclare = (id, record) => {
    const { dispatch } = this.props
    dispatch({
      type:'personalProjectModal/save',
      payload:{
        currentGuideId:id,
        currentGuide:record
      }
    })
    router.push('/PersonalProject/basicInfo/step1')
  }

  // 询问撤回操作，年限设置是否不需要了！！！
  // 因为不知道还要不要，所以里面的都还没写！！！
  createAction = (text, record) => 
    <Fragment>
      <Tooltip title="填写申报表">
        <a onClick={() => this.toDeclare(record.guideId,record)}>
          <Icon type='edit' />
        </a>
      </Tooltip>
      <Divider type='vertical' />
      <Tooltip title="查看">
        <a onClick={() => this.showGuideDetail(record.guideId)}>
          <Icon type='eye' />
        </a>
      </Tooltip>
    </Fragment>;

  // eslint-disable-next-line no-unused-vars
  handleStateChange = (value) => {
    // 不知道留这个干啥
  };

  // 控制drawer关闭
  onCloseDrawer = () => {
    this.setState({
      drawerVisible : false,
    });
};

  // 搜索框搜索分页
  // 接口只能对任务名称和任务状态进行查询！！！
  advancedSearch = (params) => {// 搜索框搜索分页
    if(Object.prototype.hasOwnProperty.call(params,'guideBrief')||Object.prototype.hasOwnProperty.call(params,'status')){// 如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams:{
          ...params,
        }
      })
    }
    else{// 点击重置
      this.setState({
        searchMoreParams:{}
      })
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'guideUserModal/fetch',
      payload : {// 搜索之后总是第一页
        ...params,
        currentPage : 1 ,
        pageSize : 10,
      },
    });
  };

  // 表格改变触发(分页，改变current，改变size)
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {searchMoreParams}=this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...searchMoreParams,
      ...filters,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.listPage((params))
  };


  render() {
    const {guideUserModal: {guideData, pagination}, loadingList} = this.props;
    const {checks, drawerVisible,guideId} = this.state;

    // 下三行为字典操作，目前是本地的字典！！！
    const guideStateArr = utils.getDictByType(this.gDictData, "GuideStatus");
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
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        width: 80,
        render:  (v)=> utils.getAllDictNameById(this.gDictData, "GuideStatus", v) || "",
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
        render: (text, record) => (
          this.createAction(text, record)
        ),
      },
    ];

    const btnList = {
      primaryBtn: [{
        func: this.listPage,
        param : {},
        key: 'REFRESH',
      }],
    };

    const guideDetailProps = {
      guideId,
      onClose:this.onCloseDrawer
    }
    return (
      <PageHeaderWrapper title="任务列表">
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.advancedSearch}
          pagination={pagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={btnList} selectedRows={checks} />
          <StandardTable
            selectedRows={checks}
            loading={loadingList}
            data={guideData}
            rowKey={record => record.guideId}
            onSelectRow={this.onSelectChange}
            columns={columns}
            onChange={this.handleStandardTableChange}
            rowSelection={null}
          />
        </Card>
        <AdvancedDrawer
          drawerTitle="任务详情"
          drawerContent={<GuideDetail {...guideDetailProps} />}
          onChangeDrawerVisible={this.onCloseDrawer}
          drawerVisible={drawerVisible}
          destroyOnClose
          placement="right"
          closa
        />
      </PageHeaderWrapper>
    );
  }
}

export default GuideList;
