import * as fieldTripsRule from '@/services/fieldTripsRules';
import { message } from 'antd';

export default {
  namespace: 'FieldTripsRulesModel',

  state : {
   ruleGroup:[],
   currentGroupId:null,
   currentGroup:[],
   currentGroupMessage:{},
   currentRuleMessage:{}
  },

  effects: {
    //获取所有规则分组
    * getAllGroup({payload},{put,call}){
        const response = yield call(fieldTripsRule.getAllGroup,payload)
        yield put({
            type:'updata',
            payload:{
                ruleGroup:response.data
            }
        })
    },
    //获取当前规则分组的详细规则
    * getCurrentGroup({payload},{put,call}){
        const response = yield call(fieldTripsRule.getCurrentGroup,payload)
        yield put({
            type:'updata',
            payload:{
                currentGroup:response.data
            }
        })
    },
    //获取当前规则分组的详细信息
    * getCurrentGroupMessage({payload},{put,call}){
        const response = yield call(fieldTripsRule.getCurrentGroupMessage,payload)
        yield put({
            type:'updata',
            payload:{
                currentGroupMessage:response.data
            }
        })
    },
    //添加规则分组
    * createGroup({payload},{put,call}){
        const response = yield call(fieldTripsRule.createGroup,payload)
        if(response.code === 0){
          message.success('添加成功')
          yield put({
            type:'getAllGroup',
            payload:null
          })
        }
    },
    //编辑规则分组
    * EditGroup({payload},{put,call}){
        const response = yield call(fieldTripsRule.EditGroup,payload)
        if(response.code === 0){
          message.success('修改成功')
          yield put({
            type:'getAllGroup',
            payload:null
          })
        }
    },
    //删除规则分组
    * deleteGroup({payload},{put,call}){
        const response = yield call(fieldTripsRule.DeleteGroup,payload)
        if(response.code === 0){
          message.success('删除成功')
          yield put({
            type:'getAllGroup',
            payload:null
          })
        }
    },
    //新增规则
    * createRule({payload},{put,call,select}){
        console.log('payload',payload);
        const response = yield call(fieldTripsRule.createRule,payload)
        if(response.code === 0){
          message.success('新增成功')
          const groupId = yield select(state => state.FieldTripsRulesModel.currentGroupId)
          yield put({
            type:'getCurrentGroup',
            payload:{
              groupId:groupId
            }
          })
        }
    },
    //修改规则
    * editRule({payload},{put,call,select}){
        const response = yield call(fieldTripsRule.editRule,payload)
        if(response.code === 0){
          message.success('修改成功')
          const currentGroupId = yield select(state => state.FieldTripsRulesModel.currentGroupId)
          yield put({
            type:'getCurrentGroup',
            payload:{
              groupId:currentGroupId
            }
          })
        }
    },
    //删除规则
    * deleteRule({payload},{put,call,select}){
        const response = yield call(fieldTripsRule.deleteRule,payload)
        if(response.code === 0){
          message.success('删除成功')
          const groupId = yield select(state => state.FieldTripsRulesModel.currentGroupId)
          yield put({
            type:'getCurrentGroup',
            payload:{
              groupId:groupId
            }
          })
        }
    },
    //得到规则详细信息
    * getRule({payload},{put,call}){
        const response = yield call(fieldTripsRule.getRule,payload)
        if(response.code === 0){
          yield put({
            type:'updata',
            payload:{
              currentRuleMessage:response.data
            }
          })
        }
    },
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
