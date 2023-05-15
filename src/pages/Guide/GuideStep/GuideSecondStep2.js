import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  Icon,
  Table,
  Tooltip,
  Divider, Drawer, Popover,
} from 'antd';
import {  GUIDESTATUS } from '@/utils/Enum';
import FooterToolbar from '@/components/FooterToolbar';

import 'braft-editor/dist/index.css';
import router from 'umi/router';
import EvaluationDeptDetails from '@/pages/Guide/GuideStep/EvaluationDeptDetails';
import TaskDetailDetails from '@/pages/Guide/GuideStep/TaskDetailDetails';


const   STATUS=[{
  roleName:'超级管理员',
  leadFlag:true,
  statu:'ADMIN_LEADFLAG',
},{
  roleName: '超级管理员',
  leadFlag: false,
  statu: 'ADMIN_NOTLEADFLAG',
},{
  roleName: '行政人员',
  leadFlag: true,
  statu: 'ADMINISTRATION_LEADFLAG',
},{
  roleName: '行政人员',
  leadFlag: false,
  statu: 'ADMINISTRATION_NOTLEADFLAG',
}]

@Form.create()
@connect(({ guideModal, basicdata, global,user,loading }) => ({
  guideModal,
  basicdata,
  user,
  global,
  loadingGet: loading.effects['guideModal/getAllTask'],
}))

