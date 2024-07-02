import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      const userInfo = store.getters.userinfo
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
