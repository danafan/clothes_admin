<template>
	<div class="relative">
		<el-table ref="customTable" class="custom_table" :height="tableHeight" :data="tableData" :header-cell-style="{'background':'#E2EAFF','height':'88px','color':'#4E5969','font-size':'14px'}" :fit="false" @sort-change="sortChange" @selection-change="selectionChange" v-loading="loading" border>
			<el-table-column fixed align="center" type="selection" width="48" v-if="selection">
			</el-table-column>
			<el-table-column fixed label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column :label="item.label" :prop="item.prop" :width="flexColumnWidth(item.prop,item.label,tableData,item.sort,item.type)" :sortable="item.sort?item.sort:false" align="center" v-for="item in titleList">
				<template slot-scope="scope">
					<!-- 普通图片 -->
					<el-image class="relative" style="top: 3px;" :z-index="2006" :src="domain + scope.row[item.prop]" fit="scale-down" @click="viewImage('only',scope.row[item.prop],scope.row)" v-if="item.type == 1"></el-image>
					<!-- 轮播图片 -->
					<div class="table_carousel relative" v-else-if="item.type == 2">
						<el-carousel class="el_carousel" :ref="`${tableName}_${item.prop}_${scope.$index}`" arrow="never" indicator-position="none" :autoplay="false" height="110px">
							<el-carousel-item v-for="(img_url,index) in scope.row[item.prop]" :key="index">
								<el-image :z-index="2006" :src="domain + img_url" @click="viewImage('arr',scope.row[item.prop],scope.row,index)" fit="scale-down"></el-image>
							</el-carousel-item>
						</el-carousel>
						<div class="carousel_arrow_row flex ac jsb">
							<img class="carousel_arrow pointer" src="@/static/carousel_left_arrow.png" @click="checkCarousel(`${tableName}_${item.prop}_${scope.$index}`,'prev','arr')">
							<img class="carousel_arrow pointer" src="@/static/carousel_right_arrow.png" @click="checkCarousel(`${tableName}_${item.prop}_${scope.$index}`,'next','arr')">
						</div>
					</div>
					<!-- 预览按钮 -->
					<span class="text_style" v-else-if="item.type == 3" @click="openWindow(scope.row[item.prop])">预览</span>
					<!-- 按钮 -->
					<span class="text_style" v-else-if="item.type == 4" @click="$emit('buttonCallback',scope.row)">{{scope.row[item.prop]}}</span>
					<!-- 开关 -->
					<el-switch v-else-if="item.type == 5" :active-value="1" :inactive-value="0" v-model="scope.row[item.prop]" active-color="#3F8CFF" inactive-color="#ff4949" @change="changeStatus">
				</el-switch>
				<!-- 普通文字 -->
				<div class="table_cell table_color f14 fw500" v-else>{{scope.row[item.prop]}}</div>
			</template>
		</el-table-column>
		<!-- 操作栏 -->
		<el-table-column label="操作" align="center" :width="settingColumnWidth" fixed="right" v-if="Setting">
			<template slot-scope="scope">
				<span class="text_style" @click="$emit('auditFn',scope.row.goods_id)" v-if="tableName == 'productAudit' && scope.row.admin_status == 1">审核</span>
				<span class="text_style" @click="$emit('addMember',scope.row)" v-if="tableName == 'supplierList' || tableName == 'brandAttribute'">添加成员</span>
				<span class="text_style" @click="$emit('editFn',scope.row)" v-if="tableName == 'supplierList' || tableName == 'brandAttribute'">编辑</span>
				<span class="text_style" @click="$emit('deleteFn',scope.row)" v-if="tableName == 'supplierList' || tableName == 'brandAttribute'">删除</span>
			</template>
		</el-table-column>
	</el-table>
	<!-- 图片预览 -->
	<PreviewImage ref="previewImagesDialog" :previewImages="preview_images" :dialogTitle="dialog_title" :initialIndex="initial_index"/>
