import React,{PureComponent} from 'react';
import Zmage from 'react-zmage'
import {Upload,Button,Icon,Modal,message} from 'antd';
import {connect} from 'dva';
import remoteLinkAddress from '../../utils/ip';
import { CheckPictureBeforeUpload } from '../../utils/utils';
import styles from './style.less';

@connect(({loading,picModal,global})=>({
  global,
  loading,
  picModal,
}))
class PictureController extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      fileList:[],
    };
  };

  componentDidMount(){
    const {dispatch}=this.props;
    dispatch({
      type: 'picModal/fetch',
      payload: {},
    })
  }
;



  Delete = id => {
    const {dispatch} = this.props;
    dispatch({
      type: 'picModal/deletePicture',
      payload: {
        id,
      },
    });
  };

  onDelete = (item) => {
    const id=item.pictureId;
    Modal.confirm({
      title: '删除图片',
      content: '确定删除这张图片吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.Delete(id),
    });
  };

  handleChange = ({ fileList }) => {
    if (fileList.length >= 1) {
       fileList=fileList.slice(-1);
    }
    fileList.map((value, index) => {
      const { dispatch } = this.props;
      if (value.response && value.response.code === 1) {
        value.status = 'error';
      }
      if(index===fileList.length-1)
      {
        if (value.response) {
          if (value.response.code === 0) {
            if(value.response.msg !=='上传图片重复，不能上传'){
              message.success("上传成功")
              dispatch({
                type: 'picModal/fetch',
                payload: {}
              });
            }else {
              message.error('上传图片重复，不能上传')
            }

          } else {
            message.error("上传图片失败")
          }
        }
      }
    });
    this.setState({
      fileList,
    })
  };

  render() {
    const {picModal:{PicListData}}=this.props;
    const {fileList}=this.state;
    const url = remoteLinkAddress();
    const fileProps = {
      name: 'file',
      action: `${url}/api/picture/upload`,
      listType: 'picture',
      headers: {
        token: sessionStorage.getItem('token'),
      },
      beforeUpload:CheckPictureBeforeUpload,
      fileList,
      showUploadList:{
        showRemoveIcon: false,
      },
      onChange: this.handleChange,
      accept:".jpg,.png,",
    };
    const elements=[];
if(PicListData) {
  PicListData.forEach((item) => {
    const path = url + item.image;
    const {pictureId} = item;
     console.log(path)
    elements.push(
      <div
        key={pictureId}
        className={styles.container}
      >
        <Zmage
          className={styles.Zmage}
          alt={pictureId}
          // src='http://localhost:8000/static/banner1.97834051.jpg'
          src={path}
          style={{ width: 450, height: 150 }}
        />
        <span>{item.name}</span>
        <Button type="primary" size="small" className={styles.setting} onClick={this.onDelete.bind(this,item)}>删除</Button>
      </div>

    )
  });

      }
  return (
    <div>
      <Upload {...fileProps}>
        <Button stlye={{ marginLeft: 50 }}>
          <Icon type="upload" /> 点击上传图片
        </Button>
      </Upload>
      {elements}
    </div>
  )


  }
}
export default PictureController;
