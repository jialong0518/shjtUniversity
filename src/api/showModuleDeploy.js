import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
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
    url: '/byd/web/index.php?r=reg/userlist',
    method: 'post',
    data: JSON.stringify(data)
  })
}

export function userAdd(data) {
  return request({
    url: '/byd/web/index.php?r=reg/useradd',
    method: 'post',
    data
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

  export function userdel(data) {
    return request({
      url: '/byd/web/index.php?r=reg/userdel',
      method: 'post',
      // data: JSON.parse(data)
      data: JSON.stringify(data)
    })
  }

  export function useredit(data) {
    return request({
      url: '/byd/web/index.php?r=reg/useredit',
      method: 'post',
      data
    })
  }
  export function showModuleDeployList(url, data) {
    return request({
      url: url,
      method: 'post',
      data
    })
  }
  export function showModuleDeployList1(url, data) {
    return request({
      url: '/byd/web/index.php?r=reg/water_modulelist',
      method: 'post',
      data:{
        "title": "",
        "type": "",
        "uid": sessionStorage.getItem('uid')
      }
    })
  } 
  
  