</div>
</template>
<script>
	// 字段类型（type）：
	// 1、图片
	// 2、轮播图
	// 3、预览按钮
	// 4、按钮
	// 5、开关
	import PageButton from '@/components/pageButton'
	import PreviewImage from '@/components/previewImage'
	export default{
		data(){
			return{
				view_image_dialog:false,				//图片放大弹窗
				dialog_title:"",							//图片放大标题（品名）
				preview_images:[],					//预览的图片列表
				initial_index:0,						//当前下标
			}
		},
		props:{
			//是否展示多选
			selection:{
				type:Boolean,
			default:true
			},
			//表格数据
			tableData:{
				type:Array,
			default:() => []
			},
			//表头列表
			titleList:{
				type:Array,
			default:() => []
			},
			//表格高度
			tableHeight:{
				type:Number,
			default:0
			},
			//引用的表格名称
			tableName:{
				type:String,
			default:''
			},
			//是否展示操作栏
			Setting:{
				type:Boolean,
			default:true
			},
			//操作栏宽度
			settingColumnWidth:{
				type:String,
			default:'140'
			},
			//加载状态
			loading:{
				type:Boolean,
			default:false
			},
		},
		created(){
			if(this.tableName == 'productAudit'){	//商品资料审核初始化勾选
				this.$nextTick(() => {
					this.tableData.map(item => {
						this.$refs.customTable.toggleRowSelection(item,item.selected);
					})
				})
			}
		},
		computed:{
			//文件前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		methods:{
			//切换轮播图
			checkCarousel(ref_name,type,check_type){
				if(type == 'prev'){
					if(check_type == 'arr'){
						this.$refs[ref_name][this.tableData.length > 1?0:2].prev();
					}else{
						this.$refs[ref_name].prev();
					}
				}else{
					if(check_type == 'arr'){
						this.$refs[ref_name][this.tableData.length > 1?0:2].next();
					}else{
						this.$refs[ref_name].next();
					}
				}
			},
			//点击图片预览
			viewImage(type,preview_src,row,initial_index){
				this.dialog_title = this.tableName == 'brandAttribute'?row.brand_name:row.goods_name;
				if(type == 'arr'){
					this.initial_index = initial_index;
					this.preview_images = preview_src;
				}else{
					this.initial_index = 0;
					this.preview_images = [preview_src];
				}
				this.$refs.previewImagesDialog.show_dialog = true;
			},
			//监听排序
			sortChange({ column, prop, order }){
				let sort = "";
				if(order){
					sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					sort = "";
				}   
				this.$emit('sortChange',sort);
			},
			//监听多选
			selectionChange(v){
				this.$emit('selectionChange',v);
			},
			// 自适应表格列宽
			flexColumnWidth(prop,label, tableData,sort,type) {
				prop = prop + ''
				let columnContent = ''
				if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
					return
				}

				if (!prop || !prop.length || prop.length === 0 || prop === undefined) {
					return
				}

				// 获取该列中最长的数据(内容)
				let index = 0
				for (let i = 0; i < tableData.length; i++) {
					if (tableData[i][prop] === null) {
						tableData[i][prop] = '';
					}
					const now_temp = tableData[i][prop] + ''
					const max_temp = tableData[index][prop] + ''
					if (now_temp.length > max_temp.length) {
						index = i
					}
				}
				
				if(tableData[index][prop]){
					columnContent = tableData[index][prop].length > label.length?tableData[index][prop]:label;
				}else{
					columnContent = label;
				}
				
			    // 以下分配的单位长度可根据实际需求进行调整
				let flexWidth = 0
				var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
				for (const char of columnContent) {
					if (char >= 'A' && char <= 'Z') { //大写英文
						flexWidth += 8
					}else if (char >= 'a' && char <= 'z') { //小写英文
						flexWidth += 8
					} else if (char >= '\u4e00' && char <= '\u9fa5') {	//中文
						flexWidth += 14
					}else if (regPos.test(char)) {	//数字
						flexWidth += 8.5
					} else {	// 其他
						flexWidth += 12
					}
				}
				if (flexWidth >= 275) {
        			// 设置最小宽度
					flexWidth = 275
				}
				if (flexWidth >= 95 && flexWidth < 275) {
        			// 设置最小宽度
					flexWidth = flexWidth + 32
				}
				if (flexWidth < 95) {
        			// 设置最小宽度
					flexWidth = flexWidth + 32
				}
				//处理排序
				if(tableData[index][prop] && (tableData[index][prop].length <= label.length && sort)){
					flexWidth += 14
				}
				//处理图片展示
				if(type == 1){
					flexWidth = 148
				}
				//处理走马灯展示
				if(type == 2){
					flexWidth = 176
				}
				//预览按钮展示
				if(type == 3){
					flexWidth = 96
				}
				return flexWidth + 'px'
			},
			//切换开关
			changeStatus(v){
				this.$emit('changeStatus',v)
			},
			//打开新窗口
			openWindow(url){
				window.open(this.domain + url)
			}

		},
		components:{
			PageButton,
			PreviewImage
		}
	}
</script>
<style type="text/css">
	.table_cell{
		white-space:normal;
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
	}
	.custom_table{
		position: absolute;
		width: 100%;
	}
	.custom_table .el-image{
		width: 115px;
		height: 110px;
	}
	.custom_table .el-image img{
		display: block;
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
	.table_carousel{
		width: 100%;
		height:110px;
		.el_carousel{
			position: absolute;
			top:50%;
			left:50%;
			width:110px;
			height:110px;
			transform:translate(-50%,-50%);
			z-index:1;
			.carousel_item{
				width: 110px;
				height: 110px;
				.carousel_image{
					width: 110px;
					height: 110px;
				}
			}
		}
		.carousel_arrow_row{
			position: absolute;
			top:50%;
			left:50%;
			width: 100%;
			transform:translate(-50%,-50%);
			z-index:0;
			.carousel_arrow{
				width: 14px;
				height: 14px;
			}
		}
	}
</style>
