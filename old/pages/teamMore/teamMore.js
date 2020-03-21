// pages/teamMore/teamMore.js
const app = getApp();
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollLeft: 0,
    page: 1,
    list: {
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var that = this;
      this.findTeam(that.data.page);
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
    var that = this;
    // 显示加载图标  
    // wx.showLoading({
    //   title: '正在加载中...',
    // })
    // numbers++;
    if (that.data.list.type == 1) {
      let page;
      page = that.data.page + 1;
      that.setData({
        page: page
      })
      that.findTeam(that.data.page);
    }
  },
  /**判断是否最后一张 */
  lower: function (e) {
    console.log(e.detail)
    if (e.detail.direction == "right") {
      wx.showToast({
        title: '已经是最后一张',
        icon: 'none'
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  goTothxq: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id
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
    wx.redirectTo({
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
  /**点击按钮 切换下一张图片 */
  goTonext: function(e) {
    let team = `teamList[${e.currentTarget.dataset.index}].scrollLeft`
    this.setData({
      [team]: this.data.teamList[e.currentTarget.dataset.index].scrollLeft + 103
    })
  },
  goToprev: function (e) {
    let team = `teamList[${e.currentTarget.dataset.index}].scrollLeft`
    if (this.data.teamList[e.currentTarget.dataset.index].scrollLeft == 0){
      wx.showToast({
        title: '已经第一张',
        icon: 'none'
      })
      return;
    }
    this.setData({
      [team]: this.data.teamList[e.currentTarget.dataset.index].scrollLeft - 103
    })
  },
  findTeam(page) {
    var that = this;
    let list = `list.type`
    wx.request({
      url: app.globalData.requestHost + app.globalData.Team_List,
      data: {
        page: page,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        // console.log(res, '一级分类数据')

        

        if (res.data.data) {
          res.data.data.forEach((item)=>{
            item.scrollLeft = 0;
          })
          let teamList = res.data.data ? res.data.data : []
          let listVal = 0;
          if (that.data.page == 1) {
            if (res.data.data.length == 0) {
              listVal = 0
            } else if (res.data.data.length == 10) {
              listVal = 1
            } else {
              listVal = 2
            }
            that.setData({
              teamList: teamList
            })
            teamList.forEach((item) => {
              that.findTeamGoods(item.id)
            })
          } else {
            if (res.data.data.length == 10) {
              listVal = 1
            } else {
              listVal = 2
            }
            let newteamList = that.data.teamList;
            console.log(res.data.data)
            if (res.data.data.length > 0) {
              res.data.data.forEach((item) => {
                item.scrollLeft = 0;
              })
              res.data.data.forEach((item) => {
                newteamList.push(item)
              })
              that.setData({
                teamList: newteamList
              })
              newteamList.forEach((item) => {
                that.findTeamGoods(item.id)
              })
            }
          }
          that.setData({
            [list]: listVal
          })
        }


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
})