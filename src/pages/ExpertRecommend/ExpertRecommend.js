import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Card,
  Modal,
} from 'antd';
import AdvancedSelect from '@/components/AdvancedSelect';
import {submitFormLayout, formItemLayout} from '../../utils/globalUIConfig';
import * as utils from '../../utils/utils';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';

const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;

@connect(({ expertRecommend }) => ({
  expertRecommend,
}))
@Form.create()
class ExpertRecommend extends PureComponent {
  componentDidMount() {
    const {
      ProjectSelectedRows,
      dispatch,
      processId
    } = this.props;
    dispatch({
      type: 'expertRecommend/getDetail',
      payload: {
        projectId:ProjectSelectedRows[0].projectId,
        processId:Number(processId)
      },
    })
  }

  handleSave = () => {
    const {
      ProjectSelectedRows,
      dispatch,
      onClose,
      processId,
      form: { validateFieldsAndScroll }
    } = this.props;
    validateFieldsAndScroll((err, value) =>{
      if(err){
        return
      }
      value['state']=Number(value['state']);
      dispatch({
        type: 'expertRecommend/setDistribution',
        payload: {
          ...value,
          projectId:ProjectSelectedRows[0].projectId,
          processId
        },
      })
      onClose();
    });
  };

  handleSubmit = () => {
    const {
      ProjectSelectedRows,
      dispatch,
      processId,
      guideId,
      onClose
    } = this.props;
    confirm({
      content: '确定要正式推荐吗？',
      okText: '推荐',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'expertRecommend/submitDistribution',
          payload: {
            submitData:{
              projectId:ProjectSelectedRows[0].projectId,
              processId,
            },
            projectFetch:{
              guideId,
              processId
            }// 正式提交之后的刷新
          },
        })
        onClose()
      }
    });

  };

  render() {
    const { onClose, fetchLoading, gDictData, expertRecommend: { distributionDataDetail } } = this.props;
    const {
      form : { getFieldDecorator },
    } = this.props;
    const {expertRecommend:{hanReason}}=this.props;
    return (
      <Card bordered={false}>
        <Form style={{ marginTop : 8 }}>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label="是否推荐">
                {getFieldDecorator('state', {
                  initialValue: distributionDataDetail.state!==undefined?String(distributionDataDetail.state):'',
                  rules : [
                    {
                      required : true,
                      message : '请选择是否推荐',
                    },
                  ],
                })(
                  <AdvancedSelect
                    placeholder='请选择是否推荐'
                    dataSource={utils.getDictByType(gDictData,'recommend')}
                    fieldConfig={SelectFieldConfig.userSearchFiledConfig}
                    searchType="FUZZYSEARCH"
                    onChange={() => {}}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="推荐理由">
                {getFieldDecorator('reason', {
                  initialValue: distributionDataDetail.reason || '',
                  rules : [
                    {
                      required : true,
                      message : '请输入推荐理由',
                    },
                  ],
                })(<TextArea autosize={{minRows: 5,maxRows: 10}} placeholder='请填写推荐理由' />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop : 32 }}>
            <Button type="primary" onClick={this.handleSave} loading={fetchLoading} htmlType='button'>
              保存
            </Button>
            <Button style={{ marginLeft : 8 }} onClick={onClose} htmlType='button'>
              取消
            </Button>
            {hanReason?<Button style={{ marginLeft : 8 }} onClick={this.handleSubmit} htmlType='button'>正式推荐</Button>:''}
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default ExpertRecommend;
