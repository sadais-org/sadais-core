import Request from 'luch-request'
import { getConsts } from '../consts'

const options = {
  baseURL: getConsts('API_BASE_URL')
}

const requestInstance = new Request(options)

export default requestInstance
