import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Moment from 'moment';
import {Form, Card, Button, Col, Row, Input, Upload, Icon, message, Modal,Select} from 'antd';
import BraftEditor from 'braft-editor';
import {EDIT_FLAG, GUIDE_STATE,documentRequireArr} from '../../utils/Enum';
import EasyULCreater from '../../components/EasyUlCreater';
import FooterToolbar from '@/components/FooterToolbar';
import {guidePrefix} from "../../utils/regular";
import {
  guideDetailDateLayout,
  guideDetailFormItemLayout,
  guideDetailStateLayout,
  guideDetailContextLayout,
  controls,
  fileUplaodLayout,
} from '../../utils/globalUIConfig';
import remoteLinkAddress from '../../utils/ip';
import 'braft-editor/dist/index.css';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import * as utils from '../../utils/utils';

const {Option} = Select;
const FormItem = Form.Item;
const {TextArea} = Input;
const {confirm} = Modal;

@Form.create()
@connect(({guideModal, basicdata, loading}) => ({
  guideModal,
  basicdata,
  loadingUpdate: loading.effects['guideModal/editGuide'],
  loadingGet: loading.effects['guideModal/getGuide'],
  loadingAdd: loading.effects['guideModal/addGuide'],
}))

class GuideDetail extends PureComponent {
  constructor(props) {
    super(props);
    // const nowDate = new Moment();
    this.state = {
      conclusionRulesId: '',
      // startValue: nowDate,
      // endValue: nowDate.add(1, 'y'),
      // endOpen: false,

    };
  }

  componentDidMount() {

    const {guideModal: {editFlag}} = this.props;
    if (editFlag === EDIT_FLAG.EDIT) {
      this.getDetail();
    }

  }

  addGuide = (data) => {
    const {dispatch, onChangeDrawerVisible,guideModal:{pagination}} = this.props;
    dispatch({
      type: 'guideModal/addGuide',
      payload: {data,pagination},
    });
    onChangeDrawerVisible(false);
  };

  updateGuide = (data) => {
    const {dispatch, onChangeDrawerVisible,guideModal:{pagination}} = this.props;
    dispatch({
      type: 'guideModal/editGuide',
      payload: {data,pagination},
    });
    onChangeDrawerVisible(false);
  };

  getDetail = () => {
    const {dispatch, guideModal: {selectItem}} = this.props;
    dispatch({
      type: 'guideModal/getGuide',
      payload: {
        guideId: selectItem,
      },
    });
  };

  submitForm = () => {
    const {form, guideModal: {editFlag, detailData}} = this.props;
    const {conclusionRulesId,materialIds}=this.state;
    if (editFlag) {
      if (detailData.state != GUIDE_STATE[0].value) {
        message.error('此状态下不能进行修改');
        return;
      }
    }
    const {guideId: currentGuideId} = detailData;
    form.validateFields((err) => {
      if (!err) {
        let sendData = form.getFieldsValue();
        const {beginYear,endYear} = sendData;
        if(+beginYear > +endYear){
          message.error('开始年份不应大于结束年份!');
          return;
        }
        if(materialIds){
          const strId = materialIds;
          if(strId.indexOf('rc-upload')!=-1)
          {
            message.error('请等待文件上传成功后再保存!');
            return;
          }
        }
        sendData = {
          ...sendData,
          context: sendData.context.toHTML(),
          materialIds: materialIds||'',
          conclusionRulesId,
        };
        delete sendData.state;
        switch (editFlag) {
          case EDIT_FLAG.EDIT:
            sendData = {
              ...sendData,
              guideId: currentGuideId,
              state: 0,
            };
            this.updateGuide(sendData);
            break;
          case EDIT_FLAG.ADD:
            delete sendData.createtime;
            sendData = {
              ...sendData,
              guideId: 0,
            };
            this.addGuide(sendData);
            break;
          default:
            break;
        }
      }
    });
  };

  handleRuleChange = (value) => {
    this.setState({
      conclusionRulesId: value,
    });
  };


  handleChange = ({fileList}) => {
    fileList.map((value) => {
      if (value.response && value.response.code === 1) {
        value.status = 'error';
      }
    });

    let str = '';
    if (fileList.length !== 0) {
      fileList.map((value) => {
        if (value.response && value.status !== 'error') {

          str += `${value.response.data};`;

        }
        else if (value.status !== 'error')
        {str += `${value.uid  };`;}
        return str
      });
      this.setState({
        materialIds: str
      })
      // this.props.form.setFieldsValue({materialIds: str});
    }
    return fileList;
  };

