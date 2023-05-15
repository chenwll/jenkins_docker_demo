import {message} from 'antd';
import router from 'umi/router';
import * as EduMangeProjects from '@/services/EduMangeProjects';
import * as fileService from '@/services/files';
import * as departmentService from '@/services/departmentSetting';
import * as GetProjectAllInfoService from '../../../services/getProjectAllInfo';
//新增项目使用
import * as UserSettingService from '@/services/UserSetting';

export default {
  namespace:'EduMangeProjectsModel',
  state:{
    allUser:[],
    projectList:{},
    guideList:{},
    guideListPagination:{  total: 0,
      currentPage: 1,
      pageSize: 10,},
    projectPagination:{currentPage: 1,
      pageSize: 10,},
    projectAllInfo:{},
    projectRecommendInfo:{},
    allGuide:[],
    allDep:[],
    newProjectAllInfo:{},

    //新增时使用
    allUser_Applyer:[],
    schoolUserDetail:{},
    projectId:'',
    contactPagination:{},
    contactList:{},
    //编辑项目时使用
    editProjectData:{},
    allProcess:[]
  },

  effects:{
    *fetch({payload},{call,put}){
      yield call(EduMangeProjects.fetch,payload);
    },

    *getProcessData({payload},{call,put}){
      yield call(EduMangeProjects.getProcess,payload);
    },

    *getGuideList({payload},{call,put}){
      const response=yield call(GetProjectAllInfoService.getGuideList,payload);
      const { data : { rows, pageNumber, pageSize, total} } = response;
      const list = rows;
      const guideListPagination = {
        currentPage : pageNumber||1,
        pageSize,
        total,
      };
      yield put({
        type : 'save',
        payload : {
          guideListPagination,
          guideList:{
            list,
            pagination:guideListPagination
          }
        },
      });
    },
    *getProjectList({payload},{call,put}){
      const response=yield call(GetProjectAllInfoService.getAllProjectList,payload);
      const { data : { rows, pageNumber, pageSize, total} } = response;
      const list = rows;
      const projectPagination = {
        currentPage : pageNumber||1,
        pageSize,
        total,
      };
      yield put({
        type : 'save',
        payload : {
          projectPagination,
          projectList:{
            list,
            pagination:projectPagination
          }
        },
      });
    },
    *getAllProjectDetail({payload},{call,put}){
      const response=yield call(GetProjectAllInfoService.getAllProjectDetail,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            projectAllInfo:response.data
          }
        })
      }
    },
    *getProjectRecommendInfo({payload},{call,put}){
      const response=yield call(GetProjectAllInfoService.getProjectRecommendInfo,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            projectRecommendInfo:response.data
          }
        })
      }
    },
    *getAllGuide({payload},{call,put}) {
      const response = yield call(GetProjectAllInfoService.getAllGuide);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            allGuide:response.data
          }
        })
      }
    },
    *forceRecommend({payload},{call,put}){
      const response=yield call(GetProjectAllInfoService.forceRecommend,payload.setup);
      if(response.code===0){
        message.warning('已强制推荐，请检查相关流程和数据');
        yield put({
          type:'getProjectList',
          payload:{
            currentPage:1,
            pageSize:10,
            guideId:payload.projectListFetch
          }
        })
      }
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
        //此写法兼容可火狐浏览器
        document.body.appendChild(link);
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      }
    },
    *getAlldep({payload},{call,put}){
      const response=yield call(departmentService.getAllData);
      yield put({
        type:'save',
        payload:{
          allDep:response.data
        }
      })
    },

    // 新增项目所用
    *getProjectContact({payload},{call,put}){
      const response=yield call(EduMangeProjects.getProjectContact,payload);
      if(response.code===0){
        const { data : { rows, pageNumber, pageSize, total} } = response;
        const list = rows;
        const contactPagination = {
          currentPage : pageNumber||1,
          pageSize,
          total,
        };

        yield put({
          type:'save',
          payload:{
            contactPagination,
            contactList:{
              list,
              pagination:contactPagination
            }
          }
        })
      }
    },

    *addPerson({payload},{call,put}){
      const response=yield call(EduMangeProjects.addPerson,payload);
      if(response.code===0){
        message.success('新增联系人成功')
      }
      else{
        message.warning('新增联系人失败')
      }
    },

    *getAllUser({payload},{call,put}){
      const  response=yield call(UserSettingService.getAllUser,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            allUser_Applyer:response.data
          }
        })
      }
    },

    *getUser({payload,callback},{call,put}){
      const response=yield call(UserSettingService.getUser,payload);
      if(response.code===0){

        yield put({
          type:'save',
          payload:{
            schoolUserDetail:response.data
          }
        })
        if (callback && typeof callback === 'function'){
          callback(response.data);
        }
      }
      else{
        message.warning('获取信息失败')
      }
      return response;
    },

    *addProjects({payload},{call,put}){
      const response=yield call(EduMangeProjects.addProjects,payload);
      if(response.code===0){
        yield put({
          type: 'global/closeCurrentTab',
          payload: {
            tabName: '新增项目',
          },
        });
        yield put({
          type:'save',
          payload:{
            newProjectAllInfo:{},
            schoolUserDetail:{}
          }
        });
        message.success('项目新增成功');
        yield put({
          type:'getProjectList',
          payload:{
            guideId:payload.guideId,
            currentPage: 1,
            pageSize: 10,
          }
        })
        router.push({pathname: `/EduMangeProjects/ProjectsList/${payload.guideId}`, query: {prevent: true}});
      }
      else {
        message.warning('项目新增失败');
      }
    },


    //编辑项目所用
    *editProject({payload},{call,put}){
      const response=yield call(EduMangeProjects.editProject,payload);
      if(response.code===0){
        message.success('信息修改成功');
        router.push({
          pathname: `/EduMangeProjects/ProjectsList/${payload.guideId}`,
          query: {prevent: true}
        })
      }
      else {
        message.warning('信息修改失败')
      }
    },
    *getProcessAll({payload},{call,put}){
      const response =yield call(EduMangeProjects.getProcessAll,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            allProcess:response.data
          }
        })
        return
      }
      message.error('信息获取失败')
    },
    * getEditPrjInfo({payload}, {call, put}) {
      const response = yield call(EduMangeProjects.getProjectDetail, payload);
      if(response.code == 0) {
        const {data} = response;
        yield put({
          type: 'save',
          payload: {
            editProjectData: data,
          }
        });
        router.push({
          pathname: `/EduMangeProjects/EditProject/EditPage/${payload.guideId}/${payload.projectId}`,
          query: {prevent: true}
        });
      }
      else{
        message.error('项目信息获取失败')
      }
    }
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
  },
}
