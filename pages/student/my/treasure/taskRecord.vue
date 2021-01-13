<template>
	<view>
		<u-navbar :title="taskStatus[status]"></u-navbar>
		<u-cell-group class="tasklist" :border="false">
			<u-cell-item
				v-for="(task, index) in taskRecord"
				:key="index"
				:title="task.taskName"
				:value="taskStatus[status]"
				@click="submitTask(task.taskId,task.id)"
				class="task"
				:arrow="arrow"
			>
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			status: -1,
			arrow: true,
			taskRecord: [],
			taskStatus: ['进行中', '审核中', '已完成']
		};
	},
	async onLoad(option) {
		this.status = option.status;
		if(this.status != 0){
			this.arrow = false
		}
	},
	async onShow(){
		this.taskRecord = []
		let taskRecord = await this.$u.api.getTaskRecord();
		taskRecord = taskRecord.rows;
		console.log(taskRecord);
		taskRecord.forEach(record => {
			if (record.state == this.status) {
				this.taskRecord.push(record);
			}
		});
		if(this.taskRecord.length == 0){
			uni.showToast({
				title:'快去领取任务吧',
				duration:1000,
				icon:'none'
			})
		}
		console.log(this.taskRecord);
	},
	methods: {
		submitTask(taskId,taskRecordId) {
			console.log('领取任务');
			if (this.status == 1 || this.status == 2) {
				return;
			}
			uni.navigateTo({
				url: `./submitTask?taskId=${taskId}&taskRecordId=${taskRecordId}`
			});
		}
	}
};
</script>

<style lang="scss"></style>
