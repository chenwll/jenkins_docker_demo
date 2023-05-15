import { Button, Modal, Skeleton, Input, Spin } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva'
import FileUploadNew from '@/components/FileUploadNew/FileUploadNew';
import { DECLARATION_MODEL_TITLE, TASK_COMMMIT_TYPE } from '@/utils/Enum';

const { TextArea } = Input;
@connect(({personalProjectModal,loading}) => ({
    personalProjectModal,
    loadingFileMessage: loading.effects['personalProjectModal/getFileMessageById'] ||loading.effects['CommitReviewModel/getFileMessageById'] ,
  }))

class UploadModal extends PureComponent {
    render() {
        const { onCancel,onOk,visible,onUpload,fileList=[],onRemove, type,readonly,loading:modalLoading,
            isUploadLoading, uploadBeforeState,loadingFileMessage,description,textOnchange
        } = this.props
        const title = type && DECLARATION_MODEL_TITLE[String(type)]
        const footerBtn = (
          <Fragment>
            <Button onClick={onCancel}>取消</Button>
            <Button onClick={onOk} type='primary' loading={isUploadLoading}>确认</Button>
          </Fragment>
        )
        const textInput = (
          <Fragment>
            <TextArea
              value={description || ''}
              onChange={textOnchange}
            />
          </Fragment>
        )

      const loading  = modalLoading|| false;
        const {key} = this.props;
        const fileUploadDom = (
          <FileUploadNew
            type={type}
            onUpload={onUpload}
            fileList={fileList}
            onRemove={onRemove}
            readOnly={readonly}
            checkLoading={uploadBeforeState}
            key={key}
          />
        )
        const selectDom = type === TASK_COMMMIT_TYPE.TEXT ? textInput : fileUploadDom
        return (
          <Fragment>
            <Modal
              title={title}
              onCancel={onCancel}
              onOk={onOk}
              visible={visible}
              width={600}
              footer={footerBtn}
              destroyOnClose
              {...this.props}
            >
              <Spin spinning={loading}>
                {
                  loadingFileMessage ? <Skeleton /> : selectDom
                }
              </Spin>
            </Modal>
          </Fragment>
        );
    }
}

export default UploadModal;
