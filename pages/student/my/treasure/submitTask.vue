<template>
	<view>
		<u-navbar :title="task.name"></u-navbar>
		<view class="descripe">
			{{ descripe }}:
			<br />
			<view class="detail">
			{{ task.describe }}</view>
		</view>
		<u-field v-model="value" label="完成描述" placeholder="请填写你的完成情况" class="describe"></u-field>
		<view class="uploadimg">
			<u-upload
				:action="action"
				:auto-upload="false"
				ref="uUpload"
				max-count="1"
				:header="header"
				:show-progress="showProgress"
				@on-uploaded="submit"
			></u-upload>
		</view>
		<u-button type="primary" class="btn" @click="upload">提交任务</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {},
			taskId: -1,
			taskRecordId: -1,
			list: [],
			task: {},
			descripe: '本任务的描述',
			value: '',
			action: 'http://b.ido.hpjpw.com/prod-api/ido/file/upload',
			header: {},
			showProgress: false
		};
	},
	onReady() {
		// console.log('ready')
	},
	async onLoad(option) {
		// console.log('load')
		this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
		console.log(option);
		this.taskId = option.taskId;
		this.taskRecordId = option.taskRecordId;
		let task = await this.$u.api.getTask(this.taskId);
		this.task = task.data;
		console.log(this.task);
		// 这里是为了上传图片的时候能够够携带一个token
		let token = this.$store.state.token || uni.getStorageSync('token');
		this.header.Authorization = token;
	},
	methods: {
		async upload() {
			uni.showLoading({
				title:'正在提交'
			})
			
			console.log('上传图片');
			this.$refs.uUpload.upload();
		},
		async submit(list, name) {
			let files = list;
			// console.log('files', files[0].response);
			let params = {};
			if (files.length > 0) {
				params = { describe: this.value, picture: files[0].response.fileUrl || '' };
			} else {
				params = { describe: this.value };
			}

			let res = await this.$u.api.submitTask(this.taskRecordId, params);
			uni.hideLoading()
			console.log(res);
			if (res.code == 200) {
				uni.showToast({
					title: '已提交进行审核',
					icon: 'none',
					duration: 1000,
					success:()=>{
						// 使用settimeout来控制时间，上面的1000其实根本没用
						setTimeout(()=>{
							this.$u.route({
								type:'back'
							})
						},1000)
					}
				});
				
				// uni.navigateBack({
					
				// })
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.descripe {
	margin: 30rpx 30rpx;
	.detail{
		margin-top: 5rpx;
		border-top: 1px solid #f3f3f3;
		width: 100%;
		height: 10vh;
		// border: solid 1px #f6f1f9;
	}
}
.btn {
	margin: 20rpx;
}
</style>
