import React, {PureComponent, Fragment} from 'react';
import {Card, Steps} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const {Step} = Steps;
export default class ProjectScoreStepForm extends PureComponent {
  getCurrentStep() {
    const {location} = this.props;
    const {pathname} = location;
    const pathList = pathname.split('/');
    const pathSymbol = pathList[pathList.length - 7];
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

  render() {
    const {location, children} = this.props;
    return (
      <PageHeaderWrapper
        title="专家评分"
        tabActiveKey={location.pathname}
        content="请根据提示依次填写信息"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="项目任务书" />
              <Step title="项目评分" />
              <Step title="项目评审意见" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
