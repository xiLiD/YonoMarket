//app.js
import auth from './utils/publics/authorization.js';

App({
  onLaunch: function(options) {
    // 展示本地存储能力
    let _this = this;
    var logs = wx.getStorageSync('logs') || [];
    //腾讯统计
    auth.statistics('500701970')
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })    
    let accountInfo = wx.getAccountInfoSync();
  },

  wxLogin: function() {
    // 登录
    var that = this;
    console.log('登录了吗123')
    console.log(that.globalData)
    wx.login({
      success: function(res) {
        console.log(res, '获取code')
        // that.globalData.code = res.code;
        wx.request({
          url: that.globalData.requestHost + that.globalData.LOGIN_URL, //请求登录接口 拿code换取 token
          data: {
            code: res.code
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success(res) {
            console.log(res, '用户id');
            if (res.data.success == true) {
              // 存token
              wx.setStorage({
                key: "token",
                data: res.data.data.token,
              });
              
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        that.globalData.userInfo = res.userInfo
                        wx.setStorageSync('userInfo', res.userInfo)
                        that.wxGetUserInfo();
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (that.userInfoReadyCallback) {
                          that.userInfoReadyCallback(res)
                        }
                      }
                    })
                  }
                }
              })
              // wx.switchTab({
              //   url: '../index/index',
              // })
            } else {
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          },
        })
      }
    })
  },
  wxGetUserInfo: function () { 
    /**获取用户信息授权 */
    var that = this;
    console.log(that.globalData)
    wx.request({
      url: that.globalData.requestHost + that.globalData.Get_Userinfo, //获取用户信息 换取 token
      data: {
        token: wx.getStorageSync('token'),       
        json: JSON.stringify(wx.getStorageSync('userInfo'))
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res,'重复返回token')
        // 存会员状态
        if (res.data.data==null){
          wx.setStorage({
            key: "vip",
            data: '',
          });
        }else{
          wx.setStorage({
            key: "vip",
            data: res.data.data,
          });       
        }
      }
    })
  },
  globalData: {
    // REQUESTURL: 'https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_quan/public/index.php',//接口请求路径
    REQUESTURL: 'https://dev.flyh5.cn/yoplait',
    ASSETSURL: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0',//线上资源路径
    DXL_IMAGE: 'https://game.flyh5.cn/resources/game/wechat/dxl/younuo'
  },  
  /**倒计时 模块*/
  timeToStr(time) {
    var m = 0,
      s = 0,
      _m = '00',
      _s = '00';
    time = Math.floor(time % 3600);
    m = Math.floor(time / 60);
    s = Math.floor(time % 60);
    _s = s < 10 ? '0' + s : s + '';
    _m = m < 10 ? '0' + m : m + '';
    return _m + ":" + _s;
  },
  findCard(){
    ajax.memberCard({
      token: wx.getStorageSync('token')
    }).then((res) => {
      if (res.data.data) {
        let vip = (res.data.data.memberCard ? (res.data.data.memberCard.cardGradeName ? res.data.data.memberCard.cardGradeName : '') : '')
        let my_score = (res.data.data.memberCard.cardIntegral ? (res.data.data.memberCard.cardIntegral ? res.data.data.memberCard.cardIntegral : 0) : 0)
        that.setData({
          vip: vip,
          vipInfo: res.data.data,
          my_score: my_score
        })
      }
    })
  }
  //检测手机类型是否是苹果X手机
  // checkIsIPhoneX: function() {
  //   const self = this
  //   wx.getSystemInfo({
  //     success: function(res) {
  //       console.log(res,'获取手机参数')
  //       // 根据 model 进行判断
  //       if (res.model.search('iPhone X') != -1) {
  //         self.globalData.isIPX = true
  //       }
  //       // 或者根据 screenHeight 进行判断
  //       // if (res.screenHeight == 812) {
  //       //   self.globalData.isIPX = true
  //       // }
  //     }
  //   })
  // },
})