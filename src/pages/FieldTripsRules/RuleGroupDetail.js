import {
    Card,
    Modal,
    Table,
    Tooltip,
    Icon,
    Divider,
    Anchor,
  } from 'antd';
import { connect } from 'dva';
import React, { Fragment, PureComponent } from 'react';
import { router } from 'umi';
import AdvancedDrawer from '@/components/AdvancedDrawer';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import { EDIT_FLAG } from '@/utils/Enum';
import EditRule from './EditRule';
import BackTopM from '@/components/BackTopM';

const {confirm} = Modal;
const { Link } = Anchor

@connect(({ FieldTripsRulesModel, loading}) => ({
    FieldTripsRulesModel,
    loading: loading.models.FieldTripsRulesModel,
    loadingList: loading.effects['FieldTripsRulesModel/getCurrentGroup'],
  }))
class RuleGroupDetail extends PureComponent {
    // state
    state = {
        currentPage:1,
        pageSize:10,
        drawerVisible:false,
        drawerState:EDIT_FLAG.ADD,
        groupRuleId:null
    }

    componentDidMount(){
        this.getCurrentGroup()
    }

    // 获取当前规则组信息
    getCurrentGroup = () => {
        const { dispatch, FieldTripsRulesModel:{ currentGroupId }} = this.props
        if(!currentGroupId) router.push('/GuideSetting/FieldTripsRules')
        dispatch({
            type:'FieldTripsRulesModel/getCurrentGroup',
            payload:{
                groupId:currentGroupId
            }
        })
    }

    // 刷新
    handleRefresh = () => {
        this.getCurrentGroup()
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

    // 新建规则
    createRule = () => {
        this.setState({
            drawerVisible:true,
            drawerState:EDIT_FLAG.ADD
        })
    }

    // 修改规则
    editRule = (id) => {
        this.setState({
            drawerVisible:true,
            drawerState:EDIT_FLAG.EDIT,
            groupRuleId:id
        })
    }

     // 控制drawer关闭
     onCloseDrawer = () => {
        this.setState({
          drawerVisible : false,
        });
    };

    // 删除规则
    deleteRule = (id) => {
        const { dispatch } = this.props
        confirm({
            title: '是否删除该规则',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type:'FieldTripsRulesModel/deleteRule',
                    payload:{
                        groupRuleId :id
                    }
                })
            }
        })
    }

    // 返回表格筛选数据
    getTableFilter = (data) => {
        const dataArr = []
        data.forEach((item)=>{
            if(dataArr.indexOf(item.ruleName) === -1){
                dataArr.push(item.ruleName)
            }
        })
        return dataArr.map((item) => ({
                value:item,
                text:item
            }))
    }

    render() {
        const {FieldTripsRulesModel:{ currentGroup,currentGroupId },loadingList} = this.props
        const {currentPage,pageSize,drawerVisible,drawerState,groupRuleId} = this.state
        let drawerTitle = ''
        switch (drawerState) {
            case EDIT_FLAG.ADD: 
                drawerTitle = '新建规则';
                break;
            case EDIT_FLAG.EDIT: 
                drawerTitle = '修改当前规则';
                break;
            default:
                break
        }
        const columns = [
            {
                title:"标准名称",
                key:'ruleName',
                dataIndex:'ruleName',
                width:'10vw',
                render:(value, row, index) =>{
                    const obj =  {
                        children:<span>{value}</span>,
                        props:{
                            rowSpan:this.getRowSpan(value,currentGroup,'ruleName',index,currentPage,pageSize)
                        }
                    }
                    return obj
                }
            },
            {
                title:"测评标准",
                key:'ruleDetail',
                dataIndex:'ruleDetail',
                width:'15vw',
                render:(value, row, index) =>{
                    const obj = {
                        children:<span>{value}</span>,
                        props:{
                            rowSpan:this.getRowSpan(value,currentGroup,'ruleDetail',index,currentPage,pageSize)
                        }
                    }
                    return obj
                }
            },
            {
                title:"权重",
                key:'weight',
                dataIndex:'weight',
                render:(value) =>({
                        children:<span>{value}</span>,
                        props:{
                            rowSpan:1
                        }
                    })
            },
            {
                title:"标准笔数",
                key:'number',
                dataIndex:'number',
                width:'7vw',
                render:(value) =>({
                        children:<span>{value}</span>,
                        props:{
                            rowSpan:1
                        }
                    })
            },
            {
                title:"单笔分值",
                key:'score',
                dataIndex:'score',
                width:'7vw',
                render:(value) =>({
                        children:<span>{value}</span>,
                        props:{
                            rowSpan:1
                        }
                    })
            },
            {
                title:"测评明细",
                key:'memo',
                dataIndex:'memo',
                render:(value) =>({
                        children:<span>{value}</span>,
                        props:{
                            rowSpan:1
                        }
                    })
            },
            {
                title:"操作",
                key:'action',
                dataIndex:'action',
                width:'6vw',
                render:(value, row) =>(
                  <Fragment>
                    <Tooltip title="编辑">
                      <a onClick={this.editRule.bind(this,row.groupRuleId)}>
                        <Icon type="edit" />
                      </a>
                    </Tooltip>
                    <Divider type='vertical' />
                    <Tooltip title="删除">
                      <a onClick={this.deleteRule.bind(this,row.groupRuleId)}>
                        <Icon type="delete" />
                      </a>
                    </Tooltip>
                  </Fragment>
                    )
            }
        ]
        const btnList = {
            primaryBtn : [
            {
                func : router.goBack,
                param : [],
                key : 'RETURN',
            },
            {
              func : this.handleRefresh,
              param : [],
              key : 'REFRESH',
            },
            {
                func : this.createRule,
                param : [],
                key : 'ADD',
            }
        ],
            patchBtn : [
            ],
            menuBtn : []
          };
        const pagination = {
            current:currentPage,
            pageSize,
            onChange:this.tablePageChange
        }
        const EditRuleProps = {
            groupRuleId,
            drawerState,
            groupId:currentGroupId,
            onClose:this.onCloseDrawer
        }
        return (
          <PageHeaderWrapper title="规则分组名称">
            <Card bordered={false}>
              <Anchor>
                <Link>
                  <ToolBarGroup btnOptions={btnList} />
                </Link>
              </Anchor>  
              <Table
                loading={loadingList}
                columns={columns}
                dataSource={currentGroup}
                pagination={pagination}
                rowKey={record => record.groupRuleId}
              />
            </Card>
            <AdvancedDrawer
              drawerTitle={drawerTitle}
              drawerContent={<EditRule {...EditRuleProps} />}
              onChangeDrawerVisible={this.onCloseDrawer}
              drawerVisible={drawerVisible}
              destroyOnClose
              placement="right"
              closable
            />
            <BackTopM />
            {/* <FooterToolbar style={{width:'100%'}}>
              <Button style={{marginLeft: 8}} type='primary' onClick={router.goBack}>
                返回
              </Button>
            </FooterToolbar> */}
          </PageHeaderWrapper>
        );
    }
}

export default RuleGroupDetail;
