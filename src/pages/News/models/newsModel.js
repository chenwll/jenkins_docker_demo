import {message} from 'antd';
import router from 'umi/router';
import * as New from  '../../../services/news';
import {getAllRoles} from '../../../services/roleSetting'
import { NEWS_CONTENT_STATE, NEWS_STATUS } from '../../../utils/Enum';

export default {
  namespace:'newsModel',
  state:{
    showNewsId:-1,// 新闻详情的时候也是每次只允许查看一条新闻（同上）
    showStatus:0,// 新闻详情默认为草稿
    addOrEdit:NEWS_STATUS.ADD,// 暂时没有用到（新闻编辑状态编辑项）
    allRoles:[],// 所有角色类型（超级。。）
    newsList: [],
    newsDetail:{},// 新闻编辑时的新闻
    showNewsDetail:{},// 新闻详情时的新闻（与上面不同）
    selectedRows:[],// 为了选中修改，新增之后的表格合理性fetch之后需要清空
    pagination:{
      currentPage: 1,
      pageSize: 10
    },
    visible:false,
    html:''
  },
  effects:{

    *fetch({payload},{call,put}){
      const response=yield call(New.fetch,payload);
      const {data:{rows,pageNumber,pageSize,total}}=response;
      const pagination={
        currentPage:pageNumber||1,
        pageSize,
        total
      }
      yield put({
        type:'save',
        payload:{
          newsList:{
            pagination,
            list:rows,
          },
          pagination,
          selectedRows:[]
        }
      })
    },

    *getNews({payload},{call,put}){// 新闻编辑时的新闻获取
      const response=yield call(New.getNews,payload);
      yield put({
        type:'save',
        payload:{
          newsDetail:response.data
        }
      })
    },

    *getNewsAndGotoEdit({payload},{call,put}){// 新闻编辑时的新闻获取
      const response=yield call(New.getNews,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            newsDetail:response.data,
            addOrEdit:NEWS_STATUS.EDIT
          }
        })
        router.push(`/News/ChangeNews/${payload.newsId}/${payload.addOrEdit}`)
      }
      else{
        message.warning('获取数据失败')
        return
      }
    },

    *getShowNews({payload},{call,put}){// 新闻详情时的新闻获取
      const response=yield call(New.getNews,payload);
      yield put({
        type:'save',
        payload:{
          showNewsDetail:response.data
        }
      })
    },

    *addNews({payload},{call,put}){
      const response=yield call(New.addNews,payload);
      if(response.code===0){
        message.success('新闻新增成功');
        router.push(`/News/NewsSetting`)// 跳转至新闻详情页
        yield put({
          type:'fetch',
          payload:{
            currentPage: 1,
            pageSize: 10
          }
        })
      }
      else{
        message.error('操作失败')
      }
    },

    *editNews({payload},{call,put}){
      const response=yield call(New.editNews,payload);
      if(response.code===0){
        message.success('新闻修改成功');
        router.push(`/News/NewsSetting`)// 跳转至新闻详情页
        yield put({
          type:'fetch',
          payload:{
            currentPage: 1,
            pageSize: 10
          }
        })
      }
      else{
        message.error('操作失败')
      }
    },

    *delNews({payload},{call,put}){
      const response=yield call(New.delNews,payload);
      if(response.code===0){
        message.success('新闻删除成功');
        yield put({
          type:'fetch',
          payload:{
            currentPage: 1,
            pageSize: 10
          }
        })
      }
      else{
        message.error('操作失败')
      }
    },

    *getAllRoles({paylaod},{call,put}){
      const response=yield call(getAllRoles);
      yield put({
        type:'save',
        payload:{
          allRoles:response.data,
        }
      })
    },

    *publish({payload},{call,put}){
      const response=yield call(New.publishNews,payload);
      if(response.code===0){
        if(payload.newsState===NEWS_CONTENT_STATE.text){
          message.success('发布成功')
        }else {
          message.success('撤销成功')
        }
        yield put({
          type:'fetch',
          payload:{
            currentPage:1,
            pageSize:10
          }
        })
        return
      }
      message.error('发布失败')
    },
  },
  reducers:{
    save(state,{payload}){
      return{
        ...state,
        ...payload,
      }
    },
    codeChange(state,{payload}){
      return{
        ...state,
        ...payload,
      }
    },
  }
}
