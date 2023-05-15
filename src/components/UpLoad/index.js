import React, { PureComponent } from 'react';
import { Upload, Row, Modal, Button, Icon } from 'antd';
import { checkBeforeFileUpload } from '../../utils/utils';
import remoteLinkAddress from "../../utils/ip";

const {confirm} = Modal;
export default class UpLoadList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeFlag:0,
    };
  }

  handleChange = ({fileList}) => {
    const {getUploadData}=this.props;
    this.setState({
      changeFlag: 1,
    })
    fileList.map((value, index) => {
      if (value.response && value.response.code === 1) {
        value.status = 'error';
      }
    })
    let str = '';
    if (fileList.length !== 0) {
      fileList.map((value, index) => {
        //  新增加的文件
        if (value.response&& value.response.code === 0&& value.status !== 'error') {
          str += `${value.response.data  };`;
        }
        //  原本就有的文件
        else if (value.status !== 'error')
          str += `${value.uid  };`;
      });
      this.setState({
        attIds: str,
      })
    }
    this.setState({
      fileList:[...fileList]
      });
    if(getUploadData){
      getUploadData(fileList,this.state.attIds,this.state.changeFlag)
    }

  };

  onRemoveFile = (file) => new Promise((resolve,reject)=>{
    confirm({
      title: '是否删除附件',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        this.handleRemoveFile(file);
        return resolve(true);
      },
      onCancel:()=>reject(false)
    })
  });

  handleRemoveFile = (file) => {
    const {dataList} = this.props;
    if(dataList.attIds){
      const materialArr = dataList.attIds.split(';');
      for (let i = 0; i < materialArr.length; i++) {
        if (materialArr[i] == file.uid) {
          materialArr.splice(i, 1);
          break;
        }
      }
      if (materialArr.length > 0) {
        dataList.attIds = materialArr.join(';');
      }
      else {
        dataList.attIds = '';
      }

      for (let i = 0; i < dataList.attFiles.length; i++) {
        if (dataList.attFiles[i].id == file.uid) {
          dataList.attFiles.splice(i, 1);
          break;
        }
      }
    }

    return dataList;
  };
  render() {
    const {changeFlag,fileList}=this.state;
    const {files}=this.props;
    const url = remoteLinkAddress();
    const props = {
      name: 'file',
      action: `${url}/api/files/upload`,
      listType: 'text',
      headers: {
        token: sessionStorage.getItem("token"),
      },
      fileList: changeFlag?fileList:files,
      onChange: this.handleChange,
      beforeUpload:checkBeforeFileUpload,
      onRemove: this.onRemoveFile,
      accept:".zip,.rar,.doc,.docx,.png,.xls,xlsx,application/pdf",
    };
    return  <Upload {...props}>
      <Button>
        <Icon type="upload" /> Click to Upload
      </Button>
    </Upload>
  }
}
