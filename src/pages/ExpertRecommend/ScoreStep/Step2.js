import React, { Fragment, PureComponent } from 'react';
import {connect} from 'dva';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import {
  Card,
  Modal,
  message,
  Button,
  Divider,
  InputNumber,
} from 'antd';
import styles from '../../../utils/styles/StandardTableStyle.less';
import ToolBarGroup from '@/components/ToolBarGroup';
import FooterToolbar from '@/components/FooterToolbar';
import * as utils from '../../../utils/utils';
import { RECOMMEND_STATE, RECOMMEND_TYPE } from '../../../utils/Enum';

const { confirm } = Modal;
@connect(({ prjScoreModel,basicdata,loading,expertRecommend}) => ({
  prjScoreModel,
  expertRecommend,
  basicdata,
  loading:loading.models.prjScoreModel,
}))

class ProjectScoreFlow2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // visible : false,
      selectedRows : [],
    };

  }

  componentDidMount(){
    const { dispatch } = this.props;
    let scoreTree;
    const defaultSelect = JSON.parse(localStorage.getItem('selectRow')) || {};
    if (defaultSelect.ruleId) {
      this.setState({
        selectRow : defaultSelect,
        selectedRows : [defaultSelect.ruleId],
      });
    }
    if (localStorage.scoreTree) {
      scoreTree = JSON.parse(localStorage.getItem('scoreTree'));
    }
    this.listPage(scoreTree);
    dispatch({
      type : 'prjScoreModel/getAllDepart',
    });
    dispatch({
      type : 'prjScoreModel/getAllGuide',
    });
  }

  listPage =(scoreTree) =>{
    const { dispatch } = this.props;
    const { match : { params : { scoreId, type,reviewYear } } } = this.props;
    dispatch({
      type : 'prjScoreModel/getRule',
      payload : {
        scoreId,
        localData : scoreTree,
        type,
        reviewYear
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows : rows,
    });
  };

  handleSelect = (row) => {
    this.setState({
      selectRow : row,
    });
  };

  loopVeto = (node) => {
    node.forEach((item) => {
      if (item.subScore) {
        this.loopVeto(item.subScore);
      }
      item.score = 0;
    });
  };

  setZeroList = (arr) => {
    const { match : { params : { scoreId } } } = this.props;
    return arr.map(item => ({
      ruleId : item.ruleId,
      score : 0,
      scoreId,
    }));
  };

  isEditing = record => record === this.state.editingKey;

  handleVeto = () => {
    const { dispatch } = this.props;
    const { match : { params } } = this.props;
    const {
      prjScoreModel : { ruleTree, ruleList, vetoList },
    } = this.props;

    const { ...zeroScoreTree } = ruleTree;
    this.loopVeto([zeroScoreTree]);
    let [...zeroScoreList] = ruleList;
    zeroScoreList = this.setZeroList(zeroScoreList);
    const data = {
      prjScore : zeroScoreTree, // 不传后端，自用
      prjScoreList : zeroScoreList.concat(vetoList),
      state : 0, // 0不提交，1提交
      score : 0,
      projectId : params.projectId,
      scoreId : params.scoreId,
      reviewYear : params.reviewYear,
      processId : params.processId,
      type : params.type,
      saveState:RECOMMEND_STATE[2].k,
    };
    confirm({
      title : '确定一票否决么？（该操作会让分数直接为0！）',
      okText : '确定',
      cancelText : '取消',
      onOk : () => {
        dispatch({
          type : 'prjScoreModel/saveScore',
          payload : data,
        });
      },
    });
  };

  cancel = () => {
    this.setState({
      editingKey : '',
      inputNumberValue : 0,
    });
  };

  // 页面更新数据
  save= (key)=> {
    const { inputNumberValue } = this.state;
    const {
      prjScoreModel : {
        ruleTree = {},
      },
      dispatch,
    } = this.props;
    const tableData = ruleTree ? [...[ruleTree]] : [];
    // 修改分数
    this.loop(tableData, 'subScore', 'psId', key, (item) => {
      item.score = inputNumberValue;
    });
    // 叠加分数
    this.addAllScore(tableData, 'subScore');
    dispatch({
      type : 'prjScoreModel/update',
      payload : {
        ruleTree : tableData[0],
      },
    });
    this.cancel();
  };

  edit=(key, score)=> {
    let canEdit = true;
    const {
      prjScoreModel : {
        ruleTree = {},
      },
    } = this.props;
    const tableData = ruleTree ? [...[ruleTree]] : [];
    this.loop(tableData, 'subScore', 'psId', key, (item) => {
      if (item.subScore) {
        message.warning('当前级不能评分！');
        canEdit = false;
      }
    });
    if (!canEdit) {
      return;
    }
    this.setState({
      editingKey : key,
      inputNumberValue : score,
    });
  };

  handleInputNumber = (value) => {
    this.setState({
      inputNumberValue : value,
    });
  };

  loop = (node, key, aimKey, aimKeyValue, call) => {
    node.forEach((item, index) => {
      if (item[aimKey] === aimKeyValue) {
        call(item, index);
      }
      if (item[key]) {
        this.loop(item[key], key, aimKey, aimKeyValue, call);
      }
    });
  };

  addAllScore = (node, key) => {
    node.forEach((item) => {
      if (item[key]) {
        this.addAllScore(item[key], key);
        item.score = item[key].reduce((num, i) => num + (i.score ? i.score : 0), 0);
      }
    });
  };

  // 保存评分
  handleSave = () => {
    const { prjScoreModel : { gradeSelect } } = this.props;
    const { dispatch } = this.props;
    const { match : { params } } = this.props;
    const {
      prjScoreModel : { ruleTree, ruleList, vetoList },
    } = this.props;
    const data = {
      prjScore : ruleTree, // 不传后端，自用
      prjScoreList : ruleList.concat(vetoList),
      state : 1, // 0不提交，1提交
      score : ruleTree.score,
      projectId : params.projectId,
      scoreId : params.scoreId,
      reviewYear : params.reviewYear,
      processId : params.processId,
      grade : gradeSelect[0],
      type : params.type,
    };
    dispatch({
      type : 'prjScoreModel/saveScore',
      payload : data,
    });
  };

  // showModal = () => {
  //   this.setState({
  //     visible : true,
  //   });
  // };
  //
  // hideModal = () => {
  //   this.setState({
  //     visible : false,
  //   });
  // };

  // handleSubmit = () => {
  //   const { prjScoreModel : { gradeSelect } } = this.props;
  //   const { dispatch } = this.props;
  //   const { match : { params } } = this.props;
  //   const { basicdata : { gDictData } } = this.props;
  //   const grade = utils.getDictByType(gDictData, 'scoreGrade');
  //   const that = this;
  //   let txt;
  //   grade.forEach(item => {
  //     if (item.k === gradeSelect[0]) {
  //       txt = item.val;
  //     }
  //   });
  //   confirm({
  //     title : `确认提交吗？提交后将不能修改！`,
  //     okText : '确定',
  //     cancelText : '取消',
  //     onOk : () => {
  //       dispatch({
  //         type : 'prjScoreModel/submitScore',
  //         payload : {
  //           scoreId : params.scoreId,
  //           type : params.type,
  //         },
  //         callback : (res) => {
  //           if (Number(res.code) === 0) {
  //             that.setState({
  //               drawerVisible : false,
  //               visible : false,
  //             });
  //             router.push({pathname: `/expertApproval/declaration/step2/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}`, query: {prevent: true}});
  //           }
  //         },
  //       });
  //     },
  //   });
  // };

  //  上一步
  handelBeforeStep =()=>{
    confirm({
      title : `确认返回吗？请确认保存后再返回`,
      okText : '确定',
      cancelText : '取消',
      onOk : () => {
        const {match: {params}} = this.props;
        if(params.recommendType===RECOMMEND_TYPE.CONCLUDE){
          router.push({pathname: `/expertApproval/projectApproval/step1/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
        }else {
          router.push({pathname: `/expertApproval/declaration/step1/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
        }
        },
    });
  };

  //  下一步
  handelNextStep =()=>{
    const {match: {params}} = this.props;
    // this.handleSave();
    if(params.recommendType===RECOMMEND_TYPE.CONCLUDE){
      router.push({pathname: `/expertApproval/projectApproval/step3/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
    }else {
      router.push({pathname: `/expertApproval/declaration/step3/0/${params.projectId}/${params.scoreId}/${params.reviewYear}/${params.processId}/${params.recommendType}`, query: {prevent: true}});
    }
   };

  saveData=(record)=>{
    const { editingKey } = this.state;
    // if (editingKey !== '' && record.psId !== editingKey) {
      this.save(editingKey);
    // }
  }

  render(){
    const { selectedRows } = this.state;
    const {basicdata:{gDictData}} = this.props;
    const {prjScoreModel:{ ruleTree},loading } = this.props;
    const {prjScoreModel:{ gradeData, projectName}} =this.props;
    const defaultSelects = JSON.parse(localStorage.getItem('selectRows')) || [];
    const rowSelection = {
      onChange : this.handleSelectRows,
      onSelect : this.handleSelect,
    };
    let scoreTree;
    if (localStorage.scoreTree) {
      scoreTree = JSON.parse(localStorage.getItem('scoreTree'));
    }
    // this.listPage(scoreTree);
    const btnList = {
      primaryBtn : [{
        func : this.listPage,
        param: [scoreTree],
        key : 'REFRESH',
      },
      //   {
      //   func : this.handleLook,
      //   key : 'SHOW_PROJECT',
      // },
      //   {
      //   func : this.handleSave,
      //   key : 'SAVE_SCORE',
      // },
      //   {
      //   func : this.showModal,
      //   key : 'SCORE_SUBMISSION',
      // }
      ],
    };
    const grade = utils.getDictByType(gDictData, 'scoreGrade');
    let txt;
    grade.forEach(item => {
      if (item.k === gradeData) {
        txt = item.val;
      }
    });
    const options = [];
    if (grade.length > 0) {
      grade.forEach(item => options.push({
        label : item.val,
        value : item.k,
      }));
    }
    const columns = [
      {
        title : '规则名称',
        dataIndex : 'ruleBrief',
        key : 'ruleBrief',
        width : '20%',
      },
      {
        title : '规则描述',
        dataIndex : 'discription',
        key : 'discription',
        width : '30%',
      },
      {
        title : '一票否决',
        dataIndex : 'veto',
        key : 'veto',
        width : '10%',
        render : (val, record) => {
          if (val === '1') {
            return (
              <Fragment>
                <a onClick={() => this.handleVeto(record)} style={{fontWeight:'bold',color:'red'}}>一票否决</a>
              </Fragment>
            );
          }
          return '';
        },
      },
      {
        title : '总分',
        dataIndex : 'fullMarks',
        key : 'fullMarks',
        width : '10%',
      },
      {
        title : '评分（单击下方数字）',
        dataIndex : 'score',
        key : 'score',
        editable : true,
        width : '15%',
        render : (text, record) => {
          const editable = this.isEditing(record.psId);
          return (
            <div>
              {editable ? (
                <div style={{display:'flex',alignItems:'center'}}>
                <InputNumber
                  step={0.1}
                  min={0}
                  max={record.fullMarks}
                  autoFocus
                  placeholder='请输入评分'
                  style={{ width : '70%' }}
                  formatter={this.limitDecimals}
                  parser={this.limitDecimals}
                  onChange={this.handleInputNumber}
                />
                  <span style={{border: 0,color:'#1890FF',width: '30%',textAlign: 'right'}} onClick={()=>this.saveData(record)}>保存</span>
                </div>
              ) : (
                // <a onClick={() => this.edit(record.psId, record.score)}>{text || '0'}</a>
                <div style={{display:'flex'}}>
                  <span style={{width: '70%'}}>{text || '0'}</span>
                  {record.subScore?"":<span style={{border: 0,color:'#1890FF',width: '30%',textAlign: 'right'}} onClick={() => this.edit(record.psId, record.score)}>编辑</span>}
                </div>
              )}
            </div>
          );
        },
      },

    ];

    return(
      <Fragment>
        <Card bordered={false} title={projectName}>
          <div className={styles.tableList}>
            <div style={{ color : 'red' }}>
              <div>操作说明</div>
              <div>1.请点击表格中【评分】列下方数字即可进行评分，评分完成后点击除本行外的其他位置即可自动保存单项得分</div>
              <div>2.评分完成后请点击【保存】按钮保存整体评分情况</div>
              <div>3.点击【提交】按钮提交评分结果</div>
              <div>4.【一票否决】自动会将评分总分计为0分并保存但不会提交</div>
              <div>5.专家评分不保留小数点，拟推荐项目分数不低于70分，推荐项目不超过审核项目的40%</div>
            </div>
            <Divider />
            {/* <span style={{ color : 'red',display:'inline' }}>*</span>入围状态： */}
            {/* <CheckboxGroup */}
            {/*  options={options} */}
            {/*  value={gradeSelect} */}
            {/*  onChange={this.setGrade} */}
            {/*  style={{ marginBottom : '2%' }} */}
            {/* /> */}
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} loading={loading}  />
            <StandardTable
              childrenColumnName='subScore'
              // expandRowByClick
              selectedRows={selectedRows}
              defaultExpandedRowKeys={defaultSelects}
              onExpand={this.handleExpand}
              defaultExpandAllRows
              indentSize={20}
              loading={loading}
              data={{ list : [ruleTree] }}
              pagination={false}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              // rowSelection={rowSelection}
              rowSelection={null}
              rowKey={record => record.ruleId}
              // onRow={(record) => ({
              //   // onDoubleClick : () => {
              //   //   this.edit(record.psId, record.score);
              //   // },
              //   // onClick : () => {
              //   //   const { editingKey } = this.state;
              //   //   if (editingKey !== '' && record.psId !== editingKey) {
              //   //     this.save(editingKey);
              //   //   }
              //   // },
              // })}
            />
          </div>
        </Card>
        {/* <Modal */}
        {/*  title="提交项汇总" */}
        {/*  visible={visible} */}
        {/*  onOk={this.handleSubmit} */}
        {/*  onCancel={this.hideModal} */}
        {/*  okText="确认" */}
        {/*  cancelText="取消" */}
        {/* > */}
        {/*  <p>项目名称： {projectName}</p> */}
        {/*  <p>入围状态： {txt}</p> */}
        {/*  <p>总 分： {ruleTree.score}</p> */}
        {/* </Modal> */}
        <FooterToolbar>
          <Button onClick={this.handelBeforeStep} htmlType='button'>
            上一步
          </Button>
          <Button type="primary" style={{ marginLeft : 8 }} onClick={this.handelNextStep} htmlType='button'>
            下一步
          </Button>
        </FooterToolbar>
      </Fragment>
    )
  }
}

export default ProjectScoreFlow2
