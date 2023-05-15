import {message} from 'antd';
import * as DataDictionServiece from '@/services/dataDictionary';
import {getDictionaryItemsBySearch} from "@/services/dataDictionary";
// import {
//   addDictionaryItems, deleteItemsById,
//   editDictionaryItems,
//   getDictionaryByPage,
//   getDictionaryItemsByType
// } from "@/services/dataDictionary";

export default {
  namespace:'DataDictionaryModel',
  state:{
    data:{list:[],pagination:{}},
    dataItems:{list:[],pagination:{}},
    DiationaryDetail:{},
    DiationaryItemsDetail:{},
    pagination:{currentPage: 1,
      pageSize: 10,},

  },

  effects:{
    *fetch({payload},{call,put}){
      const response=yield call(DataDictionServiece.getDictionaryList,payload);
      const {data : { rows, pageNumber, pageSize, total }} = response;
      const datas=response.data
      const list=datas.map((v,i)=>{
            return {...v,numId:i%10+1}
      });
      const pagination = {
        currentPage : pageNumber===0?1:pageNumber,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type:'save',
        payload:{
          data:result,
          pagination
        }
      })
      console.log(result)
    },

    *getItemsById({payload},{call,put}){
      const response=yield call(DataDictionServiece.getItemsById,payload);
      const {data} = response;
      yield put({
        type:"save",
        payload:{
          DiationaryItemsDetail:{...data}
        },
      })
    },

    *deleteItems({payload},{call,put}){
      const response=yield call(DataDictionServiece.deleteItemsById,payload);
      if (response.code===0){
         message.success("删除成功")

      }else {
        message.warning("删除失败")
        return
      }
      yield put({
        type:"getDataItems",
        payload:{
           type:payload.itemsType
        },
      })
    },
    *getDataByPage({payload},{call,put}){
      const response=yield call(DataDictionServiece.getDictionaryByPage,payload);
      const datas=response?.data?.records;
      let list=[]
      if (datas){
        list=[...datas];
      }
      const result = {
        list,
      };
      yield put({
        type:'save',
        payload:{
          data:result,
        }
      })

    },

    *getDataDetail({payload},{call,put}){
      const response=yield call(DataDictionServiece.getDataDictionaryDetailInfo,payload);
      yield put({
        type:'save',
        payload:{
          DiationaryDetail:response.data
        }
      })
    },
    *getDataItems({payload},{call,put}){
      const response=yield call(DataDictionServiece.getDictionaryItemsByType,payload);
      const list=response.data;
      const  result={
             list
      }
      yield put({
        type:'save',
        payload:{
          dataItems:result,
        }
      })
    },


    *editDataDictItems({payload},{call,put}){
      console.log("数据",payload)
      const response=yield call(DataDictionServiece.editDictionaryItems,payload.data);

      yield put({
        type:"getDataItems",
        payload:payload.itemsType,
      })

      if(response.code===0){
        message.success('数据更新成功')
      }
      else {
        message.warning(response?.msg||'改变失败');
      }
      // getDataItems

    },
    *addDataDictItems({payload},{call,put}){
      const response=yield call(DataDictionServiece.addDictionaryItems,payload.data);
      // payload.refresh();
      // console.log(payload.refresh)
      yield put({
        type:"getDataItems",
        payload:payload.itemsType,
      })
      if(response.code===0){
        message.success('数据添加成功')
      }
      else {
        message.warning(response?.msg||'添加失败');
      }
    },
    *editDataDict({payload},{call,put}){
      console.log("数据s",payload)
      const response=yield call(DataDictionServiece.editDataDict,payload.data);// 接口问题
      console.log("请求结束")
      if(response.code===0){
        message.success('数据更新成功')
      }
      yield put({
        type:'fetch',
        payload:payload.pagination
      })
    },

    *addDataDict({payload},{call,put}){
      const response=yield call(DataDictionServiece.addDataDict,payload?.data);
      if(response.code===0){
        message.success('数据新增成功');
      }
      yield put({
        type:'fetch',
        payload:payload.pagination
      })
    },

    *delDataDict({payload},{call,put}){
      const response=yield call(DataDictionServiece.delDataDict,payload.data);
      if(response.code===0){
        message.success('数据删除成功');
      }
      yield put({
        type:'fetch',
        payload:payload.pagination
      })
    },
    *getDataItemsSearch({payload},{call,put}){
      console.log("触发")
      const response=yield call(DataDictionServiece.getDictionaryItemsBySearch,payload);
      const list=response.data.records||[];
      const result={
        list
      }
      yield put({
        type:'save',
        payload:{
          dataItems:result,
        }
      })
    },

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
    saveItems(state,{payload}){
      return(
        {
          ...state,
          ...payload,
        }
      )
    },
    cleanGetDetail(state){
      return {
        ...state,
        DiationaryDetail:{}
      }
    },
    cleanGetItemsDetail(state){
      return {
        ...state,
        DiationaryItemsDetail:{}
      }
    }
  },
}
