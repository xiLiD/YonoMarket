// pages/my/rule/rule.js
import tool from '../../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: [{
      num: 1,
      title: '会员卡说明规则'
    }, {
      num: 2,
      title: '积分兑换规则'
    }, {
      num: 3,
      title: '分销说明规则'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  // onShareAppMessage: function () {

  // },
  /**
   * 去往详情
   */
  goToRule(e) {
    console.log(e.currentTarget.dataset.num)
    let url = '/pages/my/ruledetails/ruledetails?rule=' + e.currentTarget.dataset.num + '&title=' + e.currentTarget.dataset.title;
    tool.jump_nav(url)
  },
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  }
})