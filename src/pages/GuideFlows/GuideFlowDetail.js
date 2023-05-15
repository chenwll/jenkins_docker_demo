import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Card, Row, Col, Input, Button, InputNumber} from 'antd';
import {GuideFlowDetailItem} from '../../utils/globalUIConfig';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from "../../utils/globalSelectDataConfig";
import { guideFlowsPassType, guideFlowExplain,FLOW_PROCESSSTAGE_TYPE } from '../../utils/Enum'
import * as utils from "../../utils/utils";


const FormItem = Form.Item;

@connect(({guideFlowsModal, global, basicdata}) => ({
  guideFlowsModal,
  global,
  basicdata,
}))
@Form.create()


class GuideFlowDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScore: false,
      isOrganization: false,
      isDepart: false,
      passType: guideFlowsPassType.COUNT,
      depSome: [],
    };
  }

  componentDidMount() {
    const { selectItem, depart } = this.props;
    const [detail = {}] = selectItem;
    if(detail.depType){
      this.setState({
        isDepart: true
      })
    }
    this.setState({
      isScore: this.canUseScore(detail.processType),
      isOrganization: this.canUseOrganization(detail.processType),
      passType:detail.passedType,
      depSome: depart.filter(item => item.type === Number(detail.depType)),
    })
  }

  handleCancel = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSubmit = () => {
    const { form, handleSave, isEdit, selectItem, processType, flowType, len, guideId } = this.props;
    const { isScore, isOrganization, passType } = this.state;
    let data = [];
    form.validateFieldsAndScroll((err,value)=>{
      if(err) {
        return
      }
      if(value.autoPass==='true'){value.autoPass=true}
      else if(value.autoPass==='false'){value.autoPass=false}
      if(isEdit) {
        data = {
          passScore: '',
          scoreRuleId: '',
          ...selectItem[0],
          ...value,
        }
      } else {
        data = {
          passScore: '',
          processId: '',
          scoreRuleId: '',
          ...value,
          guideId,
          processStage: processType,
          type: flowType,
          sort: len,
        }
      }
      data.passedType = passType;
      if(!data.depId) {
        data.depId = '';
      }
      if(Number(data.passedType) === guideFlowsPassType.COUNT) {
        delete data.passedProcessScore
      }
      if(Number(data.passedType) === guideFlowsPassType.SCORE) {
        delete data.passedProcessCount
      }
      if(!isScore) {
        delete data.passScore;
        delete data.passedProcessScore;
      }
      if(!isOrganization) {
        delete data.passedProcessScore;
        delete data.passedProcessCount;
        delete data.passedType;
      }
      handleSave(isEdit, data)
    })
  };

  canUseScore = (value) => {
    if(value) {
      const {basicdata:{gDictData}}=this.props;
      const strScoreType = utils.getAllDictNameById(gDictData, 'processType', value);
      if(strScoreType) {
        return strScoreType.search(/打分|评分/) !== -1
      }
    }
    return false;
  };

  canUseOrganization = (value) => {
    if(value) {
      const {basicdata:{gDictData}}=this.props;
      const strScoreType = utils.getAllDictNameById(gDictData, 'processType', value);
      if(strScoreType) {
        return strScoreType.search(/专家|部门/) !== -1
      }
    }
    return false;
  };

  setPassedType = (value) => {
    let passType = guideFlowsPassType.COUNT;
    if(this.canUseOrganization(value)&&this.canUseScore(value)) {
      passType = guideFlowsPassType.SCORE;
    }
    this.setState({
      passType,
    })
  };

  allowAlwaysPass=[{
    value:'false',
    text:'不允许',
    k:1
  },{
    value:'true',
    text:'允许',
    k:2
  }];

  passType=[{
    value:'0',
    text:'通过个数',
    k:1
  },{
    value:'1',
    text:'通过平均分',
    k:2
  }];

  render() {
    const {
      depart,
      selectItem,
      scoreRuleList,
      form: {getFieldDecorator, setFieldsValue},
      processType
    } = this.props;
    const {basicdata:{gDictData}}=this.props;
    const { isScore, depSome, isDepart, isOrganization, passType } = this.state;
    const {TextArea} = Input;
    const [detail = {}] = selectItem;

    return (
      <Card bordered={false}>
        <Form>
          <div style={{display: 'flex',justifyContent:'flex-start',justify:'center',marginBottom:'15px'}}>
            <div style={{height:'85px',width:'5px',backgroundColor:'#dadada',display:'inline-block'}}></div>
            <div style={{backgroundColor:'#eef4ff',display:'inline-block',height:'85px',width:'99%'}}>
              <div>
                <span style={{fontSize:"20px",marginLeft:"10px",verticalAlign:'middle',color:'#00a6fb'}}>说明</span>
              </div>
              <div style={{marginTop:'5px',marginLeft:'7px'}}>
                <span style={{fontSize:"15px",display:'block'}}>通过个数:{guideFlowExplain[guideFlowsPassType.COUNT]}</span>
                <span style={{fontSize:"15px",display:'block'}}>阶段通过分数：{guideFlowExplain[guideFlowsPassType.SCORE]}</span>
              </div>
            </div>
          </div>
          <Row type="flex" justify="center">
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="部门类型">
                {getFieldDecorator('depType', {
                  initialValue: detail.depType?String(detail.depType):'',
                  rules: [
                    {
                      required: true,
                      message: '部门类型为必填项',
                    },
                  ],
                })(<AdvancedSelect
                  placeholder='请选择部门类型'
                  dataSource={utils.getDictByType(gDictData,'depType')}
                  fieldConfig={SelectFieldConfig.userSearchFiledConfig}
                  searchType="DATADICT"
                  onChange={(value) => {
                    const type = Number(value);
                    const department = depart.filter(item => item.type === type);
                    setFieldsValue({
                      depId: '',
                    });
                    this.setState({
                      depSome: department,
                      isDepart: true,
                    })
                  }}
                />)}
              </FormItem>
            </Col>
            { isDepart&&
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="部门">
                {getFieldDecorator('depId', {
                  initialValue: detail.depId || '',
                })(<AdvancedSelect
                  placeholder='请选择部门'
                  dataSource={depSome}
                  type='DEP_FUZZYSEARCH'   // 使用模糊查询
                  onChange={() => {}}
                />)}
              </FormItem>
            </Col>
            }
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="评价形式">
                {getFieldDecorator('processType', {
                  initialValue: detail.processType?String(detail.processType): '',
                  rules: [
                    {
                      required: true,
                      message: '评价形式为必填项',
                    },
                  ],
                })(<AdvancedSelect
                  dataSource={utils.getDictByType(gDictData,'processType')}
                  fieldConfig={SelectFieldConfig.userSearchFiledConfig}
                  searchType="DATADICT"
                  onChange={(value) => {
                    this.setPassedType(value)
                    this.setState({
                      isScore: this.canUseScore(value),
                      isOrganization: this.canUseOrganization(value),
                    })
                  }}
                  placeholder='请选择评价形式'
                />)}
              </FormItem>
            </Col>
            { !passType && isOrganization &&
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="通过个数">
                {getFieldDecorator('passedProcessCount', {
                  initialValue: detail.passedProcessCount || '1',
                  rules: [
                    {
                      required: true,
                      message: '通过个数为必填项',
                    },
                  ],
                })(<InputNumber style={{width: '100%'}} placeholder='请填写通过个数' min={0} max={1000} />)}
              </FormItem>
            </Col>
            }
            { isScore&&
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label={isOrganization&&isScore?"单个通过分数":"通过分数"}>
                {getFieldDecorator('passScore', {
                  initialValue: detail.passScore || '60',
                  rules: [
                    {
                      required: true,
                      message: '通过分数为必填项',
                    },
                  ],
                })(<InputNumber style={{width: '100%'}} placeholder='请填写通过分数' min={0} max={200} />)}
              </FormItem>
            </Col>
            }
            { isScore && isOrganization &&
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="阶段通过分数">
                {getFieldDecorator('passedProcessScore', {
                  initialValue: detail.passedProcessScore || '60',
                  rules: [
                    {
                      required: true,
                      message: '通过分数为必填项',
                    },
                  ],
                })(<InputNumber style={{width: '100%'}} placeholder='请填写通过分数' min={0} max={200} />)}
              </FormItem>
            </Col>
            }
            { isScore&&
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="评分规则">
                {getFieldDecorator('scoreRuleId', {
                  initialValue: detail.scoreRuleId || '',
                  rules: [
                    {
                      required: true,
                      message: '评分规则为必填项',
                    },
                  ],
                })(<AdvancedSelect
                  placeholder='请选择评分规则'
                  dataSource={scoreRuleList}
                  fieldConfig={SelectFieldConfig.scoreRuleConfigForDic}
                  onChange={() => {}}
                />)}
              </FormItem>
            </Col>
            }
          </Row>
          <Row type="flex" justify="center">
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="始终通过">
                {getFieldDecorator('autoPass', {
                  initialValue: String(detail.autoPass)==='undefined'?'':String(detail.autoPass),
                  rules: [
                    {
                      message: '请选择是否始终通过！',
                      required:true,
                      whitespace: true,
                    }
                  ],
                })(<AdvancedSelect placeholder="是否选择始终通过" dataSource={this.allowAlwaysPass} fieldConfig={SelectFieldConfig.allowAlwaysPass} onChange={()=>{}} />)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={20}>
              <FormItem {...GuideFlowDetailItem} label="备注">
                {getFieldDecorator('memo', {
                  initialValue: detail.memo || '',
                  rules: [
                    {
                      message: '请输入有效字符,长度不得大于255个字符！',
                      whitespace: true,
                      max:255
                    }
                  ],
                })(<TextArea placeholder="请输入备注" autosize={{minRows:4,maxRows:8}} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Row type="flex" justify="center">
          <Button type="primary" onClick={this.handleSubmit} htmlType='submit'>
            保存
          </Button>
          <Button style={{marginLeft: 8}} onClick={this.handleCancel} htmlType='button'>
            取消
          </Button>
        </Row>
      </Card>
    )
  }
}

export default GuideFlowDetail;
