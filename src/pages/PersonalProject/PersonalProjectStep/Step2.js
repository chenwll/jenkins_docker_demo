import { Card, Table,Form ,Button, Icon, message } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva'
import { router } from 'umi';
import { RULE_DECLARATION_TYPE, TASK_COMMMIT_TYPE, UPLOAD_TYPE } from '@/utils/Enum';
// eslint-disable-next-line camelcase
import { file_type } from '@/utils/globalData';
import FooterToolbar from '@/components/FooterToolbar';
import GuideDescription from '@/components/GuideDescription';
import UploadModal from './UploadModal';
import style from './style.less'



@Form.create()
@connect(({guideModal, basicdata, personalProjectModal,user,loading}) => ({
  guideModal,
  basicdata,
  user,
  personalProjectModal,
  loadingTaskCommit: loading.effects['personalProjectModal/fetch'],
}))
class Step2 extends PureComponent {

  state = {
    visible:false,
    taskCommitId:null,
    taskCommit:{},
    isUploadLoading:false,
  }


  componentDidMount(){
    // 获取当前用户的部门id，规则id 得到当前用户的任务
    const {user: { sysUser = {} }, dispatch, 
    personalProjectModal:{ currentRuleId,status,currentGuideId,currentGuide,currentRule } 
    } = this.props
    dispatch({
      type:'personalProjectModal/getRuleTask',
      payload:{
        departmentId:sysUser.departmentId,
        ruleId:currentRuleId,
        guideId:currentGuideId
      }
    })
    if(status === RULE_DECLARATION_TYPE.DECLARATION){
      const payload = {
        creatorId:sysUser.userId,
        departmentId:sysUser.departmentId,
        guideId:currentGuide.guideId,
        ruleId:currentRule.ruleId,
        textValue:'',
      }
      dispatch({
        type:'personalProjectModal/commitTask',
        payload
      })
    }
  }

  
  back = () =>{
    router.push('/PersonalProject/basicInfo/step1')
  }

  // 打开modal函数
  ModalOpen = (record) => {
    const { dispatch,personalProjectModal:{ RuleTaskData } } = this.props
    const { taskCommitId, fileIds } = record
    if(record.type !== TASK_COMMMIT_TYPE.TEXT){
      dispatch({
        type:'personalProjectModal/getFileMessageById',
        payload:{
          fileIds
        }
      })
    } 
    this.setState({
      visible:true,
      taskCommitId,
      taskCommit:record,
      textValue:RuleTaskData.description
    })
  }

  // 关闭modal函数
  ModalCancel = ()=>{
    this.setState({
      visible:false
    })
  }

  // modal 成功函数
  ModalOk = async() => {
    const { personalProjectModal:{ taskCommitFiles,currentReportId } ,dispatch} = this.props
    const { taskCommit } = this.state
    const fileIds = taskCommitFiles.map(value => value.id)
    const payload = {
      name:taskCommit.commitName,
      taskCommitId:taskCommit.taskCommitId,
      taskId:taskCommit.taskId,
      reportId:currentReportId,
      type:taskCommit.type,
      fileIdList:fileIds
    }
    this.uploadBeforeState(true)
    await dispatch({
      type:'personalProjectModal/bindFileAndTaskCommit',
      payload
    })
    this.uploadBeforeState(false)
    this.ModalCancel()
  }

  // 上传函数
  onUpload = (formData) => {
    if(formData.code === 1) return message.error('上传失败')
    const { data } = formData
    const { dispatch,personalProjectModal:{ taskCommitFiles } } = this.props
    const newTaskFiles = [...taskCommitFiles,data]
    dispatch({
      type:'personalProjectModal/save',
      payload:{
        taskCommitFiles:newTaskFiles
      }
    })
    return null;
  }

  // 删除已上传文件
  onRemove = (file) => {
    const { dispatch } = this.props
    const findFile= this.getFileNameByname(file.name || file.original)
    dispatch({
      type:'personalProjectModal/unbindFileAndTaskCommit',
      payload:{
        commitInfoId:findFile.commitId
      }
    })
    // dispatch({
    //   type:'personalProjectModal/saveUploadFileId',
    //   payload:{
    //     fileName:{
    //       fileName:findFile.fileName
    //     },
    //     taskCommitId,
    //   }
    // })
  }

