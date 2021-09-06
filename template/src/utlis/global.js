/*
 * @Author: xin.song
 * @Date: 2020-03-12 17:09:05
 * @Last Modified by: xin.song
 * @Last Modified time: 2021-09-06 17:25:56
 */

import { api } from './service.js'
const wallpaper = {
	getList(req) {
		return api.get('/external/wallpaper/list', req)
	},
	logDownload(req) {
		return api.get('/external/wallpaper/download', req)
	},
	getAPK(req) {
		return api.get(process.env.VUE_APP_GETAPP_API + '/promote', req)
	},
}

function GetQueryString(str) {
	var reg = new RegExp('(^|&)' + str + '=([^&]*)(&|$)', 'i')
	var r = window.location.search.substr(1).match(reg)
	if (r != null) return unescape(r[2])
	return null
}

function formatNum(num) {
	if (num) {
		return num.toString().replace(/\B(?=(?:\d{3})+\b)/g, ',')
	} else {
		return 0
	}
}

function formatDate(oldDate, fmt) {
	//oldDate 13位
	//fmt為格式化 exp：yyyy-MM-dd hh:mm
	let date = new Date()
	if (typeof oldDate === 'string' || typeof oldDate === 'number') {
		date = new Date(+oldDate)
	} else {
		date = oldDate
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
	}
	function padLeftZero(str) {
		return ('00' + str).substr(str.length)
	}
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + ''
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
		}
	}
	return fmt
}

function day(sDate1, sDate2) {
	let sDate3 = new Date(sDate2).getTime() - new Date(sDate1).getTime() //時間差的毫秒數
	if (sDate3 < 0) {
		return 0
	}
	//計算出相差天數
	let iDays = Math.floor(sDate3 / (24 * 3600 * 1000))
	return iDays
}

function isJSON(str) {
	if (typeof str == 'string') {
		try {
			var obj = JSON.parse(str)
			if (typeof obj == 'object' && obj) {
				return true
			} else {
				return false
			}
		} catch (e) {
			console.log('error：' + str + '!!!' + e)
			return false
		}
	}
	console.log('It is not a string!')
}

function img_loading() {
	//初始化需要显示的图片，并且指定显示的位置
	var imglist = document.getElementsByClassName('loadimg')
	// console.log(imglist);
	for (var i = 0; i < imglist.length; i++) {
		let tt = imglist[i]
		// console.log(tt);
		// console.log(tt.loading);
		//防止重复加载
		if (tt.loading == true) {
			continue
		}
		//没有该属性代表不加载
		if (!tt.getAttribute('src-data')) {
			continue
		}
		tt.loading = true
		Imagess(tt.getAttribute('src-error') ? tt.getAttribute('src-error') : tt.src, tt.getAttribute('src-data'), (obj) => {
			tt.src = obj.src
			tt.removeAttribute('src-data')
		})
	}
}

function Imagess(errorimg, url, callback, error) {
	//判断是否加载完成
	var val = url
	var img = new Image()
	img.onload = () => {
		// window.hide();
		if (img.complete == true) {
			callback(img)
		}
	}
	//如果因为网络或图片的原因发生异常，则显示该图片
	if (error) {
		img.onerror = error
	} else {
		img.onerror = function() {
			img.src = errorimg
		}
	}
	img.src = val
}

// 暴露出这些属性和方法
export default {
	GetQueryString,
	formatNum,
	formatDate,
	isJSON,
	day,
	img_loading,
	Imagess,
	wallpaper,
}
