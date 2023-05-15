import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Col, Row, Input } from 'antd';
import { EDIT_FLAG } from '../../utils/Enum';
import AdvancedSelect from '../../components/AdvancedSelect';
import { phoneRegular, emailRegular } from '../../utils/regular';
import { formItemLayout, submitFormLayout } from '../../utils/globalUIConfig';

const FormItem = Form.Item;

@Form.create()
@connect(({ users, basicdata, loading }) => ({
  users,
  basicdata,
  loadingUpdate : loading.effects['users/UpdateUser'],
  loadingGet : loading.effects['users/getUser'],
  loadingAdd : loading.effects['users/addUser'],
}))
class UserDetail extends PureComponent {


  componentDidMount() {
    const { users : { editFlag } } = this.props;
    if (editFlag === EDIT_FLAG.EDIT) {
      this.getDetail();
    }
  }

  addUser = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type : 'users/addUser',
      payload : data,
    });
  };

  updateUser = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type : 'users/UpdateUser',
      payload : data,
    });
  };

  getDetail = () => {
    const { dispatch, users : { selectItem } } = this.props;
    dispatch({
      type : 'users/getUser',
      payload : {
        id : selectItem,
      },
    });
  };

  handleSelectChange = () => {

  };

  submitForm = () => {
    const { form, users : { editFlag }, detailData } = this.props;
    form.validateFields((err) => {
      if (!err) {
        let sendData = form.getFieldsValue();
        sendData = {
          ...detailData,
          ...sendData,
        };
        switch (editFlag) {
          case EDIT_FLAG.EDIT:
            this.updateUser(sendData);
            break;
          case EDIT_FLAG.ADD:
            this.addUser(sendData);
            break;
          default:
            break;
        }
      }
    });
  };

  render() {
    const { form, closeFunction, loadingGet } = this.props;
    const { getFieldDecorator } = form;
    let detail = [];
    const { users : { editFlag }, loadingUpdate, loadingAdd, basicdata : { departmentData, roleData } } = this.props;
    const submitLoading = editFlag === EDIT_FLAG.ADD ? loadingAdd : loadingUpdate;
    if (editFlag === EDIT_FLAG.EDIT) {
      const { users : { detailData } } = this.props;
      detail = detailData;
    }
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form hideRequiredMark style={{ marginTop : 8 }}>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem {...formItemLayout} label="昵称">
                {getFieldDecorator('nickname', {
                  initialValue : detail.nickname || '',
                  rules : [
                    {
                      required : true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('username', {
                  initialValue : detail.username || '',
                  rules : [
                    {
                      required : true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="手机号">
                {getFieldDecorator('telephone', {
                  initialValue : detail.telephone || '',
                  rules : [
                    {
                      pattern : phoneRegular.reg,
                      message : phoneRegular.msg,
                      required : true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="邮箱">
                {getFieldDecorator('email', {
                  initialValue : detail.email || '',
                  rules : [
                    {
                      pattern : emailRegular.reg,
                      message : emailRegular.msg,
                      required : true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="部门">
                {getFieldDecorator('departmentId', {
                  initialValue : detail.departmentId || '',
                  rules : [
                    {
                      required : true,
                    },
                  ],
                })(
                  <AdvancedSelect
                    dataSource={departmentData}
                    placeholder="请选择"
                    type='DEPARTMENT'
                    onChange={this.handleSelectChange}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="角色">
                {getFieldDecorator('roleId', {
                  initialValue : detail.roleId || '',
                  rules : [
                    {
                      required : true,
                    },
                  ],
                })(
                  <AdvancedSelect
                    dataSource={roleData}
                    placeholder="请选择"
                    type='ROLE'
                    onChange={this.handleSelectChange}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop : 32 }}>
            <Button type="primary" onClick={this.submitForm} loading={submitLoading}>
              保存
            </Button>
            <Button style={{ marginLeft : 8 }} onClick={closeFunction}>
              取消
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

}

export default UserDetail;
