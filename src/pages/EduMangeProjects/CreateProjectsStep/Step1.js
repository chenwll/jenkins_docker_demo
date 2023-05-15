import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Input,
  Spin,
  DatePicker,
} from 'antd';
import * as utils from '../../../utils/utils';
import FooterToolbar from '@/components/FooterToolbar';
import AdvancedSelect from '../../../components/AdvancedSelect/index';
import * as SelectFieldConfig from '../../../utils/globalSelectDataConfig';
import { entireLine, lineItem } from '../../../utils/globalUIConfig';
import { emailRegular, fixedTelephoneRegular, phoneRegular, postalCodeRegular } from '../../../utils/regular';
import moment from 'moment';
import { userDetail } from '../../../utils/globalSelectDataConfig';
import { PROCESS_SCHOOL_TYPE, RECOMMEND_STATE, SCHOOL_TYPE ,PROCESS_STAGE} from '../../../utils/Enum';

const typeObj={
  'xqjy':0,
  'ywjy':1,
  'ptgz':2,
  'zdzyjy':3,
  'gzgzjy':4,
  'bkjy':5,
};
const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
@connect(({ loading, EduMangeProjectsModel, basicdata}) => ({
  loading,
  basicdata,
  EduMangeProjectsModel,
  guideListLoading: loading.effects['EduMangeProjectsModel/getGuideList'],
  fetch: loading.effects['EduMangeProjectsModel/fetch'],
  getUserLoading:loading.effects['EduMangeProjectsModel/getAllUser']
}))

