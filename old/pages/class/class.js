const app = getApp();
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list : {
      hasData : true,
      type : ''
    },
    dj:1,//默认选中全部
    isHiden:false,//默认遮罩层隐藏
    isShow:false,//筛选内容勾选按钮默认隐藏
    isText:'',//搜索框内容默认是空
    inputValue:'',
    //筛选内容
    tkList:[
      {
        id:1,
        title:'这是筛选内容'
      },
      {
        id: 2,
        title: '这是筛选内容傻模拟'
      },
      {
        id: 3,
        title: '这是筛选内容是什么的'
      },
      {
        id: 4,
        title: '这是筛选内容大撒'
      },
      {
        id: 5,
        title: '这是筛选内容阿大撒大撒'
      },
    ],
    //商品展示列表
    goodList:[],//商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options,'带来的id')


    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var that = this;
      that.setData({
        goodid: options.good_id
      })
      this.getClasslist(1);
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
  /**点击tab栏切换按钮 */
  goToqh: function (e) {
    console.log(e, 'tab切换')
    var that = this;
    let dj = that.data.dj != 2 ? 2 : '';
    this.setData({
      dj: dj
    })
    let price = dj == 2 ? 1 : '';
    wx.request({
      url: app.globalData.requestHost + app.globalData.Class_List,
      data: {
        name: that.data.inputValue,
        price: price,
        page: 1,
        limit: 10,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '价格从低到高筛选商品列表')
        that.setData({
          goodList: res.data.data
        })
      }
    })
  },
  goTozx(e) {
    console.log(e, 'tab切换')
    var that = this;
    let dj = that.data.dj != 3 ? 3 : '';
    this.setData({
      dj: dj
    })
    let updateTime = dj == 3 ? 1 : '';
    wx.request({
      url: app.globalData.requestHost + app.globalData.Class_List,
      data: {
        name: that.data.inputValue,
        updateTime: updateTime,
        page: 1,
        limit: 10,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '价格从低到高筛选商品列表')
        that.setData({
          goodList: res.data.data
        })
      }
    })
  },
  /**点击选择 筛选内容 */
  xuanze:function(e){
    //选择的内容
    // console.log(e.currentTarget.dataset.title)
    this.setData({
      xz: e.currentTarget.dataset.id,
      isText: e.currentTarget.dataset.title,
      isHiden:false
    })
  },
  /**点击跳转至 详情页 */
  goToxq:function(e){
    console.log(e,'商品id')
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id
    })
  },
  /**请求全部分类商品 列表 */
  getClasslist:function(page){
    var that = this;
    let data = '';
    if(page){
      data = {
        categoryId: that.data.goodid,
        page: 1,
        limit: 10,
      }
    }else {
      data = {
        categoryId: that.data.goodid,
        page: '',
        limit: '',
      }
    }
    wx.request({
      url: app.globalData.requestHost + app.globalData.Class_List,
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res,'全部商品列表')
        that.setData({
          goodList:res.data.data
        })
      }
    })
  },
  /**获取搜索框里面 内容 */
  bindKeyInput: function (e) {
    console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**点击搜索框按钮 进行搜索内容 */
  getsousuo: function (page){
    // console.log(e,'搜索内容')
    var that = this;
    data.name = that.data.inputValue;
    data.page = page ? page : '';
    data.limit = page ? 10 : '';
    wx.request({
      url: app.globalData.requestHost + app.globalData.Class_List,
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '搜索框搜出来的列表')
        that.setData({
          goodList: res.data.data
        })
      }
    })
  },
  
})