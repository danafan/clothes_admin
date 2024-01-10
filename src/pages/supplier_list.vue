<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jse mb16">
			<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
			<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="搜索：">
					<el-input style="width:198px" v-model="search" placeholder="供应商/联系方式"></el-input>
				</el-form-item>
				<el-form-item label="启用状态：">
					<el-radio-group v-model="is_enable">
						<el-radio :label="1">已启用</el-radio>
						<el-radio :label="0">已停用</el-radio>
					</el-radio-group>
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
					<SettingButton :img="require('@/static/export_icon.png')" text="导出" @callback="$refs.exportDialog.show_dialog = true"/>
					<SettingButton :img="require('@/static/create_icon.png')" text="添加供应商" @callback="addEditSupplier('','add')"/>
				</div>
			</div>
			<CustomTable tableName="supplierList" settingColumnWidth="180" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" :selection="false" @buttonCallback="buttonCallback" @changeStatus="changeStatus" @addMember="addMember" @editFn="addEditSupplier($event,'edit')" @deleteFn="deleteFn"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 添加成员 -->
		<custom-dialog dialogTitle="添加成员" ref="addMemberDialog" @close="wx_user_id = ''" @callback="addMemberConfirm">
			<el-form class="dialog_form">
				<el-form-item label="供应商名称：">
					<div class="custom_value">{{view_supplier_name}}</div>
				</el-form-item>
				<el-form-item label="选择成员：" required>
					<el-select style="width:232px" v-model="wx_user_id" filterable placeholder="请选择成员">
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 添加/编辑供应商 -->
		<custom-dialog :dialogTitle="`${dialog_type == 'add'?'添加':'编辑'}供应商`" ref="addEditDialog" @close="clearForm" @callback="addEditConfirm">
			<el-form class="dialog_form">
				<el-form-item label="供应商名称：" required>
					<el-input style="width:232px" v-model="supplier_name"></el-input>
				</el-form-item>
				<el-form-item label="供应商地址：" required>
					<el-input style="width:232px" v-model="supplier_address"></el-input>
				</el-form-item>
				<el-form-item label="联系方式：" required>
					<el-input type="number" style="width:232px" v-model="tel"></el-input>
				</el-form-item>
				<el-form-item label="合作品牌：" required>
					<el-select style="width:232px" v-model="brand_ids" multiple filterable collapse-tags reserve-keyword placeholder="请选择品牌">
						<el-option v-for="item in brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启用状态：">
					<el-switch :active-value="1" :inactive-value="0" v-model="dialog_is_enable" active-color="#3F8CFF" inactive-color="#ff4949"></el-switch>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 删除 -->
		<custom-dialog dialogTitle="删除" ref="deleteDialog" @callback="deleteConfirm">
			<div class="default_color f14 fw400">确定删除该供应商？</div>
		</custom-dialog>
		<!-- 成员列表 -->
		<custom-dialog :dialogTitle="`供应商：【${view_supplier_name}】`" :showConfirm="false" cancelText="关闭" @close="wx_user_id = ''" ref="userListDialog">
			<el-table class="mb8" :data="userData" :header-cell-style="{'background':'#DDE7FF','height':'58px','color':'#4E5969','font-size':'14px'}" border>
				<el-table-column label="序号" align="center" type="index" width="60">
				</el-table-column>
				<el-table-column label="姓名" prop="wx_user_name" align="center">
				</el-table-column>
				<el-table-column label="是否启用" align="center">
					<template slot-scope="scope">
						<el-switch size="mini" :active-value="1" :inactive-value="0" v-model="scope.row.status" active-color="#3F8CFF" inactive-color="#ff4949" @change="changeUserStatus($event,scope.row.wx_user_id)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-popconfirm hide-icon title="确认删除该用户？" @confirm="delUser">
							<span slot="reference" class="text_style" @click="wx_user_id = scope.row.wx_user_id">删除</span>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :page="user_page" :pagesize="user_pagesize" :total="user_total" @changePage="changeUserPage"/>
		</custom-dialog>
		<!-- 导出 -->
		<custom-dialog dialogTitle="导出" ref="exportDialog" @callback="exportFn">
			<div class="default_color f14 fw400">确定导出吗？</div>
		</custom-dialog>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'
	import { exportExcel } from "@/utils/export.js";

	import PageRadio from '@/components/pageRadio'
	import SettingButton from '@/components/settingButton'
	import ScreenButton from '@/components/screenButton'
	import PageButton from '@/components/pageButton'
	import Pagination from '@/components/pagination'
	import CustomTable from '@/components/customTable'
	import CustomDialog from '@/components/customDialog'
	export default{
		data(){
			return{
				unfold:true,						//筛选条件是否展开
				search:"",							//搜索内容
				is_enable:1,						//启用状态
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'供应商名称',
					prop:'supplier_name',
				},{
					label:'供应商地址',
					prop:'supplier_address',
				},{
					label:'联系方式',
					prop:'tel',
				},{
					label:'合作品牌',
					prop:'brand_names',
				},{
					label:'添加时间',
					prop:'add_time',
				},{
					label:'启用状态',
					prop:'is_enable',
					type:5
				},{
					label:'成员数量',
					prop:'user_num',
					type:4
				}],
				tableData:[],
				table_height:0,
				loading:false,
				supplier_id:"",						//点击的供应商
				dialog_type:"",						//add：添加；edit:编辑
				supplier_name:"",
				supplier_address:"",
				tel:"",
				brand_list:[],						//品牌列表
				brand_ids:[],						//选中的品牌
				dialog_is_enable:1,					//启用状态
				view_supplier_name:"",				//添加成员/成员列表展示的供应商名称
				user_list:[],						//用户列表
				wx_user_id:"",						//选中的用户
				userData:[],						//供应商的用户列表
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
			//获取品牌列表
			this.ajaxBrands();
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
			//获取品牌列表
			ajaxBrands(){
				resource.ajaxBrands().then(res => {
					if (res.data.code == 1) {
						this.brand_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取列表
			getData(){
				let arg = {
					search:this.search,
					is_enable:this.is_enable,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.adminSupplierList(arg).then(res => {
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
			//点击成员数量
			buttonCallback(arg){
				this.supplier_id = arg.row.supplier_id;
				this.view_supplier_name = arg.row.supplier_name;
				this.$refs.userListDialog.show_dialog = true;
				//获取供应商成员
				this.getUserData();
			},
			//获取供应商成员
			getUserData(){
				let arg = {
					page:this.user_page,
					pagesize:this.user_pagesize,
					supplier_id:this.supplier_id
				}
				resource.adminSupplierMemberList(arg).then(res => {
					if (res.data.code == 1) {
						let data = res.data.data.data;
						this.userData = data.data;
						this.user_total = data.total;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//用户翻页
			changeUserPage(page){
				this.user_page = page;
				//获取品牌成员
				this.getUserData();
			},
			//切换用户启用/禁用状态
			changeUserStatus(status,wx_user_id){
				let arg = {
					supplier_id:this.supplier_id,
					wx_user_id:wx_user_id,
					status:status
				}
				resource.adminSupplierEnableUser(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//删除供应商用户
			delUser(){
				let arg = {
					supplier_id:this.supplier_id,
					wx_user_id:this.wx_user_id
				}
				resource.adminSupplierDelUser(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
						//获取供应商成员
						this.getUserData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//切换供应商启用/禁用状态开关
			changeStatus(v){
				console.log(v)
			},
			//点击添加成员
			addMember(row){
				this.view_supplier_name = row.supplier_name;
				this.supplier_id = row.supplier_id;
				this.$refs.addMemberDialog.show_dialog = true;
				//获取用户列表
				this.ajaxUsers();
			},
			//获取用户列表
			ajaxUsers(){
				resource.ajaxUsers({type:0}).then(res => {
					if (res.data.code == 1) {
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//添加成员提交
			addMemberConfirm(){
				if(this.wx_user_id == ''){
					this.$message.warning('请选择成员');
					return;
				}
				let arg = {
					supplier_id:this.supplier_id,
					wx_user_id:this.wx_user_id
				}
				resource.adminSupplierAddMember(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
							//获取列表
						this.getData();
						this.$refs.addMemberDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//点击添加/编辑供应商
			addEditSupplier(row,type){
				this.dialog_type = type;
				if(this.dialog_type == 'add'){			//添加
					this.$refs.addEditDialog.show_dialog = true;
				}else{									//编辑
					this.supplier_id = row.supplier_id;
					resource.adminSupplierInfo({supplier_id:this.supplier_id}).then(res => {
						if (res.data.code == 1) {
							let data = res.data.data;
							this.supplier_name = data.supplier_name;
							this.supplier_address = data.supplier_address;
							this.tel = data.tel;
							this.brand_ids = data.brand_ids;
							this.dialog_is_enable = data.is_enable;
							this.$refs.addEditDialog.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}
			},
			//清除添加/编辑表单数据
			clearForm(){
				this.supplier_name = "";
				this.supplier_address = "";
				this.tel = "";
				this.brand_ids = [];						
				this.dialog_is_enable = 1;					
			},
			//添加/编辑供应商提交
			addEditConfirm(){
				if(this.supplier_name == ''){
					this.$message.warning('请输入供应商名称');
					return;
				}	
				if(this.supplier_address == ''){
					this.$message.warning('请输入供应商地址');
					return;
				}	
				if(this.tel == ''){
					this.$message.warning('请输入联系方式');
					return;
				}
				if(this.brand_ids.length == 0){
					this.$message.warning('请选择合作品牌');
					return;
				}
				let arg = {
					supplier_name:this.supplier_name,
					supplier_address:this.supplier_address,
					tel:this.tel,
					brand_ids:this.brand_ids.join(','),						
					is_enable:this.dialog_is_enable,					
				}
				if(this.dialog_type == 'add'){	//添加
					resource.adminSupplierAdd(arg).then(res => {
						if (res.data.code == 1) {
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
							this.$refs.addEditDialog.show_dialog = false;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}else{							//编辑
					arg['supplier_id'] = this.supplier_id;
					resource.adminSupplierEdit(arg).then(res => {
						if (res.data.code == 1) {
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
							this.$refs.addEditDialog.show_dialog = false;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}
				
			},
			//点击删除
			deleteFn(row){
				this.supplier_id = row.supplier_id;
				this.$refs.deleteDialog.show_dialog = true;
			},
			//删除提交
			deleteConfirm(){
				resource.adminSupplierDel({supplier_id:this.supplier_id}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
							//获取列表
						this.getData();
						this.$refs.deleteDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//导出
			exportFn(){
				let arg = {
					search:this.search,
					is_enable:this.is_enable
				}
				exportExcel(arg,'api/supplier/export');
				this.$refs.exportDialog.show_dialog = false;
			},
			//监听排序
			sortChange(v){
				console.log(v)
			},
		},
		components:{
			PageRadio,
			SettingButton,
			ScreenButton,
			PageButton,
			Pagination,
			CustomTable,
			CustomDialog,
		}
	}
</script>
<style lang="less" scoped>
	.text_style{
		cursor: pointer;
		padding-left: 5px;
		padding-right: 5px;
		font-size: 14px;
		font-weight: 500;
		color: #609DFF;
		white-space: nowrap;
	}
</style>