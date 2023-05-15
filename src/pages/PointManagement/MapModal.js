import React, { Component, Fragment } from 'react';
import { Button, Col, Form, Icon, Input, Modal, Row, Skeleton } from 'antd';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import styles from './Point.less'
import { POINT_FLAG, POINT_FORM_TYPE,UPLOAD_TYPE } from '@/utils/Enum';
import FileUploadNew from '@/components/FileUploadNew/FileUploadNew';


@Form.create()
@connect(({pointManagementModel,loading})=>({
  pointManagementModel,
  homeLoading:loading.effects['pointManagementModel/getHomePoint'],
  pointLoading:loading.effects['pointManagementModel/getPoint']

}))
class MapModal extends Component {

  componentDidMount() {
    this.getDetailPoint()
  }

  getDetailPoint = () => {
    const {siteId,dispatch,pointType} = this.props;
    switch (pointType) {
      case POINT_FLAG.SHOW:
      case POINT_FLAG.EDIT:
        dispatch({
          type:'pointManagementModel/getPoint',
          payload:{
            siteId
          }
        })
        break;
      case POINT_FLAG.ALL:
        dispatch({
          type:'pointManagementModel/getHomePoint',
          payload:{
            siteId
          }
        })
        break;
      default:
        break;
    }
  }

  buildDescriptions = () => {
    const {
      pointManagementModel:{pointInfo},
      homeLoading,pointLoading
    }=this.props;
    const {name,address,leaderName,phoneNumber,introduce,departmentName,picUrl,content} = pointInfo;
    let file=[];
    if(picUrl){
      file = [{
        fileName:picUrl,
        bucketName: picUrl,
        objectURL: picUrl
      }]
    }
    return (
      <div>
        {
          file.length!==0&&
          <div style={{height:200}}>
            <Skeleton loading={homeLoading||pointLoading} active>
              <FileUploadNew
                className={styles.descriptionUpload}
                maxCount={1}
                type={UPLOAD_TYPE.PICTURE}
                fileList={file}
                readOnly
              />
            </Skeleton>
          </div>
        }
        <br />
        <Skeleton loading={homeLoading||pointLoading} active>
          <p className={styles.title}>{name}</p>
          <p className={styles.content}><Icon type="environment" /> {address}</p>
          <p className={styles.content}>
            {(leaderName||phoneNumber)&&<Icon type='phone' />} {leaderName} {phoneNumber}
          </p>
          <p className={styles.content}>
            {departmentName&&<Icon type="team" />} {departmentName}
          </p>
          <p className={styles.content}>
            {introduce}
          </p>
          <p className={styles.content}>
            {content}
          </p>
        </Skeleton>
      </div>
    )
  }

