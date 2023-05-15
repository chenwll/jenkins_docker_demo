import React, {PureComponent} from 'react';
import {connect} from 'dva';
import { Button} from 'antd';
import router from 'umi/router';
import ProjectDetail from '@/components/ProjectDetail';
import FooterToolbar from '@/components/FooterToolbar';
import { RECOMMEND_TYPE } from '../../../utils/Enum';


@connect(({ expertRecommend,basicdata,loading}) => ({
  expertRecommend,
  basicdata,
  drawerLoading:loading.models.expertRecommend,
  // drawerLoading:loading.effects['expertRecommend/getProjectDetail']
}))


class ProjectScoreFlow1 extends PureComponent {
  constructor(props){
    super(props);
    this.state={

    }
  }

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`expertRecommend/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };

  // 下一步
  nextStep = ()=>{
    const {match: {params}} = this.props;
    if(params.recommendType===RECOMMEND_TYPE.CONCLUDE){
      router.push({pathname: `/expertApproval/projectApproval/step2/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
    }else {
      router.push({pathname: `/expertApproval/declaration/step2/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
    }
  };

  //  返回
  handleReturn = ()=>{
    const {dispatch,match: {params}} = this.props;
    dispatch({
      type:'expertRecommend/save',
      payload:{
        detail:{},
      }
    });
    dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '基础信息',
      },
    });
    if(params.recommendType===RECOMMEND_TYPE.CONCLUDE){
      router.push({pathname: `/expertApproval/projectApproval/concludeDistributionScore`, query: {prevent: true}});
    }else {
      router.push({pathname: `/expertApproval/declaration/distributionScore`, query: {prevent: true}});
    }
  };

  render(){
    const {basicdata:{gDictData},drawerLoading} = this.props;
    const {expertRecommend:{departList,guideList,detail}} = this.props;
    const contentOptions = {
      allDep:departList,
      allGuide:guideList,
      gDictData,
      drawerLoading,
      projectDetail:detail,
      downloadFunction:this.downLoadFile,
    };
    return(
      <div>
        <ProjectDetail {...contentOptions} />
        <FooterToolbar>
          <Button type="primary" onClick={this.nextStep}>
            下一步
          </Button>
          <Button style={{marginLeft: 8}} onClick={this.handleReturn}>
            返回
          </Button>
        </FooterToolbar>
      </div>
    )
  }
}

export default ProjectScoreFlow1
