import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Button, Form, Select } from 'antd';
import MultiFunctionalList from '../../components/MultifunctionalList/index';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import { phoneRegular, emailRegular } from '../../utils/regular';
import { SIGN_COLOR, EDIT_FLAG } from '../../utils/Enum';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserDetail from './userDetail';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';


// const FormItem = Form.Item;
// const Option = Select.Option;

@connect(({ users, global, loading }) => ({
  users,
  global,
  loading: loading.models.users,
  loadingList: loading.effects['users/fetch'],
  loadingUpdate: loading.effects['users/UpdateUser'],
}))
class GoodList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checks: [],
      drawerVisible: false,
      editFlag: EDIT_FLAG.EDIT,
    };
  }

  componentDidMount() {
    this.listPage();
    this.getBasicData();
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/fetch',
      payload: params || {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  getBasicData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/allrole',
      payload: {
        activation: 1,
      },
    });
    dispatch({
      type: 'users/departmentList',
      payload: {},
    });
  };

  addUser = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/addUser',
      payload: data,
    });
  };

  updateUser = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/UpdateUser',
      payload: data,
    });
  };

  deleteUser = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    const data = checks[0];
    if (data) {
      const { id } = data.data;
      dispatch({
        type: 'users/deleteUser',
        payload: {
          id,
        },
      });
    }
  };

  convertData = (data, key, value, text) => {
    if (data) {
      return data.map((current) => {
        const temp = {};
        temp.key = current[key];
        temp.value = current[value];
        temp.text = current[text];
        return temp;
      });
    }
    return [];
  };

  onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
  };

  onChangeDrawerVisible = (value) => {
    this.setState({
      drawerVisible: value,
    });
  };

  newUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/saveEditFlag',
      payload: {
        editFlag: EDIT_FLAG.ADD,
      },
    });
    this.onChangeDrawerVisible(true);
  };

  editUser = () => {
    const { dispatch } = this.props;
    const { checks } = this.state;
    dispatch({
      type: 'users/saveEditItem',
      payload: {
        id: checks[0].data.id,
      },
    });
    dispatch({
      type: 'users/saveEditFlag',
      payload: {
        editFlag: EDIT_FLAG.EDIT,
      },
    });
    this.onChangeDrawerVisible(true);
  };

  testCloseTab = () => {
    const {  dispatch } = this.props;
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '原始列表',
      },
    });
  };

  render() {
    const { users: { userData, roleData, departmentData, pagination }, loadingList, loadingUpdate } = this.props;
    const { checks, drawerVisible, editFlag } = this.state;
    const cardOption = {
      sign: {
        field: 'status',
        src: [
          {
            key: '1',
            value: '可用',
            color: SIGN_COLOR['3'],
          }, {
            key: '0',
            value: '不可用',
            color: SIGN_COLOR['4'],
          },
        ],
      },
      detail: [
        { field: 'departmentId', src: this.convertData(departmentData, 'id', 'departmentName'), editable: true },
        { field: 'roleId', src: this.convertData(roleData, 'id', 'name'), editable: true },
        { field: 'nickname', title: '昵称' },
        { field: 'username', title: '用户名' },
        { field: 'telephone', title: '电话' },
        { field: 'email', title: '邮箱' },
      ],
    };
    const pageProps = {
      turnPage: this.listPage,
      ...pagination,
    };
    const contentOptions = {
      updateFunction: this.updateUser,
      addFunction: this.addUser,
      closeFunction: this.onCloseDrawer,
      editFlag,
      loadingUpdate,
    };
    const drawerOption = {
      drawerTitle: '用户信息',
      drawerContent: <UserDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible: this.onChangeDrawerVisible,
    };
    const btnList = {
      primaryBtn: [{
        func: this.newUser,
        param: { s: 1, n: 2 },
        key: 'ADD',
      }, {
        func: this.listPage,
        param: [true, '其他'],
        key: 'REFRESH',
      },
      ],
      patchBtn: [
        {
          func: this.editUser,
          param: {},
          key: 'EDIT',
        }, {
          func: this.deleteUser,
          param: { s: 1, n: 2 },
          key: 'PATCH_DELETE',
        }],
      menuBtn: [{
        func: this.handleDrawerVisible,
        param: { s: 1, n: 2 },
        key: 'PATCH_DELETE',
      }],
    };
    const searchList = [
      {
        title: '用户名',
        field: 'username',
        required: true,
        message: '用户名必填(测试)',
        type: 'input',
      },
      {
        title: '部门',
        field: 'departmentId',
        // type: 'select',
        type: 'other',
        renderComponent: () => {
          return (<AdvancedSelect
            dataSource={departmentData}
            fieldConfig={SelectFieldConfig.departmentFiledConfig}
            onChange={() => {}} />);
        },
      },
      {
        title: '邮箱',
        reg: emailRegular,
        message: '用户名必填(测试)',
        field: 'email',
        type: 'input',
      },
      {
        title: '电话号码',
        reg: phoneRegular,
        field: 'telephone',
        type: 'inputNumber',
      },
    ];
    return (
      <PageHeaderWrapper title="编辑表格">
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.listPage}
          pagination={pagination}
        />
        <Button onClick={this.testCloseTab}>测试全局关闭</Button>
        <MultiFunctionalList
          cardOption={cardOption}
          dataSource={userData}
          loadingList={loadingList}
          loadingUpdate={loadingUpdate}
          updateFunction={this.updateUser}
          pagination={pageProps}
          btnOptions={btnList}
          selectedRows={checks}
          ck
          onSelectChange={this.onSelectChange}
          {...drawerOption}
        />
      </PageHeaderWrapper>
    );
  }
}

export default GoodList;
