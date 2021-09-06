<template>
	<div id="app">
		<div id="nav-row" v-show="$route.name != 'detail'">
			<div class="nav-item " @click="goto(1,'live')" :class="{'activity':activityPage == 1}">Live</div>
			<div class="nav-item " @click="goto(2,'4k')" :class="{'activity':activityPage == 2}">4K</div>
			<div class="nav-item " @click="goto(3,'anime')" :class="{'activity':activityPage == 3}">Anime</div>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
import "@/css/main.scss";
import "@/css/wallpaper/ver_1.scss";

export default {
	name: "app",
	data() {
		return {
			pageName: "Walllive_index",
			from: null,
			filename: null,
			activityPage: 1,
		};
	},
	created() {
		let path = this.$route.query.path;
		console.log(this.$router);
		console.log(this.$route);

		this.from = this.$global.GetQueryString("from") || "";
		this.filename = this.$global.GetQueryString("filename");
		if (path == "live") {
			this.activityPage = 1;
		}
		if (path == "4k") {
			this.activityPage = 2;
		}
		if (path == "anime") {
			this.activityPage = 3;
		}

		if (this.$route.name == "index" || !this.$route.name) {
			this.$router.push({ name: "display", query: { path: "live" } });
		}
	},
	mounted() {
		console.log(process.env);
		if (window.history && window.history.pushState) {
			// 向历史记录中插入了当前页
			history.pushState(null, null, document.URL);
			window.addEventListener("popstate", this.goBack, false);
		}

		// this.getAPK();

		this.$event({
			message: "show_ve",
			method: "browse_" + this.pageName,
		});
	},
	destroyed() {
		window.removeEventListener("popstate", this.goBack, false);
	},
	methods: {
		getAPK() {
			this.$api
				.getAPK({
					from: this.from || "default",
					filename: this.filename || "default",
				})
				.then((res) => {
					console.log(res);
				});
		},
		goBack() {
			let path = this.$route.query.path;
			if (path == "live") {
				this.activityPage = 1;
			}
			if (path == "4k") {
				this.activityPage = 2;
			}
			if (path == "anime") {
				this.activityPage = 3;
			}
		},
		goto(n, name) {
			console.log(this.$route);
			if (this.activityPage == n) return;
			this.activityPage = n;
			let tab_index;
			switch (name) {
				case "live":
					tab_index = 8;
					break;
				case "4k":
					tab_index = 9;
					break;
				case "anime":
					tab_index = 10;
					break;
			}
			this.$router.push({
				name: "display",
				query: { path: name, tab_index: tab_index },
			});

			this.$event({
				message: "click_ve",
				method: "goto",
				channel: name,
			});
		},
	},
};
</script>

