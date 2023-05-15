import React,{PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Card,Divider,Icon,Tooltip,Modal,message} from 'antd';
import {NEWS_STATUS ,NEWS_CONTENT_STATE,INDEX_NEWSTYPE} from '../../utils/Enum';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import * as basicFunction from '../../utils/utils';
import AdvancedSearchForm from "../../components/AdvancedSearchForm";
import AdvancedSelect from "../../components/AdvancedSelect";

const {confirm}=Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({loading,newsModel,basicdata,global})=>({
  basicdata,
  loading,
  newsModel,
  global,
  fetchLoading:loading.effects['newsModel/fetch']
}))

class News extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      selectedData:[],
      searchMoreParams:{},
    }
  }

  componentDidMount(){
    const {dispatch}=this.props;
    this.listPage();
    dispatch({
      type:'newsModel/getAllRoles'// 创建人角色
    })
  };

  handleSetSort=(type,record)=>{
    const {dispatch}=this.props;
    switch (type) {
      case 'publish':
        this.confirmType('是否确认发布新闻，发布之后不可再次编辑。同时不可删除','publish',{newsId:record.newsId,newsState:NEWS_CONTENT_STATE.text});
        break;// 直接设置状态为发布
      case 'unPublish':
        this.confirmType('是否确认撤销新闻','publish',{newsId:record.newsId,newsState:NEWS_CONTENT_STATE.draft});
        break;// 直接设置状态为发布
      case 'edit':
        dispatch({
          type: 'global/closeCurrentTab',
          payload: {
            tabName: '新闻编辑',
          },
        });
        dispatch({
          type:'newsModel/getNewsAndGotoEdit',
          payload:{
            newsId:record.newsId,
            addOrEdit:NEWS_STATUS.EDIT,
          }
        });
        break;
      case 'delete':
        this.confirmType('是否确认删除新闻','delNews',{id:record.newsId});
        break;
      case 'show':
        dispatch({
          type:'newsModel/getShowNews',
          payload:{
            newsId:record.newsId
          }
        });// 在没有关闭“详情”tag的情况下保证有信息
        dispatch({
          type:'newsModel/save',
          payload:{
            // showNewsName:record.newsName,
            showNewsId:record.newsId,
            showStatus:record.newsState,
          }
        });
        router.push(`/News/ShowNews/${record.newsId}/${record.newsState}`)
        break;
      default:
        break;
    }
  };

  listPage = (params) => {
    const { dispatch,newsModel:{pagination} } = this.props;
    const { searchMoreParams } = this.state;
    const isParamsUndefined = Object.keys(params || {});
    dispatch({
      type : 'newsModel/fetch',
      payload :isParamsUndefined.length !== 0 ? params : { ...pagination, ...searchMoreParams },
    });
    if (isParamsUndefined.length !== 0) {
      const { currentPage, pageSize, ...searchValue } = params;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
    }
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {formValues} = this.state;
    const {searchMoreParams}=this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...searchMoreParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

   this.listPage(params)
  };


  confirmType=(title,type,payload)=>{
    const {dispatch}=this.props;
    return(
      confirm({
        title,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type:`newsModel/${type}`,
            payload
          })
        }
      })
    )
  };

  createAction=(text,record)=>{
    switch (record.newsState) {
      case NEWS_CONTENT_STATE.draft:// 草稿
        return(
          <Fragment>
            <Tooltip title='发布'>
              <a onClick={() => this.handleSetSort("publish", record)}><Icon type="to-top" /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='修改'>
              <a onClick={() => this.handleSetSort("edit", record)}><Icon type="edit" /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='预览'>
              <a onClick={() => this.handleSetSort("show", record)}><Icon type="eye" /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='删除'>
              <a onClick={() => this.handleSetSort("delete", record)}><Icon type="delete" /></a>
            </Tooltip>
          </Fragment>
        )
        break;
      case NEWS_CONTENT_STATE.text:// 发布
        return(
          <Fragment>
            <Tooltip title='查看'>
              <a onClick={() => this.handleSetSort("show", record)}><Icon type="eye" /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='撤销发布'>
              <a onClick={() => this.handleSetSort("unPublish", record)}><Icon type="close" /></a>
            </Tooltip>
          </Fragment>
        )
        break;
      default:
        break
    }
  };

  advancedSearch = (params) => {//  搜索框搜索分页
    if(Object.prototype.hasOwnProperty.call(params,'newsState')||Object.prototype.hasOwnProperty.call(params,'newsType')){//  如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams:params,
      })
    }
    else{//  点击重置
      this.setState({
        searchMoreParams:{}
      })
    }
    const { dispatch } = this.props;
    dispatch({
      type : 'newsModel/fetch',
      payload : params || {
        currentPage : 1 ,
        pageSize : 10,
      },
    });
  };

  handleAdd=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'newsModel/save',
      payload:{
        newsId:0,
        addOrEdit:NEWS_STATUS.ADD,
        newDetail:{}
      }
    });
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '新闻编辑',
      },
    });
    router.push(`/News/ChangeNews/${NEWS_CONTENT_STATE.draft}/${NEWS_STATUS.ADD}`)
  };

  handleSelectRows = (selectedRowKeys, selectedRow)=> {
    this.setState({
      selectedData : selectedRow||selectedRowKeys,
    });
    const {dispatch}=this.props;
    dispatch({
      type:'newsModel/save',
      payload:{
        selectedRows:selectedRowKeys,
      }
    })
  };

  // 以下四个函数是toolbar的操作函数
  publishNews=()=>{
    const {selectedData}=this.state;
    if(selectedData[0].newsState!==0){
      message.warning('该新闻已是发布状态，不允许执行该操作')
      return
    }
    this.handleSetSort("publish",selectedData[0])
  };// 发布

  showNewsDetail=()=>{
    const {selectedData}=this.state;
    this.handleSetSort('show',selectedData[0])
  };// 查看

  editNews=()=>{
    const {selectedData}=this.state;
    if(selectedData[0].newsState!==0){
      message.warning('该新闻已是发布状态，不允许执行该操作')
      return
    }
    this.handleSetSort('edit',selectedData[0])
  };// 修改

  delNews=()=>{
    const {selectedData}=this.state;
    if(selectedData[0].newsState!==0){
      message.warning('该新闻已是发布状态，不允许执行该操作')
      return
    }
    this.handleSetSort('delete',selectedData[0])
  };// 新增

  rowSelection = {
    type: 'radio',
    onChange: this.handleSelectRows,
  };



  render(){
    const {newsModel:{newsList,selectedRows,pagination}}=this.props;
    const {basicdata:{gDictData}}=this.props;
    const {fetchLoading}=this.props;
    const columns=[
      {
        title : '新闻序号',
        dataIndex : 'key',
        key : 'key',
        align: 'center',
        render:(text,record,index)=><span>{index+1}</span>
      },
      {
        title:"新闻名称",
        key:'newsName',
        dataIndex:'newsName',
      },
      {
        title:"新闻状态",
        key:'newsState',
        dataIndex:'newsState',
        render:(text)=>{
          const newsStatus=basicFunction.getDictByType(gDictData,'noticeStatus')// 状态newsState
          const status=newsStatus.filter(item=>{
            if(item.k==text)
              return item
          })
          return(
            <span>{status[0]===undefined?'':status[0].val}</span>
          )
        },
        filters:[{
          text:'草稿',
          value:0
        },{
          text:'发布',
          value:1
        }],
        filterMultiple:false,
      },
      {
        title:"新闻类型",
        key:'newsType',
        dataIndex:'newsType',
        render:(text)=>{
          const newsType=basicFunction.getDictByType(gDictData,'newsType')
          const type=newsType.filter(item=>{
            if(item.k==text)
              return item
          })
          return(
            <span>{type[0]===undefined?'':type[0].val}</span>
          )
        },
        filters:[{
          text:'新闻',
          value:1
        },{
          text:'公告',
          value:0
        }],
        filterMultiple:false,
      },
      {
        title:"操作",
        key:'action',
        dataIndex:'action',
        render:(text,record)=>(
          this.createAction(text,record)
        ),
      },
    ];

   const searchList = [
      {
        title: '新闻名称',
        field: 'newsName',
        type: 'input',
      },
      {
        title: '新闻状态',
        field: 'newsState',
        type: 'other',
        renderComponent: () =>
        {
          const newsState=basicFunction.getDictByType(gDictData,'newsState');
          return <AdvancedSelect dataSource={newsState} type="DATADICT" onChange={this.handleStateChange} />
        }
      },
      {
        title: '新闻类型',
        field: 'newsType',
        type: 'other',
        renderComponent: () => {
          const newsType=basicFunction.getDictByType(gDictData,'newsType');
          return <AdvancedSelect dataSource={newsType} type="DATADICT" onChange={this.handleStateChange} />
        }
      },
    ];
    const btnList = {
      primaryBtn : [{
        func : this.handleAdd,
        param : [],
        key : 'ADD',
      },{
        func : this.listPage,
        param : {},
        key : 'REFRESH',
      }],
      patchBtn : [
        {
          func : this.publishNews,// 发布
          param : {},
          key : 'NEWS_PUBLISH',
        },{
          func: this.editNews,// 修改
          param: {},
          key: 'EDIT',
        }, {
          func : this.delNews,// 删除
          param : {},
          key : 'DELETE',
        },{
          func:this.showNewsDetail,// 查看（预览和详情）
          param:{},
          key:'NEWS_DETAIL'
        }]
    };

    return(
      <PageHeaderWrapper title='新闻编辑'>
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.advancedSearch}
          pagination={pagination}
        />
        <Card>
          <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
          <StandardTable
            data={newsList}
            loading={fetchLoading}
            columns={columns}
            selectedRows={selectedRows}
            rowSelection={this.rowSelection}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.newsId}
          >
          </StandardTable>
        </Card>
      </PageHeaderWrapper>
    )
  };
}
export default News;
