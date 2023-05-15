import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, message,Icon, Divider,Drawer, Row, Col, Modal, Button} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar'
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import styles from '../../utils/styles/StandardTableStyle.less';
import * as utils from '../../utils/utils';
import GuideFlowDetail from './GuideFlowDetail';
import tableStyle from '../../utils/styles/TableStyle.less';
import router from 'umi/router';
import { FLOW_PROCESSSTAGE_TYPE, guideFlowsPassTypeArr ,GUIDE_STATE} from '../../utils/Enum';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { confirm } = Modal;

@connect(({ guideFlowsModal, basicdata, loading }) => ({
  guideFlowsModal,
  basicdata,
  loading : loading.models.guideFlowsModal,
  getGuideLoading: loading.effects['guideFlowsModal/getGuide'],
  saveAllLoading: loading.effects['guideFlowsModal/guideAddAll'],
}))
@Form.create()

class GuideFlowList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      doubleSelect: [],
      selectedRows : [],
      drawerVisible : false,
      list: [],
      pagination: {},
      isEdit: false,
    };
  }

  componentDidMount() {
    const { match : { params }, dispatch } = this.props;
    const { processType, flowType, guideId } = params;
    dispatch({
      type: 'guideFlowsModal/getGuide',
      payload: {
        guideId,
      }
    });
    dispatch({
      type: 'guideFlowsModal/getAllData',
    });
      dispatch({
        type: 'guideFlowsModal/guideScoreRuleAll',
      });

    const searchParams = {
      processStage : processType,
      type : flowType,
      guideId,
    };
    this.listPage(searchParams);
  }

  componentWillReceiveProps(nextProps) {
    const { flowData } = nextProps.guideFlowsModal;
    const { list = [] } = flowData;
    list.sort((a,b) => a.sort - b.sort);
    this.setState({
      list,
      pagination: flowData.pagination,
    })
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type : 'guideFlowsModal/fetchFlowList',
      payload : params || {
        currentPage : 1,
        pageSize : 10,
      },
    });
  };

  onCloseDrawer=()=>{
    this.setState({
      drawerVisible : false,
      isEdit: false,
      doubleSelect: [],
      selectedRows:[],
    });
  };

  onCloseDrawerWithNotice=()=>{
    const that = this;
    confirm({
      content: '要放弃当前编辑内容返回吗？（请确认已保存）',
      okText: '是的',
      cancelText: '取消',
      onOk:() => {
        that.setState({
          drawerVisible : false,
          isEdit: false,
          doubleSelect: [],
        });
      }
    })
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleRefresh = () => {
    const that = this;
    confirm({
      content: '要放弃当前编辑内容刷新吗？（请确认已保存）',
      okText: '刷新',
      cancelText: '取消',
      onOk:() => {
        const { match : { params } } = that.props;
        const { processType, flowType, guideId } = params;
        const searchParams = {
          processStage : processType,
          type : flowType,
          guideId,
        };
        that.listPage(searchParams)
      }
    })
  };

  handleNewFlow =() =>{
    this.setState({
      drawerVisible : true,
    });
  };

  handleSetSort = (handleType, record) => {
    const { list } = this.state;
    const flowCopy = [...list];
    let leftTerm = {};
    switch (handleType) {
      case 'up':
        if(record.sort === 1){
          message.warning('已经是第一了！');
          return
        }
        [leftTerm] = flowCopy.splice((record.sort-1)-1,1);
        flowCopy.splice(leftTerm.sort,0,leftTerm);
        flowCopy[leftTerm.sort-1].sort -= 1;
        leftTerm.sort += 1;
        break;
      default:
        if(record.sort === list.length){
          message.warning('已经是最后了！');
          return
        }
        [leftTerm] = flowCopy.splice(record.sort,1);
        flowCopy.splice(record.sort-1,0,leftTerm);
        flowCopy[leftTerm.sort-1].sort += 1;
        leftTerm.sort -= 1;
        break;
    }
    this.setState({
      selectedRows: [],
      list: flowCopy,
    })
  };

  handleSaveEntireFlow=() =>{
    const { dispatch ,match:{params}} = this.props;
    const { list } = this.state;
    if(Number(params.processType)===FLOW_PROCESSSTAGE_TYPE.PROJECT_APPROVAL){
      if(params.state<GUIDE_STATE[5].value){
        dispatch({
          type: 'guideFlowsModal/guideAddAll',
          payload: {
            list,
          },
        });
      }else {
        message.error('立项阶段的指南流程需在立项审核开始之前配置！')
      }
    }else if(Number(params.processType)===FLOW_PROCESSSTAGE_TYPE.PROJECT_CONCLUSION){
      if(params.state<GUIDE_STATE[7].value){
        dispatch({
          type: 'guideFlowsModal/guideAddAll',
          payload: {
            list,
          },
        });
      }else {
        message.error('结项阶段的指南流程需在结项提交开始之前配置！')
      }
    }


  };

  handleSave = (isEdit, value) => {
    const { list } = this.state;
    const listCopy = [...list];
    const current = value.sort-1;
    if(isEdit) {
      listCopy[current] = value;
    } else {
      listCopy.push(value)
    }
    this.setState({
      list: listCopy
    },() => {
      this.onCloseDrawer();
    })
  };

  handleEdit =(rows = {}) =>{
    const { selectedRows } = this.state;
    if(Object.keys(rows).length!==0) {
      this.setState({
        doubleSelect: [rows],
      })
    } else if(selectedRows.length > 1) {
      message.error('不能同时修改多个流程！')
      return
    }

    this.setState({
      isEdit: true,
      drawerVisible : true,
    });
  };

  handleDelete = () => {
    const { selectedRows, list = [] } = this.state;
    const that = this;
    confirm({
      content: '确定删除选中项吗？(不会保存)',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        const listAfterDel = list.filter(item => selectedRows.every(i => i.sort !== item.sort));
        that.setState({
          selectedRows: [],
          list: listAfterDel.map((item,index) => ({
            ...item,
            sort: index+1,
          })),
        })
      }
    })
  };

  handelCancel = () => {
    router.push({
      pathname: `/GuideFlows/GuideSetList`,
      query: {prevent: true}
    });
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
      type : 'guideFlowsModal/fetch',
      payload : params,
    });
  };

  exchangeCodeToString = (data, name, key, aimKey) => {
    if(data.length !== 0) {
      const [result] = data.filter(item => item[key] === aimKey);
      if(result) {
        return result[name];
      }
    }
    return '\\'
  };

  render() {
    const {
      match : { params },
      guideFlowsModal : { detailData, depart, scoreRuleList },
      basicdata : { gDictData },
      loading, getGuideLoading, saveAllLoading,
    } = this.props;
    const { exchangeCodeToString } = this;
    const { processType, flowType, guideId } = params;
    const { drawerVisible, selectedRows, list = [], pagination, doubleSelect, isEdit }=this.state;
    const btnList = {
      primaryBtn : [{
        func : this.handleNewFlow,
        key : 'NEW_FLOW',
      },{
        func : this.handleSaveEntireFlow,
        key : 'SAVE_FLOW',
      },{
        func : this.handleRefresh,
        key : 'REFRESH',
      }],
      patchBtn : [{
        func : this.handleEdit,
        key : 'EDIT',
      },{
        func : this.handleDelete,
        key : 'DELETE',
      }],
    };
    const drawerTitle = isEdit? '修改':'新建流程';
    const detai = doubleSelect.length===0?selectedRows:doubleSelect;
    const detailProps = {
      selectItem : isEdit?detai:[],
      onClose : this.onCloseDrawerWithNotice,
      handleSave: this.handleSave,
      len: (list.length+1),
      scoreRuleList,
      processType,
      flowType,
      guideId,
      isEdit,
      depart,
    };
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
          if (data.length > 14) {
            data = data.substring(0, 13)
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
        render: (record = "") => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 14) {
            data = data.substring(0, 13)
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
        title: '指南状态',
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        width: 80,
        render:  (v)=> utils.getAllDictNameById(this.gDictData, "GuideStatus", v) || "",
        filters: filterGuideState,
        filterMultiple: false,
      },
      {
        title: '建立时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 85,
      },
      {
        title: '操作',
        width: 140,
        key: 'action',
        dataIndex: 'action',
        align:'center',
        render: (text, record) => (
          this.createAction(text, record)
        ),
      },
    ];
    return (
      <PageHeaderWrapper title="指南列表">
        <Card bordered={false} loading={getGuideLoading}>
          <div className={tableStyle.frame}>
            <div style={{ backgroundColor: '#f2f2f2' }}>
              <div className={tableStyle.Layout} style={{height:'150px'}}>
                <div className={tableStyle.detail}>
                  <Row className={tableStyle.Row}>
                    <Col className={tableStyle.Colodd} span={6}>指南名称</Col>
                    <Col className={tableStyle.Coleven} span={18}>{detailData.guideName || ''}</Col>
                  </Row>
                  <Row className={tableStyle.Row}>
                    <Col className={tableStyle.Colodd} span={6}>指南简介</Col>
                    <Col className={tableStyle.Coleven} span={18}>{detailData.guideBrief || ''}</Col>
                  </Row>
                  <Row className={tableStyle.Row}>
                    <Col className={tableStyle.Colodd} span={6}>流程类型</Col>
                    <Col className={tableStyle.Coleven} span={6}>{utils.getAllDictNameById(gDictData, 'processT', flowType) || ''}</Col>
                    <Col className={tableStyle.Colodd} span={6}>流程阶段</Col>
                    <Col className={tableStyle.Coleven} span={6}>{utils.getAllDictNameById(gDictData, 'processStage', processType) || ''}</Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
            <StandardTable
              pagination={false}
              selectedRows={selectedRows}
              loading={saveAllLoading || loading}
              data={{list,pagination}}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.sort}
              onRow={(record) => ({
                  onDoubleClick: () => {
                    this.handleEdit(record)
                  }
              })}
            />
          </div>
        </Card>
        <Drawer
          title={drawerTitle}
          placement="right"
          closable
          onClose={this.onCloseDrawer}
          visible={drawerVisible}
          width={800}
          destroyOnClose
        >
          <GuideFlowDetail {...detailProps} />
        </Drawer>
        <FooterToolbar>
          <Button type="primary" style={{marginLeft: 8}} onClick={this.handelCancel} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default GuideFlowList;
