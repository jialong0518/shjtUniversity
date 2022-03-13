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
      meta: { title: '白洋淀成果展示大屏管理后台' }
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
        meta: { title: '账号管理' }
      },
      {
        path: 'roleManage',
        name: 'roleManage',
        component: () => import('@/views/powerManage/role/index'),
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/topicGroupManage',
    component: Layout,
    redirect: '/topicGroup',
    name: 'topicGroup',
    meta: { title: '课题菜单管理' },
    children: [
      {
        path: 'topicGroupManage',
        name: 'topicGroupManage',
        component: () => import('@/views/topicGroupManage/index'),
        meta: { title: '课题菜单管理' }
      }
    ]
  },
  {
    path: '/water',
    component: Layout,
    redirect: '/water',
    name: 'water',
    meta: { title: '水环境' },
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置' }
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  {
    path: '/organisms',
    component: Layout,
    redirect: '/organisms',
    name: 'organisms',
    meta: { title: '生态毒理与生物安全' },
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置' }
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  {
    path: '/carbon',
    component: Layout,
    redirect: '/carbon',
    name: 'carbon',
    meta: { title: '碳通量数据'},
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置'}
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  {
    path: '/sub4',
    component: Layout,
    redirect: '/sub4',
    name: 'sub4',
    meta: { title: '课题4'},
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置'}
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  {
    path: '/sub5',
    component: Layout,
    redirect: '/sub5',
    name: 'sub5',
    meta: { title: '课题5'},
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置'}
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  {
    path: '/sub6',
    component: Layout,
    redirect: '/sub6',
    name: 'sub6',
    meta: { title: '课题6'},
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置'}
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  {
    path: '/sub7',
    component: Layout,
    redirect: '/sub7',
    name: 'sub7',
    meta: { title: '课题7'},
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置'}
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  {
    path: '/sub8',
    component: Layout,
    redirect: '/sub8',
    name: 'sub8',
    meta: { title: '课题8'},
    children: [
      {
        path: 'showModuleDeploy',
        name: 'showModuleDeploy',
        component: () => import('@/views/showModuleDeploy/index'),
        meta: { title: '展示模块配置'}
      },
      {
        path: 'markPointManage',
        name: 'markPointManage',
        component: () => import('@/views/markPointManage/index'),
        meta: { title: '标记点配置' }
      },
      {
        path: 'weatherManage',
        name: 'weatherManage',
        component: () => import('@/views/weatherManage/index'),
        meta: { title: '天气动效配置' }
      },
      {
        path: 'editShowModule',
        name: 'editShowModule',
        component: () => import('@/views/showModuleDeploy/editShowModule/index'),
        name: '编辑',
      },
      {
        path: 'editmarkPointModule',
        name: 'editmarkPointModule',
        component: () => import('@/views/markPointManage/editmarkPointModule/index'),
        name: '编辑',
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
console.log(Router,'this.$route.path')
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
            // r.data.rights_list.map(item=>{
            // this.rights_list[item.rights] = item.rights_id
            // })  
            localStorage.setItem('rt',JSON.stringify(constantRoutes))
        }).catch(() => {});
    const createRouter = () => new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes 
      })
      const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
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
