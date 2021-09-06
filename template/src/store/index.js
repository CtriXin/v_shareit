import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		count: 1000,
		unlockTxt: "Unlock Wallpaper for FREE",
		isLock: true,
		initialHistoryStateStr: '',
	},
	mutations: {
		changeUnlockTxt: (state, txt) => {
			//n是从组件中传来的参数
			state.unlockTxt = txt
		},
		setHistoryInitialStateStr: (state, initialHistoryStateStr) => {
			state.initialHistoryStateStr = initialHistoryStateStr;
		},
	},

})

export default store