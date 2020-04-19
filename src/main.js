import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式表
import './assets/css/global.css'
// 导入图标样式
import './assets/fonts/iconfont.css'
// 导入树形table
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 添加组件tree-table
Vue.component('tree-table', TreeTable)

// 定义全局过滤器
Vue.filter('dateFormat', function (originVal) { // 第一个参数是过滤器的名字，第二个参数是过滤器的处理函数，传递一个形参
  // new一个时间对象, 根据一个给定时间得到一个日期对象
  const dt = new Date(originVal)
  // 定义过滤规则
  const y = dt.getFullYear()
  const M = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + ''.padStart(2, '0'))
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 返回过滤后的时间格式
  return `${y}-${M}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
