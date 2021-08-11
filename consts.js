import {mergeDeep} from 'sadais-piui/tools/lang'

const STATIC_BASE_URL = 'http://m.sadais.com'

let CONSTS = {
  NAME: '', // 应用名称
  SYSTEM: '', // 系统
  VERSION: '1.0', // 版本号
  LOGIN_PATH: '',
  API_BASE_URL: '', // 接口baseURL
  STATIC_BASE_URL, // 静态资源baseURL
  STATIC_IMG_URL: STATIC_BASE_URL + '/demo/project/static/img/', // 静态资源文件路径
  RET_CODE: { SUCCESS: 0, FAIL: 1, TOKEN_UNDEFINED: 19, TOKEN_EXPIRED: 2 }, // 返回RET状态码解析
  // 运行平台枚举（H5：网页，APP：客户端应用，MP: 小程序）
  PLATFORM: { H5: 'H5', APP: 'APP', MP: 'MP' },
  SADAIS_AGENT: true,
  AGENT_KEY: 'sadais-agent',
  WITHCREDENTIALS: true, // 跨域请求时是否携带凭证
  TOKEN_EXCEPTION_PROCESS: true, // 使用通用逻辑处理TOKEN异常，需要自定义处理则设置成false
  // 服务器返回TOKEN失效集合
  // 2：token无效
  // 3：token过期
  TOKEN_INVALID_CODE: [2, 3],
  TOKEN_WHITE_LIST: [], // 不需要设置token的白名单
  TOKEN_API: '/api/user/account/v1/login/refreshtoken',
  TOKEN_KEY: 'jwttoken', // 设置header token key
  get(name) {
    return this[name]
  }
}

// 判断src目录下有没有定义consts.js文件，有则覆盖
const context = require.context('@/', false, /consts.js/)
if (context.keys().length === 1) {
  const consts = require('@/consts')
  CONSTS = mergeDeep(CONSTS, consts.default || consts)
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
