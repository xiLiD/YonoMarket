// pages/information/information.js
import login from '../../utils/publics/login.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradeid : '',
    wuliList : [],
    orderList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login.login().then(res => {
      console.log(options)
      this.setData({
        tradeid: options.tradeId
      })
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      this.getWuli(options.tradeId);
      this.getfindDetail(options.orderid)
    })
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
  getWuli: function (tradeNo){
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Wuli_Search,
      data: {
          token : wx.getStorageSync('token'),
          tradeNo: tradeNo
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // console.log(res, '一级分类数据')
        let wuliList = {}
        console.log(JSON.parse(res.data.data))
        if(res.data.data){
          wuliList.contents = JSON.parse(res.data.data).contents.reverse();
          wuliList.expNo = JSON.parse(res.data.data).expNo
          let count = 0;
          wuliList.contents.forEach((item)=>{
            let day = item.time.split(' ')[0]
            let time_details = item.time.split(' ')[1]
            item.day = day;
            item.time_details = time_details;
            count ++ ;
          })
          wuliList.count = count
          console.log(wuliList)
          that.setData({
            wuliList: wuliList
          })
        }

      }
    })
  },
  /**查询订单详情 接口 */
  getfindDetail: function (tradeId) {
    var that = this;
    console.log(tradeId, '是什么参数')
    wx.request({
      url: app.globalData.requestHost + app.globalData.Order_FindDetel, //查询订单详情 接口
      data: {
        token: wx.getStorageSync('token'),
        id: tradeId, //订单号
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
})