import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import Moment from 'moment';
import {
  Form,
  Card,
  Button,
  Col,
  Row,
  Input,
  Upload,
  Icon,
  message,
  Modal,
  Select,
  Switch,
  Table,
  Drawer,
  Tooltip,
  Collapse, Popover,
} from 'antd';
import { EDIT_FLAG, GUIDE_STATE, documentRequireArr, TASK_COMMMIT_TYPE } from '../../../utils/Enum';
import 'braft-editor/dist/index.css';


const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    console.log('form,create', props, changedValues, allValues);
  },
})
@connect(({ guideModal, basicdata, loading }) => ({
  guideModal,
  basicdata,
  loadingUpdate: loading.effects['guideModal/editGuide'],
  loadingGet: loading.effects['guideModal/getGuide'],
  loadingAdd: loading.effects['guideModal/addGuide'],
}))


class TaskCommitDetails extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false,
      selectedRows: [],
    };
  }

  componentDidMount() {
    const { dispatch, taskId } = this.props;
    if (taskId !== undefined) {
      dispatch({
        type: 'guideModal/getTaskCommit',
        payload: { taskId: taskId },
      });
    }
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'taskCommitID',
      key: 'taskCommitID',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '名称',
      dataIndex: 'commitName',
      key: 'commitName',
      render: (text, record) => <span><span style={{ color: 'red' }}>{record.isRequired ? '*' : ''}</span>{text}</span>,
    },
    {
      title: '格式',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span>{this.FILETYPE[text]}</span>,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
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
            <a>{data}</a>
          </Popover>
        );
      },
    },
    {
      title: '操作',
      render: (text, record) => this.createAction(text, record),
    },
  ];

  FILETYPE = {
    1: '图片',
    2: '文本',
    3: '文件',
    4: '富文本',
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  addTaskCommit = () => {
    const { form: { validateFields }, dispatch, taskId } = this.props;
    validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'guideModal/addTaskCommit',
          payload: { ...values, taskId },
        });
        this.onClose();
      }
    });
  };

  deleteTaskCommit = (record) => {
    const { dispatch, taskId } = this.props;
    dispatch({
      type: 'guideModal/deleteTaskCommit',
      payload: { taskCommitId: record.taskCommitId, taskId },
    });
  };

  createAction = (text, record) => {
    return <Fragment>
      <Tooltip title='删除'>
        <a onClick={() => this.deleteTaskCommit(record)}><Icon type='delete' /></a>
      </Tooltip>
    </Fragment>;
  };

  //目前看来不需要了
  // getTaskId = () => {
  //   const { taskId: taskId_s } = this.state;
  //   const { taskId: taskId_p } = this.props;
  //
  //   console.log('4444,props,state,this.props,key', taskId_p, taskId_s, this.props);
  //   return taskId_p || taskId_s;
  // };

  render() {

    const { drawerVisible, selectedRows } = this.state;
    const { guideModal: { taskCommits }, form: { getFieldDecorator }, taskId, commitFlag } = this.props;
    let data = taskId ? taskCommits[taskId] : [];

    return (
      <Card>
        <Button onClick={this.showDrawer} type='primary' disabled={!commitFlag}
                style={{ marginBottom: '3vh', marginLeft: '3vw' }}>
          新增申报格式要求
        </Button>
        <Table
          selectedRows={selectedRows}
          dataSource={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          size='small'
        />
        <Drawer
          title='新增任务提交要求'
          placement='right'
          closable={false}
          onClose={this.onClose}
          visible={drawerVisible}
          width='30vw'
          destroyOnClose
        >
          <Form>
            <Row>
              <Col>
                <FormItem label='提交名称'>
                  {getFieldDecorator('commitName', {
                    rules: [
                      { required: true },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label='文件类型'>
                  {getFieldDecorator('type', {
                    initialValue:TASK_COMMMIT_TYPE.FILE,
                    rules: [
                      { required: true },
                    ],
                  })(<Select >
                    <Option value={TASK_COMMMIT_TYPE.PICTURE}>图片</Option>
                    <Option value={TASK_COMMMIT_TYPE.FILE}>文件</Option>
                    <Option value={TASK_COMMMIT_TYPE.TEXT}>文本</Option>
                    <Option value={TASK_COMMMIT_TYPE.RICHTEXT}>富文本</Option>
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label='是否必须'>
                  {getFieldDecorator('isRequired', {
                    initialValue:1,
                    rules: [
                      { required: true },
                    ],
                  })(<Select>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label='备注'>
                  {getFieldDecorator('memo', {})(<TextArea autoSize style={{ minHeight: '10vh' }} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={12}>
              <Button onClick={this.onClose}>取消</Button>
              <Button onClick={this.addTaskCommit} type='primary'>新增</Button>
            </Col>
          </Row>
        </Drawer>
      </Card>
    );
  }
}


export default TaskCommitDetails;
