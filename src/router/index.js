import Vue from "vue";
import Router from "vue-router";

const login = (resolve) => require(["@/pages/login"], resolve);
const nav_menu = (resolve) => require(["@/pages/nav_menu"], resolve);
const product_audit = (resolve) => require(["@/pages/product_audit"], resolve);
const supplier_list = (resolve) => require(["@/pages/supplier_list"], resolve);
const brand_attribute = (resolve) => require(["@/pages/brand_attribute"], resolve);
const auth_setting = (resolve) => require(["@/pages/permission/auth_setting"], resolve);
const access_authority = (resolve) => require(["@/pages/permission/access_authority"], resolve);
const auth_enter = (resolve) => require(["@/pages/permission/auth_enter"], resolve);
const main_info = (resolve) => require(["@/pages/mainStore/main_info"], resolve);
const basic_auth_info = (resolve) => require(["@/pages/mainStore/basic_auth_info"], resolve);


Vue.use(Router);

const router = new Router({
	routes: [
	{
		path: "/login",
		name: "登录",
		component: login
	},
	{
		path: "/nav_menu",
		component: nav_menu,
		name: "导航页",
		children: [
		{
			path: "/product_audit",
			name: "商品资料审核",
			component: product_audit
		},{
			path: "/supplier_list",
			name: "供应商列表",
			component: supplier_list
		},{
			path: "/brand_attribute",
			name: "品牌属性库",
			component: brand_attribute
		},{
			path: "/auth_setting",
			name: "权限配置",
			component: auth_setting
		},{
			path: "/access_authority",
			name: "访问权限",
			component: access_authority
		},{
			path: "/auth_enter",
			name: "权限录入",
			component: auth_enter
		},{
			path: "/main_info",
			name: "主体资料表",
			component: main_info
		},{
			path: "/basic_auth_info",
			name: "店铺基础授权资料",
			component: basic_auth_info
		}
		],
	},
	],
});

router.beforeEach((to, from, next) => {
	next();
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};
export default router;
