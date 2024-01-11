<template>
	<div class="upload_file_container relative">
		<div class="upload_file flex ac" :class="{'z9':fileName != ''}">
			<img class="file_icon" src="@/static/file_icon.png">
			<el-tooltip class="item" effect="dark" :content="fileName" placement="top">
				<div class="flex-1 f14 fw400 pointer" :class="[{'upload_text':!fileName},{'value_color':fileName}]" @click="viewFile">{{fileName?fileName:!onlyView?'选择上传文件':'未上传'}}</div>
			</el-tooltip>
			<img class="delete_file pointer" src="@/static/delete_file.png" @click="deleteFile" v-if="fileName && !onlyView">
		</div>
		<input type="file" ref="uploadFile" class="upload_file_input" :class="{'z9':fileName == ''}" :accept="accept" @change="uploadFile" v-if="!onlyView">
		<div class="toast default_color f12 fw400">{{toast}}</div>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'
	export default{
		data(){
			return{
				upload_loading:false,					//上传中
				accept:'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			}
		},
		props:{
			// 文件名称
			fileName:{
				type:String,
			default:''
			},
			//是否只读
			onlyView:{
				type:Boolean,
			default:false
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
			//上传文件类型
			fileType:{
				type:String,
			default:'all'
			}
		},
		watch:{
			//监听文件类型变化
			fileType:function(n,o){
				switch(n){
				case 'pdf':
					this.accept = 'application/pdf';
					break;
				case 'excel':
					this.accept = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
					break;
				case 'all':
					this.accept = 'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
					break;
				default:
					return;
				}
			}
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
					let type = this.fileType == 'excel'?2:3;
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
			},
			//文件预览
			viewFile(){
				if(this.onlyView && this.fileName != ''){
					window.open(this.domain + this.fileName)
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.upload_file_container{
		width: 186px;
		height: 32px;
		background: #F7F8FA;
		border-radius: 8px;
	}
	.upload_file{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding-left: 16px;
		padding-right: 8px;
		.file_icon{
			margin-right: 12px;
			width: 17.6px;
			height: 13.6px;
		}
		.upload_text{
			color: #C1C4CB;
		}
		.value_color{
			color: #606266;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
		}
		.delete_file{
			width: 14.4px;
			height: 14.4px;
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