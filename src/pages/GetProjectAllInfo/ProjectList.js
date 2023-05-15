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

const  draft=0;// 立项开始
const legislationSuccess=4;// 立项成功
const legislationDefeate=3;// 立项失败
const MandatorTecommend=2;// 立项中
const topicEnd=5;// 结题提交开始
const concludEnd=14;// 结项结束
const {confirm}=Modal;
@connect(({ loading, GetProjectAllInfo,basicdata }) => ({
  loading,
  basicdata,
  GetProjectAllInfo,
  listLoading: loading.effects['GetProjectAllInfo/getProjectList'],
  drawerLoading: loading.effects['GetProjectAllInfo/getProjectAllInfo'],
}))

class ProjectList extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      drawerVisible: false,
      searchMoreParams:{},
    };
  };

  componentDidMount() {
    this.listPage();
  };

  listPage = (data) => {
    const { dispatch ,GetProjectAllInfo:{projectPagination},match:{params}} = this.props;
    const { searchMoreParams } = this.state;
    const isParamsUndefined = Object.keys(data || {});
    dispatch({
      type: 'GetProjectAllInfo/getAllGuide',
    });
    dispatch({
      type: 'GetProjectAllInfo/getProjectList',
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

    if(Object.prototype.hasOwnProperty.call(param,'prjOwner')||Object.prototype.hasOwnProperty.call(param,'projectName')||Object.prototype.hasOwnProperty.call(param,'state')||Object.prototype.hasOwnProperty.call(param,'pilotUnit')){//  如果有说明是条件查询，分页也是有条件的
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
      type: 'GetProjectAllInfo/getProjectList',
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
      // project: rows[0],
      // reviewYear:rows[0].reviewYear
    });
  };

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

  closeDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  openDrawerProjectDetailByIcon=(record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'GetProjectAllInfo/getAllProjectDetail',
      payload: {
        projectId: record.projectId,
        reviewYear:record.reviewYear
      },
    });
    this.setState({
      drawerVisible: true,
    });
  };

  openDrawerProjectDetailByButtion = () => {
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('每次只允许查看一条消息')
      return
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'GetProjectAllInfo/getAllProjectDetail',
      payload: {
        projectId: selectedRows[0].projectId,
        reviewYear:selectedRows[0].reviewYear
      },
    });
    this.setState({
      drawerVisible: true,
    });
  };

  showProjectRecommendDetail=(record)=>{
    const {match:{params}}=this.props;
    router.push({
      pathname: `/getProjectAllInfo/ProjectRecommendDetail/${params.guideId}/${record.projectId}`,
      query: {prevent: true}
    });
  };

  showAnnualReviewDetail=(record)=>{
    const {match:{params}}=this.props;
    router.push({
      pathname: `/getProjectAllInfo/ProjectYearResult/${params.guideId}/${record.projectId}/${record.reviewYear}`,
      query: {prevent: true}
    });
}


  pilotEnd=(record)=>{
    const { dispatch,GetProjectAllInfo:{projectPagination},match:{params} } = this.props;
    const {searchMoreParams}=this.state;
    dispatch({
      type: 'GetProjectAllInfo/setEnd',
      payload: {
        data:{id: record.projectId,},
        params:{...searchMoreParams, ...projectPagination,guideId:params.guideId,}

    },
    });
  }

  handelReturn=()=>{
    router.push({
      pathname: `/getProjectAllInfo/GuideList`,
      query: {prevent: true}
    });
  };

  forceRecommendByIcon=(record)=>{
    const {dispatch,GetProjectAllInfo:{projectPagination}}=this.props;
    const {match:{params}}=this.props;
    const { searchMoreParams } = this.state;
    confirm({
      title: '是否确认强制推荐，该操作可能会影响某些数据以及流程.不建议使用！！！！',
      okText: '仍然使用',
      cancelText: '取消使用',
      onOk: () => {
        dispatch({
          type:'GetProjectAllInfo/forceRecommend',
          payload:{
            setup:{
              projectId:record.projectId,
            },
            params:{guideId:params.guideId,...projectPagination,...searchMoreParams}
          }
        });
        this.handleSelectRows([]);
      }
    });
  };

  forceRecommendByButton=()=>{
    const {dispatch}=this.props;
    const {selectedRows}=this.state;
    const {match:{params}}=this.props;
    confirm({
      title: '是否确认强制推荐，该操作可能会影响某些数据以及流程.不建议使用！！！！',
      okText: '仍然使用',
      cancelText: '取消使用',
      onOk: () => {
        dispatch({
          type:'GetProjectAllInfo/forceRecommend',
          payload:{
            setup:{
              projectId:selectedRows[0].projectId,
            },
            projectListFetch:params.guideId
          }
        });
        this.handleSelectRows([]);
      }
    });
  };

  handleDrawerVisible=(state)=>{
    this.setState({
      drawerVisible:state
    })
  }

  chooseAction=(record)=>{
    if(record.state>draft&&record.state<legislationSuccess){
      return(
        <Fragment>
          <Tooltip title='项目详情'>
            <a onClick={() => this.openDrawerProjectDetailByIcon(record)}><Icon type="eye" /></a>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title='立项推荐详情'>
            <a onClick={() => this.showProjectRecommendDetail(record)}><Icon type="ordered-list" /></a>
          </Tooltip>
          <Divider type="vertical" />
          {record.state==MandatorTecommend||legislationDefeate? <Tooltip title='强制推荐'>
            <a onClick={() => this.forceRecommendByIcon(record)}><Icon type="exclamation-circle" /></a>
          </Tooltip>:''}

        </Fragment>
      )
    }
    if(record.state>=topicEnd){
      return(
        <Fragment>
          <Tooltip title='项目详情'>
            <a onClick={() => this.openDrawerProjectDetailByIcon(record)}><Icon type="eye" /></a>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title='年度评审结果'>
            <a onClick={() => this.showAnnualReviewDetail(record)}><Icon type="ordered-list" /></a>
          </Tooltip>
          {
            record.state<concludEnd?
             <span> <Divider type="vertical" /><Tooltip title='试点结束'>
              <a onClick={() => this.pilotEnd(record)}><Icon type="check-circle" /></a>
             </Tooltip></span>:''
          }
        </Fragment>
      )
    }
    else{
      return(
        <Fragment>
          <Tooltip title='项目详情'>
            <a onClick={() => this.openDrawerProjectDetailByIcon(record)}><Icon type="eye" /></a>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title='立项推荐详情'>
          <a onClick={() => this.showProjectRecommendDetail(record)}><Icon type="ordered-list" /></a>
          </Tooltip>


        </Fragment>
      )
          }
  };

  onChangeDrawerVisible = (value) => {
    this.setState({
      drawerVisible: value,
    });
  };

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`GetProjectAllInfo/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };

  showProjectRecommendDetailByButton=()=>{
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('每次只能查看一条项目')
      return
    }
    router.push({
      pathname: `/getProjectAllInfo/ProjectRecommendDetail/${selectedRows[0].guideId}/${selectedRows[0].projectId}`,
      query: {prevent: true}
    });
  };

  columns = [{
      title: '项目编号',
      key: 'approvalNo',
      dataIndex: 'approvalNo',
      width: 120,
      render: (record = "") => {
        const data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
        // if (data.length > 14) {
        //   data = data.substring(0, 13);
        //   data = data + "......"
        // }
        return (
          <Popover
            content={record}
            autoAdjustOverflow
            mouseEnterDelay={0.2}
            placement='right'
          >
            <a>{data}</a>
          </Popover>
        )
      },
    },{
    title: '项目名称',
    key: 'projectName',
    dataIndex: 'projectName',
  },{
    title: '项目负责人',
    key: 'prjOwner',
    dataIndex: 'prjOwner',
  },{
    title: '试点单位',
    key: 'pilotUnit',
    dataIndex: 'pilotUnit',
    // render:(text)=>{
    //   let user=[];
    //   let userName='暂无数据';
    //   const {allUser}=this.props.basicdata;
    //   user=allUser.filter(item=>{
    //     return item.id===text
    //   });
    //   if(user.length>0){
    //     userName=user[0].nickname;
    //   }
    //   return(<span>{userName}</span>)
    // }
  },{
    title: '项目状态',
    key: 'state',
    dataIndex: 'state',
    render:(text)=>{
      const { basicdata:{gDictData }} = this.props;
      return(
        utils.getAllDictNameById(gDictData, 'prjState', text)
      )
    }
  }, {
    title: '项目开始时间',
    key: 'prjCreateTime',
    dataIndex: 'prjCreateTime',
  },{
    title: '项目结束时间',
    key: 'prjEndTime',
    dataIndex: 'prjEndTime',
  },{
    title:'操作',
    key:'action',
    render:(text,record)=>this.chooseAction(record),
  }];

  btnList = {
    primaryBtn: [{
      func: this.listPage,
      param: {},
      key: 'REFRESH',
    }],
    patchBtn: [{
      func: this.openDrawerProjectDetailByButtion,
      param: {},
      key: 'SHOW_MORE',
    },{
      func: this.showProjectRecommendDetailByButton,
      param: {},
      key: 'PROJECT_RECOMMEND_DETAIL',
    }],
  };

  searchList = [
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
    {
      title : '项目状态',
      field : 'state',
      message : '项目所处阶段选择有错',
      type : 'other',
      renderComponent : () => {
        const { basicdata:{gDictData }} = this.props;
        const prjState=utils.getDictByType(gDictData,'prjState');
        return (<AdvancedSelect dataSource={prjState} searchType='FUZZYSEARCH' placeholder="项目所处阶段" fieldConfig={SelectFieldConfig.userDetail} onChange={() => {}} />);
      },
    },
  ];

  render() {
    const { GetProjectAllInfo: { projectList,projectPagination } } = this.props;
    const {basicdata:{gDictData}}=this.props;
    const { selectedRows, drawerVisible,} = this.state;
    const { listLoading ,drawerLoading} = this.props;
    const { GetProjectAllInfo:{projectAllInfo}} = this.props;
    const { GetProjectAllInfo: { allGuide, allDep } } = this.props;
    const projectDetailOption = {
      allDep,
      allGuide,
      gDictData,
      drawerLoading,
      projectDetail:projectAllInfo,
      downloadFunction:this.downLoadFile
    };

    const drawerOption = {
      drawerTitle:'项目详情',
      drawerContent : <ProjectDetail {...projectDetailOption} />,
      drawerVisible,
      onChangeDrawerVisible : this.onChangeDrawerVisible,
    };

    return (
      <PageHeaderWrapper title='查看项目详情'>
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.advancedSearch}
          pagination={projectPagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows} />
          <StandardTable
            selectedRows={selectedRows}
            loading={listLoading}
            data={projectList}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.projectId}
          />
        </Card>
        <AdvancedDrawer {...drawerOption} />
        <FooterToolbar>
          <Button type="primary" style={{marginLeft: 8}} onClick={this.handelReturn} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }

}
export default ProjectList;
