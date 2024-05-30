import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getTokenTimestamp } from '@/utils/auth'
//import { reject } from 'core-js/fn/promise'
import router from '@/router'

const tokenTimeOut = 3600

// 创建axios实例对象
const service = axios.create({
  //配置文件中取VUE_APP_BASE_API
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // token失效，退出登录，跳转登录页
      if(isTokenOut()){
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token失效了'))
      }
      // 有token,注入token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 判断token是否超时
function isTokenOut(){
  return (Date.now() - getTokenTimestamp())/1000 > tokenTimeOut
}

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 解构响应返回的数据
    const { success,data,message } = response.data
    if(success){
      return data
    }else{
      // toast提示错误信息
      Message.error(message)
      //返回异常回调
      return Promise.reject(new Error(message))
    }
  },
  error => {
    //token失效，退出登录，跳转登录页
    if (error.response && error.response.data && error.response.data.code === 10002) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service
