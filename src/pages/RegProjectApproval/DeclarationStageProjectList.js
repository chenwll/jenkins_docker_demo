import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button } from 'antd';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import AdvancedDrawer from '../../components/AdvancedDrawer';
import styles from "../../utils/styles/StandardTableStyle.less";
import ProjectDetail from '../../components/ProjectDetail';
import * as config from '../../utils/projectApprovalConfig'
import AdvancedSelect from '../../components/AdvancedSelect';
import * as utils from '../../utils/utils';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import { getTypeByUrl } from './ApprovalUtils';


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
  drawerLoading:loading.effects['regProjectApprovalModal/getProjectContext'],
}))
class RegProjectDetailList extends PureComponent {

  state = {
    formValues: {},
    drawerVisible : false,
    selectedRows: [],
    selectDetail: {},
    pageInfo: {},
    stageType: 'declaration',
  };

  componentWillMount() {
    const { match: { url }, dispatch } = this.props;
    getTypeByUrl(dispatch,url);
  }

  componentDidMount() {
    const { dispatch, match : { params } } = this.props;
    this.setState({
      pageInfo: params,
    });
    this.listPage(params);
    dispatch({
      type: 'regProjectApprovalModal/getAllDepart',
    });
    dispatch({
      type: 'regProjectApprovalModal/getAllGuide',
    })
  }

  listPage = (params) => {
    const { stageType } = this.state;
    const { dispatch } = this.props;
    if(params&&params.currentPage === 0) {
      params.currentPage = 1;
    }
    const pageInfo = {
      stageType,
      currentPage: 1,
      pageSize: 10,
      ...params,
    };
    dispatch({
      type: 'regProjectApprovalModal/fetchGuideProject',
      payload: pageInfo,
    });
  };

  handelCancel=()=>{
    const { regProjectApprovalModal :{ urlWay } } = this.props;
    router.push({
      pathname: `${urlWay}/declaration`,
      query: {prevent: true}
    });
  };

  onCloseDrawer=()=>{
    this.setState({
      drawerVisible : false,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
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
      drawerLoading
    } = this.props;
    const { drawerVisible, selectedRows, stageType }=this.state;
    const {pagination = {}} = projectRefDetail[stageType];
    const drawerTitleProject="详细";
    const {
      regProjectApprovalModal: {
        projectContextDetail: detail,
      }
    } = this.props;
    const contentOptions = {
      allDep:departList,
      allGuide:guideList,
      gDictData,
      projectDetail:detail,
      drawerLoading,
      downloadFunction:this.downLoadFile
    };
    const regProjectDetailProps = {
      drawerTitle: drawerTitleProject,
      drawerContent: <ProjectDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible: this.onCloseDrawer,
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
    const columns = [...config.columnsProjectDetail];
    columns.push({
      title : '操作',
      dataIndex : 'option',
      width: '10%',
      render: (text, record) => (
        <a onClick={() => this.handleLook(record)}>查看详情</a>
      )
    });
    const cardTitle = params.flag==='1'?'申报阶段已提交':'申报阶段未提交';
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
            <StandardTable
              selectedRows={selectedRows}
              loading={loadingList}
              data={projectRefDetail[stageType]}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.projectId}
              rowSelection={null}
              onRow={(record) => ({
                onDoubleClick: () => {
                  this.handleLook(record)
                }
              })}
            />
          </div>
          <AdvancedDrawer {...regProjectDetailProps} />
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

export default RegProjectDetailList;
