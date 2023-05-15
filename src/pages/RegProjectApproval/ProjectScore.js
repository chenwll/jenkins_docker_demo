import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  Card,
  InputNumber,
  Tooltip,
  Popconfirm,
  message,
} from 'antd';
import router from 'umi/router';
import * as utils from '../../utils/utils';
import FooterToolbar from '@/components/FooterToolbar';
import styles from '../../utils/styles/TableStyle.less';

const title = ['正高级','副高级','中级'];

@connect(({ regProjectApprovalModal,basicdata,loading }) => ({
  regProjectApprovalModal,
  basicdata,
  loading: loading.models.regProjectApprovalModal,
}))
@Form.create()
class ProjectScore extends PureComponent {
  state = {
    editingKey: '',
    inputNumberValue: 0,
  };

  columns = [
    {
      title:'规则名称',
      dataIndex:'ruleName',
      key:'ruleName',
      width: '20%',
      editable: false,
      render: (record = "") => {
        let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
        if (data.length > 8) {
          data = data.substring(0, 7);
          data += "......"
        }
        return (
          <Tooltip
            title={record}
            mouseEnterDelay={0.2}
            placement='left'
          >
            <span>{data}</span>
          </Tooltip>
        )
      },
    },
    {
      title : '规则描述',
      dataIndex : 'discription',
      key : 'discription',
      width: '20%',
      editable: false,
      render: (record = "") => {
        let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
        if (data.length > 8) {
          data = data.substring(0, 7);
          data += "......"
        }
        return (
          <Tooltip
            title={record}
            mouseEnterDelay={0.2}
            placement='left'
          >
            <span>{data}</span>
          </Tooltip>
        )
      },
    },
    {
      title : '满分',
      dataIndex : 'fullMarks',
      key : 'fullMarks',
      editable: false,
      width: '10%'
    },
    {
      title : '评分',
      dataIndex : 'score',
      key : 'score',
      editable: true,
      width: '18%',
      render: (text, record) => {
        const editable = this.isEditing(record.psId);
        return (
          <div>
            {editable ? (
              <Popconfirm
                title="确定保存吗？"
                onCancel={() => this.cancel(record.psId)}
                onConfirm={() => this.save(record.psId)}
              >
                <InputNumber
                  step={0.1}
                  min={0}
                  max={record.fullMarks}
                  autoFocus
                  placeholder='请输入评分'
                  style={{width: '100%'}}
                  formatter={this.limitDecimals}
                  parser={this.limitDecimals}
                  onChange={this.handleInputNumber}
                />
              </Popconfirm>
            ) : (
              <a onClick={() => this.edit(record.psId,record.score)}>{text||'0'}</a>
            )}
          </div>
        );
      },
    },
  ];

  componentWillMount() {
    const { match: { url }, dispatch } = this.props;
    if(url&&url.search('/edu/')!==-1) {
      dispatch({
        type: 'regProjectApprovalModal/save',
        payload: {
          urlWay: '/projectEducation/edu',
          APIType: 'edu'
        }
      });
    } else {
      dispatch({
        type: 'regProjectApprovalModal/save',
        payload: {
          urlWay: '/AreaDepartmentSetting/regProjectApproval',
          APIType: 'reg'
        }
      })
    }
  }

  componentDidMount() {
    const { match:{ params:{ projectId, processId } }, dispatch } = this.props;
    dispatch({
      type: 'regProjectApprovalModal/getProjectContext',
      payload: {
        projectId,
      }
    });
    dispatch({
      type: 'regProjectApprovalModal/getAllDepart',
    });
    dispatch({
      type: 'regProjectApprovalModal/getAllGuide',
    });
    dispatch({
      type: 'regProjectApprovalModal/getScore',
      payload: {
        projectId,
        processId,
      }
    })
  }

  handleSubmit = () => {
    // confirm({
    //   content: '确定要吗？',
    //   okText: '推荐',
    //   cancelText: '取消',
    //   onOk: () => {
    //     console.log('ok')
    //   }
    // });
  };

