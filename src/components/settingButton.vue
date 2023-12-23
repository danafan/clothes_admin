<template>
	<div>
		<div class="upload_box" v-if="isImport">
			<div class="button_container flex ac pointer">
				<img class="button_img" :src="img">
				<div class="f14 space-nowrap">{{text}}</div>
			</div>
			<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadFile">
		</div>
		<div class="button_container flex ac pointer" :class="[{'ml16':margin == 'left'},{'mr16':margin == 'right'}]" @click="$emit('callback')" v-else>
			<img class="button_img" :src="img">
			<div class="f14 space-nowrap">{{text}}</div>
		</div>
	</div>
</template>
<script>
	export default{
		props:{
			img:{
				type:String,
			default:''
			},
			text:{
				type:String,
			default:''
			},
			//外边距类型
			margin:{
				type:String,
			default:'left'
			},
			//是否是导入
			isImport:{
				type:Boolean,
			default:false
			},
		},
		methods:{
			//导入
			uploadFile(){
				if (this.$refs.csvUpload.files.length > 0) {
					let file = this.$refs.csvUpload.files[0];
					this.$emit('callback',file);
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.upload_box{
		position: relative;
		.upload_file{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
	.button_container{
		border: 1px solid #609DFF;
		border-radius: 4px;
		height: 32px;
		padding: 0 16px;
		color:#609DFF;
		.button_img{
			margin-right: 4px;
			width: 14px;
			height: 14px;
		}
	}
</style>