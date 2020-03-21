// pages/my/record/record.js
const app = getApp();
import login from '../../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: {
      hasData: true,
      type: ''
    },
    recordList: [],
    status: '',
    record: {
      all: {
        list: [],
        page: 1,
        type: ''
      },
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
      },
      cancle: {
        list: [],
        page: 1,
        type: ''
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      if(options){
        let page = '',
            type = '',
            typeVal = '',
            list = '';
        switch(options.type){
          case '' :
            page = _this.data.record.all.page;
            type = 'record.all.type';
            list = 'record.all.list';
            typeVal = '';
            break;
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
          case 4:
            page = _this.data.record.lose.page;
            type = 'record.lose.type';
            typeVal = 4
            list = 'record.lose.list';
            break;
          case 5:
            page = _this.data.record.cancle.page;
            type = 'record.cancle.type';
            typeVal = 5
            list = 'record.cancle.list';
            break;
        }
      }else {
        page = _this.data.record.all.page;
        type = _this.data.record.all.type;
      }
      _this.getData('');
      _this.getData(1);
      _this.getData(2);
      _this.getData(4);
      _this.getData(5);
    })

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
    let _this = this;
    let page = '',
        type = '',
        list = '',
        newPage = '',
        typeVal  = '';
    switch (_this.data.status) {
      case '':
        page = _this.data.record.all.page;
        typeVal = _this.data.record.all.type;
        type = 'record.all.type';
        list = 'record.all.list';
        newPage = 'record.all.page';
        break;
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
      case 4:
        page = _this.data.record.lose.page;
        typeVal = _this.data.record.lose.type;
        type = 'record.lose.type';
        list = 'record.lose.list';
        newPage = 'record.lose.page';
        break;
      case 5:
        page = _this.data.record.cancle.page;
        typeVal = _this.data.record.cancle.type;
        type = 'record.cancle.type';
        list = 'record.cancle.list';
        newPage = 'record.cancle.page';
        break;
    }
    if (typeVal == 1){
      _this.setData({ [newPage]: page + 1 })
      _this.getData(_this.data.status)
    }
  },
  goTotab(e) {
    let _this = this;
    _this.setData({
      status: e.currentTarget.dataset.id
    })
  },
  toDetails(e) {
    wx.redirectTo({
      // url: '/pages/bookorderDetails/bookorderDetails?info=' + JSON.stringify(res.data.data) + '&details=' + _this.data.details + '&num=' + _this.data.num + '&img=' + _this.data.goodList.mainImgPath,
      url: '/pages/bookorderDetails/bookorderDetails?id=' + e.currentTarget.dataset.id
    })
  },
  getData(typeVal) {
    var _this = this;
    let page = '',
        type = '',
        list = '',
        newList = '';
    switch (typeVal) {
      case '':
        page = _this.data.record.all.page;
        newList = _this.data.record.all.list;
        type = 'record.all.type';
        list = 'record.all.list';
        break;
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
      case 4:
        page = _this.data.record.lose.page;
        newList = _this.data.record.lose.list;
        type = 'record.lose.type';
        list = 'record.lose.list';
        break;
      case 5:
        page = _this.data.record.cancle.page;
        newList = _this.data.record.cancle.list;
        type = 'record.cancle.type';
        list = 'record.cancle.list';
        break;
    }
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
      url: app.globalData.requestHost + app.globalData.Member_List,
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
      success: function(res) {

        if (res.data.code == '0000') {
          let result = [];
          let listVal = 0;
          if (res.data.data) {
            let shopList = res.data.data ? res.data.data : []

            if (page == 1) {
              if (res.data.data.length == 0) {
                listVal = 0
              } else if (res.data.data.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              _this.setData({
                [list]: shopList
              });
            } else {
              if (res.data.data.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              let newshopList = newList;
              console.log(res.data.data)
              if (res.data.data.length > 0) {
                res.data.data.forEach((item) => {
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
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
})