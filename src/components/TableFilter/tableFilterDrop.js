import { Button, Checkbox, Col, Row } from 'antd';
import React, { Component } from 'react';
import style from './style.less'
import FooterToolbar from '@/components/FooterToolbar';
class TableFilterDrop extends Component {
    state = {
        value:[],
    }
    //点击筛选函数
    checkBoxChange = (checkedValues) => {
        const { onFilter, filterKey, returnCheckData} = this.props
        if(returnCheckData && filterKey){
            returnCheckData({[filterKey]:checkedValues})
        }else{
            console.error('onFilter and returnCheckData is requred');
        }
        this.setState({
            value:checkedValues
        })
    }
    //数据渲染函数
    checkBoxListRender = () => {
        const { filters } = this.props 
        return  filters.map((item)=>{
            return (
                <Col span={24} key={item.value}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                </Col>
            )
        })
    }
    render() {
        const { filters } = this.props 
        const { value } = this.state
        return (
            <div className={style.checkBoxGroup}>
                <Checkbox.Group 
                    value={value}
                    onChange={this.checkBoxChange}
                    style={{marginBottom:"60px"}}
                >
                  <Row>
                    {this.checkBoxListRender()}
                  </Row>
                </Checkbox.Group>
                <div className={style.bottomBtnDiv}>
                    <Button type="primary" onClick={() => {this.checkBoxChange([])}} className={style.bottomBtn}>重置</Button>
                </div>
            </div>
        );
    }
}

export default TableFilterDrop;

