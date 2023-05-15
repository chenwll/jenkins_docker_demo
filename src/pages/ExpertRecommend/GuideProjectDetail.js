import React,{PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Card,Drawer,Modal,message,Button} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from '@/components/FooterToolbar';
import ExpertRecommend from './ExpertRecommend';

const {confirm}=Modal;
@connect(({expertRecommend,loading,basicdata,global})=>({
  expertRecommend,
  global,
  loading,
  basicdata,
  projectFetchLoading:loading.effects['expertRecommend/projectFetch'],
  setDistributionLoading:loading.effects['expertRecommend/setDistribution'],
  submitDistributionLoading:loading.effects['expertRecommend/submitDistribution'],
}))

class  GuideProjectDetail extends PureComponent{

  constructor(props){
    super(props);
    this.state={
      drawer:false,
    }
  }

  componentDidMount(){
    this.listPage();
  };

  listPage=()=>{
    const {dispatch}=this.props;
    const {match:{params}}=this.props;
    dispatch({
      type:'expertRecommend/projectFetch',
      payload:{
        guideId:params.guideId,
        currentPage: 1,
        pageSize: 10
      }
    })
  };

  closeDrawer=()=>{
    this.setState({
      drawer:false,
    })
  };

  handleSelectRows = rows => {
    const {dispatch}=this.props;
    dispatch({
      type:'expertRecommend/save',
      payload:{
        ProjectSelectedRows:rows,
      },
    })
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
    };
    dispatch({
      type : 'expertRecommend/fetch',
      payload : params,
    });
  };

  confirmType=(param)=>{
    const {dispatch}=this.props;
    const {match:{params}}=this.props;
    const {expertRecommend:{ProjectSelectedRows}}=this.props;
    if(ProjectSelectedRows.length>1){
      message.warning('当前操作只允许每次操作一个项目')
      return
    }
    return(
      confirm({
        title: param[0],
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type:`expertRecommend/${param[1]}`,
            payload:{
              submitData:{
                projectId:ProjectSelectedRows[0].projectId,
                processId:params.processId,
              },
              projectFetch:{
                guideId: params.guideId,
                processId:params.processId,
              }// 正式提交之后的刷新
            }
          })
        }
      })
    )
  };

  handleEditInfo=()=>{
    const {expertRecommend:{ProjectSelectedRows}}=this.props;
    if(ProjectSelectedRows.length>1){
      message.warning('每次只允许操作一条项目')
      return
    }
    this.setState({
      drawer:true,
    })
  };

  cancel=()=>{
    const {dispatch}=this.props;
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '专家推荐',
      },
    });
    router.push(`/expertApproval/distributionGuide`)
  }

  btnList = {
    primaryBtn : [{
      func : this.listPage,
      param : [],
      key : 'REFRESH',
    }],
    patchBtn : [
      {
        func: this.handleEditInfo,
        param: {},
        key: 'PROJECT_RECOMMEND',
      },
      {
        func : this.confirmType,
        param : ['是否确认正式推荐选中的项目，提交之后将不允许修改','submitDistribution'],
        key : 'PROJECT_SUBMIT',
      },
    ],
  };

  columns = [
    {
      title : '项目序号',
      dataIndex : 'key',
      key : 'key',
      align: 'center',
      render:(text,record,index)=>{
        return(
          <span>{index+1}</span>
        )
      }
    },
    {
      title : '项目名称',
      dataIndex : 'projectName',
      key : 'projectName',
    },
    {
      title : '项目负责人',
      dataIndex : 'prjOwner',
      key : 'prjOwner',
    },
    {
      title : '项目联系人电话',
      dataIndex : 'phone',
      key : 'phone',
    },
  ];

  render(){
    const {match:{params}}=this.props;
    const {basicdata:{gDictData}}=this.props;
    const {projectFetchLoading,setDistributionLoading,submitDistributionLoading}=this.props;
    const {expertRecommend:{ProjectSelectedRows,expertProjectList}}=this.props;
    let {drawer}=this.state

    const drawerOptions={
      gDictData,
      ProjectSelectedRows,
      projectFetchLoading,
      onClose:this.closeDrawer,
      guideId: params.guideId,
      processId:params.processId,
      handleSelectRows:this.handleSelectRows,
    };

    return(
      <PageHeaderWrapper title='专家推荐'>
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={ProjectSelectedRows} />
          <StandardTable
            selectedRows={ProjectSelectedRows}
            loading={projectFetchLoading||setDistributionLoading||submitDistributionLoading}
            data={expertProjectList}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.processId}
          />
        </Card>
        <Drawer
          title='推荐修改'
          placement="right"
          closable
          onClose={this.closeDrawer}
          visible={drawerVisible}
          width={800}
          destroyOnClose
        >
          <ExpertRecommend {...drawerOptions} />
        </Drawer>
        <FooterToolbar style={{ width : '100%' }}>
          <Button type="primary" onClick={this.cancel}>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    )
  }
}
export  default GuideProjectDetail;
