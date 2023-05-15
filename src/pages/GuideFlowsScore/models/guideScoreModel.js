import * as guideFlowsScore from '@/services/guideFlowsScore';
import * as endSubmitRule from '@/services/endSubmitRule';
import { message } from 'antd';

export default {
  namespace: 'guideScoreModel',

  state : {
    data: {},
    endRule: [],
    tree: [],
    itemSelect: {},
  },

  effects: {
    * fetch({payload}, {call, put}) {
      payload = payload || { currentpage: 1 };
      const response = yield call(guideFlowsScore.guideScoreRuleList, payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber,
        pageSize,
        total,
      };
      const data = {
        list,
        pagination,
      };
      yield put({
        type: 'update',
        payload: {
          data,
        },
      });
    },
    * allEndRule({payload}, {call, put}) {
      const response = yield call(endSubmitRule.allRule,payload);
      yield put({
        type: 'update',
        payload: {
          endRule: response.data
        }
      })
    },
    * add({payload}, {call, put}) {
      const response = yield call(guideFlowsScore.guideScoreRuleCopy,payload);
      if(response.code == 0)
      {
        message.success('新增成功!');
        yield put({
          type: 'fetch',
          payload: {
            currentPage : 1,
            pageSize : 10,
          }
        })
      }
      else{
        message.error('新增失败!');
      }
    },
    * del({payload}, {call, put}) {
      yield call(guideFlowsScore.guideScoreRuleDel,payload);
      message.success('操作成功！')
      yield put({
        type: 'fetch',
        payload: {
          currentPage : 1,
          pageSize : 10,
        }
      })
    },
    * getTree({payload}, {call, put}) {
      const response = yield call(guideFlowsScore.guideScoreRuleTree,payload);
      if(response.data!=null){
        yield put({
          type: 'update',
          payload: {
            tree: [response.data],
          }
        })
      }
      else{
        yield put({
          type: 'update',
          payload: {
            tree: [],
          }
        })
      }
    },
    * getItem({ payload },{ call, put}) {
      const response = yield call(guideFlowsScore.guideScoreRuleGet,payload);
      yield put({
        type: 'update',
        payload:{
          itemSelect: response.data,
        }
      })
    },
    * editRule({ payload },{ call, put}) {
      const { data, params } = payload;
      const response = yield call(guideFlowsScore.guideScoreRuleEdit, data);
      message.success(response.msg);
      yield put({
        type: 'getTree',
        payload: params,
      })
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
