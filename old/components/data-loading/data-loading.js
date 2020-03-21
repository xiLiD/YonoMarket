// components/data-loading/data-loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    types: {
      type: [String, Boolean],
      value: 0
    },
    title: {
      type: Array,
      value: ['暂无相关数据~', '玩命加载中...', '—————    无更多数据    —————']
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  }, 
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
