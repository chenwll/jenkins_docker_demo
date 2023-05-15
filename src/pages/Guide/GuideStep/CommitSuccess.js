import { Result, Button, Card } from 'antd';
import React, { Component } from 'react';
import { router } from 'umi';
import style from './style.less'

class CommitSuccess extends Component {
    render() {
        return (
            <Card style={{width:'100%' , height:'100%'}}>
                <Result
                    className={style.Result}
                    status="success"
                    title="恭喜你提交成功"
                    // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    extra={[
                    <Button type="primary" key="declare" onClick={() => router.push('/Guide/GuideList')}>
                        返回首页
                    </Button>,
                    <Button key="previousStep" onClick={() => router.goBack()}>返回上一步</Button>,
                    ]}
                />
            </Card>
        );
    }
}

export default CommitSuccess;
