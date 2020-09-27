import Request from 'luch-request'
import { getConsts } from '../consts'
import { getUserId, saveTokenId, getTokenId, saveRefreshTokenId, getRefreshTokenId } from './auth'
const RETRY_TOKEN_TIME = 10 // 重新获取token次数

const options = {
  baseURL: getConsts('API_BASE_URL'),
  header: {
    'sadais-agent': _getSadaisAgent()
  },
  custom: {
    currentTokenRetry: RETRY_TOKEN_TIME // 当前token刷新次数
  }
}
const requestInstance = new Request(options)

/**
 * 获取SadaisAgent
 */
function _getSadaisAgent() {
  if (getConsts('SADAIS_AGENT')) {
    const appName = getConsts('NAME')
    const appVersion = getConsts('VERSION')
    const sysInfo = uni.getSystemInfoSync()
    const system = getConsts('SYSTEM')
    const channel = ''
    const devInfo = sysInfo ? '(' + sysInfo.brand + ';' + sysInfo.system + ')' : ''
    const station = getConsts('STATION')

    // 应用英文名称（全大写）/当前版本/系统（全大写）/渠道信息/系统信息/网络信息/运营商，
    const sadaisAgent = [appName, appVersion, system, channel, devInfo, '', station].join('/')
    return sadaisAgent
  }
  return ''
}

/**
 * 获取token对象
 */
function _getToken(requestUrl) {
  let token = ''
  // 首先判断是否是刷新token的接口，如果是则取刷新token的专用refreshToken
  if (getConsts('TOKEN_API') === requestUrl) {
    token = getRefreshTokenId()
  } else if (!getConsts('TOKEN_WHITE_LIST').includes[requestUrl]) {
    // 不在白名单中，直接获取tokenId
    token = getTokenId()
  }
  return token
}

/**
 * 发起请求获取token
 */
async function apiGetToken() {
  const { data } = await requestInstance.get(getConsts('TOKEN_API'))
  return data
}

/**
 * 刷新token
 * @param {*} response 请求返回response
 */
async function _refreshToken(response) {
  if (
    response &&
    response.data &&
    response.data.head &&
    getConsts('TOKEN_INVALID_CODE').includes(response.data.head.ret)
  ) {
    const userId = getUserId()
    if (!userId || !response.config.custom.currentTokenRetry) {
      // 如果用户未登录，重定向到登录页面
      reLaunchToLogin()
      return response
    }
    response.config.custom.currentTokenRetry--

    const data = await apiGetToken()

    if (data && data.head && data.head.ret === getConsts('RET_CODE').SUCCESS) {
      // 刷新token成功重置token重试次数
      response.config.custom.currentTokenRetry = RETRY_TOKEN_TIME
      // 保存tokenId和refreshTokenId
      const tokenId = data.data && data.data.accesstoken
      const refreshToken = data.data && data.data.refreshtoken

      tokenId && saveTokenId(tokenId)
      refreshToken && saveRefreshTokenId(refreshToken)

      // 重新发起请求
      const newResponse = await requestInstance.request(response.config)
      return newResponse
    }
  }
  return response
}

// request拦截器
requestInstance.interceptors.request.use(
  config => {
    if (!config.header) config.header = {}

    // 设置token
    const token = _getToken(config.url)
    if (token) config.header[getConsts('TOKEN_KEY')] = token

    // 如果post请求 没有设置content-type 则默认application/json
    if (!config.header['content-type'] && config.method.toUpperCase() === 'POST') {
      config.header['content-type'] = 'application/json;charset=UTF-8'
    }

    return config
  },
  config => {
    return Promise.reject(config)
  }
)

// response拦截器
requestInstance.interceptors.response.use(
  async response => {
    if (getConsts('TOKEN_EXCEPTION_PROCESS')) {
      response = await _refreshToken(response)
    }
    return response
  },
  response => {
    // 请求异常处理
    return Promise.reject(response)
  }
)

export default requestInstance
