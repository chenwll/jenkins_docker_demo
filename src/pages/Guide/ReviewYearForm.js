import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Modal, Row, Col, Select,message} from 'antd';
import Moment from 'moment';
import {lineItem} from "../../utils/globalUIConfig";
import {getYearDate} from "../../utils/utils";

const FormItem = Form.Item;
const {Option} = Select;

@connect(({guideModal}) => ({
  guideModal
}))
@Form.create()


class ReviewYearForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }


  onHandleSave = () => {
    const {form, handleOk} = this.props;
    form.validateFields((err, values) => {
      const {beginYear,endYear} = values;
      if(+beginYear>+endYear){
        message.error('开始年份不能晚于结束年份');
        return;
      }
      if (!err) {
        handleOk(values);
      }
    });
  };

  onHandleCancel = () => {
    const {form, handleCancel} = this.props;
    form.resetFields();
    handleCancel();
  };

  beginYearChange = (value) => {
    const {form} = this.props;
    form.setFieldsValue({
      beginYear: value,
    });
  };

  endYearChange = (value) => {
    const {form} = this.props;
    form.setFieldsValue({
      endYear: value,
    });
  };

  render() {
    const {titleOfReviewYearModal, visibleViewYear, form: {getFieldDecorator}} = this.props;
    const {guideModal: {reviewYearData}} = this.props;
    const nowDate = new Moment();
    const nowYear = getYearDate(nowDate);
    const yearArr = [];
    for(let i=0;i<=4;i++){
      yearArr.push(+nowYear-i-1);
    };
    for(let i=0;i<=6;i++){
      yearArr.push(+nowYear+i);
    };
    yearArr.sort();
    return (
      <Modal
        width='50%'
        visible={visibleViewYear}
        title={titleOfReviewYearModal}
        okText="确定"
        onCancel={this.onHandleCancel}
        onOk={this.onHandleSave}
      >
        <Form>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem
                label="开始年份"
                {...lineItem}
              >
                {getFieldDecorator('beginYear', {
                  initialValue: reviewYearData.beginYear || yearArr[0],
                  rules: [{
                    required: true,
                    message: '请选择开始年份',
                  }],
                })
                (<Select onChange={this.beginYearChange}>{yearArr.map(year => <Option key={year}>{year}</Option>)}</Select>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="结束年份"
                {...lineItem}
              >
                {getFieldDecorator('endYear', {
                  initialValue: reviewYearData.endYear || yearArr[0],
                  rules: [{
                    required: true,
                    message: '请选择结束年份',
                  }],
                })
                (<Select onChange={this.endYearChange}>{yearArr.map(year => <Option key={year}>{year}</Option>)}</Select>)
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default ReviewYearForm;
