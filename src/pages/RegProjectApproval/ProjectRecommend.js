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

@connect(({ regProjectApprovalModal }) => ({
  regProjectApprovalModal,
}))
@Form.create()
class ProjectRecommend extends PureComponent {
  componentDidMount() {
    const {
      projectId,
      processId,
      dispatch,
      reviewYear,
      refsId,
    } = this.props;
    dispatch({
      type: 'regProjectApprovalModal/recommendProjectGet',
      payload: {
        projectId,
        processId,
        reviewYear,
        refsId
      },
    })
  }

  handleSave = () => {
    const {
      projectId,
      processId,
      processType,
      dispatch,
      reviewYear,
      refsId,
      form: { validateFieldsAndScroll }
    } = this.props;
    validateFieldsAndScroll((err, value) =>{
      if(err){
        return
      }
      dispatch({
        type: 'regProjectApprovalModal/recommendProjectSet',
        payload: {
          ...value,
          projectId,
          processId,
          reviewYear,
          refId:refsId,
          refsType: processType,
        },
      })
    });
  };

  handleSubmit = () => {
    const {
      projectId,
      processId,
      recommendType,
      dispatch,
      onClose,
      reviewYear,
      refsId,
      page,
    } = this.props;
    confirm({
      content: '确定要提交吗？',
      okText: '提交',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'regProjectApprovalModal/recommendProjectSubmit',
          payload: {
            page,
            recommendType,
            submit: {
              processId,
              projectId,
              reviewYear,
              refId:refsId,
            },
          },
        });
        onClose();
      }
    });

  };

  render() {
    const { onClose, submitting, gDictData, regProjectApprovalModal: { recommendDetail = {} } } = this.props;
    const {
      form : { getFieldDecorator },
    } = this.props;
    return (
      <Card bordered={false}>
        <Form style={{ marginTop : 8 }}>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label="是否推荐">
                {getFieldDecorator('state', {
                  initialValue: recommendDetail.state!==undefined?String(recommendDetail.state):'',
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
              <FormItem {...formItemLayout} label="（不）推荐理由">
                {getFieldDecorator('reason', {
                  initialValue: recommendDetail.reason || '',
                  rules : [
                    {
                      required : true,
                      max: 120,
                      message : '请输入理由,例如优秀，良好，合格或不合格(不超过120字)',
                    },
                  ],
                })(<TextArea autosize={{minRows: 5,maxRows: 10}} placeholder='请输入理由,例如优秀，良好，合格或不合格(不超过120字)' />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop : 32 }}>
            <Button type="primary" onClick={this.handleSave} loading={submitting} htmlType='button'>
              保存
            </Button>
            <Button style={{ marginLeft : 8 }} onClick={onClose} htmlType='button'>
              取消
            </Button>
            {
              recommendDetail.state!==undefined&&Boolean(recommendDetail.reason)&&
              <Button style={{ marginLeft : 8 }} onClick={this.handleSubmit} htmlType='button'>
                正式提交
              </Button>
            }
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default ProjectRecommend;
