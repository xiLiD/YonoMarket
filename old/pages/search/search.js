// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchList: wx.getStorageSync('searchList')
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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**获取搜索框里面 内容 */
  bindKeyInput: function (e) {
    console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**点击商品跳转至 商品详情页 */
  goToshangpin: function (e) {
    console.log(e, '传商品参数过去')
    let searchList = wx.getStorageSync('searchList') ? wx.getStorageSync('searchList') : [];
    if (e.currentTarget.dataset.name) {
      searchList.push(e.currentTarget.dataset.name);
    } else {
      if(this.data.inputValue){
        searchList.push(this.data.inputValue);
      }else {
        wx.showToast({
          title: '搜索内容不能为空！',
          icon :'none'
        })
        return ;
      }
      
    }
    searchList.forEach((item,index)=>{
      if(item == '' || item == null){
        searchList.splice(index,1)
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
    if (e.currentTarget.dataset.name){
      wx.navigateTo({
        url: '/pages/mainClass/mainClass?name=' + e.currentTarget.dataset.name
      })
    }else {
      wx.navigateTo({
        url: '/pages/mainClass/mainClass?name=' + this.data.inputValue
      })
    }
  },
  clearList(){
    wx.setStorageSync('searchList', '');
    this.setData({
      searchList: []
    })
  }
})