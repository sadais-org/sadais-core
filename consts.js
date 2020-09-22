const STATIC_BASE_URL = 'http://m.sadais.com'

export default {
  NAME: '', // 应用名称
  SYSTEM: '', // 系统
  VERSION: '1.0', // 版本号
  API_BASE_URL: '', // 接口baseURL
  STATIC_BASE_URL, // 静态资源baseURL
  STATIC_URL: STATIC_BASE_URL + '/demo/static/img/', // 静态资源文件路径
  get(name) {
    return this[name]
  }
}
