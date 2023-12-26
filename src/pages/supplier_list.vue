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
					<SettingButton :img="require('@/static/setting_list_icon.png')" text="添加供应商"/>
				</div>
			</div>
			<CustomTable tableName="productAudit" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" :selection="false" @buttonCallback="buttonCallback" @changeStatus="changeStatus"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 导出 -->
		<custom-dialog dialogTitle="导出" ref="exportDialog" @callback="exportFn">
			<div class="default_color f14 fw400">确定导出吗？</div>
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
	export default{
		data(){
			return{
				unfold:true,						//筛选条件是否展开
				search:"",							//搜索内容
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'供应商名称',
					prop:'brand_name',
				},{
					label:'供应商地址',
					prop:'brand_name',
				},{
					label:'联系方式',
					prop:'brand_name',
				},{
					label:'合作品牌',
					prop:'brand_name',
				},{
					label:'添加时间',
					prop:'brand_name',
				},{
					label:'账户启用状态',
					prop:'brand_name',
					type:5
				},{
					label:'成员数量',
					prop:'brand_name',
					type:4
				}],
				tableData:[],
				table_height:0,
				loading:false,
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
								item['status_name'] = '待发起';
							}else if(item.admin_status == 1){
								item['status_name'] = '待审核';
							}else if(item.admin_status == 2){
								item['status_name'] = '审核通过';
							}else if(item.admin_status == 3){
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
			//点击成员数量
			buttonCallback(row){
				console.log(row)
			},
			//切换状态开关
			changeStatus(v){
				console.log(v)
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
				let arg_arr = [];
				for(let k in arg){
					arg_arr.push(`${k}=${arg[k]}`)
				}
				let export_url = `${location.origin}/api/goods/export?${arg_arr.join('&')}`;
				console.log(export_url)
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

</style>