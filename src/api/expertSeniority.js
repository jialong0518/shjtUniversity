import request from '@/utils/request'



export function smsimport(data) {
  return request({
    url: '/expert/smsimport',
    method: 'post',
    data
  })
}


export function getYearlist(data) {
    return request({
      url: '/expert/yearlist',
      method: 'post',
      data
    })
  }

  export function getApplyBack(data) {
    return request({
      url: '/expert/expertreadyback',
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
      url: '/expert/expertreadylist',
      method: 'post',
      data
    })
}

export function expertimport(data) {
  return request({
    url: '/expert/expertimport',
    method: 'post',
    data
  })
}

export function expertbasicbind(data) {
  return request({
    url: '/expert/expertreadybind',
    method: 'post',
    data
  })
}

export function expertreadyapprove(data) {
  return request({
    url: '/expert/expertreadyapprove',
    method: 'post',
    data
  })
}

export function expertbasicadd(data) {
  return request({
    url: '/expert/expertreadyadd',
    method: 'post',
    data
  })
}

export function expertreadydel(data) {
  return request({
    url: '/expert/expertreadydel',
    method: 'post',
    data
  })
}

export function expertbasicedit(data) {
  return request({
    url: '/expert/expertreadyedit',
    method: 'post',
    data
  })
}

export function expertreadyexport(data) {
  return request({
    url: '/expert/expertreadyexport',
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

  

  


  


