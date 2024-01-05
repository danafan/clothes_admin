<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jse mb16">
			<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
			<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="权限名称：">
					<el-input style="width:198px" v-model="role_name" placeholder="权限名称"></el-input>
				</el-form-item>
				<el-form-item>
					<PageButton @callback="changePage(1)"/>
				</el-form-item>
			</el-form>
		</div>
		<!-- 表格内容 -->
		<div class="table_content" id="table_content">
			<div class="p16 flex ac jsb" id="table_setting">
				<div class="table_color f14 fw500">数据列表</div>
				<div class="flex">
					<SettingButton :img="require('@/static/create_icon.png')" text="添加" @callback="menuroleAddGet"/>
				</div>
			</div>
			<CustomTable tableName="accessAuthority" :selection="false" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" @editFn="editFn" @detailFn="detailFn" @deleteFn="deleteFn" @buttonCallback="buttonCallback"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 添加/编辑 -->
		<custom-dialog dialogWidth="580px" :dialogTitle="`${dialog_type == 'add'?'添加':'编辑'}角色`" ref="addEditDialog" @close="clearForm" @callback="addEditConfirm">
			<el-form class="dialog_form" label-width="90px">
				<el-form-item label="角色名称：" required>
					<el-input style="width:232px" type="text" placeholder="输入角色名称" v-model="name"></el-input>
				</el-form-item>
				<el-form-item class="auto_form_item" label="备注：" required>
					<el-input style="width:232px" type="textarea" :rows="3" placeholder="输入备注..." v-model="remark">
					</el-input>
				</el-form-item>
				<el-form-item label="访问权限：">
					<div class="menu_list_box">
						<div class="menu_item" v-for="item in menu_list">
							<el-tree :data="item" ref="tree" node-key="menu_id" :default-checked-keys="checked_keys" :props="props" show-checkbox @check="checkChange"></el-tree>
						</div>
					</div>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 详情 -->
		<custom-dialog dialogWidth="580px" dialogTitle="角色详情" :showConfirm="false" cancelText="关闭" ref="detailDialog">
			<el-form class="dialog_form" label-width="90px">
				<el-form-item label="角色名称：">
					<div class="custom_value">{{detail_info.menu_role_name}}</div>
				</el-form-item>
				<el-form-item label="角色人员：">
					<div class="custom_value">{{detail_info.num}}</div>
				</el-form-item>
				<el-form-item label="角色备注：">
					<div class="custom_value">{{detail_info.remark}}</div>
				</el-form-item>
				<el-form-item label="创建时间：">
					<div class="custom_value">{{detail_info.create_time}}</div>
				</el-form-item>
				<el-form-item label="创建人：">
					<div class="custom_value">{{detail_info.creater}}</div>
				</el-form-item>
				<el-form-item label="访问权限：">
					<el-tree class="custom_value" :data="item" ref="tree" node-key="menu_id" :props="props" v-for="item in detail_info.list"></el-tree>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 角色所属成员列表 -->
		<custom-dialog dialogWidth="880px" :dialogTitle="`【${role_user_dialog_title}】角色人员列表`" :showConfirm="false" cancelText="关闭" ref="userListDialog">
			<el-table class="mb8" :data="userData" :header-cell-style="{'background':'#DDE7FF','height':'58px','color':'#4E5969','font-size':'14px'}" border>
				<el-table-column label="序号" align="center" type="index" width="60">
				</el-table-column>
				<el-table-column label="工号" prop="wx_user_id" align="center">
				</el-table-column>
				<el-table-column label="所属部门" prop="main_dept_name" align="center">
				</el-table-column>
				<el-table-column label="岗位名称" prop="position" align="center">
				</el-table-column>
				<el-table-column label="姓名" prop="wx_user_name" align="center">
				</el-table-column>
				<el-table-column label="所属角色" prop="menu_role_name" align="center">
				</el-table-column>
			</el-table>
			<Pagination :page="user_page" :pagesize="user_pagesize" :total="user_total" @changePage="changeUserPage"/>
		</custom-dialog>
		<!-- 删除 -->
		<custom-dialog dialogTitle="删除" ref="deleteDialog" @callback="deleteConfirm">
			<div class="default_color f14 fw400">确认删除该角色？</div>
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
				role_name:"",						//权限名称
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'角色名称',
					prop:'menu_role_name',
				},{
					label:'角色人员',
					prop:'num',
					type:4
				},{
					label:'角色备注',
					prop:'remark',
				},{
					label:'创建时间',
					prop:'create_time',
				},{
					label:'创建人',
					prop:'creater',
				}],
				tableData:[],
				table_height:0,
				loading:false,
				dialog_type:"",						//add：添加；edit：编辑
				menu_role_id:"",					//点击的权限ID
				name:"",
				remark:"",
				menu_list:[],						//功能列表（角色用）
				props:{
					label: 'menu_name',
					children: 'list'
				},
				checked_keys:[],					//已选中的功能id集合
				detail_info:{
					list:[]
				},									//详情数据
				role_user_dialog_title:"",			//角色下面所有人员列表标题
				userData:[],						//品牌的用户列表
				user_page:1,
				user_pagesize:5,
				user_total:0,
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
			//获取列表
			getData(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.menuroleList(arg).then(res => {
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
			//点击添加添加时获取访问权限列表
			menuroleAddGet(){
				this.dialog_type = 'add';
				resource.menuroleAddGet().then(res => {
					if(res.data.code == 1){
						this.menu_list = res.data.data;
						this.$refs.addEditDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			editFn(row){
				this.dialog_type = 'edit';
				this.menu_role_id = row.menu_role_id;
				resource.menuroleEditGet({role_id:this.menu_role_id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.menu_list = data.menu_list;
						this.checked_keys = data.selected_ids;
						this.name = data.menu_role_name;		
						this.remark = data.remark;				
						this.$refs.addEditDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击切换选中的访问权限
			checkChange(data, checked) {
				let tree_list = this.$refs.tree;
				let arr = [];
				tree_list.map(item => {
					arr = [...arr,...item.getCheckedKeys()];
				})
				this.checked_keys = arr;
			},
			//清除表单数据
			clearForm(){
				this.name = "";
				this.remark = "";
				this.menu_list = [];						
				this.checked_keys = [];					
			},
			//添加/编辑提交
			addEditConfirm(){
				if(this.name == ''){
					this.$message.warning('请输入角色名称!');
					return;
				}
				if(this.name.length > 20){
					this.$message.warning('角色名称不能超过20个字!');
					return;
				}
				if(this.remark == ''){
					this.$message.warning('请输入备注!');
					return;
				}
				
				let arg = {
					name:this.name,
					ids:this.checked_keys.join(','),
					remark:this.remark
				}
				if(this.dialog_type == 'add'){			//添加
					resource.menuroleAddPost(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
							this.$refs.addEditDialog.show_dialog = false;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					arg['role_id'] = this.menu_role_id;
					resource.menuroleEditPost(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
							this.$refs.addEditDialog.show_dialog = false;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击查看
			detailFn(row){
				resource.menuroleInfo({role_id:row.menu_role_id}).then(res => {
					if(res.data.code == 1){
						this.detail_info = res.data.data;
						this.$refs.detailDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击删除
			deleteFn(row){
				this.menu_role_id = row.menu_role_id;
				this.$refs.deleteDialog.show_dialog = true;
			},
			//删除确认
			deleteConfirm(){
				resource.menuRoleDel({role_id:this.menu_role_id}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取列表
						this.getData();
						this.$refs.deleteDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击成员数量
			buttonCallback(arg){
				this.menu_role_id = arg.row.menu_role_id;
				this.role_user_dialog_title = arg.row.menu_role_name;
				this.$refs.userListDialog.show_dialog = true;
				//获取角色下用户列表
				this.getUserData();
			},
			//获取角色下用户列表
			getUserData(){
				let arg = {
					page:this.user_page,
					pagesize:this.user_pagesize,
					role_id:this.menu_role_id
				}
				resource.menuroleUsers(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.userData = data.data;
						this.user_total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//用户翻页
			changeUserPage(page){
				this.user_page = page;
				//获取品牌成员
				this.getUserData();
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