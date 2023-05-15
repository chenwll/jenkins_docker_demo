import React,{PureComponent,Fragment} from 'react';
import router from 'umi/router';
import {
  Button,
  Modal,
  Empty,
  Form,
  Card,
  Row,
  Col,
} from 'antd';
import {connect} from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const {confirm}=Modal;
@Form.create()
@connect(({loading,newsModel,basicdata,global})=>({
  global,
  basicdata,
  loading,
  newsModel,
}))
class ShowNews extends PureComponent{
  constructor(props){
    super(props);
    this.state={
    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {newsModel:{showNewsId}}=this.props;
    dispatch({
      type:'newsModel/getShowNews',
      payload:{
        newsId:showNewsId,
      }
    });
  }

   cancel=async ()=>{
    const {dispatch}=this.props;
    await router.push(`/News/NewsSetting`);
   await dispatch({
      type: 'global/closeCurrentTab',
      payload: {
        tabName: '新闻详情',
      },
    });
    await dispatch({
      type:'newsModel/fetch',
      payload:{
        currentPage:1,
        pageSize:10
      }
    })
  };

  publishNews=()=>{
    const {newsModel:{showNewsId}}=this.props;
    confirm({
      title: `是否确认发布，发布之后不能编辑，同时不可删除`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const {dispatch}=this.props;
        router.push(`/News/NewsSetting`);
        dispatch({
          type:'newsModel/publish',
          payload:{
            newsId:showNewsId,
            newsState:1
          }
        });
        dispatch({
          type: 'global/closeCurrentTab',
          payload: {
            tabName: '新闻详情',
          },
        });
      }
    })
  };

  render(){
    const {
      showNewsDetail,
      showStatus,
      allRoles,
    }=this.props.newsModel;

    let newsCreater='暂无数据';
    allRoles.map(item=>{
      if(item.id==showNewsDetail.createrId) newsCreater=item.name
    })
    return(
      <PageHeaderWrapper title='新闻详情'>
        <Fragment>
          <Card bordered={false}>
            <div style={{'textAlign':'center'}}>{`${showNewsDetail.newsName===undefined?'暂无数据':showNewsDetail.newsName}`}</div>
            {showNewsDetail.newsContext===undefined?<Empty description={<span style={{'color':"#DEC0E6"}}>该新闻没有内容</span>} />
              :<div dangerouslySetInnerHTML={{__html:showNewsDetail.newsContext}}></div>}
            <div>
              <Row type="flex" justify="space-around">
                <Col span={8} offset={4}><div>{`新闻发布者：${newsCreater}`}</div></Col>
                <Col span={8} offset={4}><div>{`新闻创建时间：${showNewsDetail.createTime===undefined?'暂无数据':showNewsDetail.createTime}`}</div></Col>
              </Row>
            </div>
            <FooterToolbar style={{ width : '100%' }}>
              <Button type="primary" onClick={this.publishNews} disabled={showStatus==0?false:true}>
                发布
              </Button>
              <Button style={{ marginLeft : 8 }} onClick={this.cancel}>
                返回
              </Button>
            </FooterToolbar>
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    )
  }
}
export default ShowNews;
