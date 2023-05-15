import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Card,Form,Drawer,Modal, Anchor} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DEPARTMENT_TYPE, DEPARTMENT_DETAIL_STATUS, DEPARTMENT_TYPE_ARRAY} from '../../utils/Enum';
import DepartmentDetail from "./DepartmentDetail";
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import * as utils from '../../utils/utils';
import BackTopM from '@/components/BackTopM';

const { Link } = Anchor
const { confirm } = Modal;
@Form.create()
@connect(({departmentSettingModel,loading,basicdata})=>({
  departmentSettingModel,
  loading,
  basicdata,
  departmentFetch:loading.effects['departmentSettingModel/getAllDepartment'],
}))

class DepartmentSetting extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      DataId:[],
      drawerTitle:'新增部门',
      selectedRows:[],
      drawerVisible:false,
      departmentDetail:DEPARTMENT_DETAIL_STATUS.ADD
    }
    this. btnList = {
      primaryBtn : 
      [{
        func : this.handleRefresh,
        param : [],
        key : 'REFRESH',
      }],
      patchBtn : [
        {
          func : this.handleAdd,
          param : [],
          key : 'ADDCHILD',
        },
        {
          func: this.editUser,
          param: {},
          key: 'EDIT',
        }, {
          func : this.delDep,
          param : {},
          key : 'DELETE',
        },],
    };
  }

  componentDidMount(){
    const {dispatch}=this.props;
    dispatch({
      type:'departmentSettingModel/getAllDepartment',
      payload:{
        department_type:DEPARTMENT_TYPE.AREA
      }
    });
    dispatch({
      type:'departmentSettingModel/getAllUser',
    })
  };


  handleSelectRows = (selectedRowKeys, selectedRow)=> {
    this.setState({
      selectedRows : selectedRow || selectedRowKeys,
      DataId:selectedRowKeys
    });
  };

  handleSelect = (row) => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      selectRow: row,
    })
  };

  handleAdd=()=>{
    this.setState({
      drawerVisible:true,
      drawerTitle:'新增部门',
      departmentDetail:DEPARTMENT_DETAIL_STATUS.ADD
    })
  };

  handleRefresh=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'departmentSettingModel/getAllDepartment',
      payload:{
        department_type:DEPARTMENT_TYPE.AREA
      }
    })
  };

  closeDrawer=()=>{
    this.setState({
      drawerVisible:false
    })
  };

  editUser=()=>{
    this.setState({
      departmentDetail:DEPARTMENT_DETAIL_STATUS.EDIT,
      drawerVisible:true,
      drawerTitle:'修改部门信息'
    })
  };

  delDep=()=>{
    const { dispatch } = this.props;
    const {selectedRows}=this.state;
    const {handleSelectRows}=this;
    confirm({
      title: '是否删除该部门',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type:'departmentSettingModel/delDepartment',
          payload:{
            departId:Number(selectedRows[0].deptId)
          }
        })
        handleSelectRows([],[])
      }
    })
  };


 

  render(){
    const {selectedRows,drawerVisible,departmentDetail,DataId,drawerTitle}=this.state;
    const {departmentSettingModel:{pagination,allData,allUser},departmentFetch}=this.props;
    // const {basicdata:{gDictData}}=this.props;
    const list=utils.changeArrayToTree(allData,0,{idName:'departmentId',parentIdName:'parentId'});
    const treeData={
      pagination,
      list
    };
    const columns = [
      {
        title : '部门名称',
        dataIndex : 'name',
        key : 'depName',
      },
      {
        title : '部门类型',
        dataIndex : 'type',
        key : 'type',
        // render: (text) =>  <span>{utils.getAllDictNameById(gDictData,'depType',String(text))}</span>
        render: (text) => <span>{DEPARTMENT_TYPE_ARRAY.filter((val)=> val.k === text.toString())[0].val}</span>
      },
      // {
      //   title : '电话',
      //   dataIndex : 'phone',
      //   key : 'phone',
      // },
      {
        title : '管理用户',
        dataIndex : 'userId',
        key : 'userId',
        render:(text)=>{
          let usernameString='';
          if(text!==undefined){
            allUser.filter(data=>{
              // eslint-disable-next-line eqeqeq
              if(data.userId==text.toString()){
                usernameString=data.nickname;
              }
              return true;
            });
          }
          return(
            <span>{usernameString}</span>
          )
        }
      },
    ];

    const rowSelection = {
      type: 'radio',
      onChange: this.handleSelectRows,
    };

    const contentOptions={
      selectedRows,
      departmentDetail,
      DataId,
      allUser,
      onClose:this.closeDrawer,
    };
    return(
      <PageHeaderWrapper title='部门管理'>
        <Card bordered={false}>
          <Anchor>
            <Link>
              <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows} />
            </Link>
          </Anchor>
          <StandardTable
            pagination={false}
            selectedRows={selectedRows}
            loading={departmentFetch}
            data={treeData}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            rowKey={record => record.deptId}
            rowSelection={rowSelection}
          />
        </Card>
        <BackTopM />
        <Drawer
          title={drawerTitle}
          placement="right"
          closable
          onClose={this.closeDrawer}
          visible={drawerVisible}
          width={800}
          destroyOnClose
        >
          <DepartmentDetail {...contentOptions} />
        </Drawer>
      </PageHeaderWrapper>
    )
  }
}
export default DepartmentSetting;
