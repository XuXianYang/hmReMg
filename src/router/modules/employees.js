import layout from '@/layout'

// 一级路由：员工
export default {
  path: '/employees',
  name: 'employees',
  // 每个子模块都要有layout作为外层组件，因此以及路由组件都是layout，二级路由默认是该子模块
  component: layout,
  children: [
    {
      name: 'employees',
      path: '', // 此处path为空，默认二级路由
      component: () => import('@/views/employees'),
      // 路由元信息，存放路由跳转携带的参数
      meta: {
        title: '员工', // sideBar标题
        icon: 'people'// sideBar左边图标
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true, // 隐藏在左侧菜单中
      meta: {
        title: '员工详情'
      }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
