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
  Table,
  Tooltip,
  Divider, Descriptions, TreeSelect, Drawer,
} from 'antd';
import BraftEditor from 'braft-editor';
import router from 'umi/router';
import { EDIT_FLAG, GUIDE_STATE, documentRequireArr } from '../../../utils/Enum';
import AdvancedSelect from '../../../components/AdvancedSelect';
import EasyULCreater from '../../../components/EasyUlCreater';
import FooterToolbar from '@/components/FooterToolbar';
import { guidePrefix } from '../../../utils/regular';
import {
  guideDetailDateLayout,
  guideDetailFormItemLayout,
  guideDetailStateLayout,
  guideDetailContextLayout,
  controls,
  fileUplaodLayout, lineItem,
} from '../../../utils/globalUIConfig';
import remoteLinkAddress from '../../../utils/ip';
import 'braft-editor/dist/index.css';
import * as SelectFieldConfig from '../../../utils/globalSelectDataConfig';
import * as utils from '../../../utils/utils';
import guideModal from '@/pages/Guide/models/guideModal';
import DepartmentDetail from '@/pages/DepartmentSetting/DepartmentDetail';
import SelectDepartmentDetails from '@/pages/Guide/GuideStep/SelectDepartmentDetails';


const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;


@Form.create()
@connect(({ guideModal, basicdata, user,loading }) => ({
  guideModal,
  basicdata,
  user,
  loadingGet: loading.effects['guideModal/getEvaluationDept'],
}))

class EvaluationDeptDetails extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
      visible: false,
    }
  }

  componentDidMount() {
    const {dispatch,guideModal:{selectedRows:{id},rootRuleId} }= this.props
    dispatch({
      type:'guideModal/getEvaluationDept',
      payload:{ruleId:id,rootRuleId}
    })
  }


  // columns = [
  //   {
  //     title: '序号',
  //     dataIndex
  //   },
  //   {title:'部门名称'}
  // ]

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  submitForm = () =>{
    const {
      form: { validateFields },
      guideModal: { guideId, selectedRows: { id: ruleId }, rootRuleId },
      dispatch,
    } = this.props;
    validateFields((error, values) => {
      if (!error) {
          dispatch({
            type: 'guideModal/addEvaluationDept',
            payload: { ...values, guideId, ruleId, rootRuleId },
          });
          this.onClose();
      }
    });
  }

  createAction = (text, record) => <Fragment>
    <Tooltip title='删除'>
      <a onClick={() => this.deleteTaskCommit(record)}><Icon type='delete' /></a>
    </Tooltip>
                                   </Fragment>;

  deleteTaskCommit = (record) => {
    const { dispatch ,guideModal: { selectedRows: { id: ruleId }, rootRuleId } } = this.props;
    const { taskId } = record;

    confirm({
      title: '是否确认删除此部门',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        if (taskId) {
          dispatch({
            type: 'guideModal/deleteEvaluationDept',
            payload: { taskId ,ruleId,rootRuleId},
          });
        }
      }
    });
  };

  setTaskDetails = ()=>{
    router.push('/Guide/GuideStep/Step3');
  }

  addStatus={
    "超级管理员":function(tasks) {
      return tasks.length > 0
      // return false
    },
    "行政人员":function(tasks) {
      return false
    }
  }

  render() {

    const {guideModal:{tasks,departmentTree},form:{getFieldDecorator},user:{roleName},loadingGet} = this.props
    // console.log('2323',user);
    const addStatu=this.addStatus[roleName](tasks)
    const columns=[
      {
        title:'序号',
        dataIndex:'taskId',
        key:'index',
        render:(text,record,index) => <span>{index+1}</span>
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key:'departmentName',
      },
      {
        title: '操作',
        dataIndex: 'taskId',
        key: 'taskId',
        render:(text, record) => this.createAction(text, record),
      }
    ]



    return (
      <Fragment>
        <Button onClick={this.showDrawer} type='primary' disabled={addStatu}>
          添加部门
        </Button>
        <Button onClick={this.setTaskDetails} style={{marginLeft:'1vw'}}>设置部门任务提交需求</Button>
        <Table
          columns={columns}
          dataSource={tasks}
          style={{marginTop:'1vh'}}
          loading={loadingGet}
        />
        <Drawer
          title="添加部门"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width="25vw"
        >
          <Form>
            <FormItem label='部门名称' {...lineItem}>
              {getFieldDecorator('departmentId', {
                initialValue: '',
                rules: [
                  { required: true },
                ],
              })(<AdvancedSelect
                placeholder='请选择部门'
                dataSource={departmentTree[0].children}
                style={{ width: '100%' }}
                searchType='LOCALSEARCH'
                fieldConfig={SelectFieldConfig.departmentConfigRoles}
                onChange={() => {
              }}
              />)}
              {/* 上面部门的dataSource注意下！！！ */}
            </FormItem>
          </Form>
          <Button onClick={this.onClose}>取消</Button>
          <Button onClick={this.submitForm} type='primary' style={{marginLeft:'1vw'}}>确认</Button>
        </Drawer>
      </Fragment>

    );
  }

}

export default EvaluationDeptDetails;
