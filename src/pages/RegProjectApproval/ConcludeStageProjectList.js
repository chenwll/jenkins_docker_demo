import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button,Tooltip,Divider,Icon} from 'antd';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import ProjectRecommend from './ProjectRecommend';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ToolBarGroup from '@/components/ToolBarGroup';
import { PROJECT_BUTTON_LIST, PROJECT_PROCESS_TYPE, REG_STATICS_SELFPROJECTS_STATE } from '../../utils/Enum';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from "../../utils/styles/StandardTableStyle.less";
import ProjectDetail from '../../components/ProjectDetail';
import * as config from '../../utils/projectApprovalConfig'
import AdvancedSelect from '../../components/AdvancedSelect';
import * as utils from '../../utils/utils';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ regProjectApprovalModal, loading, basicdata, global }) => ({
  regProjectApprovalModal,
  global,
  basicdata,
  loading: loading.models.regProjectApprovalModal,
  loadingList: loading.effects['regProjectApprovalModal/getRecommendDetail'],
  loadingSave: loading.effects['regProjectApprovalModal/save'],
  drawerLoading:loading.effects['regProjectApprovalModal/getProjectContext']
}))
class ConcludeStageProjectList extends PureComponent {

  state = {
    formValues: {},
    drawerVisible : false,
    drawerApprovalVisible: false,
    selectedRows: [],
    selectDetail: {},
    pageInfo: {},
    selectType: 'checkbox',
    stageType: 'conclude',
  };

  componentWillMount() {
    const { match: { url }, dispatch } = this.props;
    if(url&&url.search('/edu/')!==-1) {
      dispatch({
        type: 'regProjectApprovalModal/save',
        payload: {
          urlWay: '/projectEducation/edu',
          APIType: 'edu'
        }
      });
    } else {
      dispatch({
        type: 'regProjectApprovalModal/save',
        payload: {
          urlWay: '/AreaDepartmentSetting/regProjectApproval',
          APIType: 'reg'
        }
      })
    }
  }

  componentDidMount() {
    const { dispatch, match:{params:{processType}} } = this.props;
    this.listPage();
    dispatch({
      type: 'regProjectApprovalModal/getAllDepart',
    });
    dispatch({
      type: 'regProjectApprovalModal/getAllGuide',
    });
    const { match: { url } } = this.props;
    if(url&&url.search('/edu/')!==-1) {
      dispatch({
        type: 'regProjectApprovalModal/save',
        payload: {
          urlWay: '/projectEducation/edu',
          APIType: 'edu'
        }
      });
    } else {
      dispatch({
        type: 'regProjectApprovalModal/save',
        payload: {
          urlWay: '/AreaDepartmentSetting/regProjectApproval',
          APIType: 'reg'
        }
      })
    }
    if(processType <= 2) {
      this.setState({
        selectType: 'radio',
      });
    }
  }

  listPage = (params) => {
    const { dispatch,match : { params: { type, ...pageInfo } } } = this.props;
    const { stageType } = this.state;
    if(params&&params.currentPage === 0) {
      params.currentPage = 1;
    }
    dispatch({
      type: 'regProjectApprovalModal/getRecommendDetail',
      payload: {
        currentPage: 1,
        pageSize: 10,
        flag: 0,
        state: 0,
        ...pageInfo,
        ...params,
        stageType,
      },
    });
  };

  handelCancel=()=>{
    const { match : { params } } = this.props;
    const { regProjectApprovalModal :{ urlWay } } = this.props;
    router.push({
      pathname: `${urlWay}/concludeList/${params.guideId}/${params.type}/${params.reviewYear}`,
      query: {prevent: true}
    });
  };

