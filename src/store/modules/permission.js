import { constantRoutes, asyncRoutes } from '@/router'

// 属性
const state = {
  routes: constantRoutes
}

// 同步方法
const mutations = {
  setRoutes(state, newRoutes) {
    // 每次更新,都应该在静态路由的基础上进行追加
    state.routes = { ...constantRoutes, ...newRoutes }
  }
}

// 异步方法
const actions = {
  // 筛选用户匹配的路由信息
  filterRoutes(context, menus) {
    const routes = []
    // menus.forEach(key => {
    //     const route = asyncRoutes.filter(item => item.name === key)
    //     routes.push(...route)
    // });
    routes.push(...asyncRoutes)
    // 通过commit调用同步方法赋值
    context.commit('setRoutes', routes)
    return routes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
