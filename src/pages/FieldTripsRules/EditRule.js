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
const { Option } = Select;
@connect(({ FieldTripsRulesModel, loading}) => ({
    FieldTripsRulesModel,
    loading: loading.models.FieldTripsRulesModel,
    loadingList: loading.effects['FieldTripsRulesModel/getAllGroup'],
    loadingAdd:loading.effects['FieldTripsRulesModel/createGroup'],
    loadingUpdate:loading.effects['FieldTripsRulesModel/getAllGroup'],
}))
@Form.create()
class EditRule extends PureComponent {
    componentDidMount(){
        const { drawerState, dispatch, groupRuleId,groupId } = this.props
        //如果是编辑模式，获取当前规则的详细信息
        if(drawerState === EDIT_FLAG.EDIT){
            dispatch({
                type:'FieldTripsRulesModel/getRule',
                payload:{
                    groupRuleId:groupRuleId
                }
            })
        }
        //新建模式，把model中的信息清空
        else if(drawerState === EDIT_FLAG.ADD){
            dispatch({
                type:'FieldTripsRulesModel/updata',
                payload:{
                    currentRuleMessage:{}
                }
            })
        }
    }


    //表单提交函数
    handleSubmit = () => {
        const { form: { validateFieldsAndScroll },drawerState,onClose ,dispatch ,groupRuleId, groupId} = this.props;
        let data;
        validateFieldsAndScroll((err,value) => {
            if(err){
                return
            }
            if(drawerState === EDIT_FLAG.ADD){
                dispatch({
                    type:'FieldTripsRulesModel/createRule',
                    payload:{
                        ...value,
                        groupId,
                        sort:1
                    }
                })
            }
            else if(drawerState === EDIT_FLAG.EDIT){
                dispatch({
                    type:'FieldTripsRulesModel/editRule',
                    payload:{
                        ...value,
                        groupRuleId:groupRuleId
                    }
                })
            }
            onClose()
        })
    }
    render() {
        const { loading,loadingAdd,loadingUpdate,form : { getFieldDecorator },onClose ,
                 FieldTripsRulesModel:{ currentRuleMessage }  } = this.props
        if(Object.keys(currentRuleMessage).length){
            currentRuleMessage.ruleDetail = currentRuleMessage.ruleDetail.slice(0,1) === '\n' ? currentRuleMessage.ruleDetail.slice(1,) : currentRuleMessage.ruleDetail
        }
        return (
            <Card bordered={false} loading={loading}>
                <Form style={{ marginTop : 8 }}>
                    <Row type="flex">
                        <Col span={24}>
                            <FormItem {...entireLine} label="标准名称">
                                {getFieldDecorator('ruleName', {
                                initialValue: currentRuleMessage.ruleName || '',
                                rules: [{
                                    required : true,
                                    whitespace: true,
                                    message: '填写标准名称',
                                    min: 1,
                                }],
                                })(<Input placeholder='请填写标准名称' />)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...entireLine} label="测评标准">
                                {getFieldDecorator('ruleDetail', {
                                initialValue: currentRuleMessage.ruleDetail || '',
                                rules: [{
                                    required : true,
                                    whitespace: true,
                                    message: '填写测评标准',
                                    // min: 1,
                                }],
                                })(<TextArea autosize={{minRows: 5,maxRows: 10}} placeholder='请填写测评标准' />)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...entireLine} label="测评明细">
                                {getFieldDecorator('memo', {
                                initialValue: currentRuleMessage.memo || '',
                                rules: [{
                                    required : true,
                                    whitespace: true,
                                    message: '请填写测评明细',
                                    min: 1,
                                }],
                                })(<Input placeholder='请填写测评明细' />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...lineItem} label="标准笔数">
                                {getFieldDecorator('number', {
                                initialValue: currentRuleMessage.number || '',
                                rules: [{
                                    required : true,
                                    // whitespace: true,
                                    message: '填写标准笔数',
                                    // min: 1,
                                }],
                                })(<InputNumber style={{ width: '100%' }} min={0} placeholder='标准笔数' />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...lineItem} label="单笔分值">
                                {getFieldDecorator('score', {
                                initialValue: currentRuleMessage.score || '',
                                rules: [{
                                    required : true,
                                    // whitespace: true,
                                    message: '填写单笔分值',
                                    // min:1
                                }],
                                })(<InputNumber style={{ width: '100%'}} min={0} placeholder='单笔分值' />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...lineItem} label="权重">
                                {getFieldDecorator('weight', {
                                initialValue: currentRuleMessage.weight || '',
                                rules: [{
                                    required : true,
                                    // whitespace: true,
                                    message: '填写权重',
                                    // min:1
                                }],
                                })(<InputNumber style={{ width: '100%' }} min={0} placeholder='权重' />)}
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

export default EditRule;
