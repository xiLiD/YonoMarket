// pages/my/collection/collection.js
const app = getApp();
import login from '../../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dj: 1,
    goods: {
      list: [],
      page: 1,
      type: ''
    },
    article: {
      list: [],
      page: 1,
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    login.login().then(res => {
      let _this = this;
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      _this.getCollect(1);
      _this.getArtical(1);
      _this.setData({key : true})
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
    let _this = this;
    if (_this.data.key){
        _this.getCollect(1);
        _this.getArtical(1);
      }
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
    let dj = _this.data.dj;
    let page = ''
    if(dj == 1){
      //商品
      page = `goods.page`
      if (_this.data.goods.type == 1) {
        _this.data.goods.page = _this.data.goods.page + 1;
        _this.setData({
          [page]: _this.data.goods.page
        });
        _this.getCollect(_this.data.goods.page)
      }
    }else {
      //文章
      page = `article.page`
      if (_this.data.article.type == 1){
        _this.data.article.page = _this.data.article.page + 1;
        _this.setData({
          [page]: _this.data.article.page
        });
        _this.getArtical(_this.data.article.page)
      }

    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**点击tab栏切换 */
  goTotab: function(e) {
    this.setData({
      dj: e.currentTarget.dataset.id
    })
  },
  goToArticlexq(e) {
    wx.navigateTo({
      url: '/pages/foundDetails/foundDetails?detailsid=' + e.currentTarget.dataset.id
    })
  },
  getCollect: function(page) {
    var _this = this;
    let list = `goods.list`
    let type = `goods.type`
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Collect,
      data: {
        token: wx.getStorageSync('token'),
        type: 1,
        page: page,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '轮播图')
        if (res.data.data) {

          //底部栏状态处理
          let listVal = 1;
          if (_this.data.article.page == 1) {
            if (res.data.data.length == 0) {
              listVal = 0
            } else if (res.data.data.length == 10) {
              listVal = 1
            } else {
              listVal = 2
            }
            _this.setData({
              [list]: res.data.data
            })
          } else {
            if (res.data.data.length == 10) {
              listVal = 1
            } else {
              listVal = 2
            }
            let newList = _this.data.article.list;
            if (res.data.data.length > 0) {
              res.data.data.forEach((item) => {
                newList.push(item)
              })

              _this.setData({
                [list]: newList
              });
            }
          }

          _this.setData({
            [type]: listVal
          })
        }

      }
    })
  },
  getArtical: function(page) {
    var _this = this;
    let list = `article.list`
    let type = `article.type`
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Collect,
      data: {
        token: wx.getStorageSync('token'),
        type: 2,
        page: page,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '轮播图')
        if (res.data.data) {


          //底部栏状态处理
          let listVal = 1;
          if (_this.data.article.page == 1) {
            if (res.data.data.length == 0) {
              listVal = 0
            } else if (res.data.data.length == 10) {
              listVal = 1
            } else {
              listVal = 2
            }
            _this.setData({
              [list]: res.data.data
            })
          } else {
            if (res.data.data.length == 10) {
              listVal = 1
            } else {
              listVal = 2
            }
            let newList = _this.data.article.list;
            if (res.data.data.length > 0) {
              res.data.data.forEach((item) => {
                newList.push(item)
              })

              _this.setData({
                [list]: newList
              });
            }
          }

          _this.setData({
            [type]: listVal
          })


        }

      }
    })
  },
  goTothxq: function(e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id
    })
  },

})