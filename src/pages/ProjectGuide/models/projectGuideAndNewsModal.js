import * as projectguideServer from '@/services/projectguide';
import { message } from 'antd';
import * as fileService from '@/services/files';
import {INDEX_NEWSTYPE} from '../../../utils/Enum';

export default {
  namespace: 'projectGuideAndNewsModal',

  state: {
    data: [],
    list: [],
    allRoles:[],// 所有角色
    announcements:{},// 通知公告
    news:{},// 新闻
    detail: {},
    newsDetail:{},// 新闻详情
    totalAll:'',
    // announcements:[], //通知公告
    reform:[],   // 改革动态
    operationGuide:[],
    img:[],
  },



  effects: {
    * getGuideList({ payload }, { call, put }) {
      payload = payload || { currentpage: 1 };
      const response = yield call(projectguideServer.getGuideList, payload);
      const { data: { rows, pageNumber, pageSize, total, totalPage } } = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber,
        pageSize,
        total: totalPage,
        allTotal:total
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type: 'saveGuideList',
        payload: result,
      });

    },
    *getGuideDetail({payload},{call,put}){
      const response=yield call(projectguideServer.getGuideDetail,payload);
      yield put({
        type:'saveGuideDetail',
        payload:response.data
      })
    },
    *getNewsList({payload},{call,put}){
      payload = payload || { currentpage: 1 };
      const response=yield call(projectguideServer.getNewsList,payload);
      if(response.code===0){
        const {data:{rows, pageNumber, pageSize, total, totalPage}}=response;
        const list = rows;
        const pagination = {
          currentPage: pageNumber,
          pageSize,
          total: totalPage,
          allTotal:total
        };
        const result = {
          list,
          pagination,
        };
        yield put({
          type:'saveNewsList',
          payload: {
            result,
            newsType:payload.newsType
          },

        })
      }
      else message.error('获取新闻/公告失败')
    },
    *getNewsDetail({payload},{call,put}){
      const response=yield call(projectguideServer.getNewsDetail,payload);
      yield put({
        type:'saveNewsDetail',
        payload:{
          newsDetail:response.data,
        }
      })
    },
    *downLoadFile({payload},{call,put}){
      const {fileName: downLoadFileName} = payload;
      const response = yield call(fileService.downloadFile, payload);
      if (response.code &&response.code!==0) {
        message.error('下载文件失败');
      }
      else {
        yield put({type: 'saveFile', payload: {blob: response.resultData, fileName: downLoadFileName}})
      }
    },
    * saveFile({payload: {blob, fileName}}, {call}) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        // 此写法兼容可火狐浏览器
        document.body.appendChild(link);
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      }
    },

    *getLikeNewsNum({payload},{call,put}){
      const response=yield call(projectguideServer.getLikeNewsNum,payload);
      if(response.code === 0){
        message.success('点赞成功！');
        yield put({
          type:"getNewsDetail",
          payload:{newsId:payload.newsId}
        });
        yield put({
          type:'saveLikeNews',
          payload:response.data
        })
      }else {
        message.error('点赞失败！');
      }

    },

    *getLikeGudieNum({payload},{call,put}){
      const response=yield call(projectguideServer.getLikeGudieNum,payload);
      if(response.code === 0){
        message.success('点赞成功！');
        yield put({
          type:"getGuideDetail",
          payload:{guideId:payload.guideId}
        })
        yield put({
          type:'saveLikeGuide',
          payload:response.data
        })
      }else {
        message.error('点赞失败！');
      }
    },

    *getImg({payload},{call,put}){
      const response=yield call(projectguideServer.getImg,payload);
      const { data: { rows } } = response;
      yield put({
        type:'saveImg',
        payload:{rows}
      })
    },
  },



  reducers: {
    saveGuideList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    saveGuideDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },

    saveNewsList(state,action){
      if(action.payload.newsType==INDEX_NEWSTYPE.ANNOUNCEMENTS){
        return{
          ...state,
          announcements:action.payload.result
        }
      }
      if(action.payload.newsType == INDEX_NEWSTYPE.REFORM){
        return{
          ...state,
          reform:action.payload.result
        }
      }
      if(action.payload.newsType == INDEX_NEWSTYPE.OPERATIONGUIDE) {
        return{
          ...state,
          operationGuide:action.payload.result
        }
      }
    },

    saveNewsDetail(state,{payload}){
      return{
        ...state,
        ...payload
      }
    },

    saveLikeNews(state,{payload}){
      return{
        ...state,
        ...payload
      }
    },

    saveLikeGuide(state,{payload}){
      return{
        ...state,
        ...payload
      }
    },

    saveImg(state,action){
      return{
        ...state,
        img:action.payload.rows
      }
    },
  },
};
