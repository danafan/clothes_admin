<template>
	<div class="goods_item_container">
		<div class="main_image_body mb16">
			<img class="container main_image pointer" :src="domain + goodsItem.main_img" @click="viewImage('only')">
			<el-checkbox class="select_style" @change="changeSelect" size="medium" v-model="goodsItem.selected"></el-checkbox>
		</div>
		<div class="pl16 pr16 pb16">
			<div class="flex ac jsb mb16">
				<div class="flex ac">
					<div class="label">系列：</div>
					<div class="value">保暖</div>
				</div>
				<div class="flex ac">
					<div class="label">品类：</div>
					<div class="value">卫衣</div>
				</div>
			</div>
			<div class="table_color f16 fw500 table_header_text">老国标90含量连帽长款羽绒服老国标90含量连帽长款羽绒服</div>
			<div class="line"></div>
			<div class="hidden_content" v-if="goodsItem.is_up">
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">款号：</div>
						<div class="value">123123</div>
					</div>
					<div class="flex ac">
						<div class="label">货号：</div>
						<div class="value">12313</div>
					</div>
				</div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">spu：</div>
						<div class="value">123123</div>
					</div>
					<div class="flex ac">
						<div class="label">sku：</div>
						<div class="value">12313</div>
					</div>
				</div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">色号：</div>
						<div class="value">01</div>
					</div>
					<div class="flex ac">
						<div class="label">颜色名称：</div>
						<div class="value">米白103</div>
					</div>
				</div>
				<div class="flex ac">
					<div class="label">商品单位：</div>
					<div class="value">件</div>
				</div>
				<div class="line"></div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">吊牌价：</div>
						<div class="value">¥15</div>
					</div>
					<div class="flex ac">
						<div class="label">日常价：</div>
						<div class="value">¥15</div>
					</div>
				</div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">活动价：</div>
						<div class="value">¥15</div>
					</div>
					<div class="flex ac">
						<div class="label">大促价：</div>
						<div class="value">¥15</div>
					</div>
				</div>
				<div class="flex ac jsb">
					<div class="flex ac">
						<div class="label">折扣：</div>
						<div class="value">15%</div>
					</div>
					<div class="flex ac">
						<div class="label">规格：</div>
						<div class="value">M-160</div>
					</div>
				</div>
				<div class="line"></div>
				<div class="flex ac mb16">
					<div class="label">材质：</div>
					<div class="value">97%聚酯纤维3%氨纶（配料除外）%</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">卖点：</div>
					<div class="value">印花立领立领 新国标90%绒羽绒服</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">使用人群：</div>
					<div class="value">青年</div>
				</div>
				<div class="flex ac">
					<div class="label">预计上架时间：</div>
					<div class="value">2023-10-23</div>
				</div>
				<div class="line"></div>
				<div class="flex ac">
					<div class="label">细节图：</div>
					<div class="flex-1 flex ac jsb">
						<img class="detail_arrow pointer" src="@/static/carousel_left_arrow.png" @click="checkCarousel('prev')">
						<el-carousel class="carousel_box" :autoplay="false" indicator-position="none" arrow="never" ref="detailCarousel" height="48px" @change="changeIndex">
							<el-carousel-item v-for="(img_arr,index) in goodsItem.preview_detail_imgs">
								<div class="flex ac jsb">
									<el-image class="carousel_item_img pointer" :src="domain + img_url" fit="scale-down" v-for="(img_url,i) in img_arr" @click="viewImage('arr',i)"></el-image>
									<div class="carousel_item_img" v-for="box in (img_arr.length==3?0:3-img_arr.length)"></div>
								</div>
							</el-carousel-item>
						</el-carousel>
						<img class="detail_arrow pointer" src="@/static/carousel_right_arrow.png" @click="checkCarousel('next')">
					</div>
				</div>
				<div class="line"></div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">规划色：</div>
						<div class="value">黑色 杏色</div>
					</div>
					<div class="flex ac">
						<div class="label">字体：</div>
						<div class="value">黑鲸品牌字体</div>
					</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">工艺：</div>
					<div class="value">烫画超轻</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">参考图案：</div>
					<div class="value">规划色-图案颜色黑色卫衣-银灰</div>
				</div>
				<div class="flex ac">
					<div class="label">备注：</div>
					<div class="value">规划色-图案颜色黑色卫衣</div>
				</div>
				<div class="line"></div>
			</div>
			<div class="flex ac mb16">
				<span class="text_style mr16" @click="openWindow(goodsItem.technology_url)">工艺资料包</span>
				<span class="text_style" @click="openWindow(goodsItem.linear_draft_url)">线性图稿</span>
			</div>
			<div class="flex jc" v-if="goodsItem.brand_status == 1 && goodsItem.brand_ksbm == ''">
				<div class="button_style scpph">上传品牌款号</div>
			</div>
			<div class="flex jc" v-if="goodsItem.brand_status == 0">
				<div class="button_style sh">审核</div>
			</div>
			<div class="line"></div>
			<div class="flex fc ac">
				<div class="flex fc ac pointer" @click="$emit('checkStatus')">
					<div class="text_style mb8">{{!goodsItem.is_up?'展开':'收起'}}</div>
					<img class="status_icon" src="@/static/goods_item_up.png" v-if="goodsItem.is_up">
					<img class="status_icon" src="@/static/goods_item_down.png" v-else>
				</div>
			</div>
		</div>
		<!-- 图片预览 -->
		<PreviewImage ref="previewImagesDialog" :previewImages="preview_images" :dialogTitle="dialog_title" :initialIndex="initial_index"/>
	</div>
