import request from '@/utils/request'

// 获取全部部门信息
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET',
  })
}

// 删除部门
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete',
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data,
  })
}

// 获取部门详情
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET',
  })
}

// 编辑部门
export function editDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}