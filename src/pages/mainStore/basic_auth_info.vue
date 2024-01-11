<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jse mb16">
			<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
			<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="店铺：">
					<el-input v-model="shop_name" placeholder="开店名称/授权名称"></el-input>
				</el-form-item>
				<el-form-item label="授权类型：">
					<el-select v-model="auth_type_id" clearable placeholder="请选择授权类型">
						<el-option v-for="item in auth_type_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主体简称：">
					<el-select v-model="company_ids" clearable multiple filterable reserve-keyword placeholder="请选择主体简称" collapse-tags>
						<el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开店状态：">
					<el-select v-model="shop_status_ids" clearable multiple filterable reserve-keyword placeholder="请选择开店状态" collapse-tags>
						<el-option v-for="item in shop_status_list" :key="item" :label="item" :value="item">
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
					<CustomColumn :viewRow="view_row" :selectedIds="selected_ids" menuId="20" @callback="getData"/>
				</div>
			</div>
			<CustomTable tableName="basicAuthInfo" settingColumnWidth="180" :tableHeight="table_height" :titleList="title_list" :tableData="tableData" :loading="loading" :selection="false" @buttonCallback="changeLog" @editFn="addEditFn($event,'edit')" @detailFn="addEditFn($event,'detail')" @transferFn="transferFn"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 添加/编辑/详情 -->
		<custom-dialog :dialogTitle="dialog_title" dialogWidth="1200px" ref="addEditDialog" @close="clearForm" @callback="addEditConfirm">
			<el-form class="demo-form-inline dialog_form" :inline="true" label-width="148px">
				<el-form-item label="授权类型：" :required="dialog_type != 'detail'" v-if="filterShow('auth_type')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.auth_type}}</div>
					<el-select v-model="info.auth_type" style="width:186px" clearable placeholder="请选择授权类型" @change="setLocalStorage" v-else>
						<el-option v-for="item in auth_type_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="新开/授权：" :required="dialog_type != 'detail'" v-if="filterShow('is_new')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.is_new}}</div>
					<el-select v-model="info.is_new" style="width:186px" clearable placeholder="新开/授权" @change="setLocalStorage" v-else>
						<el-option v-for="item in is_new_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="管理员：" v-if="filterShow('shop_admin_name')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.shop_admin_name}}</div>
					<el-select v-model="info.shop_admin_id" style="width:186px" clearable filterable placeholder="请选择管理员" @change="setLocalStorage" v-else>
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品牌：" v-if="dialog_type == 'detail' && filterShow('brand_name')">
					<div class="detail_value">{{detail_data.brand_name}}</div>
				</el-form-item>
				<el-form-item label="平台：" :required="dialog_type != 'detail'" v-if="filterShow('platform')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.platform}}</div>
					<el-select v-model="info.platform" style="width:186px" clearable placeholder="请选择平台" @change="setLocalStorage" v-else>
						<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="店铺类型：" :required="dialog_type != 'detail'" v-if="filterShow('shop_type')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.shop_type}}</div>
					<el-select v-model="info.shop_type" style="width:186px" clearable placeholder="请选择店铺类型" @change="setLocalStorage" v-else>
						<el-option v-for="item in shop_type_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="授权名称：" :required="dialog_type != 'detail'" v-if="filterShow('auth_shop_name')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.auth_shop_name}}</div>
					<el-input v-model="info.auth_shop_name" placeholder="请输入授权名称" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="开店名称：" v-if="filterShow('shop_name')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.shop_name}}</div>
					<el-input v-model="info.shop_name" placeholder="请输入开店名称" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="开店状态：" :required="dialog_type != 'detail'" v-if="filterShow('shop_status')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.shop_status}}</div>
					<el-select v-model="info.shop_status" style="width:186px" clearable placeholder="请选择开店情况" @change="setLocalStorage" v-else>
						<el-option v-for="item in shop_status_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="运营状态：" :required="dialog_type != 'detail'" v-if="filterShow('operational_status')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.operational_status}}</div>
					<el-select v-model="info.operational_status" style="width:186px" clearable placeholder="请选择运营状态" @change="setLocalStorage" v-else>
						<el-option v-for="item in operational_status_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称一致：" v-if="dialog_type == 'detail' && filterShow('is_same')">
					<div class="detail_value">{{detail_data.is_same}}</div>
				</el-form-item>
				<el-form-item label="店铺领用：" v-if="filterShow('store_requisition')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.store_requisition}}</div>
					<el-input v-model="info.store_requisition" placeholder="请输入店铺领用" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="店铺分销：" v-if="filterShow('store_distribution')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.store_distribution}}</div>
					<el-input v-model="info.store_distribution" placeholder="请输入店铺分销" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="店铺手机号码：" v-if="filterShow('shop_tel')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.shop_tel}}</div>
					<el-input type="number" v-model="info.shop_tel" @change="setLocalStorage" placeholder="请输入店铺手机号码" v-else></el-input>
				</el-form-item>
				<el-form-item label="号码保管人：" v-if="filterShow('tel_custodian')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.tel_custodian}}</div>
					<el-select v-model="info.tel_custodian" style="width:186px" clearable filterable placeholder="请选择号码保管人" @change="setLocalStorage" v-else>
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主体简称：" :required="dialog_type != 'detail'" v-if="filterShow('company_alias')">
					<div class="detail_value" v-if="dialog_type == 'detail' || dialog_type == 'edit'">{{detail_data.company_alias}}</div>
					<el-select v-model="info.company_id" style="width:186px" :disabled="dialog_type == 'edit'" clearable filterable placeholder="请选择主体简称" v-else>
						<el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-divider></el-divider>
			<el-form class="demo-form-inline dialog_form" :inline="true" label-width="148px">
				<el-form-item label="OA流程编号：" v-if="filterShow('oa_id')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.oa_id}}</div>
					<el-input v-model="info.oa_id" placeholder="请输入OA流程编号" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="授权提交日：" v-if="filterShow('auth_date')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.auth_date}}</div>
					<el-date-picker class="textarea" value-format="yyyy-MM-dd" v-model="info.auth_date" type="date" placeholder="选择日期" @change="setLocalStorage" v-else>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="授权到期日：" v-if="filterShow('auth_expires_date')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.auth_expires_date}}</div>
					<el-date-picker class="textarea" value-format="yyyy-MM-dd" v-model="info.auth_expires_date" type="date" placeholder="选择日期" @change="setLocalStorage" v-else>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="授权PDF：" v-if="filterShow('auth_file_url')">
					<UploadFile :fileName="info.auth_file_url" :onlyView="dialog_type == 'detail'" :request="dialog_type == 'add'" @callback="uploadFile($event,'auth_file_url')"/>
				</el-form-item>
				<el-form-item label="备注：" v-if="filterShow('remark')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.remark}}</div>
					<el-input class="textarea" type="textarea" style="width:186px" :rows="3" v-model="info.remark" placeholder="请输入备注" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="开店情况：" v-if="filterShow('shop_situation')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.shop_situation}}</div>
					<el-input v-model="info.shop_situation" placeholder="请输入开店情况" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="授权确认：" v-if="filterShow('auth_confirm')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.auth_confirm}}</div>
					<el-input v-model="info.auth_confirm" placeholder="请输入授权确认" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
			</el-form>
			<el-divider></el-divider>
			<el-form class="demo-form-inline dialog_form" :inline="true" label-width="148px">
				<el-form-item label="账号ID：" v-if="filterShow('account_id')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.account_id}}</div>
					<el-input type="number" v-model="info.account_id" placeholder="请输入账号ID" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="子账号：" v-if="filterShow('sub_account')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.sub_account}}</div>
					<el-input v-model="info.sub_account" placeholder="请输入子账号" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="子账号密码：" v-if="filterShow('sub_account_password')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.sub_account_password}}</div>
					<el-input v-model="info.sub_account_password" placeholder="请输入子账号密码" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="子账号电话：" v-if="filterShow('sub_account_tel')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.sub_account_tel}}</div>
					<el-input type="number" v-model="info.sub_account_tel" placeholder="请输入授权名称" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="聚水潭账号：" v-if="filterShow('jst_id')"> 
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.jst_id}}</div>
					<el-input v-model="info.jst_id" placeholder="请输入聚水潭账号" @change="setLocalStorage" v-else></el-input>
				</el-form-item>
				<el-form-item label="聚水潭密码：" v-if="filterShow('jst_password')">
					<div class="detail_value" v-if="dialog_type == 'detail'">{{detail_data.jst_password}}</div>
					<el-input v-model="info.jst_password" placeholder="请输入聚水潭密码" @change="setLocalStorage" v-else></el-input>
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
		<!-- 转移主体 -->
		<custom-dialog dialogTitle="转移主体" ref="transferDialog" @callback="transferConfirm">
			<el-form class="dialog_form">
				<el-form-item label="店铺：">
					<div class="default_color f14 fw400">{{transfer_shop_name}}</div>
				</el-form-item>
				<el-form-item label="现主体：">
					<div class="default_color f14 fw400">{{company_name}}</div>
				</el-form-item>
				<el-form-item label="主体简称：">
					<el-select v-model="company_id" filterable placeholder="请选择主体简称">
						<el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 主体变更记录 -->
		<custom-dialog dialogTitle="主体变更记录" dialogWidth="1200px" ref="logDialog" :showConfirm="false" cancelText="关闭">
			<CustomTable tableName="changeLog" :selection="false" :index="false" :Setting="false" :tableHeight="500" :titleList="logTitleList" :tableData="changeLogData"/>
		</custom-dialog>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'
	import {exportExcel} from '@/utils/export.js'

	import SettingButton from '@/components/settingButton'
	import ScreenButton from '@/components/screenButton'
	import PageButton from '@/components/pageButton'
	import Pagination from '@/components/pagination'
	import CustomTable from '@/components/customTable'
	import CustomDialog from '@/components/customDialog'
	import UploadImage from '@/components/uploadImage'
	import UploadFile from '@/components/uploadFile'
	import CustomColumn from '@/components/customColumn'

	export default{
		data(){
			return{
				auth_type_list:[],					//授权类型列表
				company_list:[],					//客户列表
				shop_status_list:[],				//开店状态列表
				is_new_list:[],						//新开/授权列表
				user_list:[],						//所有用户列表
				plat_list:[],						//平台列表
				shop_type_list:[],					//店铺类型
				operational_status_list:[],			//运营状态列表
				shop_name:"",						//店铺名称
				auth_type_id:"",					//授权类型
				company_ids:[],						//主体简称
				shop_status_ids:[],					//开店状态
				unfold:true,						//筛选条件是否展开
				page:1,
				pagesize:10,
				total:0,
				title_list:[],						//动态列表
				titleList:[
				{
					label:'授权类型',
					prop:'auth_type'
				},{
					label:'新开/授权',
					prop:'is_new'
				},{
					label:'管理员姓名',
					prop:'shop_admin_name',
				},{
					label:'归属客户',
					prop:'current_custom_name',
				},{
					label:'平台',
					prop:'platform',
				},{
					label:'店铺类型',
					prop:'shop_type'
				},{
					label:'授权名称',
					prop:'auth_shop_name'
				},{
					label:'开店名称',
					prop:'shop_name',
					type:4
				},{
					label:'开店状态',
					prop:'shop_status'
				},{
					label:'运营状态',
					prop:'operational_status'
				},{
					label:'名称一致',
					prop:'is_same'
				},{
					label:'店铺领用',
					prop:'store_requisition'
				},{
					label:'店铺分销',
					prop:'store_distribution'
				},{
					label:'店铺手机号码',
					prop:'shop_tel'
				},{
					label:'号码保管人',
					prop:'tel_custodian'
				},{
					label:'主体名称(公司)',
					prop:'company_name'
				},{
					label:'品牌',
					prop:'brand_name'
				},{
					label:'主体简称',
					prop:'company_alias'
				},{
					label:'营业执照号',
					prop:'business_license_number'
				},{
					label:'主体注册地址',
					prop:'register_address'
				},{
					label:'经营人电话',
					prop:'operator_tel'
				},{
					label:'经营人身份证',
					prop:'operator_id_card'
				},{
					label:'经营人性别',
					prop:'operator_gender'
				},{
					label:'营业执照',
					prop:'business_license_url',
					type:2
				},{
					label:'身份证',
					prop:'id_card_url',
					type:2
				},{
					label:'OA流程编号',
					prop:'oa_id'
				},{
					label:'授权确认',
					prop:'auth_confirm'
				},{
					label:'授权提交日',
					prop:'auth_date'
				},{
					label:'授权到期日',
					prop:'auth_expires_date'
				},{
					label:'授权书PDF',
					prop:'auth_file_url',
					type:3
				},{
					label:'备注',
					prop:'remark'
				},{
					label:'开店情况',
					prop:'shop_situation'
				},{
					label:'账号ID',
					prop:'account_id'
				},{
					label:'子账号',
					prop:'sub_account'
				},{
					label:'子账号密码',
					prop:'sub_account_password'
				},{
					label:'子账号电话',
					prop:'sub_account_tel'
				},{
					label:'聚水潭账号',
					prop:'jst_id'
				},{
					label:'聚水潭密码',
					prop:'jst_password'
				}],
				tableData:[],
				table_height:0,
				loading:false,
				view_row:[],						//列表的所有列
				selected_ids:[],					//当前选中的所有列
				dialog_type:"add",					 //弹窗类型
				dialog_title:'添加店铺基础授权资料',	 //弹窗标题
				detail_data:{},						 //详情
				info:{
					auth_type:"",
					is_new:"",
					shop_type:"",
					operational_status:"",
					shop_tel:"",
					auth_date:"",
					shop_situation:"",
					sub_account_password:"",
					jst_password:"",
					shop_admin_id:"",
					auth_shop_name:"",
					shop_name:"",
					tel_custodian:"",
					auth_expires_date:"",
					account_id:"",
					sub_account_tel:"",
					sub_account:"",
					company_id:"",
					store_requisition:"",
					oa_id:"",
					jst_id:"",
					platform:"",
					auth_file_url:"",
					shop_status:"",
					store_distribution:"",
					auth_confirm:"",
					remark:""
				},
				new_info:{
					company_name:"",
					company_alias:"",
					business_license_number:"",
					register_address:"",
					operator_tel:"",
					operator_id_card:"",
					current_belong:"",
					business_license_url:"",
					id_card_url:"",
				},
				transfer_shop_name:"",				 //点击转移主体的店铺名称
				company_name:"",					 //点击转移主体的现主体
				company_id:"",						 //点击的公司主体ID
				company_shop_id:"",
				log_loading:false,
				logTitleList:[
				{
					label:'序号',
					prop:'index'
				},{
					label:'授权名称',
					prop:'auth_shop_name'
				},{
					label:'开店名称',
					prop:'shop_name'
				},{
					label:'变更操作人',
					prop:'add_user_name'
				},{
					label:'现主体',
					prop:'company_name'
				},{
					label:'主体简称',
					prop:'company_alias'
				},{
					label:'主体注册地址',
					prop:'register_address'
				},{
					label:'主体归属',
					prop:'current_belong'
				},{
					label:'经营人',
					prop:'legal_person'
				},{
					label:'经营人电话',
					prop:'operator_tel'
				},{
					label:'经营人身份证号',
					prop:'operator_id_card'
				},{
					label:'经营人性别',
					prop:'operator_gender_value'
				},{
					label:'营业执照',
					prop:'business_license_url',
					type:2
				},{
					label:'身份证',
					prop:'id_card_url',
					type:2
				},{
					label:'变更时间',
					prop:'add_time'
				}],				   						 //变更记录列表表头
				changeLogData:[],						 //主体变更记录
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
			//获取客户列表
			this.ajaxCompany();
			//获取所有用户列表
			this.ajaxUsers();
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
						this.auth_type_list = data.auth_type;			//授权类型
						this.shop_status_list = data.shop_status;		//开店状态
						this.is_new_list = data.is_new;					//新开授权
						this.plat_list = data.platform;					//平台
						this.shop_type_list = data.shop_type;			//店铺类型
						this.operational_status_list = data.operational_status;	//运营状态
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
					company_id:this.company_ids.join(','),
					shop_name:this.shop_name,
					shop_status:this.shop_status_ids.join(','),
					auth_type:this.auth_type_id,
					page:this.page,
					pagesize:this.pagesize,
				}
				this.loading = true;
				resource.shopList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;	//动态列表
						this.title_list.map(item => {
							item['label'] = item.row_name;
							item['prop'] = item.row_field_name;
							if(item.type == 3){
								item['type'] = 2;
							}
							if(item.type == 4){
								item['type'] = 3;
							}
							if(item.row_field_name == 'shop_name'){
								item['type'] = 4;
							}
						})

						this.tableData = data.table_data.data;
						this.tableData.map(item => {
							item['business_license_url'] = item.business_license_url?item.business_license_url.split(','):'';
							item['id_card_url'] = item.id_card_url?item.id_card_url.split(','):'';
						})
						this.total = data.table_data.total;
						this.view_row = data.view_row;
						this.selected_ids = data.selected_ids;
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
					this.dialog_title = '添加店铺基础授权资料';
					this.$refs.addEditDialog.show_dialog = true;
					//获取添加信息缓存
					this.getLocalStorage();
				}else if(this.dialog_type == 'detail'){	//详情
					this.dialog_title = '店铺基础授权资料详情';
					resource.shopInfo({company_shop_id:row.company_shop_id}).then(res => {
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
					this.dialog_title = '编辑店铺基础授权资料';
					this.company_shop_id = row.company_shop_id;
					resource.editShopGet({company_shop_id:this.company_shop_id}).then(res => {
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
				for(let k in this.new_info){
					this.new_info[k] = "";
				}
			},
			//添加/编辑提交
			addEditConfirm(){
				let arg = JSON.parse(JSON.stringify(this.info)); 
				if(arg.auth_type === ''){
					this.$message.warning('请选择授权类型!');
					return;
				}
				if(arg.is_new === ''){
					this.$message.warning('请选择新开/授权!');
					return;
				}
				if(arg.shop_type == ''){
					this.$message.warning('请选择店铺类型!');
					return;
				}
				if(arg.operational_status === ''){
					this.$message.warning('请选择运营状态!');
					return;
				}
				if(arg.auth_shop_name === ''){
					this.$message.warning('请输入授权名称!');
					return;
				}
				if(this.dialog_type == 'add' && arg.company_id == ''){
					this.$message.warning('请选择主体简称!');
					return;
				}
				if(arg.platform == ''){
					this.$message.warning('请选择平台!');
					return;
				}
				if(arg.shop_status === ''){
					this.$message.warning('请选择开店状态!');
					return;
				}
				if(this.dialog_type == 'add'){	//添加
					resource.addShop(arg).then(res => {
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
					arg['company_shop_id'] = this.company_shop_id;
					delete arg.company_id;
					resource.editShopPost(arg).then(res => {
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
					localStorage.setItem('basicAuthInfo',JSON.stringify(this.info));
					localStorage.setItem('basicAuthNewInfo',JSON.stringify(this.new_info));
				}
			},
			//获取添加信息缓存
			getLocalStorage(){
				if(localStorage.getItem('basicAuthInfo') && localStorage.getItem('basicAuthInfo')){
					let basicAuthInfo = JSON.parse(localStorage.getItem('basicAuthInfo'));
					for(let k in this.info){
						this.info[k] = basicAuthInfo[k];
					}
					let basicAuthNewInfo = JSON.parse(localStorage.getItem('basicAuthNewInfo'));
					for(let k in this.new_info){
						this.new_info[k] = basicAuthNewInfo[k];
					}
				}
			},
			//导出
			exportFn(){
				let arg = {
					company_id:this.company_ids.join(','),
					shop_name:this.shop_name,
					shop_status:this.shop_status_ids.join(','),
					auth_type:this.auth_type_id,
				}
				exportExcel(arg,'api/company_main_body/shop_export');
				this.$refs.exportDialog.show_dialog = false;
			},
			//点击下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/店铺基础授权资料导入模板.xlsx`);
			},
			//导入提交
			importFile(file){
				resource.importShop({file:file}).then(res => {
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
			//点击转移主体
			transferFn(row){
				this.transfer_shop_name = row.auth_shop_name;
				this.company_name = row.company_name;
				this.company_id = row.company_id;
				this.company_shop_id = row.company_shop_id;
				this.$refs.transferDialog.show_dialog = true;
			},
			//转移主体提交
			transferConfirm(){
				let arg = {
					company_id:this.company_id,
					company_shop_id:this.company_shop_id
				}
				resource.transferMian(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						//获取列表
						this.getData();
						this.$refs.transferDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击开店名称获取变更记录
			changeLog(arg){
				this.$refs.logDialog.show_dialog = true;
				this.log_loading = true;
				resource.changeList({company_shop_id:arg.row.company_shop_id}).then(res => {
					if (res.data.code == 1) {
						this.log_loading = false;
						let data = res.data.data;
						var change_log = [];
						data.map(item => {
							delete item.old_info;
							let new_item = {...item,...item.new_info};
							delete new_item.new_info;
							change_log.push(new_item);
						})
						this.changeLogData = change_log;
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
			UploadFile,
			CustomColumn
		}
	}
</script>
<style lang="less" scoped>
	.detail_value{
		color: #718096;
		width: 186px;
	}
</style>