import React, {  PureComponent } from 'react';
import { connect } from 'dva';
import {
  Anchor,
  Card,
  Form,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ToolBarGroup from '@/components/ToolBarGroup';
import AdvancedDrawer from '@/components/AdvancedDrawer';
import { router } from 'umi';
import styles from '../../utils/styles/StandardTableStyle.less'
import RuleDetail from './RuleDetail';
import BackTopM from '@/components/BackTopM';

const { Link } = Anchor

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { confirm } = Modal;
@connect(({ endSubmitRuleModel, loading }) => ({
  endSubmitRuleModel,
  loading: loading.models.endSubmitRuleModel,
  loadingList: loading.effects['endSubmitRuleModel/fetch'],
  loadingUpdate: loading.effects['endSubmitRuleModel/UpdateUser'],
  loadingDelete: loading.effects['endSubmitRuleModel/deleteRule'],
}))
@Form.create()
class EndSubmitRule extends PureComponent {
  state = {
    // 该数组传入选中项的key,当前仅用作标识选择不为空
    selectedRows: [],
    // 选择项的具体信息，主要用到节点id和父节点id
    selectRow: {},
    drawerVisible: false,
    // 打开抽屉状态，1为新建，2为修改，3为添加下一级（接口同1）
    drawerStatus: 0,
  };

  columns = [
    {
      title:'规则名称',
      dataIndex:'ruleName',
      key:'ruleName',
    },
    // {
    //   title:'操作',
    //   key:'action',
    //   render:(text,record)=>{
    //     return 
    //       <Fragment>
    //         <Tooltip title="添加下一级">
    //           <a>
    //             <Icon type="arrow-down" />
    //           </a>
    //         </Tooltip>
    //         <Divider type='vertical'></Divider>
    //         <Tooltip title='修改'>
    //           <a>
    //             <Icon type="edit" />
    //           </a>
    //         </Tooltip>
    //         <Divider type='vertical'></Divider>
    //         <Tooltip title='删除'>
    //           <a>
    //             <Icon type="delete" />
    //           </a>
    //         </Tooltip>
    //       </Fragment>
    //   }
    // }
    // {
    //   title : '规则简介',
    //   dataIndex : 'ruleBrief',
    //   key : 'ruleBrief',
    //   width: '20%'
    // },
    // {
    //   title : '规则描述',
    //   dataIndex : 'description',
    //   key : 'description',
    //   width: '20%'
    // },
    // {
    //   title : '类型',
    //   dataIndex : 'type',
    //   key : 'type',
    //   render:text => rule_type.filter(value => text.toString() === value.key)[0].text,
    //   width: '10%'
    // },
    // {
    //   title : '满分',
    //   dataIndex : 'fullMarks',
    //   key : 'fullMarks',
    //   // width: '10%',
    // },
    // {
    //   title : '一票否决',
    //   dataIndex : 'veto',
    //   key : 'veto',
    //   // width: '20%',
    //   render: (text) => {
    //     if(!text){
    //       return ''
    //     }else{
    //       return text === 0 ? '否' : '是' 
    //     }
    //   }
    // },
    // {
    //   title:'权重',
    //   dataIndex:'weight',
    //   key : 'weight',
    //   width: '10%'
    // }
  ];

  componentDidMount() {
    this.listPage();
  }

  componentWillUnmount(){
    const { dispatch } = this.props
    dispatch({
      type:'roleSettingModel/updata',
      payload:{
          rootId:null
      }
    })
  }

  listPage = () => {
    const { dispatch } = this.props;
    const { endSubmitRuleModel:{ rootId } } = this.props
    if(!rootId){
      router.push('/GuideSetting/EndSubmitRule/RuleList')
    }
    dispatch({
      type : 'endSubmitRuleModel/getItemTree',
      payload : {
        rootId
      }
    });
  };

  handleRefresh=()=>{
    const {dispatch}=this.props;
    dispatch({
      type : 'endSubmitRuleModel/fetch',
      payload : '' 
    });
  };

  doSearch = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'endSubmitRuleModel/fetch',
      payload: data || {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  getItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'endSubmitRuleModel/getItem',
      payload: {
        ruleId:id
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleSelect = (row) => {
    this.setState({
      selectRow: row,
    })
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type : 'endSubmitRuleModel/fetch',
      payload : params,
    });
  };

  handleToolBar = (status) =>{
    this.setState({
      drawerStatus: status[0],
      drawerVisible : true,
    });
  };

  handleDelete = () =>{
    const { selectRow = {} } = this.state;
    const { dispatch } = this.props;
    const { handleSelectRows } = this;
    confirm({
      title: '是否删除',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'endSubmitRuleModel/deleteRule',
          payload: {
            ruleId: selectRow.ruleId,
          }
        });
        handleSelectRows([]);
      }
    })
  };

  onCloseDrawer = () => {
    this.setState({
      drawerVisible : false,
    });
  };

  loop = (node=[],deep='0') => {
    node.forEach((item,index) => {
      if (item.child) {
        this.loop(item.child,`${deep}-${index+1}`);
      }
      // eslint-disable-next-line no-param-reassign
      item.key = `${deep}-${index+1}`;
    });
  };

  goBack = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'endSubmitRuleModel/updata',
      payload: {
        ruleId:null
      },
    });
    router.goBack()
  }

  render() {
    const { endSubmitRuleModel: { itemTree }, loading }=this.props;
    // this.loop(tree);
    const { selectedRows, drawerVisible, drawerStatus, selectRow } = this.state;
    const btnList = {
      // primaryBtn : [{
      //   func : this.handleToolBar,
      //   param : [1],// 1，新建
      //   key : 'ADDNEWNODE',
      // }],
      primaryBtn : [
        {
          func : this.goBack,
          param : [],
          key : 'RETURN',
        },
        {
        func : this.handleRefresh,
        param : [],
        key : 'REFRESH',
      },
    ],
      patchBtn : [{
        func : this.handleToolBar,
        param : [2],// 2，修改
        key : 'EDIT',
      },{
        func : this.handleToolBar,
        param : [3],// 3，添加
        key : 'ADDCHILD',
      },{
        func : this.handleDelete,
        param : [true],
        key : 'DELETE',
      }],
    };
    const rowSelection = {
      type: 'radio',
      onChange: this.handleSelectRows,
      onSelect: this.handleSelect,
    };
    let drawerTitle = '';
    switch (drawerStatus) {
      case 1: 
        drawerTitle = '新建规则';
        break;
      case 2: 
        drawerTitle = '修改当前级';
        break;
      default: 
        drawerTitle = '添加下一级';
        break;
    }
    const data = [itemTree]
    const detailProps = {
      itemTree: data,
      drawerStatus,
      id: selectRow.ruleId,
      parentNameAdd: selectRow.ruleName,
      fullMarkAdd: selectRow.fullMarks,
      rootRuleId: selectRow.rootRuleId,
      getItem: this.getItem,
      onClose : this.onCloseDrawer,
    };
    return (
      <PageHeaderWrapper title="基础规则">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Anchor>
              <Link>
                <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
              </Link>
            </Anchor>
            <StandardTable
              childrenColumnName='children'
              selectedRows={selectedRows}
              loading={loading}
              data={{list: data}}
              pagination={false}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowSelection={rowSelection}
              rowKey={record => record.ruleId}
            />
          </div>
        </Card>
        {/* <div>
          <BackTop>
            <div className={style.antBackTop}>UP</div>
          </BackTop>
          <strong></strong>
        </div> */}
        <BackTopM />
        <AdvancedDrawer
          drawerTitle={drawerTitle}
          drawerContent={<RuleDetail {...detailProps} />}
          onChangeDrawerVisible={this.onCloseDrawer}
          drawerVisible={drawerVisible}
          destroyOnClose
          placement="right"
          closable
        />
      </PageHeaderWrapper>
    );
  }
}

export default EndSubmitRule;
