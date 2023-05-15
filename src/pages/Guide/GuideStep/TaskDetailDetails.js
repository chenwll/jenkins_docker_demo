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
  Divider, Drawer, Popover, Descriptions,
} from 'antd';
import BraftEditor from 'braft-editor';
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
  fileUplaodLayout,
} from '../../../utils/globalUIConfig';
import remoteLinkAddress from '../../../utils/ip';
import 'braft-editor/dist/index.css';
import * as SelectFieldConfig from '../../../utils/globalSelectDataConfig';
import * as utils from '../../../utils/utils';
import router from 'umi/router';
import EvaluationDeptDetails from '@/pages/Guide/GuideStep/EvaluationDeptDetails';


const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;


@Form.create()
@connect(({ guideModal, basicdata, global,user,loading }) => ({
  guideModal,
  basicdata,
  user,
  global,
  loadingGet: loading.effects['guideModal/getAllTask'],
}))

class TaskDetailDetails extends PureComponent {

  submitRegulationDept = () => {
    const {
      form: { validateFields },
      guideModal: { guideId, selectedRows: { taskId }, selectedRows, rootRuleId },
      dispatch,
      onClose,
    } = this.props;
    validateFields((error, values) => {
      if (!error) {
        dispatch({
          type:'guideModal/editTaskDetails',
          payload:{...selectedRows,...values}
        })
        onClose();
      }
    });
  };


  render() {

    const { guideModal: { selectedRows, departmentTree, tasks }, form } = this.props;
    const {getFieldDecorator} = form
    const {taskDetail} = selectedRows

    return (
      <Fragment>
        <Descriptions title='具体信息' bordered={true} size={'middle'} layout='vertical'>
          <Descriptions.Item label='指标名称'>{selectedRows.name}</Descriptions.Item>
          <Descriptions.Item label='评测内容'>{selectedRows.content}</Descriptions.Item>
          <Descriptions.Item label='评测标准'>{selectedRows.standard}</Descriptions.Item>
          <Descriptions.Item label='网上申报具体要求'>{selectedRows.specification}</Descriptions.Item>
        </Descriptions>
        <Form style={{marginTop:'3vh'}}>
          <FormItem label='工作任务' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('taskDetail', {
              initialValue: taskDetail || '',
              rules: [
                { required: true },
              ],
            })(<TextArea placeholder='请输入具体工作任务' style={{height:'20vh'}} />)}
          </FormItem>
        </Form>
        <Button onClick={this.submitRegulationDept} type='primary'>确定</Button>
      </Fragment>
    );
  }
}

export default TaskDetailDetails;
