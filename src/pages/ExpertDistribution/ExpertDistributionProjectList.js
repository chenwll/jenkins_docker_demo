import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, message,Modal } from 'antd';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ToolBarGroup from '@/components/ToolBarGroup';
import {  PROJECT_PROCESS_TYPE,depOrExpDistribution } from '../../utils/Enum'
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from '../../utils/styles/StandardTableStyle.less'
import * as config from '../../utils/projectApprovalConfig'
import AdvancedSelect from '../../components/AdvancedSelect';
import * as utils from '../../utils/utils';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import ExpertDistribution from './ExpertDistribution'


const {confirm}=Modal;
@Form.create()
@connect(({ expertDistributionModel, loading, basicdata, global}) => ({
  expertDistributionModel,
  global,
  basicdata,
  loading: loading.models.expertDistributionModel,
  expertDistrbutionLoading:loading.effects['expertDistributionModel/expertDistrbution'],
  loadingList: loading.effects['expertDistributionModel/getRecommendDetail'],
  cancelDistrbutionLoading: loading.effects['expertDistributionModel/cancelDistrbution'],
}))
class ExpertDistributionProjectList extends PureComponent {

  state = {
    selectedRows: [],
    pageInfo: {},
    drawerApprovalVisible: false,
    searchParams:{}
  };


  componentDidMount() {
    const { dispatch } = this.props;
    this.listPage();
    dispatch({
      type: 'expertDistributionModel/save',
      payload: {
        urlWay: '/projectEducation/edu',
        APIType: 'edu'
      }
    });
    dispatch({
      type:'expertDistributionModel/getAllExpert'// 获取所有专家
    })
    dispatch({
      type:'expertDistributionModel/getExpertGroup'
    })
  }


  listPage = (params) => {
    const { dispatch,match : { params: { type, ...pageInfo } } } = this.props;
    const {searchParams}=this.state;
    dispatch({
      type: 'expertDistributionModel/getRecommendDetail',
      payload: {
        currentPage: 1,
        pageSize: 10,
        flag: 0,
        state: 1,
        expOrDep:depOrExpDistribution.EXP,// 表示专家
        ...pageInfo,
        ...params,
        type,
        ...searchParams
      },
    });
  };

