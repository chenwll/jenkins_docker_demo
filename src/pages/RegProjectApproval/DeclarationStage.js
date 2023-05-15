import React, {PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import { Form, Card, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import { ProjectHasSubmit } from '../../utils/Enum';
import styles from "../../utils/styles/StandardTableStyle.less";
import * as config from '../../utils/projectApprovalConfig'
import * as utils from "../../utils/utils";
import {getTypeByUrl} from './ApprovalUtils'


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({regProjectApprovalModal,basicdata,loading,global}) => ({
  regProjectApprovalModal,
  basicdata,
  global,
  loading: loading.models.regProjectApprovalModal,
}))
@Form.create()
class DeclarationStage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      formValues: [],
      guideStage: 0,
      stageType: 'declaration',
    };
  }

  componentWillMount() {
    const { match: { url }, dispatch } = this.props;
    getTypeByUrl(dispatch,url);
  }

  componentDidMount() {
    this.listPage();
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    const { guideStage, stageType } = this.state;
    if(params&&params.currentPage === 0) {
      params.currentPage = 1;
    }
    dispatch({
      type: `regProjectApprovalModal/fetch`,
      payload: {
        guideStage,
        currentPage: 1,
        pageSize: 10,
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

  handleDetail = (record,flag) => {
    const { regProjectApprovalModal :{ urlWay } } = this.props;
    const { guideStage } = this.state;
    router.push({
      pathname: `${urlWay}/declarationList/${guideStage}/${record.guideId}/${flag}`,
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

  renderOption = (record) => (
    <Fragment>
      <a onClick={() => this.handleDetail(record,ProjectHasSubmit.YES)}>已提交</a>
      <Divider type="vertical" />
      <a onClick={() => this.handleDetail(record,ProjectHasSubmit.NO)}>未提交</a>
    </Fragment>
  );

  render() {
    const {regProjectApprovalModal: {guideListData}, loading } = this.props;
    const {basicdata:{gDictData}}=this.props;
    const {selectedRows, stageType} = this.state;
    // const { pagination = {} } = guideListData[stageType];
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
        title: '提交状态',
        align: 'center',
        render: (text, record) => (
          this.renderOption(record)
        ),
      });
    return (
      <PageHeaderWrapper title="申报阶段">
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

export default DeclarationStage;
