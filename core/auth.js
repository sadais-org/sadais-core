import { reLaunch } from 'sadais-piui/tools/navi'
import { getConsts } from '../consts'

const consts = getConsts()

const USER_INFO = 'USER_INFO' // 用户个人信息
const LOGIN_INFO = 'LOGIN_INFO' // 登录信息
const ACCOUNT_INFO = 'ACCOUNT_INFO' // 账号信息
const TOKEN_ID = 'TOKEN_ID' // TOKEN令牌ID
const REFRESH_TOKEN_ID = 'REFRESH_TOKEN_ID' // 刷新token时使用的token

/**
 * 保存用户信息到本地存储中
 * @param {Array} accountInfo 用户信息
 */
export const saveAccountInfo = accountInfo => {
  const result = uni.setStorageSync(ACCOUNT_INFO, accountInfo)
  return result
}

/**
 * 获取账号信息 return Array
 */
export const getAccountInfo = () => {
  const accountInfo = uni.getStorageSync(ACCOUNT_INFO)
  return accountInfo
}

export const removeAccountInfo = () => {
  return uni.removeStorageSync(ACCOUNT_INFO)
}

/**
 * 保存用户信息到本地存储中
 * @param {Object} loginInfo 用户信息
 */
export const saveLoginInfo = loginInfo => {
  const result = uni.setStorageSync(LOGIN_INFO, loginInfo)
  return result
}

/**
 * 获取登录信息
 * @param {Object} loginInfo 用户信息
 */
export const getLoginInfo = () => {
  const loginInfo = uni.getStorageSync(LOGIN_INFO)
  return loginInfo
}

export const getUserInfo = () => {
  const userInfo = uni.getStorageSync(USER_INFO)
  return userInfo
}

/**
 * 保存用户信息到本地存储中
 * @param {Object} user 用户信息
 */
export const saveUserInfo = user => {
  const result = uni.setStorageSync(USER_INFO, user)
  return result
}

/**
 * 移除用户信息
 */
export const removeUserInfo = () => {
  return uni.removeStorageSync(USER_INFO)
}

/**
 * 从本地存储中获取用户ID
 */
export const getUserId = () => {
  const user = uni.getStorageSync(USER_INFO) || {}
  return user.userid || user.userId || ''
}

/**
 * 保存令牌ID到本地存储中
 * @param {String} TokenId 令牌
 */
export const saveTokenId = tokenid => {
  uni.setStorageSync(TOKEN_ID, tokenid)
}

/**
 * 从本地存储中获取令牌ID
 */
export const getTokenId = () => {
  return uni.getStorageSync(TOKEN_ID) || ''
}

/**
 * 移除令牌ID
 */
export const removeTokenId = () => {
  return uni.removeStorageSync(TOKEN_ID)
}

/**
 * 保存刷新token的令牌ID到本地存储中
 * @param {String} refreshToken 令牌
 */
export const saveRefreshTokenId = refreshToken => {
  uni.setStorageSync(REFRESH_TOKEN_ID, refreshToken)
}

/**
 * 从本地存储中获取令牌ID
 */
export const getRefreshTokenId = () => {
  return uni.getStorageSync(REFRESH_TOKEN_ID) || ''
}

/**
 * 移除令牌ID
 */
export const removeRefreshTokenId = () => {
  return uni.removeStorageSync(REFRESH_TOKEN_ID)
}

/**
 * 重定向到登录页
 */
export const redirectToLogin = url => {
  // 重定向登录页面
  redirectTo(url || consts.LOGIN_PATH)
}

/**
 * 关闭所有页面打开登录页面
 */
export const reLaunchToLogin = url => {
  const pages = getCurrentPages()
  const currentPath = pages[pages.length - 1].route
  // 如果已在登录页就不再进入
  if (!currentPath || !currentPath.includes(consts.LOGIN_PATH)) {
    reLaunch(url || consts.LOGIN_PATH)
  }
}

/**
 * 用户注销
 * @param {String} url 注销后重定向登录的地址
 */
export const logout = url => {
  console.log('用户注销，清除相关用户信息')
  removeTokenId()
  removeRefreshTokenId()
  removeUserInfo()
  removeAccountInfo()
  reLaunchToLogin(url || consts.LOGIN_PATH)
}
