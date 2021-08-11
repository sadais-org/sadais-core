import Request from 'luch-request'
import {getConsts} from '../consts'
import {getRefreshTokenId, getTokenId, getUserId, reLaunchToLogin, saveRefreshTokenId, saveTokenId} from './auth'

const RETRY_TOKEN_TIME = 10 // 重新获取token次数
let currentTokenRetry = RETRY_TOKEN_TIME // 当前token刷新次数

const options = {
  baseURL: getConsts('API_BASE_URL'),
  // 跨域请求时是否携带凭证
  withCredentials:  getConsts('WITHCREDENTIALS'),
  header: {}
}
// 设置sadaisAgent
const sadaisAgent = _getSadaisAgent()
const agentKey = getConsts('AGENT_KEY')
sadaisAgent && (options.header[agentKey] = sadaisAgent)

// 初始化实例
const requestInstance = new Request(options)

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



/**
 * 获取sadaisAgent
 */
function _getSadaisAgent() {
  if (getConsts('SADAIS_AGENT')) {
    const appName = getConsts('NAME')
    const appVersion = getConsts('VERSION')
    const system = getConsts('SYSTEM')
    const channel = getConsts('CHANNEL')
    const station = getConsts('STATION')
    const sysInfo = uni.getSystemInfoSync()
    const devInfo = sysInfo ? '(' + sysInfo.brand + ';' + sysInfo.system + ')' : ''

    // 应用英文名称（全大写）/当前版本/系统（全大写）/渠道信息/系统信息/网络信息/运营商，
    return [appName, appVersion, system, channel, devInfo, '', station].join('/')
  }
  return ''
}

/**
 * 判断url是否Token请求
 * @param url 请求url
 * @returns {*}
 */
function _isTokenApi(url) {
  return url.includes(getConsts('TOKEN_API'))
}

/**
 * 获取token对象
 */
function _getToken(requestUrl){
  let token = ''
  // 首先判断是否是刷新token的接口，如果是则取刷新token的专用refreshToken
  if (_isTokenApi(requestUrl)) {
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
async function _apiGetToken() {
  const { data } = await requestInstance.get(getConsts('TOKEN_API'))
  return data
}

/**
 * 重置token刷新次数
 */
function _resetTokenRetry() {
  currentTokenRetry = RETRY_TOKEN_TIME
}

/**
 * 结束刷新token
 * @param response 请求返回response
 * @returns response
 */
function _stopRefreshToken(response) {
  _resetTokenRetry()
  reLaunchToLogin()
  return response
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
    if (!userId || currentTokenRetry <= 0) {
      // 如果用户未登录，或者token刷新次数已用光，重定向到登录页面
      return _stopRefreshToken(response)
    }

    currentTokenRetry--

    const data = await _apiGetToken()

    if (data && data.head && data.head.ret === getConsts('RET_CODE').SUCCESS) {
      // 刷新token成功重置token重试次数
      _resetTokenRetry()
      // 保存tokenId和refreshTokenId
      const tokenId = data.data && data.data.accesstoken
      const refreshToken = data.data && data.data.refreshtoken

      tokenId && saveTokenId(tokenId)
      refreshToken && saveRefreshTokenId(refreshToken)

      // 重新发起请求
      return await requestInstance.request(response.config)
    } else {
      // token 获取失败，重新登录
      return _stopRefreshToken(response)
    }
  }
  return response
}

export default requestInstance
