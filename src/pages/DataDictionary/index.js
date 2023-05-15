import React,{PureComponent} from 'react';
import {Card, Form, Drawer, Modal, message, Divider, Icon, Tooltip} from 'antd';
import {connect} from 'dva';
import {Link} from "react-router-dom";
import DataDictionaryDetail from './DataDictionaryDetail';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DATA_DICTIONARY_DETAIL_STATUS } from '../../utils/Enum';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';

/*
  存在的问题
  分页查询子项返回结果不对

*/

const {confirm}=Modal;
@Form.create()
@connect(({DataDictionaryModel,loading})=>({
  DataDictionaryModel,
  loading,
  DataFetch:loading.effects['DataDictionaryModel/fetch'],
}))

class DataDictionary extends PureComponent{
  constructor(){
    super();
    this.state={
      DataId:'',
      selectedRows:[],
      drawerVisible:false,
      drawerTitle:'新增数据',
      searchMoreParams:{},
      dataDictDrawerStyle:DATA_DICTIONARY_DETAIL_STATUS.ADD,
    }
  }

  componentDidMount(){
    this.listPage({
      currentPage: 1,
      pageSize: 10,
    });
  };

  listPage = (params) => {
    const { dispatch,DataDictionaryModel:{pagination} } = this.props;
    const {searchMoreParams}=this.state;
    const isParamsUndefined = Object.keys(params || {});
    dispatch({
      type:'DataDictionaryModel/fetch',
      payload: isParamsUndefined.length !== 0 ? params : { ...pagination, ...searchMoreParams },
    })
    if (isParamsUndefined.length !== 0) {
      const { currentPage, pageSize, ...searchValue } = params;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleStandardTableChange = (pagination) => {
    const {searchMoreParams}=this.state;
    const params = {
      ...searchMoreParams,
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
    };
    this.listPage(params)
  };

  handleAdd=()=>{
    this.setState({
      drawerVisible:true,
      drawerTitle:'新增数据',
      dataDictDrawerStyle:DATA_DICTIONARY_DETAIL_STATUS.ADD
    })
  };

  closeDrawer=()=>{
    const {form:{resetFields}}=this.props;
    resetFields();
    this.setState({
      drawerVisible:false,
      selectedRows:[],
    })
  };

  editDict=()=>{
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('选择多项数据时，只允许编辑第一位')
    }

    this.setState({
      dataDictDrawerStyle:DATA_DICTIONARY_DETAIL_STATUS.EDIT,
      drawerVisible:true,
      DataId:selectedRows[0].dictId,
      drawerTitle:`修改数据 id为${selectedRows[0].dictId}`
    })
  };

  delDict=(id)=>{
    const {DataDictionaryModel:{pagination}}= this.props;
    const { dispatch } = this.props;
    const {selectedRows}=this.state;
    const {handleSelectRows}=this;
    if(selectedRows.length>1){// 是否改变
      message.warning('抱歉每次只允许删除一个数据值');
      return
    }

    if (JSON.stringify(id)==='{}'){// 判断参数是否传递有效参数
       id=selectedRows[0].dictId;
    }
    confirm({
      title: `是否删除选中的数据 id为${id}`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        const delId=[];
        selectedRows.map((item)=>{
          delId.push(item.id);
          return delId;
        });
        dispatch({
          type:'DataDictionaryModel/delDataDict',
          payload:{
            data:{
              id ,
            },
            pagination
          }
        })
        handleSelectRows([])
      }
    })
  };

  advancedSearch = (params) => {// 搜索框搜索分页
    console.log("",params)
    if(Object.prototype.hasOwnProperty.call(params,'type')){// 如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams:{
          ...params,
        }
      })
    }
    else{// 点击重置
      this.setState({
        searchMoreParams:{}
      })
    }
    const { dispatch } = this.props;
    dispatch({
      type:'DataDictionaryModel/getDataByPage',
      payload:{
        ...params,
        currentPage : 1 ,
        pageSize : 10,
      }
    })
  };

  handleAction=(text, record)=>{
      return (
        <span>
          <Tooltip placement="top" title="详情">
            <Link to={`/basicSetting/DataDict/${text.type}/${text.dictId}`}><Icon   type="arrow-right" /></Link>
          </Tooltip>
          <Divider type='vertical' />
          <Tooltip placement="top" title="编辑">
            <a onClick={()=>{this.setState({
            drawerVisible:true,
            dataDictDrawerStyle:1,
            drawerTitle:`修改数据 类型为${text.type}`,
            DataId:text.dictId
          })}}
          >
              <Icon title="编辑" type="edit" />
            </a>
          </Tooltip>
          <Divider type='vertical' />
          <Tooltip placement="top" title="删除">
            <a onClick={()=>{
            this.delDict(text.dictId)
          }}
            ><Icon title="删除" type="delete" />
            </a>
          </Tooltip>
        </span>
      )
  }


  columns = [
    {
      title : '序号',
      dataIndex : 'dictId',
      key : 'dictId',
    },
    {
      title : '字典类型名',
      dataIndex : 'type',
      key : 'type',
    },
    {
      title : '字典描述',
      dataIndex : 'description',
      key : 'description',
    },
    {
      title : '字典备注',
      dataIndex : 'remarks',
      key : 'remarks',
    },
    {
      title: '操作',
      key: 'action',
      render: this.handleAction

    },

  ];

  btnList = {

    primaryBtn : [
   {
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
        func: this.editDict,
        param: {},
        key: 'EDIT',
      }, {
        func : this.delDict,
        param : {},
        key : 'DELETE',
      },],
  };

  searchList = [
    {
      title : '字典类型',
      field : 'type',
      type : 'input',
    },
  ];

  render(){
    const {selectedRows,drawerVisible,dataDictDrawerStyle,DataId,drawerTitle}=this.state;
    const {DataDictionaryModel:{data,pagination},DataFetch}=this.props;
    const contentOptions={
      selectedRows,
      dataDictDrawerStyle,
      DataId,
      pagination,
      onClose:this.closeDrawer,
    };

    return(
      <PageHeaderWrapper title='字典管理'>
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.advancedSearch}
          pagination={pagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows} />
          <StandardTable
            selectDisable
            loading={DataFetch}
            data={data}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.id}
          />
        </Card>
        <Drawer
          title={drawerTitle}
          placement="right"
          closable
          onClose={this.closeDrawer}
          visible={drawerVisible}
          width={800}
          destroyOnClose
        >
          <DataDictionaryDetail {...contentOptions} />
        </Drawer>
      </PageHeaderWrapper>
    )
  }
}
export default DataDictionary;
