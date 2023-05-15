import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, List,Collapse} from 'antd';
// import styles from './ProjectDetailStyle.less';
import styles from './ProjectDetailStyle.less';
import {FILE_TYPE} from '../../utils/Enum'

class ProjectDetail extends PureComponent{
  static propTypes={
    // allDep,
    // allGuide,
    // gDictData,
    // drawerLoading,
    projectDetail:PropTypes.object.isRequired,
    downloadFunction:PropTypes.func.isRequired,
    // schemeDetail:PropTypes.object.isRequired,
  };

  constructor(props){
    super(props);
    this.state={}
  };

  createPrjContacter=(prjPro=[])=>{
    if(prjPro===null){ return }
    return prjPro.map((item,index)=>{
      return(
        <div key={index}>
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

  getGuideName = (guideId) => {
    let guideName = '未填写';
    const { allGuide } = this.props;
    allGuide.filter(item => {
      if (item.guideId === guideId)
        guideName = item.guideName;
    });
    return guideName;
  };

  depName=(depId)=>{
    const { allDep } = this.props;
    let depName = '未填写';
    allDep.filter(item => {
      if (item.departmentId == depId)
        depName = item.depName;
    });
    return depName;
  };

  getAllDictNameById=(dictDataArr, typeName, searchId)=>{
    let resArr = [];
    if (!this.isArrayFn(dictDataArr)) {
      console.log('dictDataArr不是数组');
      return resArr;
    }
    resArr = dictDataArr.filter(function (current) {
      return current.type == typeName && current.k == searchId;
    });
    if (resArr.length > 0) {
      return resArr[0].val;
    }
    else {
      console.log(`类型${typeName}  查找${searchId}  没有找到字典中的数据，请检查`);
    }
  }

  isArrayFn=(value)=> {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
  }

  render(){
    const { Panel } = Collapse;
     const {projectDetail,downloadFunction,drawerLoading,gDictData}=this.props;
    // let moreFile=[];
    // if(projectDetail.attFiles){
    //   moreFile=projectDetail.attFiles.concat(projectDetail.attFiles)
    // }
    let yearFiles=[];
    if(projectDetail.projectScheme){
      yearFiles=projectDetail.projectScheme.reviewList;
    }

    return(
      <Card bordered={false} loading={drawerLoading}>
        <div className={styles.frame}>
          <div style={{ backgroundColor: '#f2f2f2' }}>
            <div className={styles.Layout}>
              <div className={styles.detail}>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>指南名称</Col>
                  <Col className={styles.Coleven} span={18}>{this.getGuideName(projectDetail.guideId)} </Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>学校类型</Col>
                  <Col className={styles.Coleven} span={6}>{this.getAllDictNameById(gDictData,'schoolType',String(projectDetail.schoolType)) || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}>主管部门</Col>
                  <Col className={styles.Coleven} span={6}>{this.depName(projectDetail.depId)}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目名称</Col>
                  <Col className={styles.Coleven} span={18}>{projectDetail.projectName || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目负责人</Col>
                  <Col className={styles.Coleven} span={6}>{projectDetail.prjOwner || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}> 职称</Col>
                  <Col className={styles.Coleven} span={6}>{this.getAllDictNameById(gDictData,'titleType',String(projectDetail.title))}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>行政职务</Col>
                  <Col className={styles.Coleven} span={18}>{projectDetail.duties   || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>试点单位</Col>
                  <Col className={styles.Coleven} span={18}>{projectDetail.pilotUnit || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目负责人工作单位</Col>
                  <Col className={styles.Coleven} span={18}>{projectDetail.workCompany  || '（未填写）'}</Col>
                </Row>
                {projectDetail.prjPro?this.createPrjContacter(projectDetail.prjPro):""}
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>项目开始时间</Col>
                  <Col className={styles.Coleven} span={6}>{projectDetail.prjCreateTime    || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}> 项目结束时间</Col>
                  <Col className={styles.Coleven} span={6}>{projectDetail.prjEndTime   || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>电子邮箱</Col>
                  <Col className={styles.Coleven} span={6}>{projectDetail.email || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}>邮政编码</Col>
                  <Col className={styles.Coleven} span={6}>{projectDetail.postalCode || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>联系电话</Col>
                  <Col className={styles.Coleven} span={6}>{projectDetail.phone  || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}>办公电话</Col>
                  <Col className={styles.Coleven} span={6}>{projectDetail.companyTel  || '（未填写）'}</Col>
                </Row>

                <Row type="flex" justify="space-around" align="middle" className={styles.plan}>
                  <Col span={6}>
                    <span style={{fontSize:'15px'}}>申报书</span>
                  </Col>
                  <Col span={18} className={styles.planList}>
                    <List
                      itemLayout="horizontal"
                      bordered
                      dataSource={projectDetail.attFiles===null?[]:projectDetail.attFiles}
                      renderItem={(item,index) => {
                        return(
                          <List.Item
                            key={item.id}
                            actions={[<a onClick={()=>{downloadFunction(item)}}>下载</a>]
                            }

                          >
                            <List.Item.Meta
                              className={styles.ListItem}
                              description={item.fileName}
                            />
                          </List.Item>
                        )
                      }}
                    />
                  </Col>
                </Row>

                <Row type="flex" justify="space-around" align="middle" className={styles.plan}>
                  <Col span={6}>
                    <span style={{fontSize:'15px'}}>实施方案</span>
                  </Col>
                  <Col span={18} className={styles.planList}>
                    <List
                      itemLayout="horizontal"
                      bordered
                      dataSource={projectDetail.projectScheme?projectDetail.projectScheme.attFiles:[]}
                      renderItem={(item,index) => {
                        return(
                          <List.Item
                            key={item.id}
                            actions={[<a onClick={()=>{downloadFunction(item)}}>下载</a>]
                            }

                          >
                            <List.Item.Meta
                              className={styles.ListItem}
                              description={item.fileName}
                            />
                          </List.Item>
                        )
                      }}
                    />
                  </Col>
                </Row>
                  <Collapse
                    defaultActiveKey={['1']}
                    expandIconPosition='right'
                  >
                    <Panel header='年度评审材料' style={{background:'#F0F7FF',}}>
                       <Col span={24} className={styles.planList} style={{padding:'-16px'}}>
                    {
                      yearFiles?yearFiles.map((item)=>{
                        const dataFiles=item.reviewData
                        return (
                          <Row style={{display: 'flex', alignItems: 'center',border:'1px solid #dadada'}}>
                            <Col span={6}>{item.reviewYear||''}</Col>
                            <Col span={18}>
                              {dataFiles.map((e)=>{
                                const files=e.fileInfo;
                                const fileName=FILE_TYPE.filter((v)=>v.k==e.fileType)[0].val
                                return(
                                  <Row>
                                    <Collapse
                                      defaultActiveKey={['1']}
                                      expandIconPosition='right'
                                    >
                                      <Panel header={fileName} key="3" style={{background:'#F0F7FF'}}>
                                        <Col span={24}>
                                      <List
                                        itemLayout="horizontal"
                                        bordered
                                        dataSource={files}
                                        rowKey={record=>record.id}
                                        renderItem={(item,index) => {
                                          return(
                                            <List.Item
                                              key={item.id}
                                              actions={[<a onClick={()=>{downloadFunction(item)}}>下载</a>]
                                              }

                                            >
                                              <List.Item.Meta
                                                className={styles.ListItem}
                                                description={item.fileName}
                                              />
                                            </List.Item>
                                          )
                                        }}
                                      />
                                    </Col>
                                      </Panel>
                                    </Collapse>
                                  </Row>
                                )
                              })}
                            </Col>
                          </Row>

                        )
                      }):''
                    }
                  </Col>
                    </Panel>
                  </Collapse>
                <Collapse
                  defaultActiveKey={['1']}
                  expandIconPosition='right'
                >
                  <Panel header="申报内容" key="3" style={{background:'#F0F7FF'}}>
                    <Row style={{padding: '16px'}}>
                      <div style={{fontSize:15,textAlign:'left'}} dangerouslySetInnerHTML={{__html:projectDetail.context  || '（未填写）'}} />
                    </Row>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
export default ProjectDetail;
