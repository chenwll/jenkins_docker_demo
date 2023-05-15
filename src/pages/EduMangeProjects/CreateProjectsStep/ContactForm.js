import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Modal, Input, Row, Col} from 'antd';
import {lineItem, entireLine} from '../../../utils/globalUIConfig';
import * as SelectFieldConfig from "../../../utils/globalSelectDataConfig";
import * as utils from "../../../utils/utils";
import AdvancedSelect from '../../../components/AdvancedSelect';
import {emailRegular, postalCodeRegular,phoneRegular} from "../../../utils/regular";

const FormItem = Form.Item;

@connect(({EduMangeProjectsModel, basicdata}) => ({
  EduMangeProjectsModel,
  basicdata,
}))
@Form.create()

class ContactForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }


  onHandleCancel = () => {
    const {form, handleCancel} = this.props;
    form.resetFields();
    handleCancel();
  };

  onHandleSave = () => {
    const {
      dispatch,
      form,
      projectId,
      handleOk
    }=this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type:'EduMangeProjectsModel/addPerson',
          payload:{
            ...values,
            projectId
          }
        });
        handleOk()
      }
    });
  }

  handleProviderChange = (value) => {
      console.log(value);
  };


  render() {
    const {title, visible, form: {getFieldDecorator}} = this.props;
    const {TextArea} = Input;
    const {basicdata: {gDictData}} = this.props;
    const titleTypeArr = utils.getDictByType(gDictData, "titleType");
    return (
      <Modal
        width='50%'
        visible={visible}
        title={title}
        okText="确定"
        onCancel={this.onHandleCancel}
        onOk={this.onHandleSave}
      >
        <Form>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem
                label="姓名"
                {...lineItem}
                hasFeedback
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      whitespace:true,
                      message: '请输入姓名',

                    }],
                  })
                  (<Input placeholder="请输入姓名"  />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                hasFeedback
                label="职称"
                {...lineItem}
              >
                {
                  getFieldDecorator('title', {
                    rules: [{
                      required: true,
                      message: '请选择职称',
                    }],
                  })
                  (<AdvancedSelect dataSource={titleTypeArr} type="DATADICT" onChange={this.handleProviderChange}
                                   fieldConfig={SelectFieldConfig.titleDetailFiledConfig}/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem
                hasFeedback
                label="电子邮箱"
                {...lineItem}
              >
                {
                  getFieldDecorator('email', {
                    rules: [{
                      required: true,
                      whitespace:true,
                      pattern: emailRegular.reg,
                      message: emailRegular.msg,
                    }],
                  })
                  (<Input placeholder="请填写电子邮箱"/>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                hasFeedback
                label="邮政编码"
                {...lineItem}
              >
                {
                  getFieldDecorator('postalCode', {
                    rules: [{
                      required: true,
                      whiteSpace:true,
                      pattern: postalCodeRegular.reg,
                      message: postalCodeRegular.msg,
                    }],
                  })
                  (<Input placeholder="请填写邮政编码"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem
                hasFeedback
                label="联系电话"
                {...lineItem}
              >
                {
                  getFieldDecorator('phone', {
                    rules: [{
                      required: true,
                      whiteSpace:true,
                      pattern: phoneRegular.reg,
                      message: phoneRegular.msg,
                    }],
                  })
                  (<Input placeholder="请填写联系电话" />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem
                hasFeedback
                label="工作地址"
                {...entireLine}
              >
                {
                  getFieldDecorator('workCompany', {
                    rules: [{
                      type: 'string',
                      required: true,
                      whitespace:true,
                      message: '请填写工作地址',
                    }],
                  })
                  (<TextArea autosize={{minRows: 1, maxRows: 2}} style={{width: "100%"}} placeholder="请填写工作地址"/>)
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default ContactForm;
