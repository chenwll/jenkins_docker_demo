import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {Card,Form,Modal, Divider,Table} from 'antd';
import { router } from 'umi';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import {ROLES_DETAIL_STATUS} from '../../utils/Enum';
import AddRuleName from './AddRuleName';


const {confirm}=Modal;
@Form.create()
@connect(({ endSubmitRuleModel, loading,global}) => ({
    endSubmitRuleModel,
    global,
    loading: loading.models.endSubmitRuleModel,
    loadingList: loading.effects['endSubmitRuleModel/fetch'],
    loadingUpdate: loading.effects['endSubmitRuleModel/UpdateUser'],
    loadingDelete: loading.effects['endSubmitRuleModel/deleteRule'],
  }))
class RoleList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      permissionsRow:[],
      visiable:false,
      modelVisible:false,
      drawerTitle:'新建角色',
      rolesDetailStatus:ROLES_DETAIL_STATUS.ADD
    };
  }

  componentDidMount() {
    this.listPage()
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type : 'endSubmitRuleModel/fetch',
      payload : params
    });
  };


  handleAdd=()=>{
    // 暂时空存
    this.setState({
        modelVisible:true
    })
  }




  closeModal=()=>{
    this.setState({
      modelVisible:false
    })
  }

  openModal=(ruleId)=>{
    const {selectedRows} = this.state
    selectedRows[0] = ruleId
    this.setState({
      selectedRows,
      modelVisible:true
    })
  }


  handleRefresh=()=>{
    this.listPage()
  }


  showRuleDetail = (id) => {
    const { dispatch } = this.props
    dispatch({
        type:'endSubmitRuleModel/updata',
        payload:{
            rootId:id
        }
    })
    router.push('/GuideSetting/EndSubmitRule/RuleDetail')
  }

  editRules = (id) =>{
    const { dispatch } = this.props
    dispatch({
        type:'endSubmitRuleModel/updata',
        payload:{
            rootId:id
        }
    })
    router.push('/GuideSetting/EndSubmitRule/EditRules')
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      page : pagination.current,
      pageSize : pagination.pageSize,
    };
    dispatch({
      type : 'roleSettingModel/fetchList',
      payload : params,
    });
  };

  createRule = () => {
    // 此模块暂未完成
  }

  deleteRule = (id) => {
    const { dispatch } = this.props;
    confirm({
      title: '是否删除该规则',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type:'endSubmitRuleModel/deleteRuleSystem',
          payload:{
            rootRule:Number(id)
          }
        })
      }
    })
  }

  render() {
    const {selectedRows,modelVisible} = this.state;
    const { loading,loadingDelete,loadingList,loadingUpdate } = this.props
    const { endSubmitRuleModel:{ tree = [] } } = this.props

    const columns=[
      {
        title: '序号',
        key:'count',
        render:(text, record, index) => <span>{index + 1}</span>
      },{
      title:"规则名称",
      key:'ruleName',
      dataIndex:'ruleName',
      width:'35vw'
     },
     {
        title:"操作",
        key:'action',
        render:(text, row) => (
          <Fragment>
            <a onClick={this.showRuleDetail.bind(this,row.rootRuleId)}>详细信息</a>
            <Divider type='vertical' />
            <a onClick={this.openModal.bind(this,row.rootRuleId)}>复制</a>
            <Divider type='vertical' />
            <a onClick={this.editRules.bind(this,row.rootRuleId)}>编辑</a>
            <Divider type='vertical' />
            <a onClick={this.deleteRule.bind(this,row.rootRuleId)}>删除</a>
          </Fragment>
        )
     }
    ];

    const btnList = {
      primaryBtn : [ {
            func : this.handleRefresh,
            param : [],
            key : 'REFRESH',
      },
      // {
      //       func : this.createRule,
      //       param : [],
      //       key : 'ADD',
      // },
    ],
      patchBtn : [

      ],
      menuBtn : []
    };

    // const rolesDetailProps={
    //   pagination,
    //   selectedRows,
    //   rolesDetailStatus,
    //   onClose:this.closeDrawer,
    // };
    const RuleNameProps = {
        selectedRows,
        modelVisible,
        onClose:this.closeModal
    }

    return (
      <PageHeaderWrapper title='文明城市规则列表'>
        <Card>
          <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
          <Table
            loading={loadingList||loadingUpdate||loadingDelete||loading}
            dataSource={tree}
            columns={columns}
            rowKey={record => record.rootRuleId} 
            type='small'
          />
        </Card>
        <AddRuleName {...RuleNameProps} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
