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
			<CustomTable tableName="brandAttribute" settingColumnWidth="180" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" :selection="false" @buttonCallback="buttonCallback" @changeStatus="changeStatus" @addMember="addMember" @editFn="addEditBrand($event,'edit')" @deleteFn="deleteFn" @editCate="editCate" @editSeries="editSeries"/>
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
<!-- 选择品类 -->
<custom-dialog dialogTitle="选择品类" dialogWidth="550px" ref="checkCateDialog" @close="closeCateDialog" @callback="editCateConfirm">
	<div class="option_list flex flex-warp">
		<div class="option_item pl16 pr16 mr8 mb16 active_option flex ac jc" v-for="(selected_item,index) in selected_category_list">
			<div class="table_color f14 fw500 mr8">{{selected_item.category_name}}</div>
			<img class="selected_close pointer" src="@/static/tab_close_active.png" @click="changeSelectedCate(selected_item,false)">
		</div>
	</div>
	<div class="pt16 pb16">
		<div class="flex ac mb16">
			<div class="default_color f14 fw400">商品分类：</div>
			<div class="search_box flex ac pl16">
				<input class="search_input flex-1 f14 fw400" v-model="search_cate" placeholder="请搜索商品分类">
				<div class="search_button f14 white_color fw400 ml16 pointer" @click="searchCate">搜索</div>
			</div>
		</div>
		<div class="flex">
			<div class="default_color f14 fw400 space-nowrap">全部品类：</div>
			<div class="flex flex-warp">
				<div class="table_color f14 fw400 mr16 pointer" :class="{'active_letter':letter_cate_index == index}" v-for="(item,index) in view_category_list" @click="setCateScrollTop(item.initial,index)">
					{{item.initial}}
				</div>
			</div>
		</div>
	</div>
	<div class="option_list" v-if="view_category_list.length > 0" id="cateOptionList">
		<div v-for="(item,index) in view_category_list">
			<div class="initial_color pt16 pb16 f16 bold" :id="item.initial">{{item.initial}}</div>
			<div class="flex flex-warp">
				<div class="option_item pl16 pr16 table_color f14 fw500 mr8 mb16 pointer" :class="{'active_option':option.selected}" @click="checkCateOptionStatus(index,o_i)" v-for="(option,o_i) in item.data">{{option.category_name}}</div>
			</div>
		</div>
	</div>
	<div class="option_list flex ac jc" v-else>
		<div class="default_color f14 fw400">暂无数据</div>
	</div>
