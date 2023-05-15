import React, { PureComponent,Fragment} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card,message,Tooltip,Icon} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import * as utils from '../../utils/utils';
import {GUIDE_STATE} from '../../utils/Enum';
import AdvancedSearchForm from '../../components/AdvancedSearchForm';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';

@connect(({ loading, EduMangeProjectsModel,basicdata }) => ({
  loading,
  basicdata,
  EduMangeProjectsModel,
  guideListLoading: loading.effects['EduMangeProjectsModel/getGuideList'],
}))

class EditProjects_Guides extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      searchMoreParams:{}
    };
  };

  componentDidMount() {
    const {dispatch}=this.props;
    dispatch({
      type:'EduMangeProjectsModel/getAlldep',
    });
    this.listPage({
      currentPage: 1,
      pageSize: 10,
    });
  };

  listPage = (params) => {
    const { dispatch, EduMangeProjectsModel:{guideListPagination}} = this.props;
    const { searchMoreParams } = this.state;
    const isParamsUndefined = Object.keys(params || {});
    dispatch({
      type: 'EduMangeProjectsModel/getGuideList',
      payload: isParamsUndefined.length !== 0 ? params : { ...guideListPagination, ...searchMoreParams },
    });
    if (isParamsUndefined.length !== 0) {
      const { currentPage, pageSize, ...searchValue } = params;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
    }
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination) => {
    const {searchMoreParams}=this.state;
    let newParams={};
    newParams= {
      ...searchMoreParams,
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
    };
    this.listPage(newParams)
  };

  openProjectPageByButton=()=>{
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('每次只允许查看一条指南的项目');
      return
    }
    router.push({
      pathname: `/EduMangeProjects/ProjectsList/${selectedRows[0].guideId}`,
      query: {prevent: true}
    });
  };

  openProjectPageByIcon=(record)=>{
    if (record.state<=GUIDE_STATE[6].value){
      router.push({
        pathname: `/EduMangeProjects/ProjectsList/${record.guideId}`,
        query: {prevent: true}
      });
    }else {
      message.error('该指南状态下无法修改指南！');
    }
  };


  advancedSearch = (params) => {//  搜索框搜索分页
    if(Object.prototype.hasOwnProperty.call(params,'state')){//  如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams:params,
      })
    }
    else{//  点击重置
      this.setState({
        searchMoreParams:{}
      })
    }
    const { dispatch } = this.props;
    dispatch({
      type : 'EduMangeProjectsModel/getGuideList',
      payload : params || {
        currentPage : 1 ,
        pageSize : 10,
      },
    });
  };

  columns = [{
    title: '指南序号',
    dataIndex: 'key',
    key: 'key',
    align: 'center',
    render: (text, record, index) => <span>{index + 1}</span>
  }, {
    title: '指南名称',
    key: 'guideName',
    dataIndex: 'guideName',
  },{
    title: '指南状态',
    key: 'state',
    dataIndex: 'state',
    render:(text)=>{
      const {basicdata:{gDictData}} = this.props;
      return(
        utils.getAllDictNameById(gDictData, 'guideState', text)
      )
    }
  },{
    title: '开始年份',
    key: 'beginYear',
    dataIndex: 'beginYear',
  },{
    title: '结束年份',
    key: 'endYear',
    dataIndex: 'endYear',
  },{
    title:'操作',
    key:'action',
    render:(text,record)=>(
      <Fragment>
        <Tooltip title='查看详情'>
          <a onClick={() => this.openProjectPageByIcon(record)}><Icon type="eye" /></a>
        </Tooltip>
      </Fragment>
    ),
  }];

  btnList = {
    primaryBtn: [{
      func: this.listPage,
      param: { },
      key: 'REFRESH',
    }],
    patchBtn: [{
      func: this.openProjectPageByButton,
      param: {},
      key: 'SHOW_MORE',
    }],
  };

  searchList = [
    {
      title : '指南状态',
      field : 'state',
      message : '指南状态选择有错',
      type : 'other',
      renderComponent : () => {
        const {basicdata:{gDictData}}=this.props;
        const guideState=utils.getDictByType(gDictData,'guideState');
        return (<AdvancedSelect dataSource={guideState} fieldConfig={SelectFieldConfig.filedConfigForDic} onChange={(value) => {console.log(value)}} />);
      },
    },
  ];

  render() {
    const { EduMangeProjectsModel: { guideList,guideListPagination} } = this.props;
    const { selectedRows } = this.state;
    const { guideListLoading } = this.props;
    return (
      <PageHeaderWrapper title='指南列表'>
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.advancedSearch}
          pagination={guideListPagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows}/>
          <StandardTable
            selectedRows={selectedRows}
            loading={guideListLoading}
            data={guideList}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.guideId}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EditProjects_Guides;
