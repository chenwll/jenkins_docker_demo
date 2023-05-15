import React, { PureComponent } from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Card,Form,Button,Col,Modal,Input, Checkbox} from 'antd';
import { entireLine } from '../../../utils/globalUIConfig';
import * as utils from '../../../utils/utils';
import FooterToolbar from '@/components/FooterToolbar';
import { RECOMMEND_STATE, RECOMMEND_TYPE } from '../../../utils/Enum';

const {TextArea} = Input;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
@Form.create()
@connect(({ prjScoreModel,basicdata,expertRecommend,loading}) => ({
  prjScoreModel,
  basicdata,
  expertRecommend,
  // loading:loading.models.prjScoreModel,
  saveLoading:loading.effects['prjScoreModel/saveScore']
}))

class ProjectScoreFlow3 extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      selectedRows : [],
      selectRow : {},
      visible : false,
    };
  }

  componentDidMount(){
    // const { dispatch,match:{params:{scoreId}} } = this.props;
    // let scoreTree;
    // const defaultSelect = JSON.parse(localStorage.getItem('selectRow')) || {};
    // if (defaultSelect.ruleId) {
    //   this.setState({
    //     selectRow : defaultSelect,
    //     selectedRows : [defaultSelect.ruleId],
    //   });
    // }
    // if (localStorage.scoreTree) {
    //   scoreTree = JSON.parse(localStorage.getItem('scoreTree'));
    // }
    // this.listPage(scoreTree);
    // dispatch({
    //   type : 'prjScoreModel/getAllDepart',
    // });

  }

  listPage =(scoreTree) =>{
    const { dispatch } = this.props;
    const { match : { params : { scoreId, type } } } = this.props;
    dispatch({
      type : 'prjScoreModel/getRule',
      payload : {
        scoreId,
        localData : scoreTree,
        type,
      },
    });
  };

  handleSave = () => {
    this.showModal();
  };


  // 保存评分
  handleOk=()=>{
    const that = this;
    const { prjScoreModel : { gradeSelect,saveState} } = this.props;
    const { dispatch,form } = this.props;
    const { match : { params } } = this.props;
    const { prjScoreModel : { ruleTree, ruleList, vetoList }} = this.props;
    const data ={
      prjScore: ruleTree, // 不传后端，自用
      prjScoreList: ruleList.concat(vetoList),
      state: 0, // 0不提交，1提交
      score: ruleTree.score,
      projectId: params.projectId,
      scoreId: params.scoreId,
      reviewYear: params.reviewYear,
      processId: params.processId,
      grade: gradeSelect[0],
      type: params.type,
    };
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
          if(String(saveState) === RECOMMEND_STATE[0].k)
          {
            data['saveState'] = RECOMMEND_STATE[1].k;
          }
          else{
            if(data.score>0){
              data['saveState'] = RECOMMEND_STATE[1].k;
            }else {
              data['saveState'] = saveState;
            }

          }
        dispatch({
          type : 'prjScoreModel/saveScore',
          payload :
            {
              ...data,
              ...values,
            },
          callback : (res) => {
            if (Number(res.code) === 0) {
              that.setState({
                visible : false,
              });
            }
            dispatch({
              type: 'global/closeCurrentTab',
              payload: {
                tabName: '基础信息',
              },
            });
            if(params.recommendType===RECOMMEND_TYPE.CONCLUDE){
              router.push({pathname: `/expertApproval/projectApproval/concludeDistributionScore`, query: {prevent: true}});
              const {expertRecommend:{ConcludePagination}}=this.props;
              const date=new Date().getFullYear();
              dispatch({
                type:`expertRecommend/guideFetch`,
                payload:{
                   data:{guideStage: 2,reviewYear: date,
                     ...ConcludePagination},
                     type:RECOMMEND_TYPE.CONCLUDE
                  }
              })
            }else {
              router.push({pathname: `/expertApproval/declaration/distributionScore`, query: {prevent: true}});
             const {expertRecommend:{GuidePagination}}=this.props;
              dispatch({
                type:`expertRecommend/guideFetch`,
                payload:{data:{
                  guideStage: 2, ...GuidePagination
                },type:RECOMMEND_TYPE.TOPIC}
              })
            }
            },
        });

      }
    });
  };

  //  设置推荐或不推荐的回调
  setGrade = (val) => {
    const { prjScoreModel : { gradeSelect }, dispatch } = this.props;
    const [oldk] = gradeSelect;
    const arr = val.filter(item => item !== oldk);
    dispatch({
      type : 'prjScoreModel/update',
      payload : {
        gradeSelect : arr,
        gradeData:arr[0],
      },
    });
  };

  //  返回
  handleReturn =()=>{
    // const {dispatch} = this.props;
    // confirm({
    //   title : '请确认保存之后再返回！！',
    //   okText : '确定',
    //   cancelText : '取消',
    //   onOk : () => {
    //     dispatch({
    //       type: 'global/closeCurrentTab',
    //       payload: {
    //         tabName: '基础信息',
    //       },
    //     });
    //     router.push({pathname: `/expertApproval/declaration/distributionScore`, query: {prevent: true}});
    //   },
    // });
    const {match:{params}} = this.props;
    if(params.recommendType===RECOMMEND_TYPE.CONCLUDE){
      router.push({pathname: `/expertApproval/projectApproval/step2/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
    }else {
      router.push({pathname: `/expertApproval/declaration/step2/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
    }
   };

  showModal = () => {
    this.setState({
      visible : true,
    });
  };

  hideModal = () => {
    this.setState({
      visible : false,
    });
  };

  render(){
    const {visible} = this.state;
    const {prjScoreModel:{suggestion,gradeSelect,gradeData,projectName,ruleTree},saveLoading} = this.props;
    const { basicdata : { gDictData } } = this.props;
    const {form: {getFieldDecorator}} = this.props;
    const grade = utils.getDictByType(gDictData, 'scoreGrade');
    let txt;
    grade.forEach(item => {
      if (item.k === gradeData) {
        txt = item.val;
      }
    });
    const options = [];
    if (grade.length > 0) {
      grade.forEach(item => options.push({
        label : item.val,
        value : item.k,
      }));
    }

    const checkLength = (rule, value, callback) => {
      if (value.length > 400) {
        callback('评审意见长度不能超过400!');
      }
      else {
        callback();
      }
    };
    return(
      <Card bordered={false}>
        <span style={{ color : 'red',display:'inline' }}>*</span>入围状态：
        <CheckboxGroup
          options={options}
          value={gradeSelect}
          onChange={this.setGrade}
          style={{ marginBottom : '2%' }}
        />
        <Form style={{marginTop: 8}}>
          <Col span={24}>
            <FormItem {...entireLine} label="评审意见">
              {getFieldDecorator('suggestion', {
                initialValue: suggestion || '',
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入评审意见且少于400字',
                  },
                  {validator: checkLength}
                ],
              })(<TextArea placeholder="请输入评审意见且少于400字" rows={8} style={{width: "100%"}} />)}
            </FormItem>
          </Col>
        </Form>
        <Modal
          title="保存项汇总"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <p>项目名称： {projectName}</p>
          <p>入围状态： {txt}</p>
          <p>总 分： {ruleTree.score}</p>
        </Modal>
        <FooterToolbar>
          <Button type="primary" onClick={this.handleSave} loading={saveLoading}>
            保存
          </Button>
          <Button onClick={this.handleReturn}>
            上一步
          </Button>
        </FooterToolbar>
      </Card>

    )
  }
}

export default ProjectScoreFlow3
