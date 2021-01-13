<template>
	<view class="main">
		<u-navbar title="聊天" :background="background" ref="navbar" height="40"></u-navbar>
		<view class="chatview" ref="scrollView">
			<view class="chatitem" v-for="(data, index) in msg" :key="index" :id="'item' + index">
				<view class="time">{{ data.time }}</view>
				<!-- 这里展示自己发送的信息，在右侧 -->
				<view v-if="data.mine == true" class="mychatitem">
					<view class="chatmsg">
						{{ data.val }}
						<!-- {{inputval}} -->
					</view>
					<!-- <u-avatar :src="user.avatar"></u-avatar> -->
					<u-image width="90rpx" height="90rpx" :src="user.avatar" shape="circle">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<!-- 这里展示聊天对象的信息，在左侧 -->
				<view v-else class="tochatitem">
					<!-- <u-avatar :src="toUser.avatar">
					</u-avatar> -->
					<u-image width="90rpx" height="90rpx" :src="toUser.avatar" shape="circle">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<view class="chatmsg">{{ data.val }}</view>
				</view>
			</view>
			<view class="inbottom"></view>
		</view>

		<view class="in" ref="in">
			<u-field type="textarea" v-model="inputval" :clearable="false" label-width="0" class="inframe" @focus="upChatView">
				<u-button size="mini" slot="right" type="success" @click="sendmsg">发送</u-button>
			</u-field>
		</view>
	</view>
</template>

