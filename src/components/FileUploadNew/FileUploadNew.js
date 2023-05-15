import React, {  Fragment } from 'react';
import { Button, Icon, message, Modal, Table, Tag, Upload } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from './FileUploadNew.less'
import {
  fileNameRegular,
  EXTENDS_REG,
  FileSizeLimit,
  TYPE,
  defaultConfig,
  uploadOptions, removeOptions,
} from '@/components/FileUploadNew/Config';




class FileUploadNew extends React.PureComponent {
  static propTypes = {
    fileList:PropTypes.array,
    readOnly:PropTypes.bool,
    maxCount:PropTypes.number,
    type:PropTypes.number,
  };

  static defaultProps = {
    readOnly:false,
    maxCount:Infinity,
    fileList:[],
    type:TYPE.FILE
  };

  constructor(props) {
    super(props);
    this.state={
      pictureModal:false,
      localFileList:[],
      imgUrl:"",
    }
  }

  // static getDerivedStateFromProps(nextProps) {
  //   const {fileList=[]} = nextProps;
  //   const files = fileList.map((item) => ({
  //     uid: item.fileName,
  //     name:item.original|| item.fileName,
  //     status: 'done',
  //     url: item.objectURL,
  //   }))
  //   return {
  //     fileList:files
  //   }
  // }

  componentDidMount() {
    const {fileList=[]} = this.props;
    const files = fileList.map((item) => ({
      uid: item.fileName,
      name:item.original|| item.fileName,
      status: 'done',
      url: item.objectURL,
    }))
    this.setState({
      localFileList:files,
    })
  }

  componentWillUnmount() {
    this.setState({
      localFileList:[]
    })
  }

  closeModal = () => {
    this.setState({
      pictureModal:false,
    })
  }

  previewPicture = (file) => {
    const {thumbUrl,url} = file
    this.setState({
      pictureModal:true,
      imgUrl:thumbUrl||url
    })
  }

  checkFileName = ({ file,type }) => {
    const fileNameSplit = file.name.split('.').length - 1;
    if (fileNameSplit !== 1) {
      throw new Error(fileNameRegular.msg);
    }
    const fileName = fileNameSplit[0];
    if(!fileNameRegular.reg.test(fileName)){
      throw new Error(fileNameRegular.msg)
    }
    return { file,type };
  }

  checkFileExtension = ({ file,type }) => {
    console.log('checkFileExtension');
    const test = EXTENDS_REG[type].test(file.name)
    const extendsName = file.name.split('.').pop()
    if(test) {
      return { file,type };
    }
    throw new Error(`不支持上传${extendsName}类型的文件`)
  }

  checkFileSizeLimit = ({ file,type }) => {
    console.log('checkFileSizeLimit');
    const {size} = file;
    const {UPPER_LIMIT,LOWER_LIMIT} = FileSizeLimit[type]
    if(size < LOWER_LIMIT.number || size > UPPER_LIMIT.number) {
      throw new Error(`文件大小应该在${ LOWER_LIMIT.description} - ${UPPER_LIMIT.description}范围内` )
    }
    return { file,type };
  }

  checkCompose = (...func) => func.reduce((acc,cur) => (file) => cur(acc(file)))

  checkMaxCount = ({file,type}) => {
    const { localFileList } = this.state;
    const len = localFileList.length;
    const {maxCount} = this.props;
    if(len >= maxCount) throw new Error(`文件数量不能超过${maxCount}`)
    return { file,type };
  }


  beforeUpload = (file) => {
    try{
      const {type} = this.props;
      this.checkCompose(this.checkMaxCount,this.checkFileExtension, this.checkFileName, this.checkFileSizeLimit)({ file,type })
    }catch (err) {
      message.error(err.message)
      return Promise.reject();
    }
    return Promise.resolve()
  }


