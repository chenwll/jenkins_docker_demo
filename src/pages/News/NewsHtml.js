import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Modal, Input, Row, Col} from 'antd';
import { entireLine } from '../../utils/globalUIConfig';

const FormItem = Form.Item;
const {TextArea} =Input;
@connect(({basicdata,newsModel}) => ({
  basicdata,
  newsModel
}))
@Form.create()

class AnnualReviewModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onSave = () => {
    const {form,dispatch,updateData}=this.props
    form.validateFields((err, values) => {
      dispatch({
        type: 'newsModel/codeChange',
        payload:{
          ...values,
          visible:false
        }
      })
      if(updateData){
        updateData(values)
      }
    });

  }

  onCancel=()=>{
    const {dispatch}=this.props;
    dispatch({
      type: 'newsModel/codeChange',
      payload:{
        visible:false
      }
    })
  }

  render() {
    const { visible,html, form: {getFieldDecorator}} = this.props;
    return (
      <Modal
        width='50%'
        visible={visible}
        title='html代码修改'
        okText="确定"
        destroyOnClose
        onCancel={this.onCancel}
        onOk={this.onSave}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem {...entireLine} label="html代码">
                {
                  getFieldDecorator('html',{
                    initialValue:html||'',
                    rules: [{
                      type: 'string',
                      whitespace:true,
                      message: '请填写描述',
                    }],
                  })
                  (
                    <TextArea
                      autosize={{minRows: 1, maxRows: 2}}
                      style={{width: "100%"}}
                      placeholder="请输入代码"
                    />)
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default AnnualReviewModal;
