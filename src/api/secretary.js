import request from '@/utils/request'


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
      url: '/expert/expertsecretarylist',
      method: 'post',
      data
    })
}

export function expertimport(data) {
  return request({
    url: '/expert/expertsecretaryimport',
    method: 'post',
    data
  })
}

export function secretaryimport(data) {
  return request({
    url: '/expert/secretaryimport',
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
    url: '/expert/expertsecretarydel',
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
    url: '/expert/expertsecretaryexport',
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


 
  

  


  


