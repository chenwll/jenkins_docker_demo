import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Popover, message, Modal, Tooltip, Divider, Icon } from 'antd';
import router from 'umi/router';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import { EDIT_FLAG, MYPROJECT_STATE ,GUIDESTATUS} from '../../utils/Enum';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import GuideDetail from './GuideDetail';
import ReviewYearForm from './ReviewYearForm';
import AdvancedSelect from '../../components/AdvancedSelect';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from '../../utils/styles/StandardTableStyle.less';
import StandardTable from '@/components/StandardTable';
import * as utils from '../../utils/utils';
import FooterToolbar from '@/components/FooterToolbar';
import EnUS from '@/locales/en-US';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const {confirm} =Modal

@connect(({ guideModal, basicdata,user, loading }) => ({
  guideModal,
  basicdata,
  user,
  loading: loading.models.guideModal,
  loadingList: loading.effects['guideModal/fetch'],
  loadingAdd: loading.effects['guideModal/addGuide'],
  loadingUpdate: loading.effects['guideModal/editGuide'],
}))
class GuideList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      checks: [], // 其他页面的selectedRow
      drawerVisible: false,
      searchMoreParams: {},
    };
  }

  componentDidMount() {
    this.listPage({
      currentPage: 1,
      pageSize: 10,
    });
  }

  listPage = (params) => {
    console.log('GuideList,listPage,params', params);
    const { dispatch, guideModal: { pagination } } = this.props;
    const { searchMoreParams } = this.state;
    const isParamsUndefined = Object.keys(params || {});
    dispatch({
      type: 'guideModal/fetch',
      payload: isParamsUndefined.length !== 0 ? params : { ...pagination, ...searchMoreParams },
    });
    if (isParamsUndefined.length !== 0) {
      const { currentPage, pageSize, ...searchValue } = params;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
    }
  };

  onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
  };

  // 本地拟的字典，到时候改成网络获取！！！
  gDictData = [
    { id: 1, type: 'GuideStatus', k: '0', val: '初稿' },
    { id: 2, type: 'GuideStatus', k: '1', val: '发布' },
    { id: 3, type: 'GuideStatus', k: '2', val: '开始申报' },
    { id: 4, type: 'GuideStatus', k: '3', val: '申报结束' },
    { id: 5, type: 'GuideStatus', k: '4', val: '审评开始' },
    { id: 6, type: 'GuideStatus', k: '5', val: '审评结束' },
  ];


  editGuide = (record) => {
    const { dispatch } = this.props;
    const { rootRuleId } = record;
    const {status,guideId} = record
    dispatch({
      type: 'guideModal/save',
      payload: { rootRuleId },
    });
    dispatch({
      type:'guideModal/save',
      payload:{ editStatus: status },
    })
    dispatch({
      type:'guideModal/save',
      payload:{guideId}
    })
    switch (status){
      case GUIDESTATUS.DRAFT:
        router.push('/Guide/GuideStep/Step1')
        break
      default:
        router.push('/Guide/GuideStep/Step2')
    }
  };

  deleteGuide=(record)=>{
    console.log('editGuide');
    const {guideId} = record;
    const {dispatch} =this.props;
    confirm({
      title: '是否确认删除此任务',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type:'guideModal/deleteGuide',
          payload:{guideId}
        })
      }
    });
  }

  // 询问撤回操作，年限设置是否不需要了！！！
  // 因为不知道还要不要，所以里面的都还没写！！！
  createAction = (text, record) => {
    const {user:{roleName}} = this.props
    const {status} =record
    switch (roleName){
      case '超级管理员':
        switch (status){
          case GUIDESTATUS.DRAFT:
            return (
              <Fragment>
                <Tooltip title='推进状态(目前只有草稿到发布的接口)'>
                  <a onClick={() => this.advanceStatus(record)}><Icon type='arrow-right' /></a>
                </Tooltip>
                <Divider type='vertical' />
                <Tooltip title='修改'>
                  <a onClick={() => this.editGuide(record)}><Icon type='edit' /></a>
                </Tooltip>
                <Divider type='vertical' />
                <Tooltip title='删除'>
                  <a onClick={()=>this.deleteGuide(record)}><Icon type='delete' /> </a>
                </Tooltip>
              </Fragment>
            )
          default:
            return (
              <Fragment>
                <Tooltip title='推进状态(目前只有草稿到发布的接口)'>
                  <a onClick={() => this.advanceStatus(record)}><Icon type='arrow-right' /></a>
                </Tooltip>
                <Divider type='vertical' />
                <Tooltip title='查看'>
                  <a onClick={() => this.editGuide(record)}><Icon type='eye' /></a>
                </Tooltip>
              </Fragment>
            )
        }
      case '行政人员':
        switch (status){
          case GUIDESTATUS.PUBLISH:
            return (
              <Fragment>
                <Tooltip title='修改'>
                  <a onClick={() => this.editGuide(record)}><Icon type='edit' /></a>
                </Tooltip>
              </Fragment>
            )
          default:
            return (
              <Fragment>
                <Tooltip title='查看'>
                  <a onClick={() => this.editGuide(record)}><Icon type='eye' /></a>
                </Tooltip>
              </Fragment>
            )
        }
      default:
        return (
          <Fragment>
            <Tooltip title='状态出错，请检查逻辑是否有未考虑的状态'>
              <a><Icon type='error' /></a>
            </Tooltip>
          </Fragment>
        )
    }
  };

  //! !!
  advanceStatus = (record) => {
    console.log('还没写');
  };

  handleStateChange = (value) => {
    // 不知道留这个干啥
    console.log(value);
  };

  // 搜索框搜索分页
  // 接口只能对指南名称和指南状态进行查询！！！
  advancedSearch = (params) => {// 搜索框搜索分页
    if (Object.prototype.hasOwnProperty.call(params, 'guideBrief') || Object.prototype.hasOwnProperty.call(params, 'status')) {// 如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams: {
          ...params,
        },
      });
    } else {// 点击重置
      this.setState({
        searchMoreParams: {},
      });
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'guideModal/fetch',
      payload: {// 搜索之后总是第一页
        ...params,
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  // 表格改变触发(分页，改变current，改变size)
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { searchMoreParams } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...searchMoreParams,
      ...filters,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.listPage((params));
  };

  // 询问，添加的流程，是点击新建->弹出modal->填写基本信息->刷新列表->在列表的功能区配置详情(modal)
  // 还是点击新建->step1基本信息->step2详细配置->提交,这种操作指南的状态是？状态会关系到Table的action！！！
  addGuide = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'guideModal/saveEditFlag',
      payload: {
        editFlag: EDIT_FLAG.ADD,
      },
    });
    dispatch({
      type:'guideModal/save',
      payload:{editStatus: GUIDESTATUS.WILLCREATE}
    })
    router.push(`/Guide/GuideStep`);
  };

  btnListStatus={
    '超级管理员':[{
      func: this.addGuide,
      param: [true, '其他'],
      key: 'ADD',
    }, {
      func: this.listPage,
      param: {},
      key: 'REFRESH',
    }],
    "行政人员":[ {
      func: this.listPage,
      param: {},
      key: 'REFRESH',
    }]
  }



  render() {

    console.log('GuideList,this.props', this.props);
    const {
      guideModal: { guideData, editFlag, pagination, reviewYearData, visibleViewYear },
      user:{roleName},
      loadingList,
      loadingUpdate,
      loadingAdd,
    } = this.props;
    const { checks, drawerVisible } = this.state;

    // 下三行为字典操作，目前是本地的字典！！！
    const guideStateArr = utils.getDictByType(this.gDictData, 'GuideStatus');
    const filterGuideState = [];
    guideStateArr.map(value => filterGuideState.push({ text: value.val, value: value.k }));
    console.log('GuideList,guideStateArr', guideStateArr);

    const searchList = [
      {
        title: '任务名称',
        field: 'guideName',
        type: 'input',
      },
      {
        title: '任务状态',
        field: 'status',
        type: 'other',
        renderComponent: () => <AdvancedSelect
          dataSource={guideStateArr}
          type='DATADICT'
          onChange={this.handleStateChange}
        />,
      },
      {
        title: '年份(等后端)',
        field: 'year',
        type: 'input',
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
        title: '任务名称',
        dataIndex: 'guideName',
        key: 'guideName',
        align: 'left',
        width: 120,
        render: (record = '') => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 14) {
            data = data.substring(0, 13);
            data += '......';
          }
          return (
            <Popover
              content={record}
              autoAdjustOverflow
              mouseEnterDelay={0.2}
              placement='right'
            >
              {data}
            </Popover>
          );
        },
      },
      {
        title: '任务简称',
        dataIndex: 'guideBrief',
        key: 'guideBrief',
        align: 'left',
        width: 80,
        render: (record = '') => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 14) {
            data = data.substring(0, 13);
            data += '......';
          }
          return (
            <Popover
              content={record}
              autoAdjustOverflow
              mouseEnterDelay={0.2}
              placement='right'
            >
              {data}
            </Popover>
          );
        },
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        width: 80,
        render: (v) => utils.getAllDictNameById(this.gDictData, 'GuideStatus', v) || '',
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
        align: 'center',
        render: (text, record) => (
          this.createAction(text, record)
        ),
      },
    ];

    const btnList = {
      primaryBtn: this.btnListStatus[roleName],
    };

    return (
      <PageHeaderWrapper title='任务列表'>
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.advancedSearch}
          pagination={pagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={btnList} selectedRows={checks} />
          <StandardTable
            selectedRows={checks}
            loading={loadingList}
            data={guideData}
            rowKey={record => record.guideId}
            onSelectRow={this.onSelectChange}
            columns={columns}
            onChange={this.handleStandardTableChange}
            rowSelection={null}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default GuideList;