  handelCancel=()=>{
    const { match : { params } } = this.props;
    const { expertDistributionModel :{ urlWay } } = this.props;
    router.push({
      pathname: `${urlWay}/topicList/${params.guideId}/${params.type}/${params.reviewYear}`,
      query: {prevent: true}
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleStandardTableChange = (pagination) => {
    const {match : { params: { type, ...pageInfo } } } = this.props;
    const {searchParams}=this.state;
    const {dispatch}=this.props;
    dispatch({
      type: 'expertDistributionModel/getRecommendDetail',
      payload: {
        flag: 0,
        state: 1,
        expOrDep:2,// 表示专家
        ...pageInfo,
        ...searchParams,
        currentPage : pagination.current,
        pageSize : pagination.pageSize,
      },
    });
    this.setState({
      searchParams:{
        ...searchParams,
        currentPage : pagination.current,
        pageSize : pagination.pageSize,
      }
    })
  };

  onCloseDrawer=()=>{
    this.setState({
      drawerVisible : false,
      drawerApprovalVisible: false,
    });
  }

  handleToolBar = () => {
    let judgeDis=false;
    const {selectedRows}=this.state;
    selectedRows.map(item=>{
      if(item.allocated===1){
        message.warning('所选项目中有项目以分配专家，请重新选择');
        judgeDis=true;
        return judgeDis;
      }
    });
    if(judgeDis){
      return
    }
    this.setState({
      drawerApprovalVisible: true,
    })
  };

  handleCancleDistrbution=()=>{
    let judgeDis=false;
    const { dispatch } = this.props;
    const {
      match: { params = {} },
    } = this.props;
    const {handleSelectRows}=this;
    const {selectedRows}=this.state;
    selectedRows.map(item=>{
      if(item.allocated===0){
        message.warning('所选项目中有项目尚未分配专家，请重新选择');
        judgeDis=true;
        return judgeDis;
      }
    });
    if(judgeDis){
      return
    }
    confirm({
      title: `是否确认取消所选${selectedRows.length}个项目的专家分配`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const cancelIds=[];
        const { match : { params: { type, ...pageInfo } } } = this.props;
        const {expertDistributionModel:{pagination}}=this.props;
        selectedRows.map(item=>{
          cancelIds.push(item.projectId);
          return cancelIds;
        });
        const {searchParams}=this.state;
        dispatch({
          type:'expertDistributionModel/cancelDistrbution',
          payload:{
            cancelDis:{
              depExpIds:0,// 随意填写的一个值没有实际意义
              projectIds:cancelIds,
              processId:params.processId,
            },// 用于取消分配
            fetch:{
              flag: 0,
              state: 1,
              expOrDep:2,// 表示专家
              ...pageInfo,
              ...params,
              ...searchParams,
              ...pagination
            }// 用于刷新
          }
        })
        handleSelectRows([])
      }
    })
  };

  doSearch = (params) => {
    const { pageInfo } = this.state;
    const { currentPage, pageSize, ...formValues } = params;
    this.setState({
      searchParams:{
        ...params,
      }
    })
    this.setState({
      formValues,
    },() => this.listPage({
      ...pageInfo,
      ...params,
    }))
  };

  renderExpert = () => {
    const {
      match: { params = {} },
      basicdata: { gDictData },
    } = this.props;
    const {selectedRows,drawerApprovalVisible,}=this.state;
    const { match : { params: { type, ...pageInfo } },form } = this.props;
    const {searchParams}=this.state;
    const contentOptionsRecommend = {
      gDictData,
      ...pageInfo,
      searchParams,
      form,
      processType: params.processType,
      processId: params.processId,
      projects: selectedRows,
      onClose: this.onCloseDrawer,
      handleSelectRows:this.handleSelectRows
    };
    return {
      drawerTitle: "专家分配",
      drawerVisible:drawerApprovalVisible,
      onChangeDrawerVisible: this.onCloseDrawer,
      drawerContent: <ExpertDistribution {...contentOptionsRecommend} />,
    };
  };

  renderDrawer = () => {
    const{match:{params:{processType}}} = this.props;
    switch (Number(processType)) {
      case PROJECT_PROCESS_TYPE.APPROVAL:
      case PROJECT_PROCESS_TYPE.SCORE:
      case PROJECT_PROCESS_TYPE.EXPERT_APPROVAL:
      case PROJECT_PROCESS_TYPE.EXPERT_SCORE:
        return this.renderExpert();
      default:
    }
  };



  handleScoreDetail = () =>{
    const {match:{params}} = this.props;
    router.push({
      pathname: `/projectEducation/edu/expertScoreDetail/${params.guideId}/${params.processId}/${params.processType}/${params.type}/${params.reviewYear}`,
      query: {prevent: true}
    });
  };

  expertsWithIdToString(allExpert=[]){
    allExpert=allExpert.map(item=>{
      item.groupId=item.groupId.toString()
      return item
    })
    return allExpert
  };

  render() {
    const {expertDistributionModel:{projectRefDetail={list:[]}}}=this.props;
    const {expertDistrbutionLoading,loadingList,cancelDistrbutionLoading}=this.props;
    const {expertDistributionModel:{expertGroup}}=this.props;
    const {
      match: { params = {} },
      basicdata: { gDictData },
    } = this.props;
    const {selectedRows}=this.state;
    const {pagination = {}} = projectRefDetail;
    const btnList = {
      primaryBtn: [{
        func: this.listPage,
        param: [],
        key: 'REFRESH',
      },{
        func:this.handleScoreDetail,
        param:[],
        key:'SCORE_DETAIL',
      }],
      patchBtn:[{
        func : this.handleToolBar,
        param : {},
        key : 'PROJECT_EXPERT',
      },{
        func : this.handleCancleDistrbution,
        param : {},
        key : 'PROJECT_DISTRBUTION_CANCEL',
      }]
    };

    const distributionType=[{
      k:'1',
      val:'已分配',
      key:'1',
    },{
      k:'0',
      val:'未分配',
      key:'0',
    }]
    let searchList = [...config.distributionSearchListProjectDetail];
    searchList=searchList.concat(
      [{
        title: '学校类型',
        field: 'schoolType',
        type: 'other',
        renderComponent : () => (
          <AdvancedSelect
            dataSource={utils.getDictByType(gDictData,'schoolType')}
            fieldConfig={SelectFieldConfig.userSearchFiledConfig}
            searchType="FUZZYSEARCH"
            onChange={() => {}}
          />),
      },{
        title: '分配状态',
        field: 'allocated',
        type: 'other',
        renderComponent : () => (
          <AdvancedSelect
            dataSource={distributionType}
            fieldConfig={SelectFieldConfig.userSearchFiledConfig}
            onChange={() => {}}
          />),
      },{
        title: '分配专家组',
        field: 'groupName',// 暂无
        type: 'other',
        renderComponent : () => (
          <AdvancedSelect
            dataSource={this.expertsWithIdToString(expertGroup)}
            searchType='FUZZYSEARCH'
            placeholder="请选择专家组"
            fieldConfig={SelectFieldConfig.expertGroupSearch}
            onChange={(value) => {console.log(value)}}
          />        )
      }]
    );
    const cardTitle = params.type==='1'?'非高校立项阶段':'高校立项阶段';
    const columns = [
      {
        title:'项目名称',
        dataIndex:'projectName',
        key:'projectName',
      },
      {
        title : '项目负责人',
        dataIndex : 'prjOwner',
        key : 'prjOwner',
      },
      {
        title : '试点单位',
        dataIndex : 'pilotUnit',
        key : 'pilotUnit',
      },
      {
        title: '学校类型',
        dataIndex: 'schoolType',
        key: 'schoolType',
        render: (text) => (
          <Fragment>
            {utils.getAllDictNameById(gDictData,'schoolType',String(text))}
          </Fragment>
        ),
      },
      {
        title : '项目所处状态',
        dataIndex : 'allocated',
        key : 'allocated',
        render:(text)=>{
          let status='暂无数据';
          text===1?status='已分配':status='未分配';
          return(
            <span>{status}</span>
          )
        }
      },
      {
        title : '项目所分配专家组',
        dataIndex : 'groupName',
        key : 'groupName',
        render:(text)=>{
          if(text){
            return(<span>{text}</span>)
          }
          return(<span>未分配</span>)
        }
      },
    ];
    const drawerApprovalProps = this.renderDrawer();
    return (
      <PageHeaderWrapper>
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.doSearch}
          pagination={pagination}
          loading={loadingList}
        />
        <Card bordered={false} title={<h2>{cardTitle}</h2>}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loadingList||expertDistrbutionLoading||cancelDistrbutionLoading}
              data={projectRefDetail}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.projectId}
            />
          </div>
          <AdvancedDrawer {...drawerApprovalProps} />
          <FooterToolbar>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.handelCancel} htmlType='button'>
              返回
            </Button>
          </FooterToolbar>
        </Card>
      </PageHeaderWrapper>
    );
  }

}

export default ExpertDistributionProjectList;
