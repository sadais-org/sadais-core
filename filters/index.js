import { dynamicImport } from '@/piui/tools/common'

/**
 * 默认导出导入本目录下，排除index.js的所有js
 */
export default dynamicImport(require.context('./', false, /\.js$/))
