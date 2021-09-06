import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constRoutes = [
	{
		path: '/',
		// redirect: "/display",
		meta: { title: 'Free Wallpapers' },
		name: 'index',
	},
	{
		path: '/display',
		component: () => import('@/pages/wallpaper/assets/display_list.vue'),
		name: 'display',
		meta: {
			title: 'Free Wallpapers',
		},
	},
	{
		path: '/detail',
		component: () => import('@/pages/wallpaper/assets/detail.vue'),
		name: 'detail',
		meta: {
			title: 'Free Wallpapers',
		},
	},

]

export default new Router({
	base: process.env.BASE_URL,
	routes: constRoutes,
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
})
