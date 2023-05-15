import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Form,
  Row,
  Col,
  List,
  Button,
  Layout,
} from 'antd';
import router from 'umi/router';
import styles from './ProjectGuideDetail.less';
import FooterToolbar from '@/components/FooterToolbar';

const {
  Header,Content,
} = Layout;

@connect(({projectGuideAndNewsModal}) => ({
  projectGuideAndNewsModal,
}))
@Form.create()
class PorjectGuideDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    const {match:{params}}=this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'projectGuideAndNewsModal/getGuideDetail',
      payload: { guideId: params.id },
    });
  }

  returnFacePage = () => {
    router.push(`/index`)
  };

  downLoadFile = (data)=>{
    const {dispatch} = this.props;
    dispatch({
      type:`projectGuideAndNewsModal/downLoadFile`,
      payload: {
        md5: data.fileMd5,
        fileName: data.fileName,
      },
    })
  }


  render() {
    const {projectGuideAndNewsModal: {detail}} = this.props;
    const fileData = detail.attFiles;
    return (
      <div className={styles.frame}>
        <div style={{paddingTop: 50}}>
          <div className={styles.Layout}>
            <div className={styles.detail}>
              <Row className={styles.Row}>
                <Col className={styles.Colodd} span={6}>指南名称</Col>
                <Col className={styles.Coleven} span={18}>{detail.guideName}</Col>
              </Row>
              <Row className={styles.Row}>
                <Col className={styles.Colodd} span={6}>发布时间</Col>
                <Col className={styles.Coleven} span={18}>{detail.createTime}</Col>
              </Row>
            </div>
            <Layout>
              <Header className={styles.Header}>
                {detail.guideBrief || '暂无'}
              </Header>
              <Content className={styles.Content}>
                <div dangerouslySetInnerHTML={{__html: detail.context || '暂无说明'}} />
              </Content>
            </Layout>
          </div>
          <div className={styles.outLine}>
            <List
              className={styles.List}
              style={{
                margin: '10px auto 0 auto',
              }}
              header="附件"
              itemLayout="horizontal"
              dataSource={fileData}
              renderItem={item => (
                <List.Item actions={[<a onClick={()=>{this.downLoadFile(item)}}>下载</a>]}>
                  <List.Item.Meta
                    className={styles.ListItem}
                    description={item.fileName}
                  />
                </List.Item>
              )}
            />
          </div>
          <FooterToolbar style={{width: '100%'}}>
            <Button type="primary" onClick={this.returnFacePage}>
              返回首页
            </Button>
          </FooterToolbar>
        </div>
      </div>
    );
  }
}

export default PorjectGuideDetail;
