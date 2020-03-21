const app = getApp();
import ajax from '../../utils/api/my-requests.js'
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
    nickName : '',
    userImg : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      let that = this;
      if (wx.getStorageSync('userInfo')) {
        that.setData({
          nickName: wx.getStorageSync('userInfo').nickName,
          userImg: wx.getStorageSync('userInfo').avatarUrl
        })
        that.findMember();
      }
      that.setData({ key: true });
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
    let nickName = wx.getStorageSync('userInfo').nickName ? wx.getStorageSync('userInfo').nickName : '';
    let userImg = wx.getStorageSync('userInfo').avatarUrl ? wx.getStorageSync('userInfo').avatarUrl : '';
    that.setData({
      nickName: nickName,
      userImg: userImg
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
  /**点击跳转至 我的预约记录 */
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /**点击登录按钮 */
  getUserInfo: function(e) {
    var that = this;
    if(!that.checkMember()){
      return;
    }
  },
  // 判断是否是会员 执行在手机号授权之前
  checkCard() {
    setTimeout(() => {
      ajax.memberCard({
        token: wx.getStorageSync('token')
      }).then((res) => {
        if (res.data.code != '0000') return false;
        if (res.data.data) {
          let vip = res.data.data ? res.data.data.memberCard : '';
          return vip == '';  // 如果是会员 返回false 如果不是会员返回true;
        }
      })
    }, 500)
  },
  // 授权验证  用户、手机号、地理位置
  checkMember() {
    let _this = this;
    console.log(wx.getStorageSync('userInfo').nickName)
    if (!wx.getStorageSync('userInfo').nickName) {
      _this.showAuthModal();
      return false;
    }
    if (!wx.getStorageSync('mobile')) {
      _this.showMobileModal();
      return false;
    }
    if (this.checkCard()) {
      tool.alert('您还不是会员，请注册会员！');
      setTimeout(() => {
        tool.jump_nav('/pages/my/vip/vip');
      }, 1000)
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
    }
  },
  // 获取手机号
  mobileOperation(e) {
    let _this = this;
    tool.loading();
    console.log(e.detail)
    if (e.detail.confirm) {
      // => 获取解码手机号的信息
      ajax.getPhoneNumber({
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then((res)=>{
        let code = res.data.code;
        if(code == '0000'){
          wx.setStorageSync('mobile', res.data.data)
        }
        new Promise((resolve,reject)=>{
          setTimeout(() => {
            tool.loading_h();
            _this.showMobileModal();
            if (code != '0000'){
              setTimeout(() => {
                tool.alert(res.data.msg)
              }, 500)
            }
            resolve();
          }, 500)
        })
      })
    } else {
      setTimeout(() => {
        tool.loading_h();
      }, 500)
      _this.showMobileModal()
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
  /**点击跳转至 VIP页面 */
  goToVIP: function() {
    if(!this.checkMember()){
      return;
    }
    tool.jump_nav('/pages/my/myVip/myVip')
  },
  findMember() {
    var that = this;
    ajax.memberCard({
      token : wx.getStorageSync('token')
    }).then((res)=>{
      if (res.data.data) {
        let vip = (res.data.data.memberCard ? (res.data.data.memberCard.cardGradeName ? res.data.data.memberCard.cardGradeName : '') : '')
        let my_score = (res.data.data.memberCard.cardIntegral ? (res.data.data.memberCard.cardIntegral ? res.data.data.memberCard.cardIntegral : 0) : 0)
        that.setData({
          vip: vip,
          vipInfo: res.data.data,
          my_score: my_score
        })
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
})