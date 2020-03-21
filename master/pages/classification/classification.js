const app = getApp();
import tool from '../../utils/publics/tool.js';
import ajax from '../../utils/api/my-requests.js'
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
      let _this = this;
      tool.loading();
      Promise.all([_this.getOnelist(), _this.getTwolist(1)]).then((res) => {
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
    var that = this;
    console.log(getApp().globalData.classId, '首页分类带过来的分类Id')
    that.setData({
      id: getApp().globalData.classId || 1
    })
    if (that.data.id==undefined){
      that.setData({ id:1 });
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
  /**请求一级分类 接口 */
  getOnelist: function() {
    var that = this;
    new Promise((resolve,reject)=>{
      ajax.oneList().then((res) => {
        console.log(res, '一级分类')
        that.setData({
          oneList: res.data.data
        })
      })
      resolve();
    })
  },
  getTwolist: function(classid) {
    // console.log(classid,'参数')
    var that = this;
    new Promise((resolve, reject) => {
      ajax.twoList({
        categoryId: classid
      }).then((res) => {
        that.setData({
          twoList: res.data.data
        })
      })
      resolve();
    })
  },
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  }
})