<template>
	<section class="img-row">
		<div class="img-display-container">
			<div class="img-item" v-for="(data,i) in fileList" @click="watch(data,i)" :key="i">
				<div class="img-display-detail" v-if="data.src.thumbnail && data.type == 0" :style='{ backgroundImage: `url(${data.src.preview.url})`,backgroundSize:`cover` }'>
				</div>

				<img src="@/assets/wallpaper/Live_icon@2x.png" v-if="data.type == 1" class="live" alt="">
				<div class="img-display-detail" v-if="data.src.large && data.type == 1" v-lazy-container="{ selector: 'img', error: data.src.large.url, loading: data.src.large.url }">
					<div class="video-item">
						<img :data-src="data.src.large.url" class="loadimg fit-img" alt="">
					</div>
				</div>
			</div>
		</div>

		<div class="more-memo" v-show="!hasNext">
			Stay tuned for more wallpapers...
		</div>
	</section>
</template>

<script>
import "@/css/wallpaper/ver_1.scss";
import "@/css/wallpaper/ver_1_1.scss";
window.pagename = "list";

// window.show = () => {
// 	console.log("show");
// };
// window.hide = () => {
// 	console.log("hide");
// };

window.goback = () => {
	console.log(`${window.pagename} goback`);
	if (window.pagename == "detail") window.vm.$router.go(-1);
	if (window.pagename == "list") window.vbrowser.goBackInHomePage();
};

export default {
	name: "ver_1_public",
	data() {
		return {
			pageName: "ver_1_public",
			fileList: [],

			activityTab: undefined,
			tab_index: null,
			page: 1,
			pageSize: 20,
			pageLoading: true,
			hasNext: false,
		};
	},
	beforeRouteUpdate(to, from, next) {
		//TODO: set default
		this.fileList = [];
		this.page = 1;
		//get param
		this.activityTab = to.query.path ? to.query.path : "live";
		this.tab_index = to.query.tab_index;
		console.log("in_display_beforeRouteUpdate", to.query.path);

		this.getList();
		window.pagename = "list";
		this.move();
		this.$event({
			message: "show_ve",
			method: "browse_detail",
			channel: to.query.path,
		});

		next();
	},
	created() {
		console.log("create", this.$route);
		this.activityTab = this.$route.query.path
			? this.$route.query.path
			: "live";
		this.tab_index = this.$route.query.tab_index
			? this.$route.query.tab_index
			: "8";
		window.pagename = "list";
	},
	activated() {
		//每次進來都會請求
		console.log("activated", this.activityTab);
		this.move();
	},
	mounted() {
		console.log(`进入${this.activityTab}列表页，准备开始埋点`);
		this.getList();
		this.move(); //开启页面滚动
		this.scroll();

		this.$event({
			message: "show_ve",
			method: "browse_detail",
			channel: this.activityTab,
		});
	},
	methods: {
		move() {
			var mo = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = ""; //出现滚动条
			document.removeEventListener("touchmove", mo, false);
		},
		scroll() {
			this.pageLoading = false;
			window.onscroll = () => {
				// 距离底部200px时加载一次
				let bottomOfWindow =
					document.documentElement.offsetHeight -
						document.documentElement.scrollTop -
						window.innerHeight <=
					200;
				console.log(
					`是否可以滚动 ${
						bottomOfWindow &&
						this.pageLoading == false &&
						this.hasNext
					}`
				);
				if (
					bottomOfWindow &&
					this.pageLoading == false &&
					this.hasNext
				) {
					this.pageLoading = true;
					this.page++;
					console.log("已经滚动触发", this.page);
					this.getList();
				}
			};
		},
		getList() {
			let _this = this;
			this.$api
				.getList({
					client: "h5",
					label: _this.tab_index,
					page: _this.page,
					size: _this.pageSize,
				})
				.then((res) => {
					this.pageLoading = false;
					let temp = res.data.source;
					_this.fileList = _this.fileList.concat(temp);
					_this.hasNext = res.data.hasNext;
					console.log(res);
				});
		},
		watch(obj, i) {
			// console.log(obj, this.$route.query.path);
			let msg = "click_ve";
			let { id, src, switchAdvert, type } = obj;
			// console.log(id,src,switchAdvert);

			this.$router.push({
				name: "detail",
				params: {
					title: msg + "_" + id,
					sourceObj: src,
					_index: i + 1, //序号
					id: id,
					type: type,
					activityTab: this.activityTab, //4k/live/anime
					lockPage: switchAdvert, //是否播放激励
				},
			});

			this.$event({
				message: msg,
				method: this.activityTab,
				channel: id,
				type: type,
				// apk_full_path: obj.img ? obj.img : obj.video,
			});
		},
	},
};
</script>
