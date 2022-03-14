import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/expert/login',
    method: 'post',
    data
    // data: JSON.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function passwordreset(data) {
    return request({
      url: '/byd/web/index.php?r=reg/passwordreset',
      method: 'post',
      // data: JSON.parse(data)
      data: JSON.stringify(data)
    })
  }
