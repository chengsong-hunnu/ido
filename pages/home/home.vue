<template>
	<!-- 首页主页面 -->
	<view>
		<u-navbar :is-back="false" title="首页"></u-navbar>
		<view class="wrap">
			<u-swiper :list="list" :title="true"></u-swiper>
		</view>
		<view class="">
			<u-dropdown>
				<u-dropdown-item v-model="value1" title="地区" :options="areaList" @change="areaChange"></u-dropdown-item>
				<u-dropdown-item v-model="value2" title="企业" :options="enterpriseMenuList" @change="enterpriseChange"></u-dropdown-item>
			</u-dropdown>
		</view>

		<view class="hotel" v-for="(data,index) in enterpriseList" :key='data.image'>
			<image :src="data.image" mode="aspectFill" class="img"></image>

			<view class="content">
				<view class="hotel-name">{{data.name}}</view>
				<view class="address">
					<u-icon name="map" color="#2979ff" size="28"></u-icon>
					{{' '+data.address}}
				</view>
				<view class="address">
					<u-icon name="grid" color="#2979ff" size="28"></u-icon>
					{{' '+data.address}}
				</view>


			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图数量
				carouselMapNum: 3,
				// 轮播图列表
				list: [],
				// 企业列表
				enterpriseList: [],
				// 企业菜单列表
				enterpriseMenuList: [],
				// 选定公司ID
				enterpriseId: 0,
				// 选定地区ID
				areaId: 0,
				// 地区列表
				areaList: [],

				// 地区和企业对应值
				value1: 1,
				value2: 2,
			}
		},
		onLoad() {
			this.getCarouselMap();
			this.getEnterpriseList();
			this.getAreaList();
		},
		methods: {
			// 获取轮播图内容
			async getCarouselMap() {
				for (var i = 1; i <= this.carouselMapNum; i++) {
					let responseImg = await this.$u.api.getCarouselMap(this.$store.state.key + i + ".url");
					let responseTitle = await this.$u.api.getCarouselMap(this.$store.state.key + i + ".name");
					let list = {};
					list.image = responseImg.msg;
					list.title = responseTitle.msg;
					this.list.push(list);
				}
			},
			// 获取企业列表
			async getEnterpriseList() {
				this.clearEnterpriseList();
				this.clearEnterpriseMenuList();
				// 最初加载时地区ID和企业ID都为0，加载所有
				// 仅地区ID不为0时即为选中地区ID加载
				// 仅企业ID不为0时即为选中企业ID加载
				let response = [];
				if (this.areaId == 0 && this.enterpriseId == 0) {
					response = await this.$u.api.getEnterpriseList();
				} else if (this.areaId != 0 && this.enterpriseId == 0) {
					response = await this.$u.api.getEnterpriseArea(this.areaId);
				} else {
					response = await this.$u.api.getEnterprise(this.enterpriseId);
				}
				if (this.enterpriseId == 0) {
					for (var i = 0; i < response.rows.length; i++) {
						let enterprise = {};
						enterprise.name = response.rows[i].name;
						enterprise.phone = response.rows[i].phone;
						enterprise.areaId = response.rows[i].areaId;
						enterprise.address = response.rows[i].address;
						enterprise.email = response.rows[i].email;
						enterprise.image = response.rows[i].imgUrl;
						if (enterprise.image == null) {
							enterprise.image = 'https://cdn.uviewui.com/uview/swiper/1.jpg';
						}
						let enterpriseMenu = {};
						// 下拉菜单绑定属性
						enterpriseMenu.label = enterprise.name;
						enterpriseMenu.value = response.rows[i].id;
						this.enterpriseMenuList.push(enterpriseMenu);
						this.enterpriseList.push(enterprise);
					}
				}
				// 按企业ID查找返回值不同
				else{
					let enterprise = {};
					enterprise.name = response.data.name;
					enterprise.phone = response.data.phone;
					enterprise.areaId = response.data.areaId;
					enterprise.address = response.data.address;
					enterprise.email = response.data.email;
					enterprise.image = response.data.imgUrl;
					if (enterprise.image == null) {
						enterprise.image = 'https://cdn.uviewui.com/uview/swiper/1.jpg';
					}
					let enterpriseMenu = {};
					// 下拉菜单绑定属性
					enterpriseMenu.label = enterprise.name;
					enterpriseMenu.value = response.data.id;
					this.enterpriseMenuList.push(enterpriseMenu);
					this.enterpriseList.push(enterprise);
				}
				this.addAllEnterprise();
				// 恢复企业ID和地区ID为0
				this.enterpriseId = 0;
				this.areaId = 0;
			},
			// 在现有企业下拉框最末增加显示所有企业
			addAllEnterprise() {
				let enterprise = {};
				enterprise.label = "显示所有企业";
				enterprise.value = 0;
				this.enterpriseMenuList.push(enterprise);
			},
			// 清理现有企业列表
			clearEnterpriseList() {
				this.enterpriseList = [];
			},
			// 清理现有企业菜单列表
			clearEnterpriseMenuList() {
				this.enterpriseMenuList = [];
			},
			// 获取地区列表
			async getAreaList() {
				let response = await this.$u.api.getAreaList();
				for (var i = 0; i < response.rows.length; i++) {
					let area = {};
					area.id = response.rows[i].id;
					area.name = response.rows[i].name;
					// 下拉菜单绑定属性
					area.label = area.name;
					area.value = area.id;
					this.areaList.push(area);
				}
			},
			// 具体地区选择时刷新企业列表
			areaChange(value) {
				this.areaId = value;
				this.getEnterpriseList();
			},
			// 具体企业选择时刷新企业列表
			enterpriseChange(value) {
				this.enterpriseId = value;
				this.getEnterpriseList();
			},

		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		margin: 30rpx;
	}

	.hotel {
		margin: 20rpx;
		display: flex;
		justify-content: space-around;

		.img {
			width: 300rpx;
			height: 200rpx;
			border-radius: 10rpx;
		}

		.content {
			width: 300rpx;
			// flex-grow: 1;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;

			.hotel-name {
				text-align: center;
				font-weight: 600;
				color: #007AFF;
			}

			.address {
				margin-top: 20rpx;
			}
		}
	}
</style>
