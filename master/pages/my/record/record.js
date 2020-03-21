// pages/my/record/record.js
const app = getApp();
import ajax from '../../../utils/api/my-requests.js'
import tool from '../../../utils/publics/tool.js'
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
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      tool.loading();
    Promise.all([_this.getData(''), _this.getData(1), _this.getData(2), _this.getData(4), _this.getData(5)]).then((res)=>{
      tool.loading_h();
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
        // let status = _this.data.status;
    let dj = _this.data.status ? parseInt(_this.data.status) : _this.data.status;
    page = dj == '' ? _this.data.record.all.page : (dj == 1 ? _this.data.record.progress.page : (dj == 2 ? _this.data.record.finish.page : (dj == 4 ? _this.data.record.lose.page : _this.data.record.cancle.page)
    ))
    typeVal = dj == '' ? _this.data.record.all.type : (dj == 1 ? _this.data.record.progress.type : (dj == 2 ? _this.data.record.finish.type : (dj == 4 ? _this.data.record.lose.type : _this.data.record.cancle.type)
    ))
    type = dj == '' ? 'record.all.type' : (dj == 1 ? 'record.progress.type' : (dj == 2 ? 'record.finish.type' : (dj == 4 ? 'record.lose.type' : 'record.cancle.type')
    ))
    list = dj == '' ? 'record.all.list' : (dj == 1 ? 'record.progress.list' : (dj == 2 ? 'record.finish.list' : (dj == 4 ? 'record.lose.list' : 'record.cancle.list')
    ))
    newPage = dj == '' ? 'record.all.page' : (dj == 1 ? 'record.progress.page' : (dj == 2 ? 'record.finish.page' : (dj == 4 ? 'record.lose.page' : 'record.cancle.page')
    ))    
    if (typeVal == 1){
      _this.setData({ [newPage]: page + 1 })
      _this.getData(dj)
    }
  },
  goTotab(e) {
    let _this = this;
    _this.setData({
      status: e.currentTarget.dataset.id
    })
  },
  toDetails(e) {
    let url = '/pages/bookorderDetails/bookorderDetails?id=' + e.currentTarget.dataset.id;
    tool.jump_red(url)
  },
  linkRed(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_red(url)
  },
  getData(typeVal) {
    var _this = this;
    let page = '',
      type = '',
      list = '',
      newList = '',
      res = '';
    typeVal = typeVal != '' ? new Number(typeVal) : typeVal;
    page = (typeVal == '' ? _this.data.record.all.page : (typeVal == 1 ? _this.data.record.progress.page : (typeVal == 2 ? _this.data.record.finish.page : (typeVal == 4 ? _this.data.record.lose.page : _this.data.record.cancle.page)))); //页码
    newList = (typeVal == '' ? _this.data.record.all.list : (typeVal == 1 ? _this.data.record.progress.list : (typeVal == 2 ? _this.data.record.finish.list : (typeVal == 4 ? _this.data.record.lose.list : _this.data.record.cancle.list)))); //数据
    type = (typeVal == '' ? 'record.all.type' : (typeVal == 1 ? 'record.progress.type' : (typeVal == 2 ? 'record.finish.type' : (typeVal == 4 ? 'record.lose.type' : 'record.cancle.type')))); //数据类型 0：无数据 1：数据加载中 2：无更多数据
    list = (typeVal == '' ? 'record.all.list' : (typeVal == 1 ? 'record.progress.list' : (typeVal == 2 ? 'record.finish.list' : (typeVal == 4 ? 'record.lose.list' : 'record.cancle.list')))); //数据集合
    console.log('typeVal,' + typeVal)
    ajax.memberList({
      token: wx.getStorageSync('token'),
      page: page,
      limit: 10,
      status: typeVal
    }).then((res) => {
      if (res.data.code == '0000') {
        let result = [];
        let listVal = 0;
        let shopList = res.data.data ? res.data.data : [];
        if (shopList) {
          let newshopList = newList;
          shopList.forEach((item) => { newshopList.push(item) })
          listVal = page == 1 ? (shopList.length == 0 ? 0 : (shopList.length == 10 ? 1 : 2)) : (listVal = shopList.length == 10 ? 1 : 2);
          let result = page == 1 ? shopList : newshopList;
          console.log(result)
          _this.setData({ [list]: result });
        }
        _this.setData({ [type]: listVal })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
})