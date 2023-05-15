import React, {  Fragment } from 'react';
import { Button, Icon, message, Modal, Progress, Table, Tag, Upload } from 'antd';
import PropTypes from 'prop-types';
import styles from './FileUpload.less'
import { TASK_COMMMIT_TYPE } from '@/utils/Enum';


const {PICTURE,TEXT,FILE,RICHTEXT} = TASK_COMMMIT_TYPE
const REG = {
  [TEXT]: /\.(png|jpg)$/,
  [FILE]:   /\.(txt|docx|pdf|csv|xls|doc|xlsx)$/,
  [RICHTEXT]:  /\.(png|jpg)$/,
  [PICTURE]: /\.(png|jpg)$/,
}

const fileNameRegular = {
  reg: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}.*$/,
  msg: '文件名只能由数字，字母和中文构成,且长度不超过50',
};
const splitFileName = {
  reg: /(.*\/)*([^.]+).*/ig,
  msg: '截取文件名称',
};
const FileSizeLimit = {
  'png':{
    UPPER_LIMIT: {
      number: 10 * 1024 * 1024,
      description: '10MB',
    },
    LOWER_LIMIT: {
      number:  1024,
      description: '1KB',
    },
  },
  'jpg':{
    UPPER_LIMIT: {
      number: 10 * 1024 * 1024,
      description: '10MB',
    },
    LOWER_LIMIT: {
      number: 10 * 1024,
      description: '10KB',
    },
  },
  'txt':{
    UPPER_LIMIT: {
      number: 20 * 1024 * 1024,
      description: '20MB',
    },
    LOWER_LIMIT: {
      number: 10 * 1024,
      description: '10KB',
    },
  },
  'docx':{
    UPPER_LIMIT: {
      number: 20 * 1024 * 1024,
      description: '20MB',
    },
    LOWER_LIMIT: {
      number: 10 * 1024,
      description: '10KB',
    },
  },
  'pdf':{
    UPPER_LIMIT: {
      number: 20 * 1024 * 1024,
      description: '20MB',
    },
    LOWER_LIMIT: {
      number: 10 * 1024,
      description: '10KB',
    },
  },
  'xls':{
    UPPER_LIMIT: {
      number: 20 * 1024 * 1024,
      description: '20MB',
    },
    LOWER_LIMIT: {
      number: 10 * 1024,
      description: '10KB',
    },
  },
  'xlsx':{
    UPPER_LIMIT: {
      number: 20 * 1024 * 1024,
      description: '20MB',
    },
    LOWER_LIMIT: {
      number: 10 * 1024,
      description: '10KB',
    },
  }
}



class FileUpload extends React.PureComponent {
  static propTypes = {
    fileList:PropTypes.array,
    disabled:PropTypes.bool,
    maxCount:PropTypes.number,
  };

  static defaultProps = {
    disabled:false,
    maxCount:1,
    showUpload:true,
  };

