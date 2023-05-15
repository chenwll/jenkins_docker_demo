import React, { Fragment, PureComponent } from 'react';
import {connect} from 'dva';
import {
  Form,
  Button,
  Table,
  Divider,
  Tag,
  Icon,
  Tooltip
} from 'antd';
import router from 'umi/router';
import {RULE_DECLARATION_TYPE,STATUSFILTER} from '../../../utils/Enum';
import FooterToolbar from '@/components/FooterToolbar';
import 'braft-editor/dist/index.css';
import TableFilterDrop from '../../../components/TableFilter/tableFilterDrop';



@Form.create()
@connect(({guideUserModal, basicdata, personalProjectModal,loading}) => ({
  guideUserModal,
  basicdata,
  personalProjectModal,
  loadingRule: loading.effects['personalProjectModal/fetch'],
  loadingGet: loading.effects['guideUserModal/fetchRules'],
}))

class SecondStep extends PureComponent {
  state = {
    currentPage:1,
    pageSize:10,
    checkData:{}
  }

  componentDidMount() {
    this.getRuleList()
  }

  getRuleList = (param) => {
    const {dispatch,personalProjectModal:{currentGuideId}} = this.props;
    if(currentGuideId){
      dispatch({
        type:'personalProjectModal/fetch',
        payload:{
          ...param,
          guideId:currentGuideId,
        }
      })
    }
  }

  back = () => {
    router.push('/PersonalProject/GuideList')
  }
  // eslint-disable-next-line react/sort-comp
  lastRuleArr=[]

  // eslint-disable-next-line no-unused-vars
  treeToArr = (data,pid=null,res) =>{
    data.forEach(item => {
      const newRes=JSON.parse(JSON.stringify(res))
      newRes.push(item.ruleName)
      if(item.children && item.children.length !== 0) {
        this.treeToArr(item.children, item.id, newRes);
      }
      else {
        newRes.push(item.id)
        this.lastRuleArr.push(newRes)
      }
    })
}

  getArrIndex = (Arr,obj) => {
    let i = Arr.length;
    // eslint-disable-next-line no-plusplus
    while (i--) {
      if (Arr[i] === obj) {
        return i;
      }
    }
    return -1;
}

  // 去往上传申报任务页面
  toDeclare = (id,record) => {
    const { dispatch } = this.props
    dispatch({
      type:'personalProjectModal/save',
      payload:{
        currentRuleId:id,
        currentRule:record,
        status:RULE_DECLARATION_TYPE.DECLARATION
      }
    })
    router.push('/PersonalProject/basicInfo/step2')
  }

  // 修改申报
  modifyDeclaration = (record) => {
    const { dispatch } = this.props
    dispatch({
      type:"personalProjectModal/save",
      payload:{
        status:RULE_DECLARATION_TYPE.DRAFT,
        currentReportId:record.reportId,
        currentRuleId:record.ruleId,
        currentRule:record
      }
    })
    router.push('/PersonalProject/basicInfo/step2')
  }

  // 去往第三步提交页面
  toCommit = (record) => {
    const { dispatch } = this.props
    dispatch({
      type:"personalProjectModal/save",
      payload:{
        status:RULE_DECLARATION_TYPE.DRAFT,
        currentReportId:record.reportId,
        currentRuleId:record.ruleId,
        currentRule:record
      }
    })
    router.push('/PersonalProject/basicInfo/step3')
  }

  // 去查看详情
  toView = (record) => {
    const { dispatch } = this.props
    dispatch({
      type:"personalProjectModal/save",
      payload:{
        status:RULE_DECLARATION_TYPE.COMMIT,
        currentReportId:record.reportId,
        currentRuleId:record.ruleId,
        currentRule:record
      }
    })
    router.push('/PersonalProject/basicInfo/step3')
  }

  createAction = (text, record) => {
    switch (record.status) {
      case RULE_DECLARATION_TYPE.DECLARATION:
        return (
          <Tooltip title='申报'>
            <a onClick={()=>{this.toDeclare(record.ruleId,record)}}>
              <Icon type="form" />
            </a>
          </Tooltip>
        )
      case RULE_DECLARATION_TYPE.DRAFT:
        return (
          <Fragment>
            <Tooltip title='修改'>
              <a onClick={() => {this.modifyDeclaration(record)}}>
                <Icon type="edit" />
              </a>
            </Tooltip>
            <Divider type='vertical' />
            <Tooltip title='提交'>
              <a onClick={() => {this.toCommit(record)}}>
                <Icon type="check" />
              </a>
            </Tooltip>
          </Fragment>
        )
      case RULE_DECLARATION_TYPE.COMMIT:
        return (
          <Fragment>
            <Tooltip title='查看详情'>
              <a onClick={() => {this.toView(record)}}>
                <Icon type="eye" />
              </a>
            </Tooltip>
          </Fragment>
        )
      default:
        return (
          <a>
            异常状态
          </a>
        )
    }
  };

