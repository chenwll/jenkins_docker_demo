import React, {Component} from 'react';
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import AdvancedSearchForm from "@/components/AdvancedSearchForm";

import StandardTable from "@/components/StandardTable";
import {Button, Card, Divider, Drawer, Form, Icon, message, Modal, Tooltip} from "antd";
import DataDictionaryDetail from "@/pages/DataDictionary/DataDictionaryDetail";
import ItemsDataDetail from "@/pages/DataDictionary/DataDictionaryItemsDetail";
import ToolBarGroup from "@/components/ToolBarGroup";
import {DATA_DICTIONARY_DETAIL_STATUS} from "@/utils/Enum";
import {connect} from "dva";

const {confirm}=Modal;
@Form.create()
@connect(({DataDictionaryModel,loading})=>({
  DataDictionaryModel,
  loading,
  DataFetch:loading.effects['DataDictionaryModel/getDataItems'],
}))

class DataDictionaryItemsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
         data:{
         },
         dataDictDrawerStyle:DATA_DICTIONARY_DETAIL_STATUS.ADD,
         itemsId:0, // 字典项id
         drawerVisible:false,
         selectedRows:[],//选中数据

    };
  }
  Title=["新建数据","修改数据"]

  closeDrawer=()=>{
    const {form:{resetFields}}=this.props;
    resetFields();
    this.setState({
      drawerVisible:false,
      selectedRows:[],
    })
  };

  componentDidMount() {
       const {dispatch,match:{params:{type}}}=this.props
       dispatch({
         type:'DataDictionaryModel/getDataItems',
         payload:{type:type},
    })

  }
  editDict=()=>{
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('选择多项数据时，只允许编辑第一位')
    }
    this.setState({
      drawerVisible:true,
      dataDictDrawerStyle:DATA_DICTIONARY_DETAIL_STATUS.EDIT,
      itemsId:selectedRows[0].id
    })
  };
  listPage=()=>{
    const {dispatch,match:{params:{type}}}=this.props
    dispatch({
      type:'DataDictionaryModel/getDataItems',
      payload:{type:type},
    })
  }
  delDict=()=>{
    const {selectedRows}=this.state
    const {dispatch,match:{params:{type}}}=this.props
    confirm({
      title: `是否删除选中的${selectedRows.length}个数据`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
         selectedRows.forEach((value)=>{
           dispatch({
               type:'DataDictionaryModel/deleteItems',
               payload:{
                 id:value.id,
                 itemsType:type
               }
           })
           //   当可删除和不可删除同时选中
        })
      }
    })

  };

  handleAdd=()=>{
    this.setState({
      drawerVisible:true,
      dataDictDrawerStyle:DATA_DICTIONARY_DETAIL_STATUS.ADD,

    })

  }

  advancedSearch = (params) => {
    let arr=window.location.pathname.split("/")
    const id=arr[arr.length-1];
    console.log( id)
    if(Object.prototype.hasOwnProperty.call(params,'value')){
      console.log(params)
      params={...params,dictId:id}
      const { dispatch } = this.props;
      dispatch({
        type:'DataDictionaryModel/getDataItemsSearch',
        payload:{
          ...params,
          currentPage : 1 ,
          pageSize : 10,
        }
      })
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

  };
  goBack=()=>{//返回
    const {goBack}=this.props.history
    goBack()
  }

  handleAction=(text, record)=>{
    return(
      <span>
        <Tooltip placement="top" title="编辑">
          <a onClick={()=>{this.setState({
            // selectData:text,
            drawerVisible:true,
            dataDictDrawerStyle:DATA_DICTIONARY_DETAIL_STATUS.EDIT,
            itemsId:text.id
          })}}
          >
            <Icon title="编辑" type="edit" />
          </a>
        </Tooltip>
          <Divider type='vertical' />
        <Tooltip placement="top" title="删除">
          <a onClick={() => {

            const {dispatch}=this.props
            confirm({
              title: `是否删除选中的数据 id为${text.id}`,
              okText: '删除',
              cancelText: '取消',
              onOk: () => {
                dispatch({
                  type:'DataDictionaryModel/deleteItems',
                  payload:{
                    id:text.id,
                    itemsType:text.type,
                  }
                })

              }
            })


          }
          }>
            <Icon title="删除" type="delete" />
          </a>
        </Tooltip>
        </span>
    )
  }

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
    },
      {
        func : this.goBack,
        param : [],
        key : 'RETURN',
      },
    ],
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

  columns = [
    {
      title : '字典序号',
      dataIndex : 'id',
      key : 'id',
    },
    {
      title : '值',
      dataIndex : 'value',
      key : 'value',
    },
    {
      title : '标注',
      dataIndex : 'label',
      key : 'label',
    },
    {
      title : '字典类型名',
      dataIndex : 'type',
      key : 'type',
    },
    {
      title : '描述',
      dataIndex : 'description',
      key : 'description',
    },
    {
      title : '备注',
      dataIndex : 'remarks',
      key : 'remarks',
    },
    {
      title: '操作',
      key: 'action',
      render: this.handleAction
    },

  ];

  searchList = [
    {
      title : '字典值',
      field : 'value',
      type : 'input',
    },
    // {
    //   title : '字典标注',
    //   field : 'label',
    //   type : 'input',
    // },
  ];

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };
  render() {
    const {dispatch,DataFetch,DataDictionaryModel:{dataItems},match:{params:{type,id}}} =this.props
    const {selectedRows,dataDictDrawerStyle,drawerVisible,itemsId}=this.state;
    return (
      <>
        <div>
          <PageHeaderWrapper title='字典管理'>
            <AdvancedSearchForm
              searchList={this.searchList}
              doSearch={this.advancedSearch}
              pagination={{}}
            />
            <Card bordered={false}>
              <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows} />
              <StandardTable
                selectDisable={true}
                loading={ DataFetch}
                // selectedRows={selectedRows}
                onSelectRow={this.handleSelectRows}
                columns={this.columns}
                data={ dataItems}
              />
            </Card>
            <Drawer
              title={this.Title[dataDictDrawerStyle]+(dataDictDrawerStyle===DATA_DICTIONARY_DETAIL_STATUS.EDIT?` id为${itemsId}`:'')}
              placement="right"
              closable
              onClose={
                 ()=>{
                   this.closeDrawer()
                 }
               }


               visible={drawerVisible}
               width={800}
              destroyOnClose
             >
               <ItemsDataDetail type={ type}
                                dictId={id}
                                closeDrawer={()=>{this.closeDrawer()}}
                                dataDictDrawerStyle={dataDictDrawerStyle}
                                id={itemsId}

               />
             </Drawer>
           </PageHeaderWrapper>
        </div>
      </>
    )
  }
}

export default DataDictionaryItemsList
