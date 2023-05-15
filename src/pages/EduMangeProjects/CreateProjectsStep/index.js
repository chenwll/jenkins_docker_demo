import React, {PureComponent, Fragment} from 'react';
import {Card, Steps} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const {Step} = Steps;
export default class index extends PureComponent {
  getCurrentStep() {
    const {location} = this.props;
    const {pathname} = location;
    const pathList = pathname.split('/');
    let pathSymbol = pathList[pathList.length - 2];
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
        title="申报书填写"
        tabActiveKey={location.pathname}
        content="请根据提示依次填写信息"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()}>
              <Step title="填写基本信息" />
              <Step title="填写试点方案" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
