import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, message,Divider,Tooltip,Icon,Button ,Modal,Popover} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import * as utils from '../../utils/utils';
import FooterToolbar from '@/components/FooterToolbar';
import AdvancedSearchForm from '../../components/AdvancedSearchForm';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import ProjectDetail from '../../components/ProjectDetail';
import AdvancedDrawer from '@/components/AdvancedDrawer';
import {CLASSIC_CASE} from "../../utils/Enum";
import {getClassicCaseList} from "../../services/getProjectAllInfo";


const {confirm}=Modal;
@connect(({ loading, GetProjectAllInfo,basicdata }) => ({
  loading,
  basicdata,
  GetProjectAllInfo,
  listLoading: loading.effects['GetProjectAllInfo/getClassicCaseList'],

}))

class  ClassicCase extends PureComponent {

  constructor() {
    super();
    this.state = {
      selectedRows: [],
      searchMoreParams:{},
    };
  };

  componentDidMount() {
    this.listPage();
  };

  createAction = (record) => {
      return(
        <Fragment>
          <Tooltip title="下载">
            <a onClick={() => this.handleDownload(record)}>下载</a>
          </Tooltip>
        </Fragment>
      )


  };

  listPage = (data) => {
    const { dispatch ,GetProjectAllInfo:{projectPagination},match:{params}} = this.props;
    const { searchMoreParams } = this.state;
    const isParamsUndefined = Object.keys(data || {});
    dispatch({
      type: 'GetProjectAllInfo/getClassicCaseList',
      payload: isParamsUndefined.length !== 0 ? data : { ...projectPagination, ...searchMoreParams ,guideId:params.guideId},
    });
    if (isParamsUndefined.length !== 0) {
      const { currentPage, pageSize, ...searchValue } = data;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
    }
  };

  advancedSearch = (param) => {
    const {dispatch}=this.props;
    const {match:{params}}=this.props;
    param['guideId']=params.guideId;

    if(Object.prototype.hasOwnProperty.call(param,'prjOwner')||Object.prototype.hasOwnProperty.call(param,'projectName')||Object.prototype.hasOwnProperty.call(param,'annexName')||Object.prototype.hasOwnProperty.call(param,'workCompany')){//  如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams:param,
      })
    }
    else{//  点击重置
      this.setState({
        searchMoreParams:{}
      })
    }
    dispatch({
      type: 'GetProjectAllInfo/getClassicCaseList',
      payload: param || {
        guideId:params.guideId,
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  exportClassicCase = () => {
    const { match:{params}} = this.props;
    confirm({
      title: `是否确认导出`,
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        const {dispatch} = this.props;
        dispatch({
          type:`GetProjectAllInfo/exportClassicCase`,
          payload:{
            guideId:params.guideId,
          }
        })
      }
    })
  };

  handleReturn=()=>{
    const {dispatch} = this.props;
    router.push({
      pathname: `/getProjectAllInfo/GuideList`,
      query: {prevent: true}
    });
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '经典案例',
      },
    });
  }

  handleStandardTableChange = (pagination) => {
    const {searchMoreParams}=this.state;
    const {match:{params}}=this.props;

    const data = {
      ...searchMoreParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      guideId:params.guideId,
    };
    this.listPage(data)
  };


  handleDownload=(data)=>{
    console.log('data',data);
    confirm({
      title: `是否确认下载`,
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        const {dispatch} = this.props;

        dispatch({
          type:`GetProjectAllInfo/downLoadFile`,
          payload:{
            md5: data.annexFileInfo[0].fileMd5,
            fileName: data.annexFileInfo[0].fileName,
          }
        })
      }
    })
 }



  columns = [
    {
      title: '案例名称',
      key: 'annexName',
      dataIndex: 'annexName',
      width: 120,
    },{
    title: '项目编号',
    key: 'approvalNo',
    dataIndex: 'approvalNo',
    width: 120,
  },{
    title: '项目名称',
    key: 'projectName',
    dataIndex: 'projectName',
  },{
    title: '申报者',
    key: 'prjOwner',
    dataIndex: 'prjOwner',
  },{
    title: '试点单位',
    key: 'workCompany',
    dataIndex: 'workCompany',

  },{
    title: '提交时间',
    key: 'submitTime',
    dataIndex: 'submitTime',
  },{
    title:'操作',
    key:'action',
    render:(text,record)=>this.createAction(record),
  }];

  btnList = {
    primaryBtn: [{
      func: this.listPage,
      param: {},
      key: 'REFRESH',
    },{
      func: this.exportClassicCase,
      param: {},
      key: 'EXPORT_CLASSIC_CASE',
    }],

  };

  searchList = [
      {
      title : '案例名称',
      field : 'annexName',
      type : 'input',
    },
    {
      title : '项目名称',
      field : 'projectName',
      type : 'input',
    },
    {
      title : '项目负责人',
      field : 'prjOwner',
      type : 'input',
    },
    {
      title : '试点单位',
      field : 'pilotUnit',
      type : 'input',
    },

  ];

  render() {
    const { GetProjectAllInfo: { classicCaseList,classicCasePagination } } = this.props;
    const { selectedRows} = this.state;
    const { listLoading } = this.props;

    return (
      <PageHeaderWrapper title='经典案例列表'>
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.advancedSearch}
          pagination={classicCasePagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows} />
          <StandardTable
            selectedRows={selectedRows}
            loading={listLoading}
            data={classicCaseList}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.projectId}
          />
        </Card>
        <FooterToolbar>
          <Button type="primary" style={{marginLeft: 8}} onClick={this.handleReturn} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }

}
export default ClassicCase;
