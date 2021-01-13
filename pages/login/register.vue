<template>
	<view>
		<u-navbar :is-back="false" title="注册" :background="background"></u-navbar>
		<!-- <view class="u-demo-area u-flex u-row-center logo">
			<u-image :src="src" shape="square" class="u-row-center" width="200" height="200"></u-image>
		</view> -->
		<h2 class="name">I-Do实习管理</h2>
		<view class="input">
			<u-form :model="form" ref="uForm">
				<u-form-item :label-position="labelPosition" label="姓名" prop="name" label-width="100">
					<u-input :border="border" placeholder="请输入姓名" v-model="form.name" type="text"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="工号" prop="jobNumber" label-width="100">
					<u-input :border="border" placeholder="请输入工号" v-model="form.jobNumber" type="text"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="注册码" prop="registerCode" label-width="100">
					<u-input
						:password-icon="true"
						:border="border"
						type="text"
						v-model="form.registerCode"
						placeholder="请输入注册码"
					></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="邮箱" prop="email" label-width="100">
					<u-input :border="border" placeholder="请输入邮箱" v-model="form.email" type="text"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="手机号" prop="phoneNumber" label-width="100">
					<u-input :border="border" placeholder="请输入手机号" v-model="form.phoneNumber" type="text"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="密码" prop="password" label-width="100">
					<u-input :border="border" placeholder="请输入密码" v-model="form.password" type="password"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="重复密码" prop="repassword" label-width="150">
					<u-input :border="border" placeholder="请再次输入密码" v-model="form.repassword" type="password"></u-input>
				</u-form-item>
			</u-form>
			<u-button @click="reg" class="btn">注册</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: '',
			form: {
				name: '',
				jobNumber: '',
				email: '',
				phoneNumber: '',
				registerCode: '',
				password: '',
				repassword: ''
			},
			rules: {
				// registerCode: [
				// 	{
				// 		required: true,
				// 		message: '请输入注册码',
				// 		trigger: 'blur'
				// 	}
				// ],
				email: [
					{
						required: true,
						message: '必填字段',
						trigger: 'blur'
					},
					// 正则判断邮箱
					{
						pattern: /^[a-zA-Z0-9.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
						// 正则检验前先将值转为字符串
						transform(value) {
							return String(value);
						},
						message: '请正确填写邮箱'
					}
				],
				phoneNumber: [
					{
						required: true,
						message: '必填字段',
						trigger: 'blur'
					},
					// 正则判断手机号
					{
						pattern: /^1[0-9]{10}$/g,
						// 正则检验前先将值转为字符串
						transform(value) {
							return String(value);
						},
						message: '请正确填写手机号'
					}
				]
			},
			border: false,
			labelPosition: 'left',
			result: {},
			src: 'https://www.uviewui.com/common/logo.png',
			background: {
				backgroundColor: '#fff'
			},
			loginName: ''
		};
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		// 对注册码和工号进行查询和自动登录
		async reg() {
			// 对输入进行验证
			let validate = true;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					console.log('验证通过');
				} else {
					console.log('验证失败');
					validate = false;
				}
			});
			if (!validate) {
				return;
			}
			// 在这里对用户的输入进行规则验证
			let verify = this.verification();
			if (!verify) {
				return;
			}
			let params = {
				email: this.form.email,
				nickName: this.form.name,
				number: this.form.jobNumber,
				password: this.form.password,
				phoneNumber: this.form.phoneNumber,
				regCode: this.form.registerCode,
				sex: 2
			};
			let res = await this.$u.api.register(params);
			console.log('res', res);
			if (res.code == 200) {
				this.loginName = 'w' + this.form.phoneNumber;
				uni.showToast({
					duration: 1000,
					title: res.msg,
					icon: 'none',
					success: () => {
						setTimeout(() => {
							this.$u.route({
								// type: 'back',
								url:'pages/login/loginForm',
								params: {
									loginName: this.loginName
								}
							});
						}, 1000);
					}
				});
			} else {
				uni.showToast({
					duration: 1000,
					title: res.msg,
					icon: 'none'
				});
			}
		},

		verification() {
			let verify = true;
			// 用来验证密码是否正确
			if (this.form.password != this.form.repassword) {
				uni.showToast({
					duration: 800,
					title: '两次密码输入不同',
					icon: 'none'
				});
				verify = false;
				return verify;
			}
			let reg = /^[0-9a-zA-Z]*$/g;
			let judge = reg.exec(this.form.password);
			if (!judge) {
				console.log('reg error', judge);
				uni.showToast({
					duration: 800,
					title: '密码只能包含数字和字母且不含特殊字符',
					icon: 'none'
				});
				verify = false;
				return verify;
			}
			return verify;
		}
	}
};
</script>

<style lang="scss" scoped>
.logo {
	margin-top: 100rpx;
}

.name {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 50rpx 0;
}

.input {
	margin: 0 100rpx;

	.btn {
		margin: 40rpx 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
}
</style>
