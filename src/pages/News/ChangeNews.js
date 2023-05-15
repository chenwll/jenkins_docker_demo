import React,{PureComponent,Fragment} from 'react';
import router from 'umi/router';
import {
  Modal,
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
} from 'antd';
import {connect} from 'dva';
import BraftEditor from 'braft-editor';
import * as basicFunction from '../../utils/utils';
import {NEWS_STATUS } from '../../utils/Enum';
import FooterToolbar from '@/components/FooterToolbar';
import AdvancedSelect from '../../components/AdvancedSelect';
import { entireLine, lineItem, controls } from '../../utils/globalUIConfig';
import {delectBeforeAndBehindBlackRegular} from '../../utils/regular';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import remoteLinkAddress from '../../utils/ip';
import NewsHtml from './NewsHtml';

const {confirm}=Modal;
const FormItem=Form.Item;
const {TextArea} =Input;
@Form.create()
@connect(({loading,newsModel,basicdata,global})=>({
  global,
  basicdata,
  loading,
  newsModel,
}))
class ChangeNews extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      editorState: BraftEditor.createEditorState(),
    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {newsModel:{addOrEdit}}=this.props;
    switch (addOrEdit) {
      case NEWS_STATUS.ADD:
        dispatch({
          type:'newsModel/save',
          payload:{
            newsDetail:{}
          }
        });
        break;
      default:
        break;
    }
    dispatch({
      type:'newsModel/codeChange',
      payload:{
       html:''
      }
    });
  }

  addOrEditNews=e=>{
    const {dispatch}=this.props;
    const {form} = this.props;
    const {newsModel:{addOrEdit,newsDetail}}=this.props;
    e.preventDefault();
    switch (addOrEdit) {
      case NEWS_STATUS.ADD:
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.newsName=values.newsName.replace(delectBeforeAndBehindBlackRegular.reg,"");// 新闻标题
            values.newsContext=values.newsContext.toHTML();
            dispatch({
              type:'newsModel/addNews',
              payload:{
                ...values
              }
            })
            dispatch({
              type: 'global/closeCurrentTab',
              payload: {
                tabName: '新闻编辑',
              },
            });
          }
        });
        break;
      case NEWS_STATUS.EDIT:
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.newsName=values.newsName.replace(delectBeforeAndBehindBlackRegular.reg,"");// 新闻标题
            values.newsContext=values.newsContext.toHTML();
            dispatch({
              type:'newsModel/editNews',
              payload:{
                ...values,
                newsId:newsDetail.newsId,
                newsState:newsDetail.newsState,
                createrId:newsDetail.createrId
              }
            })
            dispatch({
              type: 'global/closeCurrentTab',
              payload: {
                tabName: '新闻编辑',
              },
            });
          }
        });
        break;
      default:
        break;
    }
  };

  cancel=()=>{
    confirm({
      title: `是否确认取消编辑，取消之后不保存现有内容`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const {dispatch}=this.props;
        await router.push(`/News/NewsSetting`);
       await dispatch({
          type: 'global/closeCurrentTab',
          payload: {
            tabName: '新闻编辑',
          },
        })
       await dispatch({
          type:'newsModel/save',
          payload:{
            newsId:-1,
            newsName:'',
            newsDetail: {}
          }
        });// 将newsId设置为-1重置为初始值

      }
    })
  };

  myUploadFn=(param)=>{
    const xhr = new XMLHttpRequest();
    const url = remoteLinkAddress();
    const fd = new FormData();
    const successFn = (response) => {
      const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
      const Url=JSON.parse(xhr.responseText)
      param.success({
        url: `${url}/${Url.data}`,
        meta: {
          id: upLoadObject && upLoadObject.id,
          title: upLoadObject && upLoadObject.fileName,
          alt: upLoadObject && upLoadObject.fileName,
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: false, // 指定音视频是否显示控制栏
          poster: '', // 指定视频播放器的封面
        }
      })
    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)

    };

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    };

    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', `${url}/api/picture/news/upload`, true);
    xhr.setRequestHeader("token",sessionStorage.getItem('token'));// header中token的设置
    xhr.send(fd)
  }

  preview=()=>{
    if (window.previewWindow) {
      window.previewWindow.close()
    }
    window.previewWindow = window.open()
    window.previewWindow.document.write(this.buildPreviewHtml())
    window.previewWindow.document.close()
  }

  buildPreviewHtml () {
    const {editorState}=this.state
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${editorState.toHTML()}</div>
        </body>
      </html>
    `

  }

  handleChange = (editorState) => {
    this.setState({ editorState })
  }

  HTMLCode=()=>{
    const {form,dispatch}=this.props
    form.validateFieldsAndScroll(['newsContext'],(err, values) => {
        const html=values.newsContext.toHTML();
      dispatch({
        type:'newsModel/codeChange',
        payload:{
          html,
          visible: true
        }
      })
    });
  }

  onSave = () => {
    const {form,dispatch,newsModel:{newsDetail}}=this.props
    form.validateFields(['html'],(err, values) => {
      dispatch({
        type: 'newsModel/codeChange',
        payload:{
          ...values,
          visible:false
        }
      })
      if(newsDetail.newsContext){
        newsDetail.newsContext=values.html
        dispatch({
          type: 'newsModel/save',
          payload:{
            ...newsDetail
          }
        })
      }
     form.resetFields('newsContext');
    });
  }

  onCancel=()=>{
    const {dispatch}=this.props;
    dispatch({
      type: 'newsModel/codeChange',
      payload:{
        visible:false
      }
    })
  }

  render(){
    const {form:{getFieldDecorator}}=this.props;
    const {newsModel:{  addOrEdit,visible,html}}=this.props;
    let{newsModel:{newsDetail}}=this.props
    const {basicdata:{gDictData}}=this.props;
    const newsType=basicFunction.getDictByType(gDictData,'newsType');
    // const modalProps = {
    //   visible,
    //   html,
    //   updateData:this.updateData
    // };
    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      },
      {
        key: 'code-button',
        type: 'button',
        text: '查看html',
        onClick: this.HTMLCode
      }
    ]

    switch (addOrEdit) {
      case NEWS_STATUS.EDIT:
        if(newsDetail.newsType!=undefined) newsDetail.newsType=newsDetail.newsType.toString();
        break;
      case NEWS_STATUS.ADD:
        newsDetail={};
        break;
      default:
        break;
    }

    return(
      <PageHeaderWrapper title='新闻编辑'>
        <>
          <Card bordered={false}>
            <Row>
              <Col>
                <FormItem {...entireLine} label='新闻标题'>
                  {getFieldDecorator('newsName', {
                    initialValue : newsDetail.newsName||'',
                    rules : [
                      {
                        max:50,
                        required : true,
                        whitespace:true,
                        message : '50个字以内的新闻标题',
                      },
                    ],
                  })(<Input placeholder='请输入50个字以内的新闻标题' />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...lineItem} label='新闻类型'>
                  {getFieldDecorator('newsType', {
                    initialValue : newsDetail.newsType||'',
                    rules : [
                      {
                        required : true,
                        whitespace:true,
                        message : '请选择新闻类型',
                      },
                    ],
                  })(<AdvancedSelect style={{'width':'100%'}} type="DATADICT" dataSource={newsType} onChange={(value) => {}} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...entireLine} label="新闻内容">
                  {getFieldDecorator('newsContext', {
                    initialValue: BraftEditor.createEditorState(newsDetail.newsContext||html),
                    rules: [{
                      required: true,
                      message: '新闻内容必填！',
                      whitespace: true,
                      validator: (_, value, callback) => {
                        if (value.isEmpty()) {
                          callback('请输入正文内容')
                        } else {
                          callback()
                        }
                      }
                    }],
                  })(
                    <BraftEditor onChange={this.handleChange} extendControls={extendControls} controls={controls} placeholder='请输入新闻内容' media={{uploadFn: this.myUploadFn,allowPasteImage: true}} />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <FooterToolbar style={{ width : '100%' }}>
            <Button type="primary" onClick={this.addOrEditNews}>
              保存
            </Button>
            <Button style={{ marginLeft : 8 }} onClick={this.cancel}>
              取消
            </Button>
          </FooterToolbar>
        </>
        {/* {visible?<NewsHtml {...modalProps} /> :''} */}

        <Modal
          width='50%'
          visible={visible}
          title='html代码修改'
          okText="确定"
          destroyOnClose
          onCancel={this.onCancel}
          onOk={this.onSave}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem {...entireLine} label="html代码">
                  {
                    getFieldDecorator('html',{
                      initialValue:html||'',
                      rules: [{
                        type: 'string',
                        whitespace:true,
                        message: '请填写描述',
                      }],
                    })
                    (<TextArea placeholder="请输入代码" autosize={{minRows: 1, maxRows: 2}} style={{width: "100%"}} />

                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    )
  }
}
export default ChangeNews;
