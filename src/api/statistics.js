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
      url: '/expert/statslist',
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
    url: '/expert/auditionbind',
    method: 'post',
    data
  })
}

export function expertbasicadd(data) {
  return request({
    url: '/expert/auditionadd',
    method: 'post',
    data
  })
}

export function expertbasicdel(data) {
  return request({
    url: '/expert/auditiondel',
    method: 'post',
    data
  })
}

export function expertbasicedit(data) {
  return request({
    url: '/expert/auditionedit',
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

export function expertauditionlist(data) {
  return request({
    url: '/expert/auditionlist',
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

  

  


  


