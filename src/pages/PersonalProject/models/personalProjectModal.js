import {message} from 'antd';
import router from 'umi/router';
import * as personalProjectService from '@/services/personalProject';
import * as guideService from '@/services/applicantGuide';
import * as fileService from '@/services/files';
import * as departmentSetting from '@/services/departmentSetting';
import * as guideAllService from '@/services/eguide';
import  {PROJECT_STATUS,PROJECT_IMPLEMENTATION_PLAN, RULE_DECLARATION_TYPE } from '../../../utils/Enum.js';
import {clickDownLoadFile} from '../../../utils/utils.js';

export default {
  namespace: 'personalProjectModal',
  state: {
   // data: [],
   // list: [],
    // fileList:[],//upload插件中的fileList参数
    addProjectData: {}, //  新增申报项目数据
    pagination: {
      current: 1,
      size: 10,},
    detailData: {},  //  guideDetail的数据
    guideListData: [],
    departList: [],
    guideList: [],
    projectListData: [],
    projectContextDetail: {}, // 详情页detail
    getAllAboutPrj: {},  //  申报项目修改数据
    projectContactListData: [],
    monthNewsPaperListData: [],
    visible: false,  //  项目联系人的弹框是否可见
    title: '项目联系人',
    projectContactFlag:'add',
    currentRow: { }, //  项目联系人数据,
    monthNewspaperDetailData:{}, //  项目月报数据\
    seeSubmit:false,
    RuleListData:[],// 申报第一步规则数据
    copyRuleListData:[],// 申报第一步规则数据
    RuleTaskData:[],
    currentRuleId:null,
    currentRule:{},
    currentGuideId:null,
    currentGuide:{},
    commitDetail:{},// 通过reportId获取的申报详情
    uploadFileIdList:[],
    currentReportId:null,// 当前reportId
    status:null,
    lastTimeRuleId:null,
    taskCommitFiles:[],
    projectImplementationPlan:{
      status:PROJECT_IMPLEMENTATION_PLAN.NOT_SAVE,
    },  //  项目实践方案
  },
  effects: {
    //  指南列表
    * fetch({payload}, {call, put}) {
        const response = yield call(guideService.queryList, payload);
        const {data: {records, current,size, total},data} = response;
        // const pagination = {
        //   current,
        //   pageSize:size,
        //   size,
        //   total,
        // };
        // const result = {
        //   list:records,
        //   pagination,
        // };
        yield put({
          type: 'save',
          payload: {
            RuleListData: data,
            copyRuleListData:data,
          },
        });
    },

    // 通过部门ID 规则ID 获取需要上传文件的task
    * getRuleTask({payload},{call,put}){
        const response = yield call(guideService.getRuleTask, payload);
        const { data = [] } = response
        yield put({
            type:'save',
            payload:{
              RuleTaskData:data,
            }
        })
    },

    // 上传文件
    * uploadFile({payload},{call,put, select}){
      const response = yield call(guideService.uploadFile, payload.formData);
      if(response.code === 0){
        const { currentReportId  } = yield select(state => state.personalProjectModal)
        const { taskId, type, taskCommitId } = payload.currentTaskCommit
        yield put({
          type:'bindFileAndTaskCommit',
          payload:{
            reportId:currentReportId,
            taskId,
            type,
            taskCommitId,
            fileIdList:[response.data.id]
          }
        })
        yield put({
          type:'saveUploadFileId',
          payload:{
            taskCommitId:payload.taskCommitId,
            file:response.data
          }
        })
      }
    },

    // 提交申报
    * commitTask({payload},{call,put}){
      const response = yield call(guideService.commitTask, payload);
      if(response.code === 0){
        message.success('操作成功')
        yield put({
          type:'save',
          payload:{
            currentReportId:response.data.reportId
          }
        })
      }
    },


    // 删除上传文件 先解绑再删除文件
    *removeUploadFile({payload},{call,put}){
      const response = yield call(guideService.removeUploadFile, payload.fileName);
      if(response.code === 0){
        yield put({
          type:'saveUploadFileId',
          payload:{
            ...payload
          }
        })
      }
    },

    // 上传文件后，将文件Id和taskcommit绑定
    *bindFileAndTaskCommit({payload},{call,put,select}){
      const response = yield call(guideService.bindFileAndTaskCommit, payload);
      if(response.code === 0){
        const { currentRuleId,currentGuideId } = yield select(state => state.personalProjectModal)
        const { sysUser } = yield select(state => state.user)
        yield put({
          type:'getRuleTask',
          payload:{
            departmentId:sysUser.departmentId,
            ruleId:currentRuleId,
            guideId:currentGuideId
          }
        })
      }
    },

    // 通过reportId获取已申报内容
    * getCommitDetail({payload},{call,put}){
      const response = yield call(guideService.getCommitDetail, payload);
      if(response.code === 0){
        const { commitDetailList } = response.data
        for (let index = 0; index < commitDetailList.length; index += 1) {
          const element = commitDetailList[index];
          element.fileIdList = element.fileIdList ? element.fileIdList : []
          for (let i = 0; i < element.fileIdList.length; i += 1) {
            const value = element.fileIdList[i];
            yield put({
              type:"getFileMessageById",
              payload:{
                taskCommitId:element.taskCommitId,
                fileId:value,
                commitId:element.commitId
              }
            })
          }
        }
        yield put({
          type:'save',
          payload:{
            commitDetail:response.data
          }
        
        })
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

    // 解除文件ID与taskCommit绑定
    * unbindFileAndTaskCommit({payload},{call,put,select}){
      const response = yield call(guideService.unbindFileAndTaskCommit, payload);
      if(response.code === 0){
        const { currentRuleId,currentGuideId } = yield select(state => state.personalProjectModal)
        const { sysUser } = yield select(state => state.user)
        yield put({
          type:'getRuleTask',
          payload:{
            departmentId:sysUser.departmentId,
            ruleId:currentRuleId,
            guideId:currentGuideId
          }
        })
      }
    },

    // 改变report状态为提交状态
    * changeReportStateToCommit({payload},{call,put}){
      const response = yield call(guideService.changeReportStateToCommit, payload);
      if(response.code === 0){
        message.success("提交成功")
        router.push('/PersonalProject/ProjectSubmit/taskCommitSuccess')
      }
    }
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    update(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    showModal(state, action) {
      return {
        ...state,
        visible: true,
        currentRow: {...state.currentRow, ...action.payload},
      };
    },
    hiddenModal(state) {
      return {
        ...state,
        visible: false,
        currentRow: {},
        projectContactFlag:'add',
      };
    },
    clearEditInfo(state){
      return{
        ...state,
        currentRow: {},
      }
    },
    // 保存上传文件id 由于嵌套过多 所以单独编写函数
    saveUploadFileId(state, {payload}){
      const { taskCommitId,file,fileName } = payload
      const { uploadFileIdList } = state
      if(fileName && fileName.fileName){
        for (let i = 0; i < uploadFileIdList.length; i += 1) {
          const item = uploadFileIdList[i];
          if(item.taskCommitId === taskCommitId){
            for (let index = 0; index < item.fileIdList.length; index += 1) {
              const element = item.fileIdList[index];
              if(element.fileName === fileName.fileName){
                item.fileIdList.splice(index,1)
                break
              }
            }
            break
          }
        }
      }else{
        for (let i = 0; i < uploadFileIdList.length; i += 1) {
          const item = uploadFileIdList[i];
          if(item.taskCommitId === taskCommitId){
           item.fileIdList.push(file)
           break
          }
        }
      }
      
      
      return {
        ...state,
        ...{uploadFileIdList}
      }
    }
  }
};


