import request from '@/utils/request'

export function roleslist(data) {
  return request({
    url: '/expert/roleslist',
    // url: '/byd/web/index.php?r=reg/functionlist',
    method: 'post',
    // data: JSON.parse(data)
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function functionlist(data) {
  return request({
    url: '/expert/functionlist',
    method: 'post',
    data
  })
}

export function rolesadd(data) {
    return request({
      url: '/expert/rolesadd',
      method: 'post',
      data
    })
}

export function rolesbind(data) {
    return request({
      url: '/expert/rolesbind',
      method: 'post',
      data
    })
}
export function rolesedit(data) {
    return request({
      url: '/expert/rolesupd',
      method: 'post',
      data
    })
}

export function rolesdel(data) {
    return request({
      url: '/byd/web/index.php?r=reg/rolesdel',
      method: 'post',
      data
    })
}

  
  