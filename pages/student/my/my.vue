<template>
	<view>
		<u-navbar :is-back="false" title="我的"></u-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30" @click="myDetail(user.roles)">
			<view class="u-m-r-10"><u-avatar :src="user.avatar" size="140"></u-avatar></view>
			<view class="u-flex-1 u-m-l-20">
				<view class="u-font-15 u-p-b-20">{{ user.nickName }}</view>
				<!-- <view class="u-font-14 u-tips-color">{{user.intro}}</view> -->
			</view>
			<view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view>
		</view>

		<view v-if="user.roles == 'student'">
			<view class="u-m-t-20">
				<!-- <u-cell-group><u-cell-item icon="file-text" title="简历"></u-cell-item></u-cell-group> -->
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<!-- <u-cell-item icon="clock" title="实习申请"></u-cell-item> -->
					<u-cell-item icon="grid" title="实习宝藏" @click="treasure"></u-cell-item>
					<!-- <u-cell-item icon="coupon" title="实习回忆录"></u-cell-item>
					<u-cell-item icon="heart" title="实习证书"></u-cell-item> -->
				</u-cell-group>
			</view>
		</view>
		<view v-else-if="user.roles == 'teacher'">
			<view class="u-m-t-20">
				<u-cell-group>
					<!-- <u-cell-item icon="grid" title="我的学生"></u-cell-item>
					<u-cell-item icon="grid" title="联系I-Do"></u-cell-item> -->
				</u-cell-group>
			</view>
		</view>
		<view v-else-if="user.roles == 'worker'">
			<view class="u-m-t-20">
				<!-- <u-cell-group><u-cell-item icon="file-text" title="简历审核"></u-cell-item></u-cell-group> -->
			</view>
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="grid" title="实习宝藏审核" @click="treasureCheck"></u-cell-item>
					<!-- <u-cell-item icon="grid" title="我的企业"></u-cell-item> -->
				</u-cell-group>
			</view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- <u-cell-item icon="grid" title="联系I-Do"></u-cell-item> -->
				<u-cell-item icon="setting" title="设置" @click="changeSet"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {},
			pic: 'https://uviewui.com/common/logo.png',
			show: true
		};
	},
	onLoad() {
		// 干脆这里不进行深克隆了，因为修改头像的时候，这里只能通过事件监听获取，有些麻烦,想了想还是算了，这就不符合设计理念了
		this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
		console.log('ava')
	},
	onShow() {
		// 每一次显示都监听一下是否更新了用户信息，如果有的话就重新获取用户最新的内容
		uni.$on('updateAvatar',res=>{
			this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
		})
	},
	methods: {
		myDetail(roles) {
			// 跳转到我的详细资料界面
			uni.navigateTo({
				url: `./myDetails/myDetails`
			});
		},
		changeSet() {
			let roles = this.user.roles;
			uni.navigateTo({
				url: `set/set?roles=${roles}`
			});
		},
		treasure() {
			uni.navigateTo({
				url: 'treasure/treasure'
			});
		},
		treasureCheck() {
			uni.navigateTo({
				url: 'treasure/treasureCheck'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f8f8f8;
}

.camera {
	width: 54px;
	height: 44px;

	&:active {
		background-color: #ededed;
	}
}

.user-box {
	background-color: #fff;
}
</style>
