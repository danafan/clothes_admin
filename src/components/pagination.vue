<template>
	<div class="flex jse">
		<el-pagination
		@current-change="handleCurrentChange"
		:current-page="page"
		:page-size="pagesize"
		layout="slot,prev, pager, next, jumper"
		:total="total">
		<div class="total_text flex ac f14 fw400 mr12">共<div class="login_title">{{setPageCount()}}</div>页/<div class="login_title">{{total}}</div>条数据</div>
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
			//设置总页数
			setPageCount(){
				if(this.total == 0 || this.total/this.pagesize <= 1){
					return 1;
				}else{
					return Math.floor(this.total/this.pagesize) + 1;
				}
			},
			//切换页码
			handleCurrentChange(page){
				this.$emit('changePage',page)
			}
		}
	}
</script>
<style lang="less" scoped>
	.total_text{
		height: 32px;
		color: #606266;
	}
</style>