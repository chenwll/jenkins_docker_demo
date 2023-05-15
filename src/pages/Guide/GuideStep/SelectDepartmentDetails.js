import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Modal,
  Select,
  Collapse
} from 'antd';
import 'braft-editor/dist/index.css';
import './TaskCommitDetails';
import TaskCommitDetails from '@/pages/Guide/GuideStep/TaskCommitDetails';

const { Panel } = Collapse;

@Form.create({
  onValuesChange:(props,changedValues,allValues)=>{
    console.log('form,create',props,changedValues,allValues);
  }
})
@connect(({ guideModal, basicdata, loading }) => ({
  guideModal,
  basicdata,
  loadingUpdate: loading.effects['guideModal/editGuide'],
  loadingGet: loading.effects['guideModal/getGuide'],
  loadingAdd: loading.effects['guideModal/addGuide'],
}))

class SelectDepartmentDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskId: 1, // 提交后赋值到本身,应该通过props传递
      deleteFlag: false,
      commitFlag:false
    };
  }

  componentDidMount() {
    const { taskId } = this.props;
    if (taskId!==undefined) this.setState({commitFlag:true})
    this.setState({ taskId });
  }

  deleteEvaluationDept = () => {
    const { dispatch ,guideModal:{selectedRows:{id:ruleId}},rootRuleId} = this.props;
    const { taskId } = this.state;
    if (taskId) {
      dispatch({
        type: 'guideModal/deleteEvaluationDept',
        payload: { taskId ,ruleId,rootRuleId},
      });
    }
    // 复杂组件列表，删除时，目前我只能想到这种处理办法！！！
    this.setState({ deleteFlag: true });
  };

  // 目前只剩下这个没写了！！！
  submitRegulationDept = () => {
    const {
      form: { validateFields },
      guideModal: { guideId, selectedRows: { id: ruleId }, selectedRows, rootRuleId },
      dispatch,
    } = this.props;
    const { taskId } = this.state; // 用taskId判断新增还是修改
    validateFields((error, values) => {
      if (!error) {
          console.log({ ...values, guideId, ruleId, rootRuleId });
          if (taskId) {
            dispatch({
              type: 'guideModal/editEvaluationDept',
              payload: { ...values, guideId, ruleId, rootRuleId, taskId },
            });
          } else {
            dispatch({
              type: 'guideModal/addEvaluationDept',
              payload: { ...values, guideId, ruleId, rootRuleId },
              callback:(taskId)=>{
                this.setState({taskId,commitFlag:true})
              }
            });
          }
      }
    });
  };

  render() {

    const { guideModal: { departmentTree }, form, departmentId, leadFlag, taskDetail ,departmentName } = this.props;
    const { taskId, deleteFlag ,commitFlag} = this.state;

    return deleteFlag ? <Fragment /> : (
      // <Card
        // bodyStyle={{ backgroundColor: 'rgb(250,250,250)' }}
        // style={{ marginTop: '5vh' }}>
      <Collapse bordered={false} style={{marginTop:'5vh'}}>
        <Panel
          key={1}
          style={{border:0}}
          header={departmentName||'未保存'}
        >
          <Card style={{backgroundColor:'rgb(248,248,248)'}}>
            {/* <Form labelAlign='right'> */}
            {/*  <Row> */}
            {/*    <Col span={8}> */}
            {/*      <FormItem label='部门名称' {...lineItem}> */}
            {/*        {getFieldDecorator('departmentId', { */}
            {/*          initialValue: departmentId || '', */}
            {/*          rules: [ */}
            {/*            { required: true }, */}
            {/*          ], */}
            {/*        })(<AdvancedSelect placeholder='请选择部门' dataSource={departmentTree[1].children} */}
            {/*                           style={{ width: '100%' }} */}
            {/*                           searchType='LOCALSEARCH' */}
            {/*                           fieldConfig={SelectFieldConfig.departmentConfigRoles} onChange={() => { */}
            {/*        }} />)} */}
            {/*        /!*上面部门的dataSource注意下！！！*!/ */}
            {/*      </FormItem> */}
            {/*    </Col> */}
            {/*    /!*<Col span={8} offset={2}>*!/ */}
            {/*    /!*  <FormItem label='牵头部门' {...lineItem}>*!/ */}
            {/*    /!*    {getFieldDecorator('leadFlag', {*!/ */}
            {/*    /!*      initialValue: leadFlag || false,*!/ */}
            {/*    /!*      rules: [*!/ */}
            {/*    /!*        { required: true },*!/ */}
            {/*    /!*      ],*!/ */}
            {/*    /!*    })(<Switch*!/ */}
            {/*    /!*      checkedChildren={<Icon type='check' />}*!/ */}
            {/*    /!*      unCheckedChildren={<Icon type='close' />}*!/ */}
            {/*    /!*    />)}*!/ */}
            {/*    /!*  </FormItem>*!/ */}
            {/*    /!*</Col>*!/ */}
            {/*    <Col offset={6} span={4}> */}
            {/*      <Button onClick={this.submitRegulationDept} type='default'>保存部门任务信息</Button> */}
            {/*    </Col> */}
            {/*    <Col span={4}> */}
            {/*      <Button onClick={this.deleteEvaluationDept} type='danger'>删除部门任务信息</Button> */}
            {/*    </Col> */}
            {/*  </Row> */}
            {/*  <Row> */}
            {/*    <Col span={12}> */}
            {/*      <FormItem label='工作任务' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}> */}
            {/*        {getFieldDecorator('taskDetail', { */}
            {/*          initialValue: taskDetail || '', */}
            {/*          rules: [ */}
            {/*            { required: true }, */}
            {/*          ], */}
            {/*        })(<TextArea placeholder='请输入具体工作任务' autosize />)} */}
            {/*      </FormItem> */}
            {/*    </Col> */}
            {/*  </Row> */}
            {/* </Form> */}
            <TaskCommitDetails taskId={taskId} commitFlag={commitFlag} />
          </Card>
        </Panel>
      </Collapse>
      // </Card>
    );
  }
}

export default SelectDepartmentDetails;
