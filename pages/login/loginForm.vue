<template>
	<view>
		<u-navbar :is-back="false" title="登录" :background="background"></u-navbar>
		<view class="u-demo-area u-flex u-row-center logo">
			<u-image :src="src" shape="square" class="u-row-center" width="200" height="200"></u-image>
		</view>
		<h2 class="name">I-Do实习管理</h2>
		<view class="input">
			<u-form :model="form" ref="uForm">
				<u-form-item :label-position="labelPosition" label="账号" prop="name" label-width="100">
					<u-input :border="border" placeholder="请输入账号" v-model="form.name" type="text"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="密码" prop="password" label-width="100">
					<u-input
						:password-icon="true"
						:border="border"
						type="password"
						v-model="form.password"
						placeholder="请输入密码"
					></u-input>
				</u-form-item>
			</u-form>
			<view class="btn">
				<u-button @click="login" size="medium">登录</u-button>
				<u-button @click="register" size="medium">注册</u-button>
			</view>
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
				password: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '请正确输入账号',
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						min: 6,
						message: '需同时包含数字和字母，长度大于8',
						trigger: 'blur'
					}
				]
			},
			border: false,
			labelPosition: 'left',
			result: {},
			src: 'https://www.uviewui.com/common/logo.png',
			background: {
				backgroundColor: '#fff'
			}
		};
	},

	async onLoad(option) {
		console.log('option',option);
		// 这里获取的是从注册页面或者退出登录按钮退出的用户名
		this.form.name = option.loginName
		// 如果不是从注册页面或退出登录跳转过来的
		if(!this.form.name){
			let loginParam = this.$store.getters.getStorageLogin
			this.form.name = loginParam.username;
			this.form.password = loginParam.password
			let token = this.$store.getters.getStorageToken
			console.log('token存在吗:',token)
			if(token){
				uni.switchTab({
					url: '/pages/home/home'
				});
			}
		}
		
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		async login() {
			// 因为uniapp不支持formdata，所以只能自己手动拼接
			// let {username,password} = ...this.form
			let username = this.form.name;
			let password = this.form.password;
			let param = {
				username: username,
				password: password
			};
			// 登录得到token
			let data = await this.$u.api.login(param);
			console.log('token', data);
			// 存储token
			this.$store.commit('setToken', data.token);
			// 将用户的信息存到缓存中去
			this.$store.commit('setLogin', param);
			// 将token放在请求头的认证字段里面得到user信息
			let userinfo = await this.$u.api.getUserinfo();
			console.log('userinfo', userinfo);
			// 存储user的信息
			this.$store.commit('setIdentity',userinfo.identity || {})
			this.$store.commit('setUser', this.$u.deepClone(userinfo.user || {}));
			// 可能后面会变，这里是因为admin登录的时候会是一个数组，其他的就只是一个字段了
			let roles = this.$u.deepClone(userinfo.roles[0] || '');
			this.$store.commit('updateUser', {
				type: 'roles',
				val: roles
			});
			if (userinfo.user.avatar == '') {
				this.$store.commit('updateUser', {
					type: 'avatar',
					val: this.src
				});
			} else {
				this.$store.commit('updateUser', {
					type: 'avatar',
					val: this.$store.state.projectIp + userinfo.user.avatar
				});
			}

			// uni.setStorageSync('user', userinfo.user);
			// 根据是否获得了token 跳转页面
			if (data.token) {
				uni.switchTab({
					url: '/pages/home/home'
				});
			} else {
				uni.showToast({
					title: '账户或密码错误',
					duration: 1000,
					icon: 'none'
				});
			}
		},
		register() {
			// 这里是跳转到企业用户注册的页面
			uni.navigateTo({
				url: '/pages/login/register'
			});
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
	margin: 100rpx 0;
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
