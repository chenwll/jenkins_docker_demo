import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Modal,
  Checkbox,
  message,
  Button,
  Divider, Popconfirm, InputNumber,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ToolBarGroup from '@/components/ToolBarGroup';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import AdvancedDrawer from '@/components/AdvancedDrawer';

import styles from '../../utils/styles/StandardTableStyle.less';
import * as utils from '../../utils/utils';
import { PROJECTSCORE_DEP_OR_EXP } from '../../utils/Enum';
import ProjectDetail from '../../components/ProjectDetail';

const CheckboxGroup = Checkbox.Group;
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');

const { confirm } = Modal;

@connect(({ projectScoreModel, basicdata, loading }) => ({
  projectScoreModel,
  basicdata,
  loading : loading.models.projectScoreModel,
  drawerLoading : loading.effects['projectScoreModel/getProjectDetail'],
}))
@Form.create()
class ProjectScore extends PureComponent {
  state = {
    selectedRows : [],
    selectRow : {},
    drawerVisible : false,
    visible : false,
    editingKey : '',
    inputNumberValue : 0,
  };

  columns = [
    {
      title : '规则名称',
      dataIndex : 'ruleBrief',
      key : 'ruleBrief',
      width : '20%',
    },
    // {
    //   title : '规则名称',
    //   dataIndex : 'ruleName',
    //   key : 'ruleName',
    //   width : '20%',
    // },
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
      // eslint-disable-next-line consistent-return
      render : (val, record) => {
        if (val === '1') {
          return (
            <Fragment>
              <a onClick={() => this.handleVeto(record)} style={{fontWeight:'bold',color:'red'}}>一票否决</a>
            </Fragment>
          );
        }
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
              <Popconfirm
                title="确定保存吗？"
                onCancel={() => this.cancel(record.psId)}
                onConfirm={() => this.save(record.psId)}
              >
                <InputNumber
                  step={0.1}
                  min={0}
                  max={record.fullMarks}
                  autoFocus
                  placeholder='请输入评分'
                  style={{ width : '100%' }}
                  formatter={this.limitDecimals}
                  parser={this.limitDecimals}
                  onChange={this.handleInputNumber}
                />
              </Popconfirm>
            ) : (
              <a onClick={() => this.edit(record.psId, record.score)}>{text || '0'}</a>
            )}
          </div>
        );
      },
    },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   key: 'option',
    //   render: (val, record) => (
    //     <Fragment>
    //       <a onClick={() => this.handleScore(record)}>评分</a>
    //     </Fragment>
    //     )
    // }
  ];

  // eslint-disable-next-line react/sort-comp
  limitDecimals = value => {
    const reg = /^(\d+)\.(\d).*$/;
    if (typeof value === 'string') {
      // return !Number.isNaN(Number(value)) ? value.replace(reg, '$1.$2') : ''
      return value.replace(reg, '$1.$2');
    }
    if (typeof value === 'number') {
      return !Number.isNaN(value) ? String(value).replace(reg, '$1.$2') : '';
    }
    return '';
  };

  // eslint-disable-next-line react/sort-comp
  isEditing = record => record === this.state.editingKey;

  handleInputNumber = (value) => {
    this.setState({
      inputNumberValue : value,
    });
  };

  edit(key, score) {
    let canEdit = true;
    const {
      projectScoreModel : {
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
  }

  save(key) {
    const { inputNumberValue } = this.state;
    const {
      projectScoreModel : {
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
      type : 'projectScoreModel/update',
      payload : {
        ruleTree : tableData[0],
      },
    });
    this.cancel();
  }

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

  componentDidMount() {
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
      type : 'projectScoreModel/getAllDepart',
    });
    dispatch({
      type : 'projectScoreModel/getAllGuide',
    });
  }

  listPage(scoreTree) {
    const { dispatch } = this.props;
    const { match : { params : { scoreId, type } } } = this.props;
    dispatch({
      type : 'projectScoreModel/getRule',
      payload : {
        scoreId,
        localData : scoreTree,
        type,
      },
    });
  }

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

  cancel = () => {
    this.setState({
      editingKey : '',
      inputNumberValue : 0,
    });
  };

  handleVeto = () => {
    const { dispatch } = this.props;
    const { match : { params } } = this.props;
    const {
      projectScoreModel : { ruleTree, ruleList, vetoList },
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
    };
    confirm({
      title : '确定一票否决么？（该操作会让分数直接为0！）',
      okText : '确定',
      cancelText : '取消',
      onOk : () => {
        dispatch({
          type : 'projectScoreModel/saveScore',
          payload : data,
        });
      },
    });
  };

  handleScore = (val) => {
    const { selectRow } = this.state;
    const { match : { params } } = this.props;
    const {
      projectScoreModel : { ruleTree },
    } = this.props;
    let data = val;
    if (JSON.stringify(val) === '{}') {
      data = selectRow;
    }
    if (data.veto == '1') {
      message.error('一票否决项不能评分！');
      return;
    }
    localStorage.removeItem('selectsRow');
    localStorage.removeItem('selectRow');
    const selects = [];
    this.getDefaultSelectRow([ruleTree], 'ruleId', data.ruleId, selects);
    const selectsTemp = [...new Set(selects)];
    const tempDatas = JSON.stringify(selectsTemp);
    localStorage.setItem('selectRows', tempDatas);
    const tempData = JSON.stringify(data);
    localStorage.setItem('selectRow', tempData);
    let path = `/expertApproval/declaration/submit`;
    if (params.type == PROJECTSCORE_DEP_OR_EXP.DEP) {
      path = `/educationDepartmentSetting/departmentScore/submit`;
    }
    router.push({
      pathname : `${path}/${params.type}/${params.projectId}/${params.scoreId}/${data.ruleId}/${params.reviewYear}/${params.processId}`,
      // name 一致可用
      query : { prevent : true },
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

  getDefaultSelectRow = (node, key, keyValue, aimArr, father = []) => {
    node.forEach((item) => {
      if (aimArr.length !== 0) {
        aimArr.push(father[key]);
        return;
      }
      if (item.subScore) {
        this.getDefaultSelectRow(item.subScore, key, keyValue, aimArr, item);
      }
      if (item[key] === keyValue) {
        aimArr.push(item[key]);
        aimArr.push(father[key]);
      }
    });
  };

  handleSave = () => {
    const { projectScoreModel : { gradeSelect } } = this.props;
    const { dispatch } = this.props;
    const { match : { params } } = this.props;
    const {
      projectScoreModel : { ruleTree, ruleList, vetoList },
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
      type : 'projectScoreModel/saveScore',
      payload : data,
    });
  };

  handleSubmit = () => {
    const { projectScoreModel : { gradeSelect } } = this.props;
    const { dispatch } = this.props;
    const { match : { params } } = this.props;
    const { basicdata : { gDictData } } = this.props;
    const grade = utils.getDictByType(gDictData, 'scoreGrade');
    const that = this;
    let txt;
    grade.forEach(item => {
      if (item.k === gradeSelect[0]) {
        txt = item.val;
      }
    });
    confirm({
      title : `确定以该状态提交么？（请确认至少整体保存过一次，提交后将不能修改！）`,
      okText : '确定',
      cancelText : '取消',
      onOk : () => {
        dispatch({
          type : 'projectScoreModel/submitScore',
          payload : {
            scoreId : params.scoreId,
            type : params.type,
          },
          callback : (res) => {
            if (Number(res.code) === 0) {
              that.setState({
                drawerVisible : false,
                visible : false,
              });
            }
          },
        });
      },
    });
  };

  refresh = () => {
    const that = this;
    confirm({
      title : '确定刷新吗？（该操作会清除尚未保存的数据，请谨慎操作！）',
      okText : '确定',
      cancelText : '取消',
      onOk : () => {
        localStorage.removeItem('scoreTree');
        localStorage.removeItem('selectRow');
        localStorage.removeItem('selectRows');
        that.setState({
          selectRow : {},
          selectedRows : [],
        });
        that.listPage();
      },
    });
  };

  handelCancel = () => {
    const { match : { params } } = this.props;
    let path = `/expertApproval/declaration/distributionScore`;
    if (params.type == PROJECTSCORE_DEP_OR_EXP.DEP) {
      path = `/educationDepartmentSetting/guideList`;
    }
    router.push({
      pathname : `${path}`,
      query : { prevent : true },
    });
  };

  onCloseDrawer = () => {
    this.setState({
      drawerVisible : false,
    });
    this.listPage();
  };

  setGrade = (val) => {
    const { projectScoreModel : { gradeSelect }, dispatch } = this.props;
    const [oldk] = gradeSelect;
    const arr = val.filter(item => item !== oldk);
    dispatch({
      type : 'projectScoreModel/update',
      payload : {
        gradeSelect : arr,
      },
    });
  };

  downLoadFile = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type : `projectScoreModel/downLoadFile`,
      payload : {
        md5 : data.fileMd5,
        fileName : data.fileName,
      },
    });
  };

  handleLook = () => {
    const { dispatch } = this.props;
    const { match : { params } } = this.props;
    dispatch({
      type : 'projectScoreModel/getProjectDetail',
      payload : {
        projectId : params.projectId,
        type : params.type,
        // reviewYear:value.reviewYear,
      },
    });
    this.setState({
      drawerVisible : true,
    });
  };

  showModal = () => {
    this.setState({
      visible : true,
    });
  };

  hideModal = () => {
    this.setState({
      visible : false,
    });
  };

  render() {
    const { selectedRows, visible, drawerVisible } = this.state;
    const { basicdata : { gDictData }, drawerLoading } = this.props;
    const grade = utils.getDictByType(gDictData, 'scoreGrade');
    const {
      loading,
      projectScoreModel : { ruleTree, departList, guideList, detail, gradeSelect, gradeData, projectName },
    } = this.props;
    const btnList = {
      primaryBtn : [{
        func : this.refresh,
        key : 'REFRESH',
      }, {
        func : this.handleLook,
        key : 'SHOW_PROJECT',
      }, {
        func : this.handleSave,
        key : 'SAVE_SCORE',
      }, {
        func : this.showModal,
        key : 'SCORE_SUBMISSION',
      }],
    };
    let txt;
    grade.forEach(item => {
      if (item.k === gradeData) {
        txt = item.val;
      }
    });
    const defaultSelects = JSON.parse(localStorage.getItem('selectRows')) || [];
    const rowSelection = {
      onChange : this.handleSelectRows,
      onSelect : this.handleSelect,
      type : 'radio',
    };
    const options = [];
    if (grade.length > 0) {
      grade.forEach(item => options.push({
        label : item.val,
        value : item.k,
      }));
    }
    const contentOptions = {
      allDep : departList,
      allGuide : guideList,
      gDictData,
      projectDetail : detail,
      drawerLoading,
      downloadFunction : this.downLoadFile,
    };
    const projectDetailProps = {
      drawerTitle : '项目详情',
      drawerContent : <ProjectDetail {...contentOptions} />,
      drawerVisible,
      onChangeDrawerVisible : this.onCloseDrawer,
    };
    return (
      <PageHeaderWrapper title={projectName}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ToolBarGroup btnOptions={btnList} selectedRows={selectedRows} loading={loading} />
            <Divider />
            <div style={{ color : 'red' }}>
              <div>操作说明</div>
              <div>1.请点击表格中【评分】列下方数字即可进行评分，评分完成后点击除本行外的其他位置即可自动保存单项得分</div>
              <div>2.评分完成后请点击【保存】按钮保存整体评分情况</div>
              <div>3.点击【提交】按钮提交评分结果</div>
              <div>【一票否则】自动会将评分总分计为0分并保存但不会提交</div>
              <div>专家评分不保留小数点，拟推荐项目分数不低于70分，推荐项目不超过审核项目的40%</div>
            </div>
            <Divider />
            <span style={{ color : 'red' }}>*</span>入围状态：
            <CheckboxGroup options={options} value={gradeSelect} onChange={this.setGrade} style={{ marginBottom : '2%' }} />
            <StandardTable
              childrenColumnName='subScore'
              // expandRowByClick
              selectedRows={selectedRows}
              defaultExpandedRowKeys={defaultSelects}
              onExpand={this.handleExpand}
              defaultExpandAllRows={true}
              indentSize={20}
              loading={loading}
              data={{ list : [ruleTree] }}
              pagination={false}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              rowSelection={rowSelection}
              rowKey={record => record.ruleId}
              onRow={(record) => ({
                onDoubleClick : () => {
                  this.edit(record.psId, record.score);
                },
                onClick : () => {
                  const { editingKey } = this.state;
                  if (editingKey !== '' && record.psId !== editingKey) {
                    this.save(editingKey);
                  }
                },
              })}
              // onRow={(record) => ({
              //   onDoubleClick: () => {
              //     this.handleScore(record)
              //   }
              // })}
            />
          </div>
        </Card>
        <AdvancedDrawer {...projectDetailProps} />
        <Modal
          title="提交项汇总"
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <p>项目名称： {projectName}</p>
          <p>入围状态： {txt}</p>
          <p>总 分： {ruleTree.score}</p>
        </Modal>
        <FooterToolbar>
          <Button type="primary" style={{ marginLeft : 8 }} onClick={this.handelCancel} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectScore;
