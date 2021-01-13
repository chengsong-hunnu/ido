<template>
	<view>
		<u-navbar title="设置"></u-navbar>

		<u-cell-item title="手机号" @click="changeIntro('phonenumber')">{{ user.phonenumber }}</u-cell-item>
		<u-cell-item title="邮箱" @click="changeIntro('email')">{{ user.email }}</u-cell-item>
		<u-cell-item title="登录密码" @click="changeIntro('password')"></u-cell-item>
		<u-cell-item title="退出登录" @click="quit" :arrow="false"></u-cell-item>
		<u-cell-group v-if="type == 'student'">
			<!-- <u-cell-item title="专业" :arrow="false">{{user.major}}</u-cell-item>
			<u-cell-item title="指导老师" :arrow="false">{{user.teacher}}</u-cell-item> -->
		</u-cell-group>
		<u-cell-group v-else-if="type == 'worker'">
			<!-- <u-cell-item title="酒店" :arrow="false">{{user.hotel}}</u-cell-item>
			<u-cell-item title="部门" :arrow="false">{{user.department}}</u-cell-item> -->
		</u-cell-group>
		<u-popup v-model="show" mode="center" border-radius="14" width="500rpx" height="300rpx">
			<view class="receive">
				<view class="title">是否退出</view>
				<view class="btn">
					<u-button size="medium" type="primary" @click="cancel">取消</u-button>
					<u-button size="medium" type="primary" @click="requit">确认</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {},
			type: '',
			newPassword: '',
			show: false
		};
	},
	onLoad(option) {
		console.log(option);
		this.type = option.type;
		this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
	},
	onShow() {
		// 每一次显示都监听一下是否更新了用户信息，如果有的话就重新获取用户最新的内容
		uni.$on('updateUser', res => {
			this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
		});
	},
	methods: {
		changeIntro(type) {
			this.$u.route({
				url: '/pages/student/my/myDetails/changeIntro',
				params: {
					type: type
				}
			});
		},
		quit() {
			this.show = true;
		},
		cancel() {
			this.show = false;
		},
		requit() {
			uni.clearStorageSync();
			this.$u.api.quit()
			uni.reLaunch({
				url: `/pages/login/loginForm?loginName=${this.$store.state.login.username}`
			});
		}
	}
};
</script>

<style lang="scss">
	.receive {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		.title {
			font-size: 1.1em;
			margin: 5vh;
		}
		.btn /deep/ .u-size-medium{
			padding: 0 50rpx;
			margin: 0 20rpx;
		}
	}
</style>
