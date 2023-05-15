import * as guideService from '@/services/eguide';
import * as fileService from '@/services/files';
import { message } from 'antd';
import { EDIT_FLAG } from '../../../utils/Enum';
import { clickDownLoadFile } from '../../../utils/utils';
import { dispose } from 'echarts/lib/echarts';
import * as endSubmitRule from '@/services/endSubmitRule';
import { addTaskCommitById, getAllDepartment, getEvaluationDept, getTaskCommitById } from '@/services/eguide';

export default {
  namespace: 'guideUserModal',
  state: {
    guideData: [],
    stateData: [],
    fileList: [],
    rules: [],
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    detailData: {},
    editFlag: EDIT_FLAG.ADD,
    selectItem: 0,// 当前选中需要修改和删除的ID
    visibleViewYear: false,  // 评审的弹框是否可见
    reviewYearData: {
      beginYear: '',
      endYear: '',
    },
    ruleTree: [],
    selectedRows: {}, //在新建指南第二步中，获取当前选中的某一行的具体信息，用于第三页展示
    departmentTree: [],//新建指南第三步，选择部门下拉框的数据
    tasks: [],//第二步到第三步，获取对应ruleID,rootRuleId下的tasks
    taskId: 1, //提交文件申报要求时应该提交的内容，这一数据应该在新增部门规则任务后由后端返回！！！
    guideId: 0,  //新增guide后返回，给第三部用s
    rootRuleId: 1,//新增,查看，修改都要看
    taskCommit: [],
    rootRules: [],  //第一步新建指南选择新规则
  },
  effects: {
    * fetch({ payload }, { call, put }) {
      payload = payload ? payload : { currentPage: 1, pageSize: 10 };
      //因为后端接收的参数改变，直接从源头控制分页的参数
      payload.current = payload.currentPage;
      payload.size = payload.pageSize;
      const response = yield call(guideService.queryUserList, payload);
      const { data: { records, current, size, total } } = response;
      console.log('* fetch,payload,response', payload, response);
      const list = records;
      const pagination = {
        currentPage: current || 1,
        pageSize: size,
        total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type: 'save',
        payload: { guideData: result, pagination },
      });

    },

    // * fetchRules({ payload }, { call, put }) {
    //   // payload = payload || {rootId:1}
    //   // const response =  yield call(endSubmitRule.getItemTree,payload)
    //   //本段代码逻辑为首先发送请求从后端拿到所有根节点数据，然后遍历所有的根节点拿到所有数据Tree，但是也有可能只有一棵树，那就可以使用上述代码
    //   const response = yield call(endSubmitRule.allRule)
    //   const { data = [] } = response
    //   const Tree = []
    //   console.log("* fetchRules,response",response)
    //   for(let i = 0; i< data.length; i++){
    //     const tree = yield call(endSubmitRule.getItemTree,{rootId:data[i].rootRuleId})
    //     console.log("* fetchRules,response",tree)
    //     if(tree.code === 0){
    //       Tree.push(tree.data)
    //     }
    //   }
    //   yield put({
    //     type : 'save',
    //     payload : {
    //       ruleTree: Tree
    //     },
    //   });
    // },

    * fetchRules({ payload }, { call, put, select }) {
      const Tree = [];
      const rootRuleId = yield select(state => state.guideModal.rootRuleId);
      console.log('* fetchRules,rootRuleId', rootRuleId);
      const tree = yield call(endSubmitRule.getItemTree, { rootId: rootRuleId });
      console.log('* fetchRules,response', tree);
      if (tree.code === 0) {
        Tree.push(tree.data);
      }
      yield put({
        type: 'save',
        payload: {
          ruleTree: Tree,
        },
      });
    },

    * fetchDepartment({ payload }, { call, put }) {
      const response = yield call(guideService.getAllDepartment, payload);
      console.log('*fetchDepartment,response', response);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            departmentTree: response.data,
          },
        });
      }

    },

    * getAllRootRule(_, { call, put }) {
      const response = yield call(endSubmitRule.allRule);
      yield put({
        type: 'save',
        payload: {
          rootRules: response.data,
        },
      });
    },

    * getEvaluationDept({ payload }, { call, put }) {
      const response = yield call(guideService.getEvaluationDept, { ruleId: payload.ruleId });
      console.log('*getEvaluationDept,payload,response', payload, response);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: { tasks: response.data },
        });
        payload.resolve();
      }
    },

    * addEvaluationDept({ payload }, { call, put }) {
      const {resolve} = payload
      delete payload.resolve
      const response = yield call(guideService.addEvaluationDept, payload);
      console.log('*fetchDepartment,payload,response', payload, response);
      if (response.code === 0) {
        message.success('新增成功');
        yield put({
          type:'save',
          payload:{taskId: response.data}
        })
        resolve()
      }
    },

    * getTaskCommit({ payload }, { call, put }) {
      const response = yield call(guideService.getTaskCommitById, { taskId: payload.taskId });
      console.log('*getTaskCommit,payload,response', payload, response);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            taskCommit: response.data.records,
          },
        });
        payload.resolve();
      }
    },

    * addTaskCommit({ payload }, { call, put }) {
      const { resolve } = payload;
      delete payload.resolve;
      const response = yield call(guideService.addTaskCommit, payload);
      console.log('*addTaskCommit,payload,response', payload, response);
      if (response.code === 0) {
        message.success('新增成功');
        resolve();
      }
    },

    * deleteTaskCommit({ payload }, { call, put }) {
      const response = yield call(guideService.deleteTaskCommit, payload.taskCommitId);
      console.log('*deleteTaskCommit,payload,response', payload, response);
      if (response.code === 0) {
        message.success('删除成功');
        payload.resolve();
      }
    },

    * getState({ payload }, { call, put }) {
      const response = yield call(guideService.getState, payload);
      yield put({
        type: 'saveState',
        payload: {
          data: response.data,
        },
      });
    },

    * editGuide({ payload }, { call, put }) {
      const response = yield call(guideService.editGuide, payload.data);
      if (response.code === 0) {
        message.success('修改成功');
        yield put({
          type: 'fetch',
          payload: {
            currentPage: payload.pagination.currentPage,
            pageSize: payload.pagination.pageSize,
          },
        });
      } else
        message.error('修改失败');
    },

    * getGuide({ payload }, { call, put }) {
      const response = yield call(guideService.getDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: {
          data: response.data,
        },
      });
      yield put({
        type: 'save',
        payload: {
          reviewYearData: response.data,
        },
      });
    },

    * getRules({ payload }, { call, put }) {
      const response = yield call(guideService.allRule, payload);
      yield put({
        type: 'saveRules',
        payload: {
          data: response.data,
        },
      });
    },

    * deleteGuide({ payload }, { call, put }) {
      const response = yield call(guideService.deleteGuide, payload.data);
      if (response.code === 0) {
        yield put({
          type: 'fetch',
          payload: {
            currentPage: payload.pagination.currentPage,
            pageSize: payload.pagination.pageSize,
          },
        });
        message.success('删除成功');
      } else
        message.error('删除失败');
    },

    * nextState({ payload }, { call, put }) {
      const response = yield call(guideService.nextState, payload.data);
      if (response.code === 0) {
        message.success('状态进阶成功');
        yield put({
          type: 'fetch',
          payload: {
            currentPage: payload.pagination.currentPage,
            pageSize: payload.pagination.pageSize,
          },
        });
      } else
        message.error('状态进阶失败');

    },

    * revoke({ payload }, { call, put }) {
      const response = yield call(guideService.revoke, payload.data);
      if (response.code === 0) {
        message.success('撤回成功');
        yield put({
          type: 'fetch',
          payload: {
            currentPage: payload.pagination.currentPage,
            pageSize: payload.pagination.pageSize,
          },
        });
      } else {
        message.error('撤回失败');
      }
    },

    * downLoadFile({ payload }, { call, put }) {
      const { fileName: downLoadFileName } = payload;
      const response = yield call(fileService.downloadFile, payload);
      if (response.code && response.code !== 0) {
        message.error('下载文件失败');
      } else {
        yield put({ type: 'saveFile', payload: { blob: response.resultData, fileName: downLoadFileName } });
      }
    },
    * saveFile({ payload: { blob, fileName } }, { call }) {
      clickDownLoadFile(blob, fileName);
    },
    * addGuide({ payload }, { call, put }) {
      const response = yield call(guideService.addGuide, payload.data);
      console.log('* addGuideaddGuide,payload,dispatch', payload, response);
      if (response.code === 0) {
        message.success('新增成功');
        yield put({
          type: 'save',
          payload: {
            guideId: response.data,
          },
        });
        //原来新增是在第一页，现在后续逻辑都删除，只留下存储id的操作
        // yield put({
        //   type: 'fetch',
        //   payload:{
        //     currentPage:payload.pagination.currentPage,
        //     pageSize:payload.pagination.pageSize
        //   },
        // });
        // yield put({
        //   type: 'getGuide',
        //   payload: {
        //     guideId: response.data,
        //   }
        // });
        // yield put({
        //   type: 'save',
        //   payload: {
        //     editFlag: EDIT_FLAG.EDIT,
        //   },
        // });
      }
    },
    * addFile({ payload }, { call, put }) {
      const response = yield call(fileService.UploadFile, payload);
      if (response.code === 0) {
        message.success('上传成功!');
        // 调用一个方法，改变fileList，触发render,以此来保证每次上传时都会显示在文件列表当中
      }
    },
    * delFile({ payload }, { call, put }) {
      const response = yield call(fileService.delFile, payload);
      if (response.resultData.code === 0) {
        yield put({
          type: 'save',
          payload: {
            data: payload.detailData,
          },
        });
        message.success('删除成功!');
      } else {
        message.error('删除失败!');
      }
    },
    * addReviewYear({ payload }, { call, put }) {
      const response = yield call(guideService.addReviewYear, payload.data);
      if (response.code === 0) {
        message.success('修改评审年份成功!');
        yield put({
          type: 'hiddenModal',
        });
        yield put({
          type: 'fetch',
          payload: {
            currentPage: payload.pagination.currentPage,
            pageSize: payload.pagination.pageSize,
          },
        });
      } else {
        message.error('新增评审年份失败!');
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveDepartment(state, { payload }) {
      return {
        ...state,
        ruleTree: payload.data,
      };
    },
    saveState(state, { payload }) {
      return {
        ...state,
        stateData: payload.data,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detailData: payload.data,
      };
    },
    saveRules(state, { payload }) {
      return {
        ...state,
        rules: payload.data,
      };
    },
    saveEditItem(state, { payload }) {
      return {
        ...state,
        selectItem: payload.data.id,
      };
    },
    saveEditFlag(state, { payload }) {
      return {
        ...state,
        editFlag: payload.editFlag,
      };
    },
    showModal(state, action) {
      return {
        ...state,
        visibleViewYear: true,
        currentRow: { ...state.currentRow, ...action.payload },
      };
    },
    hiddenModal(state, action) {
      return {
        ...state,
        visibleViewYear: false,
        currentRow: { ...state.currentRow, ...action.payload },
      };
    },
  },

};
