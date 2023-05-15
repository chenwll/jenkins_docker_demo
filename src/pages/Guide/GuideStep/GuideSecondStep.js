import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import Moment from 'moment';
import {
  Form,
  Card,
  Button,
  Col,
  Row,
  Input,
  Upload,
  Icon,
  message,
  Modal,
  Select,
  Table,
  Tooltip,
  Divider, Drawer,
} from 'antd';
import BraftEditor from 'braft-editor';
import { EDIT_FLAG, GUIDE_STATE, documentRequireArr } from '../../../utils/Enum';
import AdvancedSelect from '../../../components/AdvancedSelect';
import EasyULCreater from '../../../components/EasyUlCreater';
import FooterToolbar from '@/components/FooterToolbar';
import { guidePrefix } from '../../../utils/regular';
import {
  guideDetailDateLayout,
  guideDetailFormItemLayout,
  guideDetailStateLayout,
  guideDetailContextLayout,
  controls,
  fileUplaodLayout,
} from '../../../utils/globalUIConfig';
import remoteLinkAddress from '../../../utils/ip';
import 'braft-editor/dist/index.css';
import * as SelectFieldConfig from '../../../utils/globalSelectDataConfig';
import * as utils from '../../../utils/utils';
import router from 'umi/router';
import EvaluationDeptDetails from '@/pages/Guide/GuideStep/EvaluationDeptDetails';


const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;


@Form.create()
@connect(({ guideModal, basicdata, user,loading }) => ({
  guideModal,
  basicdata,
  user,
  loadingGet: loading.effects['guideModal/fetchRules'],
}))

