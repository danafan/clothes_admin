<template>
	<div class="upload_file_container relative">
		<div class="upload_file flex ac" :class="{'z9':fileName != ''}">
			<div class="flex ac">
				<img class="file_icon" src="@/static/file_icon.png">
				<el-tooltip class="item" effect="dark" :content="fileName" placement="top">
					<div class="upload_text default_color f14 fw400">{{fileName?fileName:'选择上传文件'}}</div>
				</el-tooltip>
			</div>
			<img class="delete_file pointer" src="@/static/delete_file.png" @click="deleteFile" v-if="fileName">
		</div>
		<input type="file" ref="uploadFile" class="upload_file_input" :class="{'z9':fileName == ''}" 
		accept="application/vnd.ms-excel, 
		application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
		application/vnd.ms-powerpoint,
		application/vnd.openxmlformats-officedocument.presentationml.presentation,
		application/pdf
		" @change="uploadFile">
		<div class="toast default_color f12 fw400">{{toast}}</div>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'
	export default{
		data(){
			return{
				upload_loading:false,					//上传中
			}
		},
		props:{
			// 文件名称
			fileName:{
				type:String,
			default:''
			},
			//底部提示
			toast:{
				type:String,
			default:''
			},
			//删除是否调用接口
			request:{
				type:Boolean,
			default:true
			},
		},
		computed:{
			//文件前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		methods:{
			//上传文件
			uploadFile(){
				if (this.$refs.uploadFile.files.length > 0) {
					let files = this.$refs.uploadFile.files;
					let type = files[0].type == 'application/vnd.ms-excel' || files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'?2:3
					let arg = {
						file:files[0],
						type:type
					}
					resource.uploadFile(arg).then(res => {
						this.$refs.uploadFile.value = null;
						if(res.data.code == 1){
							let file = res.data.data;
							//向父组件传递已选的图片列表
							this.$emit('callback',file.urls);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//删除文件
			deleteFile() {
				if(this.request){
					resource.deleteFile({url: this.fileName}).then((res) => {
						if (res.data.code == 1) {
							//向父组件传递已选的图片列表
							this.$emit('callback','');
						} else {
							this.$message.warning(res.data.msg);
						}
					});
				}else{
					//向父组件传递已选的图片列表
					this.$emit('callback','');
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.upload_file_container{
		width: 280px;
		height: 48px;
		background: #F7F8FA;
		border-radius: 12px;
	}
	.upload_file{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding-left: 16px;
		padding-right: 16px;
		.file_icon{
			margin-right: 12px;
			width: 22px;
			height: 17px;
		}
		.upload_text{
			width: 190px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
		}
		.delete_file{
			width: 18px;
			height: 18px;
		}
	}
	.toast{
		position: absolute;
		left: 0;
		bottom: -18px;
		width: 100;
	}
	.upload_file_input{
		border:1px solid red;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	.z9{
		z-index:9;
	}
</style>