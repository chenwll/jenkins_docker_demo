import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import {  Icon } from 'antd';
import styles from './UserLayout.less';
import Config from '../../config/api';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 西南科技大学计算机科学与技术学院出品 &nbsp;&nbsp;&nbsp;{Config.VERSIONS}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        {/* <div className={styles.lang}> */}
        {/* <SelectLang /> */}
        {/* </div> */}
        <div className={styles.content}>
          {/* <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>绵阳市文明城市评测系统</span>
              </Link>
            </div>
            <div className={styles.desc}></div>
          </div> */}
          {children}
        </div>
        {/* <GlobalFooter copyright={copyright} /> */}
      </div>
    );
  }
}

export default UserLayout;
