<template>
	<!-- 发布主页面 -->
	<view class="main">
		<u-navbar :is-back="false" title="发布" :background="background"></u-navbar>

		<view class="select" v-for="(data, index) in list" :key="data.title" @click="edit(index)">
			<image :src="data.image" mode="aspectFill" class="img"></image>
			<text class="title">{{ data.title }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: 'stu',
			list: [
				{
					image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=253528301,1471815095&fm=26&gp=0.jpg',
					title: '加油站'
				},
				{
					image:
						'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201612%2F07%2F20161207132957_hGPZU.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612313692&t=08e52bc6b1e0cf859be16a3f64a5921a',
					title: '撕逼墙'
				}
			],
			background: {
				backgroundColor: '#fff'
			}
		};
	},
	methods: {
		edit(index) {
			uni.navigateTo({
				url: `./edit?index=${index}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	// height: 93vh;
	// 	background-color: #f8f8f8;
}

.select {
	margin: 80rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.img {
		margin-bottom: 20rpx;
		width: 400rpx;
		height: 350rpx;
		border-radius: 10rpx;
	}

	.title {
		color: #4cd964;
		font-weight: 600;
	}
}
</style>
