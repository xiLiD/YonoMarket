// pages/my/coupons/coupons.js
const app = getApp();
import ajax from '../../../utils/api/my-requests.js';
import tool from '../../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dj:1,//默认选中1
    page: 1,
    list: {
      hasData: true,
      type: ''
    },
    recordList: [],
    status: '',
    record: {
      progress: {
        list: [],
        page: 1,
        type: ''
      },
      finish: {
        list: [],
        page: 1,
        type: ''
      },
      lose: {
        list: [],
        page: 1,
        type: ''
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      tool.loading();
      Promise.all([_this.getData(1),_this.getData(2),_this.getData(3)]).then((res)=>{
        tool.loading_h();
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
    //代码优化 
    let _this = this;
    let page = '',
      type = '',
      list = '',
      newPage = '',
      typeVal = '';
    let dj = _this.data.dj ? parseInt(_this.data.dj) : _this.data.dj;
    page = dj == '' ? _this.data.record.all.page : (dj == 1 ? _this.data.record.progress.page : (dj == 2 ? _this.data.record.finish.page : (dj == 3 ? _this.data.record.lose.page : _this.data.record.cancle.page)));
    typeVal = dj == '' ? _this.data.record.all.type : (dj == 1 ? _this.data.record.progress.type : (dj == 2 ? _this.data.record.finish.type : (dj == 3 ? _this.data.record.lose.type : _this.data.record.cancle.type)));
    type = dj == '' ? 'record.all.type' : (dj == 1 ? 'record.progress.type' : (dj == 2 ? 'record.finish.type' : (dj == 3 ? 'record.lose.type' : 'record.cancle.type')));
    list = dj == '' ? 'record.all.list' : (dj == 1 ? 'record.progress.list' : (dj == 2 ? 'record.finish.list' : (dj == 3 ? 'record.lose.list' : 'record.cancle.list')));
    newPage = dj == '' ? 'record.all.page' : (dj == 1 ? 'record.progress.page' : (dj == 2 ? 'record.finish.page' : (dj == 3 ? 'record.lose.page' : 'record.cancle.page')
    ))
    if (typeVal == 1) {
      _this.setData({ [newPage]: page + 1 })
      _this.getData(dj)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**点击顶部栏切换 */
  goTotab:function(e){
    this.setData({
      dj: e.currentTarget.dataset.id
    })
  },
  // 获取优惠券
  getData(typeVal) {
    //代码优化
    var _this = this;
    let page = '',
      type = '',
      list = '',
      newList = '',
      res = '';
    typeVal = typeVal ? new Number(typeVal) : typeVal;
    page = typeVal == 1 ? _this.data.record.progress.page : (typeVal === 2 ? _this.data.record.finish.page : _this.data.record.lose.page); //页码
    newList = typeVal == 1 ? _this.data.record.progress.list : (typeVal === 2 ? _this.data.record.finish.list : _this.data.record.lose.list);//数据
    type = typeVal == 1 ? 'record.progress.type' : (typeVal == 2 ? 'record.finish.type' : 'record.lose.type');//数据类型 0：无数据 1：数据加载中 2：无更多数据
    list = typeVal == 1 ? 'record.progress.list' : (typeVal == 2 ? 'record.finish.list' : 'record.lose.list'); //数据集合
    //获取数据
    ajax.findCoupons({
      token: wx.getStorageSync('token'),
      page: page,
      limit: 10,
      status: typeVal
    }).then((res) => {
      if (res.data.code == '0000') {
        let result = [];
        let listVal = 0;
        let shopList = res.data.data.records ? res.data.data.records : [];
        if (shopList) {
          //提醒发货
          let remind = wx.getStorageSync('remind');
          shopList.forEach((remindItem) => {
            if (remind.length > 0) {
              let result = remind.some((item) => {
                return (remindItem.order_id == item);
              })
              remindItem.hasRemind = result;
            } else {
              remindItem.hasRemind = false;
            }
          })
          //数据整理
          let newshopList = newList;
          shopList.forEach((item) => { newshopList.push(item) })
          listVal = page == 1 ? (shopList.length == 0 ? 0 : (shopList.length == 10 ? 1 : 2)) : (listVal = shopList.length == 10 ? 1 : 2);
          let result = page == 1 ? shopList : newshopList;
          _this.setData({ [list]: result });
        }
        _this.setData({ [type]: listVal })
      }
    })
  }
})