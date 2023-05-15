import React, { Component } from 'react';
import { BackTop, Icon } from 'antd';
import style from './index.less'
class BackTopM extends Component {
    render() {
        return (
            <div>
                <BackTop>
                    <div className={style.antBackTop}>
                        <Icon type="rocket" />
                    </div>
                </BackTop>
                <strong></strong>
            </div>
        );
    }
}

export default BackTopM;
