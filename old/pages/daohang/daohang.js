// pages/daohang/daohang.js
const app = getApp();
import login from '../../utils/publics/login.js'
import tool from '../../utils/publics/tool.js'
import map from '../../utils/map/map.js'
import auth from '../../utils/publics/authorization.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    page: 1,
    list: {
      hasData: false,
      type: ''
    },
    showModalOption: {
      isShow: false,
      type: 0,
      title: "获取位置信息",
      test: "小程序将访问您的手机定位，自动定位到您当前所在城市信息。",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    isShowLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    login.login().then(res => {
      let _this = this;
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      _this.getPosition();
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
  getPosition() {
    let _this = this;
    // tool.loading("自动定位中")
    map.getPosition2().then(res => {
      console.log("定位详细信息", res)
      let _address_component = res.result.address_component
      console.log("经度---->", res.result.location.lng)
      console.log("纬度---->", res.result.location.lat)
      console.log("省---->", _address_component.province)
      console.log("市---->", _address_component.city)
      console.log("区---->", _address_component.district)
      _this.setData({
        longitude: res.result.location.lng,
        latitude: res.result.location.lat
      })
      _this.getShop(_this.data.page)
      _this.setData({ region: [_address_component.province, _address_component.city, _address_component.district] })

      // tool.loading_h()
      _this.setData({ showBook: true })

    }).catch(err => {
      console.log("定位失败", err)
      tool.alert("定位失败")
      tool.loading_h()
      _this.showHideModal()
    })
  },
  //点击自定义Modal弹框上的按钮
  operation(e) {
    if (e.detail.confirm) {
      auth.openSetting(res => {//用户自行从设置勾选授权后
        if (res.authSetting["scope.userLocation"]) {
          this.getPosition()
        }
      })
      this.showHideModal()
    } else {
      tool.loading("")
      this.showHideModal()
      setTimeout(() => {
        tool.loading_h()
        this.showHideModal()
      }, 600)
    }
  },
  //打开、关闭自定义Modal弹框
  showHideModal() {
    let _showModalOption = this.data.showModalOption
    _showModalOption.isShow = !_showModalOption.isShow
    this.setData({ showModalOption: _showModalOption })
  },
  onReachBottom: function() {
    let _this = this;
    if (_this.data.list.type == 1) {
      let page = _this.data.page + 1;
      _this.setData({
        page: page
      })
      _this.getShop(_this.data.page)
    }
  },
  getShop(page) {
    let _this = this;
    let list = `list.type`
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Shop,
      data: {
        longitude: _this.data.longitude,
        latitude: _this.data.latitude,
        page: page,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '一级分类')
        let shopList = res.data.data ? res.data.data : []
        res.data.data.forEach((item)=>{
          item.distance = item.distance / 1000 > 1 ? (Number.isInteger(item.distance / 1000) ? (item.distance / 1000) : (item.distance / 1000).toFixed(1)) + '公里' : (item.distance) + '米'
        })
        let listVal = 1;
        if (_this.data.page == 1) {
          if (res.data.data.length == 0) {
            listVal = 0
          } else if (res.data.data.length == 10) {
            listVal = 1
          } else {
            listVal = 2
          }
          _this.setData({
            shopList: shopList
          });
        } else {
          if (res.data.data.length == 10) {
            listVal = 1
          } else {
            listVal = 2
          }
          let newshopList = _this.data.shopList;
          console.log(res.data.data)
          if(res.data.data.length > 0){
            res.data.data.forEach((item)=>{
              newshopList.push(item)
            })
            
            _this.setData({
              shopList: newshopList
            });
          }
        }
        
        _this.setData({
          [list]: listVal
        })

      }
    })
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})