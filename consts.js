import { mergeDeep } from '@/piui/tools/lang'

const STATIC_BASE_URL = 'http://m.sadais.com'

let CONSTS = {
  NAME: '', // 应用名称
  SYSTEM: '', // 系统
  VERSION: '1.0', // 版本号
  RET_CODE: { SUCCESS: 0, FAIL: 1, TOKEN_UNDEFINED: 19, TOKEN_EXPIRED: 2 }, // 返回RET状态码解析
  LOGIN_PATH: '',
  TOKEN_EXCEPTION_PROCESS: true, // 使用通用逻辑处理TOKEN异常，需要自定义处理则设置成false
  TOKEN_INVALID_CODE: [2, 3], // 接口返回码如果是2或3 则表明token过期或无效 需要自动刷新token
  TOKEN_WHITE_LIST: [], // 不需要设置token的白名单
  NEED_REFRESH_TOKEN_LIST: ['/api/user/account/v1/login/refreshtoken'], // 需要刷新token的接口名单
  SADAIS_AGENT: false,
  TOKEN_API: '/api/user/account/v1/login/refreshtoken',
  TOKEN_KEY: 'jwttoken', // 设置header token key
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
