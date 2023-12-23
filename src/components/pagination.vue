<template>
	<div class="flex jse">
		<el-pagination
		@current-change="handleCurrentChange"
		:current-page="page"
		:page-size="pagesize"
		layout="prev, pager, next, jumper"
		:total="total">
	</el-pagination>
</div>
</template>
<script>
	export default{
		props:{
			//页码
			page:{
				type:Number,
			default:1
			},
			//每页条数
			pagesize:{
				type:Number,
			default:10
			},
			//总数
			total:{
				type:Number,
			default:0
			},
		},
		mounted() {
			document.getElementsByClassName("el-pagination__jump")[0].childNodes[0].nodeValue = "跳至";
		},
		methods:{
			//切换页码
			handleCurrentChange(page){
				this.$emit('changePage',page)
			}
		}
	}
</script>
<style lang="less" scoped>
	
</style>