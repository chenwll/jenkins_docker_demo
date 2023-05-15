import React, { PureComponent } from 'react';
import router from 'umi/router';
import {  Card,Button} from 'antd';

class Instruction extends PureComponent {

onClick=()=>{
  const {match:{params}}=this.props;
  router.push(`/PersonalProject/basicInfo/step1/${params.id}`);

}

  render() {
    return(
      <Card bordered={false} style={{textAlign:'center'}}>
        <h2>申报书填写说明</h2>
        <div style={{textAlign:'left',fontSize:'16px'}}>
          <p>
            1.成功申报项目需要您按顺序填写申报书、试点方案和项目联系人等申报项目所需信息。
          </p>
          <p>
            2.在填写申报相关信息时，标有红色“*”的项是必填项，需要您准确填写。
            如果您的填写不正确，可能会导致您申报项目不成功的结果。
          </p>
          <p>
            3.在填写试点方案时，请注意上传文件的格式要求，如果您未按照规则上传，可能会导致上传失败。
          </p>
          <p>
            4.请准确填写项目联系人信息，如果您未准确填写，可能会无法及时接收到相关通知。
          </p>
          <p>
            5.填写好后，页面将会自动跳转到“我的项目”页面，在这里你可以修改或者删除您的申报书。
          </p>
          <p>
            6. 在确认申报书内容无误后，即可提及您的申报书。
          </p>
        </div>
        <Button onClick={this.onClick} type='primary'>
          已阅读
        </Button>
      </Card>
    )

  }


}

export default Instruction;
