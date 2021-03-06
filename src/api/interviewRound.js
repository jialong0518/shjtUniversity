import request from '@/utils/request'


export function sendemail(data) {
  return request({
    url: '/expert/sendemail',
    method: 'post',
    data
  })
}

export function expertstatus(data) {
  return request({
    url: '/expert/auditionroundstatus',
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
      url: '/expert/auditionroundlist',
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
    url: '/expert/auditionroundbind',
    method: 'post',
    data
  })
}

export function expertbasicadd(data) {
  return request({
    url: '/expert/auditionroundadd',
    method: 'post',
    data
  })
}

export function expertbasicdel(data) {
  return request({
    url: '/expert/auditionrounddel',
    method: 'post',
    data
  })
}

export function expertbasicedit(data) {
  return request({
    url: '/expert/auditionroundedit',
    method: 'post',
    data
  })
}

export function expertbasicexport(data) {
  return request({
    url: '/expert/expertbasicexport',
    method: 'post',
    data
  })
}

export function expertreadytomatch(data) {
  return request({
    url: '/expert/readytomatch',
    method: 'post',
    data
  })
}

export function expertauditionmatch(data) {
  return request({
    url: '/expert/auditionmatch',
    method: 'post',
    data
  })
}

export function exportFile(data) {
  return request({
    url: '/expert/auditionroundunconfirmexport',
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

  

  


  


