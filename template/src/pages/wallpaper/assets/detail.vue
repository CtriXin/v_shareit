<template>
	<section class="detail" id="detail">
		<div class="back-func" @click="goback()">
			<img src="@/assets/wallpaper/back.png" alt="">
		</div>

		<template>
			<section class="detail-lock" v-if="lockPage">
				<div class="unlock-cover" v-if="$store.state.isLock"></div>
				<div class="unlock-btn" @click="unlockWallPaper()" v-if="$store.state.isLock">
					<img src="@/assets/wallpaper/UNlock@2x.png" alt="">
					<div class="unlock-btn-txt">
						{{$store.state.unlockTxt}}
					</div>
				</div>
			</section>
		</template>

		<div id="loading-element" v-if="sourceType == 0">
			<div class="loading-png">
				<img src="@/assets/wallpaper/loading.png" alt="">
			</div>
			<div class="loading-txt">
				Loading
			</div>
		</div>

		<template v-if="sourceType == 0">
			<img :src="sourceObj.thumbnail.url" v-if="sourceObj" :src-data="sourceObj.preview.url" class="loadimg fit-img" alt="">
		</template>

		<template v-if="sourceType == 1">
			<div class='video_row' id="video_row">
				<video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" :playsinline="true">
				</video-player>
			</div>
		</template>

		<div class="download-btn" v-if="!$store.state.isLock" @click="savePic()">
			DOWNLOAD
		</div>
	</section>
</template>


<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import "@/css/wallpaper/video.scss";
import "@/css/wallpaper/detail.scss";
window.key = "";
window.pagename = "detail";
window.eventParams = {};

window.saveEventParams = (params = {}) => {
	window.eventParams = params;
};
window.hide = () => {
	window.vm.$event(window.eventParams);

	if (document.getElementById("loading-element"))
		document.getElementById("loading-element").style.opacity = 0;
};
window.goback = () => {
	console.log(`${window.pagename} goback`);
	if (window.pagename == "detail") window.vm.$router.go(-1);
	if (window.pagename == "list") window.vbrowser.goBackInHomePage();
};

window.show_reward_ad_result = (str) => {
	if (str == "complete") {
		window.vm.$store.state.isLock = false;
		var mo = function (e) {
			e.preventDefault();
		};
		document.body.style.overflow = ""; //出现滚动条
		document.removeEventListener("touchmove", mo, false);

		console.log(window.key);

		window.setItem(window.key, "unlock");
	}
	if (str == "dismiss") {
		window.vm.$store.commit("changeUnlockTxt", "TRY AGAIN");
	}
	if (str == "error") {
		window.vm.$store.commit("changeUnlockTxt", "TRY AGAIN");
	}
};

window.setItem = (key, value) => {
	sessionStorage.setItem(key, value);
	localStorage.setItem(key, value);
};

