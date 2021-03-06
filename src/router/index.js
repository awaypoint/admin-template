import Vue from 'vue'
import Router from 'vue-router'

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
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      route:'',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

/**
 * 需要配置权限的菜单
 * route = ’‘ 表示公有菜单
 */
export const asyncRoutes = [
  {
    path: '/factory',
    component: Layout,
    redirect: '/factory',
    name: 'factory',
    meta: { title: '厂家管理', icon: 'nested' },
    children: [

      {
        path: 'factory',
        component: () => import('@/views/factory/index'),
        name: 'factory',
        route: 'Factory',
        meta: { title: '厂家管理', icon: 'nested' }
      }
    ]
  },

  {
    path: '/shop',
    component: Layout,
    redirect: '/shop',
    name: 'shop',
    meta: { title: '店铺管理', icon: 'nested' },
    children: [

      {
        path: 'shop',
        component: () => import('@/views/shop/index'),
        name: 'shop',
        meta: { title: '店铺管理', icon: 'nested' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'system',
    meta: { title: '系统设置', icon: 'nested' },
    children: [

      {
        path: 'user',
        component: () => import('@/views/system/users/index'),
        name: 'user',
        route: 'Users',
        meta: { title: '用户管理', icon: 'nested' }
      },
      {
        path: 'role',
        component: () => import('@/views/system/roles/index'),
        name: 'roles',
        route: 'Roles',
        meta: { title: '角色管理', icon: 'nested' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', route: '', redirect: '/404', hidden: true }
]

export const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