  removePicture = (file) => {
    const { localFileList } = this.state;
    const {response={}} = file;
    const filterArr = localFileList.filter((item) => item.uid !== file.uid)
    const {fileName}  = response;
    const removeName = fileName || file.uid
    const removeFile = Object.keys(response).length !==0 ?response: file
    const {onRemove} = this.props;
    this.requestOnRemove({ fileName:removeName }).then((value) => {
      if(onRemove) onRemove(removeFile,value)
      this.setState({
        localFileList:filterArr
      })
      message.success('删除成功')
    }).catch((e) => {
      onRemove(removeFile,e)
      this.setState({
        localFileList:filterArr
      })
      message.error('删除失败')
    })
  }

  handleStatusChange = ({ fileList,file }) => {
    const {status} = file;
    console.log('change');
    if(status === 'uploading') {
      console.log('uploading');
    }else if(status === 'done') {
      console.log('done');
    }
    this.setState({
      localFileList:[...fileList]
    })
  }

  customRequest =  (options) => {
    const formData = new FormData();
    formData.append('file', options.file)
    const {onUpload,checkLoading} = this.props;
    if(typeof checkLoading === 'function') checkLoading(true)
    this.requestOnUpload(formData).then((value) => {
      const {code,data,msg} = value;
      if(code === 0) {
        onUpload(value)
        if(typeof checkLoading === 'function') checkLoading(false)
        options.onSuccess(data)
      }
      else throw new Error(msg)
    }).catch((err) => {
      if(typeof checkLoading === 'function') checkLoading(false)
      options.onError({code:1,data:err})
      onUpload({code:1,data:err})
    })
  }

  clickAElement = (url,name) => {
    const element = document.createElement('a')
    element.setAttribute('href',url)
    element.setAttribute('download',name)
    element.click()
    document.body.appendChild(element)
    URL.revokeObjectURL(url)
    document.body.removeChild(element)
  }

  transUrlToBlobUrl = (link,name) =>{
    const xhr = new XMLHttpRequest();
    const hide = message.loading(`${name} 下载中`, 0);
    xhr.open('GET',link)
    xhr.responseType = 'blob'
    xhr.send()

    xhr.onload =  () => {
      const fileBlob = xhr.response;
      const blobUrl =  URL.createObjectURL(fileBlob);
      this.clickAElement(blobUrl,name)
      hide()
      message.success('下载成功')
    }

    xhr.onerror = () => {
      message.error('下载失败')
    }
  }