<script>
import getNowTime from '../../../../utils/nowTime.js';
export default {
	data() {
		return {
			user: {},
			toUser: {
				// avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1305454818,873736954&fm=26&gp=0.jpg'
			},
			scrollTop: 0,
			scroolLeft: 1,
			refresh: true,
			regreshTrigger: false,
			refreshOld: 100,
			pageNum: 1,
			pageSize: 8,
			stopRefresh: false,
			msg: [],
			inputval: '',
			// 0表示自己是被守护者，1表示自己是守护者
			identity: -1,
			relationship: {},
			background: {
				backgroundColor: '#f5f5f5'
			},
			interval: -1,
			// 是否是递归返回的状态
			isrecursion: false
		};
	},
	async onLoad(option) {
		// 清除缓存数据
		// uni.clearStorageSync();
		console.log('onload');
		this.identity = option.index;
		this.user = JSON.parse(JSON.stringify(this.$store.getters.getStorageUser));
		if (this.identity == 0) {
			// 自己是被守护者的时候就不需要获取与其交谈的人的任何信息
			this.msg = JSON.parse(JSON.stringify(this.$store.getters.getStorageprotectedMsg));
			this.relationship = await this.$u.api.getCommunicationProtected();
			// 当还没有形成关系的时候，提示错误
			if (this.relationship.code != 200) {
				uni.showToast({
					title: '还未分配守护',
					icon: 'none',
					duration: 1000,
					success: () => {
						// 使用settimeout来控制时间，上面的1000其实根本没用
						setTimeout(() => {
							this.$u.route({
								type: 'back'
							});
						}, 1000);
					}
				});
			}
			this.toUser.avatar = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1305454818,873736954&fm=26&gp=0.jpg';
		} else if (this.identity == 1) {
			this.msg = JSON.parse(JSON.stringify(this.$store.getters.getStorageguardMsg));
			// 自己是守护者的时候就需要获取交流的人的信息
			this.relationship = await this.$u.api.getCommunicationGuard();
			// 当还没有形成关系的时候，提示错误
			if (this.relationship.code != 200) {
				uni.showToast({
					title: '还未分配守护',
					icon: 'none',
					duration: 1000,
					success: () => {
						// 使用settimeout来控制时间，上面的1000其实根本没用
						setTimeout(() => {
							this.$u.route({
								type: 'back'
							});
						}, 1000);
					}
				});
			}
			this.toUser = {
				avatar: this.$store.state.projectIp + this.relationship.protectedAvatar || 'https://uviewui.com/common/logo.png',
				name: this.relationship.protectedName
			};
			// console.log(this.toUser);
		}
		// 这里一进来就跳转到scrollview最下面
		this.scrollRoll(30000, 100);
	},
	// 在这里面主要是页面加载获取对面发送过来的信息，（主要是后端感觉难度太高了，我这也没太好的方法）,只是获取对面发送的消息
	async onShow() {
		// // 这里主要是避免刚进入时需要等待3秒才能获取信息
		// this.receiveMessage();
		// this.interval = setInterval(()=>{
		// 	console.log('settime');
		// 	this.receiveMessage();
		// },5000)
		// console.log('show')
		
	},
	onReady() {
		// 直接在页面每一次进入的时候就执行一次，免得反复执行
		// 这里主要是避免刚进入时需要等待3秒才能获取信息
		this.receiveMessage();
		this.interval = setInterval(()=>{
			console.log('settime');
			this.receiveMessage();
		},5000)
	},
	onUnload(){
		console.log('unload');
		clearInterval(this.interval)
	},
	onHide() {
		// clearInterval(this.interval);
		console.log('hide');
	},
	onPageScroll(Object) {
		// console.log(Object.scrollTop); //实时获取到滚动的值
		this.scrollTop = Object.scrollTop;
	},
	methods: {
		// 记得所有的对象数据要深克隆一下
		// 获取发送消息参数
		getParames() {
			let params = {
				isGuardian: false,
				message: this.inputval
			};
			if (this.identity == 1) {
				params.isGuardian = true;
			}
			// console.log(params.message);
			// console.log(params.isGuardian);
			return params;
		},
		pushMessage() {
			// console.log('msg1:', this.msg.length);
			// console.log('msg1:', this.msg);
			let message = {
				mine: true,
				val: this.inputval,
				time: getNowTime()
			};
			this.$nextTick(() => {
				this.msg.push(message);
			});
			// console.log('msg2:', this.msg);
		},
		// 发送消息
		async sendmsg() {
			console.log('你发送了一条消息:' + this.inputval);
			if (this.inputval == '') return;
			// this.pushMessage();
			let params = this.getParames();
			// 调用addCommunication接口
			let res = await this.$u.api.sendCommunication(params);
			// console.log(res);
			console.log('发送:', res.msg);
			this.pushMessage();
			this.inputval = '';
			this.$refs.scrollView.$el.style.paddingBottom = '7vh';
			this.scrollRoll(30000);
			// 在这里将发送的消息进行存储，但是异步存储的时候，如果重复进来的速度过快的话，就会出现消息不及时反映出来的问题，所以
			// 设成同步存储消息，可能会每一次登录就将storage里面的缓存清理掉，而且如果是在app端的话，因为是持久化的，如果消息列表过长
			// 可能会很影响性能
			// this.updateMsg();
			this.setMsg();
		},
		updateMsg() {
			// 发送消息时更新消息列表,同时更新本地缓存,记住要深克隆
			// this.identity 为0表示自己是被守护者，1表示自己是守护者
			if (this.identity == 0) {
				this.$store.commit('addprotectedMsg', this.$u.deepClone(this.msg[this.msg.length - 1]));
			} else if (this.identity == 1) {
				this.$store.commit('addguardMsg', this.$u.deepClone(this.msg[this.msg.length - 1]));
			}
		},
		setMsg() {
			// 直接设置消息列表，一般在下拉刷新和获得对方发送的消息时调用，即可能会得到大量消息时调用
			if (this.identity == 0) {
				this.$store.commit('setprotectedMsg', this.$u.deepClone(this.msg));
			} else if (this.identity == 1) {
				this.$store.commit('setguardMsg', this.$u.deepClone(this.msg));
			}
		},
		scrollRoll(height, duration = 200) {
			// 直接只用uni自带的api滚动到页面的最下面
			this.$nextTick(function() {
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: height,
						duration: duration
					});
				}, 50);
			});
		},
		upChatView() {
			// 输入框焦点得到之后chatview底部向上移动一部分
			this.$refs.scrollView.$el.style.paddingBottom = `40vh`;
			let nowHeight = this.scrollTop + 280;
			this.scrollRoll(nowHeight);
		},
		async onPullDownRefresh() {
			// 下拉刷新时进行调用
			console.log('refresh');
			if (this.stopRefresh) {
				uni.showToast({
					title: '已经是最久远的消息了',
					duration: 1000,
					icon: 'none'
				});
				uni.stopPullDownRefresh();
				return;
			}
			let remainder = this.msg.length % this.pageSize;
			let identity = Boolean(parseInt(this.identity));
			console.log('len:', this.msg.length, 'times', this.pageNum);
			// 这里是根据已有数据长度对请求的页数进行修改
			if (this.msg.length >= this.pageSize) {
				// 在这里获取应该获取哪些页
				this.pageNum = Math.ceil(this.msg.length / this.pageSize) > 1 ? Math.ceil(this.msg.length / this.pageSize) : 1;
				// 余数

				if (remainder == 0) {
					// 像5、10这种长度，需要获取的是下一页的内容
					this.pageNum++;
				}
				console.log(this.pageNum, remainder);
			}
			let req = await this.$u.api.getCommunication({
				isGuardian: identity,
				pageNum: this.pageNum,
				pageSize: this.pageSize
			});
			let reqMsgAll = req.rows;
			if (req.total <= this.msg.length) {
				uni.showToast({
					title: '已经是最久远的消息了',
					duration: 1000,
					icon: 'none'
				});
				this.stopRefresh = true;
			}
			for (let i = remainder; i < reqMsgAll.length; ++i) {
				// 主要是防止当消息只有一两条的时候，会出现重复加入信息的情况
				if (reqMsgAll[i].time == this.msg[this.msg.length - 1].time) {
					break;
				}
				let mine = this.user.userId == reqMsgAll[i].senderId ? true : false;
				let nowMsg = {
					mine: mine,
					val: reqMsgAll[i].content,
					time: reqMsgAll[i].time
				};
				this.msg.unshift(nowMsg);
			}
			// 代表刷新获取聊天内容时获取的是第几页
			// this.pageNum++;
			console.log('reqMsg', reqMsgAll);
			// 异步存储缓存中的信息
			this.setMsg();
			uni.stopPullDownRefresh();
		},
		async receiveMessage(page = 1, isback = false) {
			// this.interval = setInterval(() => {
			console.log('----------getmsg----------');
			// 当页面的递归过1页之后，就直接返回
			if (page > 2) {
				console.log('太过久远了');
				return true;
			}
			// 当在我的守护界面时会出现错误
			let identity = Boolean(parseInt(this.identity));
			// 测试一下await的方式
			let res = await this.$u.api.getCommunication({
				isGuardian: identity,
				pageNum: page,
				pageSize: this.pageSize
			});
			// console.log('rq', res);
			let reqMsg = res.rows;
			// console.log('rq', reqMsg);
			// console.log('msg',this.msg)
			// 当获取的消息列表为空的时候就直接退出,表示第一次进入还没有消息列表的时候
			if (reqMsg.length == 0) {
				return isback;
			}
			// 当vuex里面没有消息，本地也没有缓存的时候
			if (this.msg.length == 0 || !this.msg[this.msg.length - 1]) {
				for (let i = reqMsg.length - 1; i >= 0; i--) {
					let newMsg = reqMsg[i];
					let mine = this.user.userId == newMsg.senderId ? true : false;
					let msg = {
						mine: mine,
						val: newMsg.content,
						time: newMsg.time
					};
					this.msg.push(msg);
				}
				this.scrollRoll(30000);
				// 直接存在本地
				this.setMsg();
			} else {
				// 当里面有消息的时候就通过比较时间，找到时间相同或相近的
				// console.log(this.msg)
				let equalIndex = reqMsg.findIndex(item => {
					// 两个时间的时间戳直接差距在1s之内就判断为同一消息，因为可能消息的传递因为服务器和其他的因素可能会有延迟
					let timestamp1 = new Date(item.time).getTime();
					let timestamp2 = new Date(this.msg[this.msg.length - 1].time).getTime();
					// 单位为ms
					return Math.abs(timestamp1 - timestamp2) <= 1000;
				});
				// 在equalIndex之前的消息就是可以认为是对方发送过来的消息，这里的this.msg还没有
				// console.log('--------equalindex1:', equalIndex,isback);
				// console.log('--------boolean:',Boolean(isback && (equalIndex == -1)))

				if (isback && equalIndex == -1) {
					equalIndex = this.pageSize;
					isback = false;
				}
				console.log('--------equalindex2:', equalIndex);
				// 表示本地消息的时间没有一个与此页的消息相同,就去获取下一页的内容，递归直到得到一个相同的消息
				if (equalIndex == -1) {
					// 其实如果isback生效的话，根本不会进入这个块里面
					// if (!isback) {
					page = page + 1;
					// console.log('in:', page);
					// 进入下一页进行判断并得到isback的返回值
					let resback = await this.receiveMessage(page);
					// }
					// 递归回来的时候就将本页的数据加入msg
					page = page - 1;
					// console.log('back:', page, resback);
					this.receiveMessage(page, resback);
				} else {
					for (let i = equalIndex - 1; i >= 0; i--) {
						let newMsg = reqMsg[i];
						let mine = this.user.userId == newMsg.senderId ? true : false;
						let msg = {
							mine: mine,
							val: newMsg.content,
							time: newMsg.time
						};
						this.msg.push(msg);
						this.scrollRoll(30000);
					}
					// 直接存在本地
					this.setMsg();
					if (page > 1) {
						// this.isrecursion = true;
						isback = true;
					}
				}
			}
			// 递归时，因为程序栈的问题，似乎不能通过全局变量通信，只能使用返回值沟通
			return isback;
			// }, 6000);
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	position: relative;
	// background-color: #f7f7f7;

	.chatview {
		myheight: 30vh;
		margin: 5rpx;
		padding-bottom: 7vh;

		// border: 1px solid #007AFF;
		.chatitem {
			padding: 10rpx;

			.time {
				text-align: center;
				font-size: 10px;
			}

			.mychatitem {
				margin: 10rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				.chatmsg {
					margin: 0 20rpx;
					padding: 10rpx;
					border-radius: 8rpx;
					max-width: 480rpx;
					word-break: break-word;
					background-color: rgb(31, 243, 134);
				}
			}

			.tochatitem {
				margin: 10rpx;
				display: flex;
				align-items: center;
				justify-content: flex-start;

				.chatmsg {
					margin: 0 20rpx;
					padding: 10rpx;
					border-radius: 8rpx;
					max-width: 480rpx;
					word-break: break-word;
					background-color: #f7f7f7;
				}
			}
		}

		.inbottom {
			// height: 6vh;
			// background-color: #f7f7f7;
		}
	}

	.in {
		// margin: 0 0;
		background-color: #f7f7f7;
		border-top: 1px solid #c4d9d9;
		position: fixed;
		width: 750rpx;
		// height: 7vh;
		bottom: 0px;

		// background-color: #f6f7f7;
		.inframe /deep/ .u-flex {
			// border: solid 1px #c4d9d9;
			background-color: #fff;
			border-radius: 5px;
		}

		.inframe /deep/ .u-textarea-class {
			min-height: 30px;
		}
		.inframe /deep/ .uni-textarea-textarea {
			padding: 10rpx;
		}
	}
}
</style>
