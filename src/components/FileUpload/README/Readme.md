# Api
| 参数 | 说明 | 类型     | 默认值 |
| --- | --- | -----| ---| 
|text|规则描述|string| / |
|maxCount| 最大上传文件数量,只有listType为picture-card才有用| number | 
|onValidate|上传前检测文件是否符合要求| Func(file) => Promise  | / |
|listType | 枚举类型,对应不同的样式 |text  / picture-card | / |
| onRemove | 删除文件时的操作 | Func(file) | / |
| onUpload | 上传文件时的操作 | Func(formData) | / |
 
# 示例


```js
handleUpload = (formData) => {
  const {dispatch} = this.props;
  dispatch({
    type:'pointManagementModel/uploadMiniPicture',
    payload:formData
  })
}

<FileUpload
  listType="picture-card"
  fileList={fileList}
  onUpload={this.handleUpload}
  onRemove={this.handleRemove}
  maxCount={4}
  text={`图片格式支持JPG、PNG、GIF 并且大小不能超过 ${FILE_SIZE_OBJECT.UPPERLIMIT.description}`}
/>
```




