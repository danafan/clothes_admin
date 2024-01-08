<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jse mb16">
			<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
		</div>
		<!-- 表格内容 -->
		<div class="table_content" id="table_content">
			<div class="p16 flex ac jsb" id="table_setting">
				<div class="table_color f14 fw500">数据列表</div>
				<div class="flex">
					<SettingButton :img="require('@/static/create_icon.png')" text="添加" @callback="addEditFn('','add')"/>
				</div>
			</div>
			<CustomTable tableName="authEnter" :selection="false" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" @editFn="addEditFn($event,'edit')" @deleteFn="deleteFn"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 添加/编辑 -->
		<custom-dialog dialogWidth="640px" :dialogTitle="`${dialog_type == 'add'?'添加':'编辑'}权限`" ref="addEditDialog" @close="clearForm" @callback="addEditConfirm">
			<el-form class="dialog_form" label-width="90px">
				<el-form-item label="权限名称：" required>
					<el-input style="width:232px" v-model="access_name" placeholder="请输入权限名称"></el-input>
				</el-form-item>
				<el-form-item label="所属菜单：" required>
					<el-cascader
					style="width:232px"
					v-model="menu_id"
					:show-all-levels="false"
					:options="menuList"
					:props="props"
					placeholder="请选择菜单"
					@change="ajaxAccess"
					></el-cascader>
				</el-form-item>
				<el-form-item class="auto_form_item" label="权限码：" required>
					<div>
						<div class="flex ac">
							<el-select v-model="controller_id" @change="getMethod" placeholder="选择控制器">
								<el-option v-for="item in controller" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
							&nbsp / &nbsp
							<el-select v-model="method_id" placeholder="选择方法">
								<el-option v-for="item in method" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
							&nbsp
							<el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addAccessCode"></el-button>
						</div>
						<div>
							<el-tag class="mb4 mr4" size="small" closable v-for="(item,index) in access_codes" :key="index" type="primary" effect="dark" @close="handleClose(index)"> {{ item }}
							</el-tag>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="是否按钮：">
					<el-switch
					v-model="is_button"
					:active-value="1"
					:inactive-value="0"
					active-color="#3F8CFF"
					inactive-color="#ff4949">
				</el-switch>
			</el-form-item>
			<el-form-item label="按钮名称：" v-if="is_button == 1" required>
				<el-input v-model="button_name" style="width:232px" placeholder="请输入按钮名称"></el-input>
			</el-form-item>
			<el-form-item class="auto_form_item" label="选择按钮：" v-if="is_button == 0">
				<el-checkbox-group v-model="button_access_ids">
					<el-checkbox size="small" :label="item.id" :key="item.id" border v-for="item in access_buts">{{item.access_name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
	</custom-dialog>
	<!-- 删除 -->
	<custom-dialog dialogTitle="删除" ref="deleteDialog" @callback="deleteConfirm">
		<div class="default_color f14 fw400">确认删除该权限？</div>
	</custom-dialog>
</div>
</template>
<script>
	import resource from '@/api/resource.js'

	import SettingButton from '@/components/settingButton'
	import Pagination from '@/components/pagination'
	import CustomTable from '@/components/customTable'
	import CustomDialog from '@/components/customDialog'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'名称',
					prop:'access_name',
				},{
					label:'所属分组',
					prop:'menu_name',
				},{
					label:'权限码',
					prop:'access_codes',
				}],
				tableData:[],
				table_height:0,
				loading:false,
				dialog_type:"",					//add：添加；edit：编辑
				id:"",
				access_name:"",					//权限名称
				menuList: [],					//所属菜单列表
				props:{
					expandTrigger: 'hover',
					emitPath:false,
					label:'menu_name',
					value:'menu_id',
					children:'list'
				},
				menu_id:"",						//选中的所属菜单ID
				controller:[],					//控制器列表
				controller_id:"",				//选中的控制器
				method:[],						//方法列表
				method_id:"",					//选中的方法
				access_codes:[],				//选中的所有权限码列表
				is_button:0,					//是否按钮
				button_name:"",					//按钮名称
				access_buts:[],					//所有按钮列表
				button_access_ids:[],			//选中的按钮列表
			}
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
		 	//根据选中的菜单获取按钮列表
			ajaxAccess(menu_id,button_access_ids){
				resource.ajaxAccess({menu_id:menu_id}).then(res => {
					if(res.data.code == 1){
						this.access_buts = res.data.data;
						if (button_access_ids) {
    						this.button_access_ids = button_access_ids;
    					}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
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
				resource.accessList(arg).then(res => {
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
			//点击添加/编辑
			addEditFn(row,type){
				this.dialog_type = type;
				//获取所属菜单列表
				this.getMainMenus();
				//获取所有控制器列表
				this.getControllers();
				if(this.dialog_type == 'add'){	//添加
					this.$refs.addEditDialog.show_dialog = true;
				}else{							//编辑
					this.id = row.id;
					resource.accessInfo({id:this.id}).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							this.access_name = data.access_name;
							this.menu_id = data.menu_id;
							this.access_codes = data.access_codes;
							this.is_button = data.is_button;	//是否按钮
							this.button_name = data.button_name;
							let strArr = data.button_access_ids.split(",");
							let intArr = strArr.map((item) => {
								return +item;
							});
							//选择按钮的列表
							this.ajaxAccess(row.menu_id, intArr);
							this.$refs.addEditDialog.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//清除表单数据
			clearForm(){
				this.access_name = "";					//权限名称
				this.menuList = [];						//所属菜单列表
				this.menu_id = "";						//选中的所属菜单ID
				this.controller = [];					//控制器列表
				this.controller_id = "";				//选中的控制器
				this.method = [];						//方法列表
				this.method_id = "";					//选中的方法
				this.access_codes = [];					//选中的所有权限码列表
				this.is_button = 0;						//是否按钮
				this.button_name = "";					//按钮名称
				this.access_buts = [];					//所有按钮列表
				this.button_access_ids = [];			//选中的按钮列表
			},
			//获取所属菜单列表
			getMainMenus(){
				resource.getMainMenus().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.menuList = data.menu_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取所有控制器列表
			getControllers(){
				resource.getControllers().then(res => {
					if(res.data.code == 1){
						this.controller = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//根据选择的控制器获取下面的方法
			getMethod(controller_name){
				resource.getMethods({controller_name:controller_name}).then(res => {
					if(res.data.code == 1){
						this.method = res.data.data;
						this.method_id = "";
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击弹框的添加权限码
			addAccessCode(){
				if(this.controller_id == "" || this.method_id == ""){
					this.$message.warning("请完善当前权限码");
				}else{
					let str = this.controller_id + "/" + this.method_id;
					for(var i = 0;i < this.access_codes.length;i ++){
						if(this.access_codes[i] == str){
							this.$message.warning('已存在该权限码');
							return;
						}
					}
					this.access_codes.push(str);
				}
			},
			//删除选中的权限码
			handleClose(index){
				this.access_codes.splice(index,1);
			},
			//添加/编辑提交
			addEditConfirm(){
				if(this.access_name == ''){
					this.$message.warning('请输入权限名称！');
					return;
				}
				if(this.menu_id == ''){
					this.$message.warning('请选择所属菜单！');
					return;
				}
				if(this.access_codes.length == 0){
					this.$message.warning('请选择权限码！');
					return;
				}
				if(this.is_button == 1 && this.button_name == ''){
					this.$message.warning('请输入按钮名称！');
					return;
				}
				let arg = {
					access_name:this.access_name,
					menu_id:this.menu_id,
					access_codes:JSON.stringify(this.access_codes),
					is_button:this.is_button,
					button_name:this.button_name,
					button_access_ids:this.button_access_ids.join(',')
				}
				if(this.dialog_type == 'add'){			//添加
					resource.accessAdd(arg).then(res => {
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
					arg['id'] = this.id;
					resource.accessEdit(arg).then(res => {
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
			//点击删除
			deleteFn(row){
				this.id = row.id;
				this.$refs.deleteDialog.show_dialog = true;
			},
			//删除确认
			deleteConfirm(){
				resource.accessDel({id:this.id}).then(res => {
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
			//监听排序
			sortChange(v){
				console.log(v)
			},
		},
		components:{
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
	.auto_form_item .el-form-item__content .el-checkbox-group .is-bordered{
		line-height: 20px!important;
	}
</style>
<style lang="less" scoped>

</style>