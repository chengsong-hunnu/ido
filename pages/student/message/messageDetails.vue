<template>
	<view>
		<u-navbar title="消息详情"></u-navbar>
		<u-card :title="message.title" :sub-title="message.time" :thumb="thumb">
			<view class="" slot="body">
				<view class="slot-content">
					<!-- <rich-text :nodes="message.content"></rich-text> -->
					<u-parse :html="message.content"></u-parse>
					</view>
			</view>
		</u-card>
	</view>
</template>

<script>
export default {
	data() {
		return {
			messageId: -1,
			message: '',
			thumb: 'https://www.uviewui.com/common/logo.png',
		};
	},
	async onLoad(option) {
		console.log(option);
		this.messageId = option.messageId;
		// 通过这个请求得到消息详情的时候就判断用户已阅
		let msg = await this.$u.api.getMessage(this.messageId);
		console.log(msg);
		// 使用正则将所有的将尖括号里面的内容都去掉，最后只剩下来文字
		this.message = msg.data;
		// let reg = /<img src="/g
		// let res = this.message.content.replace(reg,'<img src="'+this.$store.state.projectIp)
		// this.message.content = res
		console.log(this.message.content)
	}
};
</script>

<style lang="scss">
.slot-content {
	font-size: 28rpx;
	color: $u-content-color;
	// padding-left: 30rpx;
}
</style>
