import React, { PureComponent } from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import { Card, Divider, message, Modal,Dropdown,Menu,Button,Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import * as utils from '../../utils/utils';
import { RECOMMEND_TYPE,PROJECT_PROCESS_TYPE, RECOMMEND_STATE,SCORE_RECOMMEND,PROJECT_IMPLEMENTATION_PLAN,RECOMMEND_SCORE } from '../../utils/Enum';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import ProjectDetail from '../../components/ProjectDetail';

const { confirm } = Modal;
@connect(({expertRecommend,loading,basicdata})=>({
  expertRecommend,
  loading,
  basicdata,
  GuideFetchLoading:loading.effects['expertRecommend/guideFetch'],
  drawerLoading:loading.effects['expertRecommend/getProjectDetail']
}))


class  ExpertRecommend extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      drawerVisible : false,
      type: 0, // 0打分， 1推荐
      selectedRows: [],
    }
  }

  componentDidMount(){
    const { match: { url }, dispatch } = this.props;
    if(url&&url.search(/Score/)!==-1) {
      this.setState({
        type: 1,
      },()=>this.listPage())
    } else{
      this.listPage();
    }
    dispatch({
      type: 'expertRecommend/getAllDepart',
    });
    dispatch({
      type: 'expertRecommend/getAllGuide',
    });

  };

  listPage=(params)=>{
    const {dispatch,expertRecommend:{GuidePagination}}=this.props;
    const {type} = this.state;
    let url = 'guideFetchRecommend';
    if(type) {
      url = 'guideFetch'
    }
    GuidePagination.currentPage===0?GuidePagination.currentPage=1:GuidePagination.currentPage;
    const isParamsUndefined = Object.keys(params || {});
    dispatch({
      type:`expertRecommend/${url}`,
      payload:{
        data:isParamsUndefined.length !== 0 ? {...params,guideStage:2 }: {  ...GuidePagination,
          guideStage: 2},
        type:'topic'
      }
    })

  };

  handleSelectRows = rows => {
    const {dispatch}=this.props;
    this.setState({
      selectedRows: rows,
    });
    dispatch({
      type:'expertRecommend/save',
      payload:{
        GuideSelectedRows:rows,
      },
    })
  };

  handleStandardTableChange = (pagination) => {
    const params = {
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
    };
   this.listPage(params)
  };

  //  点击评分或推荐的回调
  handleChooseGuide=(record)=>{
   const {dispatch} = this.props;
    const {type} = this.state;
    const {expertRecommend:{GuideSelectedRows}}=this.props;
    if(GuideSelectedRows.length>1){
      message.warning('每次只允许修改一条指南的内容');
      return
    }
    if(type) {
      dispatch({
        type:'expertRecommend/getProjectDetail',
        payload:{
          projectId:record.projectId,
        }
      });
      dispatch({
        type:'expertRecommend/getAllDepart'
      });
      dispatch({
        type: 'expertRecommend/getAllGuide',
      });
      router.push(`/expertApproval/declaration/step1/0/${record.projectId}/${record.scoreId}/${record.reviewYear}/${record.processId}/${RECOMMEND_TYPE.TOPIC}`);
      // dispatch({
      //   type: 'global/closeCurrentTab',
      //   payload: {
      //     tabName: '立项专家项目评分',
      //   },
      // });
      // 专家评分
      // router.push({
      //   pathname: `/expertApproval/declaration/rule/0/${record.projectId}/${record.scoreId}/${record.reviewYear}/${record.processId}`,
      //   query: {prevent: true}
      // });
    } else {
      // 专家推荐
      router.push({
        pathname: `/expertApproval/exp/guideProjects/${record.processId}/${record.guideId}/${PROJECT_PROCESS_TYPE.EXPERT_APPROVAL}/${record.reviewYear}`,
        query: {prevent: true}
      });
    }
  };

  // 提交评分
  handleSubmit =(record)=>{
    const {dispatch,expertRecommend:{GuidePagination}}  =this.props;
    confirm({
      title : `确认提交吗？提交后将不能修改！`,
      okText : '确定',
      cancelText : '取消',
      onOk : () => {
        dispatch({
          type : 'expertRecommend/submitScore',
          payload : {
            data:{scoreId : record.scoreId,
              type:RECOMMEND_SCORE.SCORE,},
            reviewYear:record.reviewYear,
            type:'topic',
            page:GuidePagination
          },
        });
      },
    });
  };

  // 推荐状态改变的回调
  recommendChange =(record,value)=>{
    const {dispatch,expertRecommend:{GuidePagination}} = this.props;
    if(record.saveState!==0){
      dispatch({
        type:'expertRecommend/editGrade',
        payload:{
          data:{scoreId:record.scoreId,
          type:SCORE_RECOMMEND.SCORE,
          grade:value.key,
          reviewYear:record.reviewYear,
          projectId:record.projectId,
          processId:record.processId,},
          type:'topic',
          page:GuidePagination
        }
      })
    }else{
      message.error("请先评分！")
    }
  };

  // 批量提交评分
  handleMuchSubmit=()=>{
    const {selectedRows} = this.state;
    const {dispatch,expertRecommend:{GuidePagination}}  = this.props;
    for(const item of selectedRows){
      if(String(item.saveState) !== PROJECT_IMPLEMENTATION_PLAN.SAVE){
        message.error('不能批量提交，因为选择项目中存在评价状态不为保存的项目!');
        return;
      }
    }
    const scoreDetailData = [];
    selectedRows.map(item => {
      scoreDetailData.push({scoreId : item.scoreId,projectName : item.projectName,projectNo : item.approvalNo});
      return scoreDetailData;
    });
    const PrjScoreRecords = {scoreRecords:scoreDetailData};
    confirm({
      title : `确认批量提交吗？提交后将不能修改！`,
      okText : '确定',
      cancelText : '取消',
      onOk : () => {
        dispatch({
          type:'expertRecommend/muchSubmitScore',
          payload:{
            data:{...PrjScoreRecords},
            type:'topic',
            page:GuidePagination
          }
        })
      },
    });

  };


  btnList = {
    primaryBtn : [{
      func : this.listPage,
      // param : {},
      key : 'REFRESH',
    }],
    patchBtn: [{
      func: this.handleMuchSubmit,
      param: {},
      key: 'MUCH_SUBMIT',
    }]
  };

  columns = [
    {
      title : '项目序号',
      dataIndex : 'key',
      key : 'key',
      align: 'center',
      render:(text,record,index)=><span>{index+1}</span>
    },
    {
      title : '项目名称',
      dataIndex : 'projectName',
      key : 'projectName',
    },
    {
      title : '推荐状态',
      dataIndex : 'scoreGrade',
      key : 'scoreGrade',
      filters: [
        {
          text: '不推荐',
          value: '0',
        },
        {
          text: '推荐',
          value: '1',
        },
      ],
      onFilter: (value, record) => record.scoreGrade === Number(value),
      render: (text,record) => {
        const {basicdata:{gDictData}}=this.props;
        const recommendOrNot = utils.getAllDictNameById(gDictData,'scoreGrade',String(record.scoreGrade));
        const menu=(
          <Menu onClick={(value)=>this.recommendChange(record,value)}>
            <Menu.Item key="0">不推荐</Menu.Item>
            <Menu.Item key="1">推荐</Menu.Item>
          </Menu>
        );
        const colorStyle=Boolean(record.scoreGrade)?{}:{color:'red'};
        return (
          <Dropdown overlay={menu}>
            <Button style={{width:"100px",...colorStyle}}>
              {recommendOrNot}<Icon type="down" />
            </Button>
          </Dropdown>
        )
      },
    },
    {
      title:'评价状态',
      dataIndex:'saveState',
      key:'saveState',
      render : (v) => utils.getDictNameById(RECOMMEND_STATE, v) || '未保存',
    },
    {
      title : '分数',
      dataIndex : 'score',
      key : 'score',
    },
    {
      title : '操作',
      dataIndex : 'action',
      key : 'action',
      render:(text,record)=>{
        const {type} = this.state;
        return (
          <span>
            <a onClick={()=>this.handleChooseGuide(record)}>{type?'评分':'推荐'}</a>
            <Divider type="vertical" />
            <a onClick={()=>this.handleLook(record)}>项目详情</a>
            <Divider type="vertical" />
            {
              String(record.saveState) != RECOMMEND_STATE[0].k &&
              <a onClick={()=>this.handleSubmit(record)}>提交评分</a>
            }
          </span>
        )
      }
    },
  ];

  onCloseDrawer = () => {
    this.setState({
      drawerVisible : false,
    });
    this.listPage();
  };

  handleLook = (value) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'expertRecommend/getProjectDetail',
      payload: {
        projectId: value.projectId,
        // reviewYear:value.reviewYear,
      }
    });
    this.setState({
      drawerVisible: true,
    })
  };

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`expertRecommend/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };

  render(){
    const {
      GuideFetchLoading,
      drawerLoading,
      basicdata: { gDictData }
    }=this.props;
    const {expertRecommend:{GuideSelectedRows, departList, guideList, detail,ExpertGuideList}}=this.props;
    const { drawerVisible } = this.state;
    const contentOptions = {
      allDep:departList,
      allGuide:guideList,
      gDictData,
      projectDetail:detail,
      drawerLoading,
      downloadFunction:this.downLoadFile,
    };
    const projectDetailProps = {
      drawerTitle: '项目详情',
      drawerContent: <ProjectDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible: this.onCloseDrawer,
    };
    return(
      <PageHeaderWrapper title="立项专家项目评分">
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={GuideSelectedRows} />
          <StandardTable
            selectedRows={GuideSelectedRows}
            loading={GuideFetchLoading}
            data={ExpertGuideList}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.projectId}
            // rowSelection={{type: 'radio'}}
            onRow={(record) => ({
              onDoubleClick: () => {
                this.handleLook(record)
              }
            })}
          />
        </Card>
        <AdvancedDrawer {...projectDetailProps} />
      </PageHeaderWrapper>
    )
  }
}
export  default ExpertRecommend;
