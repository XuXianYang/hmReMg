import layout from '@/layout'

// 一级路由：审批
export default {
  path: '/approvals',
  name: 'approvals',
  // 每个子模块都要有layout作为外层组件，因此以及路由组件都是layout，二级路由默认是该子模块
  component: layout,
  children: [
    {
      name: 'approvals',
      path: '', // 此处path为空，默认二级路由
      component: () => import('@/views/approvals'),
      // 路由元信息，存放路由跳转携带的参数
      meta: {
        title: '审批', // sideBar标题
        icon: 'tree-table'// sideBar左边图标
      }
    },
    {
      path: 'salaryApproval/:id',
      component: () => import('@/views/approvals/salary'),
      name: 'salaryApproval',
      hidden: true,
      meta: {
        title: '工资审核',
        icon: 'approval', noCache: true
      }
    },
    {
      path: 'enterApproval/:id',
      component: () => import('@/views/approvals/enter'),
      name: 'enterApproval',
      hidden: true,
      meta: {
        title: '入职审核',
        icon: 'approval', noCache: true
      }
    },
    {
      path: 'leaveApproval/:id',
      component: () => import('@/views/approvals/leave'),
      name: 'leaveApproval',
      hidden: true,
      meta: {
        title: '申请请假',
        icon: 'approval', noCache: true
      }
    },
    {
      path: 'quitApproval/:id',
      component: () => import('@/views/approvals/quit'),
      name: 'quitApproval',
      hidden: true,
      meta: {
        title: '申请离职',
        icon: 'approval', noCache: true
      }
    },
    {
      path: 'overtimeApproval/:id',
      component: () => import('@/views/approvals/overtime'),
      name: 'overtimeApproval',
      hidden: true,
      meta: {
        title: '加班申请',
        icon: 'approval', noCache: true
      }
    },
    {
      path: 'securitySetting',
      component: () => import('@/views/approvals/security'),
      name: 'securitySetting',
      hidden: true,
      meta: {
        title: '设置',
        icon: 'approval', noCache: true
      }
    }
  ]
}
