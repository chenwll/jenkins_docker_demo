import React, { PureComponent } from 'react';
import style from './index.less'
class GuideDescription extends PureComponent {
    constructor(props){
        super(props)
    }

    render(){
        const { title,children } = this.props
        return (
            <div className={style.main} {...this.props}>
                <div className={style.title}>{title}</div>
                <div className={style.content}>
                    {children}
                </div>
            </div>
        );
    }
}

export default GuideDescription;