  downloadFile =  (file) => {
    const {url,objectURL,name,original} = file;
    const fileUrl = objectURL || url
    const fileName = original || name;
    if(fileUrl) {
      this.transUrlToBlobUrl(fileUrl,fileName)
      // FileSaver.saveAs(fileUrl,fileName);
    }
    else {
      const { originFileObj } = file;
      const blob = new Blob([originFileObj])
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob);
      } else {
        const {originFileObj:{name:localName}} = file
        const blobUrl = window.URL.createObjectURL(blob);
        this.clickAElement(blobUrl,localName)
      }
    }
  }

  showRules = () => {
    const {type,readOnly} = this.props;
    // 不能修改时没必要展示规则
    if(readOnly) return null;
    switch (type) {
      case TYPE.PICTURE:
        return(
          <div>
            <div className={styles.textDescription}>
              {`1.图片仅支持上传.png .jpg格式，且大小不超过${FileSizeLimit[type].UPPER_LIMIT.description}`}
            </div>
            <div className={styles.textDescription}>
              {`2.${fileNameRegular.msg}`}
            </div>
          </div>
        )
      case TYPE.FILE:
        return (
          <div>
            <div className={styles.textDescription}>
              1. 文件名只能由数字，字母和中文构成,且长度不超过50
            </div>
            <div className={styles.textDescription}>
              {`2.文件大小只能在${FileSizeLimit[type].LOWER_LIMIT.description} - ${FileSizeLimit[type].UPPER_LIMIT.description}之间`}
            </div>
          </div>
        )
      default:
        return null;
    }
  }

  getColumnsActions = (text) => {
    if(text === 'done'){
      return (
        <Tag color="green">成功</Tag>
      )
    }if(text === 'uploading'){
      return (
        <Tag color="orange">上传中</Tag>
      )
    }return (
      <Tag color="red">失败</Tag>
    )
  }

  getColumns = () => {
    const {readOnly} = this.props;
    if(!readOnly) {
      return  [
        {
          title: '文件名',
          dataIndex: 'name',
          key: 'name',
          render:(text,file) => <a onClick={() => this.downloadFile(file)}>{text}</a>
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text) => this.getColumnsActions(text)
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span onClick={() => this.removePicture(record)}>
              <a>删除</a>
            </span>
          ),
        },
      ];
    }
    return [
      {
        title: '文件名',
        dataIndex: 'name',
        key: 'name',
        render:(text,file) => <a onClick={() => this.downloadFile(file)}>{text}</a>
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => this.getColumnsActions(text)
      },
    ]
  }

  buildFileTable = (fileList) => {
    const columns = this.getColumns();
    return (
      <Fragment>
        <Table rowKey={record => record.uid} columns={columns} dataSource={fileList} pagination={false} style={{marginTop:30}} />
      </Fragment>
    )
  }

  getUploadIcon = () => {
    const { localFileList } = this.state;
    const {maxCount,type} = this.props;
    switch (type) {
      // case "picture-card":
      case TYPE.PICTURE:
        const {readOnly} = this.props;
        const uploadButton = (
          <Fragment>
            <Icon type="plus" />
            <div className="ant-upload-text">请上传图片</div>
          </Fragment>
        );
        return localFileList.length>=Number(maxCount)||readOnly? null : uploadButton
      case  TYPE.FILE:
        return (
          <div>
            <Button style={{height:100,width:500}}>
              <div>
                <Icon type="file-add" style={{ fontSize: '30px', color: '#08c' }} theme='twoTone' />
              </div>
              <div>
                请选择文件上传
              </div>
            </Button>
          </div>
        )
      default:
        throw new Error('type类型错误')
    }
  }

  buildUploadClass = () => {
    const {readOnly,type} = this.props;
    // 不能修改就不展示上传的图标，但是图片需要展示图片墙
    if(readOnly&&type!==TYPE.PICTURE) return null;
    const { localFileList } = this.state;
    return  (
      <div>
        <Upload
          {...this.props}
          onRemove={this.removePicture}
          fileList={localFileList}
          onChange={this.handleStatusChange}
          beforeUpload={this.beforeUpload}
          onPreview={this.previewPicture}
          customRequest={this.customRequest}
          disabled={readOnly}
          {...defaultConfig[type]}
        >
          {this.getUploadIcon()}
        </Upload>
        {this.showRules()}
      </div>
    )
  }

  checkResponse = (value) => {
    const {  data,data:{code} } = value;
    if (code === 0) {
      return Promise.resolve(data)
    }
    return Promise.reject(new Error('上传失败'))
  }


  requestOnUpload = (params) => {
    uploadOptions.data = params;
    return axios(uploadOptions).then(this.checkResponse)
  }

  requestOnRemove = (params) => {
    removeOptions.params = params;
    return axios(removeOptions).then(this.checkResponse)
  }

  render() {
    const { pictureModal, localFileList, imgUrl} = this.state;
    const {type} = this.props;
    return (
      <div className={styles.myUpload}>
        {this.buildUploadClass()}
        {type !== TYPE.PICTURE&& this.buildFileTable(localFileList)}
        <Modal
          visible={pictureModal}
          footer={null}
          onCancel={this.closeModal}
          destroyOnClose
        >
          <img
            alt='首页图'
            style={{
              width: 476,
            }}
            src={imgUrl}
          />
        </Modal>
      </div>
    );
  }
}

export default FileUploadNew;

