/*
 * @Author: xin.song 
 * @Date: 2020-06-02 10:27:21 
 * @Last Modified by: xin.song
 * @Last Modified time: 2021-07-02 11:49:32
 */

<template>
    <!--toast-->
    <div class="toast-container" v-show="value">
        <div class="toast" v-html="toastTxt">
        </div>
    </div>
</template>

<!--

<toast ref="toast" v-model="showToast" :toast-txt="toastTxt"></toast>


-->

<script>
import "@/css/vue/toast.scss";

export default {
    data() {
        return {
            timer: null
        };
    },
    props: {
        toastTxt: {
            // toast文案
            required: true
        },
        value: {
            type: Boolean,
            default: false
        },
        timmer: {
            type: Number,
            default: 2000
        },
        scrollable: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        value(val) {
            this.init(val);
        }
    },
    methods: {
        close() {
            this.$emit("input", false);
        },
        init(show) {
            if (show) {
                if (!this.scrollable) {
                    var scrollTop =
                        document.body.scrollTop ||
                        document.documentElement.scrollTop;
                    document.body.style.cssText +=
                        "position:fixed;width:100%;top:-" + scrollTop + "px;";
                }

                this.$emit("show");
                setTimeout(() => {
                    this.close();
                }, this.timmer);
            } else {
                if (!this.scrollable) {
                    var body = document.body;
                    body.style.position = "";
                    var top = body.style.top;
                    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(
                        top
                    );
                }
            }
        }
    },
    created() {
        this.init(this.value);
    }
};
</script>