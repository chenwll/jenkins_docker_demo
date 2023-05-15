import React, { PureComponent } from 'react';
import { Button, Menu, Dropdown, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';
const BUTTON_ARRAY = [
  {
    name : '返回',
    key : 'RETURN',
    icon : 'left',
    param : {},
    function : '',
  },
  {
  name : '新建',
  key : 'ADD',
  icon : 'file',
  param : {},
  function : '',
}, {
  name : '修改',
  key : 'EDIT',
  icon : 'edit',
  param : {},
  func : '',
}, {
  name : '批量删除',
  key : 'PATCH_DELETE',
  icon : 'delete',
  param : {},
  func : '',
}, {
  name : '删除',
  key : 'DELETE',
  icon : 'delete',
  param : {},
  func : '',
}, {
  name : '批量审核',
  key : 'PATCH_APPROVAL',
  icon : 'check-square',
  param : {},
  func : '',
}, {
  name : '刷新',
  key : 'REFRESH',
  icon : 'reload',
  param : {},
  func : '',
}, {
  name : '打印',
  key : 'PRINT',
  icon : 'printer',
  param : {},
  func : '',
}, {
  name : '停用',
  key : 'UNUSABLE',
  icon : 'EDIT',
  param : {},
  func : '',
}, {
  name : '启用',
  key : 'USABLRE',
  icon : 'EDIT',
  param : {},
  func : '',
}, {
  name : '创建申报',
  key : 'DECLARE',
  icon : 'Edit',
  param : {},
  func : '',
}, {
  name : '新建规则',
  key : 'ADDNEWNODE',
  icon : 'file',
  param : {},
  func : '',
}, {
  name : '添加下一级',
  key : 'ADDCHILD',
  icon : 'plus',
  param : {},
  func : '',
}, {
  name : '状态进阶',
  key : 'NEXT_STATE',
  icon : 'arrow-right',
  param : {},
  func : '',
}, {
  name : '撤回',
  key : 'REVOKE',
  icon : 'undo',
  param : {},
  func : '',
}, {
  name : '保存整体流程',
  key : 'SAVE_FLOW',
  icon : 'save',
  param : {},
  func : '',
},{
  name : '保存',
  key : 'SAVE_SCORE',
  icon : 'save',
  param : {},
  func : '',
}, {
  name : '新建流程',
  key : 'NEW_FLOW',
  icon : 'file',
  param : {},
  func : '',
},{
  name : '重置密码',
  key : 'PASSWORD_RESET',
  icon : 'edit',
  param : {},
  func : '',
},{
  name:'项目联系人',
  key:'PROJECT_CONTACT',
  icon:'user',
  param:{},
  func:'',
},{
  name:'项目月报',
  key:'PROJECT_MONTH',
  icon:'switcher',
  param:{},
  func:'',
},{
  name:'操作完成',
  key:'NEWPROJECT_COMPLETE',
  icon:'logout',
  param:{},
  func:'',
},{
  name:'发布',
  key:'NEWS_PUBLISH',
  icon:'to-top',
  param:{},
  func:'',
},{
  name:'新闻查看',
  key:'NEWS_DETAIL',
  icon:'eye',
  param:{},
  func:'',
},{
  name:'推荐',
  key:'PROJECT_RECOMMEND',
  icon:'like',
  param:{},
  func:'',
},{
  name:'取消分配',
  key:'PROJECT_DISTRBUTION_CANCEL',//取消项目分配
  icon:'close-square',
  param:{},
  func:'',
},{
  name:'批量分配',
  key:'PATCH_DISTRBUTION',//项目/专家分配的时候用了
  icon:'bars',
  param:{},
  func:'',
},{
  name:'分配专家',
  key:'PROJECT_EXPERT',
  icon:'user',
  param:{},
  func:'',
},{
  name:'分配项目',
  key:'PROJECT_DISTRIBUTION',
  icon:'link',
  param:{},
  func:'',
},{
  name:'评分',
  key:'PROJECT_SCORE',
  icon:'form',
  param:{},
  func:'',
},{
  name:'查看',
  key:'SHOW_MORE',
  icon:'eye',
  param:{},
  func:'',
},{
  name:'项目详情',
  key:'SHOW_PROJECT',
  icon:'eye',
  param:{},
  func:'',
},{
  name:'评审年份',
  key:'REVIEW_YEAR',
  icon:'eye',
  param:{},
  func:'',
},{
  name:'导出专家',
  key:'EXPORT_EXPERT',
  icon:'form',
  param:{},
  func:'',
},{
  name:'强制推荐',
  key:'FORCE_RECOMMEND',
  icon:'exclamation-circle',
  param:{},
  func:'',
},{
  name:'分组设置',
  key:'EXPERT_GROUP',
  icon:'project',
  param:{},
  func:'',
},{
  name:'提交',
  key:'SCORE_SUBMISSION',
  icon:'cloud-upload',
  param:{},
  func:'',
},{
  name:'删除分组',
  key:'EXPERT_GROUP_DELETE',
  icon:'delete',
  param:{},
  func:'',
},{
  name:'导入专家',
  key:'IMPORT_EXPORT',
  icon:'diff',
  param:{},
  func:'',
},{
  name:'批量提交',
  key:'MUCH_SUBMIT',
  icon:'bars',
  param:{},
  func:'',
},{
  name:'按专家组查',
  key:'SCORE_DETAIL',
  icon:'form',
  param:{},
  func:'',
},{
  name:'导出评分',
  key:'EXPORT_SCORE',
  icon:'form',
  param:{},
  func:'',
},{
  name:'导出经典案例',
  key:'EXPORT_CLASSIC_CASE',
  icon:'form',
  param:{},
  func:'',
},{
  name:'按部门查',
  key:'DEPARTMENT_SCORE_DETAIL',
  icon:'form',
  param:{},
  func:'',
},{
  name:'复制',
  key:'COPY',
  icon:'copy',
  param:{},
  func:'',
},{
    name:'解除微信绑定',
    key: 'REMOVE_BINDING',
    icon:'api',
    param: {},
    func:'',
  }];
class ToolBarGroup extends PureComponent {
  static propTypes = {
    selectedRows : PropTypes.array.isRequired,//父组件选中的数据
    primaryBtn : PropTypes.array.isRequired,
    patchBtn : PropTypes.array,
    menuBtn : PropTypes.array,
  };
  static defaultProps = {
    primaryBtn : [],
    patchBtn : [],
    menuBtn : [],
    selectedRows : [],
  };
  constructor(props) {
    super(props);
    this.state = {
      selectPrimaryBtn : [],
      selectPatchBtn : [],
      selectMenuBtn : [],
    };
  }
  componentDidMount() {
    const { btnOptions } = this.props;
    let select = [];
    if (btnOptions) {
      const { primaryBtn, patchBtn, menuBtn } = btnOptions;
      this.setState({
        selectPrimaryBtn : this.getBtnData(primaryBtn) || [],
        selectPatchBtn : this.getBtnData(patchBtn) || [],
        selectMenuBtn : this.getBtnData(menuBtn) || [],
      });
    }
  }
  getBtnData = (btnData) => {
    let resData = [];
    if (!btnData) {
      return;
    }
    btnData.forEach((v) => {
      let tmpBtn = BUTTON_ARRAY.find((o) => {
        return o.key == v.key;
      });
      if (tmpBtn) {
        const { func, param } = v;
        tmpBtn = {
          ...tmpBtn,
          func,
          param,
        };
        resData.push(tmpBtn);
      }
    });
    return resData;
  };
  renderPrimaryBtn = () => {
    let items = [];
    const { selectPrimaryBtn } = this.state;
    if (selectPrimaryBtn.length == 0) {
      return items;
    }
    selectPrimaryBtn.forEach((v) => {
      items.push(<Button icon={v.icon} type="dashed" key={v.key} id={v.key}
                         onClick={() => v.func({ ...v.param })}> {v.name}</Button>);
    });
    return items;
  };
  renderPatchBtn = () => {
    let items = [];
    const { selectPatchBtn } = this.state;
    if (selectPatchBtn.length == 0) {
      return items;
    }
    selectPatchBtn.forEach((v) => {
      items.push(<Button icon={v.icon} key={v.key} onClick={() => v.func({ ...v.param })}> {v.name}</Button>);
    });
    return items;
  };
  renderMenuBtn = () => {
    let items = [];
    const { selectMenuBtn } = this.state;
    if (selectMenuBtn.length == 0) {
      return items;
    }
    selectMenuBtn.forEach((v) => {
      items.push(<Menu.Item key={v.key} onClick={() => v.func({ ...v.param })}> {v.name}</Menu.Item>);
    });
    return (<Menu>{items}</Menu>);
  };
  showMenu = () => {
    const { selectMenuBtn } = this.state;
    const menu = this.renderMenuBtn();
    if (selectMenuBtn.length > 0) {
      return (
        <Dropdown overlay={menu}>
          <Button>
            更多操作 <Icon type="down"/>
          </Button>
        </Dropdown>
      );
    }
    else {
      return '';
    }
  };
  render() {
    //selectedRows表示上层选中的数据
    const { selectedRows } = this.props;
    return (
      <div className={styles.listOperator}>
        {this.renderPrimaryBtn()}
        {selectedRows.length > 0 && (
          <span>
            {this.renderPatchBtn()}
            {this.showMenu()}
          </span>
        )}
      </div>
    );
  }
}
export default ToolBarGroup;
