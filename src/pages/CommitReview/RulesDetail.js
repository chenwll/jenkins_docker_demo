import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button,
  Card,
  Divider,
  Icon,
  Tooltip,
  Form,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AdvancedSearchForm from '@/components/AdvancedSearchForm';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import AdvancedSelect from '@/components/AdvancedSelect';
import TableFilterDrop from '@/components/TableFilter/tableFilterDrop';
import { getAuthority } from '@/utils/utils';
import FooterToolbar from '@/components/FooterToolbar';
import CommitModal from '@/pages/CommitReview/CommitModal';

@connect(({CommitReviewModel,loading,user})=>({
  CommitReviewModel,
  user,
  rulesLoading:loading.effects['CommitReviewModel/getAdminRules']
}))
@Form.create()
class RulesDetail extends PureComponent {

  constructor(props) {
    const {match: { params: { id: guideId } }} = props;
    super(props);
    this.state = {
      checkData:{},
      currentPage:1,
      pageSize:10,
      visible:false,
      taskId:1,
      guideId,
      report:{},

    };
  }

  componentDidMount() {
    this.getRolesList()
    this.getAdminRules()
  }


  getAdminRules = (value) => {
    const roles = getAuthority()
    const {dispatch} =this.props;
    const {match: { params: { id: guideId } }} = this.props;
    switch (roles[0]) {
      case '超级管理员':
        dispatch({
          type:'CommitReviewModel/getAdminRules',
          payload: { ...value,guideId,admin:true }
        });
        break;
      default:
        dispatch({
          type:'CommitReviewModel/getAdminRules',
          payload: { ...value,guideId,admin:false }
        })
        break;
    }
  }

  handleStandardTableChange = (value,filtersArg) => {
    const { status = []} = filtersArg;
    const {pageSize:size, current} = value;
    this.getAdminRules({current,size,status:status[0]})
  }

  // 返回表格筛选数据
  getTableFilter = (data,key) => {
    const dataArr = []
    data.forEach((item)=>{
      if(dataArr.indexOf(item[key]) === -1){
        dataArr.push(item[key])
      }
    })
    return dataArr.map((item) => ({
        value:item,
        label:item
      }))
  }

  getRolesList = () => {
    const {match: { params: { id: guideId } }} = this.props;
    const {dispatch} =this.props;
    dispatch({
      type:'CommitReviewModel/getDepartments',
      payload:{guideId}
    });
  }

  // 获取到过滤数据并存储到state中
  getCheckData = (value) => {
    const {checkData} = this.state
    this.setState({
      checkData:{
        ...checkData,
        ...value
      }
    },this.onFilter)
  }

  // 过滤函数
  onFilter = () => {
    const { CommitReviewModel:{ copyAdminRulesList}, dispatch} = this.props
    const { checkData } = this.state
    let filterData = []
    let index = 0
    for(const key in checkData) {
      if (Object.hasOwnProperty.call(checkData, key)) {
        const filterValueData = checkData[key];
        if(!index){
          filterData = this.FilterItem(filterValueData,key,copyAdminRulesList)
        }else{
          filterData = this.FilterItem(filterValueData,key,filterData)
        }
        index += 1
      }
    }
    this.setState({
      currentPage:1,
      pageSize:10
    })
    dispatch({
      type:'CommitReviewModel/save',
      payload:{
        adminRulesList:filterData.length ? filterData : copyAdminRulesList
      }
    })
  }

  FilterItem = (filterValueData, key,originData) => {
    const filterData = []
    for (let index = 0; index < filterValueData.length; index+=1) {
      const element = filterValueData[index];
      for (let i = 0; i < originData.length; i+=1) {
        const value = originData[i];
        if(value[key] === element){
          filterData.push(value)
        }
      }
    }
    return filterData
  }

  // 得到列合并数
  getRowSpan = (value, data, key,index,current,size) => {
    const right = current*size < data.length ? current*size : data.length
    const left = (current - 1) * size
    const pageData = data.slice(left,right)
    if(!pageData.length) return []
    let result = 0
    const currentData = pageData[index]
    if(index !== 0 && currentData[key] === pageData[index -1][key]){
      return result
    }
    if(index === 0 || currentData[key] !== pageData[index -1][key]){
      result += 1
      for (let i = index + 1; i < pageData.length; i+=1) {
        const nextData = pageData[i];
        if(currentData[key] === nextData[key]){
          result += 1
        }else{
          break;
        }
      }
    }
    return result
}

  // 表格页数变化函数
  tablePageChange = (current, size) =>{
    this.setState({
        currentPage:current,
        pageSize:size
    })
}

  changeDept = (value) => {
    console.log(value);
  }

  buildDepartment = () => {
    const {CommitReviewModel:{departmentsList=[]}}=this.props;
    const fieldConfig = {
      key : 'departmentId',
      value : 'departmentId',
      text : 'departmentName',
    }
    return <AdvancedSelect
      dataSource={departmentsList}
      onChange={this.changeDept}
      fieldConfig={fieldConfig}
    />
  }

  back = () => {
    router.goBack()
  }

  goReview = (record) => {
    console.log(record);
    const {taskId} = record
    this.setState({
      taskId,
    })
    this.openModal()
  }

  openModal = () => {
    this.setState({
      visible:true,
    })
  }

  closeModal = () => {
    this.setState({
      visible:false
    })
  }

  showInfo = () => {

  }

  advancedSearch = (val) => {
    this.getAdminRules(val)
  }

