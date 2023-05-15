import React, {PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import { Form, Card, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import styles from "../../utils/styles/StandardTableStyle.less";
import * as config from '../../utils/projectApprovalConfig'
import * as utils from "../../utils/utils";
import { PROJECT_DEPARTMENT_TYPE } from '../../utils/Enum'


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({regProjectApprovalModal,basicdata,loading,global,user}) => ({
  regProjectApprovalModal,
  basicdata,
  user,
  global,
  loading: loading.models.regProjectApprovalModal,
}))
@Form.create()
class ConcludeStage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      formValues: [],
      guideStage: 2,
      stageType: 'conclude',
    };
  }

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
    this.listPage();
  }

  listPage = (params) => {
    const date=new Date().getFullYear();
    const { dispatch } = this.props;
    const { guideStage, stageType } = this.state;
    if(params&&params.currentPage === 0) {
      params.currentPage = 1;
    }
    dispatch({
      type: 'regProjectApprovalModal/fetch',
      payload: {
        guideStage,
        currentPage: 1,
        pageSize: 10,
        reviewYear: date,
        stateBegin:9,
        stateEnd:9,
        ...params,
        stageType,
      }
    });
  };

  doSearch = (params) => {
    const { currentPage, pageSize, ...formValues } = params;
    this.setState({
      formValues,
    },() => this.listPage(params))
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleDetail = (record,type) => {
    const { regProjectApprovalModal :{ urlWay } } = this.props;
    router.push({
      pathname: `${urlWay}/concludeList/${record.guideId}/${type}/${record.reviewYear}`,
      query: {prevent: true}
    });
  };

  handleRefresh = () => {
    this.listPage();
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.listPage(params);
  };


  renderOption = (record, type) => {
    if(type === PROJECT_DEPARTMENT_TYPE.DISTRICT || type === PROJECT_DEPARTMENT_TYPE.CITY) {
      return (
        <Fragment>
          <a onClick={() => this.handleDetail(record,1)}>查看</a>
        </Fragment>
      )
    }
    if (type === PROJECT_DEPARTMENT_TYPE.UNIVERSITIES){
      return (
        <Fragment>
          <a onClick={() => this.handleDetail(record,0)}>查看</a>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <a onClick={() => this.handleDetail(record,0)}>高校</a>
        <Divider type="vertical" />
        <a onClick={() => this.handleDetail(record,1)}>非高校</a>
      </Fragment>
    )
  };

  render() {
    const {regProjectApprovalModal: {guideListData}, loading } = this.props;
    const {basicdata:{gDictData}}=this.props;
    const {selectedRows, stageType} = this.state;
    const { pagination = {} } = guideListData[stageType];
    const { user: { userData = {} }} = this.props;
    const { departmentType = -1} = userData;
    const btnList = {
      primaryBtn: [{
        func: this.handleRefresh,
        param: [],
        key: 'REFRESH',
      }],
    };
    const columns = [...config.ListColumns];
    columns.push({
        title: '指南状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render (v) {
          return utils.getAllDictNameById(gDictData,"guideState",v)||"";
        },
      },
      {
        title: '查看',
        align: 'center',
        render: (text, record) => (
          this.renderOption(record, departmentType)
        ),
      });
    return (
      <PageHeaderWrapper title="结项阶段">
        <AdvancedSearchForm
          searchList={config.searchList}
          doSearch={this.doSearch}
          pagination={pagination}
          loading={loading}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={guideListData[stageType]}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.guideId}
              rowSelection={null}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default ConcludeStage;