  onCloseDrawer=()=>{
    this.setState({
      drawerVisible : false,
      drawerApprovalVisible: false,
    });
    this.listPage();
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleSelect = row => {
    this.setState({
      recommendDetail : row,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues, pageInfo } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
      ...filters,
      ...formValues,
      ...pageInfo,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.listPage(params)
  };

  handleLook = (value) =>{
    const {dispatch}=this.props;
    dispatch({
      type: 'regProjectApprovalModal/getProjectContext',
      payload: {
        projectId: value.projectId,
        reviewYear:value.reviewYear,
      }
    })
    this.setState({
      selectDetail: value,
      drawerVisible: true,
    })
  };

  handleDistribution=(record)=>{
    const arr=[];
    arr.push(record.projectId)
    this.setState({
      drawerApprovalVisible : true,
      selectedRows:arr,
    });
  };


  handleToolBar = () => {
    this.setState({
      drawerApprovalVisible: true,
    })
  };

  doSearch = (params) => {
    const { pageInfo } = this.state;
    const { currentPage, pageSize, ...formValues } = params;
    this.setState({
      formValues,
    },() => this.listPage({
      ...pageInfo,
      ...params,
    }))
  };

  filterButton = (data, type) => {
    if(type === -1){
      return
    }
    const newArr = [];
    for (let i = 0; i < data.length; i+=1) {
      const res = type & (1 << i);
      if (res !== 0) {
        newArr.push(data[i]);
      }
    }
    return newArr;
  };

  renderApproval = () => {
    // const {
    //   match: { params = {} },
    //   basicdata: { gDictData },
    // } = this.props;
    // const {selectedRows,drawerApprovalVisible}=this.state;
    // const contentOptionsRecommend = {
    //   gDictData,
    //   processType: params.processType,
    //   processId: params.processId,
    //   projectId: selectedRows[0],
    //   onClose: this.onCloseDrawer,
    // };
    // return {
    //   drawerTitle: "推荐",
    //   drawerContent: <ProjectRecommend {...contentOptionsRecommend} />,
    //   drawerVisible:drawerApprovalVisible,
    //   onChangeDrawerVisible: this.onCloseDrawer,
    // };


    const {
      regProjectApprovalModal : { recommendType, projectRefDetail },
      match : { params = {} },
      basicdata : { gDictData },
    } = this.props;
    const { selectedRows, drawerApprovalVisible, stageType } = this.state;
    const { match : { url } } = this.props;
    const { match : { params : { type, ...pageInfo } } } = this.props;
    let currProcessId = 0;// 当前流程编号
    const projectId = selectedRows[0];// 当前项目编号
    // 如果是专家的情况不需要传入processId;
    if (url.search(/exp/) != -1) {
      delete pageInfo.processId;
    }
    // 当是专家的时候从列表中获取processId
    // 19-5-12修改  ，加上限制条件&& selectedRows[0]， 以上
    if (url.search(/exp/) != -1 && projectRefDetail[stageType].list && selectedRows[0]) {
      const { list } = projectRefDetail[stageType];
      const res = list.filter((v) => v.projectId == selectedRows[0]);
      currProcessId = res[0].processId;
    } else {
      currProcessId = params.processId;
    }
    const page = {
      currentPage : 1,
      pageSize : 10,
      flag : 0,
      state : REG_STATICS_SELFPROJECTS_STATE.UNFINISH,
      ...pageInfo,
      stageType,
    };
    const refsId = this.getRefID(projectRefDetail[stageType], projectId);
    const contentOptionsRecommend = {
      page,
      gDictData,
      recommendType,
      processType : params.processType,
      reviewYear : params.reviewYear,
      refsId,
      processId : currProcessId,
      projectId,
      onClose : this.onCloseDrawer,
    };
    return {
      drawerTitle : '推荐',
      drawerContent : <ProjectRecommend {...contentOptionsRecommend} />,
      drawerVisible : drawerApprovalVisible,
      onChangeDrawerVisible : this.onCloseDrawer,
    };
  };

  getRefID = (projectRefDetail, projectId) => {
    if (!projectId) {
      return 0;
    }
    if (projectRefDetail.list) {
      const { list } = projectRefDetail;
      let res=[];
      res = list.filter((v) => v.projectId == projectId);
      if(res.length>0){
        return (res[0].refId);
      }
    } else {
      // console.log('没有项目数据');
      return 0;
    }
  };

  renderScore = () => {
    const {
      regProjectApprovalModal :{ urlWay },
      match : { params }
    } = this.props;
    const {selectedRows}=this.state;
    router.push({
      pathname: `${urlWay}/concludeProjectDetailScore/${params.guideId}/${params.processId}/${params.processType}/${params.type}/${selectedRows[0]}`,
      query: {prevent: true}
    });
  };

  renderDrawer = () => this.renderApproval();

  renderButton = () => {
    const{match:{params:{processType}}} = this.props;
    switch (Number(processType)) {
      case PROJECT_PROCESS_TYPE.APPROVAL:
        return PROJECT_BUTTON_LIST.RECOMMEND;
      default:
        return PROJECT_BUTTON_LIST.SCORE;
    }
  };

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`regProjectApprovalModal/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };

  render() {
    const {
      regProjectApprovalModal:{projectRefDetail, departList, guideList},
      match: { params = {} },
      basicdata: { gDictData },
      loadingList,
      loading,
      drawerLoading,
    } = this.props;
    const {
      regProjectApprovalModal: {
        projectContextDetail: detail,
      }
    } = this.props;
    const {drawerVisible, selectedRows, selectType, stageType}=this.state;
    const {pagination = {}} = projectRefDetail[stageType];
    const drawerTitleProject="详细";
    const contentOptions = {
      allDep:departList,
      allGuide:guideList,
      gDictData,
      projectDetail:detail,
      drawerLoading,
      downloadFunction:this.downLoadFile,
    };
    const projectDetailProps = {
      drawerTitle: drawerTitleProject,
      drawerContent: <ProjectDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible: this.onCloseDrawer,
    };
    const patchBtnList =  [{
      func : this.handleToolBar,
      param : {},
      key : 'PROJECT_RECOMMEND',
    },{
      func : this.handleToolBar,
      param : {},
      key : 'PROJECT_EXPERT',
    },{
      func : this.handleToolBar,
      param : {},
      key : 'PROJECT_DISTRIBUTION',
    },{
      func : this.renderScore,
      param : {},
      key : 'PROJECT_SCORE',
    }
    ];
    const buttonType = this.renderButton();
    const btnList = {
      primaryBtn: [{
        func: this.listPage,
        param: [],
        key: 'REFRESH',
      }],
      patchBtn:this.filterButton(patchBtnList,buttonType)
    };
    const searchList = [...config.searchListProjectDetail];
    searchList.push({
      title: '单位类型',
      field: 'schoolType',
      type: 'other',
      renderComponent : () => (
        <AdvancedSelect
          dataSource={utils.getDictByType(gDictData,'schoolType')}
          fieldConfig={SelectFieldConfig.userSearchFiledConfig}
          searchType="FUZZYSEARCH"
          onChange={() => {}}
        />),
    });
    const cardTitle = params.type==='1'?'非高校立项阶段':'高校立项阶段';
    const columns = [
      {
        title:'项目名称',
        dataIndex:'projectName',
        key:'projectName',
      },
      {
        title : '项目负责人',
        dataIndex : 'prjOwner',
        key : 'prjOwner',
      },
      {
        title : '试点单位',
        dataIndex : 'pilotUnit',
        key : 'pilotUnit',
      },
      {
        title: '类型',
        dataIndex: 'schoolType',
        key: 'schoolType',
        render: (text) => (
          <Fragment>
            {utils.getAllDictNameById(gDictData,'schoolType',String(text))}
          </Fragment>
        ),
      },
      {
        title : '操作',
        dataIndex : 'option',
        width: '10%',
        render: (text, record) => (
          // {/*<a onClick={() => this.handleLook(record)}>查看详情</a>*/}
          <Fragment>
            <Tooltip title='查看详情'>
              <a onClick={() => this.handleLook(record)}><Icon type="eye" /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='推荐'>
              <a onClick={() => this.handleDistribution(record)}><Icon type="like" /></a>
            </Tooltip>
          </Fragment>
        )
      },
    ];
    const drawerApprovalProps = this.renderDrawer();
    const rowSelection = {
      type: selectType,
      onChange: this.handleSelectRows,
      onSelect: this.handleSelect,
    };
    return (
      <PageHeaderWrapper>
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.doSearch}
          pagination={pagination}
          loading={loading}
        />
        <Card bordered={false} title={<h2>{cardTitle}</h2>}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loadingList}
              data={projectRefDetail[stageType]}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.projectId}
              onRow={(record) => ({
                onDoubleClick: () => {
                  this.handleLook(record)
                }
              })}
              rowSelection={rowSelection}
            />
          </div>
          <AdvancedDrawer {...projectDetailProps} />
          <AdvancedDrawer {...drawerApprovalProps} />
          <FooterToolbar>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.handelCancel} htmlType='button'>
              返回
            </Button>
          </FooterToolbar>
        </Card>
      </PageHeaderWrapper>
    );
  }

}

export default ConcludeStageProjectList;
