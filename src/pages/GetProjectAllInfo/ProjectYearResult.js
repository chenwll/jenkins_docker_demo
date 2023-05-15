import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Modal, Table } from 'antd';
import {
  PROJECT_PROCESS_TYPE,
  SCORE_GRADE,
  PROCESS_STAGE_TEXT,
  PROCESS_TYPE_TEXT,
  DEP_TYPE,
  RANK
} from '../../utils/Enum';
import * as utils from '../../utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import ToolBarGroup from '@/components/ToolBarGroup';

const {confirm}=Modal;
@connect(({ loading, GetProjectAllInfo, basicdata }) => ({
  basicdata,
  loading,
  GetProjectAllInfo,
  getLoading: loading.effects['GetProjectAllInfo/getProjectRecommendInfo'],
  reVokeLoading:loading.effects['GetProjectAllInfo/withDraw'],
}))
class ProjectYearResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { match: { params } } = this.props;
    dispatch({
      type: 'GetProjectAllInfo/getProjectRecommendInfo',
      payload: {
        projectId: params.projectId,
      },
    });
  };

  getGuideName = (guideId) => {
    let guideName = '暂无数据';
    const { GetProjectAllInfo: { allGuide } } = this.props;
    allGuide.filter(item => {
      if (item.guideId === guideId)
        guideName = item.guideName;
      return guideName;
    });
    return guideName;
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  listPage = () => {
    const { dispatch } = this.props;
    const { match: { params } } = this.props;
    dispatch({
      type: 'GetProjectAllInfo/getProjectRecommendInfo',
      payload: {
        projectId: params.projectId,
      },
    });
  };




  handelRevoke=(record)=>{
    const { GetProjectAllInfo: { projectRecommendInfo } } = this.props;
    const {dispatch}=this.props;
    const {match:{params}}=this.props;
    const type=record.refId?'refId':'scoreId';
    confirm({
      title: '是否确认撤销！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const dataObj={};
        const refOrScoreValue=record.refId?{'refsId':record.refId}:{'scoreId':record.scoreId};
        projectRecommendInfo.prjConclusion.forEach(item=>{
          item.projectDis.map(dis=>{
            if(dis[type]===record[type]){
              dataObj['projectId']=item.projectId;
              dataObj['processId']=item.processId;
              dataObj['processType']=item.processType;
              dataObj['reviewYear']=item.reviewYear;
              dataObj['processStage']=item.processStage;
              // dataObj={
              //   projectId:item.projectId,
              //   processId:item.processId,
              //   processType:item.processType,
              //   reviewYear:record.reviewYear,
              //   processStage:item.processStage,
              //   ...refOrScoreValue,
              // };
              return dataObj
            }
            return dataObj
          })
        });
        dispatch({
          type:'GetProjectAllInfo/withDraw',
          payload:{
            guideId:params.guideId,
            ...dataObj,
            ...refOrScoreValue,
          }
        })
      }
    });
  }

  btnList = {
    primaryBtn: [{
      func: this.listPage,
      param: { refresh: true },
      key: 'REFRESH',
    }],
  };

  expandedRowRender = (record,index) => {
    const { GetProjectAllInfo: { projectRecommendInfo:{prjReview} } } = this.props;
    // let action={ key:'action'};
    //   if(Object.prototype.hasOwnProperty.call(record,'projectDis')){
    //     if(index===prjReview[index].projectProcesses.length-1){
    //       action={
    //         title:'操作',
    //         key:'action',
    //         render:(text,Record)=> {
    //           if (Record.scoreState === 1 || Record.refSubmit === 1) {
    //             return (
    //               <Button onClick={() => this.handelRevoke(record)} type="primary">
    //                 撤销
    //               </Button>
    //             )
    //           }
    //         }
    //       }
    //     }
    //   }




    const {getLoading} =this.props;
    let processColumns=[];
    // 分配部门打分
    let depScoreColumns = [];
    // 分配专家打分
    let expScoreColumns = [];
    // 分配部门推荐和区县市洲推荐
    let RecommondColumns = [];
    // 专家推荐
    let expRecommondColumns = [];
    if(!record.processType){
      processColumns=[{
        title: '所属阶段',
        dataIndex: 'processStage',
        key: 'processStage',
        render: (v = '') => {
          let level = '';
          PROCESS_STAGE_TEXT.forEach((item) => {
            if (item.value === v) {
              level = item.text;
            }
          });
          return (
            <span>{level}</span>
          );
        },
      },{
        title: '部门类型',
        dataIndex: 'depType',
        key: 'depType',
        render: (v = '') => {
          let level = '';
          DEP_TYPE.forEach((item) => {
            if (item.value === v) {
              level = item.text;
            }
          });
          return (
            <span>{level}</span>
          );
        },
      },{
        title: '流程类型',
        dataIndex: 'processType',
        key: 'processType',
        render: (v = '') => {
          let level = '';
          PROCESS_TYPE_TEXT.forEach((item) => {
            if (item.value === v) {
              level = item.text;
            }
          });
          return (
            <span>{level}</span>
          );
        },
      },];
      return <Table columns={processColumns} expandedRowRender={this.expandedRowRender} loading={getLoading} dataSource={record.projectProcesses} pagination={false} rowKey={record => record.processId} />;
    }

    switch (record.processType) {
      case PROJECT_PROCESS_TYPE.DEPART_SCORE:
        //  分配部门打分
        depScoreColumns = [
          {
            title: '评价负责人',
            dataIndex: 'depName',
            key: 'depName',
          },
          {
            title: '评价分数',
            dataIndex: 'score',
            key: 'score',
          },
          {
            title: '评价等级',
            dataIndex: 'scoreGrade',
            key: 'scoreGrade',
            render: (v = '') => {
              let level = '';
              SCORE_GRADE.forEach((item) => {
                if (item.value === v) {
                  level = item.text;
                }
              });
              return (
                <span>{level}</span>
              );
            },
          },
        ];
        // depScoreColumns.push(action);
        return <Table columns={depScoreColumns} loading={getLoading} dataSource={record.projectDis} pagination={false} rowKey={record => record.scoreId} />;
      case PROJECT_PROCESS_TYPE.EXPERT_SCORE:
        // 分配专家打分
        expScoreColumns = [
          {
            title: '评价负责人',
            dataIndex: 'expertName',
            key: 'expertName',
          },
          {
            title: '评价分数',
            dataIndex: 'score',
            key: 'score',
          },
          {
            title: '评价等级',
            dataIndex: 'scoreGrade',
            key: 'scoreGrade',
            render: (v = '') => {
              let level = '';
              SCORE_GRADE.forEach((item) => {
                if (item.value === v) {
                  level = item.text;
                }
              });
              return (
                <span>{level}</span>
              );
            },
          },
        ];
        // expScoreColumns.push(action);
        return <Table columns={expScoreColumns} loading={getLoading} dataSource={record.projectDis} pagination={false} rowKey={record => record.scoreId} />;
      case PROJECT_PROCESS_TYPE.APPROVAL:
      case PROJECT_PROCESS_TYPE.DEPART_APPROVAL:
        // 分配部门推荐
        RecommondColumns = [
          {
            title: '评价负责人',
            dataIndex: 'depName',
            key: 'depName',
          },
          {
            title: '是否推荐',
            dataIndex: 'refState',
            key: 'refState',
            render: (refState) => <span>{refState === 0 ? '推荐' : '不推荐'}</span>
          },
          {
            title: '(不)推荐理由',
            dataIndex: 'reason',
            key: 'reason',
          },
        ];
        // RecommondColumns.push(action);
        return <Table columns={RecommondColumns} loading={getLoading} dataSource={record.projectDis} pagination={false} rowKey={record => record.reviewYear} />;
      case PROJECT_PROCESS_TYPE.EXPERT_APPROVAL:
        expRecommondColumns = [
          {
            title: '评价负责人',
            dataIndex: 'expertName',
            key: 'expertName',
          },
          {
            title: '是否推荐',
            dataIndex: 'refState',
            key: 'refState',
            render: (refState) =>  <span>{refState === 0 ? '推荐' : '不推荐'}</span>
          },
          {
            title: '推荐理由',
            dataIndex: 'reason',
            key: 'reason',
          },
        ];
        // expRecommondColumns.push(action);
        return <Table columns={expRecommondColumns} loading={getLoading} dataSource={record.projectDis} pagination={false} rowKey={record => record.refId} />;
      default:
        //  推荐
        return <Table columns={RecommondColumns} loading={getLoading} dataSource={record.projectDis} pagination={false} rowKey={record => record.refId} />;
    }
    ;

  };

  handelCancel = () => {
    const { match: { params },dispatch } = this.props;
    router.push({
      pathname: `/getProjectAllInfo/ProjectListGetByGuide/${params.guideId}`,
      query: { prevent: true },
    });
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '年度评审结果',
      },
    });
  };

  render() {
    const { GetProjectAllInfo: { projectRecommendInfo } } = this.props;
    const {
      getLoading,
      reVokeLoading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '评审年份',
        dataIndex: 'reviewYear',
        key: 'reviewYear',
      },
      {
        title: '评审结果',
        dataIndex: 'rank',
        key: 'rank',
        render: (v = '') => {
          let level = '';
          RANK.forEach((item) => {
            if (item.value === v) {
              level = item.text;
            }
          });
          return (
            <span>{level}</span>
          );
        },

      },

    ];
    return (
      <PageHeaderWrapper title='年度评审结果'>
        <Card>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows} />
          <Table
            className="components-table-demo-nested"
            columns={columns}
            expandedRowRender={this.expandedRowRender}
            dataSource={projectRecommendInfo.prjReview}
            loading={getLoading||reVokeLoading}
            rowKey={record => record.reviewYear}
          />
        </Card>
        <FooterToolbar>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handelCancel} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}
export default ProjectYearResult;
