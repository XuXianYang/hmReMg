import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/404','/login'] // no redirect whitelist

//全局前置守卫:路由跳转前后处理函数
//参数1: 要跳转到的路由 (路由对象信息)    目标
//参数2: 从哪里跳转的路由 (路由对象信息)  来源
//参数3: 函数体 - next()才会让路由正常的跳转切换, next(false)在原地停留, next("强制修改到另一个路由路径上")
//注意: 如果不调用next, 页面留在原地
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  if(store.getters.token){
    // 有token,免登陆
    if(to.path === '/login'){
      next('/')
    }else{
      if(!store.getters.userId){
        await store.dispatch('user/getUserInfo')
        next(to.path)
      }else{
        next()
      }
    }
  }else{
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      //无token,不在白名单，跳转登录页
      next('/login')
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
