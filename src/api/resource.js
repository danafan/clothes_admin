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
	adminSupplierEnableUser:'api/supplier/enable_user',	//供应商启用/停用用户
	adminSupplierDelUser:'api/supplier/del_user',		//供应商删除用户
	adminBrandList:'api/brand/list',					//获取品牌列表
	adminBrandAddMember:'api/brand/add_user',			//品牌添加用户
	adminBrandMemberList:'api/brand/users',				//获取品牌商用户列表
	adminBrandEnableUser:'api/brand/enable_user',		//品牌启用/停用用户
	adminBrandDelUser:'api/brand/del_user',				//品牌删除用户
	adminBrandAdd:'api/brand/add',						//添加品牌
	adminBrandInfo:'api/brand/info',					//获取品牌详情
	adminBrandEdit:'api/brand/edit',					//编辑品牌
	adminBrandDel:'api/brand/del',						//删除品牌
	adminBrandCategory:'api/category/list',				//品类管理列表
	adminCategoryDel:'api/category/del',				//删除品类
	adminCategoryAdd:'api/category/add',				//添加品类
	adminBrandSeries:'api/series/list',					//系列管理列表
	adminSeriesDel:'api/series/del',					//删除系列
	adminSeriesAdd:'api/series/add',					//添加系列
	brandEditCategory:'api/brand/category',				//点击编辑选中的品类（详情或提交）
	brandEditSeries:'api/brand/series',					//点击编辑选中的系列（详情或提交）
	setColumns:'api/common/setcolumns',					//自定义列
	//主体
	ajaxParams:'api/company_main_body/ajax_params',		//获取所有下拉框数据
	companyMainBodyList:'api/company_main_body/list',	//公司主体资料表
	companyMainBodyAdd:'api/company_main_body/add',		//添加公司主体
	companyMainBodyEdit:'api/company_main_body/edit',	//编辑公司主体
	ajaxCompany:'api/company_main_body/ajax_company',	//获取客户列表
	companyMainBodyInfo:'api/company_main_body/info',	//获取主体详情
	mainBodyInfoImport:'api/company_main_body/import_company',	//公司主体资料表导入
	shopList:'api/company_main_body/shop_list',			//店铺基础授权资料
	importShop:'api/company_main_body/import_shop',		//店铺基础授权资料导入
	addShop:'api/company_main_body/add_shop',			//创建店铺基础授权资料
	editShop:'api/company_main_body/edit_shop',			//编辑店铺基础授权资料
	shopInfo:'api/company_main_body/shop_info',			//店铺基础授权资料详情
	transferMian:'api/company_main_body/transfer',		//转移主体
	changeList:'api/company_main_body/change_list',		//获取主体变更记录
	customList:'api/company_main_body/custom_list',		//客户列表
	addCustom:'api/company_main_body/add_custom',		//添加客户资料
	editCustom:'api/company_main_body/edit_custom',		//编辑客户资料
	customUsers:'api/company_main_body/custom_users',	//客户成员表
	addCustomUser:'api/company_main_body/add_custom_user',	//客户添加成员
	customCompany:'api/company_main_body/custom_company',	//客户主体表

	//权限
	accessList:'api/access/accesslist',					//权限录入列表
	getMainMenus:'api/access/getmainmenus',				//获取所属菜单列表
	ajaxAccess:'api/access/ajaxaccess',					//根据菜单获取按钮列表
	getControllers:'api/access/getcontrollers',			//获取所有控制器列表
	getMethods:'api/access/getmethods',					//根据选中的控制器获取方法列表
	accessAdd:'api/access/add',							//添加权限
	accessInfo:'api/access/getinfo',					//权限信息
	accessEdit:'api/access/edit',						//编辑权限
	accessDel:'api/access/del',							//删除权限
	menuroleList:'api/menurole/list',					//访问权限列表
	menuroleAdd:'api/menurole/add',						//新增角色获取列表/提交
	menuroleEdit:'api/menurole/edit',					//编辑角色获取详情/提交
	menuRoleDel:'api/menurole/del',						//删除角色
	menuroleInfo:'api/menurole/info',					//角色详情
	menuroleUsers:'api/menurole/users',					//角色下面的用户列表
	ajaxRoleList:'api/user/ajaxrolelist',				//权限配置角色筛选项列表
	userList:'api/user/list',							//用户列表
	userInfo:'api/user/info',							//获取用户详情
	userEdit:'api/user/edit',							//编辑前获取详情/编辑提交

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
	//供应商启用/停用用户
	adminSupplierEnableUser(params){
		return http.post(path.adminSupplierEnableUser, params)
	},
	//供应商删除用户
	adminSupplierDelUser(params){
		return http.post(path.adminSupplierDelUser, params)
	},
	//获取品牌列表
	adminBrandList(params){
		return http.get(path.adminBrandList, params)
	},
	//品牌添加用户
	adminBrandAddMember(params){
		return http.post(path.adminBrandAddMember, params)
	},
	//获取品牌商用户列表
	adminBrandMemberList(params){
		return http.get(path.adminBrandMemberList, params)
	},
	//品牌启用/停用用户
	adminBrandEnableUser(params){
		return http.post(path.adminBrandEnableUser, params)
	},
	//品牌删除用户
	adminBrandDelUser(params){
		return http.post(path.adminBrandDelUser, params)
	},
	//添加品牌
	adminBrandAdd(params){
		return http.post(path.adminBrandAdd, params)
	},
	//获取品牌详情
	adminBrandInfo(params){
		return http.get(path.adminBrandInfo, params)
	},
	//编辑品牌
	adminBrandEdit(params){
		return http.post(path.adminBrandEdit, params)
	},
	//删除品牌
	adminBrandDel(params){
		return http.post(path.adminBrandDel, params)
	},
	//品类管理列表
	adminBrandCategory(params){
		return http.get(path.adminBrandCategory, params)
	},
	//删除品类
	adminCategoryDel(params){
		return http.post(path.adminCategoryDel, params)
	},
	//添加品类
	adminCategoryAdd(params){
		return http.post(path.adminCategoryAdd, params)
	},
	//系列管理列表
	adminBrandSeries(params){
		return http.get(path.adminBrandSeries, params)
	},
	//删除系列
	adminSeriesDel(params){
		return http.post(path.adminSeriesDel, params)
	},
	//添加系列
	adminSeriesAdd(params){
		return http.post(path.adminSeriesAdd, params)
	},
	//权限录入列表
	accessList(params){
		return http.get(path.accessList, params)
	},
	//获取所属菜单列表
	getMainMenus(params){
		return http.get(path.getMainMenus, params)
	},
	//根据菜单获取按钮列表
	ajaxAccess(params){
		return http.get(path.ajaxAccess, params)
	},
	//获取所有控制器列表
	getControllers(params){
		return http.get(path.getControllers, params)
	},
	//根据选中的控制器获取方法列表
	getMethods(params){
		return http.get(path.getMethods, params)
	},
	//添加权限
	accessAdd(params){
		return http.post(path.accessAdd, params)
	},
	//权限信息
	accessInfo(params){
		return http.get(path.accessInfo, params)
	},
	//编辑权限
	accessEdit(params){
		return http.post(path.accessEdit, params)
	},
	//删除权限
	accessDel(params){
		return http.post(path.accessDel, params)
	},
	//访问权限列表
	menuroleList(params){
		return http.get(path.menuroleList, params)
	},
	//新增角色获取列表
	menuroleAddGet(params){
		return http.get(path.menuroleAdd, params)
	},
	//新增角色
	menuroleAddPost(params){
		return http.post(path.menuroleAdd, params)
	},
	//点击编辑角色获取详情
	menuroleEditGet(params){
		return http.get(path.menuroleEdit, params)
	},
	//角色编辑提交
	menuroleEditPost(params){
		return http.post(path.menuroleEdit, params)
	},
	//删除角色
	menuRoleDel(params){
		return http.post(path.menuRoleDel, params)
	},
	//角色详情
	menuroleInfo(params){
		return http.get(path.menuroleInfo, params)
	},
	//角色下面的用户列表
	menuroleUsers(params){
		return http.get(path.menuroleUsers, params)
	},
	//权限配置角色筛选项列表
	ajaxRoleList(params){
		return http.get(path.ajaxRoleList, params)
	},
	//用户列表
	userList(params){
		return http.get(path.userList, params)
	},
	//用户详情
	userInfo(params){
		return http.get(path.userInfo, params)
	},
	//编辑前获取详情
	userEditGet(params){
		return http.get(path.userEdit, params)
	},
	//编辑前获取详情
	userEditPost(params){
		return http.post(path.userEdit, params)
	},
	//编辑品类前获取详情
	brandEditCategoryGet(params){
		return http.get(path.brandEditCategory, params)
	},
	//编辑品类提交
	brandEditCategoryPost(params){
		return http.post(path.brandEditCategory, params)
	},
	//编辑系列前获取详情
	brandEditSeriesGet(params){
		return http.get(path.brandEditSeries, params)
	},
	//编辑系列提交
	brandEditSeriesPost(params){
		return http.post(path.brandEditSeries, params)
	},
	//自定义列
	setColumns(params){
		return http.post(path.setColumns, params)
	},
	//获取所有下拉框数据
	ajaxParams(params){
		return http.get(path.ajaxParams, params)
	},
	//公司主体资料表
	companyMainBodyList(params){
		return http.get(path.companyMainBodyList, params)
	},
	//添加公司主体
	companyMainBodyAdd(params){
		return http.post(path.companyMainBodyAdd, params)
	},
	//编辑前获取公司主体信息
	companyMainBodyEditGet(params){
		return http.get(path.companyMainBodyEdit, params)
	},
	//编辑公司主体
	companyMainBodyEditPost(params){
		return http.post(path.companyMainBodyEdit, params)
	},
	//获取客户列表
	ajaxCompany(params){
		return http.get(path.ajaxCompany, params)
	},
	//获取主体详情
	companyMainBodyInfo(params){
		return http.get(path.companyMainBodyInfo, params)
	},
	//公司主体资料表导入
	mainBodyInfoImport(params){
		return http.post(path.mainBodyInfoImport, params)
	},
	//店铺基础授权资料
	shopList(params){
		return http.get(path.shopList, params)
	},
	//店铺基础授权资料导入
	importShop(params){
		return http.post(path.importShop, params)
	},
	//创建前获取店铺基础授权资料
	addShop(params){
		return http.post(path.addShop, params)
	},
	//编辑前获取店铺基础授权资料
	editShopGet(params){
		return http.get(path.editShop, params)
	},
	//编辑店铺基础授权资料提交
	editShopPost(params){
		return http.post(path.editShop, params)
	},
	//店铺基础授权资料详情
	shopInfo(params){
		return http.get(path.shopInfo, params)
	},
	//转移主体
	transferMian(params){
		return http.post(path.transferMian, params)
	},
	//主体变更记录
	changeList(params){
		return http.get(path.changeList, params)
	},
	//客户列表
	customList(params){
		return http.get(path.customList, params)
	},
	//添加客户资料
	addCustom(params){
		return http.post(path.addCustom, params)
	},
	//编辑前获取客户资料
	editCustomGet(params){
		return http.get(path.editCustom, params)
	},
	//编辑客户资料提交
	editCustomPost(params){
		return http.post(path.editCustom, params)
	},
	//客户成员表
	customUsers(params){
		return http.get(path.customUsers, params)
	},
	//客户添加成员
	addCustomUser(params){
		return http.post(path.addCustomUser, params)
	},
	//客户主体表
	customCompany(params){
		return http.get(path.customCompany, params)
	},
	
}









