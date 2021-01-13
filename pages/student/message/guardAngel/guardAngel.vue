<template>
	<!-- 添加消息主页面 -->
	<view class="main">
		<u-navbar title="守护天使" :background="background"></u-navbar>

		<view class="select" v-for="(data,index) in list" :key="data.title" @click="chat(index)">
			<image :src="data.image" mode="aspectFill" class="img"></image>
			<text class="title">{{data.title}}</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					type: 'stu',
				},
				list: [{
						image: 'http://122.9.44.92:5001/sasasasasasa_fgfgf.png',
						title: '我的天使'
					},
					{
						image: 'http://122.9.44.92:5001/5ffbf37386546.png',
						title: '我的守护'
					},
				],
				background: {
					backgroundColor: '#fff',
				}
			}
		},
		onLoad(){
			// 在这里再次获取一下是哪里来的消息
		},
		methods: {
			chat(index) {
				uni.navigateTo({
					url: `./chat?index=${index}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		// height: 93vh;
		// 	background-color: #f8f8f8;
	}

	.select {
		margin: 180rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.img {
			margin-bottom: 20rpx;
			width: 250rpx;
			height: 250rpx;
			border-radius: 125rpx;
		}

		.title {
			color: #4CD964;
			font-weight: 600;
		}
	}
</style>
