// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
// let hotSearchUrl = '/ebapi/store_api/hot_search';
// let indexUrl = '/ebapi/public_api/index';

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F

// baseUrl: 'http://b.ido.hpjpw.com/prod-api/'
let loginUrl = 'ido/login'
let getUserinfoUrl = 'getInfo'
let updateUserUrl = 'ido/student'
let sendCommunicationUrl = 'ido/app/communication/send';
let getCommunicationUrl = 'ido/app/communication/list';

// 这个url是获取表示自己是守护者时的那一段关系
let communicationGuardUrl = 'ido/app/communication/guard';
// 这个url是获取表示自己是被守护者时的那一段关系
let communicationProtectedUrl = 'ido/app/communication/protected';

let messageListUrl = 'ido/app/message/list'
let messageUrl = 'ido/app/message/read/'

// 更新用户信息
let emailUrl = 'ido/app/user/profile/email'
let phoneNumberUrl = 'ido/app/user/profile/phoneNumber'
let sexUrl = 'ido/app/user/profile/sex'
let avatarUrl = 'system/user/profile/avatar'
let pwdUrl = 'ido/app/user/profile/updatePwd'

// 实习宝藏的接口url
let submitTaskUrl = 'ido/app/task/student/' //后面接任务id
let getTaskListUrl = 'ido/app/task/student/list'
let getTaskUrl = 'ido/app/task/' //后面接任务id
let receiveTaskUrl = 'ido/app/task/student/' //后面接任务id
let getTaskRecordUrl = 'ido/app/task/student/taskRecord/list'

// 实习宝藏审核端接口
let taskUrl = 'ido/app/task/'
let taskRecordUrl = 'ido/app/task/worker/'
let taskRecordListUrl = 'ido/app/task/worker/taskRecord/list'
let studentInfoUrl = 'ido/app/user/profile/'

// 企业人员关联学生接口
let studentReleasableListUrl = 'ido/app/task/worker/students'
let studentRelateUrl = 'ido/app/task/worker/student/'
let studentRelatedUrl = 'ido/app/task/worker/students/list'
// 企业员工注册所用
let registerUrl = 'ido/app/user/worker/register'
// 企业列表
let enterpriseListUrl = 'ido/app/enterprise/list'
let enterpriseUrl = 'ido/enterprise/'
// 首页轮播图及标题
let carouselMapUrl = 'system/config/configKey/'
// 地区列表
let areaListUrl = 'ido/area/list'
// 学生选择企业
let enterpriseSelect = 'ido/app/user/profile/student/enterpriseId'

