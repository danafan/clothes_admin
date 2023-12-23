<template>
	<div class="container nav_menu flex">
		<!-- 左侧导航 -->
		<div class="menu_box h_100 flex fc ac" :class="{'menu_box_down':!menu_status}">
			<!-- 标题 -->
			<div class="title f16 white_color bold flex ac jc border">
				<div>服装</div>
				<div v-if="menu_status">综合服务系统</div>
			</div>
			<!-- 收起/展开按钮 -->
			<div class="w_100 flex mt24" :class="[{'jse':menu_status},{'pr16':menu_status},{'mb24':menu_status},{'jc':!menu_status}]">
				<img class="menu_status_icon pointer" src="@/static/menu_down_icon.png" v-if="menu_status" @click="menu_status = false">
				<img class="menu_status_icon pointer" src="@/static/menu_up_icon.png" @click="menu_status = true" v-else>
			</div>
			<!-- 收起-显示菜单图标 -->
			<div v-if="!menu_status">
				<div class="menu_item flex ac jc pointer relative" v-for="(menu,index) in menuList">
					<a-popover overlayClassName="a_popover" placement="rightTop" trigger="hover">
						<template slot="content">
							<div class="popover_menu_item flex ac jsb pointer pl24 pr24" :class="{'menu_item_content_active':child.hover || child.active}" @mouseenter="mouseMenu(index,child_index,true)" @mouseleave="mouseMenu(index,child_index,false)" @click="checkMenu(child,index)" v-for="(child,child_index) in menu.children">
								<div class="flex ac">
									<img class="menu_icon" :src="child.icon_active" v-if="menu.active">
									<img class="menu_icon" :src="child.icon" v-else>
									<div class="f16 fw400" :class="{'active_color':child.active}">{{child.name}}</div>
								</div>
								<div class="dot"></div>
							</div>
						</template>
						<img class="menu_icon_big" :src="menu.icon_big_active" v-if="menu.active">
						<img class="menu_icon_big" :src="menu.icon_big" v-else>
					</a-popover>
				</div>
			</div>
			<!-- 展开-显示菜单列表 -->
			<div class="w_100" v-if="menu_status">
				<div class="w_100" v-for="(menu,index) in menuList">
					<div class="menu_item pl24 pr24 flex ac jsb pointer border" @click="$store.commit('checkMenuStatus',index)">
						<div class="flex ac">
							<img class="menu_icon" :src="menu.icon_active" v-if="menu.active">
							<img class="menu_icon" :src="menu.icon" v-else>
							<div class="menu_name f14 fw400 space-nowrap" :class="{'active_color':menu.active}">{{menu.name}}</div>
						</div>
						<img class="arrow_icon" :class="{'arrow_icon_up':menu.active}" src="@/static/arrow_up_icon.png" v-if="menu.children">
					</div>
					<div class="supplier_menu_children" v-if="menu.active && menu.children">
						<div class="menu_item pl16 pr16 flex ac jsb pointer" @mouseenter="mouseMenu(index,child_index,true)" @mouseleave="mouseMenu(index,child_index,false)" @click="checkMenu(child,index)" v-for="(child,child_index) in menu.children">
							<div class="w_100 h_100 flex ac jsb pl24 pr24 border">
								<div class="flex ac">
									<img class="menu_icon" :src="child.icon_active" v-if="child.active">
									<img class="menu_icon" :src="child.icon" v-else>
									<div class="menu_name f14 fw400 space-nowrap" :class="{'active_color':child.active}">{{child.name}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 右侧页面 -->
		<div class="flex-1 ml24 flex fc">
			<div class="flex jse mb24">
				<div class="admin_setting flex ac jc f14 fw400">{{userInfo.wx_user_name}} ｜ 退出</div>
			</div>
			<div class="tab_pane flex flex-warp mb16">
				<div class="tab_item flex ac f14 mr32 mb16 pointer" :class="{'active_tab_item_bg':item.hover || item.active}" @mouseenter="mouseTab(index,true)" @mouseleave="mouseTab(index,false)" @click="$store.commit('checkTab',item)" v-for="(item,index) in tabsList">
					<div class="space-nowrap">{{item.name}}</div>
					<img class="tab_close" src="@/static/tab_close_active.png" @click.stop="$store.commit('deleteTab',item)" v-if="(item.hover || item.active) && !item.default">
					<img class="tab_close" src="@/static/tab_close.png" @click.stop="$store.commit('deleteTab',item)" v-if="!item.hover && !item.active && !item.default">
				</div>
			</div>
			<div class="page_container flex-1">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				menu_status:true,
			}
		},
		created(){
			this.$store.commit('initMenuStatus',this.$route.path)
		},
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			},
			//菜单列表
			menuList(){
				return this.$store.state.menuList;
			},
			//当前已打开的标签页列表
			tabsList(){
				return this.$store.state.tabsList;
			}
		},
		methods:{
			//鼠标移入/移出二级菜单
			mouseMenu(index,child_index,bool){
				let arg = {
					index:index,
					child_index:child_index,
					bool:bool
				}
				this.$store.commit('mouseMenu',arg);
			},
			//切换导航
			checkMenu(child,index){
				child['parent_index'] = index;
				this.$store.commit('checkMenu',child)
			},
			//鼠标移入/移出标签页
			mouseTab(index,bool){
				let arg = {
					index:index,
					bool:bool
				}
				this.$store.commit('mouseTab',arg);
			},
		}
	}
