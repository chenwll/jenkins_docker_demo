import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, message, Table, Icon } from 'antd';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import style from './style.less'
import { file_type } from '@/utils/globalData';
import { RULE_DECLARATION_TYPE, TASK_COMMMIT_TYPE, UPLOAD_TYPE } from '@/utils/Enum';
import UploadModal from './UploadModal';


@connect(({ personalProjectModal,  basicdata ,user,loading,}) => ({
  personalProjectModal,
  basicdata,
  user,
  loading: loading.models.personalProjectModal,
  loadingTaskCommit: loading.effects['personalProjectModal/fetch'],
}))

class ProjectFlow3 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      checks: [],
      visible: false,
      taskCommitId:null,
      taskCommit:{}
    };
    // 存放一些需要保存但不需要state的数据
    this.oneWayData = {
      checks:[],
      isData:false
    }
  }

  componentDidMount() {
   // 获取当前用户的部门id，规则id 得到当前用户的任务
   const {user: { sysUser = {} }, dispatch, 
   personalProjectModal:{ currentRuleId,currentGuideId} 
   } = this.props
  //  dispatch({
  //   type:'user/getUserData'
  // })
    dispatch({
      type:'personalProjectModal/getRuleTask',
      payload:{
        departmentId:sysUser.departmentId,
        ruleId:currentRuleId,
        guideId:currentGuideId
      }
    })
  }

  // 返回上一步
  back = () =>{
    router.goBack()
  }

  // 获取当前taskcommit 上传的文件列表
  getCurrentFileList = (taskCommitId, data = []) => {
    const arr = data.filter((item)=>item.taskCommitId === taskCommitId)
    return  arr.length ? arr[0] : {}
  }
  
  judgeEachSubmission = () => {
    const {personalProjectModal:{RuleTaskData}} = this.props
    const [taskDetail={}] = RuleTaskData
    const { taskCommitDetails = [] } = taskDetail
    for (let index = 0; index < taskCommitDetails.length; index += 1) {
      const element = taskCommitDetails[index];
      if(element === 'null'){
        return false;
      }
    }
    return true
  }

  // 判断此taskCommit 是否提交 生成不同的操作
  isUploadRender = (text, record, index, data) => {
    if(record.fileIds !== 'null'){
      this.oneWayData.isData = true
      return (
        <Fragment>
          <Icon type="check-circle" theme='filled' className={style.checkCircle} />
        </Fragment>
      )
    }
      this.oneWayData.isData = false
      return (
        <Icon type="close-circle" theme='filled' className={style.closeCircle} />
      )
    
  }

  // 申报提交函数
  commitTask = () => {
    const {dispatch,personalProjectModal:{ currentReportId}} = this.props
    // 判断是否每项都已经提交
    if(this.judgeEachSubmission()){
      dispatch({
        type:'personalProjectModal/changeReportStateToCommit',
        payload:{
          commitReportId:currentReportId
        }
      })
    }else{
      message.warning('提交项不完整，请检查')
    }
  }

  // 打开modal函数
  ModalOpen = (record) => {
    const { dispatch } = this.props
    const { taskCommitId, fileIds } = record
    dispatch({
      type:'personalProjectModal/getFileMessageById',
      payload:{
        fileIds
      }
    })
    this.setState({
      visible:true,
      taskCommitId,
      taskCommit:record
    })
  }

  // 关闭modal函数
  ModalCancel = ()=>{
    this.setState({
      visible:false
    })
  }

  // modal 成功函数
  ModalOk = () => {
    this.ModalCancel()
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
    return null;
  }

  // 删除已上传文件
  onRemove = (file) => {
    const { taskCommitId } = this.state
    const { dispatch } = this.props
    const findFile= this.getFileNameByname(file.name)
    if(findFile){
      // 先解绑 再删除文件
      dispatch({
        type:'personalProjectModal/unbindFileAndTaskCommit',
        payload:{
          commitInfoId:findFile.commitId
        }
      })
      dispatch({
        type:'personalProjectModal/removeUploadFile',
        payload:{
          taskCommitId,
          fileName:{
            fileName:findFile.fileName
          }
        }
      })
    }
   
  }

  // 获取到当前taskCommit
  getCurrentTask = (taskCommitId,data=[]) => {
    for (let index = 0; index < data.length; index += 1) {
      const element = data[index];
      if(element.taskCommitId === taskCommitId){
        return element
      }
    }
    return null;
  }

  render() {
    const {loadingTaskCommit,user: { userData:{ sysUser = {}} },personalProjectModal:{currentGuide, currentRule,uploadFileIdList,RuleTaskData,status,taskCommitFiles}} = this.props
    const {  visible, taskCommit } = this.state
    const [taskDetail={}] = RuleTaskData
    const { taskCommitDetails = [] } = taskDetail
    this.oneWayData.checks = []
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
        title:'是否上传',
        key:'isUpload',
        render:(text, record, index) => this.isUploadRender(text, record, index, uploadFileIdList)
      },
      {
        title:'操作',
        key:'action',
        render:(text, record) => {
          if(this.oneWayData.isData)
          return (
            <a onClick={() => this.ModalOpen(record)}>查看</a>
          )

          return '';
        }
      },
    ]
    const uploadModalProp = {
      visible,
      fileList:taskCommitFiles,
      type: taskCommit.type,
      readonly:true,
      description:RuleTaskData.description,
      onCancel:this.ModalCancel,
      onOk:this.ModalOk,
    }
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={style.main}> 
            <div className={style.secondaryArea}>
              <div className={style.topTitle}>
                {sysUser.departmentName}
              </div>
              <div className={style.block}>
                <div className={style.title}>申报项目</div>
                <div className={style.content}>{currentGuide.guideName}</div>
              </div>
              <div className={style.block}>
                <div className={style.title}>项目指标</div>
                <div className={style.content}>{currentRule.ruleLevel1Name}</div>
              </div>
              <div className={style.block}>
                <div className={style.title}>评测标准</div>
                <div className={style.content}>{currentRule.taskDetail}</div>
              </div>
              <div className={style.block}>
                <div className={style.title}>申报人及联系方式</div>
                <div className={style.content}>{`${sysUser.nickname  } (${  sysUser.phone  })`}</div>
              </div>
              <div className={style.block}>
                <div className={style.title}>报送材料</div>
                <div className={style.content}>
                  <Table 
                    className={style.Table}
                    columns={columns}
                    dataSource={taskCommitDetails}
                    loading={loadingTaskCommit}
                  />
                </div>
              </div>
              <div className={style.commitBtn}>
                {
                status !== RULE_DECLARATION_TYPE.COMMIT ? 
                  <Button type='primary' onClick={this.commitTask}>确认提交</Button>
                 : ''
              }  
              </div>
            </div>
          </div> 
        </Card>
        <UploadModal {...uploadModalProp} />
        <FooterToolbar>
          <Button style={{marginLeft: 8}} onClick={this.back}>
            返回上一步
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default ProjectFlow3;
