import layout from '@/layout'

// 一级路由：权限管理
export default {
    path:'/permission',
    name:'permission',
    // 每个子模块都要有layout作为外层组件，因此以及路由组件都是layout，二级路由默认是该子模块
    component:layout,
    children:[
        {
            name:'permission',
            path:'',//此处path为空，默认二级路由
            component:()=> import('@/views/permission'),
            // 路由元信息，存放路由跳转携带的参数
            meta:{
                title:'权限管理',// sideBar标题
                icon:'lock',// sideBar左边图标
            }
        },
    ],
}