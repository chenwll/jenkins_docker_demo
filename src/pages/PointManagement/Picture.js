import React, { Component } from 'react';
import FileUpload from '@/components/FileUpload/FileUpload';
import { connect } from 'dva';
import { TASK_COMMMIT_TYPE } from '@/utils/Enum';
import FileUploadNew from '@/components/FileUploadNew/FileUploadNew';

const FILE_SIZE_OBJECT = {
  UPPERLIMIT: {
    number: 10 * 1024 * 1024,
    description: '10MB',
  },
};

// const FILE_SIZE_OBJECT = {
//   UPPERLIMIT: {
//     number: 10 * 1024 * 1024,
//     description: '10MB',
//   },
// };

@connect(({pointManagementModel})=>({
  pointManagementModel,
}))

class UploadFile extends Component {
  handleUpload = (formData) => {
    const {dispatch} = this.props;
    dispatch({
      type:'pointManagementModel/uploadMiniPicture',
      payload:formData,
    })
  }

  handleRemove = (file) => {
    console.log('remove',file);
  }



  render() {
    const fileList = [
      {
        "bucketName": "myciv",
        'original':'cwl',
        "fileName": "9a9a9b07efe34f24811ce940e761dfbf.jpg",
        "objectURL": "http://47.92.112.6:9000/myciv/9a9a9b07efe34f24811ce940e761dfbf.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=smlminio%2F20230328%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230328T150006Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=b39cb12c3795695abf2b4fa8f4bd1109f88ecb9977054966446fe9192bc6b507"
      },
      {
        "bucketName": "myciv",
        "fileName": "9ea976db6f7e4e9aadd619bc6f3a6e61.jpg",
        "objectURL": "http://47.92.112.6:9000/myciv/9ea976db6f7e4e9aadd619bc6f3a6e61.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=smlminio%2F20230328%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230328T152253Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=a499305d302aeec782317a72e94c66b8e1767ce55e5bb172ca7231f955a96f74"
      },
      {
        "bucketName": "myciv",
        "fileName": "ff8376c3ce304c56839bbfbcdb613bf6.jpg",
        "objectURL": "http://47.92.112.6:9000/myciv/ff8376c3ce304c56839bbfbcdb613bf6.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=smlminio%2F20230328%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230328T152417Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ad6a0c6cafeb09b3a146348a4331d3e12f08617fc857d3d9df3bc588d3d119b3"
      }
    ];
    return (
      <>
        <FileUploadNew
          listType='text'
          fileList={fileList}
          onUpload={this.handleUpload}
          showUpload={false}
          onRemove={this.handleRemove}
          maxCount={3}
          text={`文件格式支持docx,并且大小不能超过 ${FILE_SIZE_OBJECT.UPPERLIMIT.description}`}
          type={1}
        />
        <br />
        <br />
        <br />
        <br />
        <FileUploadNew
          listType="picture-card"
          fileList={fileList}
          onUpload={this.handleUpload}
          // showUpload={false}
          onRemove={this.handleRemove}
          maxCount={2}
          type={0}
          text={`图片格式支持JPG、PNG、GIF 并且大小不能超过 ${FILE_SIZE_OBJECT.UPPERLIMIT.description}`}
        />
      </>
    );
  }
}

export default UploadFile;
