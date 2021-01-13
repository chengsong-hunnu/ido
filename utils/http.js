const baseUrl = '';
const http = function(options){
	let url = baseUrl + options.url;
	let method = options.method;
	let header = options.header || {};
	let data = options.data || {};
	if(method){
		method = method.toUpperCase();
		if(method == 'POST'){
			// 这里主要是改变header上传的数据类型，是json还是formdata这些
			header = {"content-type":"application/x-www-form-urlencoded"}
		}
	}
	// 提示正在加载
	if(!options.hideLoading){
		uni.showLoading({
			title:'加载中'
		})
	}
	
	uni.request({
		url:url,
		method:method || "GET",
		header:header,
		data:data,
		dataType:"json",
		success: (res) => {
			if(res.statusCode && res.statusCode != 200){
				uni.showModal({
					content:res.msg
				})
				return;
			}
			typeof options.success == "function" && options.success(res.data);
		},
		fail: (err) => {
			uni.showModal({
				content:err.msg
			})
			typeof options.fail == "function" && options.fail(res.data);
		},
		complete: (e) => {
			console.log('请求结束')
			uni.hideLoading()
			typeof options.complete == "function" && options.complete(res.data);
			return;
		}
	})
}
export default http;