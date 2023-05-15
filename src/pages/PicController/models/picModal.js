import {message} from 'antd';
import * as picService from '@/services/picController';

export default {
  namespace: 'picModal',
  state: {
    selectItem:'',
    pagination: {},
    detailData: {},
    PicListData: [],

  },
  effects: {
    //  新增图片
    * add({payload}, {call, put}) {
      const response = yield call(picService.addPictrue, payload);
      if (response.code === 0) {
        message.success('添加成功' );
      }
      else {
        message.error('添加失败:' + response.msg);
      }
    },
    //  图片列表
    * fetch({payload}, {call, put}) {
      const response = yield call(picService.listPicture, payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const pagination = {
        currentPage: pageNumber,
        pageSize,
        total,
      };
      const PicListData=rows;
      yield put({
        type: 'save',
        payload: {
          PicListData,
          pagination
        },
      });

    },

    //  获取指南detail
    * getPicture({payload}, {call, put}) {
      const response = yield call(picService.getPicture, payload);
      yield put({
        type: 'save',
        payload: {
          detailData: response.data,
        },
      });
    },

    * deletePicture({payload}, {call, put}) {
      const response = yield call(picService.deletePicture, payload);
      if(response.code ===0)
      {
        message.success('数据删除成功!');
        yield put({
          type: 'fetch',
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
    update(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },

  }
};
