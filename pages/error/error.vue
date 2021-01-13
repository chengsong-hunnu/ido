<template>
	
	<view>
		<u-navbar  title="error" :background="background"></u-navbar>
		error页面
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#fff',
					// 渐变色
					// backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
