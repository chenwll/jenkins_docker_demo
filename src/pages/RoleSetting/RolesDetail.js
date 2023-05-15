import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
} from 'antd';
import { ROLES_DETAIL_STATUS } from '../../utils/Enum';
import {formItemLayout} from '../../utils/globalUIConfig';

const FormItem=Form.Item;
@connect(({roleSettingModel,loading})=>({
  roleSettingModel,
  changeInfo:loading.effects['roleSettingModel/changeInfo'],
  editPermissions:loading.effects['roleSettingModel/updatePermissions'],
  getTree:loading.effects['roleSettingModel/getAllPermissions'],
  loading:loading.models.roleSettingModel,
}))
@Form.create()
class RolesDetail extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount (){
    const {dispatch} =this.props;
    const {rolesDetailStatus,record}=this.props;
    switch (rolesDetailStatus) {
      case ROLES_DETAIL_STATUS.EDIT:
        dispatch({
          type:'roleSettingModel/getRoleInfo',
          payload:{
            roleId:record.roleId
          }
        });
        break;
      case ROLES_DETAIL_STATUS.ADD:
        dispatch({
          type:'roleSettingModel/save',
          payload:{
            detailData:{}// 清空get到的单个数据
          }
        });
        break;
      default:
        break
    }
  }

  addOrUpdateRole=()=>{
    const { form: { validateFields },dispatch ,rolesDetailStatus,onClose,pagination} = this.props;
    const {roleSettingModel:{detailData}}=this.props;
    validateFields((error,values)=>{
      if(!error){
        if(rolesDetailStatus===ROLES_DETAIL_STATUS.EDIT){
          dispatch({
            type:'roleSettingModel/editRole',
            payload:{
              data:{
                ...values,
                roleId:detailData.roleId,
                roleCode:values.roleDesc
              },
              pagination
            }
          })
        }
        else{
          dispatch({
            type:'roleSettingModel/addRole',
            payload:{
              data:{
                ...values,
                roleCode:values.roleDesc
              },
              pagination:{
                currentPage : 1 ,
                pageSize : 10,
              }
            }
          })
        }
        onClose()
      }
    })
  }

  render(){
    const {form:{getFieldDecorator}}=this.props;
    const {roleSettingModel:{detailData}}=this.props;
    const {onClose}=this.props;
    return(
      <div>
        <FormItem {...formItemLayout} label="角色名称">
          {getFieldDecorator('roleName',{
            initialValue:detailData.roleName||'',
            rules:[{
              required:true,
              max:20,
              message:'请输入小于20个字符的角色名称'
            }]
          })(
            <Input placeholder="请输入小于20个字符的角色名称" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="角色概述">
          {getFieldDecorator('roleDesc',{
            initialValue:detailData.roleDesc||'',
            rules:[{
              required:true,
              max:20,
              message:'请输入小于20个字符的角色概述'
            }]
          })(
            <Input placeholder="请输入小于20个字符的角色概述" />
          )}
        </FormItem>
        <Row type="flex" justify="center">
          <Col>
            <Button type='primary' onClick={this.addOrUpdateRole}>确定</Button>
          </Col>
          <Col span={1} />
          <Col>
            <Button onClick={onClose}>取消</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
export default RolesDetail
