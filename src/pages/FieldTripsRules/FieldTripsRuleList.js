import React, { Fragment, PureComponent } from "react";
import { connect } from "dva";
import { Card, Modal, Divider, Table, Icon, Tooltip } from "antd";
import { router } from "umi";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import ToolBarGroup from "@/components/ToolBarGroup";
import AdvancedDrawer from "@/components/AdvancedDrawer";
import EditRuleGroup from "./EditRuleGroup";
import { EDIT_FLAG } from "@/utils/Enum";

const { confirm } = Modal;

@connect(({ FieldTripsRulesModel, loading, global }) => ({
  FieldTripsRulesModel,
  global,
  loading: loading.models.FieldTripsRulesModel,
  loadingList: loading.effects["FieldTripsRulesModel/getAllGroup"],
  loadingUpdate: loading.effects["endSubmitRuleModel/EditGroup"],
  loadingDelete: loading.effects["endSubmitRuleModel/deleteGroup"]
}))

class FieldTripsRuleList extends PureComponent {
  state = {
    drawerVisible: false,
    drawerState: EDIT_FLAG.ADD,
    groupId: null
  };

  componentDidMount() {
    this.getsAListOfGroupings();
  }

  // 获取分组列表
  getsAListOfGroupings = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "FieldTripsRulesModel/getAllGroup",
      payload: null
    });
  };

  // 刷新列表
  handleRefresh = () => {
    this.getsAListOfGroupings();
  };

  // 查看规则分组详细信息
  showRuleGroupDetail = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: "FieldTripsRulesModel/updata",
      payload: {
        currentGroupId: id
      }
    });
    router.push("/GuideSetting/FieldTripsRules/Detail");
  };

  // 得到所有的规则组名称
  getAllGroupName = (data) => data.map((item) => ({ text: item.groupName, value: item.groupName }));

  // 新建规则组
  createRuleGroup = () => {
    this.setState({
      drawerVisible: true,
      drawerState: EDIT_FLAG.ADD
    });
  };

  // 编辑规则组
  editRuleGroup = (id) => {
    this.setState({
      drawerVisible: true,
      drawerState: EDIT_FLAG.EDIT,
      groupId: id
    });
  };

  // 控制drawer关闭
  onCloseDrawer = () => {
    this.setState({
      drawerVisible: false
    });
  };

  // 删除规则组
  deleteGroup = (id) => {
    const { dispatch } = this.props;
    confirm({
      title: "是否删除该规则组",
      okText: "删除",
      cancelText: "取消",
      onOk: () => {
        dispatch({
          type: "FieldTripsRulesModel/deleteGroup",
          payload: {
            checkGroupId: Number(id)
          }
        });
      }
    });
  };

  render() {
    const { FieldTripsRulesModel: { ruleGroup }, loading, loadingDelete, loadingUpdate } = this.props;
    const { drawerVisible, drawerState, groupId } = this.state;
    let drawerTitle = "";
    switch (drawerState) {
      case EDIT_FLAG.ADD:
        drawerTitle = "新建规则组";
        break;
      case EDIT_FLAG.EDIT:
        drawerTitle = "修改当前规则组";
        break;
      default:
        break;
    }
    const btnList = {
      primaryBtn: [{
        func: this.handleRefresh,
        param: [],
        key: "REFRESH"
      },
        {
          func: this.createRuleGroup,
          param: [],
          key: "ADD"
        }
      ],
      patchBtn: [],
      menuBtn: []
    };
    const columns = [
      {
        title: "序号",
        key: "count",
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: "规则分组名称",
        key: "groupName",
        dataIndex: "groupName",
        filters: this.getAllGroupName(ruleGroup),
        onFilter: (value, record) => record.groupName.indexOf(value) === 0
      },
      {
        title: "检查方法",
        key: "checkMethod",
        dataIndex: "checkMethod"
      },
      {
        title: "操作",
        key: "action",
        width: "10vw",
        render: (text, row) => (
          <Fragment>
            <Tooltip title="查看详情">
              <a onClick={this.showRuleGroupDetail.bind(this, row.checkGroupId)}>
                <Icon type="arrow-right" />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="编辑">
              <a onClick={this.editRuleGroup.bind(this, row.checkGroupId)}>
                <Icon type="edit" />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <a onClick={this.deleteGroup.bind(this, row.checkGroupId)}>
                <Icon type="delete" />
              </a>
            </Tooltip>
            {/* <Divider type='vertical' />
                  <a onClick={this.openModal.bind(this,row.rootRuleId)}>复制</a>
                  <Divider type='vertical' />
                  <a onClick={this.editRules.bind(this,row.rootRuleId)}>编辑</a>
                  <Divider type='vertical' />
                  <a onClick={this.deleteRule.bind(this,row.rootRuleId)}>删除</a> */}
          </Fragment>
        )
      }
    ];
    const EditRuleGroupProps = {
      groupId,
      drawerState,
      onClose: this.onCloseDrawer
    };
    return (
      <PageHeaderWrapper title="实地考察规则分组">
        <Card>
          <ToolBarGroup btnOptions={btnList} />
          <Table
            loading={loading || loadingDelete || loadingUpdate}
            dataSource={ruleGroup}
            columns={columns}
            rowKey={record => record.checkGroupId}
            type="small"
          />
        </Card>
        <AdvancedDrawer
          drawerTitle={drawerTitle}
          drawerContent={<EditRuleGroup {...EditRuleGroupProps} />}
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

export default FieldTripsRuleList;
