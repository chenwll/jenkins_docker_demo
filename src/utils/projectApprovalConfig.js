import * as utils from './utils';
import { Fragment } from 'react';
import React from 'react';
import {Popover} from 'antd';

export const searchList = [
  {
    title: '指南简称',
    field: 'guideBrief',
    type: 'input',
  },
];

export const searchListProjectDetail = [
  {
    title: '试点单位',
    field: 'pilotUnit',
    type: 'input',
  },
  {
    title: '项目负责人',
    field: 'prjOwner',
    type: 'input',
  },
];

export const columnsProjectDetail = [
  {
    title:'序号',
    dataIndex:'index',
    key:'index',
    align: 'center',
    render:(text,record,index)=>{
      return(
        <span>{index+1}</span>
      )
    }
  },
  {
    title:'项目名称',
    dataIndex:'projectName',
    key:'projectName',
  },
  {
    title : '项目负责人',
    dataIndex : 'prjOwner',
    key : 'prjOwner',
  },
  {
    title : '试点单位',
    dataIndex : 'pilotUnit',
    key : 'pilotUnit',
  },
]

export const distributionSearchListProjectDetail = [
  {
    title: '试点单位',
    field: 'pilotUnit',
    type: 'input',
  },
  {
    title: '项目负责人',
    field: 'prjOwner',
    type: 'input',
  },
];

export const ListColumns =  [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    align: 'center',
    render: (text, record, index) => <span>{index + 1}</span>,
    width: 100,
  },
  {
    title: '指南名称',
    dataIndex: 'guideName',
    key: 'guideName',
    align: 'left',
    render: (record = "") => {
      let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
      if (data.length > 4) {
        data = data.substring(0, 3);
        data += "......"
      }
      return (
        <Popover
          content={record}
          autoAdjustOverflow
          mouseEnterDelay={0.2}
          placement='right'
        >
          <a>{data}</a>
        </Popover>
      )
    },
  },
  {
    title: '指南简称',
    dataIndex: 'guideBrief',
    key: 'guideBrief',
    align: 'left',
    render: (record = "") => {
      let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
      if (data.length > 8) {
        data = data.substring(0, 7);
        data += "......"
      }
      return (
        <Popover
          content={record}
          autoAdjustOverflow
          mouseEnterDelay={0.2}
          placement='right'
        >
          <a>{data}</a>
        </Popover>
      )
    },
  },
  {
    title: '项目总量',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
  },
];
