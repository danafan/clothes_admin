import http from './request.js'
let path = {	
	getUserInfo:'api/scancodes/getuserinfo',			//获取用户信息
	menuList:'api/access/mymenu',						//获取菜单列表
	ajaxSeries:'api/common/ajax_series',				//获取系列列表
	ajaxCates:'api/common/ajax_cates',					//获取品类列表
	ajaxUsers:'api/common/ajax_users',					//获取用户列表
	ajaxBrands:'api/common/ajax_brands',				//获取品牌列表
	uploadFile:'api/common/upload',						//上传文件
	deleteFile:'api/common/del_file',					//删除文件
	adminGoodsList:'api/goods/list',					//获取商品资料列表
	adminGoodsAudit:'api/goods/apply_check',			//商品资料审核
	adminSupplierList:'api/supplier/list',				//供应商列表
	adminSupplierAdd:'api/supplier/add',				//添加供应商
	adminSupplierInfo:'api/supplier/info',				//获取供应商详情
	adminSupplierEdit:'api/supplier/edit',				//编辑供应商
	adminSupplierDel:'api/supplier/del',				//删除供应商
	adminSupplierAddMember:'api/supplier/add_user',		//供应商添加用户
	adminSupplierMemberList:'api/supplier/users',		//获取供应商用户列表
}					
export default{
	//获取用户信息
	getUserInfo(params){
		return http.get(path.getUserInfo, params)
	},
	//获取消息列表
	menuList(params){
		return http.get(path.menuList, params)
	},
	//获取系列列表
	ajaxSeries(params){
		return http.get(path.ajaxSeries, params)
	},
	//获取品类列表
	ajaxCates(params){
		return http.get(path.ajaxCates, params)
	},
	//获取用户列表
	ajaxUsers(params){
		return http.get(path.ajaxUsers, params)
	},
	//获取品牌列表
	ajaxBrands(params){
		return http.get(path.ajaxBrands, params)
	},
	//上传文件
	uploadFile(params){
		return http.post(path.uploadFile, params)
	},
	//删除文件
	deleteFile(params){
		return http.post(path.deleteFile, params)
	},
	//获取商品资料列表
	adminGoodsList(params){
		return http.get(path.adminGoodsList, params)
	},
	//商品资料审核
	adminGoodsAudit(params){
		return http.post(path.adminGoodsAudit, params)
	},
	//供应商列表
	adminSupplierList(params){
		return http.get(path.adminSupplierList, params)
	},
	//添加供应商
	adminSupplierAdd(params){
		return http.post(path.adminSupplierAdd, params)
	},
	//获取供应商详情
	adminSupplierInfo(params){
		return http.get(path.adminSupplierInfo, params)
	},
	//编辑供应商
	adminSupplierEdit(params){
		return http.post(path.adminSupplierEdit, params)
	},
	//删除供应商
	adminSupplierDel(params){
		return http.post(path.adminSupplierDel, params)
	},
	//供应商添加用户
	adminSupplierAddMember(params){
		return http.post(path.adminSupplierAddMember, params)
	},
	//获取供应商用户列表
	adminSupplierMemberList(params){
		return http.get(path.adminSupplierMemberList, params)
	},
	
}