class GuideSecondStep extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      departmentDrawVisible: false,
      taskDetailDrawVisible:false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type:'global/changeLayoutCollapsed',
      payload:true
    })
    dispatch({
      type:'guideModal/getAllTask',
      payload:[]
    })
    dispatch({
      type: 'guideModal/fetchDepartment',
      payload: [],
    });
  }

  back = () => {
    const {guideModal:{editStatus}} = this.props
    switch (editStatus){
      case GUIDESTATUS.WILLCREATE:
        router.push('/Guide/GuideStep/Step1');
        break;
      case GUIDESTATUS.DRAFT:
        router.push('/Guide/GuideStep/Step1')
        break;
      default:
        router.push('/Guide/GuideList')
    }

  };

  next = () =>{
    router.push('/Guide/GuideStep/CommitSuccess');
  }

  getStatu=(roleName,leadFlag)=>{
    console.log(roleName,leadFlag);
    let NEWSTATUS;
    NEWSTATUS=STATUS.filter(item=>item.roleName===roleName)
    NEWSTATUS=NEWSTATUS.filter(item=>item.leadFlag===leadFlag)
    const {statu='STATUS_NOT_EXIST'} = NEWSTATUS[0]
    return statu
}

  getArrIndex = (Arr, obj) => {
    let i = Arr.length;
    while (i===0) {
      if (Arr[i] === obj) {
        return i;
      }
      i-=1
    }
    return -1;
  };

  // 这里负责根据权限/牵头与否判断返回按钮个数
  createAction = (text, record) => {
    const {user:{roleName}} = this.props;
    const {leadFlag} = record;
    console.log('232323',record,leadFlag);
    // 对象数组，遍历判断，返回状态，switch
    const statu=this.getStatu(roleName,leadFlag)
    switch (statu){
      case 'ADMIN_LEADFLAG':
      case 'ADMIN_NOTLEADFLAG':
        return (
          <Fragment>
            <Tooltip title='分配牵头部门任务提交需求'>
              <a onClick={() => this.allotDepartmentTask(text, record)}><Icon type='setting' /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='分配牵头部门'>
              <a onClick={()=>this.allotDepartment(text,record)}><Icon type='tool' /> </a>
            </Tooltip>
          </Fragment>
        )
      case 'ADMINISTRATION_LEADFLAG':
        return (
          <Fragment>
            <Tooltip title='设置自身任务'>
              <a onClick={()=>this.setSelfTask(text,record)}><Icon type='edit' /> </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='分配协助部门任务'>
              <a onClick={() => this.allotDepartmentTask(text, record)}><Icon type='setting' /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title='分配协助部门'>
              <a onClick={()=>this.allotDepartment(text,record)}><Icon type='tool' /> </a>
            </Tooltip>
          </Fragment>
        )
      case 'ADMINISTRATION_NOTLEADFLAG':
        return (
          <Fragment>
            <Tooltip title='设置自身任务'>
              <a onClick={()=>this.setSelfTask(text,record)}><Icon type='edit' /> </a>
            </Tooltip>
          </Fragment>
        )
      default :
        return (
          <Fragment>
            <Tooltip title='状态不存在'>
              <a><Icon type='error' /> </a>
            </Tooltip>
          </Fragment>
        )
    }
  };

  setSelfTask = (text,record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'guideModal/save',
      payload: { selectedRows: record },
    });
    this.setState({
      taskDetailDrawVisible:true
    })
  }

  allotDepartmentTask = (id, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'guideModal/save',
      payload: { selectedRows: record },
    });
    router.push('/Guide/GuideStep/Step3');
  };

  allotDepartment = (id,record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'guideModal/save',
      payload: { selectedRows: record },
    });
    this.showDepartmentDrawer()
  }

  showTaskDetailDrawer = () => {
    this.setState({
      taskDetailDrawVisible: true,
    });
  };

  showDepartmentDrawer = () => {
    this.setState({
      departmentDrawVisible: true,
    });
  };

  onCloseTaskDetailDrawer = ()=>{
    this.setState({
      taskDetailDrawVisible:false
    })
  }

  onCloseDepartmentDrawer = () => {
    this.setState({
      departmentDrawVisible: false,
    });
  };

  render() {
    console.log('this.props,step2',this.props);
    const { guideModal: { taskList}, loadingGet ,user:{roleName}} = this.props;
    const {taskDetailDrawVisible,departmentDrawVisible} =this.state

    // 数据转换👇
    const data = [];
    taskList.forEach(item => {
      // 下面一if这一行等后期数据规范了删掉，服了，测试老是加不规范的数据！！！
      // 解释以下为什么要从后端获取数据后再次提出，1.后端给的名字不易理解2.后端接口更改,例如原来的name,content字段变成了其他名字，但是有大量代码是基于原来名字写的3.有些字段确实没有，这里可以统一控制
      const {ruleLevel1Name='',
        ruleLevel2Name='',
        ruleLevel3Name='',
        ruleLevel4Name='',
        ruleLevel4Id='',
        leadFlag=false,
        taskDetail='',
        departmentName='',
        taskId='',
        departmentId=''
      } = item
      if (item.ruleLevel1Name!==undefined)
      data.push({
        name: ruleLevel1Name,
        content: ruleLevel2Name,
        standard: ruleLevel3Name,
        specification: ruleLevel4Name,
        id: ruleLevel4Id ,
        leadFlag,
        taskDetail,
        departmentName,
        taskId,
        departmentId
      });
    });
    // 数据转换👆

    data.sort((a,b) => {
      if (a.name!==b.name){
        return a.name>b.name ?1:-1
      }
      if (a.content!==b.content){
        return a.content>b.content ?1:-1
      }
      if (a.standard!==b.standard){
        return a.standard>b.standard ?1:-1
      }
      if (a.specification!==b.specification){
        return a.specification>b.specification ?1:-1
      }
    })

    // 构造render👇
    // const nameData = [0], contentData = [0], standardData = [0];
    // for (let i = 1; i < data.length; i++) {
    //   if (data[i].name !== data[i - 1].name) {
    //     nameData.push(i);
    //   }
    //   if (data[i].content !== data[i - 1].content) {
    //     contentData.push(i);
    //   }
    //   if (data[i].standard !== data[i - 1].standard) {
    //     standardData.push(i);
    //   }
    // }
    // nameData.push(data.length)
    // contentData.push(data.length)
    // standardData.push(data.length)

    // console.log(nameData,contentData,standardData);
    const rowSpanRender=(text,row,index,columnName)=>{
      const {taskId} = row
      console.log(3222,data);
      let innerIndex // 标记当前行数据在data的下标
      for (let i=0;i<data.length;i++){
        if (data[i].taskId===taskId){
          innerIndex=i
        }
      }

      const newData=data.slice(parseInt(innerIndex/10)*10,parseInt(innerIndex/10)*10+10)
      if (index===0||(newData[index][columnName]!==newData[index-1][columnName])){
        for(let i=index;i<newData.length;i++){
          if (newData[i][columnName]!==newData[index][columnName]){
            const span=i-index
            console.log('3222!=','index:',index,'i:',i,'span',span,'innerIndex',innerIndex,newData)
            return {
              children: <span>{text}</span>,
              props: {
                rowSpan: span
              }
            }
          }
          if (i===newData.length-1){ // 行至末尾
            const span=i-index+1
            console.log('3222!=~','index:',index,'i:',i,'span',span,'innerIndex',innerIndex,newData);
            return {
              children: <span>{text}</span>,
              props: {
                rowSpan: span
              }
            }
          }
        }
      }
      else
        console.log('3222==',index,innerIndex,newData);
        return {
          children: <span>{text}</span>,
          props: {
            rowSpan: 0,
          },
        };
      }

    // const nameRender = (text, row, index) => {
    //   if (this.getArrIndex(nameData, index) !== -1) {
    //     let spaceIndex = this.getArrIndex(nameData, index);
    //     let space = nameData[spaceIndex + 1] - index;
    //     return {
    //       children: <span>{text}</span>,
    //       props: {
    //         rowSpan: space,
    //       },
    //     };
    //   } else {
    //     return {
    //       children: <span>{text}</span>,
    //       props: {
    //         rowSpan: 0,
    //       },
    //     };
    //   }
    // };
    // const contentRender = (text, row, index) => {
    //   if (this.getArrIndex(contentData, index) !== -1) {
    //     let spaceIndex = this.getArrIndex(contentData, index);
    //     let space = contentData[spaceIndex + 1] - index;
    //     return {
    //       children: <span>{text}</span>,
    //       props: {
    //         rowSpan: space,
    //       },
    //     };
    //   } else {
    //     return {
    //       children: <span>{text}</span>,
    //       props: {
    //         rowSpan: 0,
    //       },
    //     };
    //   }
    // };
    // const standardRender = (text, row, index) => {
    //   if (this.getArrIndex(standardData, index) !== -1) {
    //     let spaceIndex = this.getArrIndex(standardData, index);
    //     let space = standardData[spaceIndex + 1] - index;
    //     return {
    //       children: <span>{text}</span>,
    //       props: {
    //         rowSpan: space,
    //       },
    //     };
    //   } else return {
    //     children: <span>{text}</span>,
    //     props: {
    //       rowSpan: 0,
    //     },
    //   };
    // };
    // const specificationRender = (text, row, index) => {
    //   return {
    //     children: <span>{text}</span>,
    //     props: {
    //       rowSpan: 1,
    //     },
    //   };
    // };
    // 构造render👆

    // 构造Filter👇
    const contentFiltersSet = new Set();
    const nameFilterSet = new Set();
    data.forEach(item => {
      contentFiltersSet.add(item.content);
      nameFilterSet.add(item.name);
    });
    const contentFilter = []; const nameFilter = [];
    for (const i of contentFiltersSet) {
      contentFilter.push({ text: i, value: i });
    }
    for (const i of nameFilterSet) {
      nameFilter.push({ text: i, value: i });
    }
    // 构造Filter👆

    const columns = [
      {
        title: '指标名称',
        dataIndex: 'name',
        render: (text,row,index)=>rowSpanRender(text,row,index,'name'),
        filters: nameFilter,
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        width: '8vw'
      },
      {
        title: '评测内容',
        dataIndex: 'content',
        filters: contentFilter,
        render: (text,row,index)=>rowSpanRender(text,row,index,'content'),
        onFilter: (value, record) => record.content.indexOf(value) === 0,
        width: '8vw'
      },
      {
        title: '评测标准',
        dataIndex: 'standard',
        render: (text,row,index)=>rowSpanRender(text,row,index,'standard'),
        width: '13vw'
      },
      {
        title: '网上申报具体要求',
        dataIndex: 'specification',
        render: (text,row,index)=>rowSpanRender(text,row,index,'specification'),
        width: '13vw',
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: '8vw',
        render:(text,row)=>{
          const {leadFlag} = row
          if(leadFlag){
            return (
              <div>{text} <Icon theme="filled" type="star" style={{color:' #d41417'}} /></div>
            )
          }

            return <div>{text}</div>

        }
      },
      {
        title: '具体任务需求',
        dataIndex: 'taskDetail',
        key:'taskDetail',
        render: (record = '') => {
          let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
          if (data.length > 40) {
            data = data.substring(0, 39);
            data += '......';
          }
          return (
            <Popover
              content={record}
              autoAdjustOverflow
              mouseEnterDelay={0.2}
              placement='right'
              overlayStyle={{maxWidth:'30vw'}}
            >
              {data}
            </Popover>
          );
        },
        width: '15vw',
      },
      {
        title: '分配任务',
        dataIndex: 'id',
        render: (text, record) => (
          this.createAction(text, record)
        ),
        align:'center',
        width: '6vw',
        // fixed:'right'
      },
    ];

    return (
      <Fragment>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{ pageSize: 10 }}
          size='small'
          loading={loadingGet}
          // scroll={{x:'100vw'}}
        />
        <Drawer
          title='设置具体任务'
          width='40vw'
          destroyOnClose
          onClose={this.onCloseTaskDetailDrawer}
          visible={taskDetailDrawVisible}
        >
          <TaskDetailDetails onClose={this.onCloseTaskDetailDrawer} />
        </Drawer>

        <Drawer
          title={roleName==='超级管理员'?'设置牵头部门':'设置协助部门'}
          width="30vw"
          closable={false}
          onClose={this.onCloseDepartmentDrawer}
          visible={departmentDrawVisible}
          destroyOnClose
          rowKey='id'
        >
          <EvaluationDeptDetails />
        </Drawer>
        <FooterToolbar style={{ width: '100%' }}>
          <Button onClick={this.next} type='primary'>完成</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.back}>
            返回
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default GuideSecondStep;
