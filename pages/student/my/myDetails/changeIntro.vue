<template>
	<view class="main">
		<u-navbar title="更改信息"></u-navbar>
		<view class="see">
			<view class="edit">
				<view v-if="type == 'password'">
					<u-form :model="form" ref="uFormSet">
						<u-form-item :label-position="labelPosition" label="原密码" prop="oldPassword" label-width="100">
							<u-input :border="border" placeholder="请输入原密码" v-model="form.oldPassword" type="text"></u-input>
						</u-form-item>
						<u-form-item :label-position="labelPosition" label="新密码" prop="password" label-width="100">
							<u-input
								:password-icon="true"
								:border="border"
								type="password"
								v-model="form.password"
								placeholder="请输入新密码"
							></u-input>
						</u-form-item>
						<u-form-item :label-position="labelPosition" label="新密码" prop="passwordAgain" label-width="100">
							<u-input
								:password-icon="true"
								:border="border"
								type="password"
								v-model="form.passwordAgain"
								placeholder="请输入新密码"
							></u-input>
						</u-form-item>
					</u-form>
				</view>
				<view v-else>
					<u-input
						v-model="value"
						type="textarea"
						placeholder="请输入"
						:border="border"
						:height="height"
						:auto-height="autoHeight"
						:clearable="clearable"
						class="text"
					/>
				</view>
			</view>
			<u-button @click="submit" size="default" class="btn">更改</u-button>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			user: {},
			type: '',
			value: '',
			border: false,
			height: 200,
			autoHeight: true,
			clearable: false,
			form: {
				oldPassword: '',
				password: '',
				passwordAgain: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						min: 8,
						message: '长度需大于8',
						trigger: 'blur'
					},
					{
						pattern: '/^[0-9a-zA-Z]*$/g',
						// 正则检验前先将值转为字符串
						transform(value) {
							return String(value);
						},
						message: '只能包含数字和字母'
					}
				]
			},
			border: false,
			labelPosition: 'left',
			res: {}
		};
	},
	onReady() {
		if (this.type == 'password') {
			this.$refs.uFormSet.setRules(this.rules);
		}
	},
	onLoad(option) {
		// 在这里获取到应该修改什么的type
		this.type = option.type;
		this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));

		if (this.type == 'intro') {
			this.value = this.user.intro;
		} else if (this.type == 'phonenumber') {
			this.value = this.user.phonenumber;
		} else if (this.type == 'email') {
			this.value = this.user.email;
		}
	},

	methods: {
		async submit() {
			if (this.type == 'password') {
				if (this.form.password != this.form.passwordAgain) {
					uni.showToast({
						duration: 800,
						title: '两次密码输入不同',
						icon: 'none'
					});
					return;
				}
				let reg = /^[0-9a-zA-Z]*$/g;
				let judge = reg.exec(this.form.password);
				if (!judge) {
					console.log('reg error', judge);
					uni.showToast({
						duration: 800,
						title: '密码只能包含数字和字母',
						icon: 'none'
					});
					return;
				} else {
					console.log('两次密码输入正确');
					// 在这里进行密码的远程修改
					this.res = await this.$u.api.changePwd({
						newPassword: this.form.password,
						oldPassword: this.form.oldPassword
					});
					// console.log('res:',res)
				}
			} else if (this.type == 'phonenumber') {
				// 还需要加一个正则判断是否合规
				let reg = /^1[0-9]{10}$/g;
				let judge = reg.exec(this.value);
				if (!judge) {
					console.log('reg error', judge);
					uni.showToast({
						duration: 800,
						title: '手机号格式错误',
						icon: 'none'
					});
					return;
				} else {
					this.res = await this.$u.api.changePhoneNumber(`phoneNumber=${this.value}`, {
						phoneNumber: this.value
					});
				}
			} else if (this.type == 'email') {
				// 还需要加一个正则判断是否合规
				let reg = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
				let judge = reg.exec(this.value);
				if (!judge) {
					console.log('reg error', judge);
					uni.showToast({
						duration: 800,
						title: '邮箱格式错误',
						icon: 'none'
					});
					return;
				} else {
					this.res = await this.$u.api.changeEmail(`email=${this.value}`, {
						email: this.value
					});
				}
			}
			if (this.res.code == 500) {
				uni.showToast({
					duration: 1000,
					title: this.res.msg,
					icon: 'none'
				});
				return;
			} else {
				uni.showToast({
					duration: 1000,
					title: '操作成功',
					icon: 'none',
					success: () => {
						// 其实实际决定显示时间的是下面的500.而不是上面的1000
						setTimeout(() => {
							uni.navigateBack();
						}, 500);
					}
				});
			}
			console.log('信息更改：', this.type);
			let val = this.value;
			this.$store.commit('updateUser', {
				type: this.type,
				val: val
			});
			// 触发用户信息更新
			uni.$emit('updateUser');
			// 这里使用history主要是因为浏览器刷新之后，页面栈就消失了
			// // #ifdef H5
			// history.back();
			// // #endif

			// // #ifndef H5
			// uni.navigateBack({});
			// // #endif
		}
	}
};
</script>

<style lang="scss" scoped="scoped">
.main {
	background-color: #f4f5f6;
	height: 100vh;

	.see {
		background-color: #fff;
		padding: 20rpx 0;

		.user {
			margin: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.username {
				margin-left: 20rpx;
				color: #6699ff;
			}
		}

		.edit {
			margin: 0 20rpx;

			.theme {
				margin: 20rpx 0;
				display: flex;
				justify-content: space-between;
			}

			.text {
			}

			.uploadimg {
				margin-left: -5rpx;
			}
		}

		.btn {
			margin: 40rpx 20rpx;
		}
	}
}
</style>