export default class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    const nowDate = new moment();
    this.state = {
      startValue: nowDate,
      endValue: nowDate.add(1, 'd'),
      endOpen: false,
      selectedRows: [],
      processSelectArr:[],

    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {match:{params}}=this.props;
    dispatch({
      type:'EduMangeProjectsModel/getProcessAll',
      payload:{
        guideId:params.guideId
      }
    });
    dispatch({
      type:'EduMangeProjectsModel/getAllUser',
      payload : {
        roleId:1
      },
    })
  };

  handleProviderChange=(value)=>{

  };

  handleSchoolUserChange=(schoolUserDetail)=> {
    const {
      EduMangeProjectsModel:{allProcess},match: {params}
    }=this.props;
    const { basicdata: { gDictData } } = this.props;
    const  processType = utils.getDictByType(gDictData, 'processType');
    const depType=utils.getDictByType(gDictData, 'depType');
    let processYouCanSelect=[];
    let processKeyMatchProcessName=[];//匹配推荐、打分这些
    allProcess.forEach(item=>{
      if(item.type==this.judgeSchoolType(schoolUserDetail)){
          if(item.processStage===PROCESS_STAGE.TOPIC){
            processYouCanSelect.push(item)
          }
      }
    });//所有高校或非高校的
    processYouCanSelect.forEach(item=>{
      processType.forEach(data=>{
        if(data.k==item.processType){
          item.processName=data.val;
          processKeyMatchProcessName.push(item)
        }
      })
    });
    depType.forEach(item=>{
      processKeyMatchProcessName.forEach(data=>{
        data.processId=String(data.processId);
        if(item.k==data.depType){
          data.finllyText=item.val+data.processName
        }
      })
    })
    this.setState({
      processSelectArr:processKeyMatchProcessName
    })
}


  handleChooseSchool=(value)=>{
    const that = this;
    const {dispatch}=this.props;
    dispatch({
      type:'EduMangeProjectsModel/getUser',
      payload:{
        id:value
      },
        callback : (res) => {
       this.handleSchoolUserChange(res);
        },
    },
    )

  };

  disabledEndDate = (endValue) => {
    const {startValue} = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  disabledStartDate = (current) => {
    const nowDate = new moment();
    return current >= nowDate;
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

  addProjects=(values)=>{
    const {dispatch}=this.props;
    const {match:{params}}=this.props;
    dispatch({
      type:'EduMangeProjectsModel/save',
      payload:{
        newProjectAllInfo:{
          ...values
        }
      }
    })
  };

  nextStage = () => {
    const {dispatch, form, match: {params}} = this.props;
    const {
      EduMangeProjectsModel:{
        schoolUserDetail,
      }
    }=this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values['userName']=schoolUserDetail.username?schoolUserDetail.username:'';
        values['guideId']=params.guideId;
        values['depId']=schoolUserDetail.parentDepId?schoolUserDetail.parentDepId:'';

        this.addProjects(values);
      }
      else {
        return;
      }
    })
    router.push({pathname: `/EduMangeProjects/CreateProjects/step2/${params.guideId}`, query: {prevent: true}});
  };

  handleReturn=()=>{
    const {match:{params}}=this.props;
    const {dispatch}=this.props;
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '新增项目',
      },
    });
    dispatch({
      type: 'EduMangeProjectsModel/save',
      payload: {
        newProjectAllInfo: {},
      },
    });
    router.push({pathname: `/EduMangeProjects/ProjectsList/${params.guideId}`, query: {prevent: true}});
  };

  judgeSchoolType=(userDetail)=>{
    switch (userDetail.schoolType) {
      case typeObj.xqjy:
      case typeObj.ywjy:
      case typeObj.ptgz:
      case typeObj.zdzyjy:
        return 1;
        break;
      case typeObj.gzgzjy:
      case typeObj.bkjy:
        return 0;
        break;
      default:
        return 3;
        break;
    }
  };



  render() {
    const { basicdata: { gDictData } } = this.props;
    let titleTypeArr = utils.getDictByType(gDictData, 'titleType');
    let schoolTypeArr = utils.getDictByType(gDictData, 'schoolType');
    const dateFormat = 'YYYY-MM-DD';
    const { form: { getFieldDecorator } } = this.props;
    const {
      startValue,
      endValue,
      endOpen,
      processSelectArr,
    }=this.state;

    const {
      EduMangeProjectsModel:{
        allUser_Applyer,
        schoolUserDetail,
        getUserLoading,
        newProjectAllInfo
      }
    }=this.props;
    let schoolType=this.judgeSchoolType(schoolUserDetail);
    return (
      <Card bordered={false} loading={getUserLoading}>
        <Spin spinning={getUserLoading?true:false}>
          <Form style={{ marginTop: 8 }} >
            <Row>
              <Col span={12}>
                <FormItem {...lineItem} label="申报者名称">
                  {getFieldDecorator('schoolName', {
                    initialValue:newProjectAllInfo.schoolName||'',
                    rules: [
                      {
                        required: true,
                        message: '学校名称为必填项',
                      },
                    ],
                  })
                  (<AdvancedSelect
                    dataSource={allUser_Applyer}
                    type='USER_FUZZYSEARCH'
                    onChange={this.handleChooseSchool}/>)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...lineItem} label="项目负责人">
                  { getFieldDecorator('prjOwner', {
                    initialValue:newProjectAllInfo.prjOwner||'',
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '项目负责人为必填项',
                      },
                      //{validator: checkprjOwnerLength}
                    ],
                  })(<Input placeholder="请输入项目申请人"/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem  {...lineItem} label="项目高校类型">
                  { getFieldDecorator('processSchoolType', {
                    initialValue:utils.getDictNameById(PROCESS_SCHOOL_TYPE,schoolType),
                    rules: [
                      {
                        required: true,
                        message: '项目高校类型为必填',
                      },
                      //{validator: checkLength}
                    ],
                  })
                  (<Input
                      disabled={true}
                    />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem  {...lineItem} label="项目所属阶段">
                  {getFieldDecorator('processId', {
                    initialValue:newProjectAllInfo.processId||'',
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请选择项目阶段',
                      },
                      //{validator: checkLength}
                    ],
                  })
                  (<AdvancedSelect
                    // disabled={processSelectArr.length>0?false:true}
                    dataSource={processSelectArr}
                    onChange={this.handleProviderChange}
                    fieldConfig={SelectFieldConfig.eduCreateProjectsProcess}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              {schoolUserDetail.departmentName?
                <Col span={12}>
                  <FormItem {...lineItem} label="行政管理部门">
                    {getFieldDecorator('departmentName', {
                      initialValue:schoolUserDetail.departmentName,
                      rules: [
                        {
                          required: true,
                          message: '部门名称为必填项',
                        },
                      ],
                    })(<Input disabled={true}/>)}
                  </FormItem>
                </Col>:''}
              {schoolUserDetail.schoolType!=undefined? <Col span={12}>
                <FormItem {...lineItem} label="学校类型">
                  {getFieldDecorator('schoolType', {
                    initialValue:String(schoolUserDetail.schoolType),
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '学校类型为必填项',
                      },
                    ],
                  })
                  (<AdvancedSelect
                    disabled={true}
                    dataSource={schoolTypeArr}
                    type="DATADICT"
                    onChange={this.handleProviderChange}
                    fieldConfig={SelectFieldConfig.schoolDetailFiledConfig}/>)
                  }
                </FormItem>
              </Col>:''}
            </Row>
            <Row>
              <Col span={24}>
                <FormItem  {...entireLine} label="项目名称">
                  {getFieldDecorator('projectName', {
                    initialValue:newProjectAllInfo.projectName||'',
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入项目名称且少于60字',
                      },
                      //{validator: checkLength}
                    ],
                  })(<TextArea placeholder="请输入项目名称且少于60字" rows={1} style={{ width: '100%' }}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...entireLine} label="试点单位">
                  {getFieldDecorator('pilotUnit', {
                    initialValue:newProjectAllInfo.pilotUnit||'',
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
                    initialValue:newProjectAllInfo.workCompany||'',
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '工作单位为必填项',
                      },
                    ],
                  })(<Input placeholder="请输入工作单位"/>)}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span={12}>
                <FormItem {...lineItem} label="行政职务">
                  {getFieldDecorator('duties', {
                    initialValue:newProjectAllInfo.duties||'',
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '行政职务为必填项',
                      },
                    ],
                  })(<Input placeholder="请输入行政职务"/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...lineItem} label="职称">
                  {getFieldDecorator('title', {
                    initialValue:newProjectAllInfo.title||'',
                    rules: [
                      {
                        required: true,
                        message: '职称为必填项',
                      },
                    ],
                  })(<AdvancedSelect
                    dataSource={titleTypeArr}
                    type="DATADICT"
                    onChange={this.handleProviderChange}
                    fieldConfig={SelectFieldConfig.titleDetailFiledConfig}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span={12}>
                <FormItem {...lineItem} label="项目开始时间">
                  {getFieldDecorator('prjCreateTime', {
                    initialValue: moment(startValue, dateFormat),
                    rules: [
                      {
                        required: true,
                        message: '项目开始时间为必填项',
                      },
                    ],
                  })(<DatePicker
                    style={{ width: '100%' }}
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
                    initialValue: moment(moment(endValue), dateFormat),
                    rules: [
                      {
                        required: true,
                        message: '项目结束时间为必填项',
                      },
                    ],
                  })(<DatePicker
                    style={{ width: '100%' }}
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
                    initialValue:newProjectAllInfo.email||'',
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
                    initialValue:newProjectAllInfo.postalCode||'',
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
                    initialValue:newProjectAllInfo.phone||'',
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
                    initialValue:newProjectAllInfo.companyTel||'',
                    rules: [
                      {
                        required: true,
                        pattern: fixedTelephoneRegular.reg,
                        message: fixedTelephoneRegular.msg,
                      },
                    ],
                  })(<Input placeholder="形如0816-123456"/>)}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <FooterToolbar>
            <Button type="primary" onClick={this.nextStage} >
              下一步
            </Button>
            <Button  onClick={this.handleReturn} >
              返回
            </Button>
          </FooterToolbar>
        </Spin>
      </Card>
    );
  }
}
