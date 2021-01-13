import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		projectIp: 'http://122.9.44.92:5000',
		// projectIp: 'http://172.27.45.80:5000',
		// 保存用户身份信息，如学生信息，企业人员信息等
		identity:{},
		login: {
			username: '',
			password: '',
		},
		// projectIp:'http://b.ido.hpjpw.com',
		token: '',
		user: {},
		// 表示自己是守护者的时候的聊天
		guardMsg: [],
		// 表示自己是被守护者的时候的聊天
		protectedMsg: [],
		tasklist:[],
		key: "ido.index.pic.",
	},
	getters: {
		getStorageLogin(state) {
			// 空对象会被隐式转换为true,空字符串不会
			if (!state.login.loginName && uni.getStorageSync('login')) {
				state.login = uni.getStorageSync('login')
			}
			return JSON.parse(JSON.stringify(state.login))
		},
		getStorageToken(state) {
			if (!state.user.userName && uni.getStorageSync('token')) {
				state.token = uni.getStorageSync('token')
			}
			return state.token
		},
		getStorageUser(state) {
			// 只有当vuex里面没有存在user时，从本地进行获取，主要是为了解决刷新后state里面数据丢失的问题
			if (!state.user.userName && uni.getStorageSync('user')) {
				state.user = uni.getStorageSync('user')
			}
			return JSON.parse(JSON.stringify(state.user))
		},
		getStorageguardMsg(state) {
			// console.log('unig',uni.getStorageSync('guardMsg'))
			if (state.guardMsg.length <= 0 && uni.getStorageSync(state.user.userId + 'guardMsg')) {
				state.guardMsg = uni.getStorageSync(state.user.userId + 'guardMsg')
			}
			return state.guardMsg
		},
		getStorageprotectedMsg(state) {
			// console.log('unip',uni.getStorageSync('protectedMsg'))
			if (state.protectedMsg.length <= 0 && uni.getStorageSync(state.user.userId + 'protectedMsg')) {
				state.protectedMsg = uni.getStorageSync(state.user.userId + 'protectedMsg')
			}
			return state.protectedMsg
		}
	},
	mutations: {
		// 记住，所有的对象，尤其是二重对象都需要深克隆
		// 设置user的时候一同存在本地，为了方式vuex刷新后state里面的数据消失
		setUser(state, user) {
			// 更新user信息
			state.user = user
			uni.setStorageSync('user', user);
		},
		setIdentity(state,identity){
			state.identity = JSON.parse(JSON.stringify(identity))
		},
		setLogin(state, login) {
			// 更新user信息
			state.login = login
			uni.setStorageSync('login', login);
		},
		// 后面的载荷参数只能有一个，所以只能传入对象传递数据
		updateUser(state, data) {
			state.user[data.type] = data.val
			uni.setStorageSync('user', state.user);
		},
		// 设置token的时候一同存到本地
		setToken(state, token) {
			state.token = token
			uni.setStorageSync('token', token)
		},
		// 将聊天消息保存在本地,就不用每次都通过网络获取
		setguardMsg(state, guardMsg) {
			state.guardMsg = guardMsg;
			uni.setStorageSync(state.user.userId + 'guardMsg', guardMsg)
		},
		addguardMsg(state, newguardMsg) {
			state.guardMsg.push(newguardMsg);
			// uni.setStorage({
			// 	key: state.user.userId+'guardMsg',
			// 	data: state.guardMsg
			// })
			uni.setStorageSync(state.user.userId + 'guardMsg', state.guardMsg)
		},
		setprotectedMsg(state, protectedMsg) {
			state.protectedMsg = protectedMsg;
			uni.setStorageSync(state.user.userId + 'protectedMsg', protectedMsg)
		},
		addprotectedMsg(state, newprotectedMsg) {
			state.protectedMsg.push(newprotectedMsg);
			// uni.setStorage({
			// 	key: state.user.userId+'protectedMsg',
			// 	data: state.protectedMsg
			// })
			uni.setStorageSync(state.user.userId + 'protectedMsg', state.protectedMsg)
		}
	},
	actions: {
		// 异步更新user
		aSetUser(context) { //这里的context就是上下文，相当于store
			context.commit('setUser')
		}
	}
})
export default store
