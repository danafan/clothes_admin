<template>
	<div>
		<el-dialog custom-class="dialog_style" width="468px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="show_dialog">
			<div class="flex ac jsb" slot="title">
				<div class="dialog_title">{{dialogTitle}}</div>
				<img class="close_dialog pointer" src="@/static/close_dialog.png" @click="show_dialog = false">
			</div>
			<div class="carousel_container relative" v-if="show_dialog">
				<el-carousel class="el_carousel" ref="previewRef" arrow="never" indicator-position="none" :autoplay="false" :initial-index="initialIndex" height="340px">
					<el-carousel-item class="carousel_item flex ac jc" v-for="(img_url,index) in previewImages" :key="index">
						<el-image class="carousel_image" :z-index="2006" :src="domain + img_url" fit="scale-down"></el-image>
					</el-carousel-item>
				</el-carousel>
				<div class="carousel_arrow_row flex ac jsb" v-if="previewImages.length > 1">
					<img class="carousel_arrow pointer" src="@/static/carousel_left_arrow.png" @click="checkCarousel('prev')">
					<img class="carousel_arrow pointer" src="@/static/carousel_right_arrow.png" @click="checkCarousel('next')">
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				show_dialog:false
			}
		},
		computed:{
			//文件前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		props:{
			//弹窗标题
			dialogTitle:{
				type:String,
			default:''
			},
			//预览的图片列表
			previewImages:{
				type:Array,
			default:() => []
			},
			//当前展示的图片下标
			initialIndex:{
				type:Number,
			default:0
			}
		},
		methods:{
			//切换轮播图
			checkCarousel(type){
				if(type == 'prev'){
					this.$refs.previewRef.prev();
				}else{
					this.$refs.previewRef.next();
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.carousel_container{
		height:340px;
		.el_carousel{
			position: absolute;
			top:50%;
			left:50%;
			width:340px;
			height:340px;
			transform:translate(-50%,-50%);
			.carousel_item{
				width: 340px;
				height: 340px;
				.carousel_image{
					width: 340px;
					height: 340px;
				}
			}
		}
		.carousel_arrow_row{
			position: absolute;
			top:50%;
			left:50%;
			width: 100%;
			transform:translate(-50%,-50%);
			.carousel_arrow{
				width: 24px;
				height: 24px;
			}
		}
	}
</style>