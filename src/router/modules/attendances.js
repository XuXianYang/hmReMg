import layout from '@/layout'

// 一级路由：考勤
export default {
    path:'/attendances',
    // 每个子模块都要有layout作为外层组件，因此以及路由组件都是layout，二级路由默认是该子模块
    component:layout,
    children:[
        {
            name:'attendances',
            path:'',//此处path为空，默认二级路由
            component:()=> import('@/views/attendances'),
            // 路由元信息，存放路由跳转携带的参数
            meta:{
                title:'考勤',// sideBar标题
                icon:'skill',// sideBar左边图标
            }
        },
    ],
}