<template>
	<view>
		<u-navbar title="任务详情"></u-navbar>
		<view class="demo-frame" v-model="taskItem">
			<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
			<view class="demo-name">
				{{taskItem[0].taskName}}
			</view>
			<view>
				<u-icon :label="taskItem[0].student" size="40" :name="taskItem[0].avatar" width="20px"></u-icon>
				<view class="demo-describe">
					{{taskItem[0].describe}}
				</view>
				<p style="text-align: center; color: #999999;">图片描述区</p>
				<view class="picture-border">
					<view class="demo-picture">
						<p style="text-align: center;">
							<u-image mode="aspectFit" height="600rpx" :src="taskItem[0].picture" @click="imgPreview()"></u-image>
						</p>
						<!-- <u-image width="10%" height="80rpx" :src="taskItem[0].picture"></u-image> -->
					</view>
				</view>
				<view class="demo-time">
					{{taskItem[0].time}}
				</view>
			</view>
			<view class="demo-rate">
				评分：<u-rate :count="taskItem[0].maxStar" v-model="taskItem[0].star" active-color="#22a2c3"></u-rate>
				{{taskItem[0].star}}
			</view>
			<view class="demo-button">
				<u-button type="default" size="medium" ripple style="font-size: 30rpx; background-color: #f1f1f1;" @click="submit(taskItem[0])">提交</u-button>
			</view>

			<view>
				<u-toast ref="uToast" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskItem: [],
				taskRecordId: 0,
			}
		},
		onLoad(option) {
			this.taskRecordId = option.taskRecordId;
			this.getTaskRecord();
		},
		methods: {
			async getTaskRecord() {
				let response = await this.$u.api.getTaskRecordInCheck(this.taskRecordId);
				let task = {};
				task.describe = response.data.describe;
				task.taskId = response.data.taskId;
				task.taskRecordId = parseInt(response.data.id);
				task.studentId = response.data.studentId;
				task.time = response.data.time;
				task.picture = this.$store.state.projectIp + response.data.picture;
				if(response.data.picture==''){
					task.picture = '';
				}
				let stu = await this.$u.api.getStudentInfoInCheck(task.studentId);
				if (stu.imgUrl == "") {
					task.avatar = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/github.svg';
				} else {
					task.avatar = stu.imgUrl;
				}
				task.student = stu.name;
				// 按照任务ID获取任务信息
				let params = {};
				let res = await this.$u.api.getTaskInCheck(task.taskId);
				params.name = res.data.name;
				params.maxStar = res.data.star;
				task.taskName = params.name;
				task.maxStar = params.maxStar;
				task.star = 0;
				this.taskItem.push(task);
			},
			async submit(item) {
				let res = await this.$u.api.updateTaskRecordInCheck(item.taskRecordId, item.star);
				let code = true;
				if(res.code != 200){
					code = false;
				}
				this.showToast(code);
			},
			showToast(code) {
				if(code){
					this.$refs.uToast.show({
					title: '提交成功',
					type: 'success',
				})
				this.$u.route({
					url: 'pages/student/my/treasure/treasureCheck'
				})
				}else{
					this.$refs.uToast.show({
						title: '提交失败',
						type: 'error',
					})
				}
			},
			imgPreview() {
				let urlList = [];
				urlList.push(this.taskItem[0].picture)
				uni.previewImage({
					loop: true,
					urls: urlList
				})
			}
		}
	}
</script>

<style scoped>
	.demo-frame {
		border-radius: 30rpx;
		margin: 30rpx;
		/* background-color: #ede3e7; */
		padding: 30rpx;
		position: relative;
		border: #333333;
		border-width: thin ;
		border-style: solid;
	}

	.demo-name {
		border-radius: 30rpx;
		text-align: center;
		font-size: 40rpx;
		color: $u-main-color;
	}

	.demo-describe {
		margin: 20rpx;
	}
	
	.picture-border {
		height: 600rpx;
		border-radius: 20rpx;
		background-color: #f1f1f1;
	}

	.demo-picture {
		height: 600rpx;
		border-radius: 10rpx;
		margin: 10rpx;
		text-align: center;
	}

	.demo-time {
		margin: 30rpx;
		text-align: right;
	}

	.demo-rate {
		margin-top: 20rpx;
	}

	.demo-button {
		margin-top: 20rpx;
		text-align: center;
	}
</style>
