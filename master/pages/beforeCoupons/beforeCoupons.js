// pages/my/coupons/coupons.js
const app = getApp();
import ajax from '../../utils/api/my-requests.js';
import tool from '../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dj: 1, //默认选中1
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
  onLoad: function(options) {
    let _this = this;
    //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
    _this.setData({
      rels: options.rels,
      colorSizeId: options.colorSizeId ? options.colorSizeId : '',
      cartJSONStr: options.cartJSONStr ? options.cartJSONStr : ''
    })
    tool.loading();
    Promise.all([_this.getData(1), _this.getData(2), _this.getData(3)]).then((res) => {
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
  // 前往购买
  toDetails(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let url = _this.data.colorSizeId ? '/pages/qrdd/qrdd/?rels=' + _this.data.rels + ' & colorSizeId=' + _this.data.colorSizeId + '&couponId=' + id : '/pages/qrdd/qrdd/?rels=' + _this.data.rels + ' & cartJSONStr=' + JSON.parse_this.data.cartJSONStr + '&couponId=' + id;
    tool.jump_red(url);
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**点击顶部栏切换 */
  goTotab: function(e) {
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
    ajax.findCoupons({
      token: wx.getStorageSync('token'),
      page: page,
      limit: 10,
      status: typeVal
    }).then((res) => {
      if (res.data.code == '0000') {
        let result = [];
        let listVal = 0;
        if (res.data.data) {
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
    })
  }
})