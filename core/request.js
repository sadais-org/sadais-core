import Request from 'luch-request'
import { getConsts } from '../consts'
import { getUserid, saveTokenid, getTokenid, saveRefreshTokenid, getRefreshTokenid } from './auth'
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
  // 首先判断是否是刷新token的接口，如果是则取刷新token的专用refreshToken
  if (getConsts('NEED_REFRESH_TOKEN_LIST').includes(requestUrl)) {
    const refreshTokenid = getRefreshTokenid()
    const token = {
      [getConsts('TOKEN_KEY')]: refreshTokenid
    }
    return token
  }
  // 数据签名
  const tokenid = getTokenid()
  if (!getConsts('TOKEN_WHITE_LIST').includes[requestUrl] && tokenid) {
    const token = {
      [getConsts('TOKEN_KEY')]: tokenid
    }
    return token
  }
  return {}
}

const refreshTokenIfNeed = async response => {
  if (
    response &&
    response.data &&
    response.data.head &&
    getConsts('TOKEN_INVALID_CODE').includes(response.data.head.ret)
  ) {
    const userId = getUserid()
    if (!userId || !response.config.custom.currentTokenRetry) {
      reLaunchToLogin()
      return response
    }
    response.config.custom.currentTokenRetry--

    const data = await apiGetToken()
    if (data && data.head && data.head.ret === 0) {
      response.config.custom.currentTokenRetry = RETRY_TOKEN_TIME // 重置token重试次数
      // 刷新token成功 保存token
      const accessToken = data.data && data.data.accesstoken
      const refreshtoken = data.data && data.data.refreshtoken

      saveTokenid(accessToken)
      refreshtoken && saveRefreshTokenid(refreshtoken)
      // 重新发起请求
      const newResponse = await requestInstance.request(response.config)
      return newResponse
    }
  }
  return response
}

const apiGetToken = async () => {
  const { data } = await requestInstance.get(getConsts('TOKEN_API'))
  return data
}

requestInstance.interceptors.request.use(
  config => {
    /* 请求之前拦截器。可以使用async await 做异步操作 */
    config.header = {
      ...config.header
    }

    const token = _getToken(config.url)
    if (token) {
      config.header = {
        ...config.header,
        ...token
      }
    }

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

requestInstance.interceptors.response.use(
  async response => {
    const statusCode = response.statusCode
    /* 请求之后拦截器。可以使用async await 做异步操作  */
    if (statusCode !== 200) {
      // 服务端返回的状态码不等于200，则reject()
      return Promise.reject(response)
    }

    if (getConsts('TOKEN_EXCEPTION_PROCESS')) {
      response = await refreshTokenIfNeed(response)
    }
    return response
  },
  response => {
    // 请求异常处理
    console.log(response)
    return Promise.reject(response)
  }
)

export default requestInstance
