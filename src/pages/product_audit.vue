<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jsb mb16">
			<PageRadio :radioList="radio_list" :activeIndex="active_index" @checkRadio="checkRadio"/>
			<div class="flex">
				<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
				<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
			</div>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="时间：">
					<el-date-picker v-model="date" unlink-panels type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="供应商：">
					<el-select style="width:234px" v-model="supplier_ids" clearable multiple filterable placeholder="请选择">
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品类：">
					<el-select style="width:234px" v-model="cate_ids" clearable multiple filterable placeholder="请选择">
						<el-option v-for="item in cate_list" :key="item.category_id" :label="item.category_name" :value="item.category_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品名：">
					<el-input style="width:234px" v-model="goods_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="搜索：">
					<el-input style="width:198px" v-model="search" placeholder="款号/货号"></el-input>
				</el-form-item>
				<el-form-item>
					<div class="flex">
						<el-select style="width:136px;margin-right: 8px;" v-model="price_type" placeholder="点击查看">
							<el-option v-for="item in price_type_list" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-input style="width:136px" type="number" clearable v-model="start_price" placeholder="最低价"></el-input>
						&nbsp
						~
						&nbsp
						<el-input style="width:136px" type="number" clearable v-model="end_price" placeholder="最高价"></el-input>
					</div>
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
					<SettingButton :img="require('@/static/send_audit.png')" text="批量审核" @callback="setFn(goods_ids,'all')"/>
					<SettingButton :img="require('@/static/export_icon.png')" text="导出" @callback="$refs.exportDialog.show_dialog = true"/>
					<SettingButton :img="require('@/static/setting_list_icon.png')" text="列表视图" v-if="card_view" @callback="card_view = false"/>
					<SettingButton :img="require('@/static/setting_card_icon.png')" text="卡片视图" v-else @callback="card_view = true"/>
				</div>
			</div>
			<div class="flex flex-warp pl16 scrolly" :style="{height:`${table_height}px`}" v-if="card_view">
				<GoodsCardItem :goodsItem="item" :currentIndex="index" v-for="(item,index) in tableData" @changeSelect="selectionCardChange" @checkStatus="checkStatus"/>
			</div>
			<CustomTable tableName="productAudit" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" @selectionChange="selectionChange" @auditFn="setFn($event,'only')" v-else/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 审核/批量审核 -->
		<custom-dialog dialogTitle="审核" ref="auditDialog" @callback="auditConfirm">
			<el-form label-position="left">
				<el-form-item>
					<el-radio-group v-model="type">
						<el-radio :label="1">通过</el-radio>
						<el-radio :label="2">拒绝</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="audit_type == 'all'">
					<div>勾选{{goods_ids.length}}个资料，确定全部{{type == 1?'通过':'拒绝'}}吗？</div>
				</el-form-item>
			</el-form>
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
	import GoodsCardItem from '@/components/goodsCardItem'
	export default{
		data(){
			return{
				radio_list:[
				{
					id:-1,
					name:'全部',
					icon:require('@/static/all_icon.png'),
					icon_active:require('@/static/all_icon_active.png'),
					unread:false
				},{
					id:0,
					name:'待审核',
					icon:require('@/static/await_audit.png'),
					icon_active:require('@/static/await_audit_active.png'),
					unread:false
				},{
					id:1,
					name:'审核通过',
					icon:require('@/static/pass_icon.png'),
					icon_active:require('@/static/pass_icon_active.png'),
					unread:false
				},{
					id:2,
					name:'审核拒绝',
					icon:require('@/static/turn_down.png'),
					icon_active:require('@/static/turn_down_active.png'),
					unread:false
				}],					  //筛选条件
				active_index:0,						//当前选中的下标
				unfold:true,						//筛选条件是否展开
				date:[],							//时间选择
				user_list:[],				  		//供应商列表
				supplier_ids:[],					//选中的供应商
				cate_list:[],				  		//产品分类列表
				cate_ids:[],						//选中的产品分类
				goods_name:"",						//品名
				search:"",							//搜索内容
				price_type_list:[
				{
					id:1,
					name:'吊牌价'
				},{
					id:2,
					name:'日常价'
				},{
					id:3,
					name:'活动价'
				},{
					id:4,
					name:'大促价'
				}
				],				  //价格类型列表
				price_type:1,					    //选中的价格类型
				start_price:"",						//最低价
				end_price:"",						//最高价
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'品牌',
					prop:'brand_name',
				},{
					label:'系列',
					prop:'series_name',
				},{
					label:'品类',
					prop:'category_name',
				},{
					label:'品名',
					prop:'goods_name',
				},{
					label:'季节',
					prop:'season',
				},{
					label:'款号',
					prop:'style_name',
				},{
					label:'货号',
					prop:'cphh',
				},{
					label:'SPU',
					prop:'spu',
				},{
					label:'SKU',
					prop:'sku',
				},{
					label:'色号',
					prop:'color_number',
				},{
					label:'颜色名称',
					prop:'color',
				},{
					label:'商品单位',
					prop:'unit',
				},{
					label:'主图',
					prop:'main_img',
					type:1
				},{
					label:'吊牌价',
					prop:'dpj',
				},{
					label:'日常价',
					prop:'rcj',
				},{
					label:'活动价',
					prop:'hdj',
				},{
					label:'大促价',
					prop:'dcj',
				},{
					label:'折扣',
					prop:'discount',
				},{
					label:'规格尺码',
					prop:'spec',
				},{
					label:'材质',
					prop:'material_quality',
				},{
					label:'产品卖点',
					prop:'selling_point',
				},{
					label:'使用人群',
					prop:'user_group',
				},{
					label:'细节图',
					prop:'detail_imgs',
					type:2
				},{
					label:'预计上架时间',
					prop:'up_time',
				},{
					label:'规划色',
					prop:'plan_color',
				},{
					label:'字体',
					prop:'typeface',
				},{
					label:'工艺',
					prop:'technology',
				},{
					label:'参考图案',
					prop:'reference_img',
				},{
					label:'备注补充内容',
					prop:'remark',
				},{
					label:'审核意见',
					prop:'brand_audit_remark'
				},{
					label:'知核意见',
					prop:'brand_zhyj'
				},{
					label:'新建时间',
					prop:'add_time',
				},{
					label:'工艺资料包',
					prop:'technology_url',
					type:3
				},{
					label:'线性图稿',
					prop:'linear_draft_url',
					type:3
				},{
					label:'供应商',
					prop:'supplier_name'
				},{
					label:'状态',
					prop:'status_name'
				}],
				tableData:[],
				table_height:0,
				loading:false,
				card_view:false,						//是否卡片展示
				goods_ids:[],						//当前勾选的商品ID
				goods_id:"",						//当前点击的商品ID
				type:1,								//审核默认选中类型
				audit_type:'',						//审核类型（区分多选和单个操作）
			}
		},
		watch:{
			//展开/收起筛选条件
			unfold:function(n,o){
				//设置表格高度
				this.onResize();
			},
			//展示卡片时初始化勾选状态
			card_view:function(n,o){
				if(n){
					let tableData = JSON.parse(JSON.stringify(this.tableData));
					tableData.map((item,index) => {
						if(this.goods_ids.indexOf(item.goods_id) > -1){
							item['selected'] = true;
						}else{
							item['selected'] = false;
						}
						this.$set(this.tableData,index,item);
					})
				}
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
			//获取品类列表
			this.ajaxCates();
			//获取用户列表
			this.ajaxUsers();
			//获取商品寄样列表
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
			//获取品类列表
			ajaxCates(){
				resource.ajaxCates().then(res => {
					if (res.data.code == 1) {
						this.cate_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取用户列表
			ajaxUsers(){
				resource.ajaxUsers({type:2}).then(res => {
					if (res.data.code == 1) {
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取列表
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					category_id:this.cate_ids.join(','),
					goods_name:this.goods_name,
					search:this.search,
					price_type:this.price_type,
					start_price:this.start_price,
					end_price:this.end_price,
					supplier_id:this.supplier_ids.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.active_index > 0){
					arg['admin_status'] = this.radio_list[this.active_index].id;
				}
				this.loading = true;
				resource.adminGoodsList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.tableData = data.data;
						this.tableData.map(item => {
							if(item.admin_status == 0){
								item['status_name'] = '待审核';
							}else if(item.admin_status == 1){
								item['status_name'] = '审核通过';
							}else if(item.admin_status == 2){
								item['status_name'] = '审核拒绝';
							}
							let new_detail_imgs = [];
							for (var i = 0; i < item.detail_imgs.length; i += 3) {
								new_detail_imgs.push(item.detail_imgs.slice(i, i + 3));
							}
							item['preview_detail_imgs'] = new_detail_imgs;

							item['selected'] = false;
							item['is_up'] = true;
						})
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换单选
			checkRadio(index){
				this.active_index = index;
				//获取列表
				this.getData();
			},
			//切换页码
			changePage(page){
				this.page = page;
				//获取列表
				this.getData();
			},
			//列表监听多选
			selectionChange(selected_list){
				let goods_ids = selected_list.map(item => {
					return item.goods_id;
				})
				this.goods_ids = goods_ids;
			},
			//卡片监听多选
			selectionCardChange(v){
				let tableData = JSON.parse(JSON.stringify(this.tableData));
				let current_item = tableData[v.index];
				current_item['selected'] = v.bool;
				this.$set(this.tableData,v.index,current_item);
				let goods_arr = tableData.filter(item => {
					return item.selected;
				})
				let goods_ids = goods_arr.map(item => {
					return item.goods_id;
				})
				this.goods_ids = goods_ids;
			},
			//卡片监听展开收起
			checkStatus(){
				let newTableData = JSON.parse(JSON.stringify(this.tableData));
				newTableData.map((item,index) => {
					item['is_up'] = !item['is_up'];
					this.$set(this.tableData,index,item)
				})
			},
			//点击审核
			setFn(arg,ref_name){
				this.audit_type = ref_name;
				if(ref_name == 'all' && arg.length == 0){
					this.$message.warning('请至少勾选一项！');
					return;
				}
				this.goods_id = ref_name == 'all'?arg.join(','):arg;
				this.$refs.auditDialog.show_dialog = true;
			},
			//审核提交
			auditConfirm(){
				let arg = {
					goods_id:this.goods_id,
					type:this.type
				}
				resource.adminGoodsAudit(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						//获取列表
						this.getData();
						this.$refs.auditDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//导出
			exportFn(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					category_id:this.cate_ids.join(','),
					goods_name:this.goods_name,
					search:this.search,
					price_type:this.price_type,
					start_price:this.start_price,
					end_price:this.end_price,
					supplier_id:this.supplier_ids.join(','),
				}
				if(this.active_index > 0){
					arg['admin_status'] = this.radio_list[this.active_index].id;
				}
				exportExcel(arg,'api/goods/export');
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
			GoodsCardItem
		}
	}
</script>
<style lang="less" scoped>

</style>