import request from '@/utils/request'

// 获取员工简单列表
export function getUserSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

// 获取员工列表
export function getUserList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

// 根据id删除员工
export function delUserById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 新增员工
export function addEmployees(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

// 导入员工
export function importEmployees(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

// 更新员工信息
export function updateEmployeesInfo(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

// 读取用户详情的基础信息
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

// 更新用户详情的基础信息
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

// 获取用户的岗位信息
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

// 保存岗位信息
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

// 给员工分配角色
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
