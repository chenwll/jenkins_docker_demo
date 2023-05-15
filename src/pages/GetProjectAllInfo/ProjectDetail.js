import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, List } from 'antd';
import styles from '../../utils/styles/TableStyle.less';
import * as utils from '../../utils/utils';

@connect(({ loading, GetProjectAllInfo, basicdata }) => ({
  basicdata,
  loading,
  GetProjectAllInfo,
}))
class ProjectDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { project,reviewYear } = this.props;
    dispatch({
      type: 'GetProjectAllInfo/getProjectAllInfo',
      payload: {
        projectId: project.projectId,
        reviewYear
      },
    });
  };

  getGuideName = (guideId) => {
    let guideName = '未填写';
    const { GetProjectAllInfo: { allGuide } } = this.props;
    allGuide.filter(item => {
      if (item.guideId === guideId)
        guideName = item.guideName;
      return guideName;
    });
    return guideName;
  };

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`GetProjectAllInfo/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };

  depName=(depId)=>{
    const { GetProjectAllInfo: { allDep } } = this.props;
    let depName = '未填写';
    allDep.filter(item => {
      if (item.departmentId == depId)
        depName = item.depName;
      return depName;
    });
    return depName;
  };

  createPrjContacter=(prjPro=[])=>{
    return prjPro.map((item)=>{
      return(
        <div>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} span={6}>项目联系人</Col>
            <Col className={styles.Coleven} span={6}>{item.name || '（未填写）'}</Col>
            <Col className={styles.Colodd} span={6}>项目联系人邮政编码</Col>
            <Col className={styles.Coleven} span={6}>{item.postalCode}</Col>
          </Row>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} span={6}>项目联系人电话</Col>
            <Col className={styles.Coleven} span={6}>{item.phone || '（未填写）'}</Col>
            <Col className={styles.Colodd} span={6}> 项目联系人邮箱</Col>
            <Col className={styles.Coleven} span={6}>{item.email}</Col>
          </Row>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} span={6}>项目联系人工作地址</Col>
            <Col className={styles.Coleven} span={18}>{item.workCompany || '（未填写）'}</Col>
          </Row>
        </div>
      )
    })
  };


  render() {
    const { GetProjectAllInfo: { projectAllInfo } } = this.props;
    const { basicdata:{gDictData} } = this.props;
    return (
      <Card bordered={false}>
        <div className={styles.frame}>
          <div style={{ backgroundColor: '#f2f2f2' }}>
            <div className={styles.Layout}>
              <div className={styles.detail}>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>指南名称</Col>
                  <Col className={styles.Coleven} span={18}>{this.getGuideName(projectAllInfo.guideId)} </Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>学校类型</Col>
                  <Col className={styles.Coleven} span={6}>{utils.getAllDictNameById(gDictData,'schoolType',String(projectAllInfo.schoolType)) || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}>部门</Col>
                  <Col className={styles.Coleven} span={6}>{this.depName(projectAllInfo.depId)}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目名称</Col>
                  <Col className={styles.Coleven} span={18}>{projectAllInfo.projectName || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目负责人</Col>
                  <Col className={styles.Coleven} span={6}>{projectAllInfo.prjOwner || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}> 职称</Col>
                  <Col className={styles.Coleven} span={6}>{utils.getAllDictNameById(gDictData,'titleType',String(projectAllInfo.title))}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>行政职务</Col>
                  <Col className={styles.Coleven} span={18}>{projectAllInfo.duties   || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>试点单位</Col>
                  <Col className={styles.Coleven} span={18}>{projectAllInfo.pilotUnit || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目负责人工作单位</Col>
                  <Col className={styles.Coleven} span={18}>{projectAllInfo.workCompany  || '（未填写）'}</Col>
                </Row>
                {projectAllInfo.prjPro?this.createPrjContacter(projectAllInfo.prjPro):''}
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目开始时间</Col>
                  <Col className={styles.Coleven} span={6}>{projectAllInfo.prjCreateTime    || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}> 项目结束时间</Col>
                  <Col className={styles.Coleven} span={6}>{projectAllInfo.prjEndTime   || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>电子邮箱</Col>
                  <Col className={styles.Coleven} span={6}>{projectAllInfo.email || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}>邮政编码</Col>
                  <Col className={styles.Coleven} span={6}>{projectAllInfo.postalCode || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>联系电话</Col>
                  <Col className={styles.Coleven} span={6}>{projectAllInfo.phone  || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}>公司电话</Col>
                  <Col className={styles.Coleven} span={6}>{projectAllInfo.companyTel  || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.entireLine} span={24}>申报内容 </Col>

                </Row>
                <Row style={{marginTop: '1%'}}>
                  <div style={{fontSize:15,textAlign:'left'}} dangerouslySetInnerHTML={{__html:projectAllInfo.context  || '（未填写）'}} />
                </Row>
              </div>
              <div style={{marginBottom:'3%'}}>
                <List
                  itemLayout="horizontal"
                  header="附件列表"
                  bordered
                  dataSource={projectAllInfo.attFiles}
                  renderItem={item => (
                    <List.Item actions={[<a onClick={()=>{this.downLoadFile(item)}}>下载</a>]
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
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

export default ProjectDetail;
