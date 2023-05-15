import * as ClassicService from '@/services/classicCase';
import {message} from 'antd';
import router from 'umi/router';
import  {PROJECT_IMPLEMENTATION_PLAN} from '../../../utils/Enum.js';

export default {
  namespace: 'classicCaseModal',
  state: {

    pagination: {},
    detailData: {},
    fileType:'',
    reviewYear:'',

    classicCase:{
      status:PROJECT_IMPLEMENTATION_PLAN.NOT_SAVE,
      seeSubmit:false,
    },  //  项目实践方案
  },
  effects: {

    *getClassicCase({payload},{call,put}){
      payload = payload ? payload : {currentPage: 1};
      const response = yield call(ClassicService.getAnnexList, payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };

      yield put({
        type: 'save',
        payload: {classicCase: result,pagination},
      });
      // yield put({
      //   type: 'saveTotal',
      //   payload: {total},
      // });
    },

    *addClassicCase({payload},{call,put}){
      const response = yield call(ClassicService.addAnnex,payload);
      if(response.code === 0){
        message.success('新增成功!');
        yield put({
          type:`save`,
          payload:{
            classicCase:{
              ...payload,
              status:PROJECT_IMPLEMENTATION_PLAN.SAVE,
            },
          }
        });
        yield put({
          type: 'getClassicCase',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId
          }
        });
      }
      else{
        message.error('新增失败!');
      }
    },

    *editClassicCase({payload}, {call, put}) {
      const response = yield call(ClassicService.editAnnex, payload);
      if(response.code ===0)
      {
        message.success('数据更新成功!');
        yield put({
          type: 'getClassicCase',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId
          }
        });

      }
      else{
        message.error('数据更新失败!');
      }
    },

    *submitClassicCase({payload},{call,put}){
      const response = yield call(ClassicService.submitAnnex,payload.data);
      if(response.code === 0){
        message.success('数据更新成功');
        // yield put({
        //   type:`save`,
        //   payload:{
        //     classicCase:{
        //       ...payload,
        //       status:PROJECT_IMPLEMENTATION_PLAN.SAVE,
        //     },
        //   }
        // });
        yield put({
          type:'getClassicCase',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId,
          },
        });
      }
      else{
        message.error('数据更新失败！');
      }
    },


    * deleteClassicCase({payload}, {call, put}) {
      const response = yield call(ClassicService.deleteAnnex, payload.data);
      if(response.code ===0)
      {
        message.success('数据删除成功!');
        yield put({
          type:`save`,
          payload:{
            classicCase:{
              ...payload,
              status:PROJECT_IMPLEMENTATION_PLAN.SAVE,
            },
          }
        });
        yield put({
          type:'getClassicCase',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId,
          },
        });
      }
      else{
        message.error('数据删除失败!');
      }

    },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },

    saveDetail(state, {payload}) {
      return {
        ...state,
        detailData: payload.data,
      };
    },
    showModel(state, {payload}) {
      return {
        ...state,
        visible: true,
        fileType:payload.fileType,
        currentRow:payload.conclusionId,
      };
    },
    hiddenModal(state) {
      return {
        ...state,
        visible: false,
        currentRow: {}
      };
    },
    saveTotal(state, {payload}) {
      return {
        ...state,
        ...payload
      };
    },
  }
};