class GuideSecondStep extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      visible: false,
      childrenDrawer: false
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    const { dispatch } = this.props;
    dispatch({
      type: 'guideModal/fetchRules',
      payload: [],
    });

    dispatch({
      type: 'guideModal/fetchDepartment',
      payload: [],
    });
  }

  back = () => {
    router.push('/Guide/GuideStep/Step1');
  };

  lastRuleArr = [];
  treeToArr = (data, pid = null, res) => {
    data.forEach(item => {
      let newRes = JSON.parse(JSON.stringify(res));
      newRes.push(item.ruleName);
      if (item.children && item.children.length !== 0) {
        this.treeToArr(item.children, item.id, newRes);
      } else {
        newRes.push(item.id);
        this.lastRuleArr.push(newRes);
      }
    });
  };

  getArrIndex = (Arr, obj) => {
    let i = Arr.length;
    while (i--) {
      if (Arr[i] === obj) {
        return i;
      }
    }
    return -1;
  };

  setSelfTask = (text,record) =>{
    console.log();
  }


  //注意这里
  createAction = (text, record) => {
    const {user:{roles}} = this.props
    return <Fragment>
      {roles[0]===1?<Fragment></Fragment>:<Tooltip title='设置自身任务'>
        <a onClick={()=>this.setSelfTask(text,record)}><Icon type='edit'/> </a>
        </Tooltip>}

      <Tooltip title='分配部门任务'>
        <a onClick={() => this.allotDepartmentTask(text, record)}><Icon type='setting' /></a>
      </Tooltip>
      <Tooltip title='分配部门'>
        <a onClick={()=>this.allotDepartment(text,record)}><Icon type='tool'/> </a>
      </Tooltip>
    </Fragment>;
  };

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
    this.showDrawer()
    console.log(id,record);
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };

  render() {
    console.log('this.props,step2',this.props);
    this.lastRuleArr = []; //防止数据重复渲染
    const { guideModal: { ruleTree }, loadingGet } = this.props;
    console.log('step2,ruleTree', ruleTree);

    //数据转换👇
    this.treeToArr(ruleTree, 0, []);
    const data = [];
    this.lastRuleArr.forEach(item => {
      data.push({ name: item[1], content: item[2], standard: item[3], specification: item[4], id: item[5] });
    });
    //数据转换👆

    //构造render👇
    const nameData = [0], contentData = [0], standardData = [0];
    for (let i = 1; i < data.length; i++) {
      if (data[i].name !== data[i - 1].name) {
        nameData.push(i);
      }
      if (data[i].content !== data[i - 1].content) {
        contentData.push(i);
      }
      if (data[i].standard !== data[i - 1].standard) {
        standardData.push(i);
      }
    }
    const nameRender = (text, row, index) => {
      if (this.getArrIndex(nameData, index) !== -1) {
        let spaceIndex = this.getArrIndex(nameData, index);
        let space = nameData[spaceIndex + 1] - index;
        return {
          children: <span>{text}</span>,
          props: {
            rowSpan: space,
          },
        };
      } else {
        return {
          children: <span>{text}</span>,
          props: {
            rowSpan: 0,
          },
        };
      }
    };
    const contentRender = (text, row, index) => {
      if (this.getArrIndex(contentData, index) !== -1) {
        let spaceIndex = this.getArrIndex(contentData, index);
        let space = contentData[spaceIndex + 1] - index;
        return {
          children: <span>{text}</span>,
          props: {
            rowSpan: space,
          },
        };
      } else {
        return {
          children: <span>{text}</span>,
          props: {
            rowSpan: 0,
          },
        };
      }
    };
    const standardRender = (text, row, index) => {
      if (this.getArrIndex(standardData, index) !== -1) {
        let spaceIndex = this.getArrIndex(standardData, index);
        let space = standardData[spaceIndex + 1] - index;
        return {
          children: <span>{text}</span>,
          props: {
            rowSpan: space,
          },
        };
      } else return {
        children: <span>{text}</span>,
        props: {
          rowSpan: 0,
        },
      };
    };
    const specificationRender = (text, row, index) => {
      return {
        children: <span>{text}</span>,
        props: {
          rowSpan: 1,
        },
      };
    };
    //构造render👆

    //构造Filter👇
    const contentFiltersSet = new Set();
    const nameFilterSet = new Set();
    data.forEach(item => {
      contentFiltersSet.add(item.content);
      nameFilterSet.add(item.name);
    });
    const contentFilter = [], nameFilter = [];
    for (let i of contentFiltersSet) {
      contentFilter.push({ text: i, value: i });
    }
    for (let i of nameFilterSet) {
      nameFilter.push({ text: i, value: i });
    }
    //构造Filter👆

    const columns = [
      {
        title: '指标名称',
        dataIndex: 'name',
        render: nameRender,
        filters: nameFilter,
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        width: '10vw'
      },
      {
        title: '评测内容',
        dataIndex: 'content',
        filters: contentFilter,
        render: contentRender,
        onFilter: (value, record) => record.content.indexOf(value) === 0,
        width: '10vw'
      },
      {
        title: '评测标准',
        dataIndex: 'standard',
        render: standardRender,
        width: '30vw'
      },
      {
        title: '网上申报具体要求',
        dataIndex: 'specification',
        key:'specification1',
        render: specificationRender,
        width: '50vw',
      },
      {
        title: '网上申报具体要求',
        dataIndex: 'specification',
        key:'specification2',
        render: specificationRender,
        width: '50vw',
      },
      {
        title: '分配任务',
        dataIndex: 'id',
        render: (text, record) => (
          this.createAction(text, record)
        ),
        align:'center',
        width: '4.5vw',
        fixed:'right'
      },
    ];

    return (
      <Fragment>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{ pageSize: 20 }}
          size='small'
          loading={loadingGet}
          scroll={{x:'100vw'}}
        />

        <Drawer
          title="设置牵头部门"
          width={520}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          destroyOnClose={true}
        >
          <EvaluationDeptDetails />
        </Drawer>
        <FooterToolbar style={{ width: '100%' }}>
          <Button style={{ marginLeft: 8 }} onClick={this.back}>
            返回
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default GuideSecondStep;
