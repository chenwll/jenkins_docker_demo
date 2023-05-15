export const BLANK_PRICE_DATA = [{
  text : '是',
  value : '0',
}, {
  text : '否',
  value : '1',
}];


export const MAP_KEY = '7119e9a6beacbb614c54abe5ac894f20'

export const SIGN_COLOR = {
  '1' : '#1F5DEA',
  '2' : '#FF9500',
  '3' : '#00C185',
  '4' : '#F75C5C',
  '5' : '#6C5AC9',
  '6' : '#25B3FA',
  '7' : '#6B798E',
};

export const EDIT_FLAG = {
  'ADD' : 0,
  'EDIT' : 1,
};

export const RESPONSE_CODE = {
  NORMAL : 0,
};

export const WHITELIST_CODE = [
  401,
];

export const GOODS_DETAIL_STATUS = {
  'EDIT' : 0,
  'ADD' : 1,
};

export const ROLES_DETAIL_STATUS = {
  'EDIT' : 1,
  'ADD' : 0,
};

export const MENUS_DETAIL_STATUS = {
  'EDIT' : 0,
  'ADD' : 1,
};

export const PROJECT_STATUS = {
  'EDIT' : 0,
  'ADD' : 1,
};

export const SCHOOL_TYPE = [
  { value : 0, text : '学前教育' },
  { value : 1, text : '义务教育' },
  { value : 2, text : '普通高中' },
  { value : 3, text : '中等职业教育' },
  { value : 4, text : '教育行政管理部门' },
  { value : 5, text : '高等职业教育' },
  { value : 6, text : '本科' },
];

export const GUIDE_STATE = [
  { value : 0, text : '初稿' },
  { value : 1, text : '已审核' },
  { value : 2, text : '提交' },
  { value : 3, text : '开始申报' },
  { value : 4, text : '申报结束' },
  { value : 5, text : '立项审核开始' },
  { value : 6, text : '立项审核结束' },
  { value : 7, text : '结项提交开始' },
  { value : 8, text : '结项提交结束' },
  { value : 9, text : '结项评审开始' },
  { value : 10, text : '结项评审结束' },
  { value : 11, text : '月报加分开始' },
  { value : 12, text : '月报加分结束' },
  { value : 13, text : '教育厅最终评定开始' },
  { value : 14, text : '教育厅最终评定结束' },
];

// 评价等级
export const SCORE_GRADE =[
  {value:0,text:'不推荐'},
  {value:1,text:'推荐'},
  {value:2,text:'强烈推荐'},
];
export const PROCESS_STAGE_TEXT =[
  {value:1,text:'立项阶段'},
  {value:2,text:'结项阶段'},

];

export const PROCESS_TYPE_TEXT =[
  {value:1,text:'推荐'},
  {value:2,text:'评分'},
  {value:3,text:'分配专家推荐'},
  {value:4,text:'分配专家打分'},
  {value:5,text:'分配部门推荐'},
  {value:6,text:'分配部门打分'},


];

//数据字典
export const DATA_DICTIONARY_DETAIL_STATUS = {
  'EDIT' : 1,
  'ADD' : 0,
};

//部门管理
export const DEPARTMENT_DETAIL_STATUS = {
  'EDIT' : 1,
  'ADD' : 0,
};
export const DEP_TYPE =[
  {value:1,text:'区县教育局'},
  {value:2,text:'市州教育行政部门'},
  {value:3,text:' 教育厅'},
  {value:4,text:'教育厅管理部门'},
];
export const RANK =[
  {value:0,text:'不合格'},
  {value:1,text:'合格'},
  {value:2,text:'良好'},
  {value:3,text:' 优秀'},
];

//学校管理
export const SCHOOL_DETAIL_STATUS = {
  'EDIT' : 1,
  'ADD' : 0,
};

//流程立项选项
export const FLOW_TYE = {
  COLLEGES_TYPE : 0,//高校
  UN_COLLEGES_TYPE : 1,//非高校
};
// processStage:  1-表示立项阶段  2-表示结项阶段
export const FLOW_PROCESSSTAGE_TYPE = {
  PROJECT_APPROVAL : 1,//项目立项
  PROJECT_CONCLUSION : 2,//项目结项
};

export const EXPERT_DETAIL_STATUS = {
  ADD : 0,
  EDIT : 1,
};

