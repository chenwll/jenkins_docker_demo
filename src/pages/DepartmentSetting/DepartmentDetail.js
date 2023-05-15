import {connect} from 'dva';
import React,{PureComponent} from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Card,
  InputNumber,
} from 'antd';
import * as basicFunction from '../../utils/utils';
import { DEPARTMENT_DETAIL_STATUS, DEPARTMENT_TYPE_ARRAY } from '../../utils/Enum';
import AdvancedSelect from '../../components/AdvancedSelect';
import { entireLine } from '../../utils/globalUIConfig';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import { phoneRegular,delectBeforeAndBehindBlackRegular} from '../../utils/regular';

const FormItem=Form.Item;
@Form.create()
@connect(({departmentSettingModel,loading,basicdata})=>({
  departmentSettingModel,
  loading,
  basicdata,
  AllLoading:loading.models.departmentSettingModel,
}))

class DepartmentDetail extends PureComponent{
  constructor(props){
    super(props);
    this.state={}
  }

  componentDidMount(){
    const {departmentDetail,dispatch,DataId}=this.props;
    switch (departmentDetail) {
      case DEPARTMENT_DETAIL_STATUS.EDIT:
        dispatch({
          type:'departmentSettingModel/getDepartmentDetail',
          payload:{
            deptId:DataId[0]
          }
        });
        break;
      case DEPARTMENT_DETAIL_STATUS.ADD:
        dispatch({
          type:'departmentSettingModel/cleanGetData',
        });
        break;
      default:
        break;
    }
  };

  addOrUpdate=()=>{
    const { form: { validateFields },dispatch ,departmentDetail,onClose,DataId} = this.props;
    validateFields((error,values)=>{
      if(!error){
        // values['contactName']=values['contactName'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        values.name=values.name.replace(delectBeforeAndBehindBlackRegular.reg,"");
        if(departmentDetail===DEPARTMENT_DETAIL_STATUS.EDIT){
          // eslint-disable-next-line no-shadow
          const {departmentSettingModel:{DepartmentDetail}}=this.props;
          const editValue = {
            ...values,
            deptId:DataId[0],
            parentId:DepartmentDetail.parentId,
          } 
          dispatch({
            type:'departmentSettingModel/editDepartment',
            payload: editValue
          })
        }
        else{
          values.parentId=DataId[0];// 新增模式下需要提供父级id
          dispatch({
            type:'departmentSettingModel/addDepartment',
            payload:values
          })
        }
        onClose()
      }
    })
  };

  render() {
    // eslint-disable-next-line no-shadow
    const {departmentSettingModel:{DepartmentDetail}}=this.props;
    const {form:{getFieldDecorator},departmentDetail,AllLoading}=this.props;
    const {
      onClose,
      allUser,
    }=this.props;
    // const depType=basicFunction.getDictByType(gDictData,'depType');
    switch (departmentDetail) {
      case DEPARTMENT_DETAIL_STATUS.EDIT:
        if(DepartmentDetail.type!=undefined){
           DepartmentDetail.type=DepartmentDetail.type.toString()
           DepartmentDetail.userNickName = allUser.filter((val) => val.userId === DepartmentDetail.leaderId)[0]?.nickname
        }
        break;
      default:
        break;
    }
    return (
      <div>
        <Card bordered={false}>
          <Form style={{ marginTop : 8 }}>
            <Row>
              <Col>
                <FormItem {...entireLine} label="部门名称">
                  {getFieldDecorator('name',{
                    initialValue:DepartmentDetail.name||'',
                    rules:[{
                      required:true,
                      max:11,
                      message:'请正确输入部门名称',
                      whitespace:true
                    }]
                  })(
                    <Input placeholder="请输入部门名称（11个字以内）" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...entireLine} label="部门类型">
                  {getFieldDecorator('type', {
                    initialValue:DepartmentDetail.type||basicFunction.isDepartmentType().toString() || '',
                    rules:[{
                      required:true,
                      whitespace:true,
                      message:'请输入部门类型'
                    }]
                  })(<AdvancedSelect placeholder='请选择部门类型' disabled dataSource={DEPARTMENT_TYPE_ARRAY} fieldConfig={SelectFieldConfig.schoolDetailFiledConfig} onChange={(value) => {console.log(value)}} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...entireLine} label="部门电话">
                  {getFieldDecorator('phone', {
                    initialValue: DepartmentDetail.phone || '',
                    rules: [
                      {
                        // required:true,
                        pattern: phoneRegular.reg,
                        message: '请输入正确的部门电话',
                      },
                    ]
                  })(
                    <Input placeholder="请输入部门电话" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...entireLine} label="管理员用户">
                  {getFieldDecorator('leaderId',{
                     initialValue:String(DepartmentDetail.leaderId)||'',
                  })(<AdvancedSelect type='USER_FUZZYSEARCH' placeholder='请选择该部门的管理用户' dataSource={allUser} onChange={(value) => {console.log(value)}} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...entireLine} label="部门权重">
                  {getFieldDecorator('sort', {
                      initialValue:  DepartmentDetail.sort || DepartmentDetail.sort === 0? DepartmentDetail.sort : '',
                      rules: [
                        {
                          type:"number",
                          // required:true,
                          message:'请输入正确的部门权重'
                        },
                      ]
                    })(
                      <InputNumber style={{width:'100%'}} min={0} max={99} placeholder="请输入部门权重" />
                    )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Row type="flex" justify="center">
          <Col>
            <Button type='primary' onClick={this.addOrUpdate} loading={AllLoading}>确定</Button>
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

export default DepartmentDetail;
