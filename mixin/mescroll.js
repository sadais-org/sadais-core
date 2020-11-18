import MescrollMixin from 'mescroll-uni/mescroll-mixins.js'

// ------------------------- 对mescroll默认配置做修改 Start -------------------------
MescrollMixin.computed = {
  downOption() {
    return {
      auto: false
    }
  },
  upOption() {
    return {
      page: {
        num: 0,
        size: 20
      },
      empty: {
        tip: '暂无数据'
      }
    }
  }
}
// ------------------------- 对mescroll默认配置做修改 End ---------------------------

export default MescrollMixin
