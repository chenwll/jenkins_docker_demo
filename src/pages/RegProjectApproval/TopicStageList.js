import React, {PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import { Form, Card, Button, message } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ToolBarGroup from '@/components/ToolBarGroup';
import StandardTable from '@/components/StandardTable';
import { PROJECT_PROCESS_TYPE } from '../../utils/Enum'
import FooterToolbar from '@/components/FooterToolbar';
import styles from "../../utils/styles/StandardTableStyle.less";
import * as utils from "../../utils/utils";
import {getTypeByUrl} from './ApprovalUtils';


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

class TopicStageList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      stageType: 'topic',
    };
  }

  componentWillMount() {
    const { match: { url }, dispatch } = this.props;
    getTypeByUrl(dispatch,url);
  }

  componentDidMount() {
    const {match : { params }, dispatch} = this.props;
    dispatch({
      type: 'regProjectApprovalModal/getAllDepart',
    });
    this.listPage(params);
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    const { stageType } = this.state;
    dispatch({
      type: 'regProjectApprovalModal/fetchProject',
      payload:{
        ...params,
        stageType,
      },
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleApplication = (record) => {
    const { match : { params } } = this.props;
    const { regProjectApprovalModal :{ urlWay } } = this.props;
    let url = 'topicProjectList';
    switch (record.processType) {
      case PROJECT_PROCESS_TYPE.EXPERT_APPROVAL:
      case PROJECT_PROCESS_TYPE.EXPERT_SCORE:
        url = 'topicProjectListByExpert';break;
      case PROJECT_PROCESS_TYPE.DEPART_APPROVAL:
      case PROJECT_PROCESS_TYPE.DEPART_SCORE:
        url = 'topicProjectListByDepartment';break;
      default: break;
    }
    if(url !== 'topicProjectList' && urlWay.search(/projectEducation/) === -1) {
      message.warn('当前用户不允许访问！');
      return
    }
    router.push({
      pathname: `${urlWay}/${url}/${record.guideId}/${record.processId}/${record.processType}/${params.type}/${params.reviewYear}`,
      query: {prevent: true}
    });
  };

  handleRefresh = () => {
    const { match : { params } } = this.props;
    this.listPage(params);
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {match : { params: pageInfo } } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      ...pageInfo,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.listPage(params)
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

  handleBack = () => {
    const { regProjectApprovalModal :{ urlWay } } = this.props;
    router.push({
      pathname: `${urlWay}/topic`,
      query: {prevent: true}
    });
  };

  render() {
    const {
      regProjectApprovalModal: {projectListData, departList = []},
      match : { params: { type } },
      loading
    } = this.props;
    const {basicdata:{gDictData}}=this.props;
    const {selectedRows,stageType} = this.state;
    const cardTitle = type==='1'?'非高校立项阶段':'高校立项阶段';
    const btnList = {
      primaryBtn: [{
        func: this.handleRefresh,
        param: [],
        key: 'REFRESH',
      }]
    };
    const columns = [{
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      align: 'center',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 60,
    }, {
      title: '部门',
      dataIndex: 'depId',
      key: 'depId',
      render: (text) => (
        <Fragment>
          {this.exchangeCodeToString(departList,'depName','departmentId',text)}
        </Fragment>
      ),
    }, {
      title: '部门类型',
      dataIndex: 'depType',
      key: 'depType',
      render: (text) => (
        <Fragment>
          {utils.getAllDictNameById(gDictData,'depType',String(text))}
        </Fragment>
      ),
    }, {
      title: '评价形式',
      dataIndex: 'processType',
      key: 'processType',
      render: (text) => (
        <Fragment>
          {utils.getAllDictNameById(gDictData,'processType',String(text))}
        </Fragment>
      ),
    }, {
      title: '处理阶段',
      dataIndex: 'processStage',
      key: 'processStage',
      render: (text) => (
        <Fragment>
          {utils.getAllDictNameById(gDictData,'processStage',String(text))}
        </Fragment>
      ),
    }, {
      title: '处理序号',
      key: 'sort',
      dataIndex: 'sort',
    }, {
      title: '项目总量',
      dataIndex: 'amount',
      key: 'amount',
    }, {
      title: '未完成量',
      dataIndex: 'unfinished',
      key: 'unfinished',
    }, {
      title: '成功通过量',
      dataIndex: 'succeed',
      key: 'succeed',
    }, {
      title: '失败量',
      dataIndex: 'fail',
      key: 'fail',
    }, {
      title:'操作',
      align: 'center',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleApplication(record)}>查看</a>
        </Fragment>
      ),
    },];
    return (
      <PageHeaderWrapper title="项目评审列表">
        <Card bordered={false} title={<h2>{cardTitle}</h2>}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={{list: projectListData[stageType]}}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.processId}
              rowSelection={null}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={this.handleBack}>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    )
  }
}

export default TopicStageList;
