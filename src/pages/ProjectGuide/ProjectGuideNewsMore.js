import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button,
  Layout,
  Row,
  Col,
  message,
  Icon,List
} from 'antd';
import styles from './ProjectGuideList.less';
import { SHOW_PAGE } from '../../utils/Enum';
import Config from '../../../config/api';
import Exception203 from './203';
import {getBrowserAndResolution} from '../../utils/utils'

const {
  Content
} = Layout;
const MenuKey = {
  GUIDE: 'guide',  // 指南
  ANNOUNCEMENTS: 'announcements',  // 通知公告
  REFORM:'reform',  // 改革动态
  OPERATIONGUIDE  :'operationGuide'// 操作指南
};
@connect(({ projectGuideAndNewsModal, loading }) => ({
  projectGuideAndNewsModal,
  loading: loading.models.projectGuideAndNewsModal,
}))
class projectGuideNewsMore extends PureComponent {
  state = {
    copyRight: 'Copyright 2019 西南科技大学',
    copyRight2:'计算机科学与技术学院出品',
    show:true,
    color:'',
    likeStatus:true,
  };

  componentWillMount() {
    const {availWidth,availHeight} = screen;
    if(availWidth < 1024 || availHeight < 600){
      this.setState({
        show:false,
      })
    }
    getBrowserAndResolution();
  }

  componentDidMount(){
    const {match:{params}}=this.props;
    const { dispatch } = this.props;
    switch (params.type) {
      case MenuKey.GUIDE:
        dispatch({
          type: 'projectGuideAndNewsModal/getGuideDetail',
          payload: { guideId: params.id },
        });
        break;
      case MenuKey.ANNOUNCEMENTS:
      case MenuKey.REFORM:
        dispatch({
          type:'projectGuideAndNewsModal/getNewsDetail',
          payload:{
            newsId:params.id
          }
        });
        break;
      default:
        break;
    }

  }

  showLogin = () => {
    router.push('/');
  };

  showRegister = () => {
    router.push('/user/register');
  };

  returnFacePage = () => {
    const {match:{params}}=this.props;
    const page = parseInt(params.page)
    switch (page) {
      case SHOW_PAGE.INDEX:
      router.push(`/index`);
      break;
      case SHOW_PAGE.LIST:
      router.push(`/projectGuideNewsDetail/${params.type}`);
      break;
      default:
        break;
    }

  };

  getLikeFun =()=>{
    const {match:{params}}=this.props;
    const { dispatch } = this.props;
    const {likeStatus} = this.state;
    this.setState({
      color:"red",
      likeStatus:false,
    });
    if(likeStatus){
      switch (params.type) {
        case MenuKey.GUIDE:
          dispatch({
            type: 'projectGuideAndNewsModal/getLikeGudieNum',
            payload: { guideId: params.id ,praise:true},
          });
          break;
        case MenuKey.ANNOUNCEMENTS:
        case MenuKey.REFORM:
          dispatch({
            type: 'projectGuideAndNewsModal/getLikeNewsNum',
            payload: { newsId: params.id ,praise:true},
          });
          break;
        default:
          break;
      }
    }else {
      message.warning('该新闻已赞！');
    }

  }

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    console.log(data.fileMd5);
    dispatch({
      type:`projectGuideAndNewsModal/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };
  render() {
    const {projectGuideAndNewsModal: {detail,newsDetail}} = this.props;
    const { copyRight,show,copyRight2 ,color} = this.state;
    const {match:{params}}=this.props;
    let data;
    switch (params.type) {
      case MenuKey.GUIDE:
       data=detail;
        break;
      case MenuKey.ANNOUNCEMENTS:
      case MenuKey.REFORM:
        data=newsDetail;
        break;
      default:
        break;
    }
    return show?(
      <div className={styles.frame}>
        <header className={styles.head_nav_met_27_1_41}>
          <div className={styles.container}>
            <div className={styles.top_header}>
              <div className={styles.logo_box}>
                <a>
                  <div className={styles.vertical_align_middle}>四川省教育综合改革试点项目管理系统</div>
                </a>
              </div>
              <div className={styles.MenuItemnotice}><span>操作指南</span></div>
              <div className={styles.login}>
                <Button type="link" onClick={this.showLogin}>登录</Button>
                <span className={styles.login_span}>/</span>
                <Button type="link" onClick={this.showRegister}>注册</Button>
              </div>
            </div>
          </div>
        </header>
        <Row className={styles.projectGuideDetail}>
          <Col span={24} className={styles.col_pad}>
            <div className={styles.met_index_news}>
              <div className={styles.details_title}>
                <div className={styles.details_news_title}>
                  <h1>{data.guideName||data.newsName}</h1>
                  <div className={styles.details_back}><Button type="primary" onClick={this.returnFacePage}>返回</Button></div>
                </div>
                <div style={{'fontSize': '20px'}}>
                  <span>{data.createTime}</span>
                  <span style={{padding: '20px'}}>浏览量：{data.num}</span>
                  <span>点赞量：{data.pointRatio}</span>
                  <span><Icon onClick={this.getLikeFun} type="like" style={{'fontSize':"20px",paddingLeft: '20px', color}} /></span>
                </div>
              </div>

              <Content className={styles.Content}>
                <div dangerouslySetInnerHTML={{__html: data.context|| data.newsContext || '暂无说明'}} />
              </Content>
            </div>
          </Col>
        </Row>
        {
          params.type===MenuKey.GUIDE?<Row className={styles.projectGuideDetail} style={{background: 'white', padding: '26px',}}>
            <Col span={24} style={{ padding: '10px',textAlign: 'left',borderBottom: '1px solid #eeeeee'}}><h1>附件</h1></Col>
            <Col span={24}> {
              <List
                style={{border:'0'}}
                itemLayout="horizontal"
                bordered
                dataSource={detail.attFiles? detail.attFiles:[]}
                rowKey={record=>record.id}
                renderItem={(item,index) => {
                  return(
                    <div style={{display:'flex',paddingTop: '20px'}}>
                      <div style={{width:'40%',display:'flex'}}>{item.fileName}</div>
                      <div style={{width:'60%',display:'flex'}}><a onClick={()=>{this.downLoadFile(item)}}>下载</a></div>
                    </div>

                  )
                }}
              />
            }</Col>
          </Row>:''
        }
        <div className={styles.Left_footer}>
          <div className={styles.footer}>
            <span className={styles.copyRight}>{copyRight}</span>
            <span className={styles.copyRight}>{copyRight2}</span>
            <span className={styles.copyRight}>{Config.VERSIONS}</span>
          </div>
        </div>
      </div>
    ):(<Exception203 />)
  }
}
export default projectGuideNewsMore;
