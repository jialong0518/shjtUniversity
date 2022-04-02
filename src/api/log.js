import request from '@/utils/request'


export function getlogrecordlist(data) {
  return request({
    url: '/expert/logrecordlist',
    method: 'post',
    data
  })
}

export function getmsgrecordlist(data) {
    return request({
      url: '/expert/msgrecordlist',
      method: 'post',
      data
    })
}

export function getmailrecordlist(data) {
    return request({
      url: '/expert/mailrecordlist',
      method: 'post',
      data
    })
}


  


