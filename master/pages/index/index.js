var app = getApp();
import login from '../../utils/api/login.js'
import mta from '../../utils/mta_analysis.js'
import tool from '../../utils/publics/tool.js';
import ajax from '../../utils/api/my-requests.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //全局变量--分类
    classId: '',
    lunImg: [], //轮播图数据
    oneList: [], ////tab栏分类 一级分类数据
    th_List: [],
    indicatorDots: true, //小点
    indicatorColor: 'rgba(255,255,255,0.5)', //指示点颜色
    activeColor: "coral", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 1000, //滑动时间
    current: 0,
    imgheights: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    mta.Page.init();
    let _this = this;
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      tool.loading();
      Promise.all([_this.getOnelist(), _this.getLunbimg(), _this.getArea(), _this.findTeam()]).then((res)=>{
        tool.loading_h();
        if (options.openId) {
          tool.loading();
          setTimeout(function () {
            tool.loading_h()
            tool.jump_nav('/pages/details/details?goodid=' + options.goodid + '&openId=' + options.openId);
          }, 1000)
        }
        this.setData({ key: true })
      })
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
    this.setData({ autoplay: true });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({ autoplay: false });
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
  bindchange(e) {
    this.setData({ current: e.detail.current });
  },
  imgload: function(e) {
    var imgheight = e.detail.height;
    var imgwidth = e.detail.width;
    var bl = imgheight / imgwidth;
    var sjgd = bl * (wx.getSystemInfoSync().windowWidth);
    var hs = this.data.imgheights;
    hs[e.target.dataset.id] = sjgd;
    this.setData({ imgheights: hs });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  linkNav(e){
    // if(!this.checkCard()){
    //   tool.alert('您尚未注册！,请先注册');
    //   setTimeout(()=>{
    //     tool.jump_nav('/pages/my/vip/vip');
    //   },500)
    //   return;
    // }
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /**点击分类 跳转至分类页面 */
  goTofenlei: function(e) {
    getApp().globalData.classId = e.currentTarget.dataset.id;
    tool.jump_swi('/pages/classification/classification?classid=' + e.currentTarget.dataset.id); //switchTab跳转无法传参
  },
  /**点击按钮 切换下一张图片 */
  goTonext: function(e) {
    let team = `teamList[${e.currentTarget.dataset.index}].scrollLeft`
    this.setData({
      [team]: this.data.teamList[e.currentTarget.dataset.index].scrollLeft + 69
    })
  },
  /**判断是否最后一张 */
  lower: function(e) {
    if (e.detail.direction == "right") {
      tool.alert('已经是最后一张了!')
    }
  },
  /**特卖专区 接口 */
  getArea: function() {
    var _this = this;
    ajax.divisionSearch({
      page: 1,
      name: ''
    }).then((res) => {
      if (res.data.data) {
        let data = res.data.data
        _this.setData({ th_List: data })
        _this.data.th_List.forEach((item) => {
          _this.getClasslist(item.id)
        })
      }
    })
  },
  /** 获取专区商品*/
  getClasslist: function(division_id) {
    var _this = this;
    ajax.findComeList({
      id: division_id,
      page: 1,
      limit: 4
    }).then((res) => {
      let data = _this.data.th_List
      data.forEach((item) => {
        if (item.id == division_id) {
          item.result = res.data.data
        }
      })
      _this.setData({ th_List: data })
    })
  },
  /**请求轮播图 接口 */
  getLunbimg: function() {
    var that = this;
    ajax.findBanner({}).then((res) => {
      that.setData({
        lunImg: res.data.data.records
      })
    })
  },
  /**请求一级分类 接口 */
  getOnelist: function() {
    var that = this;
    ajax.oneList({}).then((res) => {
      that.setData({
        oneList: res.data.data
      })
    })
  },
  // 查询团队列表
  findTeam() {
    var that = this;    
    ajax.teamList({
      page: 1,
      limit: 2
    }).then((res) => {
      res.data.data.forEach((item) => {
        item.scrollLeft = 0
      })
      that.setData({
        teamList: res.data.data
      })
      res.data.data.forEach((item) => {
        that.findTeamGoods(item.id)
      })
    })
  },
  // 查询团队列表的热门商品
  findTeamGoods(id) {
    var that = this;
    ajax.teamGoods({
      id: id
    }).then((res) => {
      let goods_list = res.data.data ? res.data.data : [];
      let goods = '';
      that.data.teamList.forEach((item, index) => {
        if (item.id == id) {
          goods = `teamList[${index}].goods_list`
        }
      })
      that.setData({ [goods]: goods_list })
    })
  },
  // 判断是否是会员 执行在手机号授权之前
  checkCard() {
    setTimeout(() => {
      ajax.memberCard({
        token: wx.getStorageSync('token')
      }).then((res) => {
        if (res.data.code != '0000') return false;
        if (res.data.data) {
          let vip = res.data.data ? res.data.data.memberCard : '';
          return vip == '';  // 如果是会员 返回false 如果不是会员返回true;
        }
      })
    }, 500)
  }
})