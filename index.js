import { mergeDeep } from '@/piui/tools/lang'
import { getConsts, setConsts } from './consts'
import filters from './filters'
import core from './core'

const logStyle = 'color:#ff6a00;font-size:20px;font-weight:500;'

const install = (Vue, consts = {}) => {
  const mergeConsts = mergeDeep(getConsts(), consts)
  setConsts(mergeConsts)
  Vue.prototype.$consts = mergeConsts
  Vue.prototype.$filters = filters
  Object.keys(filters).forEach(filterName => {
    Vue.filter(filterName, filters[filterName])
  })

  Vue.prototype.$core = core

  console.log('%csadais-core 已安装，使用配置 this.$consts', logStyle, mergeConsts)
  console.log('%csadais-core this.$filters：', logStyle, filters)
  console.log('%csadais-core this.$core', logStyle, core)
}

export default install
