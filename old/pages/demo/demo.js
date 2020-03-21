//index.js
import tool from '../../utils/publics/tool.js'
const app = getApp()
Page({
  data: {
    background: ['banner0', 'banner1', 'banner2'],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    imgurl: app.globalData.staticurl//图片服务器地址
  },
  onLoad: function () {

  },
  /**
   * 更新分类
   */
  upcalss() {
    tool.loading();
    setTimeout(function () {
      tool.loading_h();
    }, 100)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow() {

  },
  //跳转页面
  jumps(e) {
    if (this.data.jumpList[e.currentTarget.dataset.index].url) tool.jump_nav(this.data.jumpList[e.currentTarget.dataset.index].url)
  }
})
