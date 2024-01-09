<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jse mb16">
			<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
			<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="主体全称（公司）：">
					<el-input v-model="company_name" placeholder="请输入主体全称"></el-input>
				</el-form-item>
				<el-form-item label="主体简称：">
					<el-input v-model="company_alias" placeholder="请输入主体简称"></el-input>
				</el-form-item>
				<el-form-item label="主体类型：">
					<el-select v-model="main_body_type_id" clearable placeholder="请选择主体类型">
						<el-option v-for="item in main_body_type" :key="item" :label="item" :value="item">
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
			<div class="p16 flex ac jsb" id="table_setting">
				<div class="table_color f14 fw500">数据列表</div>
				<div class="flex">
					<SettingButton :img="require('@/static/create_icon.png')" text="添加" @callback="addEditFn('','add')"/>
					<SettingButton :img="require('@/static/import_icon.png')" text="导入" @callback="$refs.importDialog.show_dialog = true"/>
					<SettingButton :img="require('@/static/export_icon.png')" text="导出" @callback="$refs.exportDialog.show_dialog = true"/>
				</div>
			</div>
			<CustomTable tableName="mainInfo" settingColumnWidth="120" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" :selection="false" @editFn="addEditFn($event,'edit')" @detailFn="addEditFn($event,'detail')"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 添加/编辑/详情 -->
		<custom-dialog :dialogTitle="dialog_title" dialogWidth="1400px" ref="addEditDialog" @close="clearForm" @callback="addEditConfirm">
			<el-form class="demo-form-inline dialog_form" style="height: 460px;" :inline="true" label-width="148px">
				<el-form-item label="主体类型：" v-if="filterShow('main_body_type')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.main_body_type}}</div>
					<el-select v-model="info.main_body_type" style="width:186px" clearable placeholder="请选择主体类型" @change="setLocalStorage" v-else>
						<el-option v-for="item in main_body_type" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="管理员：" v-if="filterShow('company_admin_name')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.company_admin_name}}</div>
					<el-select v-model="info.company_admin_id" style="width:186px" clearable filterable placeholder="请选择管理员" @change="setLocalStorage" v-else>
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主体全称（公司）：" :required="dialog_type != 'detail'" v-if="filterShow('company_name')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.company_name}}</div>
					<el-input v-model="info.company_name" placeholder="请输入主体全称" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="主体简称：" :required="dialog_type != 'detail'" v-if="filterShow('company_alias')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.company_alias}}</div>
					<el-input v-model="info.company_alias" placeholder="请输入主体简称" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="营业执照号：" v-if="filterShow('business_license_number')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.business_license_number}}</div>
					<el-input v-model="info.business_license_number" placeholder="请输入营业执照号" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="主体注册地址：" v-if="filterShow('register_address')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.register_address}}</div>
					<el-input v-model="info.register_address" placeholder="请输入主体注册地址" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="经营人：" v-if="filterShow('legal_person')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.legal_person}}</div>
					<el-input v-model="info.legal_person" placeholder="请输入经营人" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="经营人电话：" v-if="filterShow('operator_tel')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.operator_tel}}</div>
					<el-input type="number" v-model="info.operator_tel" placeholder="请输入经营人电话" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="经营人性别：" v-if="filterShow('operator_gender')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.operator_gender}}</div>
					<el-select v-model="info.operator_gender" style="width:186px" clearable filterable placeholder="请选择经营人性别" @change="setLocalStorage" v-else>
						<el-option v-for="item in operator_gender_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="经营人身份证：" v-if="filterShow('operator_id_card')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.operator_id_card}}</div>
					<el-input v-model="info.operator_id_card" placeholder="请输入经营人身份证" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="开店数量：" v-if="dialog_type == 'detail' && filterShow('shop_num')">
					<div class="detail_value">{{detail_data.shop_num}}</div>
				</el-form-item>
				<el-form-item label="主体原归属：" v-if="filterShow('original_belong')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.original_belong}}</div>
					<el-select v-model="info.original_custom_id" style="width:186px" clearable filterable placeholder="请选择主体原归属" @change="setLocalStorage" v-else>
						<el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系人：" v-if="filterShow('contacts')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.contacts}}</div>
					<el-input v-model="info.contacts" placeholder="请输入联系人" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="联系人电话：" v-if="filterShow('contacts_tel')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.contacts_tel}}</div>
					<el-input type="number" v-model="info.contacts_tel" placeholder="请输入联系人电话" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="联系地址：" v-if="filterShow('contacts_address')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.contacts_address}}</div>
					<el-input v-model="info.contacts_address" placeholder="请输入联系地址" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="归属客户：" v-if="filterShow('current_belong')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.current_belong}}</div>
					<el-select v-model="info.current_custom_id" style="width:186px" clearable filterable placeholder="请选择归属客户" @change="setLocalStorage" v-else>
						<el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否转出：" v-if="filterShow('is_transfer_out')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.is_transfer_out}}</div>
					<el-select v-model="info.is_transfer_out" style="width:186px" clearable filterable placeholder="请选择是否转出" @change="setLocalStorage" v-else>
						<el-option v-for="item in is_transfer_out_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="合同条款：" v-if="filterShow('contract_terms')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.contract_terms}}</div>
					<el-select v-model="info.contract_terms" style="width:186px" clearable placeholder="请选择合同条款" @change="setLocalStorage" v-else>
						<el-option v-for="item in contract_terms_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="合同PDF：" v-if="filterShow('contract_url')">
					<UploadFile :fileName="info.contract_url" :onlyView="dialog_type == 'detail'" :request="dialog_type == 'add'" @callback="uploadFile($event,'contract_url')"/>
				</el-form-item>
				<el-form-item label="新客申请：" v-if="filterShow('new_apply')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.new_apply}}</div>
					<el-input v-model="info.new_apply" placeholder="请输入新客申请" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="品牌：" :required="dialog_type != 'detail'" v-if="filterShow('brand_name')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.brand_name}}</div>
					<el-select v-model="info.brand_id" style="width:186px" clearable filterable placeholder="请选择品牌" @change="setLocalStorage" v-else>
						<el-option v-for="item in brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注：" v-if="filterShow('remark')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.remark}}</div>
					<el-input class="textarea" style="width:186px" type="textarea" :rows="3" v-model="info.remark" placeholder="请输入备注" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="身份证照片：" v-if="filterShow('id_card_url')">
					<UploadImage text="最多两张" :maxNum="2" :imgStr="info.id_card_url" :request="dialog_type == 'add'" :onlyView="dialog_type == 'detail'" @callback="uploadImage($event,'id_card_url')"/>
				</el-form-item>
				<el-form-item label="营业执照：" v-if="filterShow('business_license_url')">
					<UploadImage text="最多两张" :maxNum="2" :imgStr="info.business_license_url" :request="dialog_type == 'add'" :onlyView="dialog_type == 'detail'" @callback="uploadImage($event,'business_license_url')"/>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 导出 -->
		<custom-dialog dialogTitle="导出" ref="exportDialog" @callback="exportFn">
			<div class="default_color f14 fw400">确定导出吗？</div>
		</custom-dialog>
		<!-- 导入 -->
		<custom-dialog dialogTitle="导入" ref="importDialog" :showConfirm="false">
			<el-form class="dialog_form">
				<el-form-item>
					<div class="flex">
						<SettingButton margin="right" :img="require('@/static/download_icon.png')" text="下载模版" @callback="downTemplate"/>
						<SettingButton :isImport="true" :img="require('@/static/import_icon.png')" text="导入" @callback="importFile"/>
					</div>
				</el-form-item>
				<el-form-item>
					<div class="flex">
						<div class="default_color f12 mr24">1.下载模板</div>
						<div class="default_color f12 mr24">2.填写相关信息</div>
						<div class="default_color f12">3.导入填写完的模板</div>
					</div>
				</el-form-item>
			</el-form>
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
	import UploadImage from '@/components/uploadImage'
	import UploadFile from '@/components/uploadFile'

	export default{
		data(){
			return{
				main_body_type:[],					//主体类型列表
				operator_gender_list:[],			//经营人性别
				is_transfer_out_list:[],			//是否转出
				contract_terms_list:[],				//合同条款
				brand_list:[],						//品牌列表
				user_list:[],						//所有用户列表
				company_list:[],					//客户列表
				company_name:"",					//主体全称（公司）
				company_alias:"",					//主体简称
				main_body_type_id:"",				//主体类型
				unfold:true,						//筛选条件是否展开
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'主体类型',
					prop:'main_body_type'
				},{
					label:'管理员',
					prop:'company_admin_name'
				},{
					label:'主体全称(公司)',
					prop:'company_name',
				},{
					label:'主体简称',
					prop:'company_alias',
				},{
					label:'营业执照号',
					prop:'business_license_number',
				},{
					label:'主体注册地址',
					prop:'register_address'
				},{
					label:'经营人',
					prop:'legal_person'
				},{
					label:'经营人电话',
					prop:'operator_tel'
				},{
					label:'经营人性别',
					prop:'operator_gender'
				},{
					label:'经营人身份证',
					prop:'operator_id_card'
				},{
					label:'开店数量',
					prop:'shop_num'
				},{
					label:'主体原归属',
					prop:'original_custom_name'
				},{
					label:'联系人',
					prop:'contacts'
				},{
					label:'联系电话',
					prop:'contacts_tel'
				},{
					label:'联系地址',
					prop:'contacts_address'
				},{
					label:'归属客户',
					prop:'current_custom_name'
				},{
					label:'是否转出',
					prop:'is_transfer_out'
				},{
					label:'合同条款',
					prop:'contract_terms'
				},{
					label:'备注',
					prop:'remark'
				},{
					label:'合同PDF',
					prop:'contract_url',
					type:3
				},{
					label:'营业执照',
					prop:'business_license_url',
					type:2
				},{
					label:'身份证',
					prop:'id_card_url',
					type:2
				},{
					label:'新客申请',
					prop:'new_apply'
				},{
					label:'品牌',
					prop:'brand_name'
				}],
				tableData:[],
				table_height:0,
				loading:false,
				company_id:"",						 //点击的公司主体ID
				dialog_type:"add",					 //弹窗类型
				dialog_title:'添加主体',			 	 //弹窗标题
				detail_data:{},						 //详情
				info:{
					main_body_type:"",
					company_alias:"",
					legal_person:"",
					original_custom_id:"",	
					contacts_address:"",
					contract_terms:"",
					company_admin_id:"",
					brand_id:"",
					business_license_number:"",
					operator_tel:"",
					operator_gender:"",
					contacts:"",
					current_custom_id:"",
					remark:"",
					company_name:"",
					register_address:"",
					operator_id_card:"",
					contacts_tel:"",
					is_transfer_out:"",
					new_apply:"",
					business_license_url:"",
					id_card_url:"",
					contract_url:"",							
				},
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
			//获取所有下拉框数据列表
			this.ajaxParams();
			//获取所有用户列表
			this.ajaxUsers();
			//获取客户列表
			this.ajaxCompany();
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
			//获取所有下拉框数据列表
			ajaxParams(){
				resource.ajaxParams().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.main_body_type = data.main_body_type;			//主体类型
						this.operator_gender_list = data.operator_gender;	//经营人性别
						this.is_transfer_out_list = data.is_transfer_out;	//是否转出
						this.contract_terms_list = data.contract_terms;		//合同条款
						this.brand_list = data.brand;						//品牌
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取所有用户列表
			ajaxUsers(){
				resource.ajaxUsers({type:1}).then(res => {
					if(res.data.code == 1){
						this.user_list = res.data.data
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取客户列表
			ajaxCompany(){
				resource.ajaxCompany().then(res => {
					if(res.data.code == 1){
						this.company_list = res.data.data
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getData(){
				let arg = {
					company_name:this.company_name,
					company_alias:this.company_alias,
					main_body_type:this.main_body_type_id,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.companyMainBodyList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data.table_data;
						this.tableData = data.data;
						this.tableData.map(item => {
							item['business_license_url'] = item.business_license_url?item.business_license_url.split(','):'';
							item['id_card_url'] = item.id_card_url?item.id_card_url.split(','):'';
						})
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
			//点击添加/编辑/查看
			addEditFn(row,type){
				this.dialog_type = type;
				if(this.dialog_type == 'add'){			//添加
					this.dialog_title = '添加主体';
					this.$refs.addEditDialog.show_dialog = true;
					//获取添加信息缓存
					this.getLocalStorage();
				}else if(this.dialog_type == 'detail'){	//详情
					this.dialog_title = '主体详情';
					resource.companyMainBodyInfo({company_id:row.company_id}).then(res => {
						if (res.data.code == 1) {
							this.detail_data = res.data.data;
							for(let k in this.info){
								this.info[k] = this.detail_data[k];
							}
							this.$refs.addEditDialog.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}else{									//编辑
					this.dialog_title = '编辑主体';
					this.company_id = row.company_id;
					resource.companyMainBodyEditGet({company_id:this.company_id}).then(res => {
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
			//上传图片回调
			uploadImage(img_arr,prop){
				this.info[prop] = img_arr.join(',');
			},
			//上传文件回调
			uploadFile(file_url,prop){
				this.info[prop] = file_url;
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
				if(arg.company_alias == ''){
					this.$message.warning('请输入主体简称!');
					return;
				}
				if(arg.brand_id == ''){
					this.$message.warning('请选择品牌!');
					return;
				}
				if(arg.company_name == ''){
					this.$message.warning('请输入主体全称!');
					return;
				}
				if(this.dialog_type == 'add'){	//添加
					resource.companyMainBodyAdd(arg).then(res => {
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
					arg['company_id'] = this.company_id;
					resource.companyMainBodyEditPost(arg).then(res => {
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
			//判断详情是否展示字段
			filterShow(field_name){
				if(this.dialog_type == 'detail'){
					return (field_name in this.detail_data)
				}else{
					return true
				}
			},
			//设置添加信息缓存
			setLocalStorage(){
				if(this.dialog_type == 'add'){
					localStorage.setItem('mainBodyInfo',JSON.stringify(this.info));
				}
			},
			//获取添加信息缓存
			getLocalStorage(){
				if(localStorage.getItem('mainBodyInfo')){
					let mainBodyInfo = JSON.parse(localStorage.getItem('mainBodyInfo'));
					for(let k in this.info){
						this.info[k] = mainBodyInfo[k];
					}
				}
			},
			//导出
			exportFn(){
				let arg = {
					company_name:this.company_name,
					company_alias:this.company_alias,
					main_body_type:this.main_body_type_id
				}
				resource.mainBodyInfoExport(arg).then(res => {
					if(res){
						exportPost("\ufeff" + res.data,'公司主体资料表','.xlsx');
						this.$refs.exportDialog.show_dialog = false;
					}
				})
			},
			//点击下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/主体资料导入模板.xlsx`);
			},
			//导入提交
			importFile(file){
				resource.mainBodyInfoImport({file:file}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						//获取列表
						this.getData();
						this.$refs.importDialog.show_dialog = false;
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
			CustomDialog,
			UploadImage,
			UploadFile
		}
	}
</script>
<style lang="less" scoped>
	.detail_value{
		color: #718096;
		width: 186px;
	}
</style>