export default {
	name: "unlock",
	components: {
		videoPlayer,
	},

	data() {
		return {
			pageName: "detail",
			lockPage: null,
			sourceType: 0,

			unlockTxt: "Unlock Wallpaper for FREE", //TRY AGAIN

			playerOptions: {
				width: "100%",
				autoplay: false,
				muted: true,
				language: "en",
				loop: true,
				preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				sources: [],
				poster: "",
				controlBar: false,
			},

			sourceParams: "",
			sourceObj: null,
			localStorageKey: "",
			saveLock: false,
		};
	},
	computed: {
		player() {
			return this.$refs.videoPlayer.player;
		},
	},
	created() {
		// window.vm.$store.state.isLock = true;
		window.vm.$store.commit("changeUnlockTxt", "Unlock Wallpaper for FREE");
		this.saveLock = false;
		this.sourceParams = this.$route.params;
		this.sourceObj = this.sourceParams.sourceObj;
		this.sourceType = this.$route.params.type;
		this.lockPage = this.$route.params.lockPage;
	},
	mounted() {
		let _this = this;
		console.log(this.$route.params);
		window.pagename = "detail";

		this.localStorageKey = `${this.sourceParams.activityTab}_${this.sourceParams.id}`;
		window.key = this.localStorageKey;

		window.vm.$store.state.isLock = this.lockPage;

		this.$set(this.playerOptions, "autoplay", !this.lockPage);
		this.$set(
			this.playerOptions,
			"height",
			window.screen.availHeight + "px"
		);

		console.log(
			`序号${this.sourceParams._index} id为 ${this.sourceParams.id} 类型为 ${this.sourceParams.type} `
		);

		this.$event({
			message: "show_content_low",
			channel: this.sourceParams.activityTab,
			type: this.$route.params.type,
		});
		var sessionKey = sessionStorage.getItem(this.localStorageKey);
		var localKey = localStorage.getItem(this.localStorageKey);

		console.log(`sessionKey:${sessionKey}  localKey:${localKey}`);
		// console.log(sessionKey == 'undefined' );

		if (sessionKey == "unlock") {
			console.log("已经观看广告");
			window.vm.$store.state.isLock = false;
		}

		if (this.lockPage && sessionKey != "unlock") {
			this.stop();
			window.vm.$store.state.isLock = true;
		}

		if (this.sourceType == 1) {
			this.$set(this.playerOptions, "poster", this.sourceObj.large.url);
			this.$set(this.playerOptions.sources, 0, {
				type: "video/" + this.sourceObj.large.video.file_type,
				src: this.sourceObj.large.video.play_url,
			});
		}

		console.log(
			`从${this.sourceParams.activityTab}页面过来，查看第${this.sourceParams._index}张图片，类型为${this.$route.params.type},是否需要观看广告${this.lockPage},准备转换高清图`
		);

		this.$global.img_loading();

		window.saveEventParams({
			message: "show_content_high",
			method: this.sourceParams.id,
			channel: this.sourceParams.activityTab,
			type: this.$route.params.type,
		});

		document.getElementById("detail").style.height =
			window.screen.availHeight + "px";
		if (document.getElementById("video_row"))
			document.getElementById("video_row").style.height =
				window.screen.availHeight + "px";
	},
	watch: {
		value(val) {
			this.init(val);
		},
	},
	methods: {
		goback() {
			this.$router.go(-1);
		},
		stop() {
			var mo = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = "hidden";
			document.addEventListener("touchmove", mo, false); //禁止页面滑动
		},
		/***取消滑动限制***/
		move() {
			var mo = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = ""; //出现滚动条
			document.removeEventListener("touchmove", mo, false);
		},
		unlockWallPaper() {
			// this.unlockTxt = "TRY AGAIN";
			window.setItem(this.localStorageKey, "toUnlock");
			window.vbrowser.showAd("reward", "show_reward_ad_result", null); // eslint-disable-line
			// if (window.vbrowser) {

			// } else {
			// 	alert("请从客户端打开");
			// 	setTimeout(() => {
			// 		window.show_reward_ad_result("complete");
			// 	}, 1000);
			// }

			this.$event({
				message: "click_content_unlock",
				method: this.sourceParams.id,
				channel: this.sourceParams.activityTab,
			});
		},
		savePic() {
			console.log(this.sourceParams);
			let sourceObj = this.sourceParams.sourceObj;
			if (this.saveLock) {
				return;
			}
			this.saveLock = true;
			console.log(sourceObj);
			this.$api.logDownload({
				id: this.sourceParams.id,
			});

			if (this.sourceType == 0) {
				console.log("img");
				window.vbrowser.download(
					sourceObj.original.url,
					this.sourceParams.title,
					sourceObj.original.url
				); // eslint-disable-line
			} else {
				window.vbrowser.download(
					sourceObj.large.video.play_url,
					this.sourceParams.title,
					sourceObj.large.url
				); // eslint-disable-line
			}

			this.$event({
				message: "click_content_save",
				method: this.sourceParams.id,
				channel: this.sourceParams.activityTab,
			});
		},
	},
};
</script>

