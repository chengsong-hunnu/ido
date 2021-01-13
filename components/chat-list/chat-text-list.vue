<template name="chat-text-list">
	<view class="width">
		<br>
		<block v-for="msg in msgs" :key="msg">
			<block v-if="msg.me === true">
				<view style="position: absolute ;right: 0upx;">
					<text style="color: #CACACA;">{{my_name}}</text>
				</view>
				<br>
				<view style="position: absolute;right: 0upx;width: 90%;">
					<view style="position: absolute; right: 30upx; width: 10%;">
						<view style="position: absolute;right: 20upx;">
							<!-- <image style="width: 5;height: 80upx;" v-bind:src="my_image" mode=""></image> -->
							<u-avatar :src="my_image" mode="circle"></u-avatar>
						</view>
					</view>
					<view style="position: absolute; right: 20%;">
						<view class="Separation-line">

						</view>
						<view class="" style="padding: 10upx;text-align: right;background-color: #007AFF;border: 2upx solid #007AFF;border-radius: 20upx 0 20upx 20upx;">
							<view style="text-align: left;">
								<text style="font-size: 40upx;color: #e1e1e1;word-break:break-all;">{{msg.msg}}</text>
							</view>
						</view>
					</view>

				</view>
			</block>
			<!-- --------------------------------------------------------------- -->
			<block v-if="msg.me === false">
				<text style="color: #CACACA;">{{other_name}}</text>
				<view style="position: absolute;left: 0upx;width: 90%;">
					<view style="position: absolute; left: 0upx; width: 10%;">
						<view style="position: absolute;left: 20upx;">
							<!-- <image style="width: 80upx;height: 80upx;" v-bind:src="other_image" mode=""></image> -->
							<u-avatar :src="other_image" mode="circle"></u-avatar>
						</view>
					</view>
					<view style="position: absolute; left: 20%;">
						<view class="Separation-line">

						</view>
						<view class="" style="padding: 10upx;text-align: left;background-color: #00ff33;border: 2upx solid #00ff33;border-radius: 0 20upx 20upx 20upx;">
							<view style="text-align: left;">
								<text style="font-size: 40upx;color: #4f4f4f;word-break:break-all;">{{msg.msg}}</text>
							</view>
						</view>
					</view>

				</view>
			</block>
			<br>
			<br>
			<br>
		</block>
		<!-- <br>
		<br>
		<br>
		<br>
		<br> -->

		<view class="in">
			<input v-model="input" class="inframe" />
			<button @tap="ev()" type="default" class="btn">发送</button>
		</view>
	</view>
</template>

<script>
	import uniIcons from "../uni-icons/uni-icons.vue"
	export default {
		components: {
			uniIcons
		},
		name: "ChatTextList",

		//属性
		props: {
			my_image: { //我的图片的路径
				type: String,
				value: null
			},
			other_image: { //对方的图片
				type: String,
				value: null
			},
			my_name: {
				type: String
			},
			other_name: {
				type: String
			},
			msgs: { //聊天列表
				type: Array,
				/* 
				使用方法：[{me:true, msg:"我发送的信息"}, {me:false, msg:"对方发送的信息"}]
				*/
				value: []
			},
		},
		data: {
			input: "",
		},
		methods: {
			ev() {
				var get = this.input
				this.$emit("send", get) //传递的值
			}
		}
	}
</script>

<style lang="scss" scoped>
	.in {
		background-color: #ffffff;
		position: fixed;
		width: 100%;
		top: 92%;
		height: 5%;
		display: flex;
		justify-content: space-between;
		.inframe {
			border-radius: 20rpx;
			border: 5upx solid #eceaff;
			padding: 12upx;
			width: 500rpx;
			height: 70rpx;
			color: #000000;
		}

		.btn {
			position: fixed;
			right: 0upx;
			width: 200rpx;
			height: 70upx;
			background-color: #009dff;
		}
	}
</style>
