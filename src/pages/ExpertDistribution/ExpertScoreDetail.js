import React,{PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Popover,Card,Button,Modal,message} from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import AdvancedSelect from '../../components/AdvancedSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AdvancedSearchForm from '../../components/AdvancedSearchForm';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import styles from '../../utils/styles/StandardTableStyle.less';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({loading,expertDistributionModel})=>({
  loading,
  expertDistributionModel,
  loadingList:loading.effects['expertDistributionModel/getScoreDetail'],
}))

class ExpertScoreDetail extends PureComponent{
  constructor(props) {
    super(props);
    this.state={
      selectedRows: [],
      searchMoreParams:{}
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type:'expertDistributionModel/getExpertGroup'
    })
  }

  doSearch = (val) => {
    const { ...formValues } = val;
    const {dispatch,match:{params}} = this.props;
    const {expertDistributionModel:{expertGroup}} = this.props;
    let  expertGroupId = []; // 每个专家的id组成的数组
    let groupId = '';  //  专家组id
    for(const item of expertGroup){
      if(item.groupId == formValues.groupId){
        expertGroupId=item.expertIds.split(";");
        groupId = item.groupId;
        break;
      }
    }
    const isParamsUndefined = Object.keys(val || {});
    dispatch({
      type:'expertDistributionModel/getScoreDetail',
      payload:{
        processId:params.processId,
        reviewYear:params.reviewYear,
        depExpId:expertGroupId,
        groupId,
        currentPage : 1,
        pageSize : 10,
      }
    })
    if (isParamsUndefined.length !== 0) {
      const { ...searchValue } = val;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
  };}

  onSelectChange = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch,match:{params} } = this.props;
    const { searchMoreParams } = this.state;

    const {expertDistributionModel:{expertGroup}} = this.props;
    let  expertGroupId = [];
    let groupId ='';
      for(const item of expertGroup){
        if(item.groupId == searchMoreParams.groupId){
          expertGroupId=item.expertIds.split(";");
          groupId = item.groupId;
          break;
        }
      }

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const param = {
      ...searchMoreParams,
      ...filters,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      param.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'expertDistributionModel/getScoreDetail',
      payload:{
        processId:params.processId,
        reviewYear:params.reviewYear,
        depExpId:expertGroupId,
        groupId,
        ...param,
      }
    });
  };



  onhandleExportScore = () => {
    Modal.confirm({
      title: '确认导出',
      content: '确定导出评分吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleExportScore(),
    });
  };

  handleExportScore =()=>{
    const {dispatch,match:{params}} = this.props;
    const {expertDistributionModel:{expertGroup,expertScoreDetail}} = this.props;
    let  expertGroupId = '';
    if(expertScoreDetail.groupId){
      for(const item of expertGroup){
        if(item.groupId == expertScoreDetail.groupId){
          expertGroupId=item.expertIds;
        }
      }
      dispatch({
        type:'expertDistributionModel/exportScore',
        payload:{
          processId:params.processId,
          reviewYear:params.reviewYear,
          ids:expertGroupId,
        },
      })
    }
    else
    {
      message.error("暂无评分数据")
    }

  };

  handelBack = ()=>{
    const {match:{params},dispatch} = this.props;
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '评分详情',
      },
    });
    router.push({
      pathname: `/projectEducation/edu/topicProjectListByExpert/${params.guideId}/${params.processId}/${params.processType}/${params.type}/${params.reviewYear}`,
      query: {prevent: true}
    });
  };

  expertsWithIdToString(allExpert=[]){
    allExpert=allExpert.map(item=>{
      item.groupId=item.groupId.toString()
      return item
    });
    return allExpert
  };

  render(){
    const { selectedRows } = this.state;
    const {expertDistributionModel:{expertGroup,expertScoreDetail:{pagination,groupId}},loadingList}=this.props;
    const {expertDistributionModel:{expertScoreDetail}} = this.props;
    const searchList = [
      {
        title: '分配专家组',
        field: 'groupId',
        type: 'other',
        value:groupId?String(groupId):'',
        renderComponent : () => (
          <AdvancedSelect
            dataSource={this.expertsWithIdToString(expertGroup)}
            searchType='FUZZYSEARCH'
            placeholder="请选择专家组"
            fieldConfig={SelectFieldConfig.expertGroup}
            onChange={(value) => {console.log(value)}}
          />
        )},
    ];

    const btnList = {
      primaryBtn: [{
        func: this.onhandleExportScore,
        param: [true, '其他'],
        key: 'EXPORT_SCORE',
      }],
    };

    const columns=[
      {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '',
        key: 'approvalNo',
        dataIndex: 'approvalNo',
        render: (record = "") => {
          const data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          // if (data.length > 14) {
          //   data = data.substring(0, 13);
          //   data = data + "......"
          // }
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
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (record = "") => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 10) {
            data = data.substring(0, 9)
            data += "..."
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
        title:'专家名称',
        key:'expertName',
        dataIndex:'expertName',
      },
      {
        title:'评价分数',
        key:'score',
        dataIndex:'score',
      },
      {
        title:'是否提交',
        key:'commit',
        dataIndex:'commit',
        render:(value)=>{
          if(value){
            return(<span>已提交</span>)
          }
          else{
            return(<span>未提交</span>)
          }
        }
      }
    ];
    return(
      <PageHeaderWrapper>
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.doSearch}
          pagination={pagination}
          loading={loadingList}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loadingList}
              data={expertScoreDetail}
              rowKey={record => record.index}
              onSelectRow={this.onSelectChange}
              columns={columns}
              onChange={this.handleStandardTableChange}
              onRow={(record) => ({
                onDoubleClick: () => {
                  this.doubleClickRow(record)
                }
              })}
            />
          </div>
          <FooterToolbar>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.handelBack} htmlType='button'>
              返回
            </Button>
          </FooterToolbar>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default ExpertScoreDetail
