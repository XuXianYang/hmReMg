import request from '@/utils/request'

// 获取公司角色信息
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

// 获取公司信息
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`,
    method: 'GET'
  })
}

// 根据id获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

// 编辑角色
export function editRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

// 根据id删除角色
export function delRoles(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