  handleSave = () => {
    const {
      regProjectApprovalModal: {
        scoreRule = {},
      },
      match:{ params:{ projectId, processId } },
      dispatch,
    } = this.props;
    const {prjScore = {}} = scoreRule;
    this.supplementScore([prjScore],'subScore');
    dispatch({
      type: 'regProjectApprovalModal/setScore',
      payload: {
        prjScore,
        score: prjScore.score|| '0',
        state: 0,
        projectId,
        processId,
      }
    })
  };

  handleBack = () => {
    const {
      regProjectApprovalModal :{ urlWay },
      match : { params }
    } = this.props;
    router.push({
      pathname: `${urlWay}/topicProjectList/${params.guideId}/${params.processId}/${params.processType}/${params.type}`,
      query: {prevent: true}
    });
  };

  handleInputNumber = (value) => {
    this.setState({
      inputNumberValue: value,
    })
  };

  exchangeCodeToString = (data, name, key, aimKey) => {
    if(data.length !== 0) {
      const [result] = data.filter(item => item[key] === aimKey);
      if(result) {
        return result[name];
      }
    }
    return '（未填写）'
  };

  isEditing = record => record === this.state.editingKey;

  cancel = () => {
    this.setState({
      editingKey: '',
      inputNumberValue: 0,
    });
  };

  supplementScore = (node,key) => {
    node.forEach((item) => {
      if(item.score === undefined) {
        item.score = 0;
      }
      if (item[key]) {
        this.supplementScore(item[key],key);
      }
    });
  };

  addAllScore = (node,key) => {
    node.forEach((item) => {
      if (item[key]) {
        this.addAllScore(item[key],key);
        item.score = item[key].reduce((num, i) => num + (i.score?i.score:0),0);
      }
    });
  };

  loop = (node,key,aimKey,aimKeyValue,call) => {
    node.forEach((item,index) => {
      if(item[aimKey] === aimKeyValue) {
        call(item,index);
      }
      if (item[key]) {
        this.loop(item[key],key,aimKey,aimKeyValue,call);
      }
    });
  };

  limitDecimals = value => {
    const reg = /^(\d+)\.(\d).*$/;
    if(typeof value === 'string') {
      // return !Number.isNaN(Number(value)) ? value.replace(reg, '$1.$2') : ''
      return value.replace(reg, '$1.$2')
    }
    if (typeof value === 'number') {
      return !Number.isNaN(value) ? String(value).replace(reg, '$1.$2') : ''
    }
    return ''
  };

  edit(key, score) {
    let canEdit = true;
    const {
      regProjectApprovalModal: {
        scoreRule = {},
      },
    } = this.props;
    const {prjScore} = scoreRule;
    const tableData = prjScore?[...[prjScore]]:[];
    this.loop(tableData,'subScore','psId',key,(item) => {
      if(item.subScore) {
        message.warning('当前级不能评分！');
        canEdit = false;
      }
    });
    if(!canEdit) {
      return
    }
    this.setState({
      editingKey: key,
      inputNumberValue: score,
    });
  }

  save(key) {
    const { inputNumberValue } = this.state;
    const {
      regProjectApprovalModal: {
        scoreRule = {},
      },
      dispatch,
    } = this.props;
    const {prjScore} = scoreRule;
    const tableData = prjScore?[...[prjScore]]:[];
    // 修改分数
    this.loop(tableData,'subScore','psId',key,(item) => {
      item.score = inputNumberValue;
    });
    // 叠加分数
    this.addAllScore(tableData,'subScore');
    const scoreRuleNew = {
      ...scoreRule,
      prjScore: tableData[0]
    };
    dispatch({
      type: 'regProjectApprovalModal/save',
      payload: {
        scoreRuleNew,
      }
    });
    this.cancel();
  }