</custom-dialog>
<!-- 选择系列 -->
<custom-dialog dialogTitle="选择系列" dialogWidth="550px" ref="checkSeriesDialog" @close="closeSeriesDialog" @callback="editSeriesConfirm">
	<div class="option_list flex flex-warp">
		<div class="option_item pl16 pr16 mr8 mb16 active_option flex ac jc" v-for="(selected_item,index) in selected_series_list">
			<div class="table_color f14 fw500 mr8">{{selected_item.series_name}}</div>
			<img class="selected_close pointer" src="@/static/tab_close_active.png" @click="changeSelectedSeries(selected_item,false)">
		</div>
	</div>
	<div class="pt16 pb16">
		<div class="flex ac mb16">
			<div class="default_color f14 fw400">商品系列：</div>
			<div class="search_box flex ac pl16">
				<input class="search_input flex-1 f14 fw400" v-model="search_series" placeholder="请搜索商品系列">
				<div class="search_button f14 white_color fw400 ml16 pointer" @click="searchSeries">搜索</div>
			</div>
		</div>
		<div class="flex">
			<div class="default_color f14 fw400 space-nowrap">全部系列：</div>
			<div class="flex flex-warp">
				<div class="table_color f14 fw400 mr16 pointer" :class="{'active_letter':letter_series_index == index}" v-for="(item,index) in view_series_list" @click="setSeriesScrollTop(item.initial,index)">
					{{item.initial}}
				</div>
			</div>
		</div>
	</div>
	<div class="option_list" v-if="view_series_list.length > 0" id="seriesOptionList">
		<div v-for="(item,index) in view_series_list">
			<div class="initial_color pt16 pb16 f16 bold" :id="item.initial">{{item.initial}}</div>
			<div class="flex flex-warp">
				<div class="option_item pl16 pr16 table_color f14 fw500 mr8 mb16 pointer" :class="{'active_option':option.selected}" @click="checkSeriesOptionStatus(index,o_i)" v-for="(option,o_i) in item.data">{{option.series_name}}</div>
			</div>
		</div>
	</div>
	<div class="option_list flex ac jc" v-else>
		<div class="default_color f14 fw400">暂无数据</div>
	</div>
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
					prop:'category_num'
				},{
					label:'系列',
					prop:'series_num'
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
				edit_brand_id:"",					//点击编辑的ID
				new_category_list:[],				//所有品类的待选列表
				view_category_list:[],				//当前展示的品类的待选列表
				selected_category_list:[],			//已选中的品类列表
				letter_cate_index:0,				//当前选中的首字母
				search_cate:"",						//商品分类搜索内容
				new_series_list:[],					//所有系列的待选列表
				view_series_list:[],				//当前展示的系列的待选列表
				selected_series_list:[],			//已选中的系列列表
				letter_series_index:0,				//当前选中的首字母
				search_series:"",					//商品系列搜索内容
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
			buttonCallback(arg){
				this.brand_id = arg.row.brand_id;
				this.view_brand_name = arg.row.brand_name;
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
			//点击编辑品类
			editCate(brand_id){
				this.edit_brand_id = brand_id;
				this.$refs.checkCateDialog.show_dialog = true;
				resource.brandEditCategoryGet({brand_id:this.edit_brand_id}).then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
						let selected_category_id = data.selected_category_id;
						let category_list = data.category_list;
						var map = {};
						var old_category_list = [];
						for (var i = 0; i < category_list.length; i++) {
							if(selected_category_id.indexOf(category_list[i].category_id) > -1){
								category_list[i]['selected'] = true;
								this.changeSelectedCate(category_list[i],true);
							}else{
								category_list[i]['selected'] = false;
							}
							
							var ai = category_list[i];
							if (!map[ai.initial]) {
								old_category_list.push({
									initial:!ai.initial?'#':ai.initial,
									data: [ai]
								});
								map[ai.initial] = ai;
							} else {
								for (var j = 0; j < old_category_list.length; j++) {
									var dj = old_category_list[j];
									if (dj.initial == ai.initial) {
										dj.data.push(ai);
										break;
									}
								}
							}
						}
						if(old_category_list[0].initial == '#'){
							let other_cate = JSON.parse(JSON.stringify(old_category_list[0]));
							old_category_list.splice(0,1);
							old_category_list.push(other_cate);
						}
						this.new_category_list = JSON.parse(JSON.stringify(old_category_list));
						this.view_category_list = JSON.parse(JSON.stringify(old_category_list));
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//点击切换品类选中状态
			checkCateOptionStatus(index,o_i){
				let current_option = JSON.parse(JSON.stringify(this.view_category_list[index]));
				current_option.data[o_i].selected = !current_option.data[o_i].selected;
				this.changeSelectedCate(current_option.data[o_i],current_option.data[o_i].selected)
				this.$set(this.view_category_list,index,current_option);
				// 处理全部
				let new_category_list = JSON.parse(JSON.stringify(this.new_category_list));
				let current_new_option_index = new_category_list.findIndex(item => {
					return item.initial == current_option.initial;
				})
				let current_new_o_index = new_category_list[current_new_option_index].data.findIndex(item => {
					return item.category_id == current_option.data[o_i].category_id;
				})
				new_category_list[current_new_option_index].data[current_new_o_index].selected = !new_category_list[current_new_option_index].data[current_new_o_index].selected
				let new_category_option = new_category_list[current_new_option_index];
				this.$set(this.new_category_list,current_new_option_index,new_category_option);
			},
			//处理已选中的品类
			changeSelectedCate(cate,bool){
				if(bool){
					this.selected_category_list.push(cate);
				}else{
					let c_i = this.selected_category_list.findIndex(item => {
						return item.category_id == cate.category_id;
					})
					this.selected_category_list.splice(c_i,1);

					let view_category_list = JSON.parse(JSON.stringify(this.view_category_list));
					var p_i = -1;
					var o_i = -1;
					view_category_list.map((item,index) => {
						item.data.map((o,i) => {
							if(cate.category_id == o.category_id){
								p_i = index;
								o_i = i;
							}
						})
					})
					view_category_list[p_i].data[o_i].selected = false;
					this.$set(this.view_category_list,p_i,view_category_list[p_i]);
					// 处理全部
					let new_category_list = JSON.parse(JSON.stringify(this.new_category_list));
					let current_new_option_index = new_category_list.findIndex(item => {
						return item.initial == view_category_list[p_i].initial;
					})
					let current_new_o_index = new_category_list[current_new_option_index].data.findIndex(item => {
						return item.category_id == view_category_list[p_i].data[o_i].category_id;
					})
					new_category_list[current_new_option_index].data[current_new_o_index].selected = false;
					let new_category_option = new_category_list[current_new_option_index];
					this.$set(this.new_category_list,current_new_option_index,new_category_option);
				}
			},
			//点击搜索分类
			searchCate(){
				if(this.search_cate == ''){
					this.view_category_list = JSON.parse(JSON.stringify(this.new_category_list));
				}else{
					this.view_category_list = [];
					let new_category_list = JSON.parse(JSON.stringify(this.new_category_list));
					new_category_list.map(item => {
						let new_data = item.data.filter(o => {
							return o.category_name.indexOf(this.search_cate) > -1;
						})
						if(new_data.length > 0){
							item.data = new_data;
							this.view_category_list.push(item)
						}
					})
				}
			},
			//点击定位
			setCateScrollTop(id,index){
				document.getElementById('cateOptionList').scrollTop = document.getElementById(id).offsetTop - 276;
				this.letter_cate_index = index;
			},
			//监听关闭编辑品类弹窗
			closeCateDialog(){
				this.selected_category_list = [];
				document.getElementById('cateOptionList').scrollTop = 0;
				this.letter_cate_index = 0;
			},
			//编辑品类提交
			editCateConfirm(){
				let arg = {
					brand_id:this.edit_brand_id
				}
				let category_ids = this.selected_category_list.map(item => {
					return item.category_id
				})
				arg['category_id'] = category_ids.join(',');
				resource.brandEditCategoryPost(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.$refs.checkCateDialog.show_dialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//点击编辑系列
			editSeries(brand_id){
				this.edit_brand_id = brand_id;
				this.$refs.checkSeriesDialog.show_dialog = true;
				resource.brandEditSeriesGet({brand_id:this.edit_brand_id}).then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
						let selected_series_id = data.selected_series_id;
						let series_list = data.series_list;
						var map = {};
						var old_series_list = [];
						for (var i = 0; i < series_list.length; i++) {
							if(selected_series_id.indexOf(series_list[i].series_id) > -1){
								series_list[i]['selected'] = true;
								this.changeSelectedSeries(series_list[i],true);
							}else{
								series_list[i]['selected'] = false;
							}
							
							var ai = series_list[i];
							if (!map[ai.initial]) {
								old_series_list.push({
									initial:!ai.initial?'#':ai.initial,
									data: [ai]
								});
								map[ai.initial] = ai;
							} else {
								for (var j = 0; j < old_series_list.length; j++) {
									var dj = old_series_list[j];
									if (dj.initial == ai.initial) {
										dj.data.push(ai);
										break;
									}
								}
							}
						}
						if(old_series_list[0].initial == '#'){
							let other_series = JSON.parse(JSON.stringify(old_series_list[0]));
							old_series_list.splice(0,1);
							old_series_list.push(other_series);
						}
						this.new_series_list = JSON.parse(JSON.stringify(old_series_list));
						this.view_series_list = JSON.parse(JSON.stringify(old_series_list));
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//点击切换系列选中状态
			checkSeriesOptionStatus(index,o_i){
				let current_option = JSON.parse(JSON.stringify(this.view_series_list[index]));
				current_option.data[o_i].selected = !current_option.data[o_i].selected;
				this.changeSelectedSeries(current_option.data[o_i],current_option.data[o_i].selected)
				this.$set(this.view_series_list,index,current_option);
				// 处理全部
				let new_series_list = JSON.parse(JSON.stringify(this.new_series_list));
				let current_new_option_index = new_series_list.findIndex(item => {
					return item.initial == current_option.initial;
				})
				let current_new_o_index = new_series_list[current_new_option_index].data.findIndex(item => {
					return item.series_id == current_option.data[o_i].series_id;
				})
				new_series_list[current_new_option_index].data[current_new_o_index].selected = !new_series_list[current_new_option_index].data[current_new_o_index].selected
				let new_series_option = new_series_list[current_new_option_index];
				this.$set(this.new_series_list,current_new_option_index,new_series_option);
			},
			//处理已选中的系列
			changeSelectedSeries(series,bool){
				if(bool){
					this.selected_series_list.push(series);
				}else{
					let c_i = this.selected_series_list.findIndex(item => {
						return item.series_id == series.series_id;
					})
					this.selected_series_list.splice(c_i,1);

					let view_series_list = JSON.parse(JSON.stringify(this.view_series_list));
					var p_i = -1;
					var o_i = -1;
					view_series_list.map((item,index) => {
						item.data.map((o,i) => {
							if(series.series_id == o.series_id){
								p_i = index;
								o_i = i;
							}
						})
					})
					view_series_list[p_i].data[o_i].selected = false;
					this.$set(this.view_series_list,p_i,view_series_list[p_i]);
					// 处理全部
					let new_series_list = JSON.parse(JSON.stringify(this.new_series_list));
					let current_new_option_index = new_series_list.findIndex(item => {
						return item.initial == view_series_list[p_i].initial;
					})
					let current_new_o_index = new_series_list[current_new_option_index].data.findIndex(item => {
						return item.series_id == view_series_list[p_i].data[o_i].series_id;
					})
					new_series_list[current_new_option_index].data[current_new_o_index].selected = false;
					let new_series_option = new_series_list[current_new_option_index];
					this.$set(this.new_series_list,current_new_option_index,new_series_option);
				}
			},
			//点击搜索系列
			searchSeries(){
				if(this.search_series == ''){
					this.view_series_list = JSON.parse(JSON.stringify(this.new_series_list));
				}else{
					this.view_series_list = [];
					let new_series_list = JSON.parse(JSON.stringify(this.new_series_list));
					new_series_list.map(item => {
						let new_data = item.data.filter(o => {
							return o.series_name.indexOf(this.search_series) > -1;
						})
						if(new_data.length > 0){
							item.data = new_data;
							this.view_series_list.push(item)
						}
					})
				}
			},
			//点击定位
			setSeriesScrollTop(id,index){
				document.getElementById('seriesOptionList').scrollTop = document.getElementById(id).offsetTop - 276;
				this.letter_series_index = index;
			},
			//监听关闭编辑系列弹窗
			closeSeriesDialog(){
				this.selected_series_list = [];
				document.getElementById('seriesOptionList').scrollTop = 0;
				this.letter_series_index = 0;
			},
			//编辑系列提交
			editSeriesConfirm(){
				let arg = {
					brand_id:this.edit_brand_id
				}
				let series_ids = this.selected_series_list.map(item => {
					return item.series_id
				})
				arg['series_id'] = series_ids.join(',');
				resource.brandEditSeriesPost(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.$refs.checkSeriesDialog.show_dialog = false;
						//获取列表
						this.getData();
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
	.active_letter{
		color: #5E9CFF;
	}
	.initial_color{
		color: #515A68;
	}
	.option_list{
		max-height: 260px;
		overflow-y: scroll;
	}
	.option_item{
		border: 1px solid #ffffff;
		min-width: 90px;
		height: 46px;
		line-height: 46px;
		text-align: center;
	}
	.selected_close{
		width: 7px;
		height: 7px;
	}
	.active_option{
		border: 1px solid #609DFF;
		background: #EBF3FF;
	}
	.search_box{
		width: 280px;
		height: 48px;
		background: #F7F8FA;
		border-radius: 12px;
		.search_input{
			background: #F7F8FA;
			border: none;
			outline: none;
		}
		.search_button{
			width: 60px;
			text-align: center;
			height: 40px;
			line-height: 40px;
			background: #5E9CFF;
			border-radius: 20px;
		}
	}
</style>