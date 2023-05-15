import { message } from 'antd';
import * as expertScoreServers from '../../../services/expertScore';
import * as departmentScoreServers from '../../../services/departmentScore';
import * as departmentSetting from '@/services/departmentSetting'
import * as guideService from '@/services/eguide';
import * as expertRecommendServices from '@/services/expertRecommend'
import * as fileService from '@/services/files';
import * as projectStaticsEduService from '@/services/projectStatics';

export default {
  namespace: 'projectScoreModel',

  state : {
    ruleTree: {},
    ruleList: [],
    vetoList: [],
    state: 0,
    score: 0,
    departList:[],
    guideList:[],
    detail: {},
    gradeSelect: ['4'],
    projectName: '',
    api: [{
      score: expertScoreServers,
      detail: expertRecommendServices,
    },{
      score: departmentScoreServers,
      detail: projectStaticsEduService,
    }],
    gradeData: '0',
  },

  effects: {
    *getRule({ payload }, { call, put, select }) {
      const { scoreId, type} = payload;
      const stateTmp = yield select(_ => _.projectScoreModel);
      const { api } = stateTmp;
      const response = yield call(api[type].score.getRule, {scoreId});
      // let sortFunction= function(a,b){
      //     return a.weight-b.weight;
      // }

      if(response.code === 0) {
        const ruleList = [];
        const vetoList = [];
        const loop = (node, arr1, arr2, key) => {
          node.forEach((item) => {
            if(!item.score) {
              item.score = 0;
            }
            if(item.veto != '1') {
              arr1.push(item);
            } else {
              arr2.push(item);
            }
            if (item[key] && item[key].length !== 0) {
              loop(item[key], arr1, arr2, key);
            }
          });
        };
        const { prjScore: ruleTree, state, score, grade, projectName} = response.data;
        loop([ruleTree], ruleList, vetoList,'subScore')
        yield put({
          type: 'update',
          payload: {
            ruleList,
            vetoList,
            ruleTree,
            state,
            score,
            gradeSelect: [String(grade)],
            gradeData: String(grade),
            projectName,
          }
        })
      }
    },
    * getProjectDetail( {payload}, {call, put, select}) {
      const { type,...other} = payload;
      const stateTmp = yield select(_ => _.projectScoreModel);
      const { api } = stateTmp;
      const response = yield call(api[type].detail.projectGet, other);
      yield put({
        type: 'update',
        payload :{
          detail: response.data || {},
        }
      })
    },
    *saveScore({payload,callback}, {put, call, select}) {
      const { prjScore,type,...other} = payload;
      const { prjScoreList, grade } = other;
      const tempScore = JSON.stringify(prjScore);
      localStorage.setItem('scoreTree',tempScore);
      const stateTmp = yield select(_ => _.projectScoreModel);
      const { api } = stateTmp;
      const response = yield call(api[type].score.setScore, other);
      if(response.code === 0) {
        message.success('保存成功');
        if (callback && typeof callback === 'function'){
          callback(response);
        }
        yield put({
          type: 'update',
          payload: {
            ruleTree: prjScore,
            ruleList: prjScoreList,
            gradeData: grade
          }
        })
      } else {
        message.error('保存失败！！');
      }
    },
    * getAllDepart(_, {call, put}) {
      const response = yield call(departmentSetting.getAllData);
      let departList = [];
      if(response.data) {
        departList = response.data
      }
      yield put({
        type: 'update',
        payload: {
          departList,
        }
      })
    },
    * getAllGuide(_, {call, put}) {
      const response = yield call(guideService.queryRegAll);
      let guideList = [];
      if(response.data) {
        guideList = response.data
      }
      yield put({
        type: 'update',
        payload: {
          guideList,
        }
      })
    },
    *submitScore({payload,callback}, {call,select}) {
      const stateTmp = yield select(_ => _.projectScoreModel);
      const { api } = stateTmp;
      const {type,...other} = payload;
      const response = yield call(api[type].score.setSubmit, other);
      if(response.code === 0) {
        if (callback && typeof callback === 'function'){
          callback(response);
        }
        message.success('提交成功');
      }
      else{
        message.error('提交失败');
      }
    },
    *downLoadFile({payload},{call,put}){
      const {fileName: downLoadFileName} = payload;
      const response = yield call(fileService.downloadFile, payload);
      if (response.code && response.code !== 0) {
        message.error('下载文件失败');
      }
      else {
        yield put({type: 'saveFile', payload: {blob: response.resultData, fileName: downLoadFileName}})
      }
    },
    *saveFile({payload: {blob, fileName}}, {call}) {
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
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  },
};
