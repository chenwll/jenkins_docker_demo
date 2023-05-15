import * as endSubmitRule from '@/services/endSubmitRule';
import { message } from 'antd';

export default {
  namespace: 'endSubmitRuleModel',

  state : {
    tree: [],
    allList: [],
    itemSelect: {},
    itemTree:{},
    rootId:null,
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      // payload = payload || {rootId:1}
      // const response =  yield call(endSubmitRule.getItemTree,payload)
      //本段代码逻辑为首先发送请求从后端拿到所有根节点数据，然后遍历所有的根节点拿到所有数据Tree，但是也有可能只有一棵树，那就可以使用上述代码
      const response = yield call(endSubmitRule.allRule)
      const { data = [] } = response
      // const Tree = []
      // for(let i = 0; i< data.length; i++){
      //   const tree = yield call(endSubmitRule.getItem,{ruleId: data[i].rootRuleId})
      //   if(tree.code === 0){
      //     Tree.push(tree.data)
      //   }
      // }
      yield put({
          type : 'updata',
          payload : {
            tree: data
          },
        });
    },
    * addRule({ payload },{ call, put, select}) {
      const response = yield call(endSubmitRule.addRule, payload);
      message.success(response.msg);
      const rootId = yield select(state => state.endSubmitRuleModel.rootId)
      yield put({
        type: 'getItemTree',
        payload: {rootId},
      })
     
    },
    * editRule({ payload },{ call, put,select}) {
      const response = yield call(endSubmitRule.editRule, payload);
      message.success(response.msg);
      const rootId = yield select(state => state.endSubmitRuleModel.rootId)
      yield put({
        type: 'getItemTree',
        payload: {rootId},
      })
    },
    * deleteRule({ payload },{ call, put,select}) {
      const response = yield call(endSubmitRule.deleteRule, payload);
      message.success(response.msg);
      const rootId = yield select(state => state.endSubmitRuleModel.rootId)
      yield put({
        type: 'getItemTree',
        payload: {rootId},
      })
    },
    * deleteRuleSystem({ payload },{ call, put,select}) {
    const response = yield call(endSubmitRule.deleteRuleSystem, payload);
    message.success(response.msg);
    yield put({
      type:'fetch',
      payload:null
    })
  },
    * allRule(_, { call, put}) {
      const response = yield call(endSubmitRule.allRule);
      yield put({
        type: 'updata',
        payload:{
          allList: response.data,
        }
      })
    },
    * getItem({ payload },{ call, put}) {
      const response = yield call(endSubmitRule.getItem,payload);
      yield put({
        type: 'updata',
        payload:{
          itemSelect: response.data,
        }
      })
    },
    * getItemTree({ payload },{ call, put}) {
      const response = yield call(endSubmitRule.getItemTree,payload);
      const { data } = response;
      yield put({
        type:'updata',
        payload:{
          itemTree:data
        }
      })
    },
    * copyTreeNode({ payload },{ call, put}){
      const response = yield call(endSubmitRule.copyTreeNode,payload);
      if(response.code === 0){
        yield put({
          type:'fetch',
          payload:null
        })
      }
    }
  },

  reducers: {
    updata(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  },
};
