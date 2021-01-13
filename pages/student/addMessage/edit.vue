<template>
	<view class="main">
		<u-navbar :title="list[type] + '编辑'"></u-navbar>
		<view class="see">
			<view class="user">
				<u-avatar :src="user.avatar"></u-avatar>
				<view class="username">{{ user.nickName }}</view>
			</view>
			<view class="edit">
				<u-input
					v-model="value"
					type="textarea"
					placeholder="这一刻的想法..."
					:border="border"
					:height="height"
					:auto-height="autoHeight"
					:clearable="clearable"
					class="text"
				/>

				<view class="theme" v-if="type == 0">
					携带本周主题：{{ theme }}
					<u-checkbox-group>
						<u-checkbox v-model="item.checked" v-for="(item, index) in radioList" :key="index" :name="item.name">
							{{ item.name }}
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="uploadimg">
					<u-upload
						:action="action"
						:auto-upload="false"
						ref="uUpload"
						max-count="2"
						:header="header"
						:show-progress="showProgress"
					></u-upload>
				</view>
			</view>

			<u-button @click="submit" size="default" class="btn">发表</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {
				time: 12,
				avatar: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
				name: 'I-Do'
			},
			list: ['加油站', '撕逼墙'],
			type: 0,
			value: '',
			border: false,
			height: 200,
			autoHeight: true,
			clearable: false,
			showProgress: false,
			action: 'http://b.ido.hpjpw.com/prod-api/ido/file/upload',
			fileList: [
				{
					url: ''
				}
			],
			header: {},
			theme: '最佳礼仪',
			radioList: [
				{
					name: '',
					checked: false,
					disabled: false
				}
			],
			radio: ''
		};
	},
	onLoad(option) {
		console.log('op', option);
		this.type = option.index;
		// 简单的进行了一下简易深拷贝，因为uniapp自己的问题，会直接能修改vuex里面存取的数据
		this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
		// console.log(this.user)
		if (this.type == 1) {
			this.user.avatar = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1305454818,873736954&fm=26&gp=0.jpg';
			this.user.nickName = '匿名';
		}
		// 这里是为了上传图片的时候能够够携带一个token
		let token = this.$store.state.token || uni.getStorageSync('token');
		this.header.Authorization = token;
	},

	methods: {
		submit() {
			console.log(this.$refs.uUpload.lists);
			this.$refs.uUpload.upload();
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
