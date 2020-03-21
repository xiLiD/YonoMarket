// pages/updateAddress/updateAddress.js
const app = getApp()
import login from '../../utils/api/login.js';
import tool from '../../utils/publics/tool.js';
import ajax from '../../utils/api/my-requests.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressObj : {},
    addressid : 52,
    oldaddress : '',
    index : 0,
    tradeId : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      console.log(options)
      let status = options.status ? options.status : '';
      let tradeId = options.tradeId ? options.tradeId : '';
      let addressid = options.addressid ? options.addressid : '';
      if (options.status) {
        this.setData({
          tradeId: options.tradeId
        })
        this.getdataByid(options.addressid)
      }
      if (options.tradeId) {
        this.setData({
          tradeId: options.tradeId
        })
      }
      if (options.addressid) {
        this.setData({
          addressid: options.addressid
        })
        this.getdataByid(options.addressid)
      }
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
    // if(this.data.key){
    //   console.log(this.data)
    //   this.getdata();
    // }
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
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  getdataByid(id){
    var that = this;
    ajax.findAddress({
      token: wx.getStorageSync('token'),
      page: this.data.index,
      limit: 10
    }).then((res)=>{
      console.log(res, '地址列表')
      that.setData({
        addressList: res.data.data
      })
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];
      //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      res.data.data.forEach((item) => {
        if (id == item.id) {
          console.log(item)
          that.setData({
            addressObj: item
          })
        }
      })
    })
  },
  cancelUpdate(){
    tool.jump_red('/pages/order/order?id=' + 2)
  },
  updateAddress(){
    let that = this;
    if (this.data.addressid == this.data.oldaddress){
      tool.alert('两次的地址不能一致！')
      return;
    }
    ajax.orderAddress({
      token: wx.getStorageSync('token'),
      addressId: that.data.addressid,
      tradeNo: that.data.tradeId
    }).then((res)=>{
      if (res.data.success == true) {
        tool.alert('提交成功!');
        setTimeout(() => {
          tool.jump_red('/pages/order/order?id=' + 2)
        }, 500)
      }
    })
  }
})