import React, {PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Card,Form,Row,Col,Upload,Button,Icon,message} from 'antd';
import BraftEditor from 'braft-editor';
import {entireLine, lineItem, controls} from "../../../utils/globalUIConfig";
import remoteLinkAddress from "../../../utils/ip";
import {checkBeforeFileUpload} from "../../../utils/utils";
import FooterToolbar from '@/components/FooterToolbar';
import EasyULCreater from '@/components/EasyUlCreater';
import {documentRequireArr} from "../../../utils/Enum.js";

const FormItem = Form.Item;
@Form.create()
@connect(({basicdata,EduMangeProjectsModel,loading,global}) => ({
  global,
  basicdata,
  EduMangeProjectsModel,
  loading:loading.models.EduMangeProjectsModel,
}))

 export default class Step2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      attIds:'',
    }
  }

  componentDidMount(){
    const {EduMangeProjectsModel:{newProjectAllInfo}}=this.props;
    const {match: {params}} = this.props;
    if(!newProjectAllInfo.projectName){
      router.push({pathname:`/EduMangeProjects/CreateProjects/step1/${params.guideId}`,query:{prevent:true}});
    }
  }

  handleChange = ({fileList}) => {
    let uploadSuccess=false;
    this.setState({
      uploadSuccess:false
    });
    fileList.map(function (value, index) {
      if (value.response && value.response.code === 1) {
        value.status = 'error';
      }
    })
    let str = '';
    if (fileList.length !== 0) {
      fileList.map(function (value, index) {
        //  新增加的文件
        if (value.response&& value.response.code === 0&& value.status !== 'error') {
          uploadSuccess=true;
          str += value.response.data + ";";
        }
        //  原本就有的文件
        else {
          if (value.status !== 'error')
            str += value.uid + ";";
        }
      });
      this.setState({
        attIds: str,
      })
    };
    // if(fileList[fileList.lenght-1].response.code===0){
    //   message.success('文件上传成功')
    // }else{
    //   message.error(`fileList[fileList.lenght-1].response.msg`)
    // }
    return fileList;
  };




  render() {
    let files = [];
    const url = remoteLinkAddress();
    const {form:{getFieldDecorator}} = this.props;
    const {match:{params}}=this.props;
    // const {EduMangeProjectsModel:{addProjectData},loading}= this.props;
    // const firstStepData = addProjectData;
    const props = {
      name: 'file',
      action: `${url}/api/files/upload`,
      listType: 'text',
      headers: {
        token: sessionStorage.getItem("token"),
      },
      defaultFileList: files,
      data:{
        projectId:params.projectId
      },
      onChange: this.handleChange,
      beforeUpload:checkBeforeFileUpload,
      accept:".zip,.rar,.doc,.docx,.png,.xls,xlsx,application/pdf",
    };


    const nextStage = ()=>{
      const {dispatch, form, match: {params}} = this.props;
      const {attIds} = this.state;
      const {
        EduMangeProjectsModel:{
          newProjectAllInfo
        }
      }=this.props;
      //router.push({pathname: `/EduMangeProjects/CreateProjects/step3/${params.guideId}/${params.guideId}`, query: {prevent: true}});
      form.validateFieldsAndScroll((err, values) => {
        if(!err)
        {
          if(attIds.indexOf('rc-upload')!=-1) {
            message.error('请等待文件上传成功后再保存!');
            return;
          }
          const sendData = {
            ...newProjectAllInfo,
            context: values.context.toHTML(),
            attIds:attIds,
          };
          dispatch({
            type:'EduMangeProjectsModel/addProjects',
            payload:{
              ...sendData,
              guideId:params.guideId,
              createrId:sendData.schoolName,
            }
          })
        }
      })
    }

    const handleReturn = ()=>{
      const {match: {params},dispatch,form} = this.props;
      router.push({pathname:`/EduMangeProjects/CreateProjects/step1/${params.guideId}`,query:{prevent:true}});
    }

    return (
      <Card bordered={false}>
        <Form style={{marginTop: 8}}>
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
                  rules: [{
                    required: true,
                    message: '申报内容必填！',
                    whiteSpace: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入正文内容')
                      } else {
                        callback()
                      }
                    }
                  }],
                })(
                  <BraftEditor controls={controls} placeholder="指南内容不能直接粘贴图片，图片请点击【媒体】按钮上传"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <FooterToolbar>
          <Button type="primary" onClick={nextStage}>
            操作完成
          </Button>
          <Button onClick={handleReturn}>
            返回
          </Button>
        </FooterToolbar>
      </Card>
    )
  }
}

