// pages/moreTeam/moreTeam.js
const app = getApp();
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isText: '',
    teamList: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    login.login().then(res => {
      let _this = this;
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      
      if(options) {
        _this.setData({
          name : options.name,
          details : options.details,
          img : options.img,
          id: options.id
        })
      }
      _this.getTeam();
      this.setData({ key : true})
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
    if(this.data.key){
      _this.getTeam();
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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  getTeam() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Team_Good,
      data: {
        id: that.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // console.log(res, '一级分类数据')
        let goods_list = res.data.data ? res.data.data : [];
        // let goods = '';
        // let result = [];
        // let data = [];
        // res.data.data.forEach((item,index)=>{
        //   if(index % 2 == 0 && index  != 0){
        //     data.push(index)
        //   }
        //   if (index == res.data.data.length - 1){
        //     data.push(res.data.data.length)   
        //   }
        // })
        // let newResult = []
        // for (let i=0; i < data.length; i++) {        
        //   let dataResult = [];
        //   console.log(data[i])
        //   res.data.data.forEach((item, index) => {
        //     if(i > 0){
        //       if (index <= data[i] - 1 && index > data[i-1] -1) {
        //         dataResult.push(item)
        //       }
        //     }else {
        //       if (index <= data[i] -1) {
        //         dataResult.push(item)
        //       }
        //     }

        //   })
        //   let team = {
        //     team : dataResult
        //   }
        //   newResult.push(team);
        // }  
        that.setData({
          teamList: goods_list
        })
      }
    })
  },
  goTothxq: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id
    })
  },
  toGoodsDetails(e){
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id,
    })
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  /**点击商品跳转至 商品详情页 */
  goToshangpin: function (e) {
    console.log(e, '传商品参数过去')
    let searchList = wx.getStorageSync('searchList') ? wx.getStorageSync('searchList') : [];
    if (e.currentTarget.dataset.name) {
      searchList.push(e.currentTarget.dataset.name);
    } else {
      if (this.data.inputValue) {
        searchList.push(this.data.inputValue);
      } else {
        wx.showToast({
          title: '搜索内容不能为空！',
          icon: 'none'
        })
        return;
      }

    }
    searchList.forEach((item, index) => {
      if (item == '' || item == null) {
        searchList.splice(index, 1)
      }
    })
    var res = [];
    for (var i = 0; i < searchList.length; i++) {
      if (!res.includes(searchList[i])) { // 如果res新数组包含当前循环item
        res.push(searchList[i]);
      }
    }
    wx.setStorageSync('searchList', res)
    this.setData({
      searchList: res
    })
    if (e.currentTarget.dataset.name) {
      wx.navigateTo({
        url: '/pages/mainClass/mainClass?name=' + e.currentTarget.dataset.name
      })
    } else {
      wx.navigateTo({
        url: '/pages/mainClass/mainClass?name=' + this.data.inputValue
      })
    }
  },
    /**点击搜索框按钮 进行搜索内容 */
  getsousuo: function (e) {
    console.log(e, '传商品参数过去')
    if (!this.data.inputValue) {
      wx.showToast({
        title: '搜索内容不能为空！',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/mainClass/mainClass?name=' + this.data.inputValue
    })
  },
  /**获取搜索框里面 内容 */
  bindKeyInput: function (e) {
    console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  },
})