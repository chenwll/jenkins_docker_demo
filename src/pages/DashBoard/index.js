import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Empty,
  Spin,
  Form
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import { lineItem } from '../../utils/globalUIConfig';

const FormItem = Form.Item;
const guideProcessStage={
  shengbao:'1',
  liti:'2',
  jieti:'3'
};
const judgeSchoolType={
  gaoxiao:'1',
  feigaoxiao:'2',
};
@Form.create()
@connect(({ DashBoardModel, loading, basicdata }) => ({
  DashBoardModel,
  basicdata,
  loading,
  FetchLoading: loading.effects['DashBoardModel/getAllGuideList'],
  getStatisLoading: loading.effects['DashBoardModel/getStatis'],
}))

class DashBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // guideId:'',
      // showChartData:false,
      // detailChartData:[],
      initChart:true,// 首次加载页面时显示空状态
      canChooseShcoolType:false,// 要选中立题和结题阶段之后才能选择高校类型
      // reviewYear:0,//默认值
      // schoolType:'init',
      projectStage:'2',// guideProcessStage中的立题
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'DashBoardModel/getAllGuideList',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  listPage = (params) => {
    const { dispatch } = this.props;
    const { searchMoreParams } = this.state;
    let newParams = {};
    if (Object.prototype.hasOwnProperty.call(params,'refresh')) {// params.hasOwnProperty('refresh')
      newParams = {
        ...searchMoreParams,
        currentPage: 1,
        pageSize: 10,
      };
    }
    else {
      newParams = {
        ...searchMoreParams,
        ...params,
      };
    }
    dispatch({
      type: 'DashBoardModel/getAllGuideList',
      payload: newParams || {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  chooseGuideId=(value)=>{// 指南列表
    const {dispatch}=this.props;
    const {DashBoardModel:{allGuides}}=this.props;
    const {form:{setFieldsValue}} =this.props;
    setFieldsValue({
      processStage:undefined,
      SchoolType:undefined
    });// 清空流程阶段的数据
    this.setState({
      // showChartData:false,
      initChart:false,
      canChooseShcoolType:false
    })
    allGuides.forEach(item=>{
      if(item.guideId===value){
        dispatch({
          type:'DashBoardModel/getStatis',
          payload:{
            reviewYear:item.reviewYear,
            guideId:item.guideId
          }
        });
        dispatch({
          type:'DashBoardModel/getProcessAndSchoolStatis',// 根据高校和流程两组变量细分数据
          payload:{
            // type:0,
            guideId:item.guideId,
            reviewYear:item.reviewYear,
          }
        })
        // this.setState({
        //   reviewYear:item.reviewYear,
        //   guideId:item.guideId
        // });

      }
    })

  };

  chooseGuideStage=(values)=>{// 指南阶段
    const {DashBoardModel:{guideStatis}}=this.props;
    const chartData=[];
    const {form:{setFieldsValue}} =this.props;
    setFieldsValue({
      SchoolType:undefined
    });// 清空流程阶段的数据
    switch (values) {
      case guideProcessStage.shengbao:
        this.setState({
          canChooseShcoolType:false
        });
        chartData.push(
          {
            year:'初稿',
            nums:guideStatis.prjDraft
          },
          {
            year:'已提交',
            nums:guideStatis.prjCommit
          }
        );
        break;
      case guideProcessStage.liti:
        this.setState({
          canChooseShcoolType:true
        });
        chartData.push(
          {
            year:'立题审核中',
            nums:guideStatis.prjAuditing
          },
          {
            year:'立题成功',
            nums:guideStatis.prjFail
          },
          {
            year:'立题失败',
            nums:guideStatis.prjSuccess
          }
        )
        break;
      case guideProcessStage.jieti:
        this.setState({
          canChooseShcoolType:true
        });
        break;
      default:
        break;
    }
    this.setState({
      // showChartData:true,
      projectStage:values,// 项目查询所处阶段
      // detailChartData:chartData
    });
  };

  changeSchoolType=(value)=>{
    const {projectStage}=this.state;
    const chartData=[];
    let num=0;
    const {
      DashBoardModel: {
        statisForSchoolJudgeByProcess
      },
    } = this.props;
    if(projectStage===guideProcessStage.liti){
      switch (value) {
        case judgeSchoolType.gaoxiao:
          if(statisForSchoolJudgeByProcess.universityConcluStep){
            // statisForSchoolJudgeByProcess.universityConcluStep.forEach(item=>{
            //   num+=item.count
            // });
            num=statisForSchoolJudgeByProcess.universityConcluStep[0].count?statisForSchoolJudgeByProcess.universityConcluStep[0].count:0;
          }
          chartData.push(
            {
              year:'高校立题',
              nums:num
            });
          break;
        case judgeSchoolType.feigaoxiao:
          if(statisForSchoolJudgeByProcess.nonUniversityConcluStep){
            // statisForSchoolJudgeByProcess.nonUniversityConcluStep.forEach(item=>{
            //   console.log(num);
            //   num+=item.count
            // });
            num=statisForSchoolJudgeByProcess.nonUniversityConcluStep[0].count?statisForSchoolJudgeByProcess.nonUniversityConcluStep[0].count:0;
          }
          chartData.push(
            {
              year:'非高校立题',
              nums:num
            });
          break;
        default:
          break;
      }
    }
    else{
      switch (value) {
        case judgeSchoolType.gaoxiao:
          if(statisForSchoolJudgeByProcess.universityReviewStep){
            // statisForSchoolJudgeByProcess.universityReviewStep.forEach(item=>{
            //   num+=item.count
            // });
            num=statisForSchoolJudgeByProcess.universityReviewStep[0].count?statisForSchoolJudgeByProcess.universityReviewStep[0].count:0;
          }
          chartData.push(
            {
              year:'高校结题',
              nums:num
            });
          break;
        case judgeSchoolType.feigaoxiao:
          if(statisForSchoolJudgeByProcess.nonUniversityReviewStep){
            // statisForSchoolJudgeByProcess.nonUniversityReviewStep.forEach(item=>{
            //   console.log(num);
            //   num+=item.count
            // });
            num=statisForSchoolJudgeByProcess.nonUniversityReviewStep[0].count?statisForSchoolJudgeByProcess.nonUniversityReviewStep[0].count:0;
          }
          chartData.push(
            {
              year:'非高校结题',
              nums:num
            });
          break;
        default:
          break;
      }
    }
    // this.setState({
    //   detailChartData:chartData
    // });
  };

  processStage=[{
    k:'1',
    val:'申报阶段',
  },{
    k:'2',
    val:'立题阶段',
  },{
    k:'3',
    val:'结题阶段',
  }];

  schoolType=[{
    k:'1',
    val:'高校',
  },{
    k:'2',
    val:'非高校',
  }];

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const {
      initChart,
      canChooseShcoolType
    }=this.state;
    const {
      getStatisLoading,
      DashBoardModel: {
        allGuides,
        guideStatis,
      },
    } = this.props;

    // const guideStatisTotalShow=[
    //   {
    //     year:'项目总量',
    //     nums:guideStatis.prjDraft+guideStatis.prjCommit+guideStatis.prjAuditing+guideStatis.prjFail+guideStatis.prjSuccess
    //   },
    //   {
    //     year:'申报阶段',
    //     nums:guideStatis.prjDraft+guideStatis.prjCommit
    //   },
    //   {
    //     year:'立题阶段',
    //     nums:guideStatis.prjAuditing+guideStatis.prjFail+guideStatis.prjSuccess
    //   },
    //   {
    //     year:'结题阶段',
    //     nums:0//
    //   }
    // ]//指南各阶段数据统计总体展示

    const option = {
      color: ['#3398DB'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : ['项目总量', '申报阶段', '立题阶段', '结题阶段'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'直接访问',
          type:'bar',
          barWidth: '40%',
          data:[
            guideStatis.prjDraft+guideStatis.prjCommit+guideStatis.prjAuditing+guideStatis.prjFail+guideStatis.prjSuccess,
            guideStatis.prjDraft+guideStatis.prjCommit,
            guideStatis.prjAuditing+guideStatis.prjFail+guideStatis.prjSuccess,
            0]
        }
      ]
    };
    return (
      <>
        <Card>
          <Row>
            <Col span={8}>
              <FormItem {...lineItem} label="指南列表">
                {getFieldDecorator('guideId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择指南',
                    },
                  ],
                })
                (
                  <AdvancedSelect
                    style={{'width':'100%'}}
                    dataSource={allGuides}
                    onChange={(value)=>this.chooseGuideId(value)}
                    fieldConfig={SelectFieldConfig.dashBoardGuideList}
                  />
                )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...lineItem} label="指南阶段">
                {getFieldDecorator('processStage', {
                  rules: [
                    {
                      required: true,
                      message: '请选择指南阶段',
                    },
                  ],
                })
                (
                  <AdvancedSelect
                    disabled={initChart}
                    style={{'width':'100%'}}
                    dataSource={this.processStage}
                    onChange={(value)=>this.chooseGuideStage(value)}
                    fieldConfig={SelectFieldConfig.filedConfigForDic}
                  />
                )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...lineItem} label="学校类型">
                {getFieldDecorator('SchoolType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择学校类型',
                    },
                  ],
                })
                (
                  <AdvancedSelect
                    disabled={!canChooseShcoolType}
                    style={{'width':'100%'}}
                    dataSource={this.schoolType}
                    onChange={(value)=>this.changeSchoolType(value)}
                    fieldConfig={SelectFieldConfig.filedConfigForDic}
                  />
                )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            {initChart?
              <Empty
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                imagestyle={{
                  height: 400,
                }}
                description={
                  <span>
                    点击指南列表选择需要查看的指南
                  </span>
                }
              />
              :<Col span={24}>
                <Spin spinning={!!getStatisLoading}>
                  <div style={{width:'100%',height:'400px'}}>
                    <ReactEcharts
                      option={option}
                    />
                  </div>
                </Spin>
              </Col>
            }
          </Row>
        </Card>

      </>
    );
  }
}
export default DashBoard;
