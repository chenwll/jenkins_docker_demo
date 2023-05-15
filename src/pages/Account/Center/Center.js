import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Row, Col, Icon, Button, Form, Input, TreeSelect, Select, message} from 'antd';
import {formatMessage} from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import AvatarPng from './Avatar.png';
import EditPassword from './EditPassword';
import { lineItem} from "../../../utils/globalUIConfig";

import {phoneRegular,  emailRegular} from "../../../utils/regular";

const FormItem = Form.Item;
const {Option} = Select;

@Form.create()
@connect(({centerModel, basicdata, loading}) => ({
  centerModel,
  basicdata,
  loading: loading.models.centerModel,
  editLoading: loading.effects['centerModel/editUser'],
  getCurrentUserLoading: loading.effects['centerModel/getCurrentUser'],
}))
class Center extends PureComponent {
  constructor(props) {
    super(props);
    this.state={}
  }

  componentDidMount() {
    this.getUserData();
    this.getDepartData();
    // this.getSchoolData();
  }

  getUserData() {
    const {dispatch} = this.props;
    dispatch({
      type: 'centerModel/getCurrentUser',
    });
  };

  exchangeCodeToString = (data, name, key, aimKey) => {
    if(data.length !== 0) {
      const [result] = data.filter(item => item[key] === aimKey);
      if(result) {
        return result[name];
      }
    }
    return ''
  };

