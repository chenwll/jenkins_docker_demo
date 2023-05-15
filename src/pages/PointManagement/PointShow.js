import React, { Component } from 'react';
import { connect } from 'dva';
import AMapInfo from '@/components/AMapInfo/AMapInfo';
import { MIAN_YANG_LNGLAT, POINT_FLAG } from '@/utils/Enum';
import MapModal from '@/pages/PointManagement/MapModal';



@connect(({pointManagementModel})=>({
  pointManagementModel,
}))
class PointSHow extends Component {

  constructor(props) {
    super(props);
    this.state={
      modalVisible:false
    }
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.openModal()
    },600)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  clickMarker = () => {
    this.openModal()
  }

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
    const {
      pointManagementModel:{pointInfo},
      match : { params:{id} }
    }=this.props;
    const {latitude=MIAN_YANG_LNGLAT.LATITUDE, longitude=MIAN_YANG_LNGLAT.LONGITUDE} = pointInfo;
    const {modalVisible} = this.state;

    const marker = {
      ...pointInfo,
      position: {latitude,longitude},
    }

    return (
      <div style={{ width: '100%', height:window.screen.height - 240}}>
        <AMapInfo
          marker={marker}
          formVisible={false}
          formBtnList={null}
          clickMarker={this.clickMarker}
        />
        <MapModal
          visible={modalVisible}
          siteId={id}
          onCancel={this.closeModal}
          pointType={POINT_FLAG.SHOW}
          footer={null}
        />
      </div>
    );
  }
}

export default PointSHow;
