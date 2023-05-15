import React, { Component } from 'react';
import { Card, Divider, Icon, Popconfirm, Tooltip } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AdvancedSearchForm from '@/components/AdvancedSearchForm';
import AdvancedSelect from '@/components/AdvancedSelect';

@connect(({pointManagementModel,loading})=>({
  pointManagementModel,
  tableLoading:loading.effects['pointManagementModel/getPointsList']
}))

class PointsList extends Component {
  columns = [
    {
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      align: 'center',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 80,
    },
    {
      title:'站点名称',
      dataIndex:'name',
      key:'name',
      width: '15%'
    },
    {
      title : '地址',
      dataIndex : 'address',
      key : 'address',
      width: '15%'
    },
    {
      title : '所属部门',
      dataIndex : 'departmentName',
      key : 'departmentName',
      width: '12%'
    },
    {
      title : '站点负责人',
      dataIndex : 'leaderName',
      key : 'leaderName',
      width: '10%'
    },
    {
      title:'联系方式',
      dataIndex:'phoneNumber',
      key : 'phoneNumber',
      width: '12%'
    },
    {
      title: '经/纬度',
      dataIndex: 'position',
      key : 'position',
      // width: '15%',
      render:(text,record) =>this.creatPositionIcon(record)
    },
    {
      title: '站点简介',
      dataIndex: 'introduce',
      key : 'introduce',
      width: '15%',
      render:(text,record) => this.formattedIntroduce(text,record),
      // render:(text) => <div>{text?`${text.substring(0,30)}...`:null}</div>
    },
    {
      title: '操作',
      width: 140,
      key: 'action',
      dataIndex: 'action',
      align:'center',
      render: (text, record) => (
        this.createAction(text, record)
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state={}
}

  componentDidMount(){
    this.listPage()
    this.getRolesList()
    this.getDept()
    console.log( "Points componentDidMount");
  }

  creatPositionIcon = (record) => {
    if(record.latitude&&record.longitude){
      return(
        <Tooltip title={` ${record.longitude}/${record.latitude}`}>
          <Icon type="environment" />
        </Tooltip>
      )
    }
    return null
  }

  formattedIntroduce = (value) => {
    try{
      const parseValue = JSON.parse(value);
      if(typeof parseValue === 'object' && parseValue ){
        const {blocks=[]} = parseValue;
        const {text} = blocks[0];
        return `${text.slice(0,30)}......`
      }
        return value.length>30?`${value.slice(0,30)}......`:value
    }catch (e){
      return value.length>30?`${value.slice(0,30)}......`:value
    }

  }

  newPoint = () => {
    router.push('/PointManagement/PointAdd')
  }

  getRolesList = () => {
    const {dispatch} =this.props;
    dispatch({
      type:'pointManagementModel/getRolesList',
    });
  }

  getDept = () => {
    const {dispatch} =this.props;
    dispatch({
      type:'pointManagementModel/getDepartments',
      payload:{department_type:1}
    });
  }

  listPage = () => {
    const {dispatch} =this.props;
    const {pointManagementModel:{pagination}} = this.props;
    dispatch({
      type:'pointManagementModel/getPointsList',
      payload: pagination
    });
  }

  advancedSearch = (value) => {
    const {pointManagementModel:{pagination:{index,size}}}=this.props;
    const {sitePy,leaderName} = value
    const {dispatch} = this.props;
    dispatch({
      type:'pointManagementModel/getPointsList',
      payload:{
        index,size,sitePy,leaderName
      }
    });
  }

  handleSelectSearch = () => {
    console.log('search');
  }

  showInfo = ({siteId}) => {
    // router.push(`/PointManagement/Point/${siteId}/${POINT_FLAG.SHOW}`)
    router.push(`/PointManagement/PointShow/${siteId}`)
  }

  deletePoint = ({siteId}) => {
    const {dispatch} = this.props;
    dispatch({
      type:'pointManagementModel/deletePoint',
      payload:{
        id:siteId
      }
    });
  }

  edit = ({siteId}) => {
    router.push(`/PointManagement/PointSetting/${siteId}`)
  }

  handlePaginationChange = (value) => {
    const {dispatch} = this.props;
    const {pageSize:size, current:index} = value;
    dispatch({
      type:'pointManagementModel/getPointsList',
      payload:{
        index,size
      }
    });
  }

  handleSearchRole = (value) => {
    console.log(value);
  }

  createAction = (text, record) => (
    <>
      <Tooltip title='查看'>
        <a onClick={() => this.showInfo(record)}>
          <Icon type="eye" />
        </a>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title='修改'>
        <a onClick={() => this.edit(record)}>
          <Icon type="edit" />
        </a>
      </Tooltip>
      <Divider type="vertical" />
      <Popconfirm title="确认删除该站点？" onConfirm={() => this.deletePoint(record)} okText="Yes" cancelText="No">
        <Tooltip title='删除'>
          <a>
            <Icon type="delete" />
          </a>
        </Tooltip>
      </Popconfirm>
      <Divider type="vertical" />
    </>
    )



  render() {
    const {pointManagementModel:{pointsList,pagination,pagination:{index},rolesList},tableLoading}=this.props;
    const fieldConfig = {
      key : 'userId',
      value : 'nickname',
      text : 'nickname',
    }
    const tableData = {
      list:pointsList,
      pagination:{...pagination,current:index}
    }
    const searchList = [
      {
        title: '名称',
        field: 'sitePy',
        type: 'input',
      },
      {
        title: '站点负责人',
        field: 'leaderName',
        type: 'other',
        renderComponent: () =>
          <AdvancedSelect
            dataSource={rolesList}
            searchType='nickname'
            onChange={this.handleSearchRole}
            fieldConfig={fieldConfig}
          />
      },
    ];
    const btnList = {
      primaryBtn: [{
        func: this.newPoint,
        param: [true, '其他'],
        key: 'ADD',
      }, {
        func: this.listPage,
        param: {},
        key: 'REFRESH',
      }],
    }
    return (
      <div>
        <PageHeaderWrapper title="站点管理">
          <AdvancedSearchForm
            searchList={searchList}
            doSearch={this.advancedSearch}
            pagination={pagination}
          />
          <Card bordered={false}>
            <div>
              <ToolBarGroup btnOptions={btnList} />
              <StandardTable
                childrenColumnName='child'
                loading={tableLoading}
                // selectedRows={selectedRows}
                data={tableData}
                // pagination={false}
                columns={this.columns}
                onSelectRow={() => { }}
                selectedRows={null}
                rowSelection={null}
                onChange={this.handlePaginationChange}
                // rowSelection={[]}
                rowKey={record => record.siteId}
              />
            </div>
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default PointsList;