  getDepartData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'centerModel/getEduDepartment',
    });
  };

  getSchoolData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'centerModel/getSchoolData',
    });
  };

  messageItem = (props) => {
    const {type, children} = props;
    return (
      <div className={styles.messageItem}>
        <Icon type={type} />
        <div className={styles.message}>{children}</div>
      </div>
    );
  };

  modifyPersonInfo = () => {
    let isChange = false;
    const {dispatch, form, centerModel: {currentUserdata,eduDepartmentData,}} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const i in values) {
        if (currentUserdata[i] !== values[i]) {
          isChange = true;
        }
      }
      if (!isChange) {
        message.warning('请做出修改后再保存!');
        return;
      }
      if (!err) {
        const dpt = this.findDepartmentName(values.departmentId,eduDepartmentData)
        const sendData = {
          ...values,
          userId: currentUserdata.userId,
          deptId:values.departmentId,
          departmentName:dpt.name,
          role: currentUserdata.role
          // schoolName: this.exchangeCodeToString(schoolData,'schoolName','schoolId',values.schoolName),
        };
        dispatch({
          type: `centerModel/editUser`,
          payload: sendData,
        })
      }
    })
  };

  modifyPassword = () => {
    const {dispatch} = this.props;
    dispatch({
      type: `centerModel/showModal`,
    })
  };

  handleCancel = () => {
    const {dispatch, form} = this.props;
    form.resetFields();
    dispatch({
      type: 'centerModel/hiddenModal',
    });
  };

  // 生成部门树函数
  setTreeData = (data) => {
    // eslint-disable-next-line array-callback-return
    data.map((item) => {
      // eslint-disable-next-line no-param-reassign
      item.title = item.depName;
      item.value = item.departmentId.toString();
      item.key = item.departmentId.toString();
    });
    const cloneData = JSON.parse(JSON.stringify(data));    // 对源数据深度克隆
    const tree = cloneData.filter((father) => {              // 循环所有项
      const branchArr = cloneData.filter((child) =>
         father.departmentId === child.parentId      // 返回每一项的子级数组
      );
      if (branchArr.length > 0) {
        // eslint-disable-next-line no-param-reassign
        father.children = branchArr;    // 如果存在子级，则给父级添加一个children属性，并赋值
      }
      return father.parentId === 0;      // 返回第一层
    });
    return tree;     // 返回树形数据
  };

  schoolSelectedableArray = (schoolData=[], schoolDepartment, schoolType) => {
    let able = [];
    if (schoolType !== -1) {
      schoolData.map((item) => {
        if (item.departmentId === schoolDepartment && item.schoolType === schoolType) {
          able.push(item)
        }
        return true
      });
      return able;
    }
    able = schoolData.filter(item => item.departmentId === schoolDepartment);
    return able;
  };

  schoolTypeChange=(data)=>{
    const {dispatch}=this.props;
    const {centerModel:{currentUserdata}}=this.props;
    const {form:{setFieldsValue}} =this.props;
    setFieldsValue({
      schoolName:undefined
    });
    currentUserdata.schoolType = data;
    dispatch({
      type:'centerModel/save',
      payload:{
        currentUserdata,
      }
    })
  };

  depTreeChange = (id) => {
    const {dispatch, form} = this.props;
    const {centerModel: {currentUserdata}}=this.props;
    form.resetFields(['schoolType', 'schoolId']);
    dispatch({
      type:'centerModel/save',
      payload:{
        currentUserdata: {
            ...currentUserdata,
            parentDepId: id,
          }
      }
    })
  };

  treeNameConversion = (data) => {
    if(Object.keys(data).length){
      data.title = data.name;
      data.value = data.deptId.toString();
      data.key = data.deptId.toString();
    }
    if(!data.children || !data.children.length){
      return ;
    }
    for (let i = 0; i < data.children.length; i += 1) {
      this.treeNameConversion(data.children[i])
    }
    
  }
  
  // eslint-disable-next-line consistent-return
  findDepartmentName = (id, dpt) => {
    if(Number(id) === dpt.deptId){
      return dpt
    }
    if(!dpt.children || !dpt.children.length){
      return null;
    }
    for (let i = 0; i < dpt.children.length; i += 1) {
      return this.findDepartmentName(id,dpt.children[i])
    }
  }

  render() {
    const {centerModel: {eduDepartmentData}, editLoading, loading, getCurrentUserLoading} = this.props;
    const {centerModel: {currentUserdata, visiblePersonInfo}, form: {getFieldDecorator}} = this.props;
    // currentUserdata.schoolType = currentUserdata.schoolType===undefined?String(currentUserdata.schoolType):'';
    // const depData = this.setTreeData(eduDepartmentData);
    // console.log('eduDepartmentData',eduDepartmentData);
    // 这里存在问题，无法显示所有部门，需要后端改接口
    this.treeNameConversion(eduDepartmentData)
    const depData = eduDepartmentData
    // console.log('depData',depData);
    // if (currentUserdata.parentDepId) {
    //   currentUserdata.parentDepId = currentUserdata.parentDepId.toString();// 树形选择中数字转字符串
    //   schoolSelectedData = this.schoolSelectedableArray(schoolData, currentUserdata.parentDepId, -1)
    // }// 只有部门
    // if (currentUserdata.parentDepId && currentUserdata.schoolType) {
    //   schoolSelectedData = this.schoolSelectedableArray(schoolData, currentUserdata.parentDepId, currentUserdata.schoolType)
    // }// 部门和学校类型都有
    const title = '修改密码';
    const editPswProps = {
      visiblePersonInfo,
      title,
      handleCancel: this.handleCancel,
      handleEdit: this.handleEdit,
    };

    return (
      <GridContent className={styles.userCenter} loading={getCurrentUserLoading}>
        <Card bordered={false} style={{marginBottom: 24}} loading={loading}>
          <div className={styles.avatarHolder}>
            <img alt="" src={AvatarPng} />
          </div>
          <Form style={{marginTop: 8}}>
            <Row type="flex" justify="center">
              <Col span={12}>
                <FormItem {...lineItem} label="登录名">
                  {getFieldDecorator('username', {
                    initialValue: currentUserdata.username || '',
                    rules: [
                      {
                        required: true,
                        whiteSpace: true,
                        message: '登录名为必填项,字符在1-11之间！',
                        max:11,
                        min:1
                      }
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...lineItem} label="用户名">
                  {getFieldDecorator('nickname', {
                    initialValue: currentUserdata.nickname || '',
                    rules: [
                      {
                        required: true,
                        whiteSpace: true,
                        message: '昵称为必填项',
                      },
                    ]
                  })(<Input placeholder="请输入用户名" />)}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={12}>
                <FormItem {...lineItem} label="电话号码">
                  {getFieldDecorator('phone', {
                    initialValue: currentUserdata.phone || '',
                    rules: [
                      {
                        required: true,
                        pattern: phoneRegular.reg,
                        message: phoneRegular.msg,
                      },
                    ],
                  })(<Input placeholder="请输入电话号码" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...lineItem} label="邮箱">
                  {getFieldDecorator('email', {
                    initialValue: currentUserdata.email || '',
                    rules: [
                      {
                        required: true,
                        pattern: emailRegular.reg,
                        message: emailRegular.msg,
                      },
                    ],
                  })(<Input placeholder="请输入电子邮箱" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              
              {/* <Col span={12}>
                <FormItem {...lineItem} label="学校类型">
                  {getFieldDecorator('schoolType', {
                    initialValue: String(currentUserdata.schoolType)?String(currentUserdata.schoolType):'暂无数据'||'',
                  })(
                    <AdvancedSelect
                      dataSource={schoolType}
                      allowClear
                      placeholder="可选择学校所属类型"
                      fieldConfig={SelectFieldConfig.userDetail}
                      onChange={this.schoolTypeChange}
                    />)
                  }
                </FormItem>
              </Col> */}
              <Col span={12}>
                <FormItem {...lineItem} label="性别">
                  {getFieldDecorator('sex', {
                    initialValue: Number(currentUserdata.sex) === 0 ? 0 : 1,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({id: 'validation.school.required'}),
                      },
                    ],
                  })
                  (
                    <Select>
                      <Option value={1}>男</Option>
                      <Option value={0}>女</Option>
                    </Select>
                   )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...lineItem} label="部门">
                  {getFieldDecorator('departmentId', {
                    initialValue: currentUserdata.departmentId|| '',
                    rules: [
                      {
                        required: true,
                        message: formatMessage({id: 'validation.departmentId.required'}),
                      },
                    ],
                  })
                  (<TreeSelect
                    placeholder={formatMessage({id: 'form.register.placeholder.department'})}
                    treeData={depData}
                    onSelect={this.depTreeChange}
                    dropdownStyle={{maxHeight: 220, overflow: 'auto'}}
                  />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              {/* <Col span={12}>
                <FormItem {...lineItem} label="学校">
                  {getFieldDecorator('schoolName', {
                    initialValue: currentUserdata.schoolName || '',
                  })
                  (<AdvancedSelect
                    dataSource={schoolSelectedData}
                    allowClear
                    placeholder="可选择具体学校"
                    dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                    fieldConfig={SelectFieldConfig.userDetailSchool}
                    onChange={()=>{}}
                  />)
                  }
                </FormItem>
              </Col> */}
              
            </Row>
          </Form>
        </Card>
        <Row type="flex" justify="center">
          <Col>
            <Button type="primary" onClick={this.modifyPassword}>修改密码</Button>
          </Col>
          <Col span={1} />
          <Col>
            <Button onClick={this.modifyPersonInfo} loading={editLoading}>保存</Button>
          </Col>
        </Row>
        <EditPassword {...editPswProps} />
      </GridContent>
    );
  }
}

export default Center;
