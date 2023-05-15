import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Card, Button, Col, Row,Collapse} from 'antd';
import styles from '../../utils/styles/TableStyle.less';
import * as utils from "../../utils/utils";
import {submitFormLayout} from "../../utils/globalUIConfig";

const FormItem = Form.Item;
const { Panel } = Collapse;
@Form.create()
@connect(({ personalProjectModal,basicdata, loading }) => ({
  personalProjectModal,
  basicdata,
  loadingGetDetail : loading.effects['personalProjectModal/getGuide'],
}))

class GuideDetail extends PureComponent {

  componentDidMount() {
    const {dispatch,guideId} = this.props;
    dispatch({
      type:`personalProjectModal/getGuide`,
      payload:{
        guideId,
      },
    })
  }

  handelCancel = ()=>{
    const {onClose} = this.props;
    onClose();
  }

  handleDeclare = ()=>{
    const {onClose} = this.props;
    onClose();
    router.push(`/PersonalProject/basicInfo/step1`);
  }

  downLoadFile =(data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`personalProjectModal/downLoadFile`,
      payload:{
        md5: data.fileMd5,
        fileName: data.fileName,
      }
    })
  };
  
  render(){
    const {personalProjectModal:{detailData},loadingGetDetail} = this.props;
    // 任务状态数据
    const gDictData=[
      {id:1,type:'GuideStatus',k:"0",val:'初稿'},
      {id:2,type:'GuideStatus',k:"1",val:'发布'},
      {id:3,type:'GuideStatus',k:"2",val:'开始申报'},
      {id:4,type:'GuideStatus',k:"3",val:'申报结束'},
      {id:5,type:'GuideStatus',k:"4",val:'审评开始'},
      {id:6,type:'GuideStatus',k:"5",val:'审评结束'},
    ]
    return(
      <Card bordered={false} loading={loadingGetDetail}>
        <div className={styles.frame}>
          <div style={{ backgroundColor: '#f2f2f2' }}>
            <div className={styles.Layout} style={{height:150}}>
              <div className={styles.detail}>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>任务名称</Col>
                  <Col className={styles.Coleven} span={18}>{detailData.guideName || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>任务简称</Col>
                  <Col className={styles.Coleven} span={18}>{detailData.guideBrief || '（未填写）'}</Col>
                </Row>
                <Row className={styles.Row}>
                  <Col className={styles.Colodd} span={6}>创建时间</Col>
                  <Col className={styles.Coleven} span={6}>{detailData.createTime || '（未填写）'}</Col>
                  <Col className={styles.Colodd} span={6}>任务状态</Col>
                  <Col className={styles.Coleven} span={6}>{utils.getAllDictNameById(gDictData,"GuideStatus",detailData.status) || '（未填写）'}</Col>
                </Row>
                <Collapse
                  defaultActiveKey={['1']}
                  expandIconPosition='right'
                >
                  <Panel header="任务内容" key="3" style={{background:'#F0F7FF'}}>
                    <div style={{fontSize:15,textAlign:'left',padding:'10px'}} dangerouslySetInnerHTML={{__html:detailData.memo  || '（未填写）'}} />
                  </Panel>
                </Collapse>
              </div>
              {/* <div className={styles.entireLine}>
                <List
                  itemLayout="horizontal"
                  dataSource={fileData}
                  header="附件列表"
                  bordered
                  renderItem={item => {
                    return(
                      <List.Item actions={[<a onClick={()=>{this.downLoadFile(item)}}>下载</a>]}>
                        <List.Item.Meta
                          className={styles.ListItem}
                          description={item.fileName}
                        />
                      </List.Item>
                    )}}
                />
              </div> */}
              <FormItem {...submitFormLayout} style={{ marginTop : 32 }}>
                <Button type="primary" onClick={this.handleDeclare}>
                  创建申报
                </Button>
                <Button style={{ marginLeft : 8 }} onClick={this.handelCancel}>
                  取消
                </Button>
              </FormItem>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
export default GuideDetail;
