import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const { Step } = Steps;
export default class ProjectGuideStepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    const pathSymbol = pathList[pathList.length - 1];
    console.log('GuideStep,index,pathList,pathSymbol', pathList, pathSymbol);
    switch (pathSymbol) {
      case 'Step1':
        return 0;
      case 'Step2':
        return 1;
      // 看到下面这一步不要疑惑，后面整理时会改！！！如果你看到了这一行，那证明我还没改！！！
      case 'Step3':
        return 1;
      case 'CommitSuccess':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper
        title='新增任务'
        tabActiveKey={location.pathname}
        content='请根据提示依次填写信息'
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title='基础信息' />
              <Step title='设置部门及任务' />
              <Step title='完成提交' />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
