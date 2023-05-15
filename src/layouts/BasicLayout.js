import React, { Suspense } from 'react';
import { Layout, Progress } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import logo from '../assets/my_logo.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import PageLoading from '@/components/PageLoading';
import SiderMenu from '@/components/SiderMenu';

import styles from './BasicLayout.less';



// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs' : {
    maxWidth : 575,
  },
  'screen-sm' : {
    minWidth : 576,
    maxWidth : 767,
  },
  'screen-md' : {
    minWidth : 768,
    maxWidth : 991,
  },
  'screen-lg' : {
    minWidth : 992,
    maxWidth : 1199,
  },
  'screen-xl' : {
    minWidth : 1200,
    maxWidth : 1599,
  },
  'screen-xxl' : {
    minWidth : 1600,
  },
};

@connect(({ basicdata, global, loading }) => ({
  basicdata,
  global,
  loading : loading.models.basicdata,
}))

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.pathnameListWithoutGetInfo = [
      '/exception/403',
      '/exception/404',
      '/exception/500',
      '/',
    ];
    this.fetchBasicDataArr = [{
      type : 'basicdata/getDict',
      payload : {},
    }, {
      type : 'basicdata/getUserList',
      payload : {},
    }];
    this.newTabIndex = 0;
    this.state = {
      activeKey : '1',
      pane : {}
    };
  }

  componentWillMount(){
    this.getUserInfo();
  }

  componentDidMount() {
    const {
      dispatch,
      route : { routes, authority },
    } = this.props;
    dispatch({
      type : 'menu/getMenuData',
      payload : { routes, authority },
    });
    // this.getBasicData();
  }

  componentWillReceiveProps(nextProps) {
    const {
      children,
      location : { pathname },
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = nextProps;
    // this.progressMessage('123',0)
    const routerConfig = this.matchParamsPath(pathname, breadcrumbNameMap);
    const contentStyle = !fixedHeader ? { paddingTop : 0 } : {};
    const pageData = { routerConfig, contentStyle, children };
    this.add(pathname, menuData, pageData, nextProps);
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  // eslint-disable-next-line class-methods-use-this
  getBreadcrumbNameMap(nextProps) {
    const routerMap = {};
    // const {route:{routes}}=nextProps;
    // const menuData=routes;
    // console.log(menuData);
    const { menuData } = nextProps;// 原文档如此写的
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          flattenMenuData(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    flattenMenuData(menuData);
    return routerMap;
  }

  // eslint-disable-next-line class-methods-use-this
  getBreadcrumbNameMapByRoute(routerData) {
    const routerMap = {};
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.routes) {
          flattenMenuData(menuItem.routes);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    flattenMenuData(routerData);
    return routerMap;
  }

  getUserInfo = () => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type : 'user/fetchCurrent',
    });
    // dispatch({
    //   type: 'setting/getSetting',
    // });
  };

  getBasicData = () => {
    const { dispatch } = this.props;
    this.fetchBasicDataArr.forEach((current) => {
      dispatch({
        type : current.type,
        payload : current.payload,
      });
    });
  };


  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
    if (!currRouterData) {
      return '四川省教育综合改革试点项目申报系统';
    }
    const pageName = formatMessage({
      id : currRouterData.locale || currRouterData.name,
      defaultMessage : currRouterData.name,
    });
    return `${pageName}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft : collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type : 'global/changeLayoutCollapsed',
      payload : collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  };


  

  add = (pathname, menuData, pageData) => {
      const { routerConfig, contentStyle, children } = pageData;
      const constructPane = () => (
        <Content className={styles.content} style={contentStyle}>
          <Authorized
            authority={routerConfig && routerConfig.authority}
            noMatch={<Exception403 />}
          >
            {children}
          </Authorized>
        </Content>
      );
    if (pathname !== '/') {
      const newPane  = { content : constructPane(), pathname}
      this.setState({
       pane:newPane
      })
    }
     
  }

  // remove = (targetKey) => {
  //   const { dispatch } = this.props;
  //   let { activeKey, panes } = this.state;
  //   let lastIndex = 0;
  //   panes.forEach((pane, i) => {
  //     if (pane.key === targetKey) {
  //       lastIndex = i - 1;
  //     }
  //   });
  //   panes = panes.filter(pane => pane.key !== targetKey);
  //   if (lastIndex >= 0 && activeKey === targetKey) {
  //     activeKey = panes[lastIndex].key;
  //     router.push(panes[lastIndex].pathname);
  //   }
  //   this.setState({ panes, activeKey });
  // };

  // refreshTabs = (props) => {
  //   const {activeKey} = props;
  //   const { panes } = this.state;
  //   let path = ''
  //   //直接在内存地址上删除该窗口内容，setState有延迟
  //   panes.forEach((current,index) => {
  //     if(current.key === activeKey){
  //       path = current.pathname
  //       panes.splice(index,1)
  //     }
  //   });
  //   router.push(path)
  // };

  // closeOtherTabs = (props) => {
  //   const { activeKey } = props;
  //   const { panes } = this.state;
  //   const newPanes = panes.filter((current) => {
  //     return activeKey === current.key;
  //   });
  //   this.setState({
  //     panes : newPanes,
  //   });
  // };

  // closeLeftTabs = (props) => {
  //   const { activeKey } = props;
  //   const { panes } = this.state;
  //   const newPanes = [];
  //   let flag = 'left';
  //   for (const current of panes) {
  //     if (current.key === activeKey) {
  //       flag = 'right';
  //     }
  //     if (flag === 'right') {
  //       newPanes.push(current);
  //     }
  //   }
  //   this.setState({
  //     panes : newPanes,
  //   });
  // };

  // closeRightTabs = (props) => {
  //   const { activeKey } = props;
  //   const { panes } = this.state;
  //   const newPanes = [];
  //   let flag = 'left';
  //   for (const current of panes) {
  //     if (flag === 'left') {
  //       newPanes.push(current);
  //     }
  //     if (current.key === activeKey) {
  //       flag = 'right';
  //     }
  //   }
  //   this.setState({
  //     panes : newPanes,
  //   });
  // };

  // closeCurrentTab = (nextProps) => {
  //   const { global : { willCloseContentName }, dispatch } = nextProps;
  //   const { panes } = this.state;
  //   if (willCloseContentName !== '') {
  //     panes.forEach((current) => {
  //       if (current.title === willCloseContentName) {
  //         this.remove(current.key);
  //         dispatch({
  //           type : 'global/closeCurrentTab',
  //           payload : {
  //             tabName : '',
  //           },
  //         });
  //       }
  //     });
  //   }
  // };

  getPercentSuccess = () => {
    const that = this;
    return this.fetchBasicDataArr.map((current) => that.props[current.loading] === false).length / this.fetchBasicDataArr.length * 100;
  };

  render() {
    const {
      navTheme,
      layout : PropsLayout,
      location : { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
    } = this.props;
    const {  pane } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const percentSuccess = this.getPercentSuccess();
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight : '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          {percentSuccess !== 100 && (
            <Progress percent={percentSuccess} strokeWidth={5} showInfo={false} />)
          }
          {
            pane ? pane.content : ''
          }
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={<PageLoading />}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu, basicdata }) => ({
  collapsed : global.collapsed,
  layout : setting.layout,
  menuData : menu.menuData,
  breadcrumbNameMap : menu.breadcrumbNameMap,
  basicdata,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
