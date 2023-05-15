import React,{PureComponent } from 'react';
import {connect} from 'dva';
import {Table,Card,Menu,Dropdown,Icon,Drawer,Form,Modal} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MenuDrawer from './Drawer';
import { MENUS_DETAIL_STATUS } from '../../utils/Enum';

@connect(({sysSetting,loading})=>({
  sysSetting,
  loading:loading.models.sysSetting,
}))
@Form.create()
class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      drawerTitle:'新增菜单',
      menuDetailStatus:MENUS_DETAIL_STATUS.ADD,
      drawerVisible:false,
      modalVisible:false,
      menuInfo:{}
    };
  }

  componentDidMount(){
    const {dispatch}=this.props;
    dispatch({
      type: 'sysSetting/listAll',
      payload: {},
    })
  };

  getListTree=(allList)=> {
    const regString=/[a-z]/i;
    const listTree = []
    allList.map((item) => {
      if(!regString.test(item.id)){
        listTree.push(item)
      }
      return listTree;
    })
    return listTree;
  };

  delMenu=()=>{
    const {dispatch}=this.props;
    const {menuInfo:{id}}=this.state;
    dispatch({
      type: 'sysSetting/delMenu',
      payload: {
        id
      },
    })
    this.closeModal()
  }

  closeModal=()=>{
    this.props.form.resetFields()
    this.setState({
      modalVisible:false
    })
  }

  menuAction=(key, item)=>{
    switch (key) {
      case "-1":
        this.setState({
          modalVisible:true,
          menuInfo:{...item}
        })
        break;
      case "1":
        this.setState({
          drawerTitle:key==='新增菜单',
          drawerVisible:true,
          menuInfo:{...item},
          menuDetailStatus:MENUS_DETAIL_STATUS.ADD
        })
        break;
      case "0":
        this.setState({
          drawerTitle:key==='菜单更新',
          drawerVisible:true,
          menuInfo:{...item},
          menuDetailStatus:MENUS_DETAIL_STATUS.EDIT
        })
    }
  }

  expandedRowRender=(record)=>{
    const data=[];
    const {sysSetting:{listAll}}=this.props;
    listAll.map((item) =>{
      if(item.parentId===record.id){
        data.push(item)
      }
      return data;
    })
    const columns=[{
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    },{
      title:'菜单名称',
      dataIndex:'name',
      key:'name'
    },{
      title: '父节点',
      dataIndex: 'parentId',
      key: 'parentId',
    },{
      title: '菜单地址',
      dataIndex: 'route',
      key: 'route',
    },{
      title:'菜单图标',
      dataIndex:'icon',
      key:'icon'
    },{
      title: '菜单操作',
      dataIndex: 'action',
      key: 'action',
      render:(text,record)=>(
        this.MoreBtn(record)
      ),
    }
    ];
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        expandedRowRender={record.type!==2?this.expandedRowRender:''}
      />
    )
  };

  MoreBtn=(record)=>{
    if(record.type!==3){
      return (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => this.menuAction(key, record)}>
              <Menu.Item key="1">新增子菜单</Menu.Item>
              <Menu.Item key="-1">删除菜单</Menu.Item>
              <Menu.Item key="0">更新菜单</Menu.Item>
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      )
    }
    else{
      return(
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => this.menuAction(key, record)}>
              <Menu.Item key="-1">删除菜单</Menu.Item>
              <Menu.Item key="0">更新菜单</Menu.Item>
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      )
    }
  }

  closeDrawer=()=>{
    this.setState({
      drawerVisible:false
    })
  }

  render(){
    const {loading}=this.props;
    const {menuInfo:{id}}=this.state;
    const {sysSetting:{listAll}}=this.props;
    const {drawerTitle,drawerVisible,menuDetailStatus,modalVisible}=this.state;
    const menuList=this.getListTree(listAll);
    const columns = [{
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    },{
      title:'菜单名称',
      dataIndex:'name',
      key:'name'
    },{
      title: '父节点',
      dataIndex: 'parentId',
      key: 'parentId',
    },{
      title:'菜单地址',
      dataIndex:'route',
      key:'route'
    },{
      title:'菜单图标',
      dataIndex:'icon',
      key:'icon'
    },{
      title: '菜单操作',
        dataIndex: 'action',
        key: 'action',
        render:(text,record)=>(
          this.MoreBtn(record)
      )
    }];

    const drawerProps={
      onClose:this.closeDrawer,
      menuId:id,
      menuDetailStatus
    }

   return(
     <PageHeaderWrapper title='菜单管理'>
       <Card>
         <Modal
           visible={modalVisible}
           title='菜单删除'
           onCancel={this.closeModal}
           onOk={this.delMenu}
         >
           <p style={{margin:'auto'}}>是否确认删除该菜单</p>
         </Modal>
         <Drawer
           width={720}
           title={drawerTitle}
           visible={drawerVisible}
           onClose={this.closeDrawer}
           destroyOnClose
         >
           <MenuDrawer {...drawerProps} />
         </Drawer>
         <Table columns={columns} expandedRowRender={this.expandedRowRender} dataSource={menuList} loading={loading} />
       </Card>
     </PageHeaderWrapper>
   );
  }
};

export  default Setting;
