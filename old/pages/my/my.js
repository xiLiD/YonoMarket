const app = getApp();
import login from '../../utils/publics/login.js'
import tool from '../../utils/publics/tool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '', //默认用户昵称为空
    userImg: '', //默认用户头像为空
    vip: '',
    showModal: {
      isShow: false,
      title: "授权登录",
      test: "为了更好的体验，请先授权登录",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#2EB3A4'
    },
    showAuthOption: {
      isShow: false,
      type: 2,
      title: "获取用户授权",
      test: "小程序将获取你的用户信息",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    showMobileOption: {
      isShow: false,
      type: 1,
      title: "获取手机号授权",
      test: "小程序将获取你的手机号",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   vip: this.data.vip
    // })
    // console.log(this.data.vip)
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      let that = this;
      if (wx.getStorageSync('userInfo')) {
        that.setData({
          nickName: wx.getStorageSync('userInfo').nickName,
          userImg: wx.getStorageSync('userInfo').avatarUrl
        })
        that.findMember();
      }
      that.setData({
        key: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    
    that.setData({
      nickName: wx.getStorageSync('userInfo').nickName,
      userImg: wx.getStorageSync('userInfo').avatarUrl
    })
    if (that.data.key) {
      that.findMember();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  operation(e) {
    let that = this;
    let _showModal = this.data.showModal
    _showModal.isShow = false
    this.setData({
      showModal: _showModal,
      user_id: wx.getStorageSync('w_user_id'),
      userAvatar: wx.getStorageSync('userAvatar'),
      nickname: wx.getStorageSync('nickname'),
    })
  },
  /**点击跳转至 我的订单页 */
  goToorder: function() {
    wx.navigateTo({
      url: '/pages/order/order?id='
    })
  },
  /**点击 待付款 按钮 */
  goTodfk: function() {
    wx.navigateTo({
      url: '/pages/order/order?id=' + 2
    })
  },
  /**点击 待发货 按钮 */
  goTodfh: function() {
    wx.navigateTo({
      url: '/pages/order/order?id=' + 3
    })
  },
  /**点击 待收货 按钮 */
  goTodsh: function() {
    wx.navigateTo({
      url: '/pages/order/order?id=' + 4
    })
  },
  /**点击 待评价 按钮 */
  goTodpj: function() {
    wx.navigateTo({
      url: '/pages/order/order?id=' + 5
    })
  },
  /**退货 | 售后 */
  goTosold() {
    wx.navigateTo({
      url: '/pages/sold/sold?id=' + 5
    })
  },
  /**点击跳转至 我的优惠券 */
  goToyhq: function() {
    // wx.showToast({
    //   title: '敬请期待！',
    //   icon: 'none',
    //   duration: 1000
    // })
    // return;
    wx.navigateTo({
      url: '/pages/my/coupons/coupons'
    })
  },
  /**点击跳转至 我的预约记录 */
  goTojl: function() {
    // wx.showToast({
    //   title: '敬请期待！',
    //   icon: 'none',
    //   duration: 1000
    // })
    // return;
    wx.navigateTo({
      url: '/pages/my/record/record'
    })
  },
  /**点击登录按钮 */
  getUserInfo: function(e) {
    console.log(e, '用户信息')
    var that = this;
    // wx.setStorageSync('userInfo', e.detail.userInfo);
    // app.wxLogin();
    if(!that.checkMember()){
      return;
    }
    // console.log(123)
    // that.onShow();
  },
  // 授权验证  用户、手机号、地理位置
  checkMember() {
    let _this = this;
    console.log(wx.getStorageSync('userInfo').nickName)
    if (!wx.getStorageSync('userInfo').nickName) {
      _this.showAuthModal();
      return false;
    }
    console.log(!wx.getStorageSync('mobile'))
    if (!wx.getStorageSync('mobile')) {
      _this.showMobileModal();
      return false;
    }
    return true;
  },
  // 获取用户授权
  authOperation(e) {
    let _this = this;
    tool.loading();
    if (e.detail.confirm) {
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          console.log(res)
          wx.setStorageSync('userInfo', res.userInfo);
          _this.onShow();
          setTimeout(() => {
            tool.loading_h();
          }, 500)
          _this.showAuthModal();
          setTimeout(() => {
            _this.showMobileModal();
          }, 500)
        }
      })
    } else {
      setTimeout(() => {
        tool.loading_h();
      }, 500)
      _this.showAuthModal()
      // setTimeout(() => {
      //   tool.loading_h()
      //   this.showAuthModal()
      // }, 600)
    }
  },
  // 获取手机号
  mobileOperation(e) {
    let _this = this;
    tool.loading();
    console.log(e.detail)
    if (e.detail.confirm) {
      // => 获取解码手机号的信息

      wx.request({
        url: app.globalData.requestHost + app.globalData.GetPhoneNumber,
        data: {
          token: wx.getStorageSync('token'),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code == '0000') {
            wx.setStorageSync('mobile', res.data.data)
            setTimeout(() => {
              tool.loading_h();
              _this.showMobileModal();
            }, 500)
          } else {
            setTimeout(() => {
              tool.loading_h();
              _this.showMobileModal();
              setTimeout(() => {
                tool.alert(res.data.msg)
              }, 500)
            }, 500)
          }
        }
      })
    } else {
      setTimeout(() => {
        tool.loading_h();
      }, 500)
      _this.showMobileModal()
      // setTimeout(() => {
      //   tool.loading_h()
      //   this.showAuthModal()
      // }, 600)
    }
  },
  //打开、关闭用户授权弹窗
  showAuthModal() {
    let _showAuthOption = this.data.showAuthOption
    _showAuthOption.isShow = !_showAuthOption.isShow
    this.setData({ showAuthOption: _showAuthOption })
  },
  // 打开、关闭手机授权弹窗
  showMobileModal() {
    let _showMobileOption = this.data.showMobileOption
    _showMobileOption.isShow = !_showMobileOption.isShow
    this.setData({ showMobileOption: _showMobileOption })
  },
  /**点击跳转至 我的收藏页面 */
  goTosc: function() {
    wx.navigateTo({
      url: '/pages/my/collection/collection'
    })
  },
  /**点击跳转至 我的地址页面 */
  goTomdz: function() {
    wx.navigateTo({
      url: '/pages/my/address/address'
    })
  },
  /**点击跳转至 积分明细页面 */
  goTojifen: function() {
    // wx.showToast({
    //   title: '敬请期待！',
    //   icon: 'none',
    //   duration: 1000
    // })
    // return;
    wx.navigateTo({
      url: '/pages/my/myjifen/myjifen'
    })
  },
  /**点击 绑定会员卡 按钮 */
  goTozcVip: function() {
    wx.navigateTo({
      url: '/pages/my/vip/vip'
    })
  },
  /**点击跳转至 VIP页面 */
  goToVIP: function() {
    if(!this.checkMember()){
      return;
    }
    wx.navigateTo({
      url: '/pages/my/myVip/myVip'
    })
  },
  /**点击 我的客服 按钮 */
  goTokefu: function() {
    wx.navigateTo({
      url: '/pages/my/kefu/kefu'
    })
  },
  /**点击 规则 按钮 */
  goToRule: function() {
    wx.navigateTo({
      url: '/pages/my/rule/rule'
    })
  },
  findMember() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Member_Card, //查询订单详情 接口
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.data) {
          // that.setData({
          //   member: res.data.data
          // })
          // if (res.data.data.memberCard) {
          //   wx.setStorageSync('vip', res.data.data.memberCard.cardGradeName)
          //   that.setData({
          //     vip: res.data.data.memberCard.cardGradeName,
          //     my_score: res.data.data.memberCard.cardIntegral ? res.data.data.memberCard.cardIntegral : 0
          //   })
          // }
          let vip = (res.data.data.memberCard ? (res.data.data.memberCard.cardGradeName ? res.data.data.memberCard.cardGradeName : '') : '')
          let my_score = (res.data.data.memberCard.cardIntegral ? (res.data.data.memberCard.cardIntegral ? res.data.data.memberCard.cardIntegral : 0) : 0)
          that.setData({
            vip: vip,
            vipInfo: res.data.data,
            my_score: my_score
          })
        }

      }
    })
  }
})