  constructor(props) {
    super(props);
    this.state={
      pictureModal:false,
      downloadModal:false,
      fileList:[],
      downloadPercent:0,
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
      fileList:files,
    })
  }

  componentWillUnmount() {
    this.setState({
      fileList:[]
    })
  }

  success = (percent,name) => {
    // if(!this.downloadQue.includes(name)) return;
    const hide = message.loading(<Progress percent={percent} size="small" />, 0);
    if(percent === 100) {
      hide()
      const que = this.downloadQue.filter((item) => item !== name)
      this.downloadQue = que;
    }
  };

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

  checkFileName = (file) => {
    const pointAppearTimes = file.name.split('.').length - 1;
    if (pointAppearTimes !== 1) {
      throw new Error('文件名错误');
    }
    let fileName = file.name;
    fileName = fileName.replace(splitFileName.reg, '$2');
    if(!fileNameRegular.reg.test(fileName)){
      throw new Error(fileNameRegular.msg)
    }
    return file;
  }

  checkFileExtension = (file) => {
    const {type} = this.props;
    const test = REG[type].test(file.name)
    if(test) {
      return file;
    }
    throw new Error('文件类型错误')
  }

  checkFileSizeLimit = (file) => {
    const {size} = file;
    const extendsName = file.name.split('.').pop()
    if(!FileSizeLimit[extendsName]) throw new Error(`不支持上传${extendsName}类型的文件`)
    const {UPPER_LIMIT,LOWER_LIMIT} = FileSizeLimit[extendsName]
    if(size < LOWER_LIMIT.number || size > UPPER_LIMIT.number) {
      throw new Error(`文件大小应该在${ LOWER_LIMIT.description} - ${UPPER_LIMIT.description}范围内` )
    }
    return file;
  }

  checkCompose = (...func) => func.reduce((acc,cur) => (file) => cur(acc(file)))

  beforeUpload = (file) => {
    try{
      this.checkCompose(this.checkFileExtension, this.checkFileName, this.checkFileSizeLimit)(file)
    }catch (err) {
      message.error(err.message)
      return Promise.reject();
    }
    return Promise.resolve()
  }


  removePicture = (file) => {
    console.log('remove');
    const { fileList } = this.state;
    const filterArr = fileList.filter((item) => item.uid !== file.uid)
    const {onRemove} = this.props;
    console.log(filterArr);
    onRemove(file)
    this.setState({
      fileList:filterArr
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
      fileList:[...fileList]
    })
  }

  customRequest =  (options) => {
    const { onUpload } = this.props;
    const formData = new FormData();
    formData.append('file',options.file )
    onUpload(formData)
    setTimeout(() => { options.onSuccess() },2500)
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
    this.setState({
      downloadModal:true
    })
    this.downloadQue.push(name)
    const xhr = new XMLHttpRequest();
    const hide = message.loading(`${name} 下载中`, 0);
    xhr.open('GET',link)
    xhr.responseType = 'blob'
    xhr.send()

    // let percent = 0;
    // message.loading(<Progress percent={percent} size="small" />)
    xhr.onprogress = (event) =>{
      // percent = Math.floor((event.loaded/event.total)*100)
      // this.success(percent,name)
      // this.setState({
      //   downloadPercent:percent
      // })
        // 定期触发
        // event.loaded —— 已经下载了多少字节
        // event.lengthComputable = true，当服务器发送了 Content-Length header 时
        // event.total —— 总字节数（如果 lengthComputable 为 true）
      // alert(`Received ${event.loaded} of ${event.total}`);
      // console.log(`Received ${event.loaded} of ${event.total}`);
    };
    xhr.onload =  () => {
      const fileBlob = xhr.response;
      const blobUrl =  URL.createObjectURL(fileBlob);
      this.clickAElement(blobUrl,name)
      // this.setState({
      //   downloadModal:false
      // })
      hide()
      message.success('下载成功')
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
    const {type,disabled} = this.props;
    switch (type) {
      case TASK_COMMMIT_TYPE.PICTURE:
        return(
          !disabled&&
            <div>
              <div className={styles.textDescription}>
                {`图片仅支持上传.png .jpg格式，且大小不超过${FileSizeLimit.png.UPPER_LIMIT.description}`}
              </div>
              <div className={styles.textDescription}>
                {fileNameRegular.msg}
              </div>
            </div>
        )
      case TASK_COMMMIT_TYPE.FILE:
      case TASK_COMMMIT_TYPE.TEXT:
      case TASK_COMMMIT_TYPE.RICHTEXT:
        return (
          <div>
            <div className={styles.textDescription}>
              1. 文件名只能由数字，字母和中文构成,且长度不超过50
            </div>
            <div className={styles.textDescription}>
              {`2.txt文件大小应该在${FileSizeLimit.txt.LOWER_LIMIT.description} - ${FileSizeLimit.txt.UPPER_LIMIT.description}之间`}
            </div>
            <div className={styles.textDescription}>
              {`3.docx文件大小应该在${FileSizeLimit.docx.LOWER_LIMIT.description} - ${FileSizeLimit.docx.UPPER_LIMIT.description}之间`}
            </div>
            <div className={styles.textDescription}>
              {`4.pdf文件大小应该在${FileSizeLimit.pdf.LOWER_LIMIT.description} - ${FileSizeLimit.pdf.UPPER_LIMIT.description}之间`}
            </div>
          </div>
        )
      default:
        return null;
    }
  }

  getColumns = () => {
    const {showUpload} = this.props;
    if(showUpload) {
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
          render:(text) => {
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
          render:(text) => {
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
    const { fileList } = this.state;
    const {maxCount,type} = this.props;
    switch (type) {
      // case "picture-card":
      case TASK_COMMMIT_TYPE.PICTURE:
        const {showUpload} = this.props;
        const uploadButton = (
          <Fragment>
            <Icon type="plus" />
            <div className="ant-upload-text">请上传图片</div>
          </Fragment>
        );
        return fileList.length>=Number(maxCount)||!showUpload? null : uploadButton
      case  TASK_COMMMIT_TYPE.FILE:
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
        );
    }
  }

  showUpload = () => {
    const {showUpload=true,type} = this.props;
    if(!showUpload&&type!==TASK_COMMMIT_TYPE.PICTURE) return null;
    const { fileList } = this.state;
    return  (
      <div>
        <Upload
          {...this.props}
          onRemove={this.removePicture}
          fileList={fileList}
          showUploadList={type === TASK_COMMMIT_TYPE.PICTURE}
          onChange={this.handleStatusChange}
          beforeUpload={this.beforeUpload}
          onPreview={this.previewPicture}
          customRequest={this.customRequest}
          listType={type === TASK_COMMMIT_TYPE.PICTURE? 'picture-card':'text'}
        >
          {this.getUploadIcon()}
        </Upload>
        {this.showRules()}
      </div>
    )
  }

  render() {
    const { pictureModal, fileList, imgUrl} = this.state;
    const {type} = this.props;
    return (
      <div className={styles.myUpload}>
        {this.showUpload()}
        {type !== TASK_COMMMIT_TYPE.PICTURE&& this.buildFileTable(fileList)}
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

export default FileUpload;

