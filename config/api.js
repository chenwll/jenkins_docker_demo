export default {
  // 请求方式
  BASE_URL : '',
  REQUEST_METHOD : 'axiosRequest',
  VERSIONS:'Versions：2.3',
  // 请求接口
  API : {
    //实地考察站点类型规则组
    CHECKGROUP:'/check/group',
    CHECKRULE:'/check/rule',
    ACCEPT : '/accept',
    ADVANCELIST : '/advancelist',
    ROLE:'/admin/roles',
    // ROLE : '/api/roles',
    DATADICT:'/admin/dicts',
    // DATADICT : '/api/dicts',
    USER:'/admin/user',
    // USER : '/api/users',
    DISPUTE : '/accept',
    LOGIN : '/user/login',
    // LOGIN : '/login',
    ISUBMITTED : '/isubmitted',
    PERMISSIONS : '/api/permissions',
    INOTICE : '/inotice',
    ISUBMITTEDREVIEW : '/isubmitted/review',
    ASSIGN : '/assign',
    FILE:'/admin/sys-file',
    // FILE : '/api/files',
    NEWS:'/admin/news',
    // NEWS : '/api/news',
    TAG : '/tag',
    EDIT : '/editingNews',
    GOODS : '/api/goods',
    PROVIDER : '/api/provider',
    DEPARTMENT : "/api/dep",
    GOODSTYPE:"/api/goodstype",
    REG:"/api/reg/prj",
    DICT:'/admin/dicts',
    // DICT:"/api/dicts",
    PICTURE:"/api/picture",

    APPLICATION:"/api/apl/prj",
    EDUCATION:"/api/edu/prj",
    DICTS:'/admin/dicts',
    // DICTS:"/api/dicts",
    // ERULES:"/api/edu/rules",
    ERULES:"/evaluation/rule", //评定标准规则
    REGUSER:"/api/reg/user",
    ESRULES:"/api/edu/srules",
    EDEPARTMENT:"/api/edu/dep",
    REGISTER:"/user/register",
    // REGISTER:"/api/apl",
    SCHOOL:"/api/school",
    GUIDEFLOW:"/api/edu/process",

    PROJECTSTATICS:'/api/edu/statics',
    PROJECTPERSON:'/api/apl/person',
    MONTH:'/api/apl/month',
    CONCLUSION:'/api/apl/con',
    APPLICANT:'/api/apl/apl',
    PROJECTREFS:'/api/edu/projectRefs',//项目推荐
    ENEWS:'/api/edu/news',
    //区域管理功能API
    REGSTATICS:'/api/reg/statics',//区域项目统计
    REGPROJECTREF:'/api/reg/projectRefs',//区域项目推荐
    // REGGUIDE:'/api/guide',
    REGGUIDE:'/guide',

    //申报者功能API
    // APPLICANTGUIDE:'/api/guide',//申报者的
    APPLICANTGUIDE:'/guide',
    //区域打分API
    REGSCORE: '/api/reg/score',

    //区域打分API
    SCORE: '/api/edu/score',

    //教育厅功能API
    EDUCATIONDEPARTMENTGUIDE:"/api/edu/guide",

    PROJECTDISTRBUTION:'/api/edu/prjDis',
    PROJECTEXPERT:'/api/edu/prjExp',
    EXPGUIDE:"/api/exp",
    EXPERTDISTRIBUTION:'/api/exp/projectRefs',
    STATIS:'/api/edu/statis',
    RANK:'/api/edu/rank',
    PRJEVALUATE:'/api/edu/prjEvaluate',
    WITHDRAW:'/api/edu',
    EDUANNEX:'/api/edu/annex',

    //专家功能API
    EXPERT:'/api/edu/exp',
    EXPERTGROUP:'/api/expertGroup',
    EXPERTPROJECT:'/api/exp',


    //点赞与浏览量
    NEWSEDU:"/api/news",
    GUIDEEDU:'/api/guide',

    //轮播图
    IMG:'/api/picture',

    //教育厅年度申报
    ANNUAL:'/api/apl/con',
    ANNEX:'/api/apl/annex',

    //以下为项目新增API，若与上方有冲突，则注释原来的
    //公共参数配置
    PARAM:'/admin/param',

    //日志管理模块
    LOG:'/admin/log',

    //登录认证访问
    GETCAPTCHA:'/getcaptcha',
    LOGINOUT:'/loginout',
    USERINFO:'/user/info',

    //系统通知管理
    NOTICE:'/admin/notice',

    //菜单模块管理
    MENU:'/admin/menu',

    //部门模块管理
    DEPT:'/admin/dept',

    // 站点管理
    SITE:'/site',

    //网上申报内容管理
    COMMIT:'/commit',

    GUIDE:'/guide',

    //规则部门任务管理(指南分配规则部门任务)
    EVALUATIONDEPT:'/evaluation/dept',
    EVALUATION:'/evaluation',
    EVALUATIONRULE:'/evaluation/rule',

    //在线申报提交要求管理
    TASKCOMMIT:'/task/commit',

    // 首页站点
    HOMESITE:'/sitepage'
  },
};
