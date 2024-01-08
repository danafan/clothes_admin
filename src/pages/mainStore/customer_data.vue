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
					<SettingButton :img="require('@/static/export_icon.png')" text="导出" @callback="$refs.exportDialog.show_dialog = true"/>
				</div>
			</div>
			<CustomTable tableName="customerData" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" :selection="false" @editFn="addEditFn($event,'edit')" @addMember="addMember" @buttonCallback="buttonCallback"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 导出 -->
		<custom-dialog dialogTitle="导出" ref="exportDialog" @callback="exportFn">
			<div class="default_color f14 fw400">确定导出吗？</div>
		</custom-dialog>
		<!-- 添加/编辑 -->
		<custom-dialog :dialogTitle="`${dialog_type == 'add'?'添加':'编辑'}主体`" ref="addEditDialog" @close="clearForm" @callback="addEditConfirm">
			<el-form class="dialog_form">
				<el-form-item label="客户：" required>
					<el-input v-model="info.custom_name" style="width:186px" placeholder="请输入客户名称"></el-input>
				</el-form-item>
				<el-form-item label="联系方式：">
					<el-input type="number" style="width:186px" v-model="info.custom_tel" placeholder="请输入联系方式"></el-input>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input type="textarea" style="width:186px" :rows="3" v-model="info.remark" placeholder="请输入备注"></el-input>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 添加成员 -->
		<custom-dialog dialogTitle="添加成员" ref="addCustomerDialog" @close="wx_user_id = ''" @callback="addCustomerConfirm">
			<el-form class="dialog_form">
				<el-form-item label="客户：">
					<div class="default_color f14 fw400">{{custom_name}}</div>
				</el-form-item>
				<el-form-item label="成员：" required>
					<el-select v-model="wx_user_id" filterable placeholder="请选择成员">
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 成员列表 -->
		<custom-dialog :dialogTitle="`【${custom_name}】成员列表`" :showConfirm="false" cancelText="关闭" ref="userListDialog">
			<el-table class="mb8" :data="userData" :header-cell-style="{'background':'#DDE7FF','height':'58px','color':'#4E5969','font-size':'14px'}" border>
				<el-table-column label="序号" align="center" type="index" width="60">
				</el-table-column>
				<el-table-column label="用户" prop="wx_user_name" align="center">
				</el-table-column>
			</el-table>
			<Pagination :page="user_page" :pagesize="user_pagesize" :total="user_total" @changePage="changeUserPage"/>
		</custom-dialog>
		<!-- 主体列表 -->
		<custom-dialog :dialogTitle="`【${custom_name}】主体列表`" :showConfirm="false" cancelText="关闭" ref="companyDialog">
			<el-table class="mb8" :data="companyData" :header-cell-style="{'background':'#DDE7FF','height':'58px','color':'#4E5969','font-size':'14px'}" border>
				<el-table-column label="序号" align="center" type="index" width="60">
				</el-table-column>
				<el-table-column label="主体" prop="company_name" align="center">
				</el-table-column>
			</el-table>
			<Pagination :page="company_page" :pagesize="company_pagesize" :total="company_total" @changePage="changeCompanyPage"/>
		</custom-dialog>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'
	import {exportPost} from '@/utils/export.js'

	import SettingButton from '@/components/settingButton'
	import ScreenButton from '@/components/screenButton'
	import PageButton from '@/components/pageButton'
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
					label:'客户',
					prop:'custom_name'
				},{
					label:'联系方式',
					prop:'custom_tel'
				},{
					label:'成员数量',
					prop:'custom_user_num',
					type:4,
				},{
					label:'关联主体',
					prop:'company_num',
					type:4,
				},{
					label:'添加时间',
					prop:'add_time',
				},{
					label:'备注',
					prop:'remark'
				}],
				tableData:[],
				table_height:0,
				loading:false,
				custom_id:"",						 //点击的客户ID
				custom_name:"",						 //点击的客户名称
				wx_user_id:"",						 //选择的用户ID
				dialog_type:"add",					 //弹窗类型
				info:{
					custom_name:"",
					custom_tel:"",
					remark:""
				},						   //客户数据
				user_list:[],						 //未绑定客户的成员列表
				user_page:1,						 //当前客户的成员列表
				user_pagesize:10,
				user_total:0,
				userData:[],
				company_page:1,						 //当前客户的主体列表
				company_pagesize:10,
				company_total:0,
				companyData:[],
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
				this.loading = true;
				resource.customList().then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data.table_data;
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
			//点击成员数量/关联主体数量
			buttonCallback(arg){
				this.custom_name = arg.row.custom_name;
				this.custom_id = arg.row.custom_id;
				if(arg.prop == 'custom_user_num'){		//成员数量
					//获取客户对应用户列表
					this.customUsers();
				}else if(arg.prop == 'company_num'){	//关联主体
					//获取客户对应主体列表
					this.customCompany();
				}
			},
			//获取客户对应用户列表
			customUsers(){
				let arg = {
					custom_id:this.custom_id,
					page:this.user_page,
					pagesize:this.user_pagesize
				}
				resource.customUsers(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.userData = data.data;
						this.user_total = data.total;
						this.$refs.userListDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取客户对应用户列表分页
			changeUserPage(page){
				this.user_page = page;
				//获取列表
				this.customUsers();
			},
			//获取客户对应主体列表
			customCompany(){
				let arg = {
					custom_id:this.custom_id,
					page:this.company_page,
					pagesize:this.company_pagesize
				}
				resource.customCompany(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.companyData = data.data;
						this.company_total = data.total;
						this.$refs.companyDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取客户对应主体列表分页
			changeCompanyPage(page){
				this.company_page = page;
				//获取列表
				this.customCompany();
			},
			//点击添加/编辑/查看
			addEditFn(row,type){
				this.dialog_type = type;
				if(this.dialog_type == 'add'){			//添加
					this.$refs.addEditDialog.show_dialog = true;
				}else{									//编辑
					this.custom_id = row.custom_id;
					resource.editCustomGet({custom_id:this.custom_id}).then(res => {
						if (res.data.code == 1) {
							let data = res.data.data;
							for(let k in this.info){
								this.info[k] = data[k];
							}
							this.$refs.addEditDialog.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}
			},
			//清除添加/编辑表单数据
			clearForm(){
				for(let k in this.info){
					this.info[k] = "";
				}
			},
			//添加/编辑提交
			addEditConfirm(){
				let arg = JSON.parse(JSON.stringify(this.info)); 
				if(arg.custom_name == ''){
					this.$message.warning('请输入客户名称!');
					return;
				}
				if(this.dialog_type == 'add'){	//添加
					resource.addCustom(arg).then(res => {
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
					arg['custom_id'] = this.custom_id;
					resource.editCustomPost(arg).then(res => {
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
			//导出
			exportFn(){
				resource.customExport().then(res => {
					if(res){
						exportPost("\ufeff" + res.data,'客户资料表','csv');
						this.$refs.exportDialog.show_dialog = false;
					}
				})
			},
			//点击添加成员
			addMember(row){
				this.custom_id = row.custom_id;
				this.custom_name = row.custom_name;
				this.$refs.addCustomerDialog.show_dialog = true;
				resource.ajaxUsers({type:4}).then(res => {
					if(res.data.code == 1){
						this.user_list = res.data.data
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//客户添加成员提交
			addCustomerConfirm(){
				if(this.wx_user_id == ''){
					this.$message.warning('请选择成员！');
					return;
				}
				let arg = {
					custom_id:this.custom_id,
					wx_user_id:this.wx_user_id
				}
				resource.addCustomUser(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.$refs.addCustomerDialog.show_dialog = false;
						//获取列表
						this.getData();
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
			ScreenButton,
			PageButton,
			Pagination,
			CustomTable,
			CustomDialog
		}
	}
</script>
<style lang="less" scoped>
	
</style>