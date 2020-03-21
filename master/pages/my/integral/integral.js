// pages/my/integral/integral.js
const app = getApp();
import tool from '../../../utils/publics/tool.js';
import ajax from '../../../utils/api/my-requests.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_score : false,
    rewards : false,
    info : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      _this.getRewards();
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
  /**点击立即兑换 按钮 */
  goTotank:function(){
    let _this = this;
    _this.setData({ rewards : true})
  },
  changeRewards(e){
    console.log(e)
    let number = e.currentTarget.dataset.num;
    let show = number == 1 ? true : false;
    let info = {id : e.currentTarget.dataset.id , name : e.currentTarget.dataset.name}
    this.setData({ rewards : show , info : info})
  },
  rewardGift(){
    let _this = this;
    tool.loading();
    ajax.couponConversion({
      token: wx.getStorageSync('token'),
      couponId: _this.data.info.id,
      name: _this.data.info.name
    }).then((res)=>{
      let code = res.data.code;
      setTimeout(() => {
        tool.loading_h();
        _this.setData({ rewards: false })
        if (code == '0000') {
          tool.alert('兑换成功!');
          return;
        }
        _this.setData({ no_score: true })
        _this.setData({ rewards: false, msg: res.data.msg });
      }, 500)

      // if (res.data.code == "0000") {
      //   setTimeout(() => {
      //     tool.loading_h();
      //     _this.setData({ rewards: false })
      //     tool.alert('兑换成功!');
      //   }, 500)
      // } else {
      //   setTimeout(() => {
      //     tool.loading_h();
      //     _this.setData({ no_score: true })
      //     _this.setData({ rewards: false, msg: res.data.msg });
      //   }, 500)
      // }
    })
  },
  changeScore(e){
    let _this = this;
    let number = e.currentTarget.dataset.num;
    let show = number == 1 ? true : false;
    _this.setData({no_score : show})
  },
  // 获取积分
  getRewards() {
    let _this = this;
    ajax.rewardList().then((res)=>{
      let list = res.data.data ? res.data.data : [];
      if (list) {
        list.forEach((item) => {
          item.couponEndDate = item.couponEndDate.split(' ')[0]
        })
      }
      _this.setData({
        list: list
      })
    })
  }
})