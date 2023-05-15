import React, {Component} from 'react';
import { Form, Select, Input, Button,message } from 'antd';
import {addDictionaryItems, editDictionaryItems} from "@/services/dataDictionary";
import {DATA_DICTIONARY_DETAIL_STATUS, EDIT_FLAG as DETAIL_EDIT_STATUS} from "@/utils/Enum";
import {connect} from 'dva';


@Form.create()
@connect(({DataDictionaryModel,loading})=>({
  DataDictionaryModel,
  loading,
  DataFetch:loading.effects['DataDictionaryModel/getDataItems'],
}))
 class ItemsDataDetail extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const {dataDictDrawerStyle, dispatch,id} = this.props;
    switch (dataDictDrawerStyle) {
      case DETAIL_EDIT_STATUS.EDIT:
        dispatch({
          type: 'DataDictionaryModel/getItemsById',
          payload: {
            id: id
          }
        });
        break;
      case DETAIL_EDIT_STATUS.ADD:
        dispatch({
          type: 'DataDictionaryModel/cleanGetItemsDetail',
        });
        break;
      default:
        break;
    }



  }

  handleSubmit = e => {
    e.preventDefault();
    const {form:{validateFields,resetFields},dataDictDrawerStyle ,dictId,dispatch,id,closeDrawer,type}=this.props
    validateFields((err, values) => {
      if (!err) {
        switch (dataDictDrawerStyle) {
          case DATA_DICTIONARY_DETAIL_STATUS.ADD:
            values = {...values,delFlag:"0",dictId:dictId, sort:0}
            dispatch({
              type:'DataDictionaryModel/addDataDictItems',
              payload:{
                data: values,
                itemsType:{type:type},
              }})

            resetFields()
            ;break
          case DATA_DICTIONARY_DETAIL_STATUS.EDIT:
            values = {...values, delFlag:"0", dictId:dictId, sort: 0, id:id }

            dispatch({
              type:'DataDictionaryModel/editDataDictItems',
              payload:{
                data:values,
                itemsType:{type:type},
              }});break;
          default:break;
        }
         closeDrawer()

      }
      else {
        console.log(err)
      }
    });
  };
  render() {
    const { form:{getFieldDecorator},type, DataDictionaryModel:{DiationaryItemsDetail}} = this.props;
    // const {data}=this.state
    return (
      <div>
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
          <Form.Item label="字典类型">
            {getFieldDecorator('type', {
              rules: [{ required: true,max:15, message: '请输入字典类型 1~15' }],
              initialValue:type
            })(<Input placeholder="请输入字典类型 1~15" disabled />)}
          </Form.Item>
          <Form.Item label="字典的值">
            {getFieldDecorator('value', {
              rules: [{ required: true, max:10,message: '请输入字典的值 1~10' }],
              initialValue:DiationaryItemsDetail.value||""
            })(
              <Input placeholder="请输入字典的值 1~10" />
            )}
          </Form.Item>
          <Form.Item label="字典标注">
            {getFieldDecorator('label', {
              rules: [{ required: true,max:20, message: '请输入字典的标注 1~20' }],
              initialValue:DiationaryItemsDetail.label||""

            })(<Input placeholder="请输入字典的label 1~20" />)}
          </Form.Item>
          <Form.Item label="字典描述">
            {getFieldDecorator('description', {
              rules: [{ required: true,max:50, message: '请输入描述 1~50' }],
              initialValue:DiationaryItemsDetail.description||""
            })(<Input placeholder="请输入描述 1~50" />)}
          </Form.Item>
          <Form.Item label="字典备注">
            {getFieldDecorator('remarks', {
              rules: [{ required: true,max:50, message: '请输入备注 1~50' }],
              initialValue:DiationaryItemsDetail.remarks||""
            })(<Input placeholder="请输入备注 1~50"/>)}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default ItemsDataDetail
