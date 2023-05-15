export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },

  // 首页
  {
    path: '/index',
    component: './ProjectGuide/ProjectGuideList',
  },

  {
    path: '/ProjectGuideDetail/:id',
    component: './ProjectGuide/ProjectGuideDetail',
  },

  {
    path: '/ProjectGuideNewsDetail/:id',
    component: './ProjectGuide/ProjectGuideNewsDetail',
  },
  // {
  //   path: '/projectGuideNewsMore/:id/:type/:page',
  //   component: './ProjectGuide/projectGuideNewsMore',
  // },

  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['超级管理员', '申报者', '区县市州高校管理', '专家', '教育厅处室','行政人员'],
    routes: [
      // dashboard
      {
        name:'首页',
        path: '/DashBoard',
        // component: './DashBoard/index',
        component: './DashBoard/DashBoard',
        authority:['超级管理员', '申报者', '区县市州高校管理', '专家', '教育厅处室'],
        // authority:['超级管理员'],
        icon:'home',
      },
      // {
      //   name:'地图',
      //   path: '/Map',
      //   // component: './DashBoard/index',
      //   // component: './map/form',
      //   component: './map/form',
      //   authority:['超级管理员', '申报者', '区县市州高校管理', '专家', '教育厅处室'],
      //   // authority:['超级管理员'],
      //   icon:'setting',
      // },
      { path: '/index', redirect: '/list/table-list' },
      {
        name: '站点管理',
        icon: 'environment',
        path: '/PointManagement',
        authority:['超级管理员', '申报者', '区县市州高校管理', '专家', '教育厅处室'],
        routes: [
          {
            name: '站点列表',
            path: '/PointManagement/PointsList',
            component: './PointManagement/PointsList',
          },
          {
            name: '首页站点',
            path: '/PointManagement/HomePoints',
            component: './PointManagement/HomePoints',
          },
          // {
          //   name: '图片预览',
          //   path: '/PointManagement/Picture',
          //   component: './PointManagement/Picture',
          // },
          {
            name: '新增站点',
            path: '/PointManagement/PointAdd',
            component: './PointManagement/PointAdd',
            hideInMenu: true,
          },
          {
            name: '查看站点',
            path: '/PointManagement/PointShow/:id/',
            component: './PointManagement/PointShow',
            hideInMenu: true,
          },
          {
            name: '修改站点',
            path: '/PointManagement/PointSetting/:id/',
            component: './PointManagement/PointSetting',
            hideInMenu: true,
          },
        ],
      },
      // {
      //   name: '教育主管部门功能列表',
      //   icon: 'setting',
      //   path: '/AreaDepartmentSetting',
      //   authority: ['区县市州高校管理'],
      //   routes: [
      //     {
      //       path: '/AreaDepartmentSetting/list-origin',
      //       name: '用户审核',
      //       component: './AreaDepartmentSetting/index',
      //     },
      //     {
      //       path: '/AreaDepartmentSetting/regProjectApproval',
      //       name: '项目评审',
      //       routes: [
      //         {
      //           path: '/AreaDepartmentSetting/regProjectApproval/declaration',
      //           name: '申报阶段',
      //           component: './RegProjectApproval/DeclarationStage',
      //         },
      //         {
      //           path: '/AreaDepartmentSetting/regProjectApproval/declarationList/:state/:guideId/:flag',
      //           name: '申报阶段',
      //           hideInMenu: true,
      //           component: './RegProjectApproval/DeclarationStageProjectList',
      //         },
      //         {
      //           path : '/AreaDepartmentSetting/regProjectApproval/topic',
      //           name : '立项阶段',
      //           component : './RegProjectApproval/TopicStage',
      //         },
      //         {
      //           path : '/AreaDepartmentSetting/regProjectApproval/topicList/:guideId/:type/:reviewYear',
      //           name : '立项阶段',
      //           hideInMenu : true,
      //           component : './RegProjectApproval/TopicStageList',
      //         },
      //         {
      //           path : '/AreaDepartmentSetting/regProjectApproval/topicProjectList/:guideId/:processId/:processType/:type/:reviewYear',
      //           name : '立项阶段',
      //           hideInMenu : true,
      //           component : './RegProjectApproval/TopicStageProjectList',
      //         },
      //         {
      //           path : '/AreaDepartmentSetting/regProjectApproval/topicProjectDetailScore/:guideId/:processId/:processType/:type/:projectId',
      //           name : '立项阶段',
      //           hideInMenu : true,
      //           component : './RegProjectApproval/ProjectScore',
      //         },
      //         {
      //           path: '/AreaDepartmentSetting/regProjectApproval/conclude',
      //           name: '结项阶段',
      //           component: './RegProjectApproval/ConcludeStage',
      //         },
      //         {
      //           path: '/AreaDepartmentSetting/regProjectApproval/concludeList/:guideId/:type/:reviewYear',
      //           name: '结项阶段',
      //           hideInMenu: true,
      //           component: './RegProjectApproval/ConcludeStageList',
      //         },
      //         {
      //           path: '/AreaDepartmentSetting/regProjectApproval/concludeProjectList/:guideId/:processId/:processType/:type/:reviewYear',
      //           name: '结项阶段',
      //           hideInMenu: true,
      //           component: './RegProjectApproval/ConcludeStageProjectList',
      //         },
      //         {
      //           path: '/AreaDepartmentSetting/regProjectApproval/concludeProjectDetailScore/:guideId/:processId/:processType/:type/:projectId',
      //           name: '结项阶段',
      //           hideInMenu: true,
      //           component: './RegProjectApproval/ProjectScore',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   name: '教育厅处室评审',
      //   icon: 'setting',
      //   path: '/educationDepartmentSetting',
      //   authority: ['教育厅处室'],
      //   routes: [
      //     {
      //       path : '/educationDepartmentSetting/guideList',
      //       name : '立项评审',
      //       component: './DepartmentRecommend/index',
      //     },
      //     {
      //       path: '/educationDepartmentSetting/guideProjects/:guideId/:type/:reviewYear',
      //       name : '立项评审',
      //       hideInMenu : true,
      //       component : './DepartmentRecommend/DepartmentProcessList',
      //     },
      //     {
      //       path: '/educationDepartmentSetting/departmentRecommend/:guideId/:processId/:processType/:type/:reviewYear',
      //       name : '立项评审',
      //       hideInMenu : true,
      //       component : './DepartmentRecommend/DepartmentProjectList',
      //     },
      //     {
      //       path: '/educationDepartmentSetting/departmentScore/rule/:type/:projectId/:scoreId/:reviewYear/:processId',
      //       name: '项目评分',
      //       hideInMenu : true,
      //       component: './ProjectScore/ProjectScore',
      //     },
      //     {
      //       path: '/educationDepartmentSetting/departmentScore/submit/:type/:projectId/:scoreId/:ruleId/:reviewYear/:processId',
      //       hideInMenu: true,
      //       name: '项目评分',
      //       component: './ProjectScore/ProjectScoreDetail',
      //     },
      //   ],
      // },
      {
        name: '专家功能列表',
        icon: 'setting',
        path: '/expertApproval',
        authority: ['专家'],
        routes: [
          {
            path: '/expertApproval/declaration',
            name: '立项评审',
            routes: [
              {
                path : '/expertApproval/declaration/distributionScore',
                name : '立项专家项目评分',
                component : './ExpertRecommend/index',
              },
              // {
              //   path : '/expertApproval/declaration/distribution',
              //   name : '专家项目推荐',
              //   // component : './ExpertRecommend/index',
              //   component : './RegProjectApproval/TopicStageProjectList',
              // },
              {
                path: '/expertApproval/declaration/rule/:type/:projectId/:scoreId/:reviewYear/:processId',
                name: '专家项目评分',
                hideInMenu : true,
                component: './ProjectScore/ProjectScore',
              },
              {
                path: '/expertApproval/declaration/submit/:type/:projectId/:scoreId/:ruleId/:reviewYear/:processId',
                hideInMenu: true,
                name: '专家项目评分',
                component: './ProjectScore/ProjectScoreDetail',
              },
              {
                path: '/expertApproval/declaration/:type/:projectId/:scoreId/:reviewYear/:processId',
                name: '基本信息',
                hideInMenu: true,
                hideChildrenInMenu: true,
                component: './ExpertRecommend/ScoreStep',
                routes: [
                  {
                    path: '/expertApproval/declaration/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    redirect: '/ExpertRecommend/declaration/step1/:projectId',
                  },
                  {
                    name: '基础信息',
                    path: '/expertApproval/declaration/step1/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    component: './ExpertRecommend/ScoreStep/Step1',
                  },
                  {
                    name: '基础信息',
                    path: '/expertApproval/declaration/step2/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    component: './ExpertRecommend/ScoreStep/Step2',
                  },
                  {
                    name: '基础信息',
                    path: '/expertApproval/declaration/step3/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    component: './ExpertRecommend/ScoreStep/Step3',
                  },
                ],
              },
            ],
          },
          {
            path : '/expertApproval/exp/guideProjects/:processId/:guideId/:processType/:reviewYear',
            name : '专家项目推荐',
            hideInMenu : true,
            component : './RegProjectApproval/TopicStageProjectList',
          },
          {
            path: '/expertApproval/projectApproval',
            name: '结项评审',
            routes: [
              {
                path : '/expertApproval/projectApproval/concludeDistributionScore',
                name : '结项专家项目评分',
                component : './ExpertRecommend/ConcludeList',
              },
              // {
              //   path : '/expertApproval/declaration/distribution',
              //   name : '专家项目推荐',
              //   // component : './ExpertRecommend/index',
              //   component : './RegProjectApproval/TopicStageProjectList',
              // },
              {
                path: '/expertApproval/projectApproval/rule/:type/:projectId/:scoreId/:reviewYear/:processId',
                name: '专家项目评分',
                hideInMenu : true,
                component: './ProjectScore/ProjectScore',
              },
              {
                path: '/expertApproval/projectApproval/submit/:type/:projectId/:scoreId/:ruleId/:reviewYear/:processId',
                hideInMenu: true,
                name: '专家项目评分',
                component: './ProjectScore/ProjectScoreDetail',
              },
              {
                path: '/expertApproval/projectApproval/:type/:projectId/:scoreId/:reviewYear/:processId',
                name: '基本信息',
                hideInMenu: true,
                hideChildrenInMenu: true,
                component: './ExpertRecommend/ScoreStep',
                routes: [
                  {
                    path: '/expertApproval/projectApproval/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    redirect: '/ExpertRecommend/declaration/step1/:projectId',
                  },
                  {
                    name: '基础信息',
                    path: '/expertApproval/projectApproval/step1/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    component: './ExpertRecommend/ScoreStep/Step1',
                  },
                  {
                    name: '基础信息',
                    path: '/expertApproval/projectApproval/step2/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    component: './ExpertRecommend/ScoreStep/Step2',
                  },
                  {
                    name: '基础信息',
                    path: '/expertApproval/projectApproval/step3/:type/:projectId/:scoreId/:reviewYear/:processId/:recommendType',
                    component: './ExpertRecommend/ScoreStep/Step3',
                  },
                ],
              },
            ],
            // component : './ProjectApproval/ProjectApprovalList',
          },
        ],
      },
      {
        name: '网上申报',
        icon: 'solution',
        path: '/PersonalProject',
        authority: ['申报者','超级管理员','行政人员'],
        routes: [
          {
            path: '/PersonalProject/GuideList',
            name: '我的网上申报',
            component: './PersonalProject/GuideList',
          },
          {
            path: '/PersonalProject/ProjectSubmit/taskCommitSuccess',
            name: '提交成功',
            hideInMenu: true,
            component: './PersonalProject/PersonalProjectStep/commitSuccess',
          },
          {
            path: '/PersonalProject/CommitGuide',
            name: '我的评审',
            component: './CommitReview/Guide',
          },
          // {
          //   path: '/PersonalProject/ProjectSubmit/:id/:add',
          //   name: '项目申报详情',
          //   hideInMenu: true,
          //   component: './PersonalProject/ProjectSubmit',
          // },
          // {
          //   path: '/PersonalProject/MonthNewspaper/:id',
          //   name: '项目月报',
          //   hideInMenu: true,
          //   component: './PersonalProject/MonthNewspaper',
          // },
          // {
          //   path: '/PersonalProject/ProjectContact/:id',
          //   name: '项目联系人',
          //   hideInMenu: true,
          //   component: './PersonalProject/ProjectContact',
          // },
          // {
          //   path: '/PersonalProject/MyProject',
          //   name: '我的项目',
          //   component: './PersonalProject/MyProject',
          // },
          // {
          //   path: '/PersonalProject/ImplementationPlan/:addOrEdit/:projectId',
          //   name: '实施方案',
          //   hideInMenu: true,
          //   component: './PersonalProject/ProjectImplementationPlan',
          // },
          // {
          //   path: '/PersonalProject/AnnualReview/:projectId',
          //   name: '年度评审列表',
          //   hideInMenu: true,
          //   component: './PersonalProject/AnnualReview',
          // },
          // {
          //   path: '/PersonalProject/SubmitClassicCase/:projectId',
          //   name: '经典案例列表',
          //   hideInMenu: true,
          //   component: './PersonalProject/SubmitClassicCase',
          // },
          // {
          //   path: '/PersonalProject/AnnualReviewUpload/:projectId/:editFlag/:id',
          //   name: '年度评审',
          //   hideInMenu: true,
          //   component: './PersonalProject/AnnualReviewUpload',
          // },
          // {
          //   path: '/PersonalProject/Instruction/:id',
          //   name: '申报书填写指南',
          //   hideInMenu: true,
          //   component: './PersonalProject/PersonalProjectStep/Instruction',
          // },
          {
            path: '/PersonalProject/CommitGuide/:id',
            name: '任务规则',
            hideInMenu: true,
            component: './CommitReview/RulesDetail',
          },
          {
            path: '/PersonalProject/basicInfo',
            name: '基本信息',
            hideInMenu: true,
            hideChildrenInMenu: true,
            component: './PersonalProject/PersonalProjectStep',
            routes: [
              {
                path: '/PersonalProject/basicInfo',
                redirect: '/PersonalProject/basicInfo/step1',
              },
              {
                name: '基础信息',
                path: '/PersonalProject/basicInfo/step1',
                component: './PersonalProject/PersonalProjectStep/Step1',
              },
              {
                name: '基础信息',
                path: '/PersonalProject/basicInfo/step2',
                component: './PersonalProject/PersonalProjectStep/Step2',
              },
              {
                name: '基础信息',
                path: '/PersonalProject/basicInfo/step3',
                component: './PersonalProject/PersonalProjectStep/Step3',
              },
            ],
          },
        ],
      },
      {
        name: '申报任务',
        icon: 'project',
        path: '/Guide',
        authority: ['超级管理员','行政人员'],
        routes: [
          {
            path: '/Guide/GuideList',
            name: '申报任务管理',
            component: './Guide/GuideList',
            hideChildrenInMenu: true,
          },
          {
            path: '/Guide/GuideStep',
            name: '新增任务',
            hideInMenu: true,
            hideChildrenInMenu: true,
            component: './Guide/GuideStep',
            routes: [
              {
                path: '/Guide/GuideStep',
                redirect: '/Guide/GuideStep/Step1',
              },
              {
                name: '新增任务1',
                path: '/Guide/GuideStep/Step1',
                component: './Guide/GuideStep/GuideFirstStep',
              },
              {
                name: '新增任务2',
                path: '/Guide/GuideStep/Step2',
                component: './Guide/GuideStep/GuideSecondStep2',
              },
              {
                name: '新增任务3',
                path: '/Guide/GuideStep/Step3',
                component: './Guide/GuideStep/GuideThirdStep.js',
              },
              {
                name:'新增成功界面',
                path: '/Guide/GuideStep/CommitSuccess',
                component: './Guide/GuideStep/CommitSuccess.js',
              },
            ],
          },
        ],
      },
      // {
      //   name: '网上申报',
      //   path: '/GuideFlows',
      //   icon: 'setting',
      //   authority: ['超级管理员'],
      //   routes: [
      //     {
      //       name: '指南列表',
      //       path: '/GuideFlows/GuideSetList',
      //       component: './GuideFlows/GuideSetList',
      //     },
      //     {
      //       name: '指南流程列表',
      //       path: '/GuideFlows/GuideFlowList/:flowType/:processType/:guideId/:state',
      //       component: './GuideFlows/GuideFlowList',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
      {
        name: '评定标准',
        icon: 'alert',
        path: '/GuideSetting',
        authority: ['超级管理员'],
        routes: [
          {
            name: '文明城市标准',
            path: '/GuideSetting/EndSubmitRule/RuleList',
            component: './EndSubmitRule/RuleList',
          },
          {
            name: '规则详情',
            path: '/GuideSetting/EndSubmitRule/RuleDetail',
            hideInMenu: true,
            component: './EndSubmitRule/index',
          },
          {
            name: '规则编辑',
            path: '/GuideSetting/EndSubmitRule/EditRules',
            hideInMenu: true,
            component: './EndSubmitRule/EditRules',
          },
          {
            name: '实地考察规则',
            path: '/GuideSetting/FieldTripsRules',
            component: './FieldTripsRules/FieldTripsRuleList',
          },
          {
            name: '规则分组详情',
            path: '/GuideSetting/FieldTripsRules/Detail',
            component: './FieldTripsRules/RuleGroupDetail',
            hideInMenu:true
          },
          // {
          //   name: '流程评分规则',
          //   path: '/GuideSetting/GuideFlowsScore',
          //   component: './GuideFlowsScore/index',
          // },
          {
            path: '/GuideSetting/GuideFlowsScore/:treeId/:rootId',
            name: '立项评分详情',
            hideInMenu: true,
            component: './GuideFlowsScore/GuideRuleTree',
          },
        ],
      },
      // {
      //   name: '教育厅项目评审',
      //   icon: 'audit',
      //   path: '/projectEducation/edu',
      //   authority: ['超级管理员'],
      //   routes: [
      //     {
      //       path: '/projectEducation/edu/declaration',
      //       name: '申报阶段',
      //       component: './RegProjectApproval/DeclarationStage',
      //     },
      //     {
      //       path: '/projectEducation/edu/declarationList/:state/:guideId/:flag',
      //       name: '申报阶段',
      //       hideInMenu: true,
      //       component: './RegProjectApproval/DeclarationStageProjectList',
      //     },
      //     {
      //       path : '/projectEducation/edu/topic',
      //       name : '立项阶段',
      //       component : './RegProjectApproval/TopicStage',
      //     },
      //     {
      //       path : '/projectEducation/edu/topicList/:guideId/:type/:reviewYear',
      //       name : '立项阶段',
      //       hideInMenu : true,
      //       component : './RegProjectApproval/TopicStageList',
      //     },
      //     {
      //       path : '/projectEducation/edu/topicProjectList/:guideId/:processId/:processType/:type/:reviewYear',
      //       name : '立项阶段',
      //       hideInMenu : true,
      //       component : './RegProjectApproval/TopicStageProjectList',
      //     },
      //     {
      //       path : '/projectEducation/edu/topicProjectListByExpert/:guideId/:processId/:processType/:type/:reviewYear',
      //       name : '立项阶段',
      //       hideInMenu : true,
      //       component : './ExpertDistribution/ExpertDistributionProjectList',
      //     },
      //     {
      //       path:'/projectEducation/edu/expertScoreDetail/:guideId/:processId/:processType/:type/:reviewYear',
      //       name:'评分详情',
      //       hideInMenu : true,
      //       component:'./ExpertDistribution/ExpertScoreDetail',
      //     },
      //     {
      //       path : '/projectEducation/edu/topicProjectListByDepartment/:guideId/:processId/:processType/:type/:reviewYear',
      //       name : '立项阶段',
      //       hideInMenu : true,
      //       component : './DepartmentDistribution/DepartmentDistributionProjectList',
      //     },
      //     {
      //       path : '/projectEducation/edu/departmentScoreDetail/:guideId/:processId/:processType/:type/:reviewYear',
      //       name : '推荐详情',
      //       hideInMenu : true,
      //       component : './DepartmentDistribution/DepartmentScoreDetail',
      //     },
      //     {
      //       path : '/projectEducation/edu/topicProjectDetailScore/:guideId/:processId/:processType/:type/:projectId',
      //       name : '立项阶段',
      //       hideInMenu : true,
      //       component : './RegProjectApproval/ProjectScore',
      //     },
      //     {
      //       path: '/projectEducation/rule/:type/:projectId/:scoreId/:reviewYear/:processId',
      //       name: '部门评分',
      //       hideInMenu : true,
      //       component: './ProjectScore/ProjectScore',
      //     },
      //     {
      //       path: '/projectEducation/submit/:type/:projectId/:scoreId/:ruleId/:reviewYear/:processId',
      //       hideInMenu: true,
      //       name: '部门评分',
      //       component: './ProjectScore/ProjectScoreDetail',
      //     },
      //     {
      //       path: '/projectEducation/edu/conclude',
      //       name: '结项阶段',
      //       component: './RegProjectApproval/ConcludeStage',
      //     },
      //     {
      //       path: '/projectEducation/edu/concludeList/:guideId/:type/:reviewYear',
      //       name: '结项阶段',
      //       hideInMenu: true,
      //       component: './RegProjectApproval/ConcludeStageList',
      //     },
      //     {
      //       path: '/projectEducation/edu/concludeProjectList/:guideId/:processId/:processType/:type/:reviewYear',
      //       name: '结项阶段',
      //       hideInMenu: true,
      //       component: './RegProjectApproval/ConcludeStageProjectList',
      //     },
      //     {
      //       path : '/projectEducation/edu/ConcludeProjectListByExpert/:guideId/:processId/:processType/:type/:reviewYear',
      //       name : '结项阶段',
      //       hideInMenu : true,
      //       component : './ExpertDistribution/ConcludeExpertDistributionProjectList',
      //     },
      //     {
      //       path: '/projectEducation/edu/concludeProjectDetailScore/:guideId/:processId/:processType/:type/:projectId',
      //       name: '结项阶段',
      //       hideInMenu: true,
      //       component: './RegProjectApproval/ProjectScore',
      //     },
      //   ],
      // },
      // {
      //   name: '专家管理',
      //   icon: 'idcard',
      //   path: '/Expert',
      //   authority: ['超级管理员'],
      //   routes: [
      //     {
      //       path: '/Expert/ExpertSetting',
      //       name: '专家库',
      //       component: './ExpertSetting/index',
      //     },
      //     {
      //       path: '/Expert/ExpertGroup',
      //       name:'专家分组',
      //       component:'./ExpertSetting/ExpertGroup',
      //     },
      //     {
      //       path:'/Expert/ExpertGroupDetail/:groupId',
      //       name:'专家分组',
      //       hideInMenu: true,
      //       component:'./ExpertSetting/ExpertGroupDetail',
      //     }
      //     // {
      //     //   path : '/Expert/ExpertDistrbution',
      //     //   name : '专家分配项目',
      //     //   component : './ExpertDistrbution/index',
      //     // },
      //   ],
      // },
      // {
      //   name:'月报采纳',
      //   icon:'setting',
      //   path:'/ReportAdopt',
      //   authority : ['超级管理员'],
      //   routes : [
      //     {
      //       path : '/ReportAdopt/index',
      //       name : '月报采纳',
      //       component : './ReportAdopt/index',
      //     },
      //
      //   ],
      // },
      {
        name: 'exception',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            hideInMenu: true,
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            hideInMenu: true,
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            hideInMenu: true,
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: '系统设置',
        icon: 'tool',
        path: '/basicSetting',
        authority: ['超级管理员', '区县市州高校管理', '教育厅处室'],
        routes: [
          {
            path: '/basicSetting/DepartmentSetting',
            name: '部门管理',
            component: './DepartmentSetting/index',
            authority: ['超级管理员'],
          },
          {
            path: '/basicSetting/AreaSetting',
            name: '区域管理',
            component: './DepartmentSetting/AreaIndex',
            authority: ['超级管理员'],
          },
          // {
          //   name: '学校管理',
          //   path: '/basicSetting/schoolmanagement',
          //   component: './SchoolSetting/index',
          //   authority: ['超级管理员', '区县市州高校管理', '教育厅处室'],
          // },
          {
            path: '/basicSetting/DataDict',
            name: '数据字典',
            component: './DataDictionary/index',
            authority: ['超级管理员'],
          },
          {
            path: '/basicSetting/DataDict/:type/:id',
            name: '子字典',
            component: './DataDictionary/DataDictionaryItemsList',
            hideInMenu: true,
            authority: ['超级管理员'],
          },
          {
            path: '/basicSetting/UserSetting',
            name: '用户管理',
            component: './UserSetting/index',
            authority: ['超级管理员'],
          },
          {
            name: '角色管理',
            path: '/basicSetting/rolemanagement',
            component: './RoleSetting/index',
            authority: ['超级管理员'],
          },
          // {
          //   name: '图片管理',
          //   path: '/basicSetting/PicController',
          //   component: './PicController/PicController',
          //   authority: ['超级管理员'],
          // },
        ],
      },
      {
        name: '用户',
        icon: 'setting',
        path: '/account',
        hideInMenu: true,
        routes: [{
          name: '个人中心',
          path: '/account/center',
          component: './Account/Center/Center',
        }, {
          name: '个人设置',
          path: '/account/setting/base',
        }],
      },
      // {
      //   name: '新闻公告',
      //   icon: 'message',
      //   path: '/news',
      //   authority: ['超级管理员'],
      //   routes: [{
      //     name: '新闻发布',
      //     path: '/News/NewsSetting',
      //     component: './News/index',
      //   }, {
      //     path: '/News/ChangeNews/:id/:add',
      //     name: '新闻编辑',
      //     hideInMenu: true,
      //     component: './News/ChangeNews',
      //   }, {
      //     path: '/News/ShowNews/:id/:draf',
      //     name: '新闻详情',
      //     hideInMenu: true,
      //     component: './News/ShowNews',
      //   }],
      // },
      // {
      //   name: '项目总览',
      //   icon: 'file-search',
      //   path: '/getProjectAllInfo',
      //   authority: ['超级管理员'],
      //   routes: [
      //     {
      //       path: '/getProjectAllInfo/GuideList',
      //       name: '项目详情',
      //       component: './GetProjectAllInfo/index',
      //     },
      //     {
      //       path: '/getProjectAllInfo/ProjectListGetByGuide/:guideId',
      //       name: '项目详情',
      //       hideInMenu: true,
      //       component: './GetProjectAllInfo/ProjectList',
      //     },
      //     {
      //       path: '/getProjectAllInfo/ProjectRecommendDetail/:guideId/:projectId',
      //       name: '项目详情',
      //       hideInMenu: true,
      //       component: './GetProjectAllInfo/GetProjectRecommendDetail',
      //     },{
      //       path: '/getProjectAllInfo/ProjectYearResult/:guideId/:projectId/:reviewYear',
      //       name: '年度评审结果',
      //       hideInMenu: true,
      //       component: './GetProjectAllInfo/ProjectYearResult',
      //     },{
      //       path: '/getProjectAllInfo/ClassicCase/:guideId',
      //       name: '经典案例',
      //       hideInMenu: true,
      //       component: './GetProjectAllInfo/ClassicCase',
      //     }],
      // },
      // {
      //   name: '项目直通车',
      //   icon: 'car',
      //   path: '/EduMangeProjects',
      //   authority: ['超级管理员'],
      //   routes: [
      //     {
      //       path: '/EduMangeProjects/GuideList',
      //       name: '修改项目',
      //       component: './EduMangeProjects/EditProjects_Guides',
      //     },
      //     {
      //       path: '/EduMangeProjects/ProjectsList/:guideId',
      //       name: '修改项目',
      //       hideInMenu: true,
      //       component: './EduMangeProjects/EditProjects_Projects',
      //     },
      //     {
      //       path:'/EduMangeProjects/EditProject/EditPage/:guideId/:projectId',
      //       name:'修改项目',
      //       hideInMenu:true,
      //       component:'./EduMangeProjects/EditProjects_EditPage'
      //     },
      //     {
      //       path: '/EduMangeProjects/CreateProjects/',
      //       name: '新增项目',
      //       // hideInMenu: true,
      //       // hideChildrenInMenu: true,
      //       component: './EduMangeProjects/CreateProjectsStep',
      //       routes: [
      //         {
      //           path: '/EduMangeProjects/CreateProjects',
      //           redirect: '/EduMangeProjects/CreateProjects/step1/:guideId',
      //         },
      //         {
      //           name: '新增项目',
      //           path: '/EduMangeProjects/CreateProjects/step1/:guideId',
      //           component: './EduMangeProjects/CreateProjectsStep/Step1',
      //         },
      //         {
      //           name: '新增项目',
      //           path: '/EduMangeProjects/CreateProjects/step2/:guideId',
      //           component: './EduMangeProjects/CreateProjectsStep/Step2',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
