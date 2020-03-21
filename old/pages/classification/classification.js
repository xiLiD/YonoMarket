const app = getApp();
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1, //默认选中第一个
    oneList: [], //一级分类
    twoList:[],//二级分类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      this.getOnelist();
      this.getTwolist(1);

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
    var that = this;
    console.log(getApp().globalData.classId, '首页分类带过来的分类Id')
    
    that.setData({
      id: getApp().globalData.classId || 1
    })
    if (that.data.id==undefined){
      that.setData({
        id:1
      })
    }
    that.getTwolist(that.data.id);
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
  onShareAppMessage: function() {

  },
  /**点击左侧tab栏切换 */
  goTotab: function(e) {
    // console.log(e, '第几个')
    var that = this;
    app.globalData.classId = e.currentTarget.dataset.id;
    that.setData({
      id: e.currentTarget.dataset.id,
      activeId: e.currentTarget.dataset.id
    })
    that.getTwolist(that.data.id);
  },
  /**点击商品跳转至 商品详情页 */
  goToshangpin: function(e) {
    console.log(e,'传商品参数过去')
    wx.navigateTo({
      url: '/pages/class/class?good_id=' + e.currentTarget.dataset.id
    })
  },
  /**请求一级分类 接口 */
  getOnelist: function() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.One_List,
      data: {

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '一级分类')
        that.setData({
          oneList: res.data.data
        })
      }
    })
  },
  getTwolist: function(classid) {
    // console.log(classid,'参数')
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Two_list,
      data: {
        categoryId: classid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        // console.log(res, '二级分类')
        that.setData({
          twoList:res.data.data
        })
      }
    })
  },
  /*前往抢购 */
  toSeckill(){
    wx.navigateTo({
      url: '/pages/seckill/seckill'
    })
  }
})