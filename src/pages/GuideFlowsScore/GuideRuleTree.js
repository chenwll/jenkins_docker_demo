import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Button,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ToolBarGroup from '@/components/ToolBarGroup';
import router from 'umi/router';
import AdvancedDrawer from '@/components/AdvancedDrawer';
import FooterToolbar from '@/components/FooterToolbar';
import styles from '../../utils/styles/StandardTableStyle.less'
import RuleDetail from './RuleDetail';

const { confirm } = Modal;

@connect(({ guideScoreModel, loading, global }) => ({
  global,
  guideScoreModel,
  loading: loading.models.guideScoreModel,
  loadingList: loading.effects['guideScoreModel/fetch'],
  loadingUpdate: loading.effects['guideScoreModel/UpdateUser'],
  loadingDelete: loading.effects['guideScoreModel/deleteRule'],
}))
@Form.create()
class GuideRuleTree extends PureComponent {
  state = {
    // 该数组传入选中项的key,当前仅用作标识选择不为空
    selectedRows: [],
    // 选择项的具体信息，主要用到节点id和父节点id
    selectRow: {},
    doubleSelect:{},
    drawerVisible: false,
    // 打开抽屉状态，1为新建，2为修改，3为添加下一级（接口同1）
    drawerStatus: 0,
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
      width: '20%'
    },
    {
      title : '规则描述',
      dataIndex : 'discription',
      key : 'discription',
      width: '20%'
    },
    {
      title : '满分',
      dataIndex : 'fullMarks',
      key : 'fullMarks',
      width: '10%'
    },
  ];

  componentDidMount() {
    this.listPage();
  }

  listPage = () => {
    const { match:{ params } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type : 'guideScoreModel/getTree',
      payload : params,
    });
  };

  getItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'guideScoreModel/getItem',
      payload: {
        psId: id,
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

  handleToolBar = (status) =>{
    this.setState({
      drawerStatus: status[0],
      drawerVisible : true,
    });
  };

  handleBack = () => {
    const {dispatch} = this.props;
    dispatch({
      type : 'guideScoreModel/fetch',
      payload : {
        currentPage : 1,
        pageSize : 10,
      },
    });
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '流程打分详情',
      },
    });
    router.push(`/GuideSetting/GuideFlowsScore`);
  };

  onCloseDrawer = () => {
    this.setState({
      drawerVisible : false,
      doubleSelect: {},
    });
  };

  loop = (node,deep='0') => {
    node.forEach((item,index) => {
      if (item.child) {
        this.loop(item.child,`${deep}-${index+1}`);
      }
      item.key = `${deep}-${index+1}`;
    });
  };

  render() {
    const { guideScoreModel: { tree }, loading }=this.props;
    const { match:{ params } } = this.props;
    if(tree.length>0){
      this.loop(tree);
    }
    const { selectedRows, drawerVisible, drawerStatus, selectRow, doubleSelect = {} } = this.state;
    const btnList = {
      patchBtn : [{
        func : this.handleToolBar,
        param : [2],// 2，修改
        key : 'EDIT',
      }]
    };
    const rowSelection = {
      type: 'radio',
      onChange: this.handleSelectRows,
      onSelect: this.handleSelect,
    };
    let drawerTitle = '';
    switch (drawerStatus) {
      case 1: drawerTitle = '新建规则';break;
      case 2: drawerTitle = '修改当前级';break;
      default: drawerTitle = '添加下一级';break;
    }
    const itemSelect = JSON.stringify(doubleSelect)==='{}'?selectRow:doubleSelect;
    const detailProps = {
      tree,
      params,
      drawerStatus,
      selectRow: itemSelect,
      getItem: this.getItem,
      onClose : this.onCloseDrawer,
    };
    return (
      <PageHeaderWrapper title="流程打分详情">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} />
            <StandardTable
              childrenColumnName='child'
              selectedRows={selectedRows}
              loading={loading}
              data={{list: tree}}
              pagination={false}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              rowSelection={rowSelection}
              rowKey={record => record.key}
              onRow={(record) => ({
                onDoubleClick: () => {
                  this.setState({
                    doubleSelect: record,
                  });
                  this.handleToolBar([2])
                }
              })}
            />
          </div>
        </Card>
        <AdvancedDrawer
          drawerTitle={drawerTitle}
          drawerContent={<RuleDetail {...detailProps} />}
          onChangeDrawerVisible={this.onCloseDrawer}
          drawerVisible={drawerVisible}
          destroyOnClose
          placement="right"
          closable
        />
        <FooterToolbar>
          <Button type="primary" onClick={this.handleBack}>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default GuideRuleTree;
