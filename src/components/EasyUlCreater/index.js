import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './ulStyle.css';
import {Row,Col,Form} from 'antd';

const FormItem = Form.Item;
export default class EasyUlCreater extends PureComponent{
  static propTypes={
    liarr : PropTypes.array.isRequired,
  };

  static defaultProps = {
    liarr: ['暂无可用数据'],
  }



  constructor(props){
    super(props);
    this.state={};
  }

  renderUl=()=>{
    const {liarr=[]}=this.props;
    return (
      liarr.map((item,index)=>{
        return  <li key={index}>{`${index+1}.${item}`}</li>
      })
    )
  };

  render(){
    const {liarr ,...otherProps}=this.props;
    return(
      <FormItem label={'上传注意事项'} {...otherProps}>
          <div className={style.ulDiv}>
            <ul>{this.renderUl()}</ul>
          </div>
      </FormItem>
    )
  }
}
