import { Form, Modal,Input, Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import {connect} from 'dva';
import { formItemLayout } from '@/utils/globalUIConfig';
import styleSheet from '../../styleSheet/styleSheets.less'

const FormItem = Form.Item;

@connect(({ endSubmitRuleModel, loading }) => ({
    endSubmitRuleModel,
    loading: loading.models.endSubmitRuleModel,
}))
@Form.create()
class AddRuleName extends PureComponent {
    
    addRuleName = ()=>{
        const { selectedRows,form,dispatch } = this.props
        // eslint-disable-next-line consistent-return
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              dispatch({
                type: `endSubmitRuleModel/copyTreeNode`,
                payload: {
                    rootId:selectedRows[0],
                    ruleName:values.ruleName
                },
              })
              this.handleClose();
            }
            else{
              return null;
            }
      
          })
    } 

    handleClose = () =>{
        const { form,onClose } = this.props
        form.resetFields();
        onClose()
    }

    render() {
        const { modelVisible, form: {getFieldDecorator} }= this.props
        return (
          <div>
            <Modal
              visible={modelVisible}
              title="添加规则名称"
              okText="确定"
              onCancel={this.handleClose}
              onOk={this.addRuleName}
            >
              <Form>
                <Row type="flex" justify="center">
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="规则名称">
                      {getFieldDecorator('ruleName', {
                                    initialValue:'',
                                    rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        max: 11,
                                        message: '请输入规则名称',
                                    },
                                ],
                                })(<Input className={styleSheet.inputStyle} placeholder="请输入规则名称" />)}
                    </FormItem>
                  </Col> 
                </Row>
              </Form>
            </Modal>
          </div>
        );
    }
}

export default AddRuleName;
