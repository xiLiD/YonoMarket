// pages/foundDetails/foundDetails.js
const app = getApp();
import WxParse from '../../components/wxParse/wxParse.js'
import tool from '../../utils/publics/tool.js';
import ajax from '../../utils/api/my-requests.js';
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
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var _this = this;
      //富文本图片自适应
      console.log(options)
      new Promise((resolve,reject)=>{
        _this.setData({ detailsid: options.detailsid });
        resolve();
      }).then((res)=>{
        _this.findDetails();
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
    let shoucang = _this.data.shoucang;
    val = shoucang == 0 ? 1 : (shoucang == 1 ? 0 : 1);
    _this.setData({ shoucang : val });
    new Promise((resolve,reject)=>{
      ajax.addCollect({
        id: _this.data.detailsid,
        token: wx.getStorageSync('token'),
        type: 2
      }).then((res)=>{
        _this.findDetails();
      })
    })
  },
  findDetails(){
    var _this = this;
    new Promise((resolve,reject)=>{
      ajax.cultureDetails({
        id: _this.data.detailsid,
        token: wx.getStorageSync('token')
      }).then((res)=>{
        let publishTime = res.data.data.publishTime.split(' ')[0]
        res.data.data.publishTime = publishTime;
        let article = res.data.data.content.replace(/&nbsp;/g, '')
        console.log("原html富文本内容", article)
        WxParse.wxParse('article', 'html', article, _this, 5)
        _this.setData({ details: res.data.data })
        _this.setData({ shoucang: res.data.data.isCollect })
      })
    })
  } 
})