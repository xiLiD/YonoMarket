const app = getApp();
import ajax from '../../../utils/api/my-requests.js';
import tool from '../../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipCard:{},//会员卡信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      ajax.memberCard({
        token : wx.getStorageSync('token')
      }).then((res)=>{
        console.log(res, '查看会员卡数据')
        that.setData({
          vipCard: res.data.data
        })
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

  // }
})