  createAction = (text, record) => {
    const {commitCount} = record;
    if(commitCount === 0) return null;
    return  (
      <>
        <Tooltip title='查看'>
          <a onClick={() => this.showInfo(record)}>
            <Icon type="eye" />
          </a>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title='去评审'>
          <a onClick={() => this.goReview(record)}>
            <Icon type="arrow-right" />
          </a>
        </Tooltip>
        <Divider type="vertical" />
      </>
    )

  }


  buildAdvancedSearchForm = () => {
    const roles = getAuthority()
    const searchList = [
      {
        title: '牵头部门',
        field: 'departmentId',
        type: 'other',
        renderComponent:this.buildDepartment
      },
    ];
    const {CommitReviewModel:{rulesPagination}}=this.props;
    switch (roles[0]) {
      case '超级管理员':
        return(
          <AdvancedSearchForm
            searchList={searchList}
            doSearch={this.advancedSearch}
            pagination={rulesPagination}
          />
        )
      default:
        return null;
    }
  }

  onSubmit = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'CommitReviewModel/submitReview',
      payload:value,
      // callback
    });
    this.closeModal()
  }

  render() {
    const {CommitReviewModel:{adminRulesList,rulesPagination,copyAdminRulesList},rulesLoading}=this.props;
    const {pageSize, currentPage,visible,taskId,guideId} = this.state
    const columns=[
      {
        title: '指标名称',
        key:'ruleLevel1Name',
        dataIndex: 'ruleLevel1Name',
        filters: this.getTableFilter(copyAdminRulesList,'ruleLevel1Name'),
        filterDropdown:(props) => {
          const newProps = {
            ...props,
            filterKey:'ruleLevel1Name',
            returnCheckData: this.getCheckData
          }
          return <TableFilterDrop {...newProps} />
        },
        render:(value, row, index) =>{
          const obj = {
            children:<span>{value}</span>,
            props:{
              rowSpan:this.getRowSpan(value,adminRulesList,'ruleLevel1Name',index,currentPage,pageSize)
            }
          }
          return obj
        }
      },
      {
        title: '评测内容',
        key:'ruleLevel2Name',
        dataIndex: 'ruleLevel2Name',
        render:(value, row, index) =>{
          const obj = {
            children:<span>{value}</span>,
            props:{
              rowSpan:this.getRowSpan(value,adminRulesList,'ruleLevel2Name',index,currentPage,pageSize)
            }
          }
          return obj
        }
      },
      {
        title: '评测标准',
        key:'ruleLevel3Name',
        dataIndex: 'ruleLevel3Name',
        render:(value, row, index) =>{
          const obj = {
            children:<span>{value}</span>,
            props:{
              rowSpan:this.getRowSpan(value,adminRulesList,'ruleLevel3Name',index,currentPage,pageSize)
            }
          }
          return obj
        }
      },
      {
        title: '申报要求',
        key:'ruleLevel4Name',
        dataIndex: 'ruleLevel4Name',
        render:(value) => ({
            children:<span>{value}</span>,
            props:{
              rowSpan:1
            }
          }),
      },
      {
        title: '评审状态',
        key:'reviewStatus',
        dataIndex: 'reviewStatus',
        render:() => {},
      },
      {
        title: '最近修改时间',
        key:'lastTime',
        dataIndex: 'lastTime',
      },
      {
        title: '提交数量',
        key:'commitCount',
        dataIndex: 'commitCount',
      },
      {
        title: '部门',
        key:'departmentName',
        dataIndex: 'departmentName',
        render:(value, row) => {
          const {leadFlag} = row;
          if(leadFlag){
            return (
              <div>{value} <Icon theme="filled" type="star" style={{color:' #d41417'}} /></div>
            )
          }
            return value;

        },
      },
      {
        title: '操作',
        key:'action',
        dataIndex: 'id',
        width:'8vw',
        render: (text, record) => (
          this.createAction(text, record)
        ),
      },
      // {
      //   title: '状态',
      //   key:'status',
      //   dataIndex: 'status',
      //   width:'8vw',
      //   filters:STATUSFILTER,
      //   // filterDropdown:(props) => {
      //   //   const newProps = {
      //   //     ...props,
      //   //     filterKey:'status',
      //   //     returnCheckData: this.getCheckData
      //   //   }
      //   //   return <TableFilterDrop {...newProps} />
      //   // },
      //   // render: (text, record) => (
      //   //   this.statusRender(text, record)
      //   // ),
      // },
    ];
    const tableData = {
      list:adminRulesList,
      pagination:rulesPagination
    }
    const btnList = {
      primaryBtn: [{
        func: this.getAdminRules,
        param : {},
        key: 'REFRESH',
      }],
    };


    const pageProps = {
      current:currentPage,
      pageSize,
      onChange:this.tablePageChange,
      showSizeChanger: true,
      showQuickJumper: true,
    }
    return (
      <PageHeaderWrapper title="任务列表">
        {
          this.buildAdvancedSearchForm()
        }
        <Card bordered={false}>
          <ToolBarGroup btnOptions={btnList} />
          <StandardTable
            selectedRows={null}
            loading={rulesLoading}
            data={tableData}
            onSelectRow={this.onSelectChange}
            columns={columns}
            onChange={this.handleStandardTableChange}
            rowSelection={null}
            pagination={pageProps}
          />
        </Card>
        <CommitModal
          visible={visible}
          onCancel={this.closeModal}
          taskId={taskId}
          guideId={guideId}
          key={taskId}
          onSubmit={this.onSubmit}
        />
        <FooterToolbar style={{width: '100%'}}>
          <Button style={{marginLeft: 8}} type='primary' onClick={this.back}>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    )
  }
}

export default RulesDetail;
