const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: {},//订单详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, '传过来的类型');
    var that = this;
    // that.setData({
    //   tradeId: options.tradeId//订单id
    // })
    that.getfindDetail(options.tradeId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**查询订单详情 接口 */
  getfindDetail: function (tradeId) {
    console.log(tradeId)
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Order_FindDetel,//查询订单详情 接口
      data: {
        token: wx.getStorageSync('token'),
        id: tradeId,//订单号
        // id: 110,//订单号
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '订单详情数据')
        that.setData({
          orderList: res.data.data
        })
      }
    })
  },
  /**点击 联系客服按钮 拨打电话 */
  goTotel:function(){
    wx.showModal({
      title: '联系客服',
      content: '1340000134',
      success: function(res) {
        if (res.confirm){
          wx.makePhoneCall({
            phoneNumber: '1340000134' //仅为示例，并非真实的电话号码
          })
        }
      }
    })
    
  },
  /**点击 联系商家按钮 */
  goTophon:function(){
    wx.showModal({
      title: '联系商家',
      content: '1340000',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '1340000' //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  }
})