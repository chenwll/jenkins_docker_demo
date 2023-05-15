import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button,
  Layout,
  Row,
  Col,
  List,
  Pagination,Popover
} from 'antd';
import styles from './ProjectGuideList.less';
import {INDEX_NEWSTYPE, NEWS_STATE ,SHOW_PAGE} from '../../utils/Enum';
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
class projectGuideNewsDetail extends PureComponent {
  state = {
    copyRight: 'Copyright 2019 西南科技大学',
    copyRight2:'计算机科学与技术学院出品',
    show:true,
    pageSize:10,
    page:1,
    title:"项目指南",
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
    switch (params.id) {
      case MenuKey.GUIDE:
        this.getGuideList();
        this.setState({
          title:"项目指南",
        })
        break;
      case MenuKey.ANNOUNCEMENTS:
        this.getNews(INDEX_NEWSTYPE.ANNOUNCEMENTS);
        this.setState({
          title:"通知公告",
        })
        break;
      case MenuKey.REFORM:
        this.getNews(INDEX_NEWSTYPE.REFORM);
        this.setState({
          title:"改革动态",
        })
        break;
      default:
        break;
    }

  }

  getGuideList = () => {
    const { dispatch } = this.props;
    const {page,pageSize}=this.state;
    dispatch({
      type: 'projectGuideAndNewsModal/getGuideList',
      payload:{
        currentPage:page,
        pageSize,
      }
    });
  };

  getNews=(type)=>{
    const {dispatch}=this.props;
    const {page,pageSize}=this.state;
    switch (type) {
      case INDEX_NEWSTYPE.ANNOUNCEMENTS:
        dispatch({
          type:"projectGuideAndNewsModal/getNewsList",
          payload:{
            currentPage:page,
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
            currentPage:page,
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

  showLogin = () => {
    router.push('/');
  };

  showRegister = () => {
    router.push('/user/register');
  };

  returnFacePage = () => {
    router.push(`/index`)
  };

  showDetail = (id,type) => {
    router.push(`/projectGuideNewsMore/${id}/${type}/${SHOW_PAGE.LIST}`);
  };

  checkPage =(page,pageSize)=>{
    this.setState({
      page,
    })
    this.getPageList(page,pageSize)
  }

  changeSize=(page, pageSize)=>{
    this.setState({
      page,
      pageSize
    })
    this.getPageList(page,pageSize)

}

  getPageList=(page,pageSize)=>{
    const { dispatch } = this.props;
    const {match:{params}}=this.props;
    switch (params.id) {
      case MenuKey.GUIDE:
        dispatch({
          type: 'projectGuideAndNewsModal/getGuideList',
          payload:{
            currentPage:page,
            pageSize,
          }
        });
        break;
      case MenuKey.ANNOUNCEMENTS:
        dispatch({
          type:"projectGuideAndNewsModal/getNewsList",
          payload:{
            currentPage:page,
            pageSize,
            newsType:INDEX_NEWSTYPE.ANNOUNCEMENTS,
            newsState:NEWS_STATE.RELEASE,
          }
        });
        break;
      case MenuKey.REFORM:
        dispatch({
          type:"projectGuideAndNewsModal/getNewsList",
          payload:{
            currentPage:page,
            pageSize,
            newsType:INDEX_NEWSTYPE.REFORM,
            newsState:NEWS_STATE.RELEASE,
          }
        });
        break;
      default:
        break;
    }
}

  getTitle=(title)=>{
    let data =title.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
    if (data.length > 40) {
      data = data.substring(0, 39)
      data += "......"
    }
    return (
      <Popover content={title} autoAdjustOverflow mouseEnterDelay={0.2} placement='right'>
        <a className={styles.title}>{data}</a>
      </Popover>
    )
  }

  render() {
    const {projectGuideAndNewsModal: {data:{ list,pagination},announcements,reform} ,listLoading}= this.props;
    const { copyRight,show,copyRight2,title,pageSize,page } = this.state;
    const {match:{params}}=this.props;
    let dataList='';
    let type = '';
    let allTotal="";
    switch (params.id) {
      case MenuKey.GUIDE:
        dataList=list;
        type = MenuKey.GUIDE;
        if(pagination){
          allTotal = Number(pagination.allTotal);
        }
        break;
      case MenuKey.ANNOUNCEMENTS:
        dataList=announcements.list;
        type = MenuKey.ANNOUNCEMENTS;
        if(announcements.pagination){
          allTotal = Number(announcements.pagination.allTotal);
        }
        break;
      case MenuKey.REFORM:
        dataList=reform.list;
        type = MenuKey.REFORM;
        if(reform.pagination) {
          allTotal = Number(reform.pagination.allTotal);
        }
        break;
      default:
        break;
    }
    const TabContext = () => (
      <div className={styles.list}>
        <Row className={styles.list_detial}>
          <List
            className={styles.List}
            itemLayout="horizontal"
            loading={listLoading}
            dataSource={dataList}
            renderItem={(item) =>(
              <List.Item onClick={this.showDetail.bind(this,item.guideId||item.newsId,type,)}>
                <List.Item.Meta
                  className={styles.ListItemDiv}
                  style={{"width":"50%","textOverflow": "ellipsis",
                          "whiteSpace":"nowrap",
                          'overflow': 'hidden',
                          'display': 'block'}}
                  // title={<div className={styles.title}>{item.guideName||item.newsName}</div>}

                  title={this.getTitle(item.guideName||item.newsName)}
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
                  <h1>{title}</h1>
                  <div className={styles.details_back}><Button type="primary" onClick={this.returnFacePage}>返回</Button></div>
                </div>
              </div>

              <Content className={styles.Content}>
                <TabContext />
                <div className={styles.pagination}>
                  <Pagination size="big" onChange={(page, pageSize)=>this.checkPage(page, pageSize)} pageSize={pageSize} current={page} onShowSizeChange={(current, size)=>this.changeSize(current, size)} total={Number(allTotal)} showSizeChanger showQuickJumper />
                </div>
              </Content>
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
export default projectGuideNewsDetail;
