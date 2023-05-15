import React, {PureComponent, Fragment} from 'react';
import {Card, Col, Descriptions, Form, Input, Row, Steps} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { entireLine, lineItem } from '@/utils/globalUIConfig';
import { connect } from 'dva';
import user from '@/models/user';

const {Step} = Steps;
const FormItem = Form.Item
@Form.create()
@connect(({guideModal, basicdata, personalProjectModal,user}) => ({
  guideModal,
  basicdata,
  user,
  personalProjectModal,
}))

export default class ProjectStepForm extends PureComponent {
  componentDidMount(){
    const {user: { userData }, dispatch, personalProjectModal:{ currentRuleId } } = this.props
  }
  getCurrentStep() {
    const {location} = this.props;
    const {pathname} = location;
    const pathList = pathname.split('/');
    let pathSymbol = pathList[pathList.length - 1];
    switch (pathSymbol) {
      case 'step1':
        return 0;
      case 'step2':
        return 1;
      case 'step3':
        return 2;
      default:
        return 0;
    }
  }

  getDescription = () => {
    const {
      user: { sysUser = {} },
      personalProjectModal:{
        currentGuide:{ guideName = ''}, 
        currentRule:{ ruleLevel1Name = '' }
      }} = this.props
    const {nickname = '', phone = ''} = sysUser
    const userMess = nickname + ' ' + phone
    const step = this.getCurrentStep()
    switch (step) {
      case 0:
        return (
          <Fragment>
            <Descriptions.Item label="申报项目">{guideName}</Descriptions.Item>
            <Descriptions.Item label="申报人">{userMess}</Descriptions.Item>
          </Fragment>
        )
      case 1:
        return (
          <Fragment>
            <Descriptions.Item label="申报项目">{guideName}</Descriptions.Item>
            <Descriptions.Item label="申报人">{userMess}</Descriptions.Item>
            <Descriptions.Item label="当前指标">{ruleLevel1Name}</Descriptions.Item>
          </Fragment>
        )
      case 2:
        return (
            <Fragment>
              <Descriptions.Item label="申报项目">{guideName}</Descriptions.Item>
              <Descriptions.Item label="申报人">{userMess}</Descriptions.Item>
              <Descriptions.Item label="当前指标">{ruleLevel1Name}</Descriptions.Item>
            </Fragment>
          )
      default:
        return (
          <Fragment>
            <Descriptions.Item label="申报项目">{guideName}</Descriptions.Item>
            <Descriptions.Item label="申报人">{userMess}</Descriptions.Item>
          </Fragment>
        )
    }        
  }
  render() {
    const {location, children,form:{getFieldDecorator }} = this.props;
    const content = (
      <Descriptions>
        {this.getDescription()}
      </Descriptions>
    )
    return (
      <PageHeaderWrapper
        title='申报填写'
        tabActiveKey={location.pathname}
        content={content}
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="申报项选择"/>
              <Step title="提交报送材料"/>
              <Step title="确认提交"/>
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
