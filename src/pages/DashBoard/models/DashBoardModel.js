import {message} from 'antd';
import * as DashBoard from '@/services/DashBoard';
import * as GetProjectAllInfoService from '../../../services/getProjectAllInfo';
import {GUIDE_STAGE} from '../../../utils/Enum';

export default {
  namespace:'DashBoardModel',
  state:{
    data:[],
    pagination:{},
    DiationaryDetail:{},
    allGuides:[],
    allNews:[],
    guideStatis:[],
    TopicGuide:0,
    ConcludeGuide:0,
    DeclareGuide:0,
    RegTopicGuide:0,
    RegConcludeGuide:0,
    ExpTopicGuide:0,
    ExpConcludeGuide:0,
    RegDeclareGuide:0,
    allDeclareGuide:0,
    allDeclarePrj:0,
    getDeclarePrj:[],
    schoolData:[],
    reguserData:0,
    statisForSchoolJudgeByProcess:{}
  },

  effects:{
    *getReguser({payload},{call,put}){
      const response=yield call(DashBoard.getReguser);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            reguserData:response.data.total
          }
        })
        return
      }
    },

    *getSchool({payload},{call,put}){
      const response=yield call(DashBoard.getSchool);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            schoolData:response.data
          }
        })
        return
      }
    },

    *getStatis({payload},{call,put}){
      const response=yield call(DashBoard.getStatis,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            guideStatis:response.data
          }
        })
        return
      }
      message.warning('指南统计数据获取失败')
    },

    *getProcessAndSchoolStatis({payload},{call,put}){
      const response=yield call(DashBoard.getProcessAndSchoolStatis,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            statisForSchoolJudgeByProcess:response.data//高校类型和流程阶段两个变量
          }
        })
      }
      else
        message.warning('信息获取失败')
    },

    *getAllGuideList({payload},{call,put}){
      const response=yield call(GetProjectAllInfoService.getAllGuide);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            allGuides:response.data
          }
        })
      }
      else{
        message.warning('获取信息失败')
      }
    },

    *getAllNews({payload},{call,put}){
      const response=yield call(DashBoard.getAllNews);
      if(response.code===0){
        yield put({
          type:'saveNews',
          payload:{
            allNews:response.data
          }
        })
      }
      else{
        message.warning('获取信息失败')
      }
    },

    *getDeclareGuide({payload},{call,put}){
      const response=yield call(DashBoard.getDeclareGuide,payload);
      if(response.code===0){
        yield put({
          type:'saveNews',
          payload:{
            allDeclareGuide:response.data.total
          }
        })
      }
      else{
        message.warning('获取信息失败')
      }
    },

    *getStaticsGuide({payload},{call,put}){
      const response=yield call(DashBoard.getStaticsGuide,payload);
      if(response.code===0){
        switch (payload.guideStage) {
          case GUIDE_STAGE.DECLARE:
            yield put({
              type:'save',
              payload:{
                DeclareGuide:response.data.total
              }
            })
            break;
          case GUIDE_STAGE.TOPIC:
            yield put({
              type:'save',
              payload:{
                TopicGuide:response.data.total
              }
            })
            break;
          case GUIDE_STAGE.CONCLUDE:
            yield put({
              type:'save',
              payload:{
                ConcludeGuide:response.data.total
              }
            })
            break;
          default:
            break;

        }
      }
      else{
        message.warning('获取信息失败')
      }
    },

    *getRegstaticsGuide({payload},{call,put}){
      const response=yield call(DashBoard.getRegstaticsGuide,payload);
      if(response.code===0){
        switch (payload.guideStage) {
          case GUIDE_STAGE.DECLARE:
            yield put({
              type:'save',
              payload:{
                RegDeclareGuide:response.data.total
              }
            })
            break;
          case GUIDE_STAGE.TOPIC:
            yield put({
              type:'save',
              payload:{
                RegTopicGuide:response.data.total
              }
            })
            break;
          case GUIDE_STAGE.CONCLUDE:
            yield put({
              type:'save',
              payload:{
                RegConcludeGuide:response.data.total
              }
            })
            break;
          default:
            break;

        }
      }
      else{
        message.warning('获取信息失败')
      }
    },

    *getScore({payload},{call,put}){
      const response=yield call(DashBoard.getScore,payload);
      if(response.code===0){
        switch (payload.guideStage) {
          case GUIDE_STAGE.TOPIC:
            yield put({
              type:'save',
              payload:{
                ExpTopicGuide:response.data.total
              }
            })
            break;
          case GUIDE_STAGE.CONCLUDE:
            yield put({
              type:'save',
              payload:{
                ExpConcludeGuide:response.data.total
              }
            })
            break;
          default:
            break;

        }
      }
      else{
        message.warning('获取信息失败')
      }
    },

    *getDeclarePrj({payload},{call,put}){
      const response=yield call(DashBoard.getDeclarePrj);
      if(response.code===0){
        yield put({
          type:'saveNews',
          payload:{
            getDeclarePrj:response.data
          }
        })
      }
      else{
        message.warning('获取信息失败')
      }
    },

  },


  reducers:{
    save(state,{payload}){
      return(
        {
          ...state,
          ...payload,
        }
      )
    },

    saveNews(state,{payload}){
      return(
        {
          ...state,
          ...payload,
        }
      )
    },
  },
}
