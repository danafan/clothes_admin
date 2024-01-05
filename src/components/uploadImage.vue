<template>
	<div class="image_list">
		<div class="image_card" @mouseenter="hover_index = index" @mouseleave="hover_index = -1" v-for="(item,index) in imagesData" :key="index">
			<el-image class="container image" :z-index="999999" :src="domain + item" :preview-src-list="previewImages" fit="scale-down"></el-image>
			<div class="container delete_card flex ac jc" v-if="hover_index == index && !onlyView">
				<img class="delete_image pointer" src="@/static/delete_image.png" @click="deleteFile(item,index)">
			</div>
		</div>
		<div class="upload_box flex fc ac jc" v-if="imagesData.length < maxNum && !onlyView">
			<img class="upload_image" src="@/static/upload_image.png">
			<div class="default_color f14 fw400">{{text}}</div>
			<input type="file" ref="imgUpload" class="upload_file" accept="image/*" :multiple="maxNum > 1" @change="uploadFn">
		</div>
		<div class="default_color f14 fw400" v-if="onlyView && imagesData.length == 0">未上传</div>
	</div>
</template>
<style lang="less" scoped>
	.image_list {
		min-width: 186px;
		display: flex;
		flex-wrap: wrap;
		.image_card {
			margin-bottom: 8px;
			position: relative;
			width: 124px;
			height: 124px;
			border-radius: 12px;
			.image{
				border-radius: 12px;
			}
			.delete_card {
				border-radius: 12px;
				background: rgba(0, 0, 0, 0.5);
				z-index:9;
				.delete_image{
					width: 27px;
					height: 27px;
				}
			}
		}
		.upload_box{
			position: relative;
			width: 124px;
			height: 124px;
			background: #F7F8FA;
			border-radius: 12px;
			.upload_image{
				margin-bottom: 8px;
				width: 26px;
				height: 26px;
			}
			.upload_file {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
			}
		}
	}
</style>
<script>
	import resource from '@/api/resource.js'
	export default{
		data(){
			return{
				imagesData:[],								//所有图片列表
				previewImages:[],							//预览的图片列表
				hover_index:-1,
			}
		},
		props:{
			//图片字段
			imgStr:{
				type:String,
			default:''
			},
			//最多上传的数量
			maxNum:{
				type:Number,
			default:1
			},
			//是否只读
			onlyView:{
				type:Boolean,
			default:false
			},
			//提示文字
			text:{
				type:String,
			default:''
			},
			//删除是否执行接口
			request:{
				type:Boolean,
			default:true
			},
		},
		watch:{
			imgStr:function(n,o){
				this.imagesData = this.imgStr?this.imgStr.split(','):[];
				this.imagesData.map(item => {
					this.previewImages.push(this.domain + item)
				}) 
				
			}
		},
		created(){
			this.imagesData = this.imgStr?this.imgStr.split(','):[];
			this.imagesData.map(item => {
				this.previewImages.push(this.domain + item)
			})  
		},
		computed:{
			//文件前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		methods:{
			// 上传图片
			uploadFn(){
				if (this.$refs.imgUpload.files.length > 0) {
					let files = this.$refs.imgUpload.files;
					//判断是否多选
					if(this.maxNum > 1){
						if(this.imagesData.length + this.$refs.imgUpload.files.length > this.maxNum){
							this.$refs.imgUpload.value = null;
							this.$message.warning(`图片最多不超过${this.maxNum}张`);
							return;
						}
					}
					for(var i = 0;i < files.length;i ++){
						let arg = {
							file:files[i]
						}
						resource.uploadFile(arg).then(res => {
							this.$refs.imgUpload.value = null;
							if(res.data.code == 1){
								let file = res.data.data;
								this.imagesData.push(file.urls);
								this.previewImages.push(this.domain + file.urls)
								//向父组件传递已选的图片列表
								this.$emit('callback',this.imagesData);
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			},
    		//删除文件
			deleteFile(url,index) {
				if(this.request){
					resource.deleteFile({url: url}).then((res) => {
						if (res.data.code == 1) {
							this.imagesData.splice(index,1);
							this.previewImages.splice(index,1);
							//向父组件传递已选的图片列表
							this.$emit('callback',this.imagesData);
						} else {
							this.$message.warning(res.data.msg);
						}
					});
				}else{
					this.imagesData.splice(index,1);
					this.previewImages.splice(index,1);
					//向父组件传递已选的图片列表
					this.$emit('callback',this.imagesData);
				}
			}
		}
	}
</script>