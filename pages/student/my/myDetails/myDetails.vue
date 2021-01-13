<template>
	<view>
		<u-navbar title="个人信息" :background="background"></u-navbar>

		<u-cell-item title="头像" @click="chooseAvatar">
			<u-avatar :src="user.avatar" size="120"></u-avatar>
		</u-cell-item>
		<!-- <u-cell-item title="简介" @click="changeIntro('intro')">{{ user.intro }}</u-cell-item> -->

		<u-cell-item title="性别" @click="show = true">{{ genderList[user.sex] }}</u-cell-item>
		<!-- 用来选择性别 -->
		<u-select v-model="show" :list="list" @confirm="select"></u-select>
		<u-cell-group v-if="roles == 'student'">
			<u-cell-item title="学号" :arrow="false">{{ identity.number }}</u-cell-item>
			<u-cell-item title="专业" :arrow="false">{{ identity.major }}</u-cell-item>
			<u-cell-item title="企业" v-model="enterprise" v-if="enterprise != null && enterprise != 0" :arrow="false">{{ enterprise }}</u-cell-item>
			<!-- <u-cell-item title="指导老师" :arrow="false">{{ user.teacher }}</u-cell-item> -->
			<u-dropdown v-else>
				<u-dropdown-item title="选择企业" :options="enterpriseList" @change="enterpriseChange"></u-dropdown-item>
			</u-dropdown>
		</u-cell-group>

		<u-cell-group v-else-if="roles == 'worker'">
			<u-cell-item title="企业" :arrow="false">{{ enterprise }}</u-cell-item>
			<u-cell-item title="工号" :arrow="false">{{ identity.number }}</u-cell-item>
		</u-cell-group>
		
		<view>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#fff'
				},
				user: {},
				identity: {},
				show: false,
				genderList: ['男', '女'],
				list: [{
						value: '1',
						label: '男'
					},
					{
						value: '2',
						label: '女'
					}
				],
				roles: '',
				avatar: 'https://uviewui.com/common/logo.png',
				enterprise: null,
				enterpriseList: []
			};
		},
		onLoad(option) {
			// console.log(option);
			this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
			this.roles = this.user.roles;
			this.identity = JSON.parse(JSON.stringify(this.$store.state.identity));
			this.getEnterprise(this.identity.enterpriseId);
		},
		created() {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.user.avatar = path;
				// 可以在此上传到服务端
				let token = this.$store.state.token || uni.getStorageSync('token');
				// 这是uniapp自带的上传，所以特殊处理
				uni.uploadFile({
					url: 'http://b.ido.hpjpw.com/prod-api/system/user/profile/avatar',
					filePath: path,
					name: 'avatarfile',
					header: {
						Authorization: token
					},
					complete: res => {
						// console.log('upload res', res);
						let data = JSON.parse(res.data);
						console.log('res.data', data);
						if (data.code == 401) {
							// 假设401为token失效，这里跳转登录
							this.$u.toast('验证失败，请重新登录');
							setTimeout(() => {
								// 此为uView的方法，详见路由相关文档
								this.$u.route('/pages/login/loginForm');
							}, 1500);
							return false;
						}
						let avatarUrl = this.$store.state.projectIp + data.imgUrl;
						this.$store.commit('updateUser', {
							type: 'avatar',
							val: avatarUrl
						});
						this.user.avatar = avatarUrl;
						// 触发一个更新头像的事件，与tabber的我的界面进行通信
						uni.$emit('updateAvatar')
					}
				});
			});
		},
		methods: {
			async getEnterprise(id) {
				if (id != null) {
					let response = await this.$u.api.getEnterprise(id);
					this.enterprise = response.data.name;
				}else{
					this.getEnterpriseList();
				}

			},
			chooseAvatar() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg'
					}
				});
			},
			changeIntro(type) {
				this.$u.route({
					url: '/pages/student/my/myDetails/changeIntro',
					params: {
						type: type
					}
				});
			},
			select(e) {
				// 选择性别的结果
				let sexnum = parseInt(e[0].value) - 1
				this.user.sex = sexnum;
				this.$store.commit('updateUser', {
					type: 'sex',
					val: sexnum
				})
				this.$u.api.changeSex(`sex=${sexnum}`, {
					sex: sexnum
				})
			},
			// 获取企业列表
			async getEnterpriseList() {
				this.clearEnterpriseList();
				let response = await this.$u.api.getEnterpriseList();
				if (response.rows != null ) {
					for (var i = 0; i < response.rows.length; i++) {
						let enterprise = {};
						// 下拉菜单绑定属性
						enterprise.label = response.rows[i].name;
						enterprise.value = response.rows[i].id;
						this.enterpriseList.push(enterprise);
					}
				}
			},
			// 清理现有企业列表
			clearEnterpriseList() {
				this.enterpriseList = [];
			},
			// 选择企业
			async enterpriseChange(value) {
				let code = false;
				let response = await this.$u.api.selectEnterprise(value);
				if (response.code == 200) {
					this.getEnterprise(value);
					this.identity.enterpriseId = value;
					this.$store.commit('setIdentity',this.identity)
					code = true;
				}
				this.showToast(code);
			},
			// 选择企业消息提示
			showToast(code) {
				if (code) {
					this.$refs.uToast.show({
						title: '选择企业成功',
						type: 'success',
					})
				} else {
					this.$refs.uToast.show({
						title: '选择企业失败',
						type: 'error',
					})
				}
			}

		}
	};
</script>

<style lang="scss" scoped></style>
