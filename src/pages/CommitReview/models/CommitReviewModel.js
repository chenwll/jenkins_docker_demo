import * as CommitReviewServices from '@/services/CommitReviewServices';
import * as pointManagementServices from '@/services/pointManagement';
import * as guideService from '@/services/applicantGuide';
import { message } from 'antd';

export default {
  namespace: 'CommitReviewModel',

  state : {
    guidePagination:{current:1,size:10},
    rulesPagination:{current:1,size:10},
    departmentsList:[],
    guideData:[],
    adminRulesList:[],
    copyAdminRulesList:[],
    commitDetail:{},
    taskCommitFiles:[]
  },

  effects: {
    *getAdminGuide({payload},{call,put}){
      try{
        const response=yield call(CommitReviewServices.getAdminGuide,payload);
        if(response.code===0){
          const {data:{records,total,size,current}}=response;
          const guidePagination = {current,total,size}
          yield put({
            type:'save',
            payload:{
              guideData:records,
              guidePagination
            }
          })
        }
      }catch (e) {
        console.log(e,'catch error');
      }
    },
    *getUserGuide({payload},{call,put}){
      const response=yield call(CommitReviewServices.getUserGuide,payload);
      if(response.code===0){
        const {data:{records,total,size,current}}=response;
        const guidePagination = {current,total,size}
        console.log(guidePagination,'ooooooooooooo');
        yield put({
          type:'save',
          payload:{
            guideData:records,
            guidePagination
          }
        })
      }
    },
    *getDepartments({payload},{call,put}) {
      const response = yield call(CommitReviewServices.getDepartments,payload)
      if(response.code === 0){
        const {data} = response;
        console.log(data,'data dept');
        yield put({
          type:'save',
          payload:{
            departmentsList:data,
          }
        })
      }
    },
    *getAdminRules({payload},{call,put}){
      try{
        const response = yield call(CommitReviewServices.getAdminRules,payload)
        if(response.code === 0){
          const {data:{records,total,size,current}}=response;
          const rulesPagination = {current,total,size}
          yield put({
            type:'save',
            payload:{
              adminRulesList:records,
              copyAdminRulesList:records,
              rulesPagination
            }
          })
        }
      }catch (e) {
        console.log(e);
      }
    },
    // *getCommit({payload},{call,put}){
    //   try {
    //     const response = yield call(CommitReviewServices.getCommit,payload)
    //     if(response.code === 0){
    //       const {data}=response;
    //       yield put({
    //         type:'save',
    //         payload:{
    //           commitDetail:data
    //         }
    //       })
    //     }
    //   }catch (e) {
    //     console.log(e);
    //   }
    // },
    *getTaskDetail({payload},{call,put}){
      try{
        const response = yield call(CommitReviewServices.getTaskDetail,payload)
        if(response.code === 0){
          const {data}=response;
          console.log(data,'data pppppppppppppppp');
          yield put({
            type:'save',
            payload:{
              commitDetail:data[0]
            }
          })
        }
      }catch (e) {
        console.log(e);
      }

    },
    *submitReview({payload},{call,put}){
      try{
        const response = yield call(CommitReviewServices.submitReview,payload)
        if(response.code === 0){
          const {data}=response;
          yield put({
            type:'save',
            payload:{
              commitDetail:data
            }
          })
          message.success('提交成功')
        }
      }catch (e) {
        console.log(e);
      }
    },
    // 通过文件ID获取文件详细信息
    * getFileMessageById({payload},{call,put}){
      const newPayload = {}
      if(payload.fileIds !== 'null'){
        const fileIdArr = JSON.parse(payload.fileIds)
        const fileIdStr = fileIdArr.reduce((pre, cur) => pre + cur,'')
        newPayload.fileIds = fileIdStr
      }else{
        newPayload.fileIds = 'null'
      }
      const response = yield call(guideService.getFileMessageById, newPayload);
      if(response.code === 0){
        yield put({
          type:'save',
          payload:{
            taskCommitFiles:response.data
          }
        })
      }
    },
  },


  reducers: {
    save(state,{payload}){
      return{
        ...state,
        ...payload
      }
    },
  },
};
