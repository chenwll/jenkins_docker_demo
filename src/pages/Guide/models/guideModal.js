import { message } from 'antd';
import { dispose } from 'echarts/lib/echarts';
import * as guideService from '@/services/eguide';
import * as fileService from '@/services/files';
import { EDIT_FLAG } from '../../../utils/Enum';
import { clickDownLoadFile } from '../../../utils/utils';
import * as endSubmitRule from '@/services/endSubmitRule';
import {
  addTaskCommitById,
  editEvaluationDept,
  getAllDepartment,
  getEvaluationDept, getEvaluationDeptById,
  getTaskCommitById,
} from '@/services/eguide';

export default {
  namespace: 'guideModal',
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
    selectedRows: {}, // 在新建指南第二步中，获取当前选中的某一行的具体信息，用于第三页展示
    departmentTree: [],// 新建指南第三步，选择部门下拉框的数据
    tasks: [],// 第二步到第三步，获取对应ruleID,rootRuleId下的tasks
    taskList: [],// 这是给第二步渲染表格用的，原来是ruleTree,现在是这个
    taskId: 1, // 提交文件申报要求时应该提交的内容，这一数据应该在新增部门规则任务后由后端返回！！！
    guideId: 0,  // 新增guide后返回，给第三部用s
    rootRuleId: null,// 新增,查看，修改都要看
    taskCommit: [],
    rootRules: [],  // 第一步新建指南选择新规则
    taskCommits: {},
    editStatus: 0,// 通过这个字段判断修改时指南的状态，-1表示点击的是新建,0为初稿，1为已审核,2为发布
    guideDetail: {},
  },
  effects: {
    * fetch({ payload }, { call, put, select }) {
      payload = payload || { currentPage: 1, pageSize: 10 };
      // 因为后端接收的参数改变，直接从源头控制分页的参数
      payload.current = payload.currentPage;
      payload.size = payload.pageSize;
      const roleName = yield select(state => state.user.roleName);
      let response;
      if (roleName==='超级管理员'){
        response = yield call(guideService.queryList, payload);
      }
      else {
        response = yield call(guideService.queryList_USER,payload);
      }
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

    * getGuideById({ payload }, { call, put }) {
      const response = yield call(guideService.getGuideById, payload);
      if (response.code === 0) {
        const { data: guideDetail } = response;
        yield put({
          type: 'save',
          payload: { guideDetail },
        });
      }
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

    * getAllTask({ payload }, { call, put, select }) {
      const rootRuleId = yield select(state => state.guideModal.rootRuleId);
      // const roleName = yield select(state => state.user.roleName);
      console.log('* getAllTask', rootRuleId);
      // if (roleName==='超级管理员'){
      //   response = yield call(guideService.getAllTasks_ADMIN, { rootRuleId });
      // }else {
      //   response = yield call(guideService.getAllTasks_USER, { rootRuleId });
      // }
      const response = yield call(guideService.getAllTasks, { rootRuleId });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            taskList: response.data,
          },
        });
      }
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

    * getEvaluationDept({ payload, callback }, { call, put, select }) {
      const rootRuleId = yield select(state => state.guideModal.rootRuleId);
      const roleName = yield select(state => state.user.roleName);
      let response;
      if (roleName === '超级管理员') {
        response = yield call(guideService.getEvaluationDept_ADMIN, { rootRuleId, ruleId: payload.ruleId });
      } else {
        response = yield call(guideService.getEvaluationDept_USER, { rootRuleId, ruleId: payload.ruleId });
      }

      console.log('*getEvaluationDept,payload,response', payload, response);
      if (callback && typeof callback === 'function') {
        callback(response.data);
      }
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: { tasks: response.data },
        });
      }
    },

    * getEvaluationDeptById({ payload }, { call, put, select }) {
      const response = yield call(guideService.getEvaluationDeptById, payload);
      console.log('* getEvaluationDeptById,payload,response', payload, response);
      const tasks = yield select(state => state.guideModal.tasks);
      tasks[payload.taskId] = response.data.records;
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: { tasks },
        });
      }
    },

    * addEvaluationDept({ payload, callback }, { call, put, select }) {
      const roleName = yield select(state => state.user.roleName);
      let response;
      if (roleName === '超级管理员') {
        response = yield call(guideService.addEvaluationDept_ADMIN, payload);
      } else {
        response = yield call(guideService.addEvaluationDept_USER, payload);
      }

      const { ruleId, rootRuleId } = payload;
      console.log('*fetchDepartment,payload,response', payload, response);
      if (response.code === 0) {
        message.success('新增成功');
        if (callback && typeof callback === 'function') {
          callback(response.data);
        }
        yield put({
          type: 'getAllTask',
        });
        yield put({
          type: 'getEvaluationDept',
          payload: { ruleId, rootRuleId },
        });
        yield put({
          type: 'save',
          payload: { taskId: response.data },
        });
      }
    },

    * editEvaluationDept({ payload }, { call, put }) {
      const response = yield call(guideService.editEvaluationDept, payload);
      console.log('*editEvaluationDept,payload,response', payload, response);
      if (response.code === 0) {
        message.success('修改成功');
        // yield put({
        //   type:'save',
        //   payload:{taskId: response.data}
        // })
      }
    },

    * deleteEvaluationDept({ payload }, { call, put, select }) {
      const response = yield call(guideService.deleteEvaluationDept, payload.taskId);
      console.log('* deleteEvaluationDept,payload,response', payload, response);
      const { ruleId, rootRuleId } = payload;
      if (response.code === 0) {
        message.success('删除成功');
        yield put({
          type: 'getAllTask',
        });
        yield put({
          type: 'getEvaluationDept',
          payload: { ruleId, rootRuleId },
        });
        // 删除成功后step3的页面应该不显示，但这一步操作并不由数据驱动，因此后面没操作了！！！
      }
    },

    * editTaskDetails({ payload }, { call, put, select }) {
      const response = yield call(guideService.editTaskDetail, payload);
      console.log('*editTaskDetails,response,payload', response, payload);
      if (response.code === 0) {
        message.success('修改成功');
        yield put({
          type: 'getAllTask',
          payload: [],
        });
      }
    },

    * getTaskCommit({ payload }, { call, put, select }) {
      const response = yield call(guideService.getTaskCommitById, { taskId: payload.taskId });
      console.log('*getTaskCommit,payload,response', payload, response);
      let records = [];
      if (response.code === 0) {
        const { data } = response;
        if (data !== undefined) {
          records = data.records;
        }
        console.log('*getTaskCommit,payload,response', data);
        yield put({
          type: 'save',
          payload: {
            taskCommit: records,
          },
        });
        const taskCommits = yield select(state => state.guideModal.taskCommits);
        taskCommits[payload.taskId] = records;
        yield put({
          type: 'save',
          payload: { taskCommits },
        });
      }
    },

    * addTaskCommit({ payload }, { call, put }) {
      const response = yield call(guideService.addTaskCommit, payload);
      console.log('*addTaskCommit,payload,response', payload, response);
      const { taskId } = payload;
      if (response.code === 0) {
        message.success('新增成功');
        yield put({
          type: 'getTaskCommit',
          payload: { taskId },
        });
      }
    },

    * deleteTaskCommit({ payload }, { call, put }) {
      const response = yield call(guideService.deleteTaskCommit, payload.taskCommitId);
      console.log('*deleteTaskCommit,payload,response', payload, response);
      const { taskId } = payload;
      if (response.code === 0) {
        message.success('删除成功');
        yield put({
          type: 'getTaskCommit',
          payload: { taskId },
        });
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
      console.log('* editGuide', payload);
      const response = yield call(guideService.editGuide, payload.data);

      if (response.code === 0) {
        message.success('修改成功');
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
      const response = yield call(guideService.deleteGuide, payload);
      console.log('* deleteGuide', payload, response);
      if (response.code === 0) {
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
        // 原来新增是在第一页，现在后续逻辑都删除，只留下存储id的操作
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
