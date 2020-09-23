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

/**
 * 获取常量
 */
export const getConsts = () => {
  return CONSTS
}

/**
 * 设置常量
 * @param {Object} updateConsts 配置
 */
export const setConsts = updateConsts => {
  CONSTS = updateConsts
  return CONSTS
}

export default {
  getConsts,
  setConsts
}
