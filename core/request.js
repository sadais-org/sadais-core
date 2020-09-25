import Request from 'luch-request'
import { getConsts } from '../consts'

const requestInstance = new Request()

requestInstance.config.baseURL = getConsts('API_BASE_URL')

export default requestInstance
