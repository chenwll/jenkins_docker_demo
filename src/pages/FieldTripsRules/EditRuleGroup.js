import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    InputNumber,
    Row,
    Col,
    Button,
    Card,
    Select,
  } from 'antd';
import { submitFormLayout, entireLine,lineItem } from '../../utils/globalUIConfig';
import { EDIT_FLAG } from '@/utils/Enum';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ FieldTripsRulesModel, loading}) => ({
    FieldTripsRulesModel,
    loading: loading.models.FieldTripsRulesModel,
    loadingList: loading.effects['FieldTripsRulesModel/getAllGroup'],
    loadingAdd:loading.effects['FieldTripsRulesModel/createGroup'],
    loadingUpdate:loading.effects['FieldTripsRulesModel/getAllGroup'],
}))
@Form.create()
class EditRuleGroup extends PureComponent {
    componentDidMount(){
        const { drawerState, dispatch, groupId } = this.props
        // 如果是编辑模式，获取当前分组的详细信息
        if(drawerState === EDIT_FLAG.EDIT){
            dispatch({
                type:'FieldTripsRulesModel/getCurrentGroupMessage',
                payload:{
                    checkGroupId:groupId
                }
            })
        }
        // 新建模式，把model中的信息清空
        else if(drawerState === EDIT_FLAG.ADD){
            dispatch({
                type:'FieldTripsRulesModel/updata',
                payload:{
                    currentGroupMessage:{}
                }
            })
        }
    }

    // 表单提交函数
    handleSubmit = () => {
        const { form: { validateFieldsAndScroll },drawerState,onClose ,dispatch ,groupId} = this.props;
        let data;
        validateFieldsAndScroll((err,value) => {
            if(err){
                return
            }
            if(drawerState === EDIT_FLAG.ADD){
                dispatch({
                    type:'FieldTripsRulesModel/createGroup',
                    payload:value
                })
            }
            else if(drawerState === EDIT_FLAG.EDIT){
                dispatch({
                    type:'FieldTripsRulesModel/EditGroup',
                    payload:{
                        ...value,
                        checkGroupId:groupId
                    }
                })
            }
            onClose()
        })
    }

    render() {
        const { loading,loadingAdd,loadingUpdate,form : { getFieldDecorator },onClose ,
                 FieldTripsRulesModel:{ currentGroupMessage }  } = this.props
        return (
          <Card bordered={false} loading={loading}>
            <Form style={{ marginTop : 8 }}>
              <Row type="flex">
                <Col span={24}>
                  <FormItem {...entireLine} label="规则组名称">
                    {getFieldDecorator('groupName', {
                                initialValue: currentGroupMessage.groupName || '',
                                rules: [{
                                    required : true,
                                    whitespace: true,
                                    message: '填写规则名称',
                                    min: 1,
                                }],
                                })(<Input placeholder='请填写规则组名称' />)}
                  </FormItem>
                  <FormItem {...entireLine} label="规则组拼音">
                    {getFieldDecorator('groupPy', {
                                initialValue: currentGroupMessage.groupPy || '',
                                rules: [{
                                    required : true,
                                    whitespace: true,
                                    message: '填写规则名称',
                                    min: 1,
                                }],
                                })(<Input placeholder='请填写规则组拼音' />)}
                  </FormItem>
                  <FormItem {...entireLine} label="检查方法">
                    {getFieldDecorator('checkMethod', {
                                initialValue: currentGroupMessage.checkMethod || '',
                                rules: [{
                                    required : true,
                                    whitespace: true,
                                    message: '填写检查方法',
                                    min: 1,
                                }],
                                })(<TextArea autosize={{minRows: 5,maxRows: 10}} placeholder='请填写检查方法' />)}
                  </FormItem>
                  <FormItem {...entireLine} label="规则组说明">
                    {getFieldDecorator('memo', {
                                initialValue: currentGroupMessage.memo || '',
                                rules: [{
                                    // required : true,
                                    whitespace: true,
                                    message: '填写规则组说明',
                                    min: 1,
                                }],
                                })(<TextArea autosize={{minRows: 5,maxRows: 10}} placeholder='请输入规则组说明' />)}
                  </FormItem>
                </Col>
              </Row>
              <FormItem {...submitFormLayout} style={{ marginTop : 32 }}>
                <Button type="primary" onClick={this.handleSubmit} loading={loadingAdd||loadingUpdate}>
                  保存
                </Button>
                <Button style={{ marginLeft : 8 }} onClick={onClose}>
                  取消
                </Button>
              </FormItem>
            </Form>
          </Card>
        );
    }
}

export default EditRuleGroup;
