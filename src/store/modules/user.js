import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTokenTimestamp } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userinfo: {}// 定义一个空的对象 不是null 因为后边要用到userInfo的属性
}

const mutations = {
  set_token(state, token) {
    state.token = token
    setToken(token)
  },
  remove_token(state) {
    state.token = null
    removeToken()
  },
  set_userinfo(state, userinfo) {
    // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
    state.userinfo = { ...userinfo }
  },

  remove_userinfo(state) {
    state.userinfo = {}
  }
}

const actions = {
  // 登录
  async login(context, data) {
    const res = await login(data)
    if (res) {
      // 通过commit调用set_token
      context.commit('set_token', res)
      setTokenTimestamp()
    }
  },
  // 获取用户信息
  async getUserInfo(context) {
    const res = await getUserInfo()
    const res2 = await getUserDetailById(res.userId)
    // 合并用户信息
    const result = { ...res, ...res2 }
    if (result) {
      context.commit('set_userinfo', result)
    }
    return result
  },
  // 退出登录，删除token,删除用户信息
  logout(context) {
    context.commit('remove_token')
    context.commit('remove_userinfo')
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