  // table 改变函数
  handleStandardTableChange = (pagination) => {
    const params = {
      current : pagination.current,
      size : pagination.pageSize,
    };
    this.getRuleList(params)
  };

  returnListIndexById = (id,data) => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < data.length; index += 1) {
      const element = data[index];
      if(id === element.ruleId){
        return index
      }
    }
    return -1;
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
      // eslint-disable-next-line no-plusplus
      for (let i = index + 1; i < pageData.length; i += 1) {
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

  FilterItem = (filterValueData, key,originData) => {
    if(!filterValueData.length) return originData
    const filterData = []
    for (let index = 0; index < filterValueData.length; index += 1) {
      const element = filterValueData[index];
      for (let i = 0; i < originData.length; i += 1) {
        const value = originData[i];
        if(value[key] === element){
          filterData.push(value)
        }
      }
    }
    return filterData
  }

  // 过滤函数
  onFilter = () => {
    const { personalProjectModal:{copyRuleListData}, dispatch} = this.props
    const { checkData } = this.state
    let filterData = []
    let index = 0
    // eslint-disable-next-line no-restricted-syntax
    for (const key in checkData) {
      if (Object.hasOwnProperty.call(checkData, key)) {
        const filterValueData = checkData[key];
        if(!index){
          filterData = this.FilterItem(filterValueData,key,copyRuleListData)
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
      type:'personalProjectModal/save',
      payload:{
        RuleListData:filterData.length ? filterData : copyRuleListData
      }
    })
  }

  // type 列 表格渲染
  statusRender = (value, record) => {
    switch (record.status) {
      case RULE_DECLARATION_TYPE.DECLARATION:
        return <Tag color='red'>申报状态</Tag>
      case RULE_DECLARATION_TYPE.DRAFT:
        return <Tag color='orange'>草稿状态</Tag>
      case RULE_DECLARATION_TYPE.COMMIT:
         return <Tag color='green'>提交状态</Tag>
      default:
        return <Tag color='red'>异常状态</Tag>
    }
  }

  render() {
    const {loadingGet,
        personalProjectModal:{ RuleListData, copyRuleListData } , loadingRule} = this.props
    const {pageSize, currentPage} = this.state
    const columns=[
      {
        title: '指标名称',
        key:'ruleLevel1Name',
        dataIndex: 'ruleLevel1Name',
        filters: this.getTableFilter(copyRuleListData,'ruleLevel1Name'),
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
                  rowSpan:this.getRowSpan(value,RuleListData,'ruleLevel1Name',index,currentPage,pageSize)
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
                  rowSpan:this.getRowSpan(value,RuleListData,'ruleLevel2Name',index,currentPage,pageSize)
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
                  rowSpan:this.getRowSpan(value,RuleListData,'ruleLevel3Name',index,currentPage,pageSize)
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
          })
      },
      {
        title: '状态',
        key:'status',
        dataIndex: 'status',
        width:'8vw',
        filters:STATUSFILTER,
        filterDropdown:(props) => {
          const newProps = {
            ...props,
            filterKey:'status',
            returnCheckData: this.getCheckData
          }
          return <TableFilterDrop {...newProps} />
        },
        render: (text, record) => (
          this.statusRender(text, record)
        ),
      },
      {
        title: '操作',
        key:'action',
        dataIndex: 'id',
        width:'8vw',
        render: (text, record) => (
          this.createAction(text, record)
        ),
      }
    ];
    const pageProps = {
      current:currentPage,
      pageSize,
      onChange:this.tablePageChange,
      showSizeChanger: true,
      showQuickJumper: true,
    }
    return (
      <Fragment>
        <Table
          columns={columns}
          pagination={pageProps}
          loading={loadingGet || loadingRule}
          dataSource={RuleListData}
          // rowKey={record => record.ruleId + record.departmentName}
        />
        <FooterToolbar style={{width: '100%'}}>
          <Button style={{marginLeft: 8}} type='primary' onClick={this.back}>
            返回
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default SecondStep;
