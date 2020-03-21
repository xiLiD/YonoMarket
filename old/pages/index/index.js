var app = getApp();
import login from '../../utils/publics/login.js'
import mta from '../../utils/publics/mta_analysis.js'
import tool from '../../utils/publics/tool.js';
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
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      this.getOnelist();
      this.getLunbimg();
      this.getArea();
      this.findTeam();
      if (options.openId) {
        tool.loading();
        setTimeout(function() {
          tool.loading_h()
          wx.navigateTo({
            url: '/pages/details/details?goodid=' + options.goodid + '&openId=' + options.openId
          })
        }, 2000)
      }
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
    this.setData({
      autoplay: true
    })
    // if (!this.data.key) return;
    // this.getOnelist();
    // this.getLunbimg();
    // this.getArea();
    // this.findTeam();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      autoplay: false
    })
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
    this.setData({
      current: e.detail.current
    })
  },
  imgload: function(e) {

    console.log(wx.getSystemInfoSync().windowWidth)

    var imgheight = e.detail.height;

    var imgwidth = e.detail.width;

    var bl = imgheight / imgwidth;

    var sjgd = bl * (wx.getSystemInfoSync().windowWidth);

    var hs = this.data.imgheights;

    console.log(e);

    console.log(sjgd);

    hs[e.target.dataset.id] = sjgd;

    this.setData({
      imgheights: hs
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // show(e) {
  //   let index = e.currentTarget.dataset.index
  //   let oneList = this.data.oneList
  //   oneList[index].lazy = true
  //   console.log('图片加载完成')
  //   this.setData({
  //     oneList,
  //   })
  // },
  /**点击搜索框 跳转至搜索页面 */
  goTosousuo: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  toGoodsDetails(e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id,
    })
  },
  /**点击分类 跳转至分类页面 */
  goTofenlei: function(e) {
    // console.log(e, '分类id')
    getApp().globalData.classId = e.currentTarget.dataset.id;
    wx.switchTab({
      url: '/pages/classification/classification?classid=' + e.currentTarget.dataset.id //switchTab跳转无法传参
    })
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
      wx.showToast({
        title: '已经是最后一张',
        icon: 'none'
      })
    }
  },
  /**特卖专区 接口 */
  getArea: function() {
    var _this = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Division,
      data: {
        page: 1,
        name: ''
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.data) {
          let data = res.data.data

          _this.setData({
            th_List: data
          })

          _this.data.th_List.forEach((item) => {
            _this.getClasslist(item.id)
          })
        }
      }
    })
  },
  /** 获取专区商品*/
  getClasslist: function(division_id) {
    var _this = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_ComeList,
      data: {
        id: division_id,
        page: 1,
        limit: 4
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        // console.log(res, '全部商品列表')
        let data = _this.data.th_List
        data.forEach((item) => {
          if (item.id == division_id) {
            item.result = res.data.data
          }
        })
        _this.setData({
          th_List: data
        })
      }
    })

  },
  /**请求轮播图 接口 */
  getLunbimg: function() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Lub_Img,
      data: {

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        // console.log(res, '轮播图')
        if (res.data.data) {
          that.setData({
            lunImg: res.data.data.records
          })
        }
      }
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
        // console.log(res, '一级分类数据')
        that.setData({
          oneList: res.data.data
        })
      }
    })
  },
  /**点击轮播图 跳转至详情页 */
  goToxq: function(e) {
    // console.log(e,'商品id是这个')
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.lubimgid
    })
  },
  goTothxq: function(e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id
    })
  },
  /**点击定位按钮 进入店铺导航页面 */
  goTodpdh: function() {
    wx.navigateTo({
      url: '/pages/daohang/daohang'
    })
  },
  /**点击more 特惠优选 */
  goTothArea: function(e) {
    wx.navigateTo({
      url: '/pages/thArea/thArea?goodType=' + e.currentTarget.dataset.goodstype + '&divisionid=' + e.currentTarget.dataset.divisionid
    })
  },
  goToTeam() {
    // wx.showToast({
    //   title: '敬请期待！',
    //   icon: 'none',
    //   duration: 1000
    // })
    // return;

    wx.navigateTo({
      url: '/pages/teamMore/teamMore'
    })
  },
  findTeam() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Team_List,
      data: {
        page: 1,
        limit: 2
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        // console.log(res, '一级分类数据')
        res.data.data.forEach((item) => {
          item.scrollLeft = 0
        })
        that.setData({
          teamList: res.data.data
        })
        res.data.data.forEach((item) => {
          that.findTeamGoods(item.id)
        })
      }
    })
  },
  findTeamGoods(id) {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Team_Good,
      data: {
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        // console.log(res, '一级分类数据')
        let goods_list = res.data.data ? res.data.data : [];
        let goods = '';
        that.data.teamList.forEach((item, index) => {
          if (item.id == id) {
            goods = `teamList[${index}].goods_list`
          }
        })
        that.setData({
          [goods]: goods_list
        })
      }
    })
  },
  /**去往优秀团队详情 */
  toDetails(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id,
      details = e.currentTarget.dataset.details,
      name = e.currentTarget.dataset.name,
      img = e.currentTarget.dataset.img
    wx.navigateTo({
      url: '/pages/moreTeam/moreTeam?id=' + id + '&details=' + details + '&img=' + img + '&name=' + name
    })
  }
})