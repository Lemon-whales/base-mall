'use strict';

const uniID = require('uni-id')

exports.main = async (event) => {
	//event为客户端上传的参数
	console.log('event : ' + event)


	let params = event.params
	let res = {}

	let payload = {}

	switch (event.action) {
		case 'register':
			res = await uniID.register(event.params);
			break;
		case 'login':
			res = await uniID.login({
				...event.params,
				// 不指定queryField的情况下只会查询username
				queryField: ['username', 'email', 'mobile']
			});
			break;
		case 'logout':
			res = await uniID.logout(event.uniIdToken);
			break;
		case 'updatePassword':
			payload = await uniID.checkToken(event.uniIdToken)
			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.updatePwd(params);
			break;
		case 'setAvatar':
			payload = await uniID.checkToken(event.uniIdToken)
			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.setAvatar(params);
			break;
		case 'bindMobile':
			payload = await uniID.checkToken(event.uniIdToken)
			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.bindMobile(params);
			break;
		case 'bindEmail':
			payload = await uniID.checkToken(event.uniIdToken)
			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.bindEmail(params);
			break;
		case 'loginByWeixin':
			res = await uniID.loginByWeixin(params.code);
			break;
		case 'bindWeixin':
			payload = await uniID.checkToken(event.uniIdToken)
			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid
			res = await uniID.bindWeixin(params);
			break;
		case 'unbindWeixin':
			payload = await uniID.checkToken(event.uniIdToken)
			if (payload.code && payload.code > 0) {
				return payload
			}
			res = await uniID.unbindWeixin(payload.uid);
			break;
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}

	//返回数据给客户端
	return res
};
