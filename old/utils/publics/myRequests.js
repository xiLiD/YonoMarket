import $ from './request.js'
const SERVICE = "https://dev.flyh5.cn/yoplait"
// const SERVICE = "https://dev.flyh5.cn/co-working/Api/wx"

const myRequest = (data, url, type = 'post') => {
  let _url = `${SERVICE}${url}`

  return new Promise((resolve, reject) => {
    $[`${type}P`](_url, data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

//获取openid

// const getOpenid = (data, url = '/beePlus/wxLogin') => { return myRequest(data, url) }

const getOpenid = (data, url = '/wx/wxLogin') => { return myRequest(data, url) }

//手机号解密
const getPhoneNumber = (data, url = '/getPhoneNumber') => { return myRequest(data, url) }
// 授权用户信息
const getUserInfo = (data, url = '/wx/getUserInfo') => { return myRequest(data, url) }


// const channelImg = (data, url = '/channel/channelImg') => { return myRequest(data, url) }


module.exports = {
  myRequest,
  getOpenid,
  getPhoneNumber,
  getUserInfo
}