  buildFormItem = (pointInfo) => {
    console.log(pointInfo,'pointInfo');
    const {formFields=[]} = this.props;
    return formFields.map((fields) => {
      const { form: { getFieldDecorator } } = this.props;
      const {picUrl,thumbnail}=pointInfo;
      let file = [];
      if(picUrl&&thumbnail){
        file = [{
          fileName:thumbnail,
          bucketName: thumbnail,
          objectURL: picUrl
        }]
      }
      const {field, label,required, type, disabled,width,height,hidden,col,message} = fields;
      switch (type) {
        case POINT_FORM_TYPE.NORMAL:
          return (
            <>
              <Col span={col}>
                <Form.Item label={label} hidden={hidden}>
                  {getFieldDecorator(field, {
                    rules: [{ required ,message}],
                    initialValue:pointInfo[field],
                  })(
                    <Input disabled={disabled} style={{ width,height }} />
                  )}
                </Form.Item>
              </Col>
              {col&&<Col span={1} />}
            </>
          )
        case POINT_FORM_TYPE.THUMBNAIL:
          const {uploadProps} = fields;
          return (
            <Col>
              <Form.Item label={label} hidden={hidden}>
                {getFieldDecorator(field, {
                  rules: [{ required,message}],
                  initialValue:pointInfo[field],
                })(
                  <div className={styles.formUpload}>
                    <FileUploadNew
                      {...uploadProps}
                      key={label}
                      fileList={file}
                    />
                  </div>
                )}
              </Form.Item>
            </Col>

          )
        case POINT_FORM_TYPE.TEXT:
          return (
            <Row>
              <Col>
                <Form.Item label={label} hidden={hidden}>
                  {getFieldDecorator(field, {
                    rules: [{ required, message}],
                    initialValue:pointInfo[field],
                  })(
                    <Input.TextArea disabled={disabled} style={{width:'450px',height:'150px'}} />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          )
        case POINT_FORM_TYPE.BRAFTEDITOR:
          return (
            <Row>
              <Col>
                <Form.Item label={label} hidden={hidden}>
                  {getFieldDecorator(field, {
                    rules: [{ required, message}],
                    initialValue:pointInfo[field],
                  })(
                    <BraftEditor id='braft' className="my-editor" controls={["clear","font-size","text-color","bold","italic"]} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )
        case POINT_FORM_TYPE.OTHER:
          const {renderComponent} = fields;
          return (
            <>
              <Col span={col}>
                <Form.Item label={label} hidden={hidden}>
                  {getFieldDecorator(field, {
                    rules: [{ required ,message}],
                    initialValue:pointInfo[field],
                  })(
                    renderComponent()
                  )}
                </Form.Item>
              </Col>
              {col&&<Col span={1} />}
            </>
          )
        default:
          return (
            <Form.Item label={label} hidden={hidden}>
              {getFieldDecorator(field, {
                rules: [{ required ,message}],
                initialValue:pointInfo[field],
              })(
                <Input disabled={disabled} style={{ width,height }} />,
              )}
            </Form.Item>
          )
      }
    })
  }

  buildModalContext = () => {
    const { pointType } =  this.props;
    switch (pointType) {
      case POINT_FLAG.SHOW:
      case POINT_FLAG.ALL:
        return this.buildDescriptions()
      case POINT_FLAG.EDIT:
        const {pointManagementModel:{pointInfo}} = this.props;
        return (
          <Row>
            <Form className={styles.form}>
              {this.buildFormItem(pointInfo)}
            </Form>
          </Row>
        )
      case POINT_FLAG.ADD:
        const {pointManagementModel:{newPoint}} = this.props;
        return (
          <Row>
            <Form>
              {this.buildFormItem(newPoint)}
            </Form>
          </Row>
        )
      default:
        return null;
    }
  }

  getCurrentValue = () => {
    const {pointType} = this.props;
    const {form: {getFieldsValue}} = this.props;
    const {pointManagementModel:{pointInfo,newPoint,newPoint:{thumbnail}}}=this.props;
    switch (pointType) {
      case POINT_FLAG.SHOW:
        return { ...pointInfo,...getFieldsValue() }
      case POINT_FLAG.EDIT:
        return { ...pointInfo,...getFieldsValue() }
      case POINT_FLAG.ALL:
        return { ...pointInfo,...getFieldsValue() }
      case POINT_FLAG.ADD:
        // 表单里面的图片名是上传到本地的名字，所以要覆盖一下
        return {...newPoint,...getFieldsValue(),thumbnail}
      default:
        return null;
    }
  }

  buildFormBtn = () => {
    const {footerBtn} = this.props;
    const value = this.getCurrentValue()
    return footerBtn.map((item) => {
      const {text, type, func,key} = item;
      if(key === 'submit')  {
        return (
          <Button
            type={type}
            onClick={() =>func(value)}
          >
            {text}
          </Button>
        )
      }
      return <Button type={type} onClick={() =>func(value)}>{text}</Button>
    })
  }

  buildFooter = () => {
    const {pointType} = this.props;
    switch (pointType) {
      case POINT_FLAG.SHOW:
        return null;
      case POINT_FLAG.EDIT:
        return this.buildFormBtn()
      case POINT_FLAG.ALL:
        return null;
      case POINT_FLAG.ADD:
        return this.buildFormBtn()
      default:
        return null;
    }
  }

  render() {
    return (
      <Fragment>
        <Modal
          className={styles.modal}
          bodyStyle={{height:710,width:470}}
          title={null}
          style={{position:'absolute',right: 15,}}
          footer={this.buildFooter()}
          {...this.props}
        >
          {this.buildModalContext()}
        </Modal>
      </Fragment>
    );
  }
}

export default MapModal;

