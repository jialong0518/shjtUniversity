import Vue from 'vue'
import Router from 'vue-router'
import { researchlist } from "@/api/topicGroupManage";


Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
let constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/byd',
    children: [{
      path: 'byd',
      name: 'byd',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '上海交通大学专家管理系统' }
    }]
  },

  {
    path: '/powerManage',
    component: Layout,
    redirect: '/powerManage',
    name: 'powerManage',
    meta: { title: '权限管理' },
    children: [
      {
        path: 'accountManage',
        name: 'accountManage',
        component: () => import('@/views/powerManage/account/index'),
        meta: { title: '用户管理' }
      },
      // {
      //   path: 'roleManage',
      //   name: 'roleManage',
      //   component: () => import('@/views/powerManage/role/index'),
      //   meta: { title: '角色管理' }
      // },
      // {
      //   path: 'roleManage',
      //   name: 'roleManage',
      //   component: () => import('@/views/powerManage/role/index'),
      //   meta: { title: '角色管理' }
      // },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('@/views/powerManage/dictionary/index'),
        meta: { title: '字典表管理' }
      }
    ]
    
  },
  {
    path: '/expertBasics',
    component: Layout,
    redirect: '/expertBasics',
    name: 'expertBasics',
    meta: { title: '专家基础库' },
    children: [
      {
        path: 'expertBasics',
        name: 'expertBasics',
        component: () => import('@/views/expertBasics/index'),
        meta: { title: '专家基础库' }
      },
      {
        path: 'importResults',
        name: '导入记录',
        component: () => import('@/views/importResults/index'),
      },
    ]
  },
  {
    path: '/uploadRecord',
    component: Layout,
    redirect: '/uploadRecord',
    name: 'uploadRecord',
    meta: { title: '导入记录' },
    children: [
      {
        path: 'uploadRecord',
        name: 'uploadRecord',
        component: () => import('@/views/uploadRecord/index'),
        meta: { title: '导入记录' }
      }
    ]
  },
  {
    path: '/yearManage',
    component: Layout,
    redirect: '/yearManage',
    name: 'yearManage',
    meta: { title: '年份管理' },
    children: [
      {
        path: 'yearManage',
        name: 'yearManage',
        component: () => import('@/views/yearManage/index'),
        meta: { title: '年份管理' }
      }
    ]
  },
  {
    path: '/expertSeniority',
    component: Layout,
    redirect: '/expertSeniority',
    name: 'expertSeniority',
    meta: { title: '专家资格库' },
    children: [
      {
        path: 'expertSeniority',
        name: 'expertSeniority',
        component: () => import('@/views/expertSeniority/index'),
        meta: { title: '专家资格库' }
      }
    ]
  },
  {
    path: '/interviewManage',
    component: Layout,
    redirect: '/interviewManage',
    name: 'interviewManage',
    meta: { title: '面试管理' },
    children: [
      {
        path: 'interviewManage',
        name: 'interviewManage',
        component: () => import('@/views/interviewManage/index'),
        meta: { title: '面试管理' }
      },
      {
        path: 'interviewRound',
        name: '面试场次',
        component: () => import('@/views/interviewRound/index'),
      },
      {
        path: 'confirmStatus',
        name: '面试确认情况',
        component: () => import('@/views/confirmStatus/index'),
      },
    ]
  },
  {
    path: '/operationLog',
    component: Layout,
    redirect: '/operationLog',
    name: 'operationLog',
    meta: { title: '操作日志' },
    children: [
      {
        path: 'operationLog',
        name: 'operationLog',
        component: () => import('@/views/operationLog/index'),
        meta: { title: '操作日志' }
      }
    ]
  },
  {
    path: '/smsLog',
    component: Layout,
    redirect: '/smsLog',
    name: 'smsLog',
    meta: { title: '短信日志' },
    children: [
      {
        path: 'smsLog',
        name: 'smsLog',
        component: () => import('@/views/smsLog/index'),
        meta: { title: '短信日志' }
      }
    ]
  },
  {
    path: '/emailLog',
    component: Layout,
    redirect: '/emailLog',
    name: 'emailLog',
    meta: { title: '邮件日志' },
    children: [
      {
        path: 'emailLog',
        name: 'emailLog',
        component: () => import('@/views/emailLog/index'),
        meta: { title: '邮件日志' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics',
    name: 'statistics',
    meta: { title: '数据统计' },
    children: [
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '数据统计' }
      },
      {
        path: 'sessions',
        name: '场次',
        component: () => import('@/views/statistics/sessions'),
      },
    ]
  },
  
  // emailLog  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
console.log(Router,'this.$route.path')
// researchlist({"title": '',
//       "linkman": '',
//       "uid": '1',
//       "sort": ''
//       })
//       .then(r => {
//             console.log(r.data.data_list,'luyou')
//             console.log(constantRoutes,'constantRoutes')
//             r.data.data_list.map((item, index)=>{
//                 constantRoutes[index+5].meta.title = item.title
//             })
//             // r.data.rights_list.map(item=>{
//             // this.rights_list[item.rights] = item.rights_id
//             // })  
//             localStorage.setItem('rt',JSON.stringify(constantRoutes))
//         }).catch(() => {});
    const createRouter = () => new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes 
      })
      const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  return
    researchlist({"title": '',
      "linkman": '',
      "uid": '1',
      "sort": ''
      })
      .then(r => {
            console.log(r.data.data_list,'luyou')
            console.log(constantRoutes,'constantRoutes')
            r.data.data_list.map((item, index)=>{
                constantRoutes[index+5].meta.title = item.title
            })
            localStorage.setItem('rt',JSON.stringify(constantRoutes))
            // r.data.rights_list.map(item=>{
            // this.rights_list[item.rights] = item.rights_id
            // })  
            const newRouter = createRouter()
            router.matcher = newRouter.matcher // reset router
        }).catch(() => {});
  
}

export default router