let getStarnumUrl = 'ido/app/task/getStarSumNum'
// 点击退出登录时的断开服务器连接
let quitUrl = 'logout'
const install = (Vue, vm) => {
	// 默认params为空
	let login = (params = {}) => vm.$u.post(loginUrl, params)
	let getUserinfo = () => vm.$u.get(getUserinfoUrl)
	// 更新用户信息（注意是用户，不是具体的某一个学生、老师这种），主要是更新用户的 avatar、sex、email、phonenumber
	let updateUser = (params = {}) => vm.$u.put(updateUserUrl, params)

	/* 2.聊天接口 */
	// 2.1 增加聊天内容
	let sendCommunication = (params = {}) => vm.$u.post(sendCommunicationUrl, params)
	// 2.2 获取聊天内容
	let getCommunication = (params = {}) => vm.$u.get(getCommunicationUrl, params)
	// 获取守护关系
	let getCommunicationGuard = (params = {}) => vm.$u.get(communicationGuardUrl, params)
	let getCommunicationProtected = (params = {}) => vm.$u.get(communicationProtectedUrl, params)

	// 这是 获取系统消息时的接口
	let getMessageList = (params = {}) => vm.$u.get(messageListUrl, params)
	let getMessage = (params = '') => vm.$u.get(messageUrl + params)

	// 更新用户邮箱
	let changeEmail = (email = '', params = {}) => vm.$u.put(emailUrl + '?' + email, params)
	let changePhoneNumber = (phone = '', params = {}) => vm.$u.put(phoneNumberUrl + '?' + phone, params)
	let changeSex = (sex = '', params = {}) => vm.$u.put(sexUrl + '?' + sex, params)
	// 这个上传头像的接口可能不会使用
	let changeAvatar = (params = {}) => vm.$u.post(avatarUrl, params)
	let changePwd = (params = {}) => vm.$u.put(pwdUrl, params)

	let getTaskList = () => vm.$u.get(getTaskListUrl)
	let getTask = (taskId = -1) => vm.$u.get(getTaskUrl + taskId)
	let getTaskRecord = () => vm.$u.get(getTaskRecordUrl)
	// 学生领取任务，领取之后才能提交
	let receiveTask = (taskId = -1, params = {}) => vm.$u.post(receiveTaskUrl + taskId, params)
	// 学生提交实习宝藏任务
	let submitTask = (taskId = -1, params = {}) => vm.$u.put(submitTaskUrl + taskId, params)

	/* 实习宝藏接口 */
	// 获取某一任务信息
	let getTaskInCheck = (id) => vm.$u.get(taskUrl + id)
	// 获取任务记录列表
	let getTaskRecordListInCheck = () => vm.$u.get(taskRecordListUrl)
	// 修改任务记录
	let updateTaskRecordInCheck = (id, starNum) => vm.$u.post(taskRecordUrl + id + '?starNum=' + starNum)
	// 获取任务记录详情
	let getTaskRecordInCheck = (id) => vm.$u.get(taskRecordUrl + id)
	// 依照学生ID获取学生姓名和头像
	let getStudentInfoInCheck = (id) => vm.$u.get(studentInfoUrl + id)

	// 获取已关联学生列表
	let getRelatedStudentList = () => vm.$u.get(studentRelatedUrl)
	// 获取可关联学生列表
	let getReleasableStudentList = () => vm.$u.get(studentReleasableListUrl)
	// 通过学生的学生ID关联学生
	let relateStudent = (id) => vm.$u.post(studentRelateUrl + id)
	// 通过学生的学生ID来取消关联学生
	let cancelRelateStudent = (id) => vm.$u.delete(studentRelateUrl + id)
	// 企业员工注册
	let register = (params = {}) => vm.$u.post(registerUrl, params)

	// 获取企业列表
	let getEnterpriseList = () => vm.$u.get(enterpriseListUrl)
	// 获取某一地区企业
	let getEnterpriseArea = (areaId) => vm.$u.get(enterpriseListUrl + "?areaId=" + areaId)
	// 获取某一企业信息
	let getEnterprise = (id) => vm.$u.get(enterpriseUrl + id)
	// 获取首页轮播图及标题，接收键名
	let getCarouselMap = (configKey) => vm.$u.get(carouselMapUrl + configKey)
	// 获取地区列表
	let getAreaList = () => vm.$u.get(areaListUrl)
	// 按照企业ID来选择企业
	let selectEnterprise = (id) => vm.$u.post(enterpriseSelect + "?enterpriseId=" + id)

	let getStarnum = ()=>vm.$u.get(getStarnumUrl)
	let quit = () => vm.$u.post(quitUrl)
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		login,
		getUserinfo,
		updateUser,
		sendCommunication,
		getCommunication,
		getCommunicationGuard,
		getCommunicationProtected,
		getMessageList,
		getMessage,
		changeEmail,
		changePhoneNumber,
		changeSex,
		changeAvatar,
		changePwd,
		getTaskList,
		getTask,
		getTaskRecord,
		receiveTask,
		submitTask,
		// 实习宝藏审核
		getTaskInCheck,
		getTaskRecordListInCheck,
		updateTaskRecordInCheck,
		getTaskRecordInCheck,
		getStudentInfoInCheck,
		// 关联学生
		getRelatedStudentList,
		getReleasableStudentList,
		relateStudent,
		cancelRelateStudent,
		register,
		// 首页
		getEnterpriseList,
		getEnterpriseArea,
		getEnterprise,
		getCarouselMap,
		getAreaList,
		selectEnterprise,
		getStarnum,
		quit
	};
}

export default {
	install
}
