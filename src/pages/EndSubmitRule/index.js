import React, { Fragment,PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Modal,
  Table,
  Tooltip,
  Icon,
  message,
  Anchor
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import styles from '../../utils/styles/StandardTableStyle.less'
import { router } from 'umi';
import BackTopM from '@/components/BackTopM';

const { Link } = Anchor;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { confirm } = Modal;
@connect(({ endSubmitRuleModel, loading,global }) => ({
  global,
  endSubmitRuleModel,
  loading: loading.models.endSubmitRuleModel,
  loadingList: loading.effects['endSubmitRuleModel/getItemTree'],
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
    // eslint-disable-next-line react/no-unused-state
    drawerVisible: false,
    // 打开抽屉状态，1为新建，2为修改，3为添加下一级（接口同1）
    drawerStatus: 0,
    pageSize:20,
    currentPage:1
  };


  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type:'global/changeLayoutCollapsed',
      payload:true
    })
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
      message.warning('无此规则详情')
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
    this.listPage()
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
      // eslint-disable-next-line react/no-unused-state
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

  treeToArr = (data,res,lastRuleArr) =>{
    if(!data){
      return
    }
    if(!data.children || !data.children.length){
      lastRuleArr.push(res)
      return
    }
    // eslint-disable-next-line no-plusplus
    for(let i = 0; i < data.children.length; i++){
        const newRes=JSON.parse(JSON.stringify(res))
        const item = data.children[i]
        newRes.push(item.ruleName)
        newRes.push(item.id)
        this.treeToArr(item,newRes,lastRuleArr)
    }
    // data.forEach(item => {
    //   let newRes=JSON.parse(JSON.stringify(res))
    //   newRes.push(item.ruleName)
    //   if(item.children && item.children.length !== 0) {
    //     this.treeToArr(item.children, item.id, newRes);
    //   }
    //   else {
    //     newRes.push(item.id)
    //     this.lastRuleArr.push(newRes)
    //   }
    // })
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

  createAction = (text) => 
    <Fragment>
      <Tooltip title='分配部门任务'>
        <a onClick={() => this.allotDepartment(text)}><Icon type="edit" /></a>
      </Tooltip>
    </Fragment>;

  goback = () => {
    const { dispatch } = this.props
    dispatch({
      type:'global/changeLayoutCollapsed',
      payload:false
    })
    router.goBack()
  }

  getRowSpan = (value, data, key,index,current,size) => {
    const right = current*size < data.length ? current*size : data.length
    const left = (current - 1) * size
    const pageData = data.slice(left,right)
    if(!pageData.length) return []
    let result = 0
    const currentData = pageData[index]
    // console.log('11111',data,pageData,index);
    if(index !== 0 && currentData[key] === pageData[index -1][key]){
      return result
    }
    if(index === 0 || currentData[key] !== pageData[index -1][key]){
      result += 1
      // eslint-disable-next-line no-plusplus
      for (let i = index + 1; i < pageData.length; i++) {
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

  tableRender = (value, row, index,key,data,page,size) => {
    const obj = {
      children:<span>{value}</span>,
      props:{
          rowSpan:this.getRowSpan(value,data,key,index,page,size)
      }
    }
    return obj
  }

  // 表格页数变化函数
  tablePageChange = (current, size) =>{
    this.setState({
        currentPage:current,
        pageSize:size
    })
  }
  
  render() {
    const { endSubmitRuleModel: { itemTree = {} }, loading, loadingList }=this.props;
    const { selectedRows, drawerStatus } = this.state;
    const {pageSize, currentPage} = this.state
    const btnList = {
      // primaryBtn : [{
      //   func : this.handleToolBar,
      //   param : [1],// 1，新建
      //   key : 'ADDNEWNODE',
      // }],
      primaryBtn : [
        {
          func : this.goback,
          param : [],
          key : 'RETURN',
        },
        {
        func : this.handleRefresh,
        param : [],
        key : 'REFRESH',
      },
      
    ],
      patchBtn : [],
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
    const lastRuleArr = []
    if(Object.keys(itemTree).length) this.treeToArr(itemTree,[],lastRuleArr)
    const data=[]
    lastRuleArr.forEach(item=>{
      data.push({metricName:item[0],metricNameId:item[1],content:item[2],contentId:item[3],standard:item[4],standardId:item[5],specification:item[6],specificationId:item[7]})
    })

    const columns=[
      {
        title:'指标名称',
        dataIndex:'metricName',
        render:(value,record,index) => this.tableRender(value,record,index,'metricName',data,currentPage,pageSize),
        // filters: nameFilter,
        width:'6vw',
        // onFilter: (value, record) => record.metricName.indexOf(value) === 0,
      },
      {
        title:'评测内容',
        dataIndex:'content',
        width:'6vw',
        render:(value,record,index) => this.tableRender(value,record,index,'content',data,currentPage,pageSize),
        // filters:contentFilter,
        // onFilter: (value, record) => record.content.indexOf(value) === 0,
      },
      {
        title: '评测标准',
        dataIndex: 'standard',
        render:(value,record,index) => this.tableRender(value,record,index,'standard',data,currentPage,pageSize)
      },
      {
        title: '网上申报具体要求',
        dataIndex: 'specification',
        width:'35vw',
        // render:specificationRender
      },
      // {
      //   title: '分配任务',
      //   dataIndex: 'id',
      //   render: (text, record) => (
      //     this.createAction(text, record)
      //   ),
      // }
    ];

    const pageProps = {
      current:currentPage,
      pageSize,
      onChange:this.tablePageChange,
      showSizeChanger: true,
      showQuickJumper: true,
    }
    return (
      <PageHeaderWrapper title="基础规则">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Anchor>
              <Link href="#components-anchor-demo-basic">
                <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
              </Link>
            </Anchor>
            {/* <StandardTable
              childrenColumnName='children'
              selectedRows={selectedRows}
              loading={loading}
              data={{list: tree}}
              pagination={false}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowSelection={rowSelection}
              rowKey={record => record.ruleId}
            /> */}
            <Table 
              columns={columns} 
              dataSource={data}
              loading={loadingList || loading} 
              rowKey={record => record.specificationId} 
              pagination={pageProps}
              size='small'
              bordered 
            />
          </div>
        </Card>
        <BackTopM />
        {/* <AdvancedDrawer
          drawerTitle={drawerTitle}
          drawerContent={<RuleDetail {...detailProps} />}
          onChangeDrawerVisible={this.onCloseDrawer}
          drawerVisible={drawerVisible}
          destroyOnClose
          placement="right"
          closable
        /> */}
        {/* <FooterToolbar style={{width:'100%'}}>
          <Button style={{marginLeft: 8}} type='primary' onClick={this.goback}>
            返回
          </Button>
        </FooterToolbar> */}
      </PageHeaderWrapper>
    );
  }
}

export default EndSubmitRule;
