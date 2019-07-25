import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
// 引入公共样式文件
import './assets/css/global.css'
// 引入第三方字体图标接口文件
import './assets/fonts/iconfont.css'
// 引入api接口文件
import './api'
// 引入第三方的树状表格
import TreeTble from 'vue-table-with-tree-grid'
// 引入第三方的转化时间戳
import moment from 'moment'
// 第三方的全局时间过滤器
Vue.filter('dateFormat', function(oringinVal) {
  return moment(oringinVal).format('YYYY-MM-DD hh:mm:ss')
})

Vue.component('tree-table', TreeTble)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
