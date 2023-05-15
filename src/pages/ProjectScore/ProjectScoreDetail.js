import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Modal,
  Button,
  Row,
  Icon,
  Col,
  InputNumber, List,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from "../../utils/styles/TableStyle.less";
import { groupItem } from '../../utils/globalUIConfig';
import {PROJECTSCORE_DEP_OR_EXP} from '../../utils/Enum'

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');

const { confirm } = Modal;
// const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({ projectScoreModel, loading }) => ({
  projectScoreModel,
  loading: loading.models.projectScoreModel,
}))
@Form.create()
class ProjectScoreDetail extends PureComponent {
  state = {

  };

  allowAlwaysPass=[{
    value:'false',
    text:'否',
    k:false
  },{
    value:'true',
    text:'是',
    k:true
  }];

  componentDidMount() {
    const { projectScoreModel: { ruleList } } = this.props;
    if(ruleList.length === 0) {
      this.back();
    }
  }

  handelCancel=()=>{
    const { match : { params } } = this.props;
    let path = `/expertApproval/declaration/rule`;
    if(params.type == PROJECTSCORE_DEP_OR_EXP.DEP) {
      path = `/educationDepartmentSetting/departmentScore/rule`
    }
    confirm({
      title: '确定返回吗（不保存所有而退出）',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        router.push({
          pathname: `${path}/${params.type}/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}`,
          query: { prevent: true },
        });
      }
    })
  };

  findCurrent = (ruleList, id) => ruleList.filter((item)=> item.ruleId === id)[0];

  handleSave = (key) => {
    const { form } = this.props;
    const { match : { params } } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          projectScoreModel: {
            ruleTree = {},
          },
          dispatch,
        } = this.props;
        this.loopSetScore([ruleTree],'subScore','ruleId',key,(item) => {
          item.score = Number(values.score);
          // item.description = values.description;
        });
        this.addAllScore([ruleTree],'subScore');
        const ruleList = [];
        this.changeArrToList([ruleTree], ruleList, 'subScore')
        const data = {
          prjScore: ruleTree, // 不传后端，自用
          prjScoreList: ruleList,
          state: 0, // 0不提交，1提交
          score: ruleTree.score || 0,
          projectId: params.projectId,
          scoreId: params.scoreId,
          reviewYear: params.reviewYear,
          processId: params.processId,
          type: params.type,
        };
        dispatch({
          type: 'projectScoreModel/saveScore',
          payload: data,
          callback:(res)=> {
            if(Number(res.code) ===0){
              this.handelChange(-1);
            }
          }
        })
      }
    });
  };

  loopSetScore = (node,key,aimKey,aimKeyValue,call) => {
    node.forEach((item,index) => {
      if(item[aimKey] === aimKeyValue) {
        call(item,index);
      }
      if (item[key]) {
        this.loopSetScore(item[key],key,aimKey,aimKeyValue,call);
      }
    });
  };

  changeArrToList = (node, arr, key) => {
    node.forEach((item) => {
      if(item.veto != '1') {
        arr.push(item);
      }
      if (item[key] && item[key].length !== 0) {
        this.changeArrToList(item[key], arr);
      }
    });
  };

  addAllScore = (node,key) => {
    node.forEach((item) => {
      if(!item.score) {
        item.score = 0;
      }
      if (item[key]) {
        if(item[key].length === 0) {
          return
        }
        this.addAllScore(item[key],key);
        item.score = item[key].reduce((num, i) => num + (i.score?i.score:0),0);
      }
    });
  };

  handelChange = (next) => {
    const { form ,match : { params } } = this.props;
    const { projectScoreModel: { ruleList = [] } } = this.props;
    const index = ruleList.findIndex((p)=>p.ruleId == params.ruleId) - next;
    let path = `/expertApproval/declaration/submit`;
    if(params.type == PROJECTSCORE_DEP_OR_EXP.DEP) {
      path = `/educationDepartmentSetting/departmentScore/submit`
    }
    if(index>=0&&index<ruleList.length) {
      // confirm({
      //   title: '确定跳转吗（请注意保存）',
      //   okText: '确定',
      //   cancelText: '取消',
      //   onOk: () => {
      form.resetFields();
      router.push({
        pathname: `${path}/${params.type}/${params.projectId}/${params.scoreId}/${ruleList[index].ruleId}/${params.reviewYear}/${params.processId}`,
        query: {prevent: true}
      });
      //   }
      // })
    }
    else {
      let returnPath = `/expertApproval/declaration/rule`;
      if(params.type == PROJECTSCORE_DEP_OR_EXP.DEP) {
        returnPath = `/educationDepartmentSetting/departmentScore/rule`
      }
      router.push({
        pathname: `${returnPath}/${params.type}/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}`,
        query: { prevent: true },
      });
    }
  };

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`endSubmitRuleModel/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };

  limitDecimals = value => {
    const reg = /^(\d+)\.(\d).*$/;
    if(typeof value === 'string') {
      return value.replace(reg, '$1')
    }
    if (typeof value === 'number') {
      return !Number.isNaN(value) ? String(value).replace(reg, '$1') : ''
    }
    return ''
  };

  back() {
    const { match : { params } } = this.props;
    let path = `/expertApproval/declaration/rule`;
    if(params.type == PROJECTSCORE_DEP_OR_EXP.DEP) {
      path = `/educationDepartmentSetting/departmentScore/rule`
    }
    router.push({
      pathname: `${path}/${params.type}/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}`,
      query: { prevent: true },
    });
  }

  render() {
    const { projectScoreModel: { ruleList = [], ruleTree }, loading } = this.props;
    const { match : { params } } = this.props;
    const current = this.findCurrent(ruleList, Number(params.ruleId)) || {};
    const canEdit = !!current.subScore;
    const { form : { getFieldDecorator } } = this.props;
    return (
      <PageHeaderWrapper title="结项提交规则">
        <Card bordered={false}>
          <Col span={1} style={{marginTop: `${current.attFiles?'30%':'15%'}`}}>
            <Button style={{border: 'none'}} onClick={() => {this.handelChange(1)}}>
              <Icon type='caret-left' style={{fontSize: "30px"}} />
            </Button>
          </Col>
          <Col span={22}>
            <Card bordered={false}>
              <Row>
                <div className={styles.frame}>
                  <div style={{ backgroundColor: '#f2f2f2' }}>
                    <div className={styles.Layout} style={{height: '200px'}}>
                      <div className={styles.detail}>
                        <Row className={styles.Row}>
                          <Col className={styles.Colodd} span={6}>规则名称</Col>
                          <Col className={styles.Coleven} span={params.ruleId > 0?6:18}>{current.ruleName  || '（未填写）'}</Col>
                          {params.ruleId > 0 &&
                          <Fragment>
                            <Col className={styles.Colodd} span={6}>总分数</Col>
                            <Col className={styles.Coleven} span={6}>{current.fullMarks  || '0'}</Col>
                          </Fragment>
                          }
                        </Row>
                        <Row className={styles.Row}>
                          <Col className={styles.entireLine} span={24}>规则详情 </Col>
                          <p>{current.discription}</p>
                        </Row>
                      </div>
                      {current.attFiles &&
                      <div style={{marginTop: '13%'}}>
                        <List
                          itemLayout="horizontal"
                          header="附件列表"
                          bordered
                          dataSource={current.attFiles===null?[]:current.attFiles}
                          renderItem={(item) => (
                            <List.Item
                              key={item.id}
                              actions={[<a onClick={()=>{this.downLoadFile(item)}}>下载</a>]
                              }
                            >
                              <List.Item.Meta
                                className={styles.ListItem}
                                description={item.fileName}
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                      }
                    </div>
                  </div>
                </div>
              </Row>
              <Row style={{marginTop: `${current.attFiles?'35%':'5%'}`}}>
                <Col span={12} push={5}>
                  <FormItem {...groupItem} label="评分">
                    {getFieldDecorator('score', {
                      initialValue: current.score,
                      rules: [
                        {
                          required: true,
                          message: `该分数不能超过${current.fullMarks}`,
                        },
                      ],
                    })(<InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={Number(current.fullMarks)|| 100}
                      step={1}
                      formatter={this.limitDecimals}
                      parser={this.limitDecimals}
                      disabled={canEdit}
                    />)}
                  </FormItem>
                </Col>
                <Col span={12} push={6}>
                  <Button loading={loading} htmlType='button' type="primary" onClick={()=>this.handleSave(current.ruleId)} style={{marginRight: '1%'}}>保存</Button>
                  <Button htmlType='button' type="button" onClick={this.handelCancel}>返回</Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={1} style={{marginTop: `${current.attFiles?'30%':'15%'}`}}>
            <Button style={{border: 'none'}} onClick={() => {this.handelChange(-1)}}>
              <Icon type='caret-right' style={{fontSize: "30px"}} />
            </Button>
          </Col>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectScoreDetail;
