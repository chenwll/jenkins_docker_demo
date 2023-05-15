import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Form,Modal,message} from 'antd';
import UsersDetail from './UsersDetail';
import * as basicFunction from '../../utils/utils';
import AdvancedSelect from '../../components/AdvancedSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { ROLES_DETAIL_STATUS, SIGN_COLOR } from '../../utils/Enum';
import AdvancedDrawer from  '../../components/AdvancedDrawer/index';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import MultiFunctionalList from '../../components/MultifunctionalList/index';

const {confirm}=Modal;
@Form.create()
@connect(({ UserSettingModel, loading ,basicdata}) => ({
  UserSettingModel,
  basicdata,
  listLoading:loading.effects['UserSettingModel/getList'],
  changeInfoLoading:loading.effects['UserSettingModel/changeInfo'],
  delUserLoading:loading.effects['UserSettingModel/delUser']
}))

class RoleList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      drawerVisible:false,
      rolesDetailStatus:ROLES_DETAIL_STATUS.ADD,
      //这里认为userId是数据中的userId,而不是角色权限下的roleId!!!
      //需要注意的是，老数据userId是字符串的形式，而新数据userId是数字，不知道后面会不过会改，出错看一下这里!!!
      userId:'',
      searchWithNameOrStatus:false,// 为了是否点击重置
      searchMoreParams:{}// 为了区分分页的时候是搜索之后的分页还是原始分页
    };
  }

  componentDidMount() {
    const {dispatch}=this.props;
    dispatch({
      type:'UserSettingModel/getAllRole',
    });// 获取所有角色
    this.listPage({
      current: 1,
      size: 10,
    });
  }

  listPage = (params) => {

    if (params!=={}){
      params.current=params.currentPage
      params.size=params.pageSize
      delete params.currentPage
      delete params.pageSize
    }

    console.log("listPage,params",params)
    console.log("this,listPage,this.props",this.props)
    const { dispatch,UserSettingModel:{pagination} } = this.props;
    const {searchMoreParams}=this.state;
    console.log("listPage,searchMoreParams",searchMoreParams)
    if(params){
      if(!params.reset){  // 与搜索有关
        params={...params,...searchMoreParams}
      }
    }
    console.log("listPage,params2",params)
    const isParamsUndefined = Object.keys(params || {});
    console.log("listPage,isParamsUndefined",isParamsUndefined)
    dispatch({
      type : 'UserSettingModel/getList',
      payload :isParamsUndefined.length !== 0 ? params : { ...pagination, ...searchMoreParams },
    });
    if (isParamsUndefined.length !== 0) {
      const { current, size, ...searchValue } = params;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
    }
  };

  //正常情况这个应该是从后端获取的！！！！！
  gDictData=[
    {
      id:3,
      k:"0",
      val:"无效",
      type:"userStatus",
    },
    {
      id:4,
      k:"1",
      val:"正常",
      type:"userStatus",
    },
    {
      id:5,
      k:"2",
      val:"锁定",
      type:"userStatus",
    }
  ]

  onChangeDrawerVisible = (value) => {
    this.setState({
      drawerVisible: value,
    });
  };

  closeDrawer=()=>{
    this.setState({
      drawerVisible:false
    })
  }

  //获取当前行信息，调用dispatch，存到modal中
  handleSelectRows = (data) => {
    console.log("handleSelectRows",data)
    const {dispatch}=this.props;
    let userIdstr='';
    //这里，handleSelectRows的data参数，返回的是[{},{}...]因为会选择多行，同时，此函数在选择，以及取消选择时均会触发一次，因此要加下面的判断!!!
    if(data.length>0){
      userIdstr=data[0].data.userId
    };
    dispatch({
      type:'UserSettingModel/save',
      payload:{
        selectedRows:data
      }
    })
    this.setState({
      userId:userIdstr,
    });
  };

  //接收一个字典（来自后端的dict）,从key->value->color的映射
  tableStatusColorMatch=(userSettingUserStatus)=>{
    userSettingUserStatus.map((item)=>{
      item.key=item.k;
      item.value=item.val;
      switch (item.val) {
        case '正常':
          item.color=SIGN_COLOR['3'];
          break;
        case '无效':
          item.color=SIGN_COLOR['2'];
          break;
        case '锁定':
          item.color=SIGN_COLOR['7'];
          break;
        case '申请中':
          item.color=SIGN_COLOR['6'];
          break;
        case '申请失败':
          item.color=SIGN_COLOR['4'];
          break;
        default:
          break;
      }
      return userSettingUserStatus
    })
  };
  //传入一个对象数组，将其.value作为新对象的.key,.text作为.value和.text
  convertData = (data, key, value, text) => {
    console.log(data)
    if (data) {

      console.log((data.map((current) => {
        const temp = {};
        temp.key = current[value];
        temp.value = current[text];
        temp.text = current[text];
        return temp;
      })))

      return data.map((current) => {
        const temp = {};
        temp.key = current[value];
        temp.value = current[text];
        temp.text = current[text];
        return temp;
      });
    }
    return [];
  };
  //固定roleName并且从新数据中将roleName提出来
  changeArrayRoleNames=(data)=>{
    data.map(item=>{
      if(item.roleList[0]) {
        item.roleName=item.roleList[0].roleName //因为后端新旧数据不同，这里有更改！！！
      }
    })
    return data;
  };

  //涉及到修改,点击行中蓝色字体触发!!!
  touche=(data)=>{
    console.log(data)
    if(data){
      this.setState({
        rolesDetailStatus:ROLES_DETAIL_STATUS.EDIT,
        userId:data.userId
      })
    }
    this.onChangeDrawerVisible(true)
  };

  handleAdd=()=>{
    this.onChangeDrawerVisible(true);
    this.setState({
      rolesDetailStatus:ROLES_DETAIL_STATUS.ADD
    })
  }

  editUser=()=>{
    const {UserSettingModel:{selectedRows}}=this.props;
    if(selectedRows.length>1){
      message.warning('每次只能修改一个用户的信息')
      return
    }
    this.onChangeDrawerVisible(true);
    this.setState({
      rolesDetailStatus:ROLES_DETAIL_STATUS.EDIT,
      userId:selectedRows[0].data.userId
    })
  };

  //看得出来，老代码可以同时删除n个，新接口应该不行，移去部分了代码！！！
  delUser=()=>{
    const { dispatch } = this.props;
    const {UserSettingModel:{selectedRows,pagination}}=this.props;
    const {handleSelectRows}=this;
    if(selectedRows.length>1){
      message.warning('每次只能删除一个用户')
      return
    }
    console.log("delUser(),selectedRows",selectedRows)
    confirm({
      title: `是否删除`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type:'UserSettingModel/delUser',
          payload:{
            id:selectedRows[0].data.userId,
            pagination
          }
        })
        handleSelectRows([]);
      }
    })
  };

  //在每行通过下拉小卡片修改时触发
  updateFunction = (data) => {
    const { dispatch } = this.props;
    const {UserSettingModel:{pagination,allRoles}}=this.props;
    console.log("updateFunction,data,pagination",data,pagination)
    //没权限的不管它！！！，后期应该不会有这种数据
    if (data.roleList[0]){
      let newRoleList=[];
      console.log("updateFunction,allRoles",allRoles)
      allRoles.map(item=>{
        if (item.roleName===data.roleName){
          newRoleList.push(item.roleId)
        }
      })
      data.wxOpenId="1"
      delete data.roleName
      console.log("*updateFunction,old,data",data)
      data.role=newRoleList
      console.log("*updateFunction,new,data",data)
      dispatch({
          type : 'UserSettingModel/changeInfo',
          payload :{
            data,
            pagination
          },
      })
    }
  };


  //重置密码,现在后端新加了修改密码的功能，原来没有，而且俩接口就api不一样
  //重置密码时后端接口有问题，已搞定！！！
  reSetPassWord=()=>{
    const {selectedRows}=this.props.UserSettingModel;
    const { dispatch,UserSettingModel:{pagination} } = this.props;
    const {searchMoreParams}=this.state;
    const {handleSelectRows}=this;
    if(selectedRows.length>1){
      message.warning('每次只能重置一个用户')
      return
    }
    confirm({
      title: '是否确认重置密码，密码重置后将为默认密码8个8',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type:'UserSettingModel/resetPassWord',
          payload:{
            userId:selectedRows[0].data.userId,
            ...pagination,
            ...searchMoreParams
          }
        });
        handleSelectRows([]);
      }
    });
  };

  searchList = [
    {
      title : '用户名',
      field : 'nickname',
      message : '必填',
      type : 'input',
    },
    {
      title: '电话',
      field: 'phone',
      message: '必填',
      type: 'input',
    }
  ];

  advancedSearch = (params) => {// 搜索框搜索分页
    if(Object.prototype.hasOwnProperty.call(params,'status')||Object.prototype.hasOwnProperty.call(params,'nickname')||Object.prototype.hasOwnProperty.call(params,'roleId')){// 如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchWithNameOrStatus:true,
        searchMoreParams:{
          ...params,
          current: 1,
          size: 10,
        }
      })
      params.reset=false;
    }
    else{// 点击重置
      this.setState({
        searchWithNameOrStatus:false
      })
      params.reset=true;
    }
    params.current===0?params.current=1:params.current
    this.listPage(params)
  };

  doReset=()=>{
    this.setState({
      searchMoreParams:{}
    })
  }

  removeBinding = ()=>{
    console.log('解除绑定');
  }

  render() {

    console.log("this.props",this.props)
    const {UserSettingModel:{UsersData,pagination,allRoles}}=this.props;
    const {listLoading,changeInfoLoading,delRoleLoading}=this.props;
    const {UserSettingModel:{selectedRows}}=this.props;
    const {drawerVisible,rolesDetailStatus,userId} = this.state;

    const userStatus=basicFunction.getDictByType(this.gDictData,'userStatus'); //找出对应的dict
    this.tableStatusColorMatch(userStatus);
    console.log("UsersData",UsersData)
    const userDataWithRoleNameDeal=this.changeArrayRoleNames(UsersData);// roleNames处理转为为了防止多次render的时候修改数据
    console.log("userDataWithRoleNameDeal",userDataWithRoleNameDeal)

    pagination.currentPage=pagination.current
    pagination.pageSize=pagination.size

    const cardOption = {
      sign: {
        field: 'status',
        src:userStatus  //字典
      },
      detail: [
        {field: 'roleName', title: '角色:',src: this.convertData(allRoles, 'roleId', 'roleName','roleName'), editable: true },
        { field: 'username', title: '账号' },
        { field: 'nickname', title: '用户名' },
        { field: 'phone', title: '电话' },
        // { field: 'email', title: '邮箱' },
      ],
      defaultClick: this.touche,
    };
    const pageProps = {
      turnPage: this.listPage,
      ...pagination,
    };

    //功能均未实现，因为要先引入drawer！！！
    const btnList = {
      primaryBtn : [{
        func : this.handleAdd,
        param : [],
        key : 'ADD',
      }, {
        func : this.listPage,
        param : {},
        key : 'REFRESH',
      }],
      patchBtn : [
        {
          func: this.editUser,
          param: {},
          key: 'EDIT',
        }, {
          func : this.delUser,
          param : {},
          key : 'DELETE',
        },
        {
          func : this.reSetPassWord,
          param : {},
          key : 'PASSWORD_RESET',
        },
        {
          func:this.removeBinding,
          param: {},
          key: 'REMOVE_BINDING',
        }],
    };

    //drawerContent中<UserDetail/> 的参数
    const contentOptions = {
      pagination,
      rolesDetailStatus,
      onClose:this.closeDrawer,
      userId,
    };

    const drawerOption = {
      drawerTitle : '用户信息',
      drawerContent : <UsersDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible : this.onChangeDrawerVisible,
    };

    return (
      <PageHeaderWrapper title="用户管理">
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.advancedSearch}
          doReset={this.doReset}
          pagination={pagination}
        />
        <MultiFunctionalList
          cardOption={cardOption}
          dataSource={userDataWithRoleNameDeal}
          loadingList={listLoading||changeInfoLoading||delRoleLoading}
          loadingUpdate={changeInfoLoading}
          updateFunction={this.updateFunction}
          pagination={pageProps}
          btnOptions={btnList}
          selectedRows={selectedRows}
          ck
          checks={selectedRows}
          onSelectChange={this.handleSelectRows}
        />
        <AdvancedDrawer {...drawerOption} />
      </PageHeaderWrapper>
    );
  }

}
export default RoleList;
