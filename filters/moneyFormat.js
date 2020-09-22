/**
 * 金额格式化 4563453455 => "4,563,453,455"
 * @param {String, Date对象} money 金额
 * @param {Number} precision 数值精度 2
 * @param {Boolean} thousands 是否千分位格式化，默认是
 * @param {String} moneyPrefix 格式化前缀，默认
 */
export default function moneyFormat(money, precision = 2, thousands = true, moneyPrefix = '¥') {
  let value = money.toString()
  precision && (value = parseFloat(money).toFixed(precision))
  thousands && (value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
  return moneyPrefix + value
}