export const NEWS_STATUS = {
  ADD : 0,
  EDIT : 1,
  DRAFT : 2,//草稿
  TEXT : 3,
};

export const PROJECT_DISBUTION_CHOOSEDEP = {
  ADD : 0,
  EDIT : 1,
};


export const EXPERT_DISBUTION_CHOOSEDEP = {
  ADD : 0,
  EDIT : 1,
};

export const PROJECT_DEPARTMENT_TYPE = {
  DISTRICT : 1,
  CITY : 2,
  UNIVERSITIES : 3,
  EDUCATION : 4,
  EDUCATION_DEPART : 5,
};

export const PROJECT_BUTTON_LIST = {
  RECOMMEND : 2 ** 0,
  EXPERT : 2 ** 1,
  DISTRIBUTION : 2 ** 2,
  SCORE : 2 ** 3,
};
// processType :评价形式 1 推荐 2 评分 3 分配专家推荐 4分配专家打分 5 分配部门推荐，6分配部门打分
export const PROJECT_PROCESS_TYPE = {
  APPROVAL : 1,
  SCORE : 2,
  EXPERT_APPROVAL : 3,
  EXPERT_SCORE : 4,
  DEPART_APPROVAL : 5,
  DEPART_SCORE : 6,
};
export const BROWSER_AND_RESOLUTION = {
  IE_VERSIONS : 9,
  RESOLUTION_WIDTH : 1024,
  RESOLUTION_HEIGHT : 768,
};

export const NEWS_CONTENT_STATE = {
  draft : 0,
  text : 1,//新闻正文
};

export const INDEX_NEWSTYPE = {
  ANNOUNCEMENTS : 0, //通知公告
  REFORM : 1, //改革动态
  OPERATIONGUIDE : 2, //操作指南
  GUIDE : 3, //指南
};

export const NEWS_STATE = {
  RELEASE : 1,
  OPERATION : 3,
};
export const SHOW_PAGE = {
  INDEX : 1,
  LIST : 2,
};

export const PROJECT_STATE = [
  { value : 0, text : '开始申报' },
];

export const MYPROJECT_STATE = {
  DRAFT : 0,   // 草稿
  SUBMIT : 1,   //  提交
  UNDERREVIEW : 2,  // 立题审核中
  REVIEW_FAILURE : 3,  // 立题失败
  REVIEW_SUCCESS : 4,  //  立题审核成功
  CONCLUDING_START : 5,  // 结项提交开始

};

export const REFSUBMITSTATE = [
  { k : '', val : '未提交' },
  { k : 1, val : '已提交' },
];

export const CLASSIC_CASE_SUBMIT = [
  { k : 0, value : 0 ,text:'未提交'},
  { k : 1, value : 1 ,text:'已提交'},
];

export const REFSUBMITSTATE1 = [
  { k : 0, val : '未提交' },
  { k : 1, val : '提交未通过' },
  { k : 2, val : '提交通过' },
];


export const REFSUBMITSTATEOBJ = {
  UNSUBMIT : 0,
  REFUSE : 1,
  SUBMIT : 2,
};


export const REFSTYPE = {
  ADMINISTRATIVE_DEPARTMENT : 1,  //  行政部门
  EXPERT : 3,   //  专家
  MANAGEMENT_DEPARTMENT : 5,   //  管理部门
  SCHOOL : 7,   //  学校
};


export const documentRequireArr = ['附件大小不能超过50M', '文件名长度不能超过50',
  '文件名中只能包含数字,字母和数字,如项目任务书.doc',
  '只有.zip,.rar,.doc,.docx,.xls,.xlsx,.pdf,.zip文件才能上传'];

export const guideConentRequire = '<p><span style="color:#c0392b">内容中不能包含图片，图片需作为附件单独上传!</span></p>';


export const guideFlowsPassType = {
  COUNT : 0,
  SCORE : 1,
};

export const guideFlowsPassTypeArr = [
  { k : 0, val : '按计数通过' },
  { k : 1, val : '按平均分通过' },
];

export const guideFlowExplain = ['通过个数', '阶段平均分'];

export const depOrExpDistribution = {
  DEP : 1,
  EXP : 2,
};

export const ProjectHasSubmit = {
  YES : 1,
  NO : 0,
};

//  权重范围
export const WEIGHT_RANGE = {
  MIN : 0,
  MAX : 99,
};

//  默认权重值
export const DEFAULT_WEIGHT = 50;

