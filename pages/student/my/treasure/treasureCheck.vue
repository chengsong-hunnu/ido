<template>
	<view class="wrap">
		<u-navbar title="实习宝藏审核"></u-navbar>
		<!-- 关联学生折叠面板 -->
		<view class="demo-relate">
			<view class="button-relate">
				<u-action-sheet :list="studentReleasableList" v-model="showRelate" @click="relateStudent"></u-action-sheet>
				<u-button type="default" size="mini" ripple style="font-size: 28rpx; margin-right: 50rpx;" @click="showRelate = true">关联学生</u-button>
				<u-action-sheet :list="studentRelatedList" v-model="showRelated"></u-action-sheet>
				<u-button type="default" size="mini" ripple style="font-size: 28rpx; margin-right: 50rpx;" @click="showRelated = true">已关联学生</u-button>
				<u-action-sheet :list="studentRelatedList" v-model="showCancel" @click="cancelRelateStudent"></u-action-sheet>
				<u-button type="default" size="mini" ripple style="font-size: 28rpx;" @click="showCancel = true">取消关联学生</u-button>
			</view>
			<view>
				<u-toast ref="uToast" />
			</view>
		</view>
		<u-waterfall v-model="flowList" ref="uWaterfall">
			<template v-slot:left="{leftList}">
				<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
					<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
					<view class="demo-name">
						{{item.taskName}}
					</view>
					<view>
						<u-icon :label="item.student" size="40" :name="item.avatar" width="20px"></u-icon>
					</view>
					<view class="demo-button">
						<u-button type="default" size="mini" @click="submit(item)">详情展示</u-button>
					</view>
				</view>
			</template>

			<template v-slot:right="{rightList}">
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
					<view class="demo-name">
						{{item.taskName}}
					</view>
					<view>
						<u-icon :label="item.student" size="40" :name="item.avatar" width="20px"></u-icon>
					</view>
					<view class="demo-button">
						<u-button type="default" size="mini" @click="submit(item)">详情展示</u-button>
					</view>
				</view>
			</template>
		</u-waterfall>
		<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="reachBottom"></u-loadmore>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showRelate: false,
				showCancel: false,
				showRelated: false,
				loadStatus: 'nomore',
				flowList: [],
				taskRecordList: [],
				studentReleasableList: [],
				studentRelatedList: [],
				relateStudentId: 0,
				cancelRelateStudentId: 0,
			}
		},
		onLoad() {
			this.getStudentReleasableList();
			this.getStudentRelatedList();
			this.getTaskRecordList();
		},
		methods: {
			/* 关联学生 */
			// 获取可关联学生列表
			async getStudentReleasableList() {
				this.clearStudentReleasableList();
				// 获取可关联学生列表
				let response = await this.$u.api.getReleasableStudentList();
				if (response.rows != null) {
					for (var i = 0; i < response.rows.length; i++) {
						let student = {};
						student.id = response.rows[i].userId;
						student.name = response.rows[i].name;
						student.text = student.name
						this.studentReleasableList.push(student);
					}
				}

			},
			// 清空可关联学生列表
			clearStudentReleasableList() {
				this.studentReleasableList = [];
			},
			// 获取已关联学生列表
			async getStudentRelatedList() {
				this.clearStudentRelatedList();
				// 获取已关联学生列表
				let response = await this.$u.api.getRelatedStudentList();
				if (response.rows != null) {
					for (var i = 0; i < response.rows.length; i++) {
						let student = {};
						student.id = response.rows[i].userId;
						student.name = response.rows[i].name;
						student.text = student.name
						this.studentRelatedList.push(student);
					}
				}

			},
			// 清空已关联学生列表
			clearStudentRelatedList() {
				this.studentRelatedList = [];
			},
			// 点击事件，关联学生
			async relateStudent(index) {
				let studentId = this.studentReleasableList[index].id;
				let res = await this.$u.api.relateStudent(studentId);
				let code = true;
				if (res.code != 200) {
					code = false;
				}
				this.showToast(0, code);
			},
			// 点击事件，取消关联学生
			async cancelRelateStudent(index) {
				let studentId = this.studentReleasableList[index].id;
				let res = await this.$u.api.cancelRelateStudent(studentId);
				let code = true;
				if (res.code != 200) {
					code = false;
				}
				this.showToast(1, code);
			},
			showToast(buttonId, code) {
				if (buttonId === 0) {
					if (code) {
						this.$refs.uToast.show({
							title: '关联成功',
							type: 'success',
						})
					} else {
						this.$refs.uToast.show({
							title: '关联失败',
							type: 'error',
						})
					}
				} else {
					if (code) {
						this.$refs.uToast.show({
							title: '取消关联成功',
							type: 'success',
						})
					} else {
						this.$refs.uToast.show({
							title: '取消关联失败',
							type: 'error',
						})
					}
				}
				// 点击事件后重新获取已关联学生列表
				this.getStudentRelatedList();
			},
			/* 瀑布流内容 */
			// 获取任务记录列表
			async getTaskRecordList() {
				this.clearTaskRecordList();
				// 获取任务记录列表
				let response = await this.$u.api.getTaskRecordListInCheck();
				if (response.rows != null) {
					for (var i = 0; i < response.rows.length; i++) {
						let task = {};
						task.taskRecordId = response.rows[i].id;
						task.taskId = response.rows[i].taskId;
						task.studentId = response.rows[i].studentId;
						if (response.rows[i].studentAvatar == "") {
							task.avatar = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/github.svg';
						} else {
							task.avatar = response.rows[i].studentAvatar;
						}
						task.student = response.rows[i].studentNickName;
						task.taskName = response.rows[i].taskName;
						this.taskRecordList.push(task);
					}
				}
				this.addData();
			},
			// 将taskRecordList值添加进瀑布流对象中被页面调用
			addData() {
				if (this.taskRecordList != null) {
					for (let i = 0; i < this.taskRecordList.length; i++) {
						// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
						let item = JSON.parse(JSON.stringify(this.taskRecordList[i]))
						this.flowList.push(item);
					}
				}

			},
			// 清空任务记录列表
			clearTaskRecordList() {
				this.taskRecordList = [];
			},
			// 按钮点击事件，转向任务详情页
			submit(item) {
				this.$u.route({
					url: '/pages/student/my/treasure/taskDescribe',
					params: {
						taskRecordId: item.taskRecordId,
					}
				});
			},
			// 清理所有瀑布流对象
			clear() {
				this.$refs.uWaterfall.clear();
			},
			// 点击加载更多按钮事件
			reachBottom() {
				this.loadStatus = 'loading';
				this.clear();
				this.getTaskRecordList();
				this.loadStatus = 'nomore';
			},
		}
	}
</script>

<style>
	/* page不能写带scope的style标签中，否则无效 */
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="scss" scoped>
	.demo-relate {
		background-color: #ffffff;
		text-align: center;
		// position: relative;
	}

	.button-relate {
		padding: 20rpx;
	}

	.button-cancel {
		margin: 20rpx;
	}

	.demo-warter {
		border-radius: 20rpx;
		margin: 18rpx;
		background-color: #ffffff;
		padding: 18rpx;
		position: relative;
	}

	.demo-name {
		font-size: 30rpx;
		margin-top: 5rpx;
		color: $u-main-color;
	}

	.demo-button {
		margin-top: 20rpx;
		text-align: center;
	}
</style>
