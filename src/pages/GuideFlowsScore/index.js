import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ToolBarGroup from '@/components/ToolBarGroup';
import AdvancedDrawer from '@/components/AdvancedDrawer';
import AdvancedSearchForm from'@/components/AdvancedSearchForm'
import router from 'umi/router';
import GuideRuleDetail from './GuideRuleDetail';
import styles from '../../utils/styles/StandardTableStyle.less'

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ guideScoreModel, loading }) => ({
  guideScoreModel,
  loading: loading.models.guideScoreModel,
}))
@Form.create()
class GuideFlowsScore extends PureComponent {
  state = {
    drawerVisible: false,
    selectedRows: [],
  };

  columns = [
    {
      title:'规则名称',
      dataIndex:'ruleName',
      key:'ruleName',
    },
    {
      title : '规则简介',
      dataIndex : 'ruleBrief',
      key : 'ruleBrief',
      width: '25%'
    },
    {
      title : '规则描述',
      dataIndex : 'discription',
      key : 'discription',
      width: '25%'
    },
    {
      title : '满分',
      dataIndex : 'fullMarks',
      key : 'fullMarks',
      width: '10%'
    },
    {
      title : '权重',
      dataIndex : 'weight',
      key : 'weight',
      width: '10%'
    },
    {
      title : '操作',
      dataIndex : 'option',
      width: '10%',
      render: (text, record) => (
        <a onClick={() => this.handleEdit(record)}>编辑</a>
        )
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'guideScoreModel/allEndRule',
      payload: {parentId:0},
    });
    this.listPage();
  }

  listPage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type : 'guideScoreModel/fetch',
      payload : params || {
        currentPage : 1,
        pageSize : 10,
      },
    });
  };

  doSearch = (data) => {
    this.listPage({
      ...data,
      currentPage : 1,
      pageSize : 10,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage : pagination.current,
      pageSize : pagination.pageSize,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type : 'guideScoreModel/fetch',
      payload : params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleSave = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'guideScoreModel/add',
      payload: data,
    });
    this.onCloseDrawer();
  };


  onHandleDelete =()=> {
      Modal.confirm({
        title: '删除规则',
        content: '确定删除这项规则吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.handleDelete(),
      });

  }

  handleDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const [id] = selectedRows;
    dispatch({
      type: 'guideScoreModel/del',
      payload: {id},
    })
  };

  handleEdit = (record) => {
    let { selectedRows: [id] } = this.state;
    if(record && !record.select) {
      id = record.treeId;
    }
    let rootId=record.ruleId;
    router.push(`/GuideSetting/GuideFlowsScore/${id}/${rootId}`);
  };

  onOpenDrawer = () => {
    this.setState({
      drawerVisible : true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      drawerVisible : false,
    });
  };

  render() {
    const {
      drawerVisible,
      selectedRows,
    } = this.state;
    const {
      loading,
      guideScoreModel: {
        data,
        endRule,
        data: { pagination = {} },
      }
    } = this.props;
    const rowSelection = {
      type: 'radio',
      onChange: this.handleSelectRows,
      onSelect: this.handleSelect,
    };
    const btnList = {
      primaryBtn : [{
        func : this.onOpenDrawer,
        param : [1],// 1，新建
        key : 'ADD',
      }],
      // patchBtn : [{
      //   func : this.onHandleDelete,
      //   param : [true],
      //   key : 'DELETE',
      // }],
    };
    const detailProps = {
      endRule,
      handleSave: this.handleSave,
      onClose : this.onCloseDrawer,
    };
    const searchList = [
      {
        title: '规则名称',
        field: 'ruleName',
        message: '规则名称输入有误',
        type: 'input',
      },
      {
        title: '通过分数',
        field: 'fullMarks',
        message: '通过分数输入有误',
        type: 'inputNumber',
      },
    ];
    return (
      <PageHeaderWrapper title="流程评分规则">
        <Card bordered={false}>
          <AdvancedSearchForm
            searchList={searchList}
            pagination={pagination}
            doSearch={this.doSearch}
          />
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowSelection={rowSelection}
              rowKey={record => record.treeId}
              onRow={(record) => ({
                onDoubleClick: () => {
                  this.handleEdit(record)
                }
              })}
            />
          </div>
        </Card>
        <AdvancedDrawer
          drawerTitle='新建规则'
          drawerContent={<GuideRuleDetail {...detailProps} />}
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

export default GuideFlowsScore;
