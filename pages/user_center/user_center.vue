<template>
	<view class="content">
		<input type="text" v-model="username" placeholder="用户名/邮箱/手机号" />
		<input type="text" v-model="password" password="true" placeholder="密码" />
		<button type="default" @tap="register">注册</button>
		<button type="default" @tap="login">登录</button>
		<button type="default" @tap="updatePwd">修改密码</button>
		<button type="default" @tap="setAvatar">设置头像</button>
		<button type="default" @tap="bindMobile">绑定手机号</button>
		<button type="default" @tap="bindEmail">绑定邮箱</button>
		<!-- #ifdef MP-WEIXIN -->
		<button type="default" @tap="loginByWeixin">微信登录</button>
		<button type="default" @tap="bindWeixin">绑定微信</button>
		<button type="default" @tap="unbindWeixin">解绑微信</button>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<template v-if="hasWeixinAuth">
			<button type="default" @tap="loginByWeixin">微信登录</button>
			<button type="default" @tap="bindWeixin">绑定微信</button>
			<button type="default" @tap="unbindWeixin">解绑微信</button>
		</template>
		<!-- #endif -->
		<button type="default" @tap="logout">退出</button>
	</view>
</template>

<script>
	let weixinAuthService
	export default {
		data() {
			return {
				username: '',
				password: '',
				hasWeixinAuth: false
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.oauth.getServices((services) => {
				weixinAuthService = services.find((service) => {
					return service.id === 'weixin'
				})
				if (weixinAuthService) {
					this.hasWeixinAuth = true
				}
			});
			// #endif
		},
		methods: {
			getWeixinCode() {
				return new Promise((resolve, reject) => {
					// #ifdef MP-WEIXIN
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code)
						},
						fail(err) {
							reject(new Error('微信登录失败'))
						}
					})
					// #endif
					// #ifdef APP-PLUS
					weixinAuthService.authorize(function(res) {
						resolve(res.code)
					}, function(err) {
						console.log(err)
						reject(new Error('微信登录失败'))
					});
					// #endif
				})
			},
			unbindWeixin() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'unbindWeixin'
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '微信登录失败，请稍后再试'
						})
					}
				})
			},
			bindWeixin() {
				this.getWeixinCode().then((code) => {
					return uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'bindWeixin',
							params: {
								code: code,
							}
						}
					})
				}).then((res) => {
					uni.showModal({
						showCancel: false,
						content: JSON.stringify(res.result)
					})
				}).catch(() => {
					uni.showModal({
						showCancel: false,
						content: '微信绑定失败，请稍后再试'
					})
				})
			},
			loginByWeixin() {
				this.getWeixinCode().then((code) => {
					return uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'loginByWeixin',
							params: {
								code,
							}
						}
					})
				}).then((res) => {
					uni.showModal({
						showCancel: false,
						content: JSON.stringify(res.result)
					})
					if (res.result.code === 0) {
						uni.setStorageSync('uniIdToken', res.result.token)
					}
				}).catch(() => {
					uni.showModal({
						showCancel: false,
						content: '微信登录失败，请稍后再试'
					})
				})
			},
			register() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'register',
						params: {
							username: this.username,
							password: this.password
						}
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
						uni.setStorageSync('uniIdToken', e.result.token)
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '注册失败，请稍后再试'
						})
					}
				})
			},
			login() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'login',
						params: {
							username: this.username,
							password: this.password
						}
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
						uni.setStorageSync('uniIdToken', e.result.token)
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '登录失败，请稍后再试'
						})
					}
				})
			},
			updatePwd() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'updatePassword',
						params: {
							oldPassword: '123456',
							newPassword: 'abcdef',
							password_confirmation: 'abcdef'
						}
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '修改失败，请稍后再试'
						})
					}
				})
			},
			setAvatar() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'setAvatar',
						params: {
							avatar: 'https://img.cdn.aliyun.dcloud.net.cn/uni-app/uniCloud/unicloudlogo.png'
						}
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '设置失败，请稍后再试'
						})
					}
				})
			},
			bindMobile() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'bindMobile',
						params: {
							mobile: '18812341234'
						}
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '绑定失败，请稍后再试'
						})
					}
				})
			},
			bindEmail() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'bindEmail',
						params: {
							email: 'chb@example.com'
						}
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '绑定失败，请稍后再试'
						})
					}
				})
			},
			logout() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'logout'
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(e.result)
						})
						uni.removeStorageSync('uniIdToken')
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '登出失败，请稍后再试'
						})
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		padding: 15px;
	}

	.content input {
		height: 46px;
		border: solid 1px #DDDDDD;
		border-radius: 5px;
		text-indent: 10px;
		margin-bottom: 15px;
	}

	.content button {
		margin-bottom: 15px;
	}
</style>
