import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 检测系统暗色模式偏好
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  localStorage.setItem('theme', 'dark')
}

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  localStorage.setItem('theme', event.matches ? 'dark' : 'light')
  // 如果应用已经加载，需要通过事件总线通知组件更新主题
})

new Vue({
  render: h => h(App),
}).$mount('#app')
