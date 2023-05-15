import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, message } from 'antd';
import AMapInfo from '@/components/AMapInfo/AMapInfo';
import AdvancedSelect from '@/components/AdvancedSelect';
import { MIAN_YANG_LNGLAT, POINT_FLAG, POINT_FORM_TYPE, UPLOAD_TYPE } from '@/utils/Enum';
import MapModal from '@/pages/PointManagement/MapModal';

@Form.create()
@connect(({pointManagementModel})=>({
  pointManagementModel,
}))
class PointSetting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible:false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.openModal()
    },600)
  }



  submitPointInfo = (value) => {
    console.log(value,'submitInfo');
    const {thumbnail:picUrl} = value;
    if(!picUrl){
      message.error('请上传图片');
      return;
    }
    // this.closeModal()
    // 防止删除图片再上传，文件名是本地的
    const {dispatch,pointManagementModel:{pointInfo,pointInfo:{thumbnail}}} = this.props;
    console.log(thumbnail);
    dispatch({
      type:'pointManagementModel/savePointInfo',
      payload: {...pointInfo, ...value,thumbnail } ,
    }).then(() => {
      const {siteId} = value;
      dispatch({
        type: 'pointManagementModel/getPoint',
        payload: {siteId}
      })
    });

  }

  editPoint = (position,address) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'pointManagementModel/editPoint',
      payload: { ...position,address },
    });
    this.openModal()
  }


  handleSelectLeader = (value) => {
    const {pointManagementModel:{rolesList}}=this.props;
    const leader = rolesList.find((item) => item.nickname === value)
    console.log(leader);
  }

  buildDepartmentSelect = () => {
    const {pointManagementModel:{rolesList}}=this.props;
    const fieldConfig = {
      key : 'userId',
      value : 'userId',
      text : 'nickname',
    }
    return <AdvancedSelect
      dataSource={rolesList}
      searchType='nickname'
      onChange={this.changeSiteLeader}
      fieldConfig={fieldConfig}
    />
  }

  closeModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  openModal = () => {
    this.setState({
      modalVisible:true
    })
  }

  savePoint = (value) => {
    const {dispatch} = this.props;
    const {pointManagementModel:{pointInfo,pointInfo:{thumbnail}}} = this.props;
    console.log(thumbnail);
    dispatch({
      type:'pointManagementModel/save',
      payload: { pointInfo: {...pointInfo, ...value } },
    })
  }

  handleUpload = (value) => {
    const {data:{fileName}} = value;
    this.savePoint({thumbnail:fileName})
  }

  // handleRemove = () => {
  //   const {dispatch,pointManagementModel:{pointInfo:{thumbnail}}} = this.props;
  //   try {
  //     dispatch({
  //       type:'pointManagementModel/deleteMiniPicture',
  //       payload: { fileName:thumbnail }
  //     })
  //   }catch (e) {
  //     console.log(e);
  //   }
  // }

  handleRemove = () => {
    // const {pointManagementModel:{pointInfo}} = this.props;
    // pointInfo.thumbnail = null
    this.savePoint({thumbnail:null})
  }

  cancelBtn = (value)=> {
    this.closeModal()
    this.savePoint(value)
  }

  changeDept = (id) => {
    this.savePoint({departmentId:id})
  }

  changeSiteLeader = (id) => {
    this.savePoint({leaderId:id})
  }

  buildDepartment = () => {
    const {pointManagementModel:{departmentsList=[]}}=this.props;
    const fieldConfig = {
      key : 'deptId',
      value : 'deptId',
      text : 'name',
    }
    return <AdvancedSelect
      dataSource={departmentsList}
      searchType='name'
      onChange={this.changeDept}
      fieldConfig={fieldConfig}
    />
  }


  render(){
    const {
      pointManagementModel:{pointInfo},
      match : { params:{id} }
    }=this.props;
    const {latitude=MIAN_YANG_LNGLAT.LATITUDE, longitude=MIAN_YANG_LNGLAT.LONGITUDE} = pointInfo;
    const {modalVisible} = this.state;

    const marker = {
      ...pointInfo,
      position: {latitude,longitude},
    }
    const formBtn = [
      {
        text: '取消',
        type:'cancel',
        key:'cancel',
        func: this.cancelBtn
      },
      {
        text: '保存',
        type:'primary',
        key:'submit',
        func: this.submitPointInfo
      },
    ]
    const uploadProps = {
      onUpload:this.handleUpload,
      onRemove:this.handleRemove,
      maxCount:1,
      type:UPLOAD_TYPE.PICTURE,
      fileList:[],
      disabled:false
    }

    const formFiles = [
      {
        "label": "首页图",
        "defaultValue": "",
        "field": "thumbnail",
        "type":POINT_FORM_TYPE.THUMBNAIL,
        "pattern": null,
        "required":true,
        "message":'Please upload picture xxxx',
        "disabled":false,
        "uploadProps":uploadProps
      },
      {
        "label": "站点名称",
        "defaultValue": "",
        "field": "name",
        "type": POINT_FORM_TYPE.NORMAL,
        "required": true,
        "pattern":null,
        "message":'Please input 站点名称',
        "disabled":false,
      },
      {
        "label": "站点简介",
        "defaultValue": "",
        "field": "introduce",
        "type": POINT_FORM_TYPE.TEXT,
        "required": true,
        "pattern":null,
        "message":'Please input 站点简介',
        "disabled":false,
        "width":470,
        "height":110,
      },
      {
        "label": "经度",
        "defaultValue": "",
        "field": "longitude",
        "type": POINT_FORM_TYPE.NORMAL,
        "required": true,
        "hidden":true,
        "pattern":null,
        "message":'Please input',
        "disabled":true,
      },
      {
        "label": "纬度",
        "defaultValue": "",
        "field": "latitude",
        "type": POINT_FORM_TYPE.NORMAL,
        "required": true,
        "pattern": null,
        "hidden":true,
        "message":'Please input',
        "disabled":true,
      },
      {
        "label": "活动地址",
        "defaultValue": "",
        "field": "address",
        "type": POINT_FORM_TYPE.NORMAL,
        "required": true,
        "pattern":null,
        "message":'Please input 活动地址',
        "disabled":false,
      },
      {
        "label": "所属部门",
        "defaultValue": "",
        "field": "departmentName",
        "type": POINT_FORM_TYPE.OTHER,
        "required": false,
        "pattern":null,
        "message":'请选择所属部门',
        "disabled":false,
        'col':11,
        "renderComponent": this.buildDepartment
      },
      {
        "label": "站点负责人",
        "defaultValue": "",
        "field": "leaderName",
        "type": POINT_FORM_TYPE.OTHER,
        "required": false,
        "pattern":null,
        "message":'Please input 站点负责人',
        "disabled":false,
        "col":12,
        "renderComponent": this.buildDepartmentSelect,
      },
      // {
      //   "label": "站点负责人Id",
      //   "field": "leaderId",
      //   "required": false,
      //   "hidden": true,
      // },
      // {
      //   "label": "联系方式",
      //   "defaultValue": "",
      //   "field": "phoneNumber",
      //   "type": POINT_FORM_TYPE.NORMAL,
      //   "required": false,
      //   "pattern":null,
      //   "message":'Please input 联系方式',
      //   "disabled":true,
      //   "col":12,
      // },
    ];
    return (
      <div style={{ width: '100%', height:window.screen.height - 240}}>
        <AMapInfo
          marker={marker}
          clickMap={this.editPoint}
          clickMarker={this.openModal}
          formVisible
        />
        <MapModal
          ref={this.modalRef}
          visible={modalVisible}
          siteId={id}
          onCancel={this.closeModal}
          pointType={POINT_FLAG.EDIT}
          footerBtn={formBtn}
          formFields={formFiles}
        />
      </div>
    );
  }
}

export default PointSetting;
