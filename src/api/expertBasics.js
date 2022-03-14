import request from '@/utils/request'


export function getCollege(data) {
  return request({
    url: '/expert/collegelist',
    method: 'post',
    data
  })
}

export function getSubject(data) {
  return request({
    url: '/expert/subjectlist',
    method: 'post',
    data
  })
}

export function getTitle(data) {
    return request({
      url: '/expert/competentlist',
      method: 'post',
      data
    })
}

export function getTable(data) {
    return request({
      url: '/expert/expertbasiclist',
      method: 'post',
      data
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

  export function userbind(data) {
    return request({
      url: '/byd/web/index.php?r=reg/userbind',
      method: 'post',
      data
    })
  }


  


  


