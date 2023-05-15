import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Button,
  Input,
} from 'antd';
import { guideDetailDateLayout } from '../../utils/globalUIConfig';
import AdvancedSelect from '@/components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';

const FormItem = Form.Item;

@Form.create()
class GuideRuleDetail extends PureComponent {

  handleClick = () => {
    const { form:{ validateFieldsAndScroll }, handleSave } = this.props;
    validateFieldsAndScroll((err, value) => {
      if(err) {
        return
      }
      const data = {
        ...value,
      };
      handleSave(data)
    })
  };

  handleCancel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { form, endRule = [] } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Card bordered={false}>
        <Row>
          <Col span={24}>
            <FormItem {...guideDetailDateLayout} label="结项提交规则">
              {getFieldDecorator('rootId',{
                rules: [{
                  required: true,
                  message: '结项提交规则不能为空！',
                }]
              })(
                <AdvancedSelect
                  style={{width: '100%'}}
                  placeholder='请选择规则'
                  allowClear
                  dataSource={endRule}
                  fieldConfig={SelectFieldConfig.ruleSelect}
                  onChange={() => {}}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...guideDetailDateLayout} label="规则名称">
              {getFieldDecorator('ruleName',{
                rules: [{
                  required: true,
                  message: '规则名称不能为空！',
                  whitespace: true,
                }]
              })(<Input placeholder='请填写流程打分规则名称' />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row type="flex" justify="center">
              <Button type="primary" onClick={this.handleClick} htmlType='submit'>
                保存
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleCancel} htmlType='button'>
                取消
              </Button>
            </Row>
          </Col>
        </Row>
      </Card>
    )
  }
}
export default GuideRuleDetail;
