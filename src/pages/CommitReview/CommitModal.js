import React, { Component, Fragment } from 'react';
import { Button, Col, Divider, Form, InputNumber, Modal, Row, Select, Spin, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { connect } from 'dva';
import style from '@/pages/CommitReview/Commit.less';
import { file_type } from '@/utils/globalData';
import UploadModal from '@/pages/PersonalProject/PersonalProjectStep/UploadModal';
import { TASK_COMMMIT_TYPE } from '@/utils/Enum';



@connect(({CommitReviewModel,loading,user})=>({
  CommitReviewModel,
  user,
  rulesLoading:loading.effects['CommitReviewModel/getAdminRules'],
  commitLoading:loading.effects['CommitReviewModel/getTaskDetail'],
  fileLoading:loading.effects['CommitReviewModel/getFileMessageById']

}))
@Form.create()
class CommitModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uploadModalVisible:false,
      taskCommit:{},
    }
  }

  componentDidMount() {
    this.getDetailCommit()
  }

  getDetailCommit = () => {
    const {taskId,dispatch,guideId} = this.props;
    console.log('发送请求');
    dispatch({
      type:'CommitReviewModel/getTaskDetail',
      payload:{
        taskId,
        guideId,
      }
    })
  }

  onSubmit = () => {
    const {CommitReviewModel:{commitDetail={}}}=this.props;
    const {form: {getFieldsValue}} = this.props;
    const {onSubmit} = this.props;
    const {reportId} = commitDetail
    const val = {...getFieldsValue()}
    onSubmit({ ...val, reportId})
    this.getDetailCommit()
  }

  isUploadRender = (text, record) => {
    if(record.fileIds !== 'null'){
      return (
        <Fragment>
          <a onClick={() => this.modalOpen(record)}>查看</a>
        </Fragment>
      )
    }
    return (
      <a onClick={() => this.modalOpen(record)}>上传</a>
    )

  }

  // 打开modal函数
  modalOpen = (record) => {
    const { dispatch } = this.props
    const {  fileIds } = record
    if(record.type !== TASK_COMMMIT_TYPE.TEXT){
      dispatch({
        type:'CommitReviewModel/getFileMessageById',
        payload:{
          fileIds
        }
      })
    }
    this.open()
    this.setState({
      taskCommit:record,
    })
  }

  modalCancel = ()=>{
    this.setState({
      uploadModalVisible:false
    })
  }

  open = () => {
    this.setState({
      uploadModalVisible:true,
    })
  }

  render() {
    const {CommitReviewModel:{commitDetail={},taskCommitFiles},form:{getFieldDecorator},fileLoading,commitLoading}=this.props;
    const {uploadModalVisible,taskCommit} = this.state;
    const {creatorName,departmentName,creatorPhone,taskDetail,taskCommitDetails=[],ruleName}= commitDetail;
    const columns = [
      {
        title:'序号',
        key:'count',
        render:(text,record,index) => <span>{index + 1}</span>
      },
      {
        title:'名称',
        key:'commitName',
        dataIndex:'commitName',
      },
      {
        title:'格式',
        key:'type',
        dataIndex:'type',
        render:(text) => {
          let type = ''
          file_type.forEach((item)=>{
            if(text.toString() === item.key){
              type = item.text
            }
          })
          return type
        }
      },
      {
        title:'描述',
        key:'memo',
        dataIndex:'memo',
      },
      {
        title:'操作',
        key:'action',
        render:(text, record, index) => this.isUploadRender(text, record, index)
      },
    ]
    const uploadModalProp = {
      title:'文件查看',
      visible:uploadModalVisible,
      fileList:taskCommitFiles,
      footer:null,
      onCancel:this.modalCancel,
      readonly:true,
      type:taskCommit.type === TASK_COMMMIT_TYPE.PICTURE ? 0:1,
      loading:fileLoading,
      key:taskCommit.taskCommitId,
    }
    return (
      <div>
        <Modal
          title={null}
          className={style.modal}
          footer={null}
          {...this.props}
        >
          <Spin spinning={commitLoading}>
            <Row>
              <Col span={11} className={style.modalScroll} style={{height:"75vh"}}>
                <div style={{height:"75vh"}}>
                  <div className={style.titleText}>{departmentName}</div>
                  <div className={style.titleText}>要求</div>
                  <Col span={24}>
                    <div className={style.textDescription}>
                      {taskDetail}
                    </div>
                  </Col>
                  <div className={style.titleText}>申报人及联系方式</div>
                  <div className={style.textDescription}>
                    {creatorName}({creatorPhone})
                  </div>
                  <div className={style.titleText}>
                    报送材料
                  </div>
                  <Table
                    dataSource={taskCommitDetails}
                    columns={columns}
                    bordered={false}
                    rowKey={record => record.taskCommitId}
                  />
                </div>
              </Col>
              <Col span={1} style={{height:"75vh",width:" 2.166667% !important" }}>
                <Divider type="vertical" style={{height:"75vh"}} className={style.border} />
              </Col>
              <Col span={12} style={{position:'relative',height:"75vh"}}>
                  <Col>
                    <Form layout="inline">
                      <Form.Item label="评分">
                        {getFieldDecorator('grade',{
                            rules:[{required:true}],
                            initialValue:commitDetail.grade,
                          })(
                            <InputNumber min={0} max={100} />
                          )}
                      </Form.Item>
                      <br />
                      <Form.Item label="意见">
                        {getFieldDecorator('comment',{
                          rules:[{required:true}],
                        })(
                          <TextArea rows={4} placeholder="请输入意见" style={{width:'27vw'}} />
                        )}
                      </Form.Item>
                    </Form>
                  </Col>
                  <Divider type="horizontal" className={style.border} />
                  <div>
                    <div className={style.commitRules}>评测标准：</div>
                    <div className={`${style.commitRules} ${style.modalScroll}`} style={{height:210}}>
                      {ruleName}
                    </div>
                  </div>
                <Button type='primary' className={style.btnSubmit} onClick={this.onSubmit}>提交</Button>
              </Col>
            </Row>
          </Spin>
        </Modal>
        <UploadModal
          {...uploadModalProp}
        />
      </div>
    );
  }
}

export default CommitModal;
