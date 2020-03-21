// pages/foundDetails/foundDetails.js
const app = getApp();
import WxParse from '../../utils/wxParse/wxParse.js'
import tool from '../../utils/publics/tool.js';
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    shoucang : '',
    detailsid : '',
    details : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var that = this;
      //富文本图片自适应
      console.log(options)
      that.setData({
        detailsid: options.detailsid
        })
      that.findDetails();
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
  /**点击收藏 商品 按钮 */
  goTosc: function () {
    var _this = this;
    let val = '';
    if (_this.data.shoucang == 0) {
      val = 1
    } else if (_this.data.shoucang == 1) {
      val = 0
    } else {
      val = 1
    }
    _this.setData({
      shoucang : val
    })
    wx.request({
      url: app.globalData.requestHost + app.globalData.Add_Collect,
      data: {
        id: _this.data.detailsid,
        token: wx.getStorageSync('token'),
        type : 2
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // console.log(res, '收藏商品')
        _this.findDetails();
      },
      fail: function () {
        tool.loading_h();
        wx.showToast({
          title: '请求失败！',
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  findDetails(){
    var _this = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Culture_Details,
      data: {
        id: _this.data.detailsid,
        token : wx.getStorageSync('token')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        // let remark = res.data.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
        // remark = remark.replace(/\<p/gi, '<p class="rich-p" ');//正则给p标签增加class
        // res.data.data.content = remark;
        let publishTime = res.data.data.publishTime.split(' ')[0]
        res.data.data.publishTime = publishTime;

        let article = res.data.data.content.replace(/&nbsp;/g, '')
        console.log("原html富文本内容", article)
        WxParse.wxParse('article', 'html', article, _this, 5)

        _this.setData({ details: res.data.data})
        _this.setData({ shoucang: res.data.data.isCollect})
      }
    })
  } 
})