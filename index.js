import Vue from 'vue'
import { mergeDeep } from '@/piui/tools/lang'
import defaultConsts from './consts'

import filters from './filters'
Object.keys(filters).forEach(filterName => {
  Vue.filter(filterName, filters[filterName])
})

const logStyle = 'color:#ff6a00;font-size:20px;font-weight:500;'

const install = (Vue, consts = {}) => {
  const mergeConsts = mergeDeep(defaultConsts, consts)
  Vue.prototype.$consts = mergeConsts
  Vue.prototype.$filters = filters

  console.log('%csadais-core 已安装，使用配置 this.$consts', logStyle, mergeConsts)
  console.log('%csadais-core this.$filters：', logStyle, filters)
}

export default install
