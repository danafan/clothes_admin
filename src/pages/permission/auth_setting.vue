<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jse mb16">
			<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
			<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="姓名：">
					<el-input style="width:198px" v-model="search" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item label="角色：">
					<el-select style="width:198px" v-model="role_ids" clearable multiple filterable collapse-tags placeholder="请选择">
						<el-option v-for="item in role_list" :key="item.menu_role_id" :label="item.menu_role_name" :value="item.menu_role_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<PageButton @callback="changePage(1)"/>
				</el-form-item>
			</el-form>
		</div>
		<!-- 表格内容 -->
		<div class="table_content" id="table_content">
			<div class="p16 flex ac" id="table_setting">
				<div class="table_color f14 fw500">数据列表</div>
			</div>
			<CustomTable tableName="authSetting" :selection="false" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" @editFn="editFn"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 添加/编辑 -->
		<custom-dialog dialogWidth="580px" dialogTitle="编辑用户" ref="editDialog" @close="clearForm" @callback="editConfirm">
			<el-form class="dialog_form" label-width="90px">
				<el-form-item label="姓名：">
					<div class="custom_value">{{wx_user_name}}</div>
				</el-form-item>
				<el-form-item label="访问权限：" required>
					<el-select style="width: 232px;" v-model="menu_role_ids" clearable multiple filterable collapse-tags reserve-keyword placeholder="请选择">
						<el-option v-for="item in edit_role_list" :key="item.menu_role_id" :label="item.menu_role_name" :value="item.menu_role_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分销品牌：" required>
					<el-select style="width: 232px;" v-model="brand_ids" clearable multiple filterable collapse-tags reserve-keyword placeholder="请选择">
						<el-option v-for="item in brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</custom-dialog>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'

	import ScreenButton from '@/components/screenButton'
	import PageButton from '@/components/pageButton'
	import SettingButton from '@/components/settingButton'
	import Pagination from '@/components/pagination'
	import CustomTable from '@/components/customTable'
	import CustomDialog from '@/components/customDialog'
	export default{
		data(){
			return{
				unfold:true,						//筛选条件是否展开
				search:"",							//搜索内容
				role_list:[],						//角色列表
				role_ids:[],						//选中的角色列表
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'姓名',
					prop:'wx_user_name',
				},{
					label:'主部门',
					prop:'main_dept_name'
				},{
					label:'职位',
					prop:'position',
				},{
					label:'角色',
					prop:'menu_role_name',
				},{
					label:'品牌',
					prop:'brand_name',
				},{
					label:'创建时间',
					prop:'add_time',
				}],
				tableData:[],
				table_height:0,
				loading:false,
				user_id:"",							//点击的用户ID
				wx_user_name:"",					//编辑展示的用户名
				edit_role_list:[],					//编辑的角色列表
				menu_role_ids:[],					//选中的角色列表
				brand_list:[],						//品牌列表
				brand_ids:[],						//选中的品牌列表
			}
		},
		watch:{
			//展开/收起筛选条件
			unfold:function(n,o){
				//设置表格高度
				this.onResize();
			},
		},
		destroyed() {
			window.removeEventListener("resize", () => {});
		},
		mounted() {
    		//设置表格高度
			this.onResize();
			window.addEventListener("resize", this.onResize());
		},
		created(){
			//权限配置角色筛选项列表
			this.ajaxRoleList();
			//获取列表
			this.getData();
		},
		methods: {
    		//设置表格高度
			onResize() {
				this.$nextTick(() => {
					let table_content_height = document.getElementById("table_content").offsetHeight;
					let table_setting_height = document.getElementById("table_setting").offsetHeight;
					this.table_height = table_content_height - table_setting_height - 30;
				});
			},
			//权限配置角色筛选项列表
			ajaxRoleList(){
				resource.ajaxRoleList().then(res => {
					if(res.data.code == 1){
						this.role_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getData(){
				let arg = {
					search:this.search,
					menu_role_id:this.role_ids.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.userList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.tableData = data.data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换页码
			changePage(page){
				this.page = page;
				//获取列表
				this.getData();
			},
			//点击编辑
			editFn(row){
				this.user_id = row.user_id;
				resource.userEditGet({user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						let user_info = data.info;
						this.wx_user_name = user_info.wx_user_name;
						this.menu_role_ids = user_info.menu_role_ids;
						this.brand_ids = user_info.brand_ids;
						this.edit_role_list = data.menu_role_list;
						this.brand_list = data.brand_list;
						this.$refs.editDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//清除表单数据
			clearForm(){
				this.wx_user_name = "";						//编辑展示的用户名
				this.edit_role_list = [];					//编辑的角色列表
				this.menu_role_ids = [];					//选中的角色列表
				this.brand_list = [];						//品牌列表
				this.brand_ids = [];						//选中的品牌列表
			},
			//编辑提交
			editConfirm(){
				if(this.menu_role_ids.length == 0){
					this.$message.warning('请选择角色!');
					return;
				}
				if(this.brand_ids.length == 0){
					this.$message.warning('请选择品牌!');
					return;
				}
				let arg = {
					user_id:this.user_id,
					menu_role_id:this.menu_role_ids.join(','),
					brand_id:this.brand_ids.join(','),
				}
				resource.userEditPost(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取列表
						this.getData();
						this.$refs.editDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//监听排序
			sortChange(v){
				console.log(v)
			},
		},
		components:{
			ScreenButton,
			PageButton,
			SettingButton,
			Pagination,
			CustomTable,
			CustomDialog
		}
	}
</script>
<style type="text/css">
	.auto_form_item{
		height: auto!important;
	}
	.auto_form_item .el-form-item__content{
		height: auto!important;
	}
	.dialog_form .el-tree{
		font-size: 14px!important;
		color: #718096!important;
		font-weight: 400!important;
	}
</style>
<style lang="less" scoped>

</style>