<template>
	<!-- 消息主页面 -->
	<view class="main">
		<u-navbar :is-back="false" title="消息"></u-navbar>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item
					v-for="(data, index) in msgListNow"
					:title="data.title"
					:key="data.title"
					@click="nav(data.path)"
				></u-cell-item>
			</u-cell-group>
		</view>
		<view class="card" v-for="(data, index) in list" :key="data.value">
			<u-card :title="data.title" :thumb="thumb" @click="messageDetail(data.messageId)">
				<view class="" slot="body">
					<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
						<view class="u-body-item-title u-line-2">{{ data.content.replace(reg, '') }}</view>
						<!-- <image :src="data.img" mode="aspectFill"></image> -->
						<!-- <rich-text :nodes="data.content"></rich-text> -->
					</view>
				</view>
			</u-card>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			msgList: [
				{
					title: '宣讲会',
					path: './lectureMeeting/lectureMeeting'
				},
				{
					title: '面试通知',
					path: './interview/interview'
				},
				{
					title: '守护天使',
					path: './guardAngel/guardAngel'
				},
				{
					title: '每月主题总结',
					path: './monthlySummary/monthlySummary'
				}
			],
			msgListNow: [
				{
					title: '守护天使',
					path: './guardAngel/guardAngel'
				}
			],
			thumb: 'https://www.uviewui.com/common/logo.png',
			list: [],
			reg: /<.*?>/g
		};
	},
	async onLoad() {
		// 这里进来就获取消息列表并进行提示
		let list = await this.$u.api.getMessageList();
		let content = list.rows;
		this.list = content;
		console.log(this.list);
	},

	methods: {
		nav(path) {
			uni.navigateTo({
				url: path
			});
		},
		messageDetail(messageId) {
			uni.navigateTo({
				url: `messageDetails?messageId=${messageId}`
			});
		},
		async onPullDownRefresh() {
			// 下拉的时候还是能请求最新的系统消息的
			let list = await this.$u.api.getMessageList();
			let content = list.rows;
			this.list = content;
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	background-color: #f8f8f8;

	.card {
		background-color: #fff;

		.u-body-item {
			font-size: 28rpx;
			color: #333;
			padding: 10rpx 10rpx;
		}

		.u-body-item image {
			width: 120rpx;
			flex: 0 0 120rpx;
			height: 120rpx;
			border-radius: 8rpx;
			margin-left: 12rpx;
		}
	}
}
</style>
