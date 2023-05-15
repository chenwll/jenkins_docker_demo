import React, { Component, Fragment } from 'react';
import {  Map, Marker, Markers } from 'react-amap';
import PropTypes from 'prop-types';
import {  message, } from 'antd';
import { MAP_KEY, MIAN_YANG_CITY_CODE, } from '@/utils/Enum';





class AdvancedMap extends Component {
  static propTypes = {
    plugins: PropTypes.array,
    formVisible:PropTypes.bool,
  };

  static defaultProps = {
    plugins: ["ToolBar", 'Scale'],
    formVisible:false,
  };



  constructor(props) {
    super(props);
    this.markserInstance = null
    this.handleMapEvents = {
      created: () => {
        window.AMap.plugin('AMap.PlaceSearch', () => new window.AMap.PlaceSearch({
          })
        )
        window.AMap.plugin('AMap.Geocoder', () =>
          new window.AMap.Geocoder({
            city: MIAN_YANG_CITY_CODE
          })
        )
      },

      click: (e) => {
        const { lnglat: {lng,lat} } = e;
        const { clickMap } = this.props;
        const lnglatObj = {
          longitude:lng,
          latitude:lat,
        }
        const lnglatArr = [lng,lat]
        this.transferLnglatToAddress(lnglatArr).then((formattedAddress) => {
          if(typeof clickMap === 'function') {
            message.success(`当前点位地址设置为${formattedAddress}`)
            clickMap(lnglatObj,formattedAddress)
          }
          // if(formVisible) {
          //   const rest = this.getMarkerInfo()
            // const obj = Object.assign(rest,lnglatObj,{address:formattedAddress});
            // this.setFormValue(obj)
            // this.openModal(obj)
          // }
        }).catch(err => {
          message.error(err)
        })
      }
    }
    this.markersEvents = {
      created:() => {
        console.log('create markers');
      },
      click: (MapsOption, marker) => {
        this.markserInstance = marker;
        const data = marker.getExtData();
        const {siteId} = data;
        const {clickMarker} = this.props;
        clickMarker(siteId)
        // this.setFormValue(data)
        // this.openModal()
      },
    }

    this.editorEvents = {
      created: () => {console.log()},
      addnode: () => {console.log('polyeditor addnode')},
      adjust: () => {console.log('polyeditor adjust')},
      removenode: () => {console.log('polyeditor removenode')},
      end: () => {console.log('polyeditor end')},
    }

    this.singleMarkerEvents = {
      created: (instance) => {
        const {marker:{position,...rest}} = this.props;
        instance.setExtData({ ...rest })
        this.markserInstance = instance
      },
      click: () => {
        const {clickMarker} = this.props;
        const {lng,lat} = this.markserInstance.getPosition();
        const lnglatArr = [lng,lat]
        this.transferLnglatToAddress(lnglatArr).then(() => {
          // this.openModal()
          clickMarker()
        }).catch((err) => {
          message.error(err)
        })
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  // getMapType = () => {
  //   const {pathname} = window.location;
  //     switch (pathname) {
  //       case '/PointManagement/PointAdd':
  //         return 'ADD';
  //       case '/PointManagement/HomePoints':
  //         return 'ALL';
  //       case '/PointManagement/PointShow':
  //         return 'SHOW';
  //       case  '/PointManagement/PointEdit':
  //         return 'EDIT'
  //       default:
  //         return null;
  //     }
  // }



  // compose = (...args) => args.reduce((acc,cur) => (x) => {
  //   const res = acc(x);
  //   if(!res) return;
  //   return cur(res)
  // })

  transferLnglatToAddress = (lnglat) => new Promise((resolve, reject) => {
      const geocoder = new window.AMap.Geocoder({
        city: MIAN_YANG_CITY_CODE
      })
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const { regeocode :{formattedAddress}} = result;
          resolve(formattedAddress)
        }
        reject(new Error('地址解析失败'))
      })
    })


  // flattenObject = (obj) => {
  //   const result = {};
  //   const flatten = (object) => {
  //     Object.keys(object).forEach(key => {
  //       const propValue = object[key];
  //       if (typeof propValue === 'object' && !Array.isArray(propValue)) {
  //         flatten(propValue);
  //       } else {
  //         result[key] = propValue;
  //       }
  //     });
  //   }
  //   flatten(obj);
  //   return result;
  // }


  // closeModal = () => {
  //   const {form: {getFieldsValue},marker,closeModal} = this.props;
  //   const value = getFieldsValue()
  //   const newVal = {...marker,...value}
  //   if(closeModal){
  //     closeModal(newVal)
  //   }
  // }



