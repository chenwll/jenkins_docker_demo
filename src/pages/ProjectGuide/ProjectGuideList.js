import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button,
  Row,
  Col,
  List,
  Icon,
  Carousel,Popover
} from 'antd';
import styles from './ProjectGuideList.less';
import { INDEX_NEWSTYPE,NEWS_STATE ,SHOW_PAGE } from '../../utils/Enum';
import img2 from  '../../../public/img/banner2.jpg';
import Config from '../../../config/api';
import Exception203 from './203';
import remoteLinkAddress from '../../utils/ip';
import {getBrowserAndResolution} from '../../utils/utils'

// const {
//   Header, Content,Footer
// } = Layout;
const MenuKey = {
  GUIDE: 'guide',  // 指南
  ANNOUNCEMENTS: 'announcements',  // 通知公告
  REFORM:'reform',  // 改革动态
  OPERATIONGUIDE  :'operationGuide'// 操作指南
};
@connect(({ projectGuideAndNewsModal, loading }) => ({
  projectGuideAndNewsModal,
  loading: loading.models.projectGuideAndNewsModal,
  listLoading: loading.effects["projectGuideAndNewsModal/getGuideList"],
  announcementsLoading: loading.effects["projectGuideAndNewsModal/getNewsList"],
  reformLoading: loading.effects["projectGuideAndNewsModal/getNewsList"],
}))
class projectGuideList extends PureComponent {
  state = {
    copyRight: 'Copyright 2019 西南科技大学',
    copyRight2:'计算机科学与技术学院出品',
    show:true,
    // listPage:1,  // 项目指南总页数
    announcementsPage:1,  // 通知公告总页数
    reformPage:1,          // 改革动态总页数
    pageSize:5,
    listHidden:"none",
    listNext:"block",
    announcementsHidden:"none",
    announcementsNext:"block",
    reformNext:"block",
    reformHidden:"none"

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

  componentDidMount() {
    this.getImg();
    this.getGuideList();
    this.getNews(INDEX_NEWSTYPE.ANNOUNCEMENTS);
    this.getNews(INDEX_NEWSTYPE.REFORM);
  }


  getNews=(type)=>{
    const {dispatch}=this.props;
    const {announcementsPage,pageSize,reformPage}=this.state;
    switch (type) {
      case INDEX_NEWSTYPE.ANNOUNCEMENTS:
        dispatch({
          type:"projectGuideAndNewsModal/getNewsList",
          payload:{
            currentPage:announcementsPage,
            pageSize,
            newsType:type,
            newsState:NEWS_STATE.RELEASE,
          }
        });
        break;
      case INDEX_NEWSTYPE.REFORM:
        dispatch({
          type:"projectGuideAndNewsModal/getNewsList",
          payload:{
            currentPage:reformPage,
            pageSize,
            newsType:type,
            newsState:NEWS_STATE.RELEASE,
          }
        });
        break;
      default:
        break;
    }

  };

  getGuideList = () => {
    const { dispatch } = this.props;
    const {pageSize}=this.state;
    dispatch({
      type: 'projectGuideAndNewsModal/getGuideList',
      payload:{
        currentPage:1,
        pageSize,
      }
    });
  };

  showLogin = () => {
    router.push('/');
  };

  showRegister = () => {
    router.push('/user/register');
  };

  showDetail = (id,type) => {
    router.push(`/projectGuideNewsMore/${id}/${type}/${SHOW_PAGE.INDEX}`);
  };

  getImg = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'projectGuideAndNewsModal/getImg',
    });
  };

  listNextPage=(page)=>{
    if(page.currentPage===1){
      this.setState({
        listHidden:"block"
      })
    }
    if(page.currentPage===page.total-1){
      this.setState({
        listNext:"none"
      })
    }
    const { dispatch } = this.props;
    const {pageSize}=this.state;
    dispatch({
      type: 'projectGuideAndNewsModal/getGuideList',
      payload:{
        currentPage:page.currentPage+1,
        pageSize,
      }
    });
  }

  listPreviousPage=(page)=>{
    if(page.currentPage===page.total){
      this.setState({
        listNext:"block"
      })
    }
    if(page.currentPage===2){
      this.setState({
        listHidden:"none"
      })
    }
    const { dispatch } = this.props;
    const {pageSize}=this.state;
    dispatch({
      type: 'projectGuideAndNewsModal/getGuideList',
      payload:{
        currentPage:page.currentPage-1,
        pageSize,
      }
    });
  }

  announcementsNextPage=(page,type)=>{
    if(page.currentPage===1){
      this.setState({
        announcementsHidden:"block"
      })
    }
    if(page.currentPage===page.total-1){
      this.setState({
        announcementsNext:"none"
      })
    }
    const { dispatch } = this.props;
    const {pageSize}=this.state;
    dispatch({
      type:"projectGuideAndNewsModal/getNewsList",
      payload:{
        currentPage:page.currentPage+1,
        pageSize,
        newsType:type,
        newsState:NEWS_STATE.RELEASE,
      }
    });
  }

  announcementsPreviousPage=(page,type)=>{
    if(page.currentPage===page.total){
      this.setState({
        announcementsNext:"block"
      })
    }
    if(page.currentPage===2){
      this.setState({
        announcementsHidden:"none"
      })
    }
    const { dispatch } = this.props;
    const {pageSize}=this.state;
    dispatch({
      type:"projectGuideAndNewsModal/getNewsList",
      payload:{
        currentPage:page.currentPage-1,
        pageSize,
        newsType:type,
        newsState:NEWS_STATE.RELEASE,
      }
    });
  }

  reformNextPage=(page,type)=>{
    if(page.currentPage===1){
      this.setState({
        reformHidden:"block"
      })
    }
    if(page.currentPage===page.total-1){
      console.log(5645)
      this.setState({
        reformNext:"none"
      })
    }
    const {dispatch}=this.props;
    const {pageSize}=this.state;
    dispatch({
      type:"projectGuideAndNewsModal/getNewsList",
      payload:{
        currentPage:page.currentPage+1,
        pageSize,
        newsType:type,
        newsState:NEWS_STATE.RELEASE,
      }
    });
  }

  reformPreviousPage=(page,type)=>{
    if(page.currentPage===page.total){
      this.setState({
        reformNext:"block"
      })
    }
    if(page.currentPage===2){
      this.setState({
        reformHidden:"none"
      })
    }
    const {dispatch}=this.props;
    const {pageSize}=this.state;
    dispatch({
      type:"projectGuideAndNewsModal/getNewsList",
      payload:{
        currentPage:page.currentPage-1,
        pageSize,
        newsType:type,
        newsState:NEWS_STATE.RELEASE,
      }
    });
  }

  showList=(type)=>{
    router.push(`/projectGuideNewsDetail/${type}`);
  }

  getOperateGuide =()=>{
    window.open("http://47.112.24.176:10010")
  }

  getTitle=(title)=>{
    let data =title.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
      if (data.length > 14) {
      data = data.substring(0, 13)
      data += "......"
    }
      return (
      <Popover content={title} autoAdjustOverflow mouseEnterDelay={0.2} placement='right'>
        <a className={styles.title}>{data}</a>
      </Popover>
      )
  }

  render(){
    const {projectGuideAndNewsModal:{announcements,reform}}=this.props;
    const {projectGuideAndNewsModal: { data: { list,pagination},img }, listLoading,announcementsLoading, reformLoading} = this.props;
    const { copyRight,show,copyRight2,listHidden ,listNext,announcementsHidden,announcementsNext,reformNext,reformHidden} = this.state;
    const url = remoteLinkAddress();
    let listPage;
    let announcementsPage;
    let reformPage;
    let announcementsPages;
    let reformPages;
    if(pagination){
      listPage=pagination.total;
    }
    if(announcements){
      if(announcements.pagination){
        announcementsPages=announcements.pagination
        announcementsPage=announcements.pagination.total;
      }
    }
    if(reform){
      if(reform.pagination){
        reformPages=reform.pagination;
        reformPage = reform.pagination.total;
      }
    }
    const TabContext = (e) => {
      switch (e.title) {
        // 项目指南
        case MenuKey.GUIDE:
          return (
            <div className={styles.list}>
              <Row className={styles.list_detial}>
                <List
                  className={styles.List}
                  itemLayout="horizontal"
                  loading={listLoading}
                  dataSource={list}
                  renderItem={(item) =>(
                    <List.Item onClick={this.showDetail.bind(this,item.guideId,MenuKey.GUIDE)}>
                      <List.Item.Meta
                        className={styles.ListItemDiv}
                        style={{"width":"50%","textOverflow": "ellipsis",
                          "whiteSpace":"nowrap",
                          'overflow': 'hidden',
                          'display': 'block',textAlign:'left'}}
                        // title={<div className={styles.title}>{item.guideName}</div>}
                        title={this.getTitle(item.guideName)}
                      />
                      <Row className={styles.ListItemDiv} span={8}>
                        <Col span={24}>
                          <div>{item.createTime}</div>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </Row>
            </div>
          );
        // 通知公告
        case MenuKey.ANNOUNCEMENTS:
          return (
            <div className={styles.list}>
              <Row className={styles.list_detial}>
                <List
                  className={styles.List}
                  itemLayout="horizontal"
                  loading={announcementsLoading}
                  dataSource={announcements.list===undefined?[]:announcements.list}
                  renderItem={(item) => (
                    <List.Item onClick={this.showDetail.bind(this,item.newsId,MenuKey.ANNOUNCEMENTS)}>
                      <List.Item.Meta
                        style={{"width":"60%","textOverflow": "ellipsis",
                          "whiteSpace":"nowrap",
                          'overflow': 'hidden',
                          'display': 'block'}}
                        className={styles.ListItemDiv}
                        // title={<div className={styles.title}>{item.newsName}</div>}
                        title={this.getTitle(item.newsName)}
                      />
                      <Row className={styles.ListItemDiv} span={8}>
                        <Col span={24}>
                          <div>{item.createTime}</div>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </Row>
            </div>
          );
        // 改革动态
        case MenuKey.REFORM:
          return(
            <div className={styles.list}>
              <Row className={styles.list_detial}>
                <List
                  className={styles.List}
                  itemLayout="horizontal"
                  loading={reformLoading}
                  dataSource={reform.list===undefined?[]:reform.list}
                  renderItem={(item) =>(
                    <List.Item onClick={this.showDetail.bind(this,item.newsId,MenuKey.REFORM)}>
                      <List.Item.Meta
                        style={{"width":"60%","textOverflow": "ellipsis",
                          "whiteSpace":"nowrap",
                          'overflow': 'hidden',
                          'display': 'block'}}
                        className={styles.ListItemDiv}
                        // title={<div className={styles.title}>{item.newsName}</div>}
                        title={this.getTitle(item.newsName)}
                      />
                      <Row className={styles.ListItemDiv} span={8}>
                        <Col span={24}>
                          <div>{item.createTime}</div>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </Row>
            </div>
          )
        default :
          break;
      }
    };
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
              <div className={styles.MenuItemnotice} onClick={this.getOperateGuide}><span>操作指南</span></div>
              <div className={styles.login}>
                <Button type="link" onClick={this.showLogin}>登录</Button>
                <span className={styles.login_span}>/</span>
                <Button type="link" onClick={this.showRegister}>注册</Button>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.banner}>
          <Carousel autoplay>
            {img.length!==0?img.map((e,i)=> (
              <div className={styles.slick_slide} key={i}>
                <img src={url+e.image} alt="" />
              </div>
            )):<div className={styles.slick_slide}>
              <img src={img2} alt="" />
            </div>}
          </Carousel>
        </div>
        <Row className={styles.notice_list_met}>
          <Col span={8} className={styles.col_pad}>
            <div className={styles.met_index_news}>
              <div className={styles.newTitle}>
                <h2 className={styles.news_h}>项目指南</h2>
                <h2 className={styles.news_h} style={{"float":"right","fontSize":"40px",cursor: 'pointer'}} onClick={this.showList.bind(this,MenuKey.GUIDE)}><Icon type="ellipsis" /></h2>
              </div>
              <ul>
                <TabContext title={MenuKey.GUIDE} />
              </ul>
              <div className={styles.newsButton}>
                {listPage <=1?'':
                  <Fragment>
                    <div className={styles.previousPage}><Icon type="left" style={{"display":listHidden}} onClick={()=>this.listPreviousPage(pagination)} /></div>
                    <div className={styles.nextPage}><Icon type="right" style={{"display":listNext}} onClick={()=>this.listNextPage(pagination)} /></div>
                  </Fragment>
                }
              </div>
            </div>
          </Col>
          <Col span={8} className={styles.col_pad}>
            <div className={styles.met_index_news}>
              <div className={styles.newTitle}>
                <h2 className={styles.news_h}>通知公告</h2>
                <h2 className={styles.news_h} style={{"float":"right","fontSize":"40px",cursor: 'pointer'}} onClick={this.showList.bind(this,MenuKey.ANNOUNCEMENTS)}><Icon type="ellipsis" /></h2>
              </div>
              <ul>
                <TabContext title={MenuKey.ANNOUNCEMENTS} />
              </ul>
              <div className={styles.newsButton}>
                {announcementsPage<=1?'':
                  <Fragment>
                    <div className={styles.previousPage}><Icon type="left" style={{"display":announcementsHidden}} onClick={()=>this.announcementsPreviousPage(announcementsPages,INDEX_NEWSTYPE.ANNOUNCEMENTS)} /></div>
                    <div className={styles.nextPage}><Icon type="right" style={{"display":announcementsNext}} onClick={()=>this.announcementsNextPage(announcementsPages,INDEX_NEWSTYPE.ANNOUNCEMENTS)} /></div>
                  </Fragment>
                }
              </div>
            </div>
          </Col>
          <Col span={8} className={styles.col_pad}>
            <div className={styles.met_index_news}>
              <div className={styles.newTitle}>
                <h2 className={styles.news_h}>改革动态</h2>
                <h2 className={styles.news_h} style={{"float":"right","fontSize":"40px",cursor: 'pointer'}} onClick={this.showList.bind(this,MenuKey.REFORM)}><Icon type="ellipsis" /></h2>
              </div>
              <ul>
                <TabContext title={MenuKey.REFORM} />
              </ul>
              <div className={styles.newsButton}>
                {reformPage<=1?'':
                  <Fragment>
                    <div className={styles.previousPage}><Icon type="left" style={{"display":reformHidden}} onClick={()=>this.reformPreviousPage(reformPages,INDEX_NEWSTYPE.REFORM)} /></div>
                    <div className={styles.nextPage}><Icon type="right" style={{"display":reformNext}} onClick={()=>this.reformNextPage(reformPages,INDEX_NEWSTYPE.REFORM)} /></div>
                  </Fragment>
                }
              </div>
            </div>
          </Col>
        </Row>
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
export default projectGuideList;
