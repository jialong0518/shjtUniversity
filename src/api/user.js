import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/expert/loginnormal',
    method: 'post',
    data: {
      expertNo: data.username,
      expertPwd: data.password,
      type: '后台'
    }
    // data
  })
}
export function goEmpower(data) {
  return request({
    url: `/expert/getlogininfo?code=${data.code}`,
    method: 'get',
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
      data
    })
  }
