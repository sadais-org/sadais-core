使用本库依赖列表

## 安装

项目src目录定义consts.js文件进行变量覆盖

```js
// 引入核心业务
import sadaisCore from 'sadais-core'
Vue.use(sadaisCore)
```

1. piui


## uni.scss建议和sadais-core一直的consts配置

```scss
$STATIC_BASE_URL: 'https://m.sadais.com';
$STATIC_FONT_URL: $STATIC_BASE_URL + '/huafa/marketing-activities-uniapp/static/font/';
$STATIC_IMG_URL: $STATIC_BASE_URL + '/huafa/marketing-activities-uniapp/static/img/';
```


## consts的引用
### js里面用

不要直接应用sadais-core/const或者@/src/consts，sadais-core会进行一次合并，正确的使用方式是

```js
this.$consts.API_BASE_URL

import { getConsts } from 'sadais-core/consts'
getConsts('API_BASE_URL')
getConsts().API_BASE_URL
```

### 在模板用
```html
<pi-img :src="$consts.get('STATIC_IMG_URL') + 'home_bg_banner.png'" />
```


## request的使用

request基于luch-request二次封装
https://www.quanzhan.co/luch-request/guide/3.x/#%E4%BB%8B%E7%BB%8D

```js
import request from 'sadais-core/core/request'

/**
 * 获取活动信息
 * @param {String} activityId 活动id
 */
export const apiGetActivity = async activityId => {
  const params = {}
  if (activityId) params.activityId = activityId
  const { data } = await request.get('/api/v1/activity/info')
  return data
}
```
