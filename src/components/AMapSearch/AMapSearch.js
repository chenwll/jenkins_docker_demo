import React, { Component } from 'react';
import { Select,message } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;
class SearchAddress extends Component {
  static propTypes = {
    addressName:PropTypes.string,
    chooseOneItem: PropTypes.func,
  };

  static defaultProps = {
    addressName:'',
  };

  constructor(props) {
    super(props);
    this.state = {
      positionList:[],
    }
    this.handleMapEvents =  {
      created: () => {
        window.AMap.plugin('AMap.PlaceSearch', () => {
          new window.AMap.PlaceSearch();
        })
      },
    }
  }



  onSearch =(val)=>{
    const place = new window.AMap.PlaceSearch({
      city: '绵阳',
    })

    place.search(val,(status, result)=>{
      if(status === 'error') {
        message.error(result);
        return;
      }
      if(status === 'complete' && result.info === 'OK'){
        const {poiList:{pois}}=result
        if(pois && Array.isArray(pois)) {
          this.setState({
            positionList:pois
          })
        }
      }
    })
  }


  debounce = (fn,time) => {
    let timerId = null;
    return function (val) {
      if(timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      timerId = setTimeout(() => {
        fn.call(this,val)
      },time)
    }
  }

  onChange = (id) => {
    const { positionList } = this.state;
    const { chooseOneItem } = this.props;
    for(const item of positionList) {
      const { name:itemName,id:itemId } = item;
      if(itemId === id) {
        const {location : {lng,lat}} = item;
        const position = {longitude:lng,latitude:lat};
        if(typeof chooseOneItem === 'function'){
          chooseOneItem(position,itemName)
        }
      }
    }
  }



  render() {
    const {addressName, style} = this.props
    const {positionList} = this.state;
    return (
      <div style={style}>
        <Select
          value={addressName}
          style={{ width: 360 }}
          showSearch
          placeholder="请输入地址"
          onSearch={this.debounce((val) => this.onSearch(val),400)}
          onChange={this.onChange}
          optionFilterProp="children"
        >
          {
            positionList.map( item=>
              <Option key={item.id} value={item.id}>{item.name}</Option>
            )
          }
        </Select>
      </div>
    );
  }
}

export default SearchAddress;
