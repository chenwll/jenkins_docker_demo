import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  Input,
  Modal,
  Select,
  Descriptions,
} from 'antd';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import 'braft-editor/dist/index.css';
import SelectDepartmentDetails from '@/pages/Guide/GuideStep/SelectDepartmentDetails';

@Form.create()
@connect(({ guideModal, basicdata, loading }) => ({
  guideModal,
  basicdata,
  loadingUpdate: loading.effects['guideModal/editGuide'],
  loadingGet: loading.effects['guideModal/getGuide'],
  loadingAdd: loading.effects['guideModal/addGuide'],
}))

class GuideThirdStep extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectDepartmentDetailsList: [],
    };
  }

  componentDidMount() {
    const { dispatch, guideModal: { selectedRows, rootRuleId } } = this.props;
    dispatch({
      type: 'guideModal/save',
      payload: { taskCommits: {} },
    });
    dispatch({
      type: 'guideModal/getEvaluationDept',
      payload: { ruleId: selectedRows.id, rootRuleId },
      callback: (response) => {
        response.forEach(item => {
          this.addSelectDepartmentDetail(item);
        });
      },
    });
  }

  back = () => {
    router.push('/Guide/GuideStep/Step2');
  };

  // eslint-disable-next-line react/sort-comp
  creatSelectTree(data) {
    // eslint-disable-next-line no-restricted-syntax
    for (const i of data) {
      i.value = i.name;
      i.title = i.name;
      i.key = i.id;
      if (i.children && i.children.length > 0) {
        this.creatSelectTree(i.children);
      } else {
        delete i.children;
      }
    }
  }

  addSelectDepartmentDetail = (props) => {
    const { selectDepartmentDetailsList } = this.state;
    selectDepartmentDetailsList.push(<SelectDepartmentDetails {...props} />);
    this.setState({ selectDepartmentDetailsList: [...selectDepartmentDetailsList] });
  };

  render() {

    const { selectDepartmentDetailsList } = this.state;
    const { guideModal: { selectedRows } } = this.props;


    return (
      <Fragment>
        <Descriptions title='具体信息' bordered size="middle">
          <Descriptions.Item label='指标名称'>{selectedRows.name}</Descriptions.Item>
          <Descriptions.Item label='评测内容'>{selectedRows.content}</Descriptions.Item>
          <Descriptions.Item label='评测标准'>{selectedRows.standard}</Descriptions.Item>
          <Descriptions.Item label='网上申报具体要求'>{selectedRows.specification}</Descriptions.Item>
        </Descriptions>
        {selectDepartmentDetailsList}
        {/* <Row type='flex' justify='center' */}
        {/*     style={{ marginTop: '3vh', padding: '1vh 0', backgroundColor: 'rgb(250,250,250)' }}> */}
        {/*  <Col> */}
        {/*    <Button type='primary' onClick={this.addSelectDepartmentDetail}>添加部门</Button> */}
        {/*  </Col> */}
        {/* </Row> */}
        <FooterToolbar style={{ width: '100%' }}>
          <Button style={{ marginLeft: 8 }} onClick={this.back}>
            返回
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default GuideThirdStep;
