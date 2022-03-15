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

export function expertimport(data) {
  return request({
    url: '/expert/expertimport',
    method: 'post',
    data
  })
}

export function expertbasicbind(data) {
  return request({
    url: '/expert/expertbasicbind',
    method: 'post',
    data
  })
}

export function expertbasicadd(data) {
  return request({
    url: '/expert/expertbasicadd',
    method: 'post',
    data
  })
}

export function expertbasicdel(data) {
  return request({
    url: '/expert/expertbasicdel',
    method: 'post',
    data
  })
}

export function expertbasicedit(data) {
  return request({
    url: '/expert/expertbasicedit',
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



  export function userdel(data) {
    return request({
      url: '/byd/web/index.php?r=reg/userdel',
      method: 'post',
      // data: JSON.parse(data)
      data: JSON.stringify(data)
    })
  }

  

  


  


