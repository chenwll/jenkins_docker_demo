import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  Card, Select,
} from 'antd';
import { submitFormLayout, entireLine,lineItem } from '../../utils/globalUIConfig';
import { DEFAULT_WEIGHT, WEIGHT_RANGE } from '../../utils/Enum';
import { weightRegular } from '../../utils/regular';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ guideScoreModel, loading }) => ({
  guideScoreModel,
  loading: loading.models.guideScoreModel,
  loadingAdd: loading.effects['guideScoreModel/addRule'],
  loadingUpdate: loading.effects['guideScoreModel/editRule'],
  loadingGet: loading.effects['guideScoreModel/getItem'],
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
    const { getItem, selectRow, drawerStatus } = this.props;
    if(drawerStatus !== 2){
      return
    }
    getItem(selectRow.psId);
  }

  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
      guideScoreModel: { itemSelect },
      dispatch, drawerStatus, onClose, id, params, selectRow } = this.props;
    let data;
    validateFieldsAndScroll((err, value) =>{
      if(err){
        return
      }
      if(drawerStatus === 2) {
        data = {
          ...value,
          parentId: itemSelect.parentId,
          psId: itemSelect.psId,
          ruleId: selectRow.ruleId,
        };
        dispatch({
          type: 'guideScoreModel/editRule',
          payload: {
            params,
            data
          },
        });
      }
      else {
        if(drawerStatus === 1) {
          data = {
            ...value,
            parentId: 0,
          };
        } else {
          data = {
            ...value,
            parentId: id,
          };
        }
        dispatch({
          type: 'guideScoreModel/addRule',
          payload: data,
        })
      }
      onClose();
    })
  };

  findNode = (node, id, callback) => {
    node.forEach((item) => {
      if(item.psId === id) {
        callback(item)
      }
      this.findNode(item.child, id, callback);
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
      guideScoreModel: { itemSelect },
      selectRow,
      tree = [{}],
    } = this.props;
    const { isVeto } = this.state;
    let isEdit = false;
    let { parentId: newParent } = itemSelect;
    let fullMark = 100;
    switch (drawerStatus) {
      case 1:
        newParent = '';
        break;
      case 2:
        isEdit = true;
        this.findNode(tree,itemSelect.parentId,({ruleName, fullMarks})=>{
          newParent = ruleName;
          fullMark = fullMarks;
        });
        break;
      case 3:
        newParent = selectRow.ruleName;
        fullMark = selectRow.fullMarks;
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
                    message: '填写规则名称（不超过50字）',
                    whitespace: true,
                    max: 50,
                    min: 1,
                  }],
                })(<Input placeholder='规则名称（50字以下）' />)}
              </FormItem>
            </Col>
            <Col span={24}>
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
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="上级规则">
                {getFieldDecorator('parentId', {
                  initialValue : newParent || '',
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="满分">
                {getFieldDecorator('fullMarks', {
                  initialValue : isEdit?itemSelect.fullMarks:'',
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
              <FormItem {...lineItem} label="一票否决">
                {getFieldDecorator('veto', {
                  initialValue : isEdit?String(itemSelect.veto):'0',
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
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="0">否</Select.Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="是否提交材料">
                {getFieldDecorator('submit', {
                  initialValue : isEdit?itemSelect.submit:'true',
                })(
                  <Select>
                    <Select.Option value="true">是</Select.Option>
                    <Select.Option value="false">否</Select.Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="权重">
                {getFieldDecorator('weight', {
                  initialValue : isEdit?itemSelect.weight:DEFAULT_WEIGHT,
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
            <Col span={24}>
              <FormItem {...entireLine} label="规则描述">
                {getFieldDecorator('discription', {
                  initialValue : isEdit?itemSelect.discription:'',
                  rules: [{
                    required : true,
                    whitespace: true,
                    message: '填写规则描述（不超过800字）',
                    max: 800,
                    min: 1,
                  }],
                })(<TextArea autosize={{minRows: 5,maxRows: 10}} placeholder='规则描述（800字以下）' />)}
              </FormItem>
            </Col>
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
