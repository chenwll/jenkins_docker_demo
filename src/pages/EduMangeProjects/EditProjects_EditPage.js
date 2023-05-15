import React, {PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Form, Card, Row, Col, Input, DatePicker, Button, Upload, Icon, message, Modal} from 'antd';
import {lineItem, entireLine,controls} from '../../utils/globalUIConfig';
import EasyULCreater from '@/components/EasyUlCreater';
import FooterToolbar from '@/components/FooterToolbar';
import AdvancedSelect from '../../components/AdvancedSelect';
import { documentRequireArr, GOODS_DETAIL_STATUS, GUIDE_STATE } from '../../utils/Enum';
import {
  phoneRegular,
  emailRegular,
  postalCodeRegular,
  delectBeforeAndBehindBlackRegular,
  fixedTelephoneRegular
} from "../../utils/regular";
import remoteLinkAddress from "../../utils/ip";
import moment from 'moment';
import {checkBeforeFileUpload, getNowFormatDate} from '../../utils/utils';
import * as SelectFieldConfig from "../../utils/globalSelectDataConfig";
import BraftEditor from 'braft-editor';
import * as utils from "../../utils/utils";

const FormItem = Form.Item;
const {confirm} = Modal;

@connect(({EduMangeProjectsModel, global, basicdata, user, loading}) => ({
  EduMangeProjectsModel,
  global,
  basicdata,
  user,
  submitting: loading.effects['EduMangeProjectsModel/edit'],
}))
@Form.create()


export default class EditProjects_EditPage extends PureComponent {
  constructor(props) {
    super(props);
    const nowDate = new moment();
    this.state = {
      fileList: [],
      attIds: "",
      startValue: nowDate,
      endValue: nowDate.add(1, 'd'),
      endOpen: false,
      changeFlag: 0,
    };
  }


  componentDidMount() {
    const {dispatch, match: {params}, form} = this.props;
    const {EduMangeProjectsModel:{editProjectData}}=this.props;
    if(!editProjectData.projectName){
      router.push({
          pathname: `/EduMangeProjects/ProjectsList/${params.guideId}`,
          query: {prevent: true}
        })
      return
    }
    // dispatch({
    //   type: 'user/getUserData',
    //   payload: {},
    // });
  }


  handelCancel = e => {
    e.preventDefault();
    const {dispatch} = this.props;
    const {match:{params}}=this.props;
    router.push(
      {
        pathname: `/EduMangeProjects/ProjectsList/${params.guideId}`,
        query: {prevent: true}
      });
  };

  changeStringToInt = (value) => {
    const needChange = ['guideId', 'title'];
    for (var i in value) {
      needChange.indexOf(i) > -1 ? +value[i] : value[i];
    }
  }


  // save = (values,isAdd) => {
  //   const {attIds} = this.state;
  //   values = {
  //     ...values,
  //     attIds: attIds,
  //   }
  //   const {user: {userData}, dispatch, match: {params}} = this.props;
  //   const {prjCreateTime: startTime, prjEndTime: endTime} = values;
  //   values.prjCreateTime = getNowFormatDate(startTime);
  //   values.prjEndTime = getNowFormatDate(endTime);
  //   values['prjOwner'] = values['prjOwner'].replace(delectBeforeAndBehindBlackRegular.reg, "");
  //   values['pilotUnit'] = values['pilotUnit'].replace(delectBeforeAndBehindBlackRegular.reg, "");
  //   values.guideId = params.id;
  //   this.changeStringToInt(values);
  //   const sendData = {
  //     ...values,
  //     depId: userData.parentDepId,
  //     schoolType: +userData.schoolType,
  //     context: values.context.toHTML(),
  //   }
  //   switch (isAdd) {
  //     case GOODS_DETAIL_STATUS.ADD:
  //       dispatch({
  //         type: 'EduMangeProjectsModel/add',
  //         payload: sendData,
  //       })
  //       break;
  //     case GOODS_DETAIL_STATUS.EDIT:
  //       sendData.projectId = +params.id;
  //       dispatch({
  //         type: 'EduMangeProjectsModel/edit',
  //         payload: sendData,
  //       })
  //     default:
  //       break;
  //   }
  // }

