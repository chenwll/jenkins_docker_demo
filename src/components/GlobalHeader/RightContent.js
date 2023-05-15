import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import { ROLE_TYPES } from '@/utils/Enum';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="index">
          <Icon type="setting" />
          <span>主页</span>
        </Menu.Item>
        {/*<Menu.Divider />*/}
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <span>个人中心</span>
          {/*<FormattedMessage id="menu.account.center" defaultMessage="account center" />*/}
        </Menu.Item>
        {/*<Menu.Divider />*/}
        <Menu.Item key="logout" id={'loginOutButton'}>
          <Icon type="logout" />
          <span >退出登录</span>
          {/*<FormattedMessage id="menu.account.logout" defaultMessage="logout" />*/}
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    // 屏蔽了选择语言选项和帮助文件
    return (

      <div className={className}>
        {currentUser.name ? (
          <div className={styles.headerTitle}>
            <a>
              <span onClick={onMenuClick.bind(this,{key:"USERSETTING"})} 
                style={{ display:currentUser.role !== ROLE_TYPES.ADMIN ? 'none' : 'inline'}}
              >账号管理</span>  
            </a>
            <a>
              <span onClick={onMenuClick.bind(this,{key:"userCenter"})}>个人中心</span>
            </a>
            <a>
              <span onClick={onMenuClick.bind(this,{key:"MESSAGE"})}>消息中心</span>
            </a>
            <Divider type="vertical" />
            <a>
              <span style={{marginRight:'-20px'}} onClick={onMenuClick.bind(this,{key:"userCenter"})}>
                <Icon type="user" /> &nbsp;
                <span >{currentUser.name}</span>
              </span>
            </a>
            <a>
              <span  onClick={onMenuClick.bind(this,{key:"logout"})}>
                <Icon type="logout" /> &nbsp;
                <span>退出登录</span>
              </span>
            </a>
            {/* <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.avatar}
                  alt="avatar"
                />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown> */}
          </div>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {/*<SelectLang className={styles.action} />*/}

      </div>
    );
  }
}
