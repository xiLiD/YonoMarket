import $ from './request.js'

const REQUESTURL = getApp().globalData.REQUESTURL
const myRequest = (data, url, type = 'post', isUrl = false) => {
  !isUrl && (url = `${REQUESTURL}${url}`)
  return new Promise((resolve, reject) => {
    $[`${type}P`](url, data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

//获取openid
const getOpenid = (data, url = '/wx/wxLogin') => { return myRequest(data, url) }
//上传头像昵称
const uploadUserInfo = (data, url = '/wx/getUserInfo') => { return myRequest(data, url) }
//手机号解密
const getPhoneNumber = (data, url = '/api/Oauth/decryptedPhone') => { return myRequest(data, url) }
//用户登录接口
module.exports = {
  myRequest,
  getOpenid,
  uploadUserInfo,
  getPhoneNumber
}