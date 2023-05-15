import React, {PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import {Form, Card, Popover, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import styles from '../../utils/styles/StandardTableStyle.less';
import {FLOW_TYE,FLOW_PROCESSSTAGE_TYPE,GUIDE_STATE} from '../../utils/Enum';
import * as utils from "../../utils/utils";
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import AdvancedSelect from '../../components/AdvancedSelect';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({guideFlowsModal,basicdata,loading}) => ({
  guideFlowsModal,
  basicdata,
  loading: loading.models.guideFlowsModal,

}))
@Form.create()

class GuideSetList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      searchMoreParams:{},
    };
  }

  componentDidMount() {
    this.listPage({
      currentPage: 1,
      pageSize: 10,
    });
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    const {searchMoreParams}=this.state;
    let newParams={};
    if(Object.prototype.hasOwnProperty.call(params,'refresh')){
      newParams={
        ...searchMoreParams,
        currentPage : 1 ,
        pageSize : 10,
      };
    }
    else{// 是否是分页之后的刷新和分页
      newParams={
        ...searchMoreParams,
        ...params
      }
    }
    dispatch({
      type: 'guideFlowsModal/fetch',
      payload: newParams || {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  advancedSearch = (params) => {// 搜索框搜索分页
    if(Object.prototype.hasOwnProperty.call(params,'guideBrief')||Object.prototype.hasOwnProperty.call(params,'state')||Object.prototype.hasOwnProperty.call(params,'guideName')){// 如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams:{
          ...params,
        }
      })
    }
    else{// 点击重置
      this.setState({
        searchMoreParams:{}
      })
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'guideFlowsModal/fetch',
      payload : {// 搜索之后总是第一页
        ...params,
        currentPage : 1 ,
        pageSize : 10,
      },
    });
  };


  handleSelectRows = (rows) => {
    if (rows.length > 1) {
      message.error('不能在多个指南下建立项目!');
    }
    this.setState({
      selectedRows: rows,
    });
  };


  // handleUse = e => {
  //   const {selectedRows} = this.state;
  //   router.push(`/PersonalProject/GuideFlowsList/ProjectSubmit/${selectedRows[0].guideId}/1`);
  // };

  handleSetFlow =(flowType,processType,record) =>{
    if(processType===FLOW_PROCESSSTAGE_TYPE.PROJECT_APPROVAL){
      // if(record.state<GUIDE_STATE[5].value){
        const {dispatch}= this.props;
        dispatch({
          type: 'guideFlowsModal/save',
          payload: {
            flowType,
            processType,
            selectGuideData:record,
          },
        });
        router.push({pathname:`/GuideFlows/GuideFlowList/${flowType}/${processType}/${record.guideId}/${record.state}`,query:{prevent:true}});
    }else if(processType===FLOW_PROCESSSTAGE_TYPE.PROJECT_CONCLUSION){
        const {dispatch}= this.props;
        dispatch({
          type: 'guideFlowsModal/save',
          payload: {
            flowType,
            processType,
            selectGuideData:record,
          },
        });
        router.push({pathname:`/GuideFlows/GuideFlowList/${flowType}/${processType}/${record.guideId}/${record.state}`,query:{prevent:true}});
    }
   }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const {searchMoreParams}=this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...searchMoreParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'guideFlowsModal/fetch',
      payload: params,
    });
  };

  render() {
    const {guideFlowsModal: {guideListData, pagination}, loading} = this.props;
    const {basicdata:{gDictData}}=this.props;
    const {selectedRows} = this.state;
    const btnList = {
      primaryBtn: [{
        func: this.listPage,
        param : {refresh:true},
        key: 'REFRESH',
      }],
    };

    const searchList = [
      {
        title: '指南名称',
        message: '指南名称必填(测试)',
        field: 'guideName',
        type: 'input',
      },
      {
        title: '指南简称',
        field: 'guideBrief',
        type: 'input',
      },
      {
        title: '指南状态',
        field: 'state',
        type: 'other',
        renderComponent: () => <AdvancedSelect
          dataSource={utils.getDictByType(gDictData,'guideState')}
          fieldConfig={SelectFieldConfig.userDetail}
          searchType="DATADICT"
          onChange={()=>{}}
          placeholder='请选择指南状态'
        />
      },
    ];

    const columns = [
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 80,
      },
      {
        title: '指南名称',
        dataIndex: 'guideName',
        key: 'guideName',
        align: 'left',
        width: 120,
        render: (record = "") => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 10) {
            data = data.substring(0, 9)
            data += "......"
          }
          return (
            <Popover
              content={record}
              autoAdjustOverflow
              mouseEnterDelay={0.2}
              placement='right'
            >
              <a>{data}</a>
            </Popover>
          )
        },
      },
      {
        title: '指南简称',
        dataIndex: 'guideBrief',
        key: 'guideBrief',
        align: 'left',
        width: 80,
      },
      {
        title: '建立时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 85,
      },
      {
        title: '指南状态',
        dataIndex: 'state',
        key: 'state',
        align: 'left',
        width: 100,
        render:  (v)=> utils.getAllDictNameById(gDictData,"guideState",v)||""
      },
      {
        title: '高校立项流程',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleSetFlow(FLOW_TYE.COLLEGES_TYPE,FLOW_PROCESSSTAGE_TYPE.PROJECT_APPROVAL, record)}>配置</a>
          </Fragment>
        ),
      },
      {
        title: '非高校立项流程',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleSetFlow(FLOW_TYE.UN_COLLEGES_TYPE,FLOW_PROCESSSTAGE_TYPE.PROJECT_APPROVAL, record)}>配置</a>
          </Fragment>
        ),
      },
      {
        title: '高校结项流程',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleSetFlow(FLOW_TYE.COLLEGES_TYPE,FLOW_PROCESSSTAGE_TYPE.PROJECT_CONCLUSION, record)}>配置</a>
          </Fragment>
        ),
      },
      {
        title: '非高校结项流程',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleSetFlow(FLOW_TYE.UN_COLLEGES_TYPE,FLOW_PROCESSSTAGE_TYPE.PROJECT_CONCLUSION, record)}>配置</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="指南列表">
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.advancedSearch}
          pagination={pagination}
          loading={loading}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={guideListData}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowSelection={null}
            />
          </div>
        </Card>

      </PageHeaderWrapper>
    )
  }
}

export default GuideSetList;