  downLoadFile = (file) => {
    const {dispatch, guideModal: {editFlag}} = this.props;
    if (editFlag === EDIT_FLAG.ADD) {
      message.warning('新建状态下不能下载附件，需要保存后才能下载');
      return;
    }
    dispatch({
      type: 'guideModal/downLoadFile',
      payload: {
        md5: file.md5,
        fileName: file.name,
      },
    });
  };


  onRemoveFile = (file) => new Promise((resolve,reject)=>{
    confirm({
      title: '是否删除附件',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        this.handleRemoveFile(file);
        return resolve(true);
      },
      onCancel:()=>reject(false)
    })
  });


  handleRemoveFile = (file) => {
    const {dispatch, guideModal: {detailData}} = this.props;
    console.log(detailData,'remove file');
    if(detailData.materialIds){
      const materialArr = detailData.materialIds.split(';');
      for (let i = 0; i < materialArr.length; i++) {
        if (materialArr[i] == file.uid) {
          materialArr.splice(i, 1);
          break;
        }
      }
      if (materialArr.length > 0) {
        detailData.materialIds = materialArr.join(';');
      }
      else {
        detailData.materialIds = '';
      }
      for (let i = 0; i < detailData.attFiles.length; i++) {
        if (detailData.attFiles[i].id === file.uid) {
          detailData.attFiles.splice(i, 1);
          break;
        }
      }
      dispatch({
        type: 'guideModal/delFile',
        payload: {
          id: file.uid,
          data:detailData
        },
      });
      return true;
    }
  };

  transfer = (files) => {
    const {guideModal: {detailData}} = this.props;
    if (detailData.attFiles) {
      detailData.attFiles.map(value => files.push(
        {
          uid: value.id,
          name: value.fileName,
          status: 'success',
          md5: value.fileMd5,
        },
      ));
    }
    return files
  };



  handleUpload = (file)=>{
    const {dispatch} = this.props;
    const param = new FormData()
    param.append('file', file, file.name)
    dispatch({
      type: 'customerDetail/uploadfile',
      payload: param,
    })
  }



  beginYearChange =(value)=>{
    const {form} = this.props;
    form.setFieldsValue({
      beginYear: value,
    });
  };

  endYearChange = (value)=>{
    const {form} = this.props;
    form.setFieldsValue({
      endYear: value,
    });
  };


  render() {
    const {basicdata: {gDictData}} = this.props;
    const {form, closeFunction, loadingGet} = this.props;
    const {getFieldDecorator} = form;
    let detail = [];
    const {guideModal: {rules, editFlag}, loadingUpdate, loadingAdd} = this.props;
    const submitLoading = editFlag === EDIT_FLAG.ADD ? loadingAdd : loadingUpdate;
    const {guideModal: {detailData}} = this.props;
    const url = remoteLinkAddress();
    let files = [];
    if (editFlag === EDIT_FLAG.EDIT) {
      detail = detailData;
      files = this.transfer(files);
    }
    const fileProps = {
      name: 'file',
      action: `${url}/api/files/upload`,
      listType: 'text',
      headers: {
        token: sessionStorage.getItem('token'),
      },
      beforeUpload:utils.checkBeforeFileUpload,
      defaultFileList: files,
      onChange: this.handleChange,
      onPreview: this.downLoadFile,
      onRemove: this.onRemoveFile,
      accept:".zip,.rar,.doc,.docx,.png,.xls,.xlsx,application/pdf",
    };

    let hiddenFlag = 'block';
    if (editFlag === 0) {
      hiddenFlag = 'none';
    }
    const nowDate = new Moment();
    const nowYear  = utils.getYearDate(nowDate);
    const yearArr = [];
    for(let i=0;i<=4;i++) {
      yearArr.push(+nowYear-i-1);
    };
    for(let i=0;i<=6;i++) {
      yearArr.push(+nowYear+i);
    };
    yearArr.sort();
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form style={{marginTop: 8}}>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label="指南名字">
                {getFieldDecorator('guideName', {
                  initialValue: detail.guideName || '',
                  rules: [
                    {
                      required: true,
                      message: '请输入指南名字，注意不要超过50个字',
                      max: 50,
                      min: 1,
                      whitespace: true,
                    },
                  ],
                })(<TextArea placeholder='请输入指南名字，注意不要超过50个字' autosize />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label="指南简称">
                {getFieldDecorator('guideBrief', {
                  initialValue: detail.guideBrief || '',
                  rules: [
                    {
                      required: true,
                      message: '请输入指南简称，注意不要超过20个字',
                      max: 20,
                      min: 1,
                      whitespace: true,
                    },
                  ],
                })(
                  <Input placeholder='请输入指南简称，注意不要超过20个字' />,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label="指南前缀">
                {getFieldDecorator('guidePrefix', {
                  initialValue: detail.guidePrefix || '',
                  rules: [
                    {
                      required: true,
                      max: 5,
                      min: 1,
                      whitespace: true,
                      pattern:guidePrefix.reg,
                      message:guidePrefix.msg,
                    },
                  ],
                })(
                  <Input placeholder='指南前缀由数字和字母构成，且长度不超过5，范例:18xbc'  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem style={{display: hiddenFlag}} {...guideDetailDateLayout} label="创建时间">
                {getFieldDecorator('createTime', {
                  initialValue: detail.createTime || '',
                })(
                  <Input disabled={!!editFlag || true} />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem style={{display: hiddenFlag}} {...guideDetailStateLayout} label="指南状态">
                {getFieldDecorator('state', {
                  initialValue: String(detail.state) ? utils.getAllDictNameById(gDictData, 'guideState', detail.state) : detail.state || '',
                })(
                  <Input disabled={!!editFlag || true} />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="开始年份"
                {...guideDetailDateLayout}
              >
                {getFieldDecorator('beginYear', {
                  initialValue: detail.beginYear|| yearArr[0],
                  rules: [{
                    required: true,
                    message: '请选择开始年份',
                  }],
                })
                (<Select onChange={this.beginYearChange}>{yearArr.map((year)=><Option id={`begin${year}`} key={year}>{year}</Option>)}</Select>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="结束年份"
                {...guideDetailStateLayout}
              >
                {getFieldDecorator('endYear', {
                  initialValue: detail.endYear|| yearArr[0],
                  rules: [{
                    required: true,
                    message: '请选择结束年份',
                  }],
                })
                (<Select onChange={this.endYearChange}>{yearArr.map((year)=><Option id={`end${year}`} key={year}>{year}</Option>)}</Select>)
                }
              </FormItem>
            </Col>
            {/* <Col span={24}> */}
            {/* <FormItem {...guideDetailFormItemLayout} label="上传材料附件ids"> */}
            {/* {getFieldDecorator('materialIds', { */}
            {/* initialValue: detail.materialIds || '', */}
            {/* rules: [ */}
            {/* { */}
            {/* message: '请上传指南附件！', */}
            {/* whitespace: true, */}
            {/* }, */}
            {/* ], */}
            {/* })( */}
            {/* <Input disabled={!!editFlag || true} />, */}
            {/* )} */}
            {/* </FormItem> */}
            {/* </Col> */}
            <Col span={24}>
              <FormItem {...guideDetailFormItemLayout} label="指南备注">
                {getFieldDecorator('memo', {
                  initialValue: detail.memo || '',
                  rules: [
                    {
                      message: '指南备注必填，长度为1-400个字符之间！',
                      max: 400,
                      min: 1,
                      whitespace: true,
                    },
                  ],
                })(
                  <TextArea placeholder='请填写指南备注' autosize />,
                )}
              </FormItem>
            </Col>

            {/* <Col span={24}> */}
            {/* <FormItem {...guideDetailFormItemLayout} label="结项提交规则"> */}
            {/* {getFieldDecorator('conclusionRulesId', { */}
            {/* initialValue: detail.conclusionRulesId || '', */}
            {/* })( */}
            {/* <AdvancedSelect */}
            {/* fieldConfig={SelectFieldConfig.ruleSelect} */}
            {/* dataSource={rules} */}
            {/* onChange={this.handleRuleChange} */}
            {/* />, */}
            {/* )} */}
            {/* </FormItem> */}
            {/* </Col> */}

            <Col span={24}>
              <FormItem {...guideDetailContextLayout} label="指南内容">
                {getFieldDecorator('context', {
                  initialValue: BraftEditor.createEditorState(detail.context ||''),
                  rules: [{
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入指南内容')
                      } else {
                        callback()
                      }
                    }
                  }],
                })(
                  <BraftEditor id='braft' className="my-editor" controls={controls} placeholder="指南内容不能直接粘贴图片，图片请点击【媒体】按钮上传" />
                )}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="上传材料附件" {...fileUplaodLayout}>
                <Upload {...fileProps}>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </FormItem>
            </Col>
            <Col span={24}>
              <EasyULCreater liarr={documentRequireArr} {...fileUplaodLayout} />
            </Col>
          </Row>
        </Form>

        <FooterToolbar style={{width: '100%'}}>
          <Button type="primary" onClick={this.submitForm} loading={submitLoading} id='submit'>
            保存
          </Button>
          <Button style={{marginLeft: 8}} onClick={closeFunction}>
            取消
          </Button>
        </FooterToolbar>
      </Card>
    );
  }

}

export default GuideDetail;
