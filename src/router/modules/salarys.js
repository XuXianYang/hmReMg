import layout from '@/layout'

// 一级路由：薪资
export default {
  path: '/salarys',
  name: 'salarys',
  // 每个子模块都要有layout作为外层组件，因此以及路由组件都是layout，二级路由默认是该子模块
  component: layout,
  children: [
    {
      name: 'salarys',
      path: '', // 此处path为空，默认二级路由
      component: () => import('@/views/salarys'),
      // 路由元信息，存放路由跳转携带的参数
      meta: {
        title: '薪资', // sideBar标题
        icon: 'money'// sideBar左边图标
      }
    },
    {
      path: 'setting',
      component: () => import('@/views/salarys/setting'),
      name: 'salarysSetting',
      hidden: true,
      meta: {
        title: '设置'
      }
    },
    {
      path: 'details/:yearMonth/:id',
      component: () => import('@/views/salarys/detail'),
      name: 'salarysDetails',
      hidden: true,
      meta: {
        title: '详情'
      }
    },
    {
      path: 'historicalArchiving',
      component: () => import('@/views/salarys/historical'),
      name: 'salarysHistorical',
      hidden: true,
      meta: {
        title: '历史归档'
      }
    },
    {
      path: 'monthStatement',
      component: () => import('@/views/salarys/month'),
      name: 'salarysMonthStatement',
      hidden: true,
      meta: {
        title: '月报表'
      }
    }
  ]
}
