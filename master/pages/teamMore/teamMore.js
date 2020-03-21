// pages/teamMore/teamMore.js
const app = getApp();
import ajax from '../../utils/api/my-requests.js';
import tool from '../../utils/publics/tool.js';
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
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var that = this;
      this.findTeam(that.data.page);
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
      tool.alert('已经是最后一张')
      // wx.showToast({
      //   title: '已经是最后一张',
      //   icon: 'none'
      // })
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /**点击搜索框按钮 进行搜索内容 */
  getsousuo: function (e) {
    console.log(e, '传商品参数过去')
    if (!this.data.inputValue) {
      tool.alert('搜索内容不能为空！')
      return;
    }
    tool.jump_nav('/pages/mainClass/mainClass?name=' + this.data.inputValue)
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
      tool.alert('已经第一张');
      return;
    }
    this.setData({
      [team]: this.data.teamList[e.currentTarget.dataset.index].scrollLeft - 103
    })
  },
  findTeam(page) {
    var that = this;
    let list = `list.type`
    ajax.teamList({
      page: page,
      limit: 10
    }).then((res)=>{
      if (res.data.data) {
        res.data.data.forEach((item) => {
          item.scrollLeft = 0;
        })
        let teamList = res.data.data ? res.data.data : [];
        let listVal = 0;
        let dataLen = res.data.data.length;
        listVal = dataLen == 0 ? 0 : (dataLen == 10 ? 1 : 2);
        // 分页数据 第一页为当前请求的数据 第二页会将第二页请求的数据填充至第一页的数据里
        let result = that.data.page == 1 ? teamList : (()=>{
          let newteamList = that.data.teamList;
          if (!res.data.data.length) return newteamList;
          res.data.data.forEach((item) => {
            item.scrollLeft = 0;
            newteamList.push(item)
          })
          return newteamList;
        })()
        that.setData({
          teamList: result
        })
        // 查询每一个组的推荐商品数据
        result.forEach((item) => {
          that.findTeamGoods(item.id)
        })
        that.setData({
          [list]: listVal
        })
      }
    })
  },
  findTeamGoods(id) {
    var that = this;
    ajax.teamGoods({
      id : id
    }).then((res)=>{
      let goods_list = res.data.data ? res.data.data : [];
      let goods = '';
      that.data.teamList.forEach((item, index) => {
        if (item.id == id) {
          goods = `teamList[${index}].goods_list`;
        }
      })
      that.setData({
        [goods]: goods_list
      })
    })
  }
})