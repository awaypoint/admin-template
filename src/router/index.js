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
    children: [
      {
        path: 'dashboard',
        name: '首页',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
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
    redirect: '/factory/index',
    children: [

      {
        path: 'index',
        component: () => import('@/views/factory/index'),
        name: 'factory',
        route: 'Factory',
        meta: { title: '厂家管理', icon: 'factory' }
      }
    ]
  },

  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/index',
    children: [

      {
        path: 'index',
        component: () => import('@/views/shop/index'),
        name: 'shop',
        route: 'Shop',
        meta: { title: '店铺管理', icon: 'shop' }
      }
    ]
  },

  {
    path: '/buyer',
    component: Layout,
    redirect: '/buyer/index',
    children: [

      {
        path: 'index',
        component: () => import('@/views/buyer/index'),
        name: 'buyer',
        route: 'Buyer',
        meta: { title: '买家管理', icon: 'peoples' }
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    children: [

      {
        path: 'index',
        component: () => import('@/views/product/index'),
        name: 'product',
        meta: { title: '产品管理', icon: 'theme' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    children: [

      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'order',
        route: 'Order',
        meta: { title: '订单管理', icon: 'money' }
      }
    ]
  },

  {
    path: '/store',
    component: Layout,
    redirect: 'noRedirect',
    name: 'store',
    meta: { title: '库存管理', icon: 'money' },
    children: [

      {
        path: 'stock',
        component: () => import('@/views/stock/index'),
        name: 'stock',
        meta: { title: '仓库列表', icon: 'money' }
      },
      {
        path: 'stockin',
        component: () => import('@/views/stockin/index'),
        name: 'stockin',
        meta: { title: '入库', icon: 'money' }
      },
      {
        path: 'stockout',
        component: () => import('@/views/stockout/index'),
        name: 'stockout',
        meta: { title: '出库', icon: 'money' }
      },
      {
        path: 'replenishment',
        component: () => import('@/views/replenishment/index'),
        name: 'replenishment',
        meta: { title: '补货列表', icon: 'money' }
      }

    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'system',
    meta: { title: '系统设置', icon: 'setting' },
    children: [

      {
        path: 'user',
        component: () => import('@/views/users/index'),
        name: 'user',
        route: 'Users',
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        component: () => import('@/views/roles/index'),
        name: 'roles',
        route: 'Roles',
        meta: { title: '角色管理', icon: 'role' }
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
