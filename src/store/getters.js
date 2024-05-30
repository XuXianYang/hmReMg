const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userinfo.staffPhoto,
  name: state => state.user.userinfo.username,
  userinfo:state => state.user.userinfo,
  userId:state => state.user.userinfo.userId,
}
export default getters
