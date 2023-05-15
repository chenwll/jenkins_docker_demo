import React, { PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import Moment from 'moment';
import {
  Card,
  Row,
  Form,Col,Icon
} from 'antd';
import styles from './index.less';
import { ACCOUNT_PRIVILEGES,GUIDE_STAGE } from '../../utils/Enum';

@Form.create()
@connect(({ DashBoardModel, loading, basicdata }) => ({
  DashBoardModel,
  basicdata,
  loading,
  FetchLoading: loading.effects['DashBoardModel/getAllGuideList'],
  getStatisLoading: loading.effects['DashBoardModel/getStatis'],
}))

class DashBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    // const authority=JSON.parse(sessionStorage.getItem('antd-pro-authority'));
    // switch (authority[0]) {
    //   case ACCOUNT_PRIVILEGES.Admin:
    //     this.getGuide();
    //     this.getNews();
    //     this.getStaticsGuide();
    //     break;
    //   case ACCOUNT_PRIVILEGES.Declarant:
    //     this.getDeclareGuide();
    //     this.getDeclarePrj();
    //     break;
    //   case ACCOUNT_PRIVILEGES.Area_County:
    //     this.getSchool();
    //     this.getReguser();
    //     this.getRegstaticsGuide();
    //     break;
    //   case ACCOUNT_PRIVILEGES.Axpert:
    //     this.getScore();
    //     break;
    //   case ACCOUNT_PRIVILEGES.Education_Office:
    //     this.getSchool();
    //     this.getExpStaticsGuide();
    //     break;
    //   default:
    //     break;
    // }

  };

  getGuide = ()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getAllGuideList',
    })
  }

  getNews=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getAllNews',
    })
  }

  getStaticsGuide=()=>{
    const date=new Date().getFullYear();
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getStaticsGuide',
      payload:{
        guideStage: GUIDE_STAGE.DECLARE,
      }
    })
    dispatch({
      type:'DashBoardModel/getStaticsGuide',
      payload:{
        guideStage:GUIDE_STAGE.TOPIC,
      }
    })
    dispatch({
      type:'DashBoardModel/getStaticsGuide',
      payload:{
        guideStage:GUIDE_STAGE.CONCLUDE,
        currentPage:1,
        pageSize:10,
        reviewYear:date,
        stateBegin:9,
        stateEnd:9,
      }
    })
  }

  getExpStaticsGuide=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getStaticsGuide',
      payload:{
        guideStage:GUIDE_STAGE.TOPIC,
      }
    })
  }

  getRegstaticsGuide=()=>{
    const date=new Date().getFullYear();
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getRegstaticsGuide',
      payload:{
        guideStage: GUIDE_STAGE.DECLARE,
      }
    })
    dispatch({
      type:'DashBoardModel/getRegstaticsGuide',
      payload:{
        guideStage:GUIDE_STAGE.TOPIC,
      }
    })
    dispatch({
      type:'DashBoardModel/getRegstaticsGuide',
      payload:{
        guideStage:GUIDE_STAGE.CONCLUDE,
        currentPage:1,
        pageSize:10,
        reviewYear:date,
        stateBegin:9,
        stateEnd:9,
      }
    })
  }

  getScore=()=>{
    const date=new Date().getFullYear();
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getScore',
      payload:{
        guideStage:GUIDE_STAGE.TOPIC,
      }
    })
    dispatch({
      type:'DashBoardModel/getScore',
      payload:{
        guideStage:GUIDE_STAGE.CONCLUDE,
        reviewYear:date,
      }
    })
  }


  getDeclareGuide=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getDeclareGuide',
      payload:{
        state:3
      }
    })
  };

  getDeclarePrj=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getDeclarePrj',
    })
  }

  getSchool=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getSchool',
    })
  }

  getReguser=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'DashBoardModel/getReguser',
    })
  }

  goPage=(data)=>{
    router.push(`${data}`);
  }

  render() {
    const {DashBoardModel:{reguserData,schoolData,allGuides,allNews,ExpTopicGuide,ExpConcludeGuide,DeclareGuide,TopicGuide,ConcludeGuide,RegDeclareGuide,RegTopicGuide,RegConcludeGuide,allDeclareGuide,getDeclarePrj}}=this.props
    const authority=JSON.parse(sessionStorage.getItem('antd-pro-authority'));
    let data=[];
    switch (authority[0]) {
      case ACCOUNT_PRIVILEGES.Admin:
        data=[
          {
          title:'申报指南管理',
          router:'/Guide/GuideList',
          num:allGuides.length,
          icon:'setting'
        },{
          title:'项目总览',
          router:'/getProjectAllInfo/GuideList',
          num:allGuides.length,
          icon:'reconciliation'
        },{
          title:'项目直通车',
          router:'/EduMangeProjects/GuideList',
          num:allGuides.length,
          icon:'car'
        },{
          title:'新闻公告',
          router:'/News/NewsSetting',
          num:allNews.length,
          icon:'message'
        },{
          title:'指南流程',
          router:'/GuideFlows/GuideSetList',
          num:allGuides.length,
          icon:'container'
        },{
          title:'申报阶段评审',
          router:'/projectEducation/edu/declaration',
          num:DeclareGuide,
          icon:'snippets'
        },{
          title:'立项阶段评审',
          router:'/projectEducation/edu/topic',
          num:TopicGuide,
          icon:'copy'
        },{
          title:'结项阶段评审',
          router:'/projectEducation/edu/conclude',
          num:ConcludeGuide,
          icon:'fund'
        }];
        break;
      case ACCOUNT_PRIVILEGES.Declarant:
        data=[
          {
          title:'申报指南列表',
          router:'/PersonalProject/GuideList',
          num:allDeclareGuide,
          icon:'snippets'
        },{
          title:'我的项目',
          router:'/PersonalProject/MyProject',
          num:getDeclarePrj.length,
          icon:'container'
        }];
        break;
      case ACCOUNT_PRIVILEGES.Area_County:
        data=[
          {
          title:'用户审核',
          router:'/AreaDepartmentSetting/list-origin',
          num:reguserData,
          icon:'container'
        },{
          title:'申报阶段评审',
          router:'/AreaDepartmentSetting/regProjectApproval/declaration',
          num:RegDeclareGuide,
          icon:'snippets'
        },{
          title:'立项阶段评审',
          router:'/AreaDepartmentSetting/regProjectApproval/topic',
          num:RegTopicGuide,
          icon:'copy'
        },{
          title:'结项阶段评审',
          router:'/AreaDepartmentSetting/regProjectApproval/conclude',
          num:RegConcludeGuide,
          icon:'fund'
        },{
          title:'学校管理',
          router:'/basicSetting/schoolmanagement',
          num:schoolData.length,
          icon:'reconciliation'
        }];
        break;
      case ACCOUNT_PRIVILEGES.Axpert:
        data=[
          {
            title:'立项专家评分',
            router:'/expertApproval/declaration/distributionScore',
            num:ExpTopicGuide,
            icon:'snippets'
          },{
            title:'结项专家评分',
            router:'/expertApproval/projectApproval/concludeDistributionScore',
            num:ExpConcludeGuide,
            icon:'fund'
          }
        ]
        break;
      case ACCOUNT_PRIVILEGES.Education_Office:
        data=[
          {
            title:'立项评审',
            router:'/educationDepartmentSetting/guideList',
            num:TopicGuide,
            icon:'snippets'
          },{
            title:'学校管理',
            router:'/basicSetting/schoolmanagement',
            num:schoolData.length,
            icon:'fund'
          }
        ]
        break;
      default:
        break;
    }
    return (
      <div className={styles.content}>
        {
          data.map((item,i)=>(
            <Card className={styles.Card} key={i} onClick={this.goPage.bind(this,item.router)}>
              <Row className={styles.Row}>
                <Col span={8} className={styles.ColIcon}>
                  <Icon className={styles.Icon} type={item.icon} theme="twoTone" />
                </Col>
                <Col span={16}>
                  <div className={styles.text}><span>{item.title}</span></div>
                  <div className={styles.text}><span>数量：</span><span>{item.num}</span></div>
                </Col>

              </Row>
            </Card>
            ))
        }

      </div>
    );
  }
}
export default DashBoard;
