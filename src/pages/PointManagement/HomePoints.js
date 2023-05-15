import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import AMapInfo from '@/components/AMapInfo/AMapInfo';
import { MIAN_YANG_LNGLAT, POINT_FLAG } from '@/utils/Enum';
import MapModal from '@/pages/PointManagement/MapModal';

@Form.create()
@connect(({pointManagementModel})=>({
  pointManagementModel,
}))
class HomeMap extends Component {

  constructor(props) {
    super(props);
    this.state={
      modalVisible:false,
      siteId:1,
    }
    // this.timer = null;
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'pointManagementModel/getAllPoints',
    })
  }

  componentWillUnmount() {
    // clearTimeout(this.timer)
  }

  clickMarker = (id) => {
    // this.openModal()
    this.setState({
      siteId:id,
      modalVisible:true,
    })
  }

  mergeLatLog = (points) => points.map((item) => {
      const {latitude=MIAN_YANG_LNGLAT.LATITUDE,longitude=MIAN_YANG_LNGLAT.LONGITUDE} = item;
      const val = {...item};
      val.position = { latitude:Number(latitude), longitude:Number(longitude) };
      return val;
    })

  openModal = () => {
    this.setState({
      modalVisible:true
    })
  }

  closeModal = () => {
    this.setState({
      modalVisible:false
    })
  }


  render() {
    const { modalVisible,siteId } = this.state;
    const {pointManagementModel:{allPoints}}=this.props;
    const points = this.mergeLatLog(allPoints);
    return (
      <div style={{ width: '100%', height: window.screen.height - 240}}>
        <AMapInfo
          // getFormValue={this.editPositions}
          positions={points}
          formVisible={false}
          formBtnList={null}
          clickMarker={this.clickMarker}
        />
        <MapModal
          visible={modalVisible}
          siteId={siteId}
          onCancel={this.closeModal}
          pointType={POINT_FLAG.ALL}
          key={siteId}
        />
      </div>
    );
  }
}

export default HomeMap;
