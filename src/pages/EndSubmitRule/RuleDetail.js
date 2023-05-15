import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  Card,
  Select,
} from 'antd';
import {weightRegular} from '../../utils/regular';
import {WEIGHT_RANGE,DEFAULT_WEIGHT} from '../../utils/Enum';
import { submitFormLayout, entireLine,lineItem } from '../../utils/globalUIConfig';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ endSubmitRuleModel, loading }) => ({
  endSubmitRuleModel,
  loading: loading.models.endSubmitRuleModel,
  loadingAdd: loading.effects['endSubmitRuleModel/addRule'],
  loadingUpdate: loading.effects['endSubmitRuleModel/editRule'],
  loadingGet: loading.effects['endSubmitRuleModel/getItem'],
}))
@Form.create()
class RuleDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVeto: false,
    };
  }

  componentDidMount() {
    const { getItem, id, drawerStatus } = this.props;
    if(drawerStatus !== 2){
      return
    }
    getItem(id); // 通过规则名查找 以前是通过id
  }

  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
      endSubmitRuleModel: { itemSelect },
      dispatch, drawerStatus, onClose, id ,rootRuleId } = this.props;
    let data;
    validateFieldsAndScroll((err, value) =>{
      if(err){
        return
      }
      if(drawerStatus === 2) {
        data = {
          ...value,
          ruleId: itemSelect.ruleId,
          parentId: itemSelect.parentId
        };
        dispatch({
          type: 'endSubmitRuleModel/editRule',
          payload: data,
        });
      }
      else {
        if(drawerStatus === 1) {
          data = {
            ...value,
            parentId: 0,
            rootRuleId:0,
          };
        } else {
          data = {
            ...value,
            parentId: id,
            rootRuleId,
          };
        }
        dispatch({
          type: 'endSubmitRuleModel/addRule',
          payload: data,
        })
      }
      onClose();
    })
  };

  findNode = (node, id, callback) => {
    node.forEach((item) => {
      if(item.id === id) {
        callback(item)
      }
      this.findNode(item.children, id, callback);
    })
  };

  render() {
    const {
      loadingAdd,
      loadingUpdate,
      loadingGet,
      onClose,
      drawerStatus,
      form : { getFieldDecorator },
      endSubmitRuleModel: { itemSelect },
      parentNameAdd,
      fullMarkAdd,
      itemTree = [{}],
    } = this.props;
    const { isVeto } = this.state;
    const submit = itemSelect.submit?'true':'false';
    let isEdit = false;
    let { parentId: newParent } = itemSelect;
    let fullMark = 100;
    switch (drawerStatus) {
      case 1:
        newParent = '';
        break;
      case 2:
        isEdit = true;
        this.findNode(itemTree,itemSelect.parentId,({ruleName, fullMarks})=>{
          newParent = ruleName;
          fullMark = fullMarks;
        });
        break;
      case 3:
        newParent = parentNameAdd;
        fullMark = fullMarkAdd;
        break;
      default: break;
    }
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop : 8 }}>
          <Row type="flex">
            <Col span={24}>
              <FormItem {...entireLine} label="规则名称">
                {getFieldDecorator('ruleName', {
                  initialValue: isEdit?itemSelect.ruleName:'',
                  rules: [{
                    required : true,
                    whitespace: true,
                    message: '填写规则名称',
                    min: 1,
                  }],
                })(<Input placeholder='规则名称' />)}
              </FormItem>
            </Col>
            {/* <Col span={24}>
              <FormItem {...entireLine} label="规则简介">
                {getFieldDecorator('ruleBrief', {
                  initialValue : isEdit?itemSelect.ruleBrief:'',
                  rules: [{
                    required : true,
                    whitespace: true,
                    message: '填写规则简介（不超过100字）',
                    max: 100,
                    min: 1,
                  }],
                })(<Input placeholder='规则简介（100字以下）' />)}
              </FormItem>
            </Col> */}
            {/* <Col span={12}>
              <FormItem {...lineItem} label="规则类型">
                {getFieldDecorator('type', {
                  // initialValue : '',
                  rules : [
                    {
                      message: '请选择部门类型',
                      required : true,
                    },
                  ],
                })(
                  <Select placeholder='请选择规则类型'>
                    {
                      rule_type.map((value)=>{
                        return (
                          <Option key={value.key} value={parseInt(value.value)}>{value.text}</Option>
                        )
                      })
                    }
                  </Select>)}
              </FormItem> 
            </Col> */}
            <Col span={12}>
              <FormItem {...lineItem} label="上级规则">
                {getFieldDecorator('parentId', {
                  initialValue : newParent || '',
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="一票否决">
                {getFieldDecorator('veto', {
                  initialValue : isEdit?itemSelect.veto:0,
                  rules : [
                    {
                      message: '请选择是否可以一票否决',
                      required : true,
                    },
                  ],
                })(
                  <Select onChange={(value) => {
                    if(value) {
                      this.setState({
                        isVeto: true,
                      })
                    }
                  }}
                  >
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="满分">
                {getFieldDecorator('fullMarks', {
                  initialValue : isEdit?itemSelect.fullMarks:undefined,
                  rules : [
                    {
                      message: '请填写满分值(必须是数字！)',
                      required : true,
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} min={0} max={isVeto?0:fullMark} placeholder={`满分（必须是0-${isVeto?0:fullMark}的数字；可为小数）`} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="是否提交材料">
                {getFieldDecorator('submit', {
                  initialValue : isEdit?submit:'true',
                  rules : [
                    {
                      message: '请选择是否提交材料',
                      required : true,
                    },
                  ],
                })(
                  <Select>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>)}
              </FormItem>
            </Col>
          
            <Col span={12}>
              <FormItem {...lineItem} label="权重">
                {getFieldDecorator('sort', {
                  initialValue : isEdit?itemSelect.sort:DEFAULT_WEIGHT,
                  rules : [
                    {
                      message: weightRegular.msg,
                      required : true,
                      pattern:weightRegular.reg,
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} min={WEIGHT_RANGE.MIN} max={WEIGHT_RANGE.MAX} placeholder={`权重（必须是${WEIGHT_RANGE.MIN}-${WEIGHT_RANGE.MAX}的整数）`} />)}
              </FormItem>
            </Col>
            {/* <Col span={24}>
              <FormItem {...entireLine} label="规则描述">
                {getFieldDecorator('description', {
                  initialValue : isEdit?itemSelect.description:'',
                  rules: [{
                    required : true,
                    whitespace: true,
                    message: '填写规则描述（不超过800字）',
                    max: 800,
                    min: 1,
                  }],
                })(<TextArea autosize={{minRows: 5,maxRows: 10}} placeholder='规则描述（800字以下）' />)}
              </FormItem>
            </Col> */}
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop : 32 }}>
            <Button type="primary" onClick={this.handleSubmit} loading={loadingAdd||loadingUpdate}>
              保存
            </Button>
            <Button style={{ marginLeft : 8 }} onClick={onClose}>
              取消
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default RuleDetail;
