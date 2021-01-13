<template>
	<view>
		<u-navbar title="实习宝藏"></u-navbar>
		<view class="stars">
			<view class="mystar">
				我的
				<u-icon name="star-fill" color="#2979ff" size="28"></u-icon>
				：{{ myStars }}
			</view>
			<!-- <button type="primary" size="mini">排行</button> -->
			<!-- <view class="mybtn"><u-button size="mini" @click="rank">排行</u-button></view> -->
		</view>
		<view class="u-m-t-20 u-m-b-10">
			<u-cell-group>
				<u-cell-item
					v-for="(status, index) in taskStatus"
					:title="status"
					@click="record(index)"
					:key="index"
				></u-cell-item>
			</u-cell-group>
		</view>
		<u-cell-group v-for="(item, index) in list" :key="index" class="tasklist" :border="false">
			<!-- 用星星数表示难度 -->
			<view class="diff" v-if="item.length != 0">
				<u-rate :current="index + 1" :disabled="true" :active-color="color"></u-rate>
			</view>

			<u-cell-item
				v-for="(task, idx) in item"
				:title="task.name"
				:value="''"
				:key="idx"
				@click="submitTask(task.id)"
				class="task"
			>
				<!-- <u-icon slot="icon" size="32" name="search"></u-icon> -->
				<u-icon
					slot="icon"
					:name="task.star + 'xing'"
					custom-prefix="custom-icon"
					size="40"
					color="#888888"
					:label="' '"
					:margin-left="20"
				></u-icon>
			</u-cell-item>
		</u-cell-group>
		<u-popup v-model="show" mode="center" border-radius="14" width="500rpx" height="300rpx">
			<view class="receive">
				<view class="title">是否领取本任务</view>
				<view class="btn">
					<u-button size="medium" type="primary" @click="cancel">取消</u-button>
					<u-button size="medium" type="primary" @click="down">确认</u-button>
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
			// 预设5个难度的数组
			list: [[], [], [], [], []],
			color: '#02b8fa',
			myStars: 21,
			show: false,
			taskRecord: [[], [], [], [], []],
			taskStatus: ['进行中', '审核中', '已完成'],
			clickTaskId: -1
		};
	},
	async onLoad() {
		this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
		uni.showLoading({
			title: '正在获取'
		});
		// let taskRecord = await this.$u.api.getTaskRecord();
		let list = await this.$u.api.getTaskList();
		uni.hideLoading();

		let myStar = await this.$u.api.getStarnum()
		this.myStars = myStar.num
		let tasks = list.rows;
		// console.log('record', taskRecord);
		// this.taskRecord = taskRecord.rows;
		console.log(list);
		tasks.forEach(task => {
			this.list[task.star - 1].push(task);
		});
		console.log(this.list);
		// 需要通过star数进行分组
	},
	methods: {
		submitTask(taskId) {
			console.log('领取任务', taskId);
			this.show = true;
			this.clickTaskId = taskId;
		},
		rank() {
			// 跳转到星星数排行页面
			let mystar = this.myStars;
			uni.navigateTo({
				url: `./starRank?star=${mystar}`
			});
		},
		record(status) {
			uni.navigateTo({
				url: `./taskRecord?status=${status}`
			});
		},
		async down() {
			// 在这里确定是否领取任务
			console.log('down');
			let res = await this.$u.api.receiveTask(this.clickTaskId);
			console.log(res);
			uni.showToast({
				title: res.msg,
				icon: 'none',
				duration: 500
			});
			this.show = false;
		},
		cancel() {
			this.show = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.stars {
	margin: 10rpx;
	display: flex;
	align-items: center;
	justify-content: space-evenly;

	.mybtn /deep/ .uni-button {
		// margin: 0;
	}
}

.tasklist {
	margin: 20rpx 10rpx;

	.diff {
		margin: 10rpx 25rpx;
	}

	.task {
		display: flex;
		flex-wrap: wrap;
		// justify-content: center;
		align-items: center;

		.taskevery {
			// height:230rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 10rpx 16rpx;
			width: 150rpx;
		}
	}
}
.receive {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	.title {
		font-size: 1.1em;
		margin: 5vh;
	}
	.btn /deep/ .u-size-medium {
		padding: 0 50rpx;
		margin: 0 20rpx;
	}
}
</style>
