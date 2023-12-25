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
			hover:false,
			active:false
		},{
			name:'供应商列表',
			icon:require('@/static/supplier_icon.png'),
			icon_active:require('@/static/supplier_icon_active.png'),
			icon_big:require('@/static/supplier_icon.png'),
			icon_big_active:require('@/static/supplier_icon_active.png'),
			path:'/supplier_list',
			hover:false,
			active:false
		},{
			name:'品牌属性库',
			icon:require('@/static/brand_stats.png'),
			icon_active:require('@/static/brand_stats_active.png'),
			icon_big:require('@/static/brand_stats.png'),
			icon_big_active:require('@/static/brand_stats_active.png'),
			path:'/brand_attribute',
			hover:false,
			active:false
		},{
			name:'权限配置',
			icon:require('@/static/auth_icon.png'),
			icon_active:require('@/static/auth_icon_active.png'),
			icon_big:require('@/static/auth_icon.png'),
			icon_big_active:require('@/static/auth_icon_active.png'),
			path:'/permission',
			hover:false,
			active:false,
			open:false,
			children:[{
				name:'访问权限',
				icon:require('@/static/access_authority.png'),
				icon_active:require('@/static/access_authority_active.png'),
				path:'/access_authority',
				parent_index:3,
				hover:false,
				active:false
			}]
		}],												//导航列表
		active_path:sessionStorage.getItem("activePath")?JSON.parse(sessionStorage.getItem("activePath")):'/home',								//当前选中的菜单
		tabsList:sessionStorage.getItem("tabsList")?JSON.parse(sessionStorage.getItem("tabsList")):[],												//当前已打开的菜单列表
		domain:"",										//文件前缀
		userInfo:null,									//用户信息
	},
	mutations: {
    	//鼠标移入/移出菜单
		mouseMenu(state, arg){
			if(arg.type == 'parent'){		//一级
				state.menuList[arg.index].hover = arg.bool;
			}else{
				state.menuList[arg.index].children[arg.child_index].hover = arg.bool;
			}
		},
		//点击切换导航
		checkMenu(state, arg){
			if(arg.menu.children){			//包含子菜单
				state.menuList.map((menu_item,menu_index) => {
					if(arg.index == menu_index){
						menu_item['open'] = !menu_item.open;
					}else{
						menu_item['open'] = false;
					}
				})
			}else{								//不包含子菜单
				state.active_path = arg.menu.path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
				state.menuList.map((menu_item,menu_index) => {
					if(arg.menu.parent_index){	//点击的是子菜单
						menu_item.active = false;
						if(menu_index == arg.menu.parent_index){
							menu_item.open = true;
							menu_item.children.map((c,i) => {
								c.active = arg.child_index == i;
							})
						}else{
							if(menu_item.children){
								menu_item.open = false;
								menu_item.children.map((c,i) => {
									c.active = false;
								})
							}
						}
					}else{
						menu_item.active = menu_index == arg.index;
						if(menu_item.children){
							menu_item.open = false;
							menu_item.children.map((c,i) => {
								c.active = false;
							})
						}
					}
				})
				// 处理标签页
				let index = state.tabsList.findIndex(item => {
					return item.path == arg.menu.path;
				})
				if(index == -1){				//打开新标签
					arg.menu['active'] = true;
					state.tabsList.map(item => {
						item.active = false;
					})
					state.tabsList.push(arg.menu);
				}else{							//切换标签
					state.tabsList.map(item => {
						item.active = arg.menu.path == item.path;
					})
				}
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
				router.push(state.active_path);
			}
		},
		//鼠标移入/移出标签页
		mouseTab(state, arg){
			state.tabsList[arg.index].hover = arg.bool;
		},
		//切换标签页
		checkTab(state, tab){
			state.active_path = tab.path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			if(!tab.parent_index){
				state.menuList.map((menu,index) => {
					menu.active = tab.path == menu.path;
					if(menu.children){
						menu.open = false;
						menu.children.map(child => {
							child.active = false;
						})
					}
				})
			}else{
				state.menuList.map((menu,index) => {
					if(menu.children){
						menu.open = tab.parent_index == index;
						let current_child_index = menu.children.findIndex(item => {
							return item.path == tab.path;
						})
						menu.children.map((child,child_index) => {
							child.active = child_index == current_child_index;
						})
					}else{
						menu.active = false;
					}
				})
			}
			// 处理标签页
			let index = state.tabsList.findIndex(item => {
				return item.path == tab.path;
			})
			state.tabsList.map(item => {
				item.active = tab.path == item.path;
			})
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//删除标签页
		deleteTab(state,tab){
			let index = state.tabsList.findIndex(item => {
				return item.path == tab.path;
			})
			if(tab.active){		//删除的是当前展示的菜单
				let current_menu = state.tabsList[index - 1];
				state.active_path = current_menu.path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));

				// let arg = {
				// 	menu:current_menu,
				// 	index:current_menu.parent_index?current_menu.parent_index:'parent',
				// 	child_index:current_menu.parent_index?'child':'parent'
				// }
				// this.$store.commit('checkMenu',arg)
				
				// let arg = {
				// 	menu:current_menu,
				// 	index:current_menu.parent_index?current_menu.parent_index:,
				// 	type:current_menu.parent_index?'child':'parent'
				// }
				// this.$store.commit('checkMenu',arg)
				// let current_menu_index = state.tabsList[index - 1].parent_index;
				// state.menuList.map((menu,menu_index) => {
				// 	if(tab.parent_index){

				// 	}else{

				// 	}

				// 	menu.active = current_menu_index == menu_index;
				// 	menu.children.map(child => {
				// 		child.active = child.path == state.active_path;
				// 	})
				// })
				state.tabsList[index - 1].active = true;
				state.tabsList.splice(index,1);
			}else{
				state.tabsList.splice(index,1);
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			}
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
		},
		//初始化导航样式
		initMenuStatus(state,path){
			state.menuList.map((menu,index) => {
				menu.children.map(child => {
					if(child.path == path){
						menu.active = true;
						child.active = true;
					}else{
						child.active = false;
					}
				})
			})
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
