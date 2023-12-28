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
					<el-input style="width:198px" v-model="search" placeholder="品牌名称"></el-input>
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
					<SettingButton :img="require('@/static/series_icon.png')" text="管理系列" @callback="getSeries"/>
					<SettingButton :img="require('@/static/create_icon.png')" text="管理品类" @callback="getCategory"/>
					<SettingButton :img="require('@/static/create_icon.png')" text="添加品牌" @callback="addEditBrand('','add')"/>
				</div>
			</div>
			<CustomTable tableName="brandAttribute" settingColumnWidth="180" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" :selection="false" @buttonCallback="buttonCallback" @changeStatus="changeStatus" @addMember="addMember" @editFn="addEditBrand($event,'edit')" @deleteFn="deleteFn"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 添加成员 -->
		<custom-dialog dialogTitle="添加成员" ref="addMemberDialog" @close="wx_user_id = ''" @callback="addMemberConfirm">
			<el-form class="dialog_form">
				<el-form-item label="品牌名称：">
					<div class="custom_value">{{view_brand_name}}</div>
				</el-form-item>
				<el-form-item label="选择成员：" required>
					<el-select style="width:232px" v-model="wx_user_id" filterable placeholder="请选择成员">
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 添加/编辑品牌 -->
		<custom-dialog :dialogTitle="`${dialog_type == 'add'?'添加':'编辑'}品牌`" ref="addEditDialog" @close="clearForm" @callback="addEditConfirm">
			<el-form class="dialog_form">
				<el-form-item label="品牌名称：" required>
					<el-input style="width:232px" v-model="brand_name"></el-input>
				</el-form-item>
				<el-form-item label="品牌地址：" required>
					<el-input style="width:232px" v-model="brand_address"></el-input>
				</el-form-item>
				<el-form-item label="联系方式：" required>
					<el-input type="number" style="width:232px" v-model="tel"></el-input>
				</el-form-item>
				<el-form-item class="auto_form_item" label="品牌LOGO：" required>
					<UploadImage text="上传一张LOGO" :imgStr="logo" :request="dialog_type == 'add'" @callback="uploadImage"/>
				</el-form-item>
				<el-form-item class="auto_form_item" label="备注：">
					<el-input style="width:232px;" :rows="4" type="textarea" v-model="remark" clearable></el-input>
				</el-form-item>
				<el-form-item label="启用状态：">
					<el-switch :active-value="1" :inactive-value="0" v-model="dialog_is_enable" active-color="#3F8CFF" inactive-color="#ff4949"></el-switch>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 删除 -->
		<custom-dialog dialogTitle="删除" ref="deleteDialog" @callback="deleteConfirm">
			<div class="default_color f14 fw400">确定删除该品牌？</div>
		</custom-dialog>
		<!-- 成员列表 -->
		<custom-dialog :dialogTitle="`品牌名称：【${view_brand_name}】`" :showConfirm="false" cancelText="关闭" @close="wx_user_id = ''" ref="userListDialog">
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
		<!-- 系列管理 -->
		<custom-dialog dialogTitle="管理系列" dialogWidth="520px" :showConfirm="false" cancelText="关闭" @close="series_name = ''" ref="seriesDialog">
			<div class="flex jse mb8">
				<el-popover
				title="添加系列"
				placement="top"
				width="356"
				v-model="add_series_popover">
				<el-form class="dialog_form">
					<el-form-item label="系列名称：" required>
						<el-input style="width:188px" v-model="series_name"></el-input>
					</el-form-item>
				</el-form>
				<div style="text-align: right; margin: 0">
					<el-button size="mini" type="text" @click="add_series_popover = false">取消</el-button>
					<el-button type="primary" size="mini" @click="addSeries">确定</el-button>
				</div>
				<SettingButton slot="reference" :img="require('@/static/create_icon.png')" text="添加系列"/>
			</el-popover>
		</div>
		<el-table class="mb8" :data="seriesData" :header-cell-style="{'background':'#DDE7FF','height':'58px','color':'#4E5969','font-size':'14px'}" border>
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="系列名称" prop="series_name" align="center">
			</el-table-column>
			<el-table-column label="添加时间" prop="add_time" width="180" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-popconfirm hide-icon title="确认删除该系列？" @confirm="delSeries">
						<span slot="reference" class="text_style" @click="series_id = scope.row.series_id">删除</span>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<Pagination :page="series_page" :pagesize="series_pagesize" :total="series_total" @changePage="changeSeriesPage"/>
	</custom-dialog>
	<!-- 品类管理 -->
	<custom-dialog dialogTitle="管理品类" dialogWidth="520px" :showConfirm="false" cancelText="关闭" @close="category_name = ''" ref="categoryDialog">
		<div class="flex jse mb8">
			<el-popover
			title="添加品类"
			placement="top"
			width="356"
			v-model="add_category_popover">
			<el-form class="dialog_form">
				<el-form-item label="品类名称：" required>
					<el-input style="width:188px" v-model="category_name"></el-input>
				</el-form-item>
			</el-form>
			<div style="text-align: right; margin: 0">
				<el-button size="mini" type="text" @click="add_category_popover = false">取消</el-button>
				<el-button type="primary" size="mini" @click="addCategory">确定</el-button>
			</div>
			<SettingButton slot="reference" :img="require('@/static/create_icon.png')" text="添加品类"/>
		</el-popover>
	</div>
	<el-table class="mb8" :data="categoryData" :header-cell-style="{'background':'#DDE7FF','height':'58px','color':'#4E5969','font-size':'14px'}" border>
		<el-table-column label="序号" align="center" type="index" width="60">
		</el-table-column>
		<el-table-column label="品类名称" prop="category_name" align="center">
		</el-table-column>
		<el-table-column label="添加时间" prop="add_time" width="180" align="center">
		</el-table-column>
		<el-table-column label="操作" align="center">
			<template slot-scope="scope">
				<el-popconfirm hide-icon title="确认删除该品类？" @confirm="delCategory">
					<span slot="reference" class="text_style" @click="category_id = scope.row.category_id">删除</span>
				</el-popconfirm>
			</template>
		</el-table-column>
	</el-table>
	<Pagination :page="category_page" :pagesize="category_pagesize" :total="category_total" @changePage="changeCategoryPage"/>
