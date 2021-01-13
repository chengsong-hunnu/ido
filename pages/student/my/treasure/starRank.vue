<template>
	<view>
		<u-navbar title="排行"></u-navbar>
		<view class="mystar">我的<u-icon name="star-fill" color="#2979ff" size="32"></u-icon>：{{myStars}}</view>

		<view v-for="(data,index) in rankList" :key="index" class="starevery">
			<view class="name">{{data.user.name}}</view>
			<view class="starnum">
				<u-icon name="star-fill" color="#2979ff" size="28"></u-icon>{{' '+data.star}}
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myStars: 0,
				user: {},
				rankList: []
			};
		},
		onLoad(option) {
			this.user = JSON.parse(JSON.stringify(this.$store.state.user)) 
			this.myStars = option.star
			let list = [{
				user: {
					name: '今夕和dsad'
				},
				star: 48
			}, {
				user: {
					name: '今夕和sa'
				},
				star: 38
			}, {
				user: {
					name: '今夕和sdfasf'
				},
				star: 28
			}, {
				user: {
					name: '今夕'
				},
				star: 18
			}, {
				user: {
					name: '今夕和'
				},
				star: 888
			},{
				user: {
					name: '今夕和dsad'
				},
				star: 48
			}, {
				user: {
					name: '今夕和sa'
				},
				star: 38
			}, {
				user: {
					name: '今夕和sdfasf'
				},
				star: 28
			}, {
				user: {
					name: '今夕'
				},
				star: 18
			}, {
				user: {
					name: '今夕和'
				},
				star: 888
			},{
				user: {
					name: '今夕和dsad'
				},
				star: 48
			}, {
				user: {
					name: '今夕和sa'
				},
				star: 38
			}, {
				user: {
					name: '今夕和sdfasf'
				},
				star: 28
			}, {
				user: {
					name: '今夕'
				},
				star: 18
			}, {
				user: {
					name: '今夕和'
				},
				star: 888
			}]
			this.rankList = list
		}
	}
</script>

<style lang="scss" scoped>
	.mystar{
		margin: 20rpx;
		// font-size: 1.1em;
	}
	.starevery {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 10rpx;
		padding: 22rpx;
		border: 1px solid #b3b2b2;
		border-radius: 25px;
	}
</style>
