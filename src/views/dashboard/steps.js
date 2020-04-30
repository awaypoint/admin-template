const steps = [
  {
    element: '#hamburger-container',
    popover: {
      title: '侧边栏开关',
      description: '开启 && 关闭侧边栏',
      position: 'bottom'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: '面包屑导航',
      description: '标明当前页面所在位置',
      position: 'bottom',
    }
  },
  {
    element: '#header-search',
    popover: {
      title: '页面搜索',
      description: '页面搜索，快速导航',
      position: 'left'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: '全屏工具',
      description: '设置页面进入全屏模式',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '页面标签',
      description: '显示页面访问历史',
      position: 'bottom'
    },
    padding: 0
  }
]

export default steps