  createMarker = () => {
    const {marker} = this.props;
    if(marker) {
      const {marker:{position:singlePosition}} = this.props;
      return <Marker position={singlePosition} events={this.singleMarkerEvents}  />
    }
    const {positions} = this.props;
    if(Array.isArray(positions)&&positions.length > 1) {
      return (
        <Markers markers={positions} useCluster events={this.markersEvents} />
      )
    }
  }

  getMarkerInfo = () => this.markserInstance?.getExtData()

  // getMarkerPosition = () => this.markserInstance?.getPosition()


  calculateCenter = (positions) => {
    const {marker} = this.props;
    if(marker&&typeof marker === 'object'){
      const {marker:{position}} = this.props;
      return position;
    }
    const numPositions = positions.length;
    if(numPositions === 1){
      return positions[0]
    }

    let totalLatitude = 0;
    let totalLongitude = 0;

    for(const item of positions) {
      const {position} = item
      if(Number.isNaN(position.latitude) || Number.isNaN(position.longitude)) continue;
      const latitudeRadians = position.latitude * Math.PI / 180;
      const longitudeRadians = position.longitude * Math.PI / 180;
      totalLatitude += latitudeRadians;
      totalLongitude += longitudeRadians;
    }
    const avgLatitudeRadians = totalLatitude / numPositions;
    const avgLongitudeRadians = totalLongitude / numPositions;

    const centerLatitude = avgLatitudeRadians * 180 / Math.PI;
    const centerLongitude = avgLongitudeRadians * 180 / Math.PI;

    return {latitude: centerLatitude, longitude: centerLongitude};
  }


  // validateForm = () => {
  //   const {form:{validateFields}} = this.props;
  //   let formFill = true;
  //   validateFields((err) => {
  //     if(err) {
  //       formFill = false;
  //     }
  //   })
  //   return formFill;
  // }

  // setFormValue = (data) => {
  //   const {form:{setFieldsValue}} = this.props;
  //   setFieldsValue(data);
  //   return true;
  // }

  // buildBtn = (formBtnList=[]) => {
  //   if(typeof formBtnList === 'object' && !formBtnList) return null;
  //   const {marker,marker:{position}} = this.props;
  //   const {form: {getFieldsValue}} = this.props;
  //   const rest  = this.markserInstance&&this.markserInstance?.getExtData().rest
  //   const newValue = {...marker,...rest,...position,...getFieldsValue()}
  //   console.log(newValue);
  //   return formBtnList.map((item) => {
  //     const {text, type, func,key} = item;
  //     if(key === 'submit')  {
  //       return (
  //         <Button
  //           type={type}
  //           onClick={this.compose(
  //             this.validateForm,
  //             () => {func(newValue);return true;},
  //             this.closeModal,
  //           )}
  //         >
  //           {text}
  //         </Button>
  //       )
  //     }
  //     return <Button type={type} onClick={this.compose(func,this.closeModal)}>{text}</Button>
  //   })
  // }

  // buildDescriptionsItem = () => {
  //   let data = {};
  //   const {marker} = this.props;
  //   if(marker){
  //     data = marker;
  //   }else {
  //     data = this.getMarkerInfo()||{};
  //   }
  //   const {name,address,leaderName,phoneNumber,introduce,parentDeptName} = data;
  //   let file = [];
  //   const { picUrl} = data;
  //   if(picUrl) {
  //     file = [{
  //       fileName:picUrl,
  //       bucketName: picUrl,
  //       objectURL: picUrl
  //     }]
  //   }
  //   return (
  //     <div>
  //       <div style={{height:200}}>
  //         <div>
  //           <FileUpload
  //             className={styles.descriptionUpload}
  //             accept='.jpg,.png,.gif'
  //             maxCount={1}
  //             listType="picture-card"
  //             type={TASK_COMMMIT_TYPE.PICTURE}
  //             fileList={file}
  //             disabled
  //           />
  //         </div>
  //       </div>
  //       <br />
  //       <p className={styles.title}>{name}</p>
  //       <p className={styles.content}><Icon type="environment" /> {address}</p>
  //       <p className={styles.content}>
  //         {(leaderName||phoneNumber)&&<Icon type='phone' />}
  //         <p>{leaderName} {phoneNumber}</p>
  //       </p>
  //       <p className={styles.content}>{parentDeptName&&<Icon type="team" />}  {parentDeptName}</p>
  //       <p className={styles.content}>
  //         {introduce}
  //       </p>
  //     </div>
  //   )
  // }

  render() {
    const { plugins,positions,marker} = this.props;
    // console.log(marker,'markers');
    const center = this.calculateCenter(positions)
    return (
      <Fragment>
        <Map
          amapkey={MAP_KEY}
          plugins={plugins}
          events={this.handleMapEvents}
          zoom={17}
          center={center}
          doubleClickZoom={false}
        >
          {this.createMarker()}
        </Map>
      </Fragment>
    );
  }
}

export default AdvancedMap;