  render() {
    const {
      loading,
      regProjectApprovalModal: {
        projectContextDetail: detail,
        departList,
        guideList,
        scoreRule = {},
      },
      basicdata:{ gDictData },
    } = this.props;
    const {prjScore = {}} = scoreRule;
    const tableData = prjScore?[prjScore]:[];
    return (
      <Card bordered={false}>
        <Row>
          <Col span={10}>
            <Card bordered={false} loading={loading}>
              <div className={styles.frame}>
                <div style={{ backgroundColor: '#f2f2f2' }}>
                  <div className={styles.Layout}>
                    <div className={styles.detail}>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>指南名称</Col>
                        <Col className={styles.Coleven} span={18}>{this.exchangeCodeToString(guideList,'guideName','guideId',detail.guideId)} </Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>学校类型</Col>
                        <Col className={styles.Coleven} span={6}>{utils.getAllDictNameById(gDictData,'schoolType',String(detail.schoolType)) || '（未填写）'}</Col>
                        <Col className={styles.Colodd} span={6}>部门</Col>
                        <Col className={styles.Coleven} span={6}>{this.exchangeCodeToString(departList,'depName','departmentId',detail.depId)}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>项目名称</Col>
                        <Col className={styles.Coleven} span={18}>{detail.projectName || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>项目负责人</Col>
                        <Col className={styles.Coleven} span={6}>{detail.prjOwner || '（未填写）'}</Col>
                        <Col className={styles.Colodd} span={6}>试点单位</Col>
                        <Col className={styles.Coleven} span={6}>{detail.pilotUnit || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>工作单位</Col>
                        <Col className={styles.Coleven} span={18}>{detail.workCompany  || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>行政职务</Col>
                        <Col className={styles.Coleven} span={6}>{detail.duties   || '（未填写）'}</Col>
                        <Col className={styles.Colodd} span={6}> 职称</Col>
                        <Col className={styles.Coleven} span={6}>{title[detail.title]  || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>项目开始时间</Col>
                        <Col className={styles.Coleven} span={18}>{detail.prjCreateTime    || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}> 项目结束时间</Col>
                        <Col className={styles.Coleven} span={18}>{detail.prjEndTime   || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>电子邮箱</Col>
                        <Col className={styles.Coleven} span={18}>{detail.email || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>邮政编码</Col>
                        <Col className={styles.Coleven} span={18}>{detail.postalCode || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>联系电话</Col>
                        <Col className={styles.Coleven} span={18}>{detail.phone  || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row}>
                        <Col className={styles.Colodd} span={6}>公司电话</Col>
                        <Col className={styles.Coleven} span={18}>{detail.companyTel  || '（未填写）'}</Col>
                      </Row>
                      <Row className={styles.Row} style={{margin: '10px'}}>
                        <Col className={styles.Colodd} span={24}>申报内容 </Col>
                      </Row>
                      <div dangerouslySetInnerHTML={{__html:detail.context  || '（未填写）'}} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={13}>
            <span style={{padding: '20px'}}>操作提示： 双击或点击分数编辑，点击其他列可以保存</span>
            <Row style={{marginTop: '1%'}}>
              <Table
                childrenColumnName='subScore'
                loading={loading}
                dataSource={tableData}
                pagination={false}
                columns={this.columns}
                rowKey={record => record.psId}
                onRow={(record) => ({
                  onDoubleClick: () => {
                    this.edit(record.psId,record.score)
                  },
                  onClick: () => {
                    const { editingKey } = this.state;
                    if(editingKey !== '' && record.psId !== editingKey) {
                      this.save(editingKey)
                    }
                  }
                })}
              />
            </Row>
          </Col>
        </Row>
        <FooterToolbar>
          <Button type="primary" onClick={this.handleSave} htmlType='button'>
            保存
          </Button>
          <Button style={{ marginLeft : 8 }} onClick={this.handleBack} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default ProjectScore;