  // 通过文件源名查找fileName
  getFileNameByname = (name) => {
    const { personalProjectModal:{ uploadFileIdList } } = this.props
    const { taskCommitId } = this.state
    for (let index = 0; index < uploadFileIdList.length; index += 1) {
      const element = uploadFileIdList[index];
      if(element.taskCommitId === taskCommitId){
        for (let i = 0; i < element.fileIdList.length; i += 1) {
          const value = element.fileIdList[i];
          if(value.original === name){
            return {
              fileName:value.fileName,
              commitId:value.commitId  
            }
          }
        }
      }
      
    }
    return {};
  }

  // 获取当前taskcommit 上传的文件列表
  getCurrentFileList = (taskCommitId, data = []) => {
    const arr = data.filter((item)=>item.taskCommitId === taskCommitId)
    return  arr.length ? arr[0] : {}
  }
  
  // 判断此taskCommit 是否提交 生成不同的操作
  isUploadRender = (text, record, index, data) => {
    if(record.type === TASK_COMMMIT_TYPE.TEXT){
      return (
        <a onClick={() => this.ModalOpen(record)}>填写</a>
      )
    }
    if(record.fileIds !== 'null'){
      return (
        <Fragment>
          <Icon theme='filled' type="check-circle" className={style.checkCircle} />&nbsp;&nbsp;
          <a onClick={() => this.ModalOpen(record)}>重新上传</a>
        </Fragment>
      )
    }
      return (
        <a onClick={() => this.ModalOpen(record)}>上传</a>
      )
    
  }

  // 去往第三步预览页面
  toPreview = () => {
    router.push('/PersonalProject/basicInfo/step3')
  }

  // 获取到当前taskCommit
  // eslint-disable-next-line consistent-return
  getCurrentTask = (taskCommitId,data) => {
    // eslint-disable-next-line no-param-reassign
    data = data || []
    for (let index = 0; index < data.length; index += 1) {
      const element = data[index];
      if(element.taskCommitId === taskCommitId){
        return element
      }
    }
  }

  // 获取到上传文件状态 是否正在上传
  uploadBeforeState = (status) => {
    this.setState({
      isUploadLoading:status
    })
  }

  // 文本域变更函数
  textOnchange = (e) => {
    console.log('textChange',e);
    // this.setState({
    //   description:value
    // })
  }

  render() {
    const { personalProjectModal:{ RuleTaskData,uploadFileIdList,currentRule = {}, taskCommitFiles },loadingTaskCommit } = this.props
    const { visible,isUploadLoading,taskCommit, textValue } = this.state
    const [taskDetail={}] = RuleTaskData
    const { taskCommitDetails = [] } = taskDetail
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
        render:(text, record, index) => this.isUploadRender(text, record, index, uploadFileIdList)
      },
    ]
    
    // const taskCommitFile = this.getCurrentFileList(taskCommitId,uploadFileIdList)
    // const currentTaskCommit = this.getCurrentTask(taskCommitId,RuleTaskData)
    const uploadModalProp = {
      title:'文件上传',
      visible,
      isUploadLoading,
      fileList:taskCommitFiles,
      type: taskCommit.type,
      description:textValue,
      uploadBeforeState:this.uploadBeforeState,
      onCancel:this.ModalCancel,
      onOk:this.ModalOk,
      onUpload:this.onUpload,
      onRemove:this.onRemove,
      textOnchange:this.textOnchange
    }
    return (
      <Fragment>
        <Card bordered={false}>
          <Table
            dataSource={taskCommitDetails}
            columns={columns}
            bordered={false}
            rowKey={record => record.taskCommitId}
            loading={loadingTaskCommit}
          />
          <GuideDescription
            style={{
              marginTop:'30px'
            }}
            title="要求说明:"
          >
            <p className={style.descrip}>
              {currentRule.taskDetail}
            </p>
          </GuideDescription>
        </Card>
        <UploadModal 
          {...uploadModalProp}
        />
        <FooterToolbar style={{width: '100%'}}>
          <Button style={{marginLeft: 8}} type='primary' onClick={this.toPreview}>
            保存
          </Button>
          <Button style={{marginLeft: 8}} onClick={this.back}>
            返回上一步
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default Step2;
