// pages/my/coupons/coupons.js
const app = getApp();
import login from '../../../utils/publics/login.js'
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
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      if (options) {
        let page = '',
          type = '',
          typeVal = '',
          list = '';
        switch (options.type) {
          case 1:
            page = _this.data.record.progress.page;
            type = 'record.progress.type';
            list = 'record.progress.list';
            typeVal = 1;
            break;
          case 2:
            page = _this.data.record.finish.page;
            type = 'record.finish.type';
            list = 'record.finish.list';
            typeVal = 2;
            break;
          case 3:
            page = _this.data.record.lose.page;
            type = 'record.lose.type';
            typeVal = 3
            list = 'record.lose.list';
            break;
        }
      } else {
        page = _this.data.record.all.page;
        type = _this.data.record.all.type;
      }
      _this.getData(1);
      _this.getData(2);
      _this.getData(3);
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
    let _this = this;
    let page = '',
      type = '',
      list = '',
      newPage = '',
      typeVal = '',
      status = _this.data.dj ? parseInt(_this.data.dj) : _this.data.dj;
    switch (status) {
      case 1:
        page = _this.data.record.progress.page;
        typeVal = _this.data.record.progress.type;
        type = 'record.progress.type';
        list = 'record.progress.list';
        newPage = 'record.progress.page';
        break;
      case 2:
        page = _this.data.record.finish.page;
        typeVal = _this.data.record.finish.type;
        type = 'record.finish.type';
        list = 'record.finish.list';
        newPage = 'record.finish.page';
        break;
      case 3:
        page = _this.data.record.lose.page;
        typeVal = _this.data.record.lose.type;
        type = 'record.lose.type';
        list = 'record.lose.list';
        newPage = 'record.lose.page';
        break;
    }
    console.log(typeVal)
    if (typeVal == 1) {
      _this.setData({ [newPage]: page + 1 })
      _this.getData(status)
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
    var _this = this;
    let page = '',
      type = '',
      list = '',
      newList = '';
    switch (typeVal) {
      case 1:
        page = _this.data.record.progress.page;
        newList = _this.data.record.progress.list;
        type = 'record.progress.type';
        list = 'record.progress.list';
        break;
      case 2:
        page = _this.data.record.finish.page;
        newList = _this.data.record.finish.list;
        type = 'record.finish.type';
        list = 'record.finish.list';
        break;
      case 3:
        page = _this.data.record.lose.page;
        newList = _this.data.record.lose.list;
        type = 'record.lose.type';
        list = 'record.lose.list';
        break;
    }
    console.log(typeVal)
    // switch(typeVal){
    //   case '' : 
    //     page = `record.all.page`;  //控制底部提示显示
    //     list = 'record.all.list';  //控制底部提示显示  
    //     type = 'record.all.type';  //控制底部提示显示
    //   case 1 :
    //     page = `record.all.page`;  //控制底部提示显示
    //     list = 'record.all.list';  //控制底部提示显示  
    //     type = 'record.all.type';  //控制底部提示显示
    // }
    // let type = `list.type`
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Coupons,
      data: {
        token: wx.getStorageSync('token'),
        page: page,
        limit: 10,
        status: typeVal
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {

        if (res.data.code == '0000') {
          let result = [];
          let listVal = 0;
          if (res.data.data) {
            res.data.data.records.forEach((item)=>{
              item.coupon.couponEndDate = item.coupon.couponEndDate ? item.coupon.couponEndDate.split(' ')[0] : item.coupon.couponEndDate;
            })
            let shopList = res.data.data.records ? res.data.data.records : []

            if (page == 1) {
              if (res.data.data.records.length == 0) {
                listVal = 0
              } else if (res.data.data.records.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              _this.setData({
                [list]: shopList
              });
            } else {
              if (res.data.data.records.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              let newshopList = newList;
              console.log(res.data.data)
              if (res.data.data.records.length > 0) {
                res.data.data.records.forEach((item) => {
                  newshopList.push(item)
                })

                _this.setData({
                  [list]: newshopList
                });
              }
            }
          }
          console.log(listVal)
          _this.setData({
            [type]: listVal
          })
        }
      },
    })
  }
})