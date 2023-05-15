import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, message,Divider,Tooltip,Icon,Button ,Modal,Popover} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import * as utils from '../../utils/utils';
import FooterToolbar from '@/components/FooterToolbar';
import AdvancedSearchForm from '../../components/AdvancedSearchForm';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import ProjectDetail from '../../components/ProjectDetail';
import AdvancedDrawer from '@/components/AdvancedDrawer';

const  draft=0;
const legislationSuccess=4;
const {confirm}=Modal;
@connect(({ loading, EduMangeProjectsModel,basicdata }) => ({
  loading,
  basicdata,
  EduMangeProjectsModel,
  listLoading: loading.effects['EduMangeProjectsModel/getProjectList'],
  drawerLoading: loading.effects['EduMangeProjectsModel/EduMangeProjectsModel'],
}))

export  default  class EditProjects_Projects extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      drawerVisible: false,
      searchMoreParams:{},
    };
  };

  componentDidMount() {
    this.listPage();
  };

  listPage = (data) => {
    const {EduMangeProjectsModel:{projectPagination}}=this.props;
    const { dispatch,match:{params} } = this.props;
    const { searchMoreParams } = this.state;
    const isParamsUndefined = Object.keys(data || {});
    dispatch({
      type: 'EduMangeProjectsModel/getAllGuide',
    });
    dispatch({
      type: 'EduMangeProjectsModel/getProjectList',
      payload: isParamsUndefined.length !== 0 ? data :  {
        guideId:params.guideId,
        ...projectPagination,
        ...searchMoreParams
      },
    });
    if (isParamsUndefined.length !== 0) {
      const { currentPage, pageSize, ...searchValue } = data;
      this.setState({
        searchMoreParams: { ...searchValue },
      });
  }};

  advancedSearch = (param) => {
    const {dispatch}=this.props;
    const {match:{params}}=this.props;
    param['guideId']=params.guideId;

    if(param.hasOwnProperty('prjOwner')||param.hasOwnProperty('projectName')||param.hasOwnProperty('state')||param.hasOwnProperty('pilotUnit')){//  如果有说明是条件查询，分页也是有条件的
      this.setState({
        searchMoreParams:param,
      })
    }
    else{//  点击重置
      this.setState({
        searchMoreParams:{}
      })
    }
    dispatch({
      type: 'EduMangeProjectsModel/getProjectList',
      payload: param || {
        guideId:params.guideId,
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
      // project: rows[0],
      // reviewYear:rows[0].reviewYear
    });
  };

  handleStandardTableChange = (pagination) => {
    const {searchMoreParams}=this.state;
    const {match:{params}}=this.props;
    const data={ ...searchMoreParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      guideId:params.guideId,}
    this.listPage(data)
  };

  closeDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  openDrawerProjectDetailByIcon=(record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'EduMangeProjectsModel/getAllProjectDetail',
      payload: {
        projectId: record.projectId,
        reviewYear:record.reviewYear
      },
    });
    this.setState({
      drawerVisible: true,
    });
  };

  openDrawerProjectDetailByButtion = () => {
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('每次只允许查看一条消息')
      return
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'EduMangeProjectsModel/getAllProjectDetail',
      payload: {
        projectId: selectedRows[0].projectId,
        reviewYear:selectedRows[0].reviewYear
      },
    });
    this.setState({
      drawerVisible: true,
    });
  };

  handelReturn=()=>{
    router.push({
      pathname: `/EduMangeProjects/GuideList`,
      query: {prevent: true}
    });
  };

  handleDrawerVisible=(state)=>{
    this.setState({
      drawerVisible:state
    })
  }

  editProjectByIcon=(record)=>{
    const {dispatch}=this.props;
    const {match:{params}}=this.props;
    dispatch({
      type:'EduMangeProjectsModel/getEditPrjInfo',
      payload:{
        projectId:record.projectId,
        guideId:params.guideId
      }
    })
  }

  editProjectByButton=(record)=>{
    const {selectedRows}=this.state;
    if(selectedRows.length>1){
      message.warning('每次只允许查看一条指南的项目');
      return
    }
    const {dispatch}=this.props;
    dispatch({
      type:'EduMangeProjectsModel/getAllAboutPrj',
      payload:{
        projectId:record.projectId
      }
    })
  }

  chooseAction=(record)=>{
    return(
      <Fragment>
        <Tooltip title={'项目详情'}>
          <a onClick={() => this.openDrawerProjectDetailByIcon(record)}><Icon type="eye" /></a>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title={'项目修改'}>
          <a onClick={() => this.editProjectByIcon(record)}><Icon type="edit" /></a>
        </Tooltip>
      </Fragment>
    )
  };

  onChangeDrawerVisible = (value, data) => {
    this.setState({
      drawerVisible: value,
    });
  };

  createProjects=()=>{
    const {match: {params}} = this.props;
    router.push({
      pathname: `/EduMangeProjects/CreateProjects/step1/${params.guideId}`,
      query: {prevent: true}
    })
  };

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`EduMangeProjectsModel/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };

  columns = [{
    title:'项目编号',
    key:'approvalNo',
    dataIndex:'approvalNo',
    render: (record = "") => {
      let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
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
  }, {
    title: '项目名称',
    key: 'projectName',
    dataIndex: 'projectName',
  },{
    title: '项目负责人',
    key: 'prjOwner',
    dataIndex: 'prjOwner',
  },{
    title: '试点单位',
    key: 'pilotUnit',
    dataIndex: 'pilotUnit',
  },{
    title: '项目状态',
    key: 'state',
    dataIndex: 'state',
    render:(text)=>{
      const { gDictData } = this.props.basicdata;
      return(
        utils.getAllDictNameById(gDictData, 'prjState', text)
      )
    }
  }, {
    title: '项目开始时间',
    key: 'prjCreateTime',
    dataIndex: 'prjCreateTime',
  },{
    title: '项目结束时间',
    key: 'prjEndTime',
    dataIndex: 'prjEndTime',
  },{
    title:'操作',
    key:'action',
    render:(text,record)=>this.chooseAction(record),
  }];

  btnList = {
    primaryBtn: [{
      func: this.listPage,
      param: { },
      key: 'REFRESH',
    },{
      func:this.createProjects,
      param:{},
      key : 'ADD',
    }],
    patchBtn: [{
      func: this.openDrawerProjectDetailByButtion,
      param: {},
      key: 'SHOW_MORE',
    },{
      func: this.editProjectByButton,
      param: {},
      key : 'EDIT',
    }],
  };

  searchList = [
    {
      title : '项目名称',
      field : 'projectName',
      type : 'input',
    },
    {
      title : '项目负责人',
      field : 'prjOwner',
      type : 'input',
    },
    {
      title : '试点单位',
      field : 'pilotUnit',
      type : 'input',
    },
    {
      title : '项目状态',
      field : 'state',
      message : '项目所处阶段选择有错',
      type : 'other',
      renderComponent : () => {
        const {gDictData}=this.props.basicdata;
        const prjState=utils.getDictByType(gDictData,'prjState');
        return (<AdvancedSelect dataSource={prjState} searchType='FUZZYSEARCH' placeholder="项目所处阶段" fieldConfig={SelectFieldConfig.userDetail} onChange={() => {}} />);
      },
    },
  ];

  render() {
    const { EduMangeProjectsModel: { projectList,projectPagination } } = this.props;
    const {basicdata:{gDictData}}=this.props;
    const { selectedRows, drawerVisible,} = this.state;
    const { listLoading ,drawerLoading} = this.props;
    const { EduMangeProjectsModel:{projectAllInfo}} = this.props;
    const { EduMangeProjectsModel: { allGuide, allDep } } = this.props;
    const projectDetailOption = {
      allDep,
      allGuide,
      gDictData,
      drawerLoading,
      projectDetail:projectAllInfo,
      downloadFunction:this.downLoadFile
    };

    const drawerOption = {
      drawerTitle:'项目详情',
      drawerContent : <ProjectDetail {...projectDetailOption}/>,
      drawerVisible,
      onChangeDrawerVisible : this.onChangeDrawerVisible,
    };

    return (
      <PageHeaderWrapper title={'项目列表'}>
        <AdvancedSearchForm
          searchList={this.searchList}
          doSearch={this.advancedSearch}
          pagination={projectPagination}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows}/>
          <StandardTable
            selectedRows={selectedRows}
            loading={listLoading}
            data={projectList}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey={record => record.projectId}
          />
        </Card>
        <AdvancedDrawer {...drawerOption}/>
        <FooterToolbar>
          <Button type="primary" style={{marginLeft: 8}} onClick={this.handelReturn} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}
