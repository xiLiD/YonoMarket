// pages/my/tuikuan/tuikuan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {}, //商品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, '售后申请 带来的参数')
    this.setData({
      goods: options
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
  // onShareAppMessage: function() {

  // },
  /**点击跳转至 仅退款 页面 */
  goTojintuikuan: function(e) {
    console.log(e, '带过去的参数1')
    wx.redirectTo({
      url: '/pages/my/jintuikuan/jintuikuan?goodsimg=' + e.currentTarget.dataset.goodsimg + '&goodsmoney=' + e.currentTarget.dataset.goodsmoney + '&goodsname=' + e.currentTarget.dataset.goodsname + '&guigecolor=' + e.currentTarget.dataset.guigecolor + '&guigesize=' + e.currentTarget.dataset.guigesize + '&num=' + e.currentTarget.dataset.num + '&totalprice=' + e.currentTarget.dataset.totalprice + '&dingdan=' + e.currentTarget.dataset.dingdan + '&zidingdan=' + e.currentTarget.dataset.zidingdan + '&titlename=' + e.currentTarget.dataset.title
    })
  },

  /**点击退货退款 */
  goTothtk: function(e) {
    console.log(e, '带过去的参数2')
    wx.redirectTo({
      url: '/pages/my/jintuikuan/jintuikuan?goodsimg=' + e.currentTarget.dataset.goodsimg + '&goodsmoney=' + e.currentTarget.dataset.goodsmoney + '&goodsname=' + e.currentTarget.dataset.goodsname + '&guigecolor=' + e.currentTarget.dataset.guigecolor + '&guigesize=' + e.currentTarget.dataset.guigesize + '&num=' + e.currentTarget.dataset.num + '&totalprice=' + e.currentTarget.dataset.totalprice + '&dingdan=' + e.currentTarget.dataset.dingdan + '&zidingdan=' + e.currentTarget.dataset.zidingdan + '&titlename=' + e.currentTarget.dataset.title
    })
  },
  /**点击 换货按钮 跳转至 换货页面 */
  goTohuanhuo: function(e) {
    console.log(e, '带过去的参数3')
    wx.redirectTo({
      url: '/pages/my/jintuikuan/jintuikuan?goodsimg=' + e.currentTarget.dataset.goodsimg + '&goodsmoney=' + e.currentTarget.dataset.goodsmoney + '&goodsname=' + e.currentTarget.dataset.goodsname + '&guigecolor=' + e.currentTarget.dataset.guigecolor + '&guigesize=' + e.currentTarget.dataset.guigesize + '&num=' + e.currentTarget.dataset.num + '&totalprice=' + e.currentTarget.dataset.totalprice + '&dingdan=' + e.currentTarget.dataset.dingdan + '&zidingdan=' + e.currentTarget.dataset.zidingdan + '&titlename=' + e.currentTarget.dataset.title
    })


    // console.log(e, '带过去的参数123')
    // wx.navigateTo({
    //   url: '/pages/my/huanhuo/huanhuo?goodsimg=' + e.currentTarget.dataset.goodsimg + '&goodsmoney=' + e.currentTarget.dataset.goodsmoney + '&goodsname=' + e.currentTarget.dataset.goodsname + '&guigecolor=' + e.currentTarget.dataset.guigecolor + '&guigesize=' + e.currentTarget.dataset.guigesize + '&num=' + e.currentTarget.dataset.num + '&totalprice=' + e.currentTarget.dataset.totalprice + '&dingdan=' + e.currentTarget.dataset.dingdan + '&zidingdan=' + e.currentTarget.dataset.zidingdan
    // })
  }
})