</script>
<style type="text/css">
	.a_popover .popover_menu_item{
		height: 56px;
		width: 228px;
		color:#718096;
		border-radius: 14px;
	}
	.a_popover .menu_item_content_active{
		background-color: rgba(63,140,255, 0.1);
	}
	.a_popover .active_color{
		color: #3F8CFF;
	}
	.a_popover .menu_icon{
		margin-right: 8px;
		width: 16px;
		height: 16px;
	}
	.a_popover .menu_icon_big{
		width: 24px;
		height: 24px;
	}
	.a_popover .arrow_icon{
		transform-origin: 50% 50%;
		transition: all 0.3s;
		width: 14px;
		height: 14px;
	}
	.a_popover .arrow_icon_up{
		transform: rotate(-180deg);
	}
	.a_popover .dot{
		border-radius: 50%;
		width: 8px;
		height: 8px;
		background: #DB0000;
	}
</style>
<style lang="less" scoped>
	.nav_menu{
		background-color:#F0F1F7;
		.menu_box{
			width: 260px;
			background: #001147;
			.title{
				width: 100%;
				height: 64px;
				font-family: Ma;
			}
			.menu_status_icon{
				width: 12px;
				height: 10px;
			}
			.menu_item{
				height: 56px;
				.menu_name{
					color:#B6BDD0;
				}
				.active_color{
					color:#ffffff;
				}
				.menu_icon{
					margin-right: 8px;
					width: 16px;
					height: 16px;
				}
				.menu_icon_big{
					width: 24px;
					height: 24px;
				}
				.arrow_icon{
					transform-origin: 50% 50%;
					transition: all 0.3s;
					width: 14px;
					height: 14px;
				}
				.arrow_icon_up{
					transform: rotate(-180deg);
				}
			}
			.supplier_menu_children{
				overflow: hidden;
				animation: animate 0.15s linear;
			}
			@keyframes animate{
				from {
					height: 0px;
				}
				to {
					height: 168px;
				}
			}
		}
		.menu_box_down{
			width: 64px;
			overflow: hidden;
		}
		.admin_setting{
			width: 133px;
			height: 36px;
			background: #FFFFFF;
			border-radius: 8px;
			color: #718096;
		}	
		.tab_pane{
			padding: 16px 24px 0;
			background: #FFFFFF;
			border-radius: 24px;
			.tab_item{
				border: 1px solid #E3E3E3;
				background: #FFFFFF;
				color: #999999;
				padding-left: 16px;
				padding-right: 16px;
				height: 32px;
				border-radius: 4px;
				.tab_close{
					margin-left: 8px;
					width: 7px;
					height: 7px;
				}
			}
			.active_tab_item_bg{
				border:1px solid #609DFF;
				background: #EBF3FF;
				color: #609DFF;
			}
		}
		.page_container{
			padding: 16px 24px;
			background: #FFFFFF;
			border-radius: 24px;
		}
	}
</style>