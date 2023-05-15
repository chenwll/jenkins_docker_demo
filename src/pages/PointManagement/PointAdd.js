import React, { Component } from 'react';
import { Button, Form, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import AMapSearch from '@/components/AMapSearch/AMapSearch';
import AMapInfo from '@/components/AMapInfo/AMapInfo';
import AdvancedSelect from '@/components/AdvancedSelect';
import { POINT_FORM_TYPE, DEPARTMENT_TYPE, TASK_COMMMIT_TYPE, POINT_FLAG, UPLOAD_TYPE } from '@/utils/Enum';
import MapModal from '@/pages/PointManagement/MapModal';

@connect(({pointManagementModel})=>({
  pointManagementModel,
}))
class Index extends Component {

  modalRef = React.createRef()

  constructor(props) {
    super(props);
    this.state = {
      modalVisible:false,
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type:'pointManagementModel/getDepartments',
      payload:{department_type:DEPARTMENT_TYPE.AREA}
    })
  }

  handleUpload = (value) => {
    console.log(value);
    const {data:{fileName}} = value;
    this.savePoint({thumbnail:fileName})
  }

  // handleUpload = (formData) => {
  //   const {dispatch} = this.props;
  //   dispatch({
  //     type:'pointManagementModel/addMiniPicture',
  //     payload:formData,
  //   })
  // }

  handleRemove = () => {
    this.savePoint({thumbnail:null})
  }

  clickMap = (position, address) => {
    this.editNewPoint(position,address);
    this.openModal()
  }
  // chooseOneItem = (position,address) => {
  //   this.editNewPoint(position,address)
  // }

  backToList = () => {
    router.push('/PointManagement/PointsList')
  }

  submitNewPoint = (value) => {
    const {current:{validateFields}} = this.modalRef;
    // const {form:{current:{validateForm}}} = this.props
    if(!value.thumbnail) {
      message.error('请上传图片');
      return;
    }
    validateFields().then(() => {
      const {dispatch} = this.props;
      dispatch({
        type:'pointManagementModel/addPoint',
        payload:{
          ...value,
        },
        callback:this.backToList
      })
    })
  }

  handleSelectPointLeader = (value) => {
    console.log(value,'leader');
  }

  handleSelectDepartmentLeader = (value) => {
    console.log('value',value);
  }

  savePoint = (value) => {
    const {dispatch} = this.props;
    const {pointManagementModel:{newPoint,pointInfo}} = this.props;
    dispatch({
      type:'pointManagementModel/save',
      payload: { newPoint: {...newPoint, ...value } },
    })
  }

  closeModal = () => {
    const {current:{getFieldsValue}} = this.modalRef;
    this.savePoint(getFieldsValue())
    this.setState({
      modalVisible:false
    })
  }

  buildSelectLeader = () => {
    const {pointManagementModel:{rolesList}}=this.props;
    const fieldConfig = {
      key : 'userId',
      value : 'userId',
      text : 'nickname',
    }
    return <AdvancedSelect
      dataSource={rolesList}
      searchType='nickname'
      onChange={this.handleSelectPointLeader}
      fieldConfig={fieldConfig}
    />
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
      onChange={this.handleSelectDepartmentLeader}
      fieldConfig={fieldConfig}
    />
  }

  editNewPoint = (position, address) => {
    const {pointManagementModel:{newPoint}}=this.props;
    const {dispatch} = this.props;
    dispatch({
      type: 'pointManagementModel/save',
      payload: {
        newPoint:{...newPoint,position,...position,address}
      },
    });
    // this.openModal()
  }

  openModal = () => {
    this.setState({
      modalVisible:true
    })
  }

  render() {
    const {modalVisible} = this.state;
    const {pointManagementModel:{newPoint,newPoint:{address}}}=this.props;
    const uploadProps = {
      onUpload:this.handleUpload,
      onRemove:this.handleRemove,
      maxCount:1,
      type:UPLOAD_TYPE.PICTURE,
      fileList:[],
    }
    const formFields = [
      {
        "label": "首页图",
        "defaultValue": "",
        "field": "thumbnail",
        "type": POINT_FORM_TYPE.THUMBNAIL,
        "required": true,
        "pattern": null,
        "message":'请上传站点首页图',
        "disabled":false,
        "uploadProps": uploadProps
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
        "message":'请输入部门介绍',
        "disabled":false,
        "width":470,
        "height":110,
      },
      {
        "label": "经度",
        "defaultValue": "192.168.0.1",
        "field": "longitude",
        "type": POINT_FORM_TYPE.NORMAL,
        "required": true,
        "pattern":null,
        "message":'Please input',
        "disabled":true,
        // "col":10,
        "hidden":true,
      },
      {
        "label": "纬度",
        "defaultValue": "21",
        "field": "latitude",
        "type": POINT_FORM_TYPE.NORMAL,
        "required": true,
        "pattern": null,
        "message":'Please input',
        "disabled":true,
        // "col":12,
        "hidden":true,
      },
      {
        "label": "站点地址",
        "defaultValue": "",
        "field": "address",
        "type": POINT_FORM_TYPE.NORMAL,
        "required": true,
        "pattern":null,
        "message":'Please input 站点地址',
        "disabled":false,
      },
      {
        "label": "站点负责人",
        "defaultValue": "",
        "field": "leaderId",
        "type": POINT_FORM_TYPE.OTHER,
        "required": false,
        "pattern":null,
        "message":'Please input 站点负责人',
        "disabled":false,
        'col':11,
        "renderComponent": this.buildSelectLeader
      },
      {
        "label": "所属部门",
        "defaultValue": "",
        "field": "departmentId",
        "type": POINT_FORM_TYPE.OTHER,
        "required": false,
        "pattern":null,
        "message":'请选择所属部门',
        "disabled":false,
        'col':12,
        "renderComponent": this.buildDepartment
      },
      // {
      //   "label": "联系方式",
      //   "defaultValue": "",
      //   "field": "phoneNumber",
      //   "type": POINT_FORM_TYPE.NORMAL,
      //   "required": false,
      //   "pattern":null,
      //   "message":'Please input 联系方式',
      //   "disabled":false,
      //   'col':12,
      // },
    ]
    const formBtn = [
      {
        text: '取消',
        type:'cancel',
        key:'cancel',
        func:this.closeModal
      },
      {
        text: '保存',
        type:'primary',
        key:'submit',
        func: this.submitNewPoint
      },
    ]
    return (
      <div style={{ width: '100%', height: window.screen.height - 240,position:'relative'}}>
        <AMapSearch
          style={{position:'absolute',left:30,top:26,zIndex:100,width:350,height:51}}
          chooseOneItem={this.editNewPoint}
          addressName={address}
        />
        <Button type='primary' style={{position:'absolute',left:408,top:26,zIndex:100}} onClick={this.backToList}>点位列表</Button>
        <br />
        <AMapInfo
          marker={newPoint}
          clickMap={this.clickMap}
          clickMarker={this.openModal}
          formVisible
        />
        <MapModal
          ref={this.modalRef}
          visible={modalVisible}
          onCancel={this.closeModal}
          pointType={POINT_FLAG.ADD}
          footerBtn={formBtn}
          formFields={formFields}
        />
      </div>
    );
  }
}

export default Index;
