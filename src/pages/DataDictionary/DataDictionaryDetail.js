import {connect} from 'dva';
import React,{PureComponent} from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
} from 'antd';
import {formItemLayout} from '../../utils/globalUIConfig';
import { DATA_DICTIONARY_DETAIL_STATUS } from '../../utils/Enum';
import { delectBeforeAndBehindBlackRegular } from '../../utils/regular';

const FormItem=Form.Item;
@Form.create()
  @connect(({DataDictionaryModel,loading})=>({
    DataDictionaryModel,
    loading:loading.models.DataDictionaryModel,
  }))

class DataDictionaryDetail extends PureComponent{

  constructor(props){
    super(props);
  }

  componentDidMount(){
    const {dataDictDrawerStyle,dispatch,DataId}=this.props;
    switch (dataDictDrawerStyle) {
      case DATA_DICTIONARY_DETAIL_STATUS.EDIT:
        dispatch({
          type:'DataDictionaryModel/getDataDetail',
          payload:{
            dictId:DataId
          }
        });
        break;
      case DATA_DICTIONARY_DETAIL_STATUS.ADD:
        dispatch({
          type:'DataDictionaryModel/cleanGetDetail',
        });
        break;
      default:
        break;
    }
  };

  addOrUpdateDict=(id)=>{
    const {dataDictDrawerStyle,dispatch,onClose,form:{getFieldsValue}}=this.props
    let FormData =  getFieldsValue()// 获取所有值
    FormData={...FormData,dictId:id}
    switch (dataDictDrawerStyle) {
      case (DATA_DICTIONARY_DETAIL_STATUS.ADD):
        dispatch({
          type:'DataDictionaryModel/addDataDict',
          payload:{
            data:{
              ...FormData,
              delFlag:"0",
              system:"0",
            }
          }
        });
        break;
      case (DATA_DICTIONARY_DETAIL_STATUS.EDIT):
        console.log("更改数据",FormData)
        dispatch({
          type:'DataDictionaryModel/editDataDict',
          payload:{
            data:{
              ...FormData,
              delFlag:"0",
              system:"0",

            }
          }
        })
        break;
      default:break;
    }
        onClose()
  };


  render() {
    const {form:{getFieldDecorator}}=this.props;
    const {onClose}=this.props;
    const { DataDictionaryModel:{DiationaryDetail}}= this.props;
    return (
      <div>
        <FormItem {...formItemLayout} label="字典类型名">
          {getFieldDecorator('type',{// 校验规则暂时未改
            initialValue:DiationaryDetail.type||'',
            rules:[{
              required:true,
              whitespace:true,
              message:'请输入字典的类型 1~15',
              max:15
            }]
          })
          (
            <Input placeholder="请输入字典的类型 1~15" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="字典描述">
          {getFieldDecorator('description',{
            initialValue:DiationaryDetail.description||'',
            rules:[{
              required:true,
              whitespace:true,
              message:'请输入字典描述 1~50',
              max:50
            }]
          })(
            <Input placeholder="请输入字典描述 1~50"   />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="字典备注">
          {getFieldDecorator('remarks',{
            initialValue:DiationaryDetail.remarks||'',
            rules:[{
              required:true,
              whitespace:true,
              message:'请输入字典备注 1~20',
              max:20
            }]
          })(
            <Input placeholder="请输入字典备注 1~20"  />
          )}
        </FormItem>
        <Row type="flex" justify="center">
          <Col>
            <Button type="primary" onClick={this.addOrUpdateDict.bind(this,DiationaryDetail.dictId)}>确定</Button>
          </Col>
          <Col span={1} />
          <Col>
            <Button onClick={onClose}>取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataDictionaryDetail;
