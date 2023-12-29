import Vue from "vue";
import Vuex from "vuex";

import router from '@/router'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		menuList:[{
			name:'商品资料审核',
			icon:require('@/static/goods_audit_icon.png'),
			icon_active:require('@/static/goods_audit_icon_active.png'),
			icon_big:require('@/static/goods_audit_icon.png'),
			icon_big_active:require('@/static/goods_audit_icon_active.png'),
			path:'/product_audit',
			active:false
		},{
			name:'供应商列表',
			icon:require('@/static/supplier_icon.png'),
			icon_active:require('@/static/supplier_icon_active.png'),
			icon_big:require('@/static/supplier_icon.png'),
			icon_big_active:require('@/static/supplier_icon_active.png'),
			path:'/supplier_list',
			active:false
		},{
			name:'品牌属性库',
			icon:require('@/static/brand_stats.png'),
			icon_active:require('@/static/brand_stats_active.png'),
			icon_big:require('@/static/brand_stats.png'),
			icon_big_active:require('@/static/brand_stats_active.png'),
			path:'/brand_attribute',
			active:false
		},{
			name:'权限管理',
			icon:require('@/static/auth_management.png'),
			icon_active:require('@/static/auth_management_active.png'),
			icon_big:require('@/static/auth_management.png'),
			icon_big_active:require('@/static/auth_management_active.png'),
			path:'/permission',
			open:false,
			children:[{
				name:'权限配置',
				icon:require('@/static/auth_setting.png'),
				icon_active:require('@/static/auth_setting_active.png'),
				path:'/auth_setting',
				parent_index:3,
				active:false
			},{
				name:'访问权限',
				icon:require('@/static/access_auth.png'),
				icon_active:require('@/static/access_auth_active.png'),
				path:'/access_authority',
				parent_index:3,
				active:false
			},{
				name:'权限录入',
				icon:require('@/static/auth_enter.png'),
				icon_active:require('@/static/auth_enter_active.png'),
				path:'/auth_enter',
				parent_index:3,
				active:false
			}]
		}],												//导航列表
		active_path:sessionStorage.getItem("activePath")?JSON.parse(sessionStorage.getItem("activePath")):'/product_audit',								//当前选中的菜单
		tabsList:sessionStorage.getItem("tabsList")?JSON.parse(sessionStorage.getItem("tabsList")):[],												//当前已打开的菜单列表
		domain:"",										//文件前缀
		userInfo:null,									//用户信息
		tableTotalWidth:0,								//表格可用宽度
	},
	mutations: {
		//设置表格可用宽度
		setTableTotalWidth(state, width){
			state.tableTotalWidth = width;
		},
		//点击切换一级导航
		checkMenu(state,index){
			if(state.menuList[index].children){			//包含子菜单
				state.menuList.map((menu_item,menu_index) => {
					if(menu_item.children){
						menu_item.open = menu_index == index;
					}
				})
			}else{								//不包含子菜单
				state.menuList.map((menu_item,menu_index) => {
					if(!menu_item.children){
						menu_item.active = menu_index == index;
					}else{
						menu_item.open = false;
					}
				})
				let path = state.menuList[index].path;
				// 处理标签页
				let tab_index = state.tabsList.findIndex(item => {
					return item.path == path;
				})
				if(tab_index == -1){				//打开新标签
					state.tabsList.push(state.menuList[index]);
				}
				state.tabsList.map(tab => {
					tab.active = tab.path == path;
				})
				state.active_path = path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
				router.push(state.active_path);
			}
		},
		//点击切换二级导航
		checkChildMenu(state, arg){
			state.menuList.map((menu_item,menu_index) => {
				if(menu_index == arg.index){
					menu_item.open = true;
					menu_item.children.map((item,child_index) => {
						item.active = child_index == arg.child_index;
					})
				}else{
					if(menu_item.children){
						menu_item.open = false;
						menu_item.children.map(item => {
							item.active = false;
						})
					}else{
						menu_item.active = false;
					}
				}
			})

			// 处理标签页
			let path = state.menuList[arg.index].children[arg.child_index].path;
			let tab_index = state.tabsList.findIndex(item => {
				return item.path == path;
			})
			if(tab_index == -1){				//打开新标签
				state.tabsList.map(item => {
					item.active = false;
				})
				state.tabsList.push(state.menuList[arg.index].children[arg.child_index]);
			}else{							//切换标签
				state.tabsList.map((item,item_index) => {
					item.active = item_index == tab_index;
				})
			}
			state.active_path = path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//切换标签页
		checkTab(state,tab){
			state.menuList.map((item,index) => {
				if(tab.path == item.path){
					item.active = true;
				}else{
					item.active = false;
					if(item.children){
						item.children.map(child => {
							child.active = tab.path == child.path;
						})
						let child_index = item.children.findIndex(child => {
							return child.path == tab.path;
						})
						item.open = child_index > -1;
					}
					
				}
			})
			state.tabsList.map(item => {
				item.active = item.path == tab.path;
			})
			state.active_path = tab.path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//删除标签页
		deleteTab(state,tab){
			var index = state.tabsList.findIndex(item => {
				return item.path == tab.path;
			})
			var active_menu = state.tabsList[index - 1];
			if(tab.active){		//删除的是当前展示的菜单
				// 处理标签页
				state.tabsList.map((tab,tab_index) => {
					tab.active = tab_index == index - 1;
				})
				//处理菜单
				state.menuList.map(item => {
					if(!item.children){
						item.active = active_menu.path == item.path;
					}else{
						item.children.map(child => {
							child.active = active_menu.path == child.path;
						})
						let child_index = item.children.findIndex(child => {
							return active_menu.path == child.path;
						})
						item.open = child_index > -1;
					}
				})
				
				state.active_path = active_menu.path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
				state.tabsList.splice(index,1);
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
				router.push(state.active_path);
			}else{
				state.tabsList.splice(index,1);
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			}
		},
		//初始化导航样式
		initMenuStatus(state,path){
			let current_index = state.menuList.findIndex(item => {
				return item.path == path;
			})
			if(current_index == -1){		//是子菜单
				state.menuList.map((menu,index) => {
					if(menu.children){
						let child_index = menu.children.findIndex(child => {
							child.active = child.path == path;
							return child.path == path;
						})
						menu.open = child_index > -1;
					}
				})
			}else{							//不是子菜单
				state.menuList.map((menu,index) => {
					menu.active = index == current_index;
				})
			}
		},
		//设置用户信息
		setUserInfo(state,user_info){
			state.domain = user_info.img_domain;
			state.userInfo = user_info;
		}

	},
	actions: {

	}
});
export default store;
