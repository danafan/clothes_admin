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
	//供应商
	supplierGoodsList:'api/supplier_goods/list',		//商品资料列表
	supplierGoodsAdd:'api/supplier_goods/add',			//上传商品资料
	supplierGoodsDel:'api/supplier_goods/del',			//删除商品资料
	supplierGoodsEdit:'api/supplier_goods/edit',		//编辑/获取详情
	supplierGoodsAudit:'api/supplier_goods/apply_check',//发起审核
	supplierGoodsCancel:'api/supplier_goods/revoke',	//撤销审核
	supplierSendGoodsList:'api/supplier_goods/send_goods_list',		//商品寄样列表
	supplierSendGoods:'api/supplier_goods/add_logistics',			//商品寄出
	supplierSendCancel:'api/supplier_goods/revoke_logistics',		//寄出撤销
	supplierQualityInspectionList:'api/supplier_goods/quality_inspection_list',	//质检报告列表
	supplierQualityInspectionUpload:'api/supplier_goods/upload_zz_file',		//上传质检文件
	supplierQualityInspectionCancel:'api/supplier_goods/revoke_zz_file',		//撤销质检文件
	//品牌商
	brandGoodsList:'api/brand_goods/list',				//商品资料审核列表
	addBrandKsbm:'api/brand_goods/add_brand_ksbm',		//上传单个商品品牌款号
	brandGoodsAudit:'api/brand_goods/check',			//品牌商审核
	importBrandKsbm:'api/brand_goods/import_brand_ksbm',//批量导入品牌款号
	qualityInspectionList:'api/brand_goods/quality_inspection_list',	//质检报告审核列表
	qualityInspectionAudit:'api/brand_goods/quality_inspection_audit',	//质检报告审核
	sendGoodsList:'api/brand_goods/send_goods_list',					//样衣审核列表
	auditSendAudit:'api/brand_goods/audit_send',						//样衣审核
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
	//商品资料列表
	supplierGoodsList(params){
		return http.get(path.supplierGoodsList, params)
	},
	//上传商品资料
	supplierGoodsAdd(params){
		return http.post(path.supplierGoodsAdd, params)
	},
	//删除商品资料
	supplierGoodsDel(params){
		return http.post(path.supplierGoodsDel, params)
	},
	//获取商品详情
	supplierGoodsEditGet(params){
		return http.get(path.supplierGoodsEdit, params)
	},
	//编辑商品提交
	supplierGoodsEditPost(params){
		return http.post(path.supplierGoodsEdit, params)
	},
	//发起审核
	supplierGoodsAudit(params){
		return http.post(path.supplierGoodsAudit, params)
	},
	//撤销审核
	supplierGoodsCancel(params){
		return http.post(path.supplierGoodsCancel, params)
	},
	//商品寄样列表
	supplierSendGoodsList(params){
		return http.get(path.supplierSendGoodsList, params)
	},
	//商品寄出
	supplierSendGoods(params){
		return http.post(path.supplierSendGoods, params)
	},
	//寄出撤销
	supplierSendCancel(params){
		return http.post(path.supplierSendCancel, params)
	},
	//质检报告列表
	supplierQualityInspectionList(params){
		return http.get(path.supplierQualityInspectionList, params)
	},
	//上传质检文件
	supplierQualityInspectionUpload(params){
		return http.post(path.supplierQualityInspectionUpload, params)
	},
	//撤销质检文件
	supplierQualityInspectionCancel(params){
		return http.post(path.supplierQualityInspectionCancel, params)
	},
	//商品资料审核列表
	brandGoodsList(params){
		return http.get(path.brandGoodsList, params)
	},
	//上传单个商品品牌款号
	addBrandKsbm(params){
		return http.post(path.addBrandKsbm, params)
	},
	//品牌商审核
	brandGoodsAudit(params){
		return http.post(path.brandGoodsAudit, params)
	},
	//批量导入品牌款号
	importBrandKsbm(params){
		return http.post(path.importBrandKsbm, params)
	},
	//质检报告审核列表
	qualityInspectionList(params){
		return http.get(path.qualityInspectionList, params)
	},
	//质检报告审核
	qualityInspectionAudit(params){
		return http.post(path.qualityInspectionAudit, params)
	},
	//样衣审核列表
	sendGoodsList(params){
		return http.get(path.sendGoodsList, params)
	},
	//样衣审核
	auditSendAudit(params){
		return http.post(path.auditSendAudit, params)
	},
}









