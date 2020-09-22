import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
Vue.prototype.$dayjs = dayjs

/**
 * 时间格式化
 * @param {String, Date对象} value 时间
 * @param {String} format 自定义格式
 */
export default function dateFormat(value, format = 'YYYY.MM.DD HH:mm:ss') {
  return dayjs(value).format(format)
}
