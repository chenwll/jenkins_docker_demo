import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Col, Row, Input, Select } from 'antd';
import { GUIDESTATUS } from '@/utils/Enum';
import FooterToolbar from '@/components/FooterToolbar';
import GuideDescription from '@/components/GuideDescription';
import {
  guideDetailFormItemLayout,
} from '@/utils/globalUIConfig';
import 'braft-editor/dist/index.css';
import router from 'umi/router';


const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ guideModal, basicdata, loading }) => ({
  guideModal,
  basicdata,
  loadingUpdate: loading.effects['guideModal/editGuide'],
  loadingGet: loading.effects['guideModal/getGuide'],
  loadingAdd: loading.effects['guideModal/addGuide'],
}))


class GuideFirstStep extends PureComponent {

  componentDidMount() {
    const { dispatch, guideModal: { editStatus, guideId } } = this.props;
    dispatch({
      type: 'guideModal/getAllRootRule',
    });
    switch (editStatus) {
      case GUIDESTATUS.WILLCREATE:
        break;
      case GUIDESTATUS.DRAFT:
        dispatch({
          type: 'guideModal/getGuideById',
          payload: { guideId },
        });
    }

  }

  submitForm = () => {
    const { dispatch, form, guideModal: { editStatus } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const data = values;
        switch (editStatus) {
          case GUIDESTATUS.WILLCREATE:
            console.log('GuideStep,Step1,submitForm,values', values);
            dispatch({
              type: 'guideModal/addGuide',
              payload: { data },
            });
            dispatch({
              type: 'guideModal/save',
              payload: { rootRuleId: data.rootRuleId },
            });
            break;
          default:
            dispatch({
              type: 'guideModal/editGuide',
              payload: { data },
            });
        }

      }
    });

  };

  closeStep = () => {
    router.push(`/Guide/GuideList`);
  };

  nextStep = () => {
    router.push('/Guide/GuideStep/Step2');
  };

  render() {

    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { guideModal: { rootRules, guideDetail = {} }, loadingAdd } = this.props;
    const { guideName, guideBrief, rootRuleId, memo } = guideDetail;
    console.log('222', guideName, guideDetail);
    console.log('12345', this.props);
    const rootRuleSelecteOptionList = rootRules.map(item => {
      return <Option value={item.rootRuleId}>{item.ruleName}</Option>;
    });

    return (
      <Fragment>
        <Form style={{ marginTop: 8 }}>
          <Row type='flex' justify='center'>
            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label='任务名字'>
                {getFieldDecorator('guideName', {
                  initialValue: guideName || '',
                  rules: [
                    {
                      required: true,
                      message: '请输入任务名字，注意不要超过50个字',
                      max: 50,
                      min: 1,
                      whitespace: true,
                    },
                  ],
                })(<TextArea placeholder='请输入任务名字，注意不要超过50个字' autoSize />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label='任务简称'>
                {getFieldDecorator('guideBrief', {
                  initialValue: guideBrief || '',
                  rules: [
                    {
                      required: true,
                      message: '请输入任务名字，注意不要超过50个字',
                      max: 50,
                      min: 1,
                      whitespace: true,
                    },
                  ],
                })(<TextArea placeholder='请输入任务名字，注意不要超过50个字' autoSize />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label='文明城市标准'>
                {getFieldDecorator('rootRuleId', {
                  initialValue: rootRuleId || '',
                  rules: [
                    { required: true },
                  ],
                })(<Select>
                  {rootRuleSelecteOptionList}
                </Select>)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label='任务备注'>
                {getFieldDecorator('memo', {
                  initialValue: memo || '',
                  rules: [
                    {
                      required: false,
                      message: '请输入任务名字，注意不要超过50个字',
                      max: 50,
                      min: 1,
                      whitespace: true,
                    },
                  ],
                })(<TextArea placeholder='请输入任务名字，注意不要超过50个字' style={{ height: '10vh' }} />)}
              </FormItem>
            </Col>
            <GuideDescription
              title='注意'
              children='已经被使用过的文明城市标准只能引用不能修改，如需修改请移步规则管理'
              style={{ width: '70vw' }}
            />
          </Row>
        </Form>

        <FooterToolbar style={{ width: '100%' }}>
          <Button type='primary' onClick={this.submitForm} loading={loadingAdd} id='submit'>
            保存
          </Button>
          <Button type='primary' onClick={this.nextStep}>
            下一步
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.closeStep}>
            取消
          </Button>
        </FooterToolbar>

      </Fragment>
    );
  }
}

export default GuideFirstStep;