</template>
<script>
	import PreviewImage from '@/components/previewImage'
	export default{
		data(){
			return{
				current_index:0,			//细节图当前下标
				initial_index:0,			//预览图下标
				dialog_title:"",			//预览弹窗的品名
				preview_images:[],			//预览图片列表
			}
		},
		props:{
			//单个商品
			goodsItem:{
				type:Object,
			default:{}
			},
			//当前商品下标
			currentIndex:{
				type:Number,
			default:0
			}
		},
		computed:{
			//文件前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		methods:{
			//切换勾选
			changeSelect(v){
				let arg = {
					index:this.currentIndex,
					bool:v
				}
				this.$emit('changeSelect',arg)
			},
			//点击图片预览
			viewImage(type,index){
				this.dialog_title = this.goodsItem.goods_name;
				if(type == 'arr'){
					this.initial_index = this.current_index*3 + index;
					this.preview_images = this.goodsItem.detail_imgs;
				}else{
					this.initial_index = 0;
					this.preview_images = [this.goodsItem.main_img];
				}
				this.$refs.previewImagesDialog.show_dialog = true;
			},
			//切换轮播图
			checkCarousel(type){
				if(type == 'prev'){
					this.$refs.detailCarousel.prev();
				}else{
					this.$refs.detailCarousel.next();
				}
			},
			//设置当前选中的下标
			changeIndex(current_index){
				this.current_index = current_index;
			},
			//打开线性图稿/工艺资料包
			openWindow(url){
				window.open(this.domain + url)
			}
		},
		components:{
			PreviewImage
		}
	}
</script>
<style lang="less" scoped>
	.goods_item_container{
		margin-bottom: 16px;
		margin-right: 16px;
		border: 1px solid #E6EDFF;
		width: 288px;
		border-radius: 16px;
		.main_image_body{
			border-radius: 16px 16px 0 0;
			position: relative;
			width: 288px;
			height: 288px;
			.main_image{
				border-radius: 16px 16px 0 0;
			}
			.select_style{
				position: absolute;
				top: 4px;
				left: 8px;
			}
		}
		.label{
			color: #858B9E;
			font-size: 14px;
			font-weight: 400;
			white-space: nowrap;
		}
		.value{
			color: #4E5969;
			font-size: 14px;
			font-weight: 400;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
		}
		.line{
			margin-top: 16px;
			margin-bottom: 16px;
			width: 100%;
			height: 1px;
			background: #E6EDFF;
		}
		.text_style{
			cursor: pointer;
			font-size: 14px;
			font-weight: 400;
			color: #3F8CFF;
		}
		.button_style{
			text-align: center;
			height: 28px;
			line-height: 28px;
			background: #609DFF;
			border-radius: 8px;
			font-size: 14px;
			color: #ffffff;
			font-weight: 400;
		}
		.scpph{
			width: 116px;
		}
		.sh{
			width: 64px;
		}
		.status_icon{
			width: 13px;
			height: 11px;
		}
		.detail_arrow{
			width: 14px;
			height: 14px;
		}
		.carousel_box{
			width: 160px;
			height: 48px;
		}
		.carousel_item_img{
			width: 48px;
			height: 48px;
		}
	}
</style>