</custom-dialog>
</div>
</template>
<script>
	import resource from '@/api/resource.js'

	import PageRadio from '@/components/pageRadio'
	import SettingButton from '@/components/settingButton'
	import ScreenButton from '@/components/screenButton'
	import PageButton from '@/components/pageButton'
	import Pagination from '@/components/pagination'
	import CustomTable from '@/components/customTable'
	import CustomDialog from '@/components/customDialog'
	import UploadImage from '@/components/uploadImage'
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
					label:'品牌名称',
					prop:'brand_name',
				},{
					label:'品牌LOGO',
					prop:'logo',
					type:1
				},{
					label:'联系方式',
					prop:'tel',
				},{
					label:'添加时间',
					prop:'add_time',
				},{
					label:'备注',
					prop:'remark',
				},{
					label:'启用状态',
					prop:'is_enable',
					type:5
				},{
					label:'品类',
					prop:'category_num',
					type:4
				},{
					label:'系列',
					prop:'series_num',
					type:4
				},{
					label:'成员数量',
					prop:'user_num',
					type:4
				}],
				tableData:[],
				table_height:0,
				loading:false,
				brand_id:"",						//点击的品牌
				dialog_type:"",						//add：添加；edit:编辑
				brand_name:"",						
				brand_address:"",
				tel:"",
				logo:"",
				remark:"",
				dialog_is_enable:1,					//启用状态
				view_brand_name:"",					//添加成员/成员列表展示的品牌名称
				user_list:[],						//用户列表
				wx_user_id:"",						//选中的用户
				userData:[],						//品牌的用户列表
				user_page:1,
				user_pagesize:5,
				user_total:0,
				category_name:"",					//品类管理添加的品类名称
				categoryData:[],					//品类管理列表
				category_page:1,
				category_pagesize:5,
				category_total:0,
				category_id:"",						//删除选中的品类ID
				add_category_popover:false,			//添加品类弹窗
				series_name:"",						//系列管理添加的系列名称
				seriesData:[],						//系列管理列表
				series_page:1,
				series_pagesize:5,
				series_total:0,
				series_id:"",						//删除选中的系列ID
				add_series_popover:false,			//添加系列弹窗
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
					search:this.search,
					is_enable:this.is_enable,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.adminBrandList(arg).then(res => {
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
			buttonCallback(row){
				this.brand_id = row.brand_id;
				this.view_brand_name = row.brand_name;
				this.$refs.userListDialog.show_dialog = true;
				//获取品牌成员
				this.getUserData();
			},
			//获取品牌成员
			getUserData(){
				let arg = {
					page:this.user_page,
					pagesize:this.user_pagesize,
					brand_id:this.brand_id
				}
				resource.adminBrandMemberList(arg).then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
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
					brand_id:this.brand_id,
					wx_user_id:wx_user_id,
					status:status
				}
				resource.adminBrandEnableUser(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//删除品牌用户
			delUser(){
				let arg = {
					brand_id:this.brand_id,
					wx_user_id:this.wx_user_id
				}
				resource.adminBrandDelUser(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
						//获取品牌成员
						this.getUserData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//切换品牌启用/禁用状态开关
			changeStatus(v){
				console.log(v)
			},
			//点击添加成员
			addMember(row){
				this.view_brand_name = row.brand_name;
				this.brand_id = row.brand_id;
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
					brand_id:this.brand_id,
					wx_user_id:this.wx_user_id
				}
				resource.adminBrandAddMember(arg).then(res => {
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
			//点击添加/编辑品牌
			addEditBrand(row,type){
				this.dialog_type = type;
				if(this.dialog_type == 'add'){			//添加
					this.$refs.addEditDialog.show_dialog = true;
				}else{									//编辑
					this.brand_id = row.brand_id;
					resource.adminBrandInfo({brand_id:this.brand_id}).then(res => {
						if (res.data.code == 1) {
							let data = res.data.data;
							this.brand_name = data.brand_name;
							this.brand_address = data.brand_address;
							this.tel = data.tel;
							this.logo = data.logo;
							this.remark = data.remark;
							this.dialog_is_enable = data.is_enable;
							this.$refs.addEditDialog.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}
			},
			//上传图片回调
			uploadImage(img_arr){
				this.logo = img_arr.join(',');
			},
			//清除添加/编辑表单数据
			clearForm(){
				this.brand_name = "";
				this.brand_address = "";
				this.tel = "";
				this.logo = "";
				this.remark = "";						
				this.dialog_is_enable = 1;					
			},
			//添加/编辑供应商提交
			addEditConfirm(){
				if(this.brand_name == ''){
					this.$message.warning('请输入品牌名称');
					return;
				}	
				if(this.brand_address == ''){
					this.$message.warning('请输入品牌地址');
					return;
				}	
				if(this.tel == ''){
					this.$message.warning('请输入联系方式');
					return;
				}
				if(this.logo == ''){
					this.$message.warning('请上传品牌LOGO');
					return;
				}
				let arg = {
					brand_name:this.brand_name,
					brand_address:this.brand_address,
					tel:this.tel,
					logo:this.logo,	
					remark:this.remark,					
					is_enable:this.dialog_is_enable,					
				}
				if(this.dialog_type == 'add'){	//添加
					resource.adminBrandAdd(arg).then(res => {
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
					arg['brand_id'] = this.brand_id;
					resource.adminBrandEdit(arg).then(res => {
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
				this.brand_id = row.brand_id;
				this.$refs.deleteDialog.show_dialog = true;
			},
			//删除提交
			deleteConfirm(){
				resource.adminBrandDel({brand_id:this.brand_id}).then(res => {
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
					is_enable:this.is_enable,
				}
				let arg_arr = [];
				for(let k in arg){
					arg_arr.push(`${k}=${arg[k]}`)
				}
				let export_url = `${location.origin}/api/brand/export?${arg_arr.join('&')}`;
				console.log(export_url)
			},
			//点击系列管理
			getSeries(){
				let arg = {
					page:this.series_page,
					pagesize:this.series_pagesize
				}
				resource.adminBrandSeries(arg).then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
						this.seriesData = data.data;
						this.series_total = data.total;
						this.$refs.seriesDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//系列翻页
			changeSeriesPage(page){
				this.series_page = page;
				//获取系列列表
				this.getSeries();
			},
			//添加系列提交
			addSeries(){
				if(this.series_name == ''){
					this.$message.warning('请输入系列名称');
					return;
				}
				resource.adminSeriesAdd({series_name:this.series_name}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
						this.series_name = "";
						this.add_series_popover = false;
						//获取系列管理列表
						this.getSeries();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//系列管理删除系列
			delSeries(){
				resource.adminSeriesDel({series_id:this.series_id}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
						//获取系列管理列表
						this.getSeries();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//点击品类管理
			getCategory(){
				let arg = {
					page:this.category_page,
					pagesize:this.category_pagesize
				}
				resource.adminBrandCategory(arg).then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
						this.categoryData = data.data;
						this.category_total = data.total;
						this.$refs.categoryDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//品类翻页
			changeCategoryPage(page){
				this.category_page = page;
				//获取系列列表
				this.getCategory();
			},
			//添加品类提交
			addCategory(){
				if(this.category_name == ''){
					this.$message.warning('请输入品类名称');
					return;
				}
				resource.adminCategoryAdd({category_name:this.category_name}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
						this.category_name = "";
						this.add_category_popover = false;
						//获取品类管理列表
						this.getCategory();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//品类管理删除品类
			delCategory(){
				resource.adminCategoryDel({category_id:this.category_id}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg)
						//点击品类管理
						this.getCategory();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
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
			UploadImage
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
</style>
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