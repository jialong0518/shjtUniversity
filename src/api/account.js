import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/expert/login',
    method: 'post',
    data
  })
}

export function userstartstop(data) {
  return request({
    url: '/expert/userstartstop',
    method: 'post',
    data
  })
}

export function getroleslist(data) {
  return request({
    url: '/expert/roleslist',
    method: 'post',
    data
  })
}

export function passwordreset(data) {
  return request({
    url: '/expert/passwordreset',
    method: 'post',
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

export function userlist(data) {
  return request({
    url: '/expert/userlist',
    method: 'post',
    data
  })
}

export function getCollege(data) {
  return request({
    url: '/expert/collegelist',
    method: 'post',
    data
  })
}

export function userAdd(data) {
  return request({
    url: '/expert/useradd',
    method: 'post',
    data
  })
}


  export function userdel(data) {
    return request({
      url: '/byd/web/index.php?r=reg/userdel',
      method: 'post',
      // data: JSON.parse(data)
      data
    })
  }

  export function useredit(data) {
    return request({
      url: '/byd/web/index.php?r=reg/useredit',
      method: 'post',
      data
    })
  }

  export function userbind(data) {
    return request({
      url: '/byd/web/index.php?r=reg/userbind',
      method: 'post',
      data
    })
  }


  


  


