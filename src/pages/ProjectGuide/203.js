import React, { createElement } from 'react';
import classNames from 'classnames';
import styles from '../../components/Exception/index.less';
import svg from './203.svg';

class Exception extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const clsString = classNames(styles.exception);
    return (
      <div className={clsString}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{ backgroundImage: `url('${svg}')` }}
          />
        </div>
        <div className={styles.content}>
          <h2>您的分辨率过低</h2>
          <div className={styles.desc}>请调整分辨率</div>
        </div>
      </div>
    );
  }
}

export default Exception;
