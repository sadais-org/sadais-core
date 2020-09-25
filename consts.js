import { mergeDeep } from '@/piui/tools/lang'

const STATIC_BASE_URL = 'http://m.sadais.com'

let CONSTS = {
  NAME: '', // 应用名称
  SYSTEM: '', // 系统
  VERSION: '1.0', // 版本号
  API_BASE_URL: '', // 接口baseURL
  STATIC_BASE_URL, // 静态资源baseURL
  STATIC_IMG_URL: STATIC_BASE_URL + '/demo/project/static/img/', // 静态资源文件路径
  get(name) {
    return this[name]
  }
}

// 判断src目录下有没有定义consts.js文件，有则覆盖
const context = require.context('@/', false, /consts.js/)
if (context.keys().length === 1) {
  const consts = require('@/consts')
  const mergeConsts = mergeDeep(CONSTS, consts.default || consts)
  CONSTS = mergeConsts
}

/**
 * 获取常量
 * @param {String} field 字段
 */
export const getConsts = field => {
  if (field) return CONSTS[field]
  return CONSTS
}

export default {
  getConsts
}
