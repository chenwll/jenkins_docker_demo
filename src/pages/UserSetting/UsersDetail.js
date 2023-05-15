import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Card,
  TreeSelect
} from 'antd';
import { ROLES_DETAIL_STATUS } from '../../utils/Enum';
import { entireLine, lineItem } from '../../utils/globalUIConfig';
import { phoneRegular, emailRegular,delectBeforeAndBehindBlackRegular} from '../../utils/regular';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import * as basicFunction from '../../utils/utils';

const FormItem=Form.Item;
@connect(({UserSettingModel,loading,basicdata})=>({
  UserSettingModel,
  basicdata,
  addUserLoading:loading.effects['UserSettingModel/addUser'],
  editUserLoading:loading.effects['UserSettingModel/changeInfo'],
  AllLoading:loading.models.UserSettingModel,
}))
@Form.create()
class UsersDetail extends PureComponent{

  componentDidMount(){

    console.log("modal,componentDidMount,this.props",this.props)
    const {dispatch} =this.props;
    const {rolesDetailStatus,userId}=this.props;
    switch (rolesDetailStatus) {
      case ROLES_DETAIL_STATUS.EDIT:
        dispatch({
          type:'UserSettingModel/getUser',
          payload:{
            id:userId
          }
        });
        //不需要与学校有关的了！！！
        // this.setState({
        //   schoolTypeVisible:true,
        //   schoolIdVisible:true,
        // });
        break;
      case ROLES_DETAIL_STATUS.ADD:
        dispatch({
          type:'UserSettingModel/cleanGetDetail',
        });
        break;
      default:
        break
    }
  }


  addOrUpdateUser=()=>{
    const { form: { validateFields }} = this.props;
    const { dispatch ,rolesDetailStatus,onClose,pagination, userId, }=this.props;
    validateFields((error,values)=>{
      const roleIds=[];
      console.log("validateFields,values",values)
      if(!error){
        if(values['roleId']){
          roleIds.push(parseInt(values['roleId']))
          values.role=roleIds
        }
        values['username']=values['username'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        values['nickname']=values['nickname'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        console.log("validateFields,values",values)
        if(rolesDetailStatus===ROLES_DETAIL_STATUS.EDIT){
          dispatch({
            type:'UserSettingModel/changeInfo',
            payload:{
              data:{...values,userId:userId},
              pagination
            }
          })
        }
        else{
          dispatch({
            type:'UserSettingModel/addUser',
            payload:{
              data:values,
              pagination:{
                current : 1 ,
                size : 20,
              }
            }
          })
          dispatch({
            type:'UserSettingModel/save',
            payload:{
              selectedRows:[],
            }
          })
        }
        onClose()
      }
    });
  };

  render(){

    console.log("this.props,render,modal",this.props)
    const {form:{getFieldDecorator},addUserLoading,editUserLoading}=this.props;
    const {UserSettingModel:{detailData,allRoles}}=this.props;
    const {
      // schoolData,// 所有的学校数据
      rolesDetailStatus,
      onClose,
      // eduDepartmentData,
    }=this.props;

    const editDisable = rolesDetailStatus === ROLES_DETAIL_STATUS.EDIT;

    //后面请求网络字典!!!
    const sex=[
      {id:1,k:"0",type:'sex',val:"女"},
      {id:2,k:"1",type:'sex',val:"男"}
    ]

    console.log("modal,detailData",detailData)
    //新增，因为新数据将roleId隐藏到roleList数组中，要提出来，不然后面如果用数组方法渲染会报错！！！
    if (detailData.roleList){
      //defaultValue要求是个字符串，我们的roleId是个数字，我们新加个字符串字段好了
      if (detailData.roleList.length>0) {
        detailData.roleId=detailData.roleList[0].roleId.toString()
      }
      else detailData.roleId=undefined
    }

    let allRoleWIthIdTostring=[];// 为了解决验证错误
    allRoleWIthIdTostring=allRoles.map(item=>{
      item.name=item.roleName;
      item.id=item.roleId.toString();
      return item
    });

    return(
      <Card bordered={false}>
        <Form style={{ marginTop : 8 }}>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="登录名">
                {getFieldDecorator('username', {
                  initialValue : detailData.username|| '',
                  rules : [
                    {
                      required : true,
                      whitespace:true,
                      max:11,
                      message : '请正确输入登录名.不能只为空格，长度小于11个字',
                    },
                  ],
                })(<Input placeholder="不能全空格,长度小于11" />)}
              </FormItem>
            </Col>
            {
              //对下面的注释：老代码中根据是否是修改操作来判断是否显示密码输入框，不清楚为啥不添加修改功能（虽然老接口没把修改密码的功能独立出来，但edit接口是有的）
              //新代码中无论是否是修改都显示密码框,因为密码加密了，因此不主动填充密码
            }
            <Col span={12}>
              {!editDisable?<FormItem {...lineItem} label="密码">
                {getFieldDecorator('password', {
                  initialValue :detailData.password|| '',
                  rules : [
                    {
                      required : true,
                      message : '请正确输入小于15位的密码',
                      max:15
                    },
                  ],
                })(<Input placeholder="请输入密码，小于15位" />)}
              </FormItem>:''}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="用户名">
                {getFieldDecorator('nickname', {
                  initialValue : detailData.nickname|| '',
                  rules : [
                    {
                      required : true,
                      whitespace:true,
                      max:11,
                      message : '请正确输入昵称',
                    },
                  ],
                })(<Input placeholder="不能全空格,长度小于11" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="手机号">
                {getFieldDecorator('phone', {
                  initialValue : detailData.phone|| '',
                  rules : [
                    {
                      required : true,
                      pattern:phoneRegular.reg,
                      message : '请输入正确的手机号',
                    },
                  ],
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="邮箱">
                {getFieldDecorator('email', {
                  initialValue : detailData.email|| '',
                  rules : [
                    {
                      // required : true,
                      pattern:emailRegular.reg,
                      message : '请正确输入邮箱',
                    },
                  ],
                })(<Input placeholder="请输入邮箱号" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="用户角色">
                {getFieldDecorator('roleId', {
                  initialValue : detailData.roleId||undefined,
                  rules : [
                    {
                      message : '请选择用户角色',
                    },
                  ],
                })(<AdvancedSelect placeholder='请选择用户角色' dataSource={allRoleWIthIdTostring} fieldConfig={SelectFieldConfig.userConfigRoles} onChange={() => {}} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="性别">
                {getFieldDecorator('sex', {
                  initialValue :detailData.sex||undefined,
                  rules : [
                    {
                      required : true,
                      message : "请选择性别",
                    },
                  ],
                })(<AdvancedSelect placeholder='请选择用户性别' dataSource={sex} type="DATADICT" onChange={()=>{}} />)}
              </FormItem>
            </Col>
          </Row>

          <Row type="flex" justify="center">
            <Col>
              <Button type='primary' onClick={this.addOrUpdateUser} loading={addUserLoading||editUserLoading}>确定</Button>
            </Col>
            <Col span={1} />
            <Col>
              <Button onClick={onClose}>取消</Button>
            </Col>
          </Row>

        </Form>

      </Card>
    )
  }
}
export default UsersDetail
