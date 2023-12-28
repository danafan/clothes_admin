import Vue from 'vue'
import App from '@/App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);


import store from '@/store'

import '@/fonts/font.css'
import router from '@/router'

Vue.prototype.downLoadUrl = `${location.origin}/template`;    //下载模版前缀
Vue.prototype.actual_width = 0;    //下载模版前缀

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