  handleSubmit = e => {
    e.preventDefault();
    const {dispatch}=this.props;
    const {form} = this.props;
    const {match:{params}}=this.props;
    const {EduMangeProjectsModel:{editProjectData}}=this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {attIds}=this.state;
        if(attIds.indexOf('rc-upload')!=-1) {
          message.error('请等待文件上传成功后再保存!');
          return;
        }
        const {prjCreateTime: startTime, prjEndTime: endTime} = values;
        values.prjCreateTime = getNowFormatDate(startTime);
        values.prjEndTime = getNowFormatDate(endTime);
        values.context=values.context.toHTML();
        values['prjOwner'] = values['prjOwner'].replace(delectBeforeAndBehindBlackRegular.reg, "");
        values['pilotUnit'] = values['pilotUnit'].replace(delectBeforeAndBehindBlackRegular.reg, "");
        delete editProjectData['updateTime'];
        delete editProjectData['createTime'];
        delete editProjectData['state'];
        dispatch({
          type:'EduMangeProjectsModel/editProject',
          payload:{
            ...editProjectData,
            ...values,
            attIds:attIds,
            depId:editProjectData.depId,
            guideId:params.guideId
          }
        })
      }
    })
  };

  handleProviderChange = (value) => {
    console.log(value);
  };

  //将文件列表显示在页面所做的转换
  transfer = (files) => {
    const {EduMangeProjectsModel: {editProjectData}} = this.props;
    if (editProjectData.attFiles) {
      editProjectData.attFiles.map(value => files.push(
        {
          uid: value.id,
          name: value.fileName,
          status: 'success',
          md5: value.fileMd5,
        },
      ))
      return files
    }
  }

  //fileList改变的回调
  handleChange = ({fileList}) => {
    this.setState({
      changeFlag: 1,
    });
    fileList.map(function (value, index) {
      if (value.response && value.response.code === 1) {
        value.status = 'error';
      }
    });
    let str = '';
    if (fileList.length !== 0) {
      fileList.map(function (value, index) {
        if (value.response && value.status !== 'error') {
          str += value.response.data + ';';
        }
        else {
          if (value.status !== 'error')
            str += value.uid + ';';
        }
      });
      this.setState({
        attIds: str,
      })

    }
    return fileList;
  };

  downLoadFile = (file) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'EduMangeProjectsModel/downLoadFile',
      payload: {
        md5: file.md5,
        fileName: file.name,
      },
    });
  };

  onRemoveFile = (file) => {
    return new Promise((resolve, reject) => {
      confirm({
        title: '是否删除附件',
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          this.handleRemoveFile(file);
          return resolve(true);
        },
        onCancel: () => {
          return reject(false);
        }
      })
    })
  };

  handleRemoveFile = (file) => {
    const {dispatch, EduMangeProjectsModel: {editProjectData}} = this.props;
    let materialArr = editProjectData.attIds.split(';');
    for (let i = 0; i < materialArr.length; i++) {
      if (materialArr[i] == file.uid) {
        materialArr.splice(i, 1);
        break;
      }
    }
    if (materialArr.length > 0) {
      editProjectData.attIds = materialArr.join(';');
    }
    else {
      editProjectData.attIds = '';
    }
    for (let i = 0; i < editProjectData.attFiles.length; i++) {
      if (editProjectData.attFiles[i].id == file.uid) {
        editProjectData.attFiles.splice(i, 1);
        break;
      }
    }
    dispatch({
      type: 'EduMangeProjectsModel/save',
      payload: editProjectData,
    });
    return true;
  };


  disabledStartDate = (current) => {
    const nowDate = new moment();
    return current < nowDate;
  };

  disabledEndDate = (endValue) => {
    const {startValue} = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({endOpen: true});
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open});
  };

  changeArrayToString = (obj) => {
    const arr = ['title', 'schoolType'];
    arr.map(function (value, index) {
      if (obj[value] != undefined) {
        obj[value] = String(obj[value]);
      }
    })
  }



  render() {
    let files = [];
    this.transfer(files);
    const editDisable = true;
    const {TextArea} = Input;
    const url = remoteLinkAddress();
    const dateFormat = 'YYYY-MM-DD';
    const {startValue, endValue, endOpen} = this.state;
    const {user: {userData}} = this.props;
    this.changeArrayToString(userData);
    const {EduMangeProjectsModel: {editProjectData}} = this.props;
    let {match: {params}, basicdata: {gDictData}, form: {getFieldDecorator}, submitting} = this.props;
    let titleTypeArr = utils.getDictByType(gDictData, "titleType");
    const props = {
      name: 'file',
      action: `${url}/api/files/upload`,
      listType: 'text',
      headers: {
        token: sessionStorage.getItem('token'),
      },
      data:{
        projectId:params.projectId
      },
      defaultFileList: files,
      onChange: this.handleChange,
      // onPreview: this.downLoadFile,
      beforeUpload:checkBeforeFileUpload,
      onRemove: this.onRemoveFile,
      accept: ".zip,.rar,.doc,.docx,.png,.xls,xlsx,application/pdf",
    };

    // if (getAllAboutPrj.title !== undefined) {
    //   getAllAboutPrj.title = String(getAllAboutPrj.title);
    // }


    return (
      <Card bordered={false}>
        <Form style={{marginTop: 8}}>
          <Row>
            <Col span={24}>
              <FormItem  {...entireLine} label="项目名称">
                {getFieldDecorator('projectName', {
                  initialValue: editProjectData.projectName || '',
                  rules: [
                    {
                      required: true,
                      message: '项目名称为必填项',
                    },
                  ],
                })(<TextArea placeholder="请输入项目名称且少于60字" rows={1} style={{width: "100%"}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={12}>
              <FormItem {...lineItem} label="项目负责人">
                {getFieldDecorator('prjOwner', {
                  initialValue: editProjectData.prjOwner || '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '项目负责人为必填项',
                    },
                  ],
                })(<Input placeholder="请输入项目负责人"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="试点单位">
                {getFieldDecorator('pilotUnit', {
                  initialValue: editProjectData.pilotUnit || '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '试点单位为必填项',
                    },
                  ],
                })(<Input placeholder="请输入试点单位"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem  {...entireLine} label="工作单位">
                {getFieldDecorator('workCompany', {
                  initialValue: editProjectData.workCompany || '',
                })(<Input placeholder="请输入您的工作单位"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem {...lineItem} label="行政职务">
                {getFieldDecorator('duties', {
                  initialValue: editProjectData.duties || '',
                })(<Input placeholder="请输入您的行政职务"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="职称">
                {getFieldDecorator('title', {
                  initialValue: String(editProjectData.title) || '',
                })(<AdvancedSelect dataSource={titleTypeArr} type="DATADICT" onChange={this.handleProviderChange}
                                   fieldConfig={SelectFieldConfig.titleDetailFiledConfig}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem {...lineItem} label="项目开始时间">
                {getFieldDecorator('prjCreateTime', {
                  initialValue: moment(moment(editProjectData.prjCreateTime), dateFormat),
                  rules: [
                    {
                      required: true,
                      message: '项目开始时间为必填项',
                    },
                  ],
                })(<DatePicker
                  style={{width: "100%"}}
                  format={dateFormat}
                  // value={startValue}
                  disabledDate={this.disabledStartDate}
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="项目结束时间">
                {getFieldDecorator('prjEndTime', {
                  initialValue: moment(moment(editProjectData.prjEndTime), dateFormat),
                  rules: [
                    {
                      required: true,
                      message: '项目结束时间为必填项',
                    },
                  ],
                })(<DatePicker
                  style={{width: "100%"}}
                  format={dateFormat}
                  disabledDate={this.disabledEndDate}
                  // value={endValue}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem {...lineItem} label="电子邮箱">
                {getFieldDecorator('email', {
                  initialValue: editProjectData.email || '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      pattern: emailRegular.reg,
                      message: emailRegular.msg,
                    },
                  ],
                })(<Input placeholder="请输入邮箱"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="邮政编码">
                {getFieldDecorator('postalCode', {
                  initialValue: editProjectData.postalCode || '',
                  rules: [
                    {
                      required: true,
                      pattern: postalCodeRegular.reg,
                      message: postalCodeRegular.msg,
                    },
                  ],
                })(<Input placeholder="请输入邮政编码"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem {...lineItem} label="联系电话">
                {getFieldDecorator('phone', {
                  initialValue: editProjectData.phone || '',
                  rules: [
                    {
                      required: true,
                      pattern: phoneRegular.reg,
                      message: phoneRegular.msg,
                    },
                  ],
                })(<Input placeholder="请输入联系电话"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="固定电话">
                {getFieldDecorator('companyTel', {
                  initialValue: editProjectData.companyTel || '',
                  rules: [
                    {
                      required: true,
                      pattern: fixedTelephoneRegular.reg,
                      message: fixedTelephoneRegular.msg,
                    },
                  ],
                })(<Input placeholder="请输入固定电话"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...lineItem} label="上传材料附件">
                <Upload {...props}>
                  <Button>
                    <Icon type="upload"/> Click to Upload
                  </Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}><EasyULCreater liarr={documentRequireArr} {...lineItem}/></Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...entireLine} label="申报内容">
                {getFieldDecorator('context', {
                  initialValue: BraftEditor.createEditorState(editProjectData.context || ''),
                  rules: [{
                    required: true,
                    message: '申报内容必填！',
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入正文内容')
                      } else {
                        callback()
                      }
                    }
                  }],
                })(
                  <BraftEditor controls={controls} placeholder="指南内容不能直接粘贴图片，图片请点击【媒体】按钮上传" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem  {...entireLine} label="备注">
                {getFieldDecorator('remark', {
                  initialValue: editProjectData.remark || '',
                })(<TextArea autosize={{minRows: 2, maxRows: 6}} style={{width: "100%"}} placeholder="请输入备注且少于120字"/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <FooterToolbar>
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            修改
          </Button>
          <Button style={{marginLeft: 8}} onClick={this.handelCancel}>
            返回
          </Button>
        </FooterToolbar>
      </Card>
    )
  }
}
