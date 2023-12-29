<template>
	<div class="container nav_menu flex">
		<!-- 左侧导航 -->
		<div class="menu_box menu_bg h_100 flex fc ac" :class="{'menu_box_down':!menu_status}">
			<!-- 标题 -->
			<div class="title w_100 f16 white_color bold" v-if="menu_status">
				服装综合服务系统
			</div>
			<!-- 收起/展开按钮 -->
			<div class="right_top w_100 flex ac" :class="[{'jse':menu_status},{'pr16':menu_status},{'jc':!menu_status}]">
				<img class="menu_status_icon pointer" src="@/static/menu_down_icon.png" v-if="menu_status" @click="menu_status = false">
				<img class="menu_status_icon pointer" src="@/static/menu_up_icon.png" @click="menu_status = true" v-else>
			</div>
			<!-- 收起-显示菜单图标 -->
			<div class="w_100" v-if="!menu_status">
				<div class="menu_height w_100 flex ac jc pointer relative" @mouseenter="menu_index = index" @mouseleave="menu_index = -1" @click="$store.commit('checkMenu',index)" v-for="(menu,index) in menuList">
					<img class="menu_icon_big" :src="menu.icon_big_active" v-if="menu_index == index || menu.active || menu.open">
					<img class="menu_icon_big" :src="menu.icon_big" v-else>
					<div class="child_menu_box" v-if="menu_index == index && menu.children">
						<div class="popover_menu_item flex ac jc pointer" @mouseenter="menu_child_index = child_index" @mouseleave="menu_child_index = -1" @click="checkChildMenu(index,child_index)" v-for="(child,child_index) in menu.children">
							<img class="menu_icon" :src="child.icon_active" v-if="menu_child_index == child_index || child.active">
							<img class="menu_icon" :src="child.icon" v-else>
							<div class="menu_name f14 fw400" :class="{'active_color':menu_child_index == child_index || child.active}">{{child.name}}</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 展开-显示菜单列表 -->
			<div class="w_100" v-if="menu_status">
				<div class="w_100" v-for="(menu,index) in menuList">
					<div class="menu_height pl24 pr34 flex ac jsb pointer" @mouseenter="menu_index = index" @mouseleave="menu_index = -1" @click="$store.commit('checkMenu',index)">
						<div class="flex ac">
							<img class="menu_icon" :src="menu.icon_active" v-if="menu_index == index || menu.active">
							<img class="menu_icon" :src="menu.icon" v-else>
							<div class="menu_name f14 fw400 space-nowrap" :class="{'active_color':menu_index == index || menu.active}">{{menu.name}}</div>
						</div>
						<img class="arrow_icon" :class="{'arrow_icon_up':menu.open}" src="@/static/arrow_up_icon.png" v-if="menu.children">
					</div>
					<div class="supplier_menu_children" v-if="menu.open">
						<div class="menu_height pl16 pr16 flex ac jsb pointer" @mouseenter="menu_child_index = child_index" @mouseleave="menu_child_index = -1" @click="checkChildMenu(index,child_index)" v-for="(child,child_index) in menu.children">
							<div class="w_100 h_100 flex ac jsb pl24 pr24">
								<div class="flex ac">
									<img class="menu_icon" :src="child.icon_active" v-if="menu_child_index == child_index || child.active">
									<img class="menu_icon" :src="child.icon" v-else>
									<div class="menu_name f14 fw400 space-nowrap" :class="{'active_color':menu_child_index == child_index || child.active}">{{child.name}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 右侧页面 -->
		<div class="flex-1 flex fc">
			<div class="menu_bg right_top flex ac pr16" :class="[{'jse':menu_status},{'jsb':!menu_status}]">
				<!-- 标题 -->
				<div class="title f16 white_color bold" v-if="!menu_status">
					服装综合服务系统
				</div>
				<div class="admin_setting f14 fw400">{{userInfo.wx_user_name}} ｜ 退出</div>
			</div>
			<div class="tab_pane flex flex-warp">
				<div class="tab_item flex ac f14 mr12 pointer" :class="{'active_tab_item_bg':tab.active}" @mouseenter="tab_hover_index = index" @mouseleave="tab_hover_index = -1" @click="$store.commit('checkTab',tab)" v-for="(tab,index) in tabsList">
					<div class="space-nowrap">{{tab.name}}</div>
					<img class="tab_close" src="@/static/tab_close_active.png" @click.stop="$store.commit('deleteTab',tab)" v-if="tab_hover_index == index || tab.active">
					<img class="tab_close" src="@/static/tab_close.png" @click.stop="$store.commit('deleteTab',tab)" v-else>
				</div>
			</div>
			<div class="page_container flex-1">
				<div class="page_card h_100">
					<router-view></router-view>
				</div>
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
				menu_index:-1,					//当前鼠标移入的一级菜单下标
				menu_child_index:-1,			//当前鼠标移入的二级菜单下标
				tab_hover_index:-1,				//当前鼠标移入的标签下标
			}
		},
		created(){
			this.$store.commit('initMenuStatus',this.$route.path);
			//获取表格可用宽度
			this.getTotalWidth();
		},
		watch:{
			menu_status:function(n,o){
				//获取表格可用宽度
				this.getTotalWidth();
			}	
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
			//获取表格可用宽度
			getTotalWidth(){
				let window_width = document.documentElement.clientWidth;
				this.$store.commit('setTableTotalWidth',this.menu_status?window_width - 348:window_width - 158)
			},
			//切换二级导航
			checkChildMenu(index,child_index){
				let arg = {
					index:index,
					child_index:child_index
				}
				this.$store.commit('checkChildMenu',arg)
			}
		}
	}
</script>
<style lang="less" scoped>
	.nav_menu{
		background-color:#F0F1F7;
		.menu_bg{
			background-color: #001147;
		}
		.menu_box{
			width: 252px;
			.menu_height{
				height: 56px;
			}
			.menu_status_icon{
				width: 12px;
				height: 10px;
			}
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
				width: 14px;
				height: 14px;
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
			.child_menu_box{
				position: absolute;
				top:0;
				left:62px;
				width:160px;
				z-index:999;
				.popover_menu_item{
					background: #001147;
					height: 56px;
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
			width: 62px;
		}
		.title{
			text-align: center;
			height: 64px;
			line-height: 64px;
			font-family: Ma;
		}
		.right_top{
			height: 64px;
		}
		.admin_setting{
			color: #B6BDD0;
		}	
		.tab_pane{
			padding: 8px 24px;
			background: #FFFFFF;
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
			.tab_item:hover{
				border:1px solid #609DFF;
				color: #609DFF;
			}
			.active_tab_item_bg{
				border:1px solid #609DFF;
				color: #609DFF;
			}
		}
		.page_container{
			padding: 16px 24px;
			.page_card{
				background: #FFFFFF;
				padding: 16px 24px;
			}
		}
	}
</style>