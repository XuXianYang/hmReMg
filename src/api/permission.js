import request from '@/utils/request'

// 获取所有权限点
export function getPermissionList() {
  return request({
    url: '/sys/permission',
    method: 'GET'
  })
}

// 添加权限点
export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'POST',
    data
  })
}

// 根据ID获取权限点详情
export function getPermissionById(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'GET'
  })
}

// 根据ID更新权限点详情
export function updatePermissionById(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'PUT',
    data
  })
}

// 根据id删除权限点
export function delPermissionById(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'DELETE'
  })
}
