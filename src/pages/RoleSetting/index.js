import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {Card,Form,Drawer,Modal,message, Divider, Table, Icon, Tooltip} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import RolesDetail from './RolesDetail';
import {ROLES_DETAIL_STATUS} from '../../utils/Enum';


const {confirm}=Modal;
@Form.create()
@connect(({ roleSettingModel, loading }) => ({
  roleSettingModel,
  listLoading:loading.effects['roleSettingModel/fetchList'],
  changeState:loading.effects['roleSettingModel/changeState'],
  changeInfo:loading.effects['roleSettingModel/changeInfo'],
  delRole:loading.effects['roleSettingModel/delRole']
}))
class RoleList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      permissionsRow:[],
      visiable:false,
      modelVisible:false,
      drawerTitle:'新建角色',
      rolesDetailStatus:ROLES_DETAIL_STATUS.ADD,
      record:{}
    };
  }

  componentDidMount() {
    this.listPage()
  }

  listPage = () => {
    const { dispatch } = this.props;
    dispatch({
      type : 'roleSettingModel/fetchList',
      payload:null
    });
  };

  openDrawer=()=>{
    this.setState({
      visiable:true
    })
  }

  closeDrawer=()=>{
    const { form } = this.props
    form.resetFields()
    this.setState({
      visiable:false
    })
  }

  delRole=(record)=>{
    const { dispatch } = this.props;
    const {selectedRows}=this.state;
    const {handleSelectRows}=this;
    const {roleSettingModel:{allRoleData:{pagination}}}=this.props;
    const id = record.roleId
    confirm({
      title: `是否删除所选的角色`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        const delId=[]
        selectedRows.map((item) =>{
          delId.push(item.id);
          return delId
        })
        dispatch({
          type:'roleSettingModel/delRole',
          payload:{
            record:{
              roleId:id
            },
            pagination
          }
        })
        handleSelectRows([]);
      }
    })
  };

  handleAdd=()=>{
    this.openDrawer()
    this.setState({
      drawerTitle:'新建角色',
      rolesDetailStatus:ROLES_DETAIL_STATUS.ADD
    })
  }

  handleEdit=(record)=>{
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('只能修改选中队列的第一个')
    }
    this.openDrawer()
    this.setState({
      drawerTitle:'角色信息修改',
      rolesDetailStatus:ROLES_DETAIL_STATUS.EDIT,
      record
    })
  }

  handleUsable=()=>{
    const {dispatch}=this.props;
    const {selectedRows}=this.state;
    const {roleSettingModel:{roleData:{pagination}}}=this.props;
    const newState=[];
    selectedRows.map((item)=> {
      item.activation='1'
      newState.push(item);
      return newState;
    })
    dispatch({
      type:'roleSettingModel/changeState',
      payload: {
        data:newState,
        pagination
      }
    })
  }

  closeModal=()=>{
    this.setState({
      modelVisible:false
    })
  }

  openModal=()=>{
    this.setState({
      modelVisible:true
    })
  }

  handleRefresh=()=>{
    // const {roleSettingModel:{allRoleData:{pagination}}}=this.props;
    const {dispatch}=this.props;
    dispatch({
      type:'roleSettingModel/fetchList',
      // payload:pagination
    })
  }

  handleNnusable=()=>{
    const {dispatch}=this.props;
    const {selectedRows}=this.state;
    const {roleSettingModel:{roleData:{pagination}}}=this.props;
    const newState=[];
    selectedRows.map((item)=> {
      item.activation='0'
      newState.push(item);
      return newState;
    })
    dispatch({
      type:'roleSettingModel/changeState',
      payload: {
        data:newState,
        pagination
      }
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      page : pagination.current,
      pageSize : pagination.pageSize,
    };
    dispatch({
      type : 'roleSettingModel/fetchList',
      payload : params,
    });
  };

  setPermissions=(record)=>{
    const role=[]
    role.push(record)
    this.openDrawer()
    this.setState({
      drawerTitle:'设置角色权限',
      rolesDetailStatus:ROLES_DETAIL_STATUS.PERMISSIONS,
      permissionsRow:role,
    })
  }

  render() {
    const {selectedRows,visiable,drawerTitle,rolesDetailStatus,record} = this.state;
    const {listLoading,changeState,changeInfo,delRole}=this.props;
    const {roleSettingModel:{allRoleData:{pagination}}}=this.props;
    const {roleSettingModel:{allRoleData}}=this.props;
    const columns=[
      {
        title:"序号",
        key:'serial',
        render:(text,records,index)=>index + 1
      },
    {
      title:"角色名称",
      key:'name',
      dataIndex:'roleName',
      },
    {
      title:'概述',
      key:'description',
      dataIndex:'roleDesc'
    }, {
      title:"修改时间",
      key:'updateTime',
      dataIndex:'updateTime',
    },
    {
      title:"操作",
      key:'action',
      render:(text,records)=>(
        <Fragment>
          <Tooltip title="修改">
            <a onClick={()=>this.handleEdit(records)}>
              <Icon type='edit' />
            </a>
          </Tooltip>
          <Divider type='vertical' />
          <Tooltip title="删除">
            <a onClick={()=>this.delRole(records)}>
              <Icon type='delete' />
            </a>
          </Tooltip>
        </Fragment>
        )
    }
  ];

    const btnList = {
      primaryBtn : [{
        func : this.handleAdd,
        param : [],
        key : 'ADD',
      }, {
        func : this.handleRefresh,
        param : [],
        key : 'REFRESH',
      }],
      patchBtn : [{
        func : this.handleEdit,
        param : [],
        key : 'EDIT',
      },
        {
        func : this.delRole,// 删除
        param : {},
        key : 'DELETE',
      }
      ],
      menuBtn : []
    };

    const rolesDetailProps={
      pagination,
      selectedRows,
      rolesDetailStatus,
      record,
      onClose:this.closeDrawer,
    };

    return (
      <PageHeaderWrapper title='角色管理'>
        <Card>
          <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
          <Table
            pagination={false}
            loading={listLoading||changeState||changeInfo||delRole}
            dataSource={allRoleData}
            columns={columns}
            rowKey={records => records.roleId}
          />
        </Card>
        <Drawer
          width={720}
          visible={visiable}
          title={drawerTitle}
          onClose={this.closeDrawer}
          destroyOnClose
        >
          <RolesDetail {...rolesDetailProps} />
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
