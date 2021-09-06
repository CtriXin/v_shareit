import Vue from 'vue'
import App from './App.vue'
import router from '@/router/wallpaper.js'
import store from '@/store'
import global from "@/utlis/global.js";

import firebase from "firebase/app";
import "firebase/analytics";
import ShareitReport from '@shareit/report'
import VueLazyload from 'vue-lazyload'

const firebaseConfig = {
  apiKey: 'AIzaSyDTNpfTxMJDn8-nkVkKpx3VcXx_96t3DME',
  authDomain: 'volks-49e47.firebaseapp.com',
  databaseURL: 'https://volks-49e47.firebaseio.com',
  projectId: 'volks-49e47',
  storageBucket: 'volks-49e47.appspot.com',
  messagingSenderId: '179804755242',
  appId: '1:179804755242:web:fdaea7257a8a2ec2263a53',
  measurementId: 'G-RYXXMYV1NN'
};

const reportInstance = new ShareitReport({
	appId: 'Walllive-h5-test',
	project: 'fe-analysis-data', //上报到metis项目名 创建项目时的名称 不能"_"
	logStore: 'report', //metis创建日志里的日志名称 不能"_"
	env: process.env.VUE_APP_REPORT_SDK_ENV, //环境
  groupName: process.env.VUE_APP_REPORT_SDK_GROUPNAME,
})

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
Vue.prototype.$analytics = analytics;
Vue.prototype.$reportInstance = reportInstance;

Vue.config.productionTip = false
Vue.prototype.$global = global
const DEFAULT_TITLE = 'Walllive';
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
      document.title = to.meta.title || DEFAULT_TITLE;
  });
});

Vue.use(VueLazyload)
Vue.prototype.$event = (params)=> {
  let { message, method, channel } = params;
	analytics.logEvent(message, { ...params });
	reportInstance.report({
		time: new Date(),
		...params,
		message: message,
		method: method,
		channel: channel,
	});
}


Vue.prototype.$api = global.wallpaper

// new Vue({
//   render: h => h(App)
// }).$mount('#app')


const vm = new Vue({
  router,
	store,
  render: h => h(App),
}).$mount('#app')

window.vm = vm