//区域下获取流程中的所有项目
export const REG_STATICS_SELFPROJECTS_STATE = {
  UNFINISH : 0,
  UNPASS : 1,
  PASS : 2,
};

export const PROJECTSCORE_DEP_OR_EXP = {
  EXP : 0,
  DEP : 1,
};

export const PROJECT_IMPLEMENTATION_PLAN ={
  NOT_SAVE:"0",
  SAVE:"1",
  SUBMIT:"2",
};

export const CLASSIC_CASE ={
  NOT_SAVE:"0",
  SAVE:"1",
  SUBMIT:"2",
};

export const RECOMMEND_STATE = [
  { k : '0', val : '未保存' },
  { k : '1', val : '保存' },
  { k : '2', val : '一票否决' },
];


export const SCORE_RECOMMEND  ={
  SCORE : 0,
  RECOMMEND : 1,
};

export const RECOMMEND_SCORE = {
  SCORE : 0,
  RECOMMEND : 1,
};
export const  PROCESS_SCHOOL_TYPE= [
  { k : '1', val : '普通学校' },
  { k : '0', val : '高校' },

];

export const FILE_TYPE=[{
  k:"AnnualReport",
  val:'年度总结报告',
  color:"#FF9500"
  },{
    k:'SCL',
    val:'代表性成果',
  color:"#1F5DEA",
  },{
    k:"PM",
    val:'项目管理',
  color:"#F75C5C"
  },{
    k:'ProjectProgress',
    val:'项目进展',
  color:"#f79edc"
  },{
    k:'ProjectResults',
    val:'项目成效',
  color:"#2ef4f7"
  }
]


export const RECOMMEND_TYPE={
  TOPIC:'topic',
  CONCLUDE:'conclude'
}


export const PROCESS_STAGE={
  TOPIC:1,
  CONCLUDE:2
}

export const SYSTEM_PROPERTY={
  NAME:'文明城市评测系统',
  CORYRIGHT:"2018 西南科技大学计算机科学与技术学院出品",
}

export const ACCOUNT_PRIVILEGES={
  Education_Office:'教育厅处室',
  Admin:'超级管理员',
  Axpert:'专家',
  Area_County:'区县市州高校管理',
  Declarant:'申报者'
}

export const GUIDE_STAGE={
  DECLARE:0,
  TOPIC:1,
  CONCLUDE:2,
}


//部门管理接口
export const DEPARTMENT_TYPE = {
  ADMIN:2,
  AREA:1,
  INSPECT:3
}


export const DEPARTMENT_TYPE_ARRAY = [
  {
    k: '1',
    val:'区域部门'
  },
  {
    k: '2',
    val:'行政部门'
  },
  {
    k: '3',
    val:'考察部门'
  }
]

export const POINT_FLAG = {
  'ADD':0,
  'EDIT':1,
  'SHOW':2,
  'ALL':3,
}

export const MIAN_YANG_CITY_CODE = '0816'

export const POINT_FORM_TYPE = {
  'NORMAL':'0',
  'THUMBNAIL':'1',
  'OTHER':'2',
  'TEXT':'3',
  'BRAFTEDITOR':'4'
}

//角色类型
export const ROLE_TYPES = {
  ADMIN:1,
}

export const MIAN_YANG_LNGLAT = {
  LONGITUDE:104.679127,
  LATITUDE:31.467673,
}

export const TASK_COMMMIT_TYPE = {
  PICTURE: 1,
  TEXT: 2,
  FILE: 3,
}

//规则申报页面状态
export const  RULE_DECLARATION_TYPE = {
  DECLARATION:0,
  DRAFT:1,
  COMMIT:2,
}

export const STATUSFILTER = [
  {value:0, label:'申报状态'},
  {value:1, label:'草稿状态'},
  {value:2, label:'提交状态'}
]

export const UPLOAD_TYPE = {
  'PICTURE':0,
  'FILE':1,
}

// 指南对应的状态，依次为:未创建（前端自己用，无关后端）,初稿，发布，开始申报，申报结束，指南结束
export const GUIDESTATUS = {
  'WILLCREATE':-1,
  'DRAFT':0,
  'PUBLISH':1,
  'DECLARE':2,
  'DECLAREEND':3,
  'GUIDEND':4
}

// 申报文件上传model标题
export const DECLARATION_MODEL_TITLE = {
  '1' : '图片上传',
  '2' : '文本填写',
  '3' : '文件上传'
}