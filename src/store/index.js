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
			open:false,
			children:[{
				name:'访问权限',
				icon:require('@/static/access_authority.png'),
				icon_active:require('@/static/access_authority.png'),
				path:'/access_authority',
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
		//点击一级菜单
		checkMenuStatus(state, index){
			if(state.menuList[index].children){
				state.menuList.map((menu,menu_index) => {
					if(menu.children){
						if(menu_index == index){
							menu.open = !menu.open;
						}else{
							menu.open = false;
						}
					}
				})
			}else{
				//切换导航
				this.commit('checkMenu',state.menuList[index])
			}
		},
    	//鼠标移入/移出二级菜单
		mouseMenu(state, arg){
			state.menuList[arg.index].children[arg.child_index].hover = arg.bool;
		},
		//切换导航
		checkMenu(state, menu_item){
			state.active_path = menu_item.path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			state.menuList.map((menu,index) => {
				menu.active = menu_item.parent_index == index;
				if(menu.children){
					menu.children.map(child => {
						child.active = child.path == menu_item.path;
					})
				}
			})
			// 处理标签页
			let index = state.tabsList.findIndex(item => {
				return item.path == menu_item.path;
			})
			if(index == -1){				//打开新标签
				let tab_item = {
					parent_index:menu_item.parent_index,
					name:menu_item.name,
					path:menu_item.path,
					hover:false,
					active:true
				}
				state.tabsList.map(item => {
					item.active = false;
				})
				state.tabsList.push(tab_item);
			}else{							//切换标签
				state.tabsList.map(item => {
					item.active = menu_item.path == item.path;
				})
			}
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//鼠标移入/移出标签页
		mouseTab(state, arg){
			state.tabsList[arg.index].hover = arg.bool;
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
		},
		//切换标签页
		checkTab(state, tab){
			state.active_path = tab.path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			state.menuList.map((menu,index) => {
				menu.active = tab.parent_index == index;
				menu.children.map(child => {
					child.active = child.path == tab.path;
				})
			})
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
				state.active_path = state.tabsList[index - 1].path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
				let current_menu_index = state.tabsList[index - 1].parent_index;
				state.menuList.map((menu,menu_index) => {
					menu.active = current_menu_index == menu_index;
					menu.children.map(child => {
						child.active = child.path == state.active_path;
					})
				})
				state.tabsList[index - 1].active = true;
				state.tabsList.splice(index,1);
			}else{
				state.tabsList.splice(index,1);
			}
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
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
