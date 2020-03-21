// pages/found/found.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js'); //解析富文本
import tool from '../../utils/publics/tool.js';
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgheights : [],
    current: 0,
    indicatorDots: true, //小点
    indicatorColor: 'rgba(255,255,255,0.5)',//指示点颜色
    activeColor: "coral",//当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 1000, //滑动时间
    id: 2, //默认显示2
    showPage: true,
    activeId: 0,
    list: [{
      name: '品牌介绍',
      page: 1,
      itemList: [],
      hasData: true,
      type: ''
    }, {
      name: '视频介绍',
      page: 1,
      itemList: [],
      hasData: true,
      type: ''
    }, {
      name: '潮流文化',
      page: 1,
      itemList: [],
      hasData: true,
      type: ''
    }],
    // list: ['品牌介绍', '视频介绍', '潮流文化'],
    page: [1, 1, 1],
    data: [true, true, true],
    brandList: [],
    vedioList: [],
    cultureList: [],
    // danmuList: [{
    //     text: '第 1s 出现的弹幕',
    //     color: '#ff0000',
    //     time: 1
    //   },
    //   {
    //     text: '第 3s 出现的弹幕',
    //     color: '#ff00ff',
    //     time: 3
    //   }
    // ]
    cast: {
      brand : {
        list: [{
          url: 'http://tb-mini-program.oss-cn-beijing.aliyuncs.com/yoplait/younuo/1573807216433.jpg'
        }, {
          url: 'http://tb-mini-program.oss-cn-beijing.aliyuncs.com/yoplait/younuo/1573807398590.jpg'
        }],  
      }, radio: {
        list: [{
          url: 'http://tb-mini-program.oss-cn-beijing.aliyuncs.com/yoplait/younuo/1573807216433.jpg'
        }, {
          url: 'http://tb-mini-program.oss-cn-beijing.aliyuncs.com/yoplait/younuo/1573807398590.jpg'
        }],
      }, culture: {
        list: [{
          url: 'http://tb-mini-program.oss-cn-beijing.aliyuncs.com/yoplait/younuo/1573806909106.jpeg'
        }, {
            url: 'http://tb-mini-program.oss-cn-beijing.aliyuncs.com/yoplait/younuo/1573807041693.jpg'
        }],
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var _this = this;
      //富文本图片自适应
      console.log(_this.data.list)
      _this.findCulture('品牌介绍', 1, _this.data.list[0].page)
      _this.findCulture('视频介绍', 2, _this.data.list[1].page)
      _this.findCulture('潮流文化', 3, _this.data.list[2].page)
      _this.getBanner();
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
    var prev_id = this.data.video_id;
    // 停止山一个视频播放
    if (prev_id) {
      wx.createVideoContext(prev_id).pause();
    }
    this.setData({ autoplay: false })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var prev_id = this.data.video_id;
    // 停止山一个视频播放
    if (prev_id){
      wx.createVideoContext(prev_id).pause();
    }

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
    let id = _this.data.id;
    if (_this.data.list[id - 1].type == 0) {
      let num = ++_this.data.list[id - 1].page;
      let up = `list[${id - 1}].page`
      _this.setData({
        [up]: num,
      })
      _this.addCulture(_this.data.list[id - 1].name, id, _this.data.list[id - 1].page);
    }
  },
  bindchange(e) {
    this.setData({ current: e.detail.current })
  },
  imgload: function (e) {

    console.log(wx.getSystemInfoSync().windowWidth)

    var imgheight = e.detail.height;

    var imgwidth = e.detail.width;

    var bl = imgheight / imgwidth;

    var sjgd = bl * (wx.getSystemInfoSync().windowWidth);

    var hs = this.data.imgheights;

    console.log(e);

    console.log(sjgd);

    hs[e.target.dataset.id] = sjgd;

    this.setData({ imgheights: hs });

  },
  getBanner(){
    let _this = this;
    let brand = 'cast.brand.list'
    wx.request({
      url: app.globalData.requestHost + app.globalData.Brand_Banner, //结算 回显 接口
      data: {

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // console.log(res.data, '结算成功 去提交订单页面');
        console.log(res.data.data)
        let result = res.data.data ? (res.data.data.records ? res.data.data.records : []) : [];
        _this.setData({[brand]:result})
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**点击tab栏切换 */
  goTotab: function(e) {
    // if (e.currentTarget.dataset.id == 1 || e.currentTarget.dataset.id == 3){
    //     wx.showToast({
    //       title: '敬请期待！',
    //       icon : 'none',
    //       duration : 1000
    //     })
    //     return;
    // }
    this.setData({
      id: e.currentTarget.dataset.id,
      activeId: e.currentTarget.dataset.id
    })
    console.log(e.currentTarget.dataset.id != 2)
    if (e.currentTarget.dataset.id != 2) {

      var prev_id = this.data.video_id;
      // 停止山一个视频播放
      if (prev_id){
        wx.createVideoContext(prev_id).pause();
      }
    }
  },
  getIndex() {

  },
  tofoundDetails(e) {
    let _this = this;
    wx.navigateTo({
      url: '/pages/foundDetails/foundDetails?detailsid=' + e.currentTarget.dataset.id
    })
  },
  videoPlay(e) {
    console.log(e);
    // 本视频id
    var id = e.currentTarget.id;
    // 上个一视频id
    if (this.data.video_id != id){
      if (this.data.video_id) {
        var prev_id = this.data.video_id;
        // 停止山一个视频播放
        wx.createVideoContext(prev_id).pause();
      }
      this.setData({
        video_id: id
      })
      // 延迟500ms，再播放本视频
      setTimeout(function () {
        wx.createVideoContext(id).play();
      }, 500)
    }

  },
  addCulture(name, num, page) {
    let _this = this;
    let culture = `list[${num - 1}].itemList`;
    let hasData = `list[${num - 1}].hasData`;
    let type = `list[${num - 1}].type`;
    console.log(_this.data.list[num - 1].itemList);
    _this.setData({
      [hasData]: false,
      [type]: 1
    });
    wx.request({
      url: app.globalData.requestHost + app.globalData.Culture_List, //结算 回显 接口
      data: {
        typeName: name,
        page: page,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data, '结算成功 去提交订单页面');
        setTimeout(() => {
          if (res.data.data.length > 0) {
            let result = _this.data.list;
            result.push(res.data.data);
            console.log('111111,' [type])
            _this.setData({
              [culture]: result
            })
            if (res.data.data.length < 10) {
              _this.setData({
                [hasData]: false,
                [type]: 2
              })
            }
          } else {
            console.log('22222222,', [type])
            _this.setData({
              [hasData]: false,
              [type]: 2
            })
          }
        }, 1000)
      },
    })
  },
  findCulture(name, num, page) {
    let _this = this;
    let culture = `list[${num - 1}].itemList`;
    let type = `list[${num - 1}].type`
    wx.request({
      url: app.globalData.requestHost + app.globalData.Culture_List, //结算 回显 接口
      data: {
        typeName: name,
        page: page,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '结算成功 去提交订单页面')
        if (res.data.data) {
          _this.setData({
            [culture]: res.data.data,
          })
          if (res.data.data.length < 10) {
            _this.setData({
              [type]: 2
            })
          }
        } else {
          _this.setData({
            [type]: 0
          })
        }

      },
    })
  }
})