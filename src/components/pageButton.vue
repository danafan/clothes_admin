<template>
	<div class="button_style pointer" :class="[{'primary':type == 'primary'},{'plain':type == 'plain'},{'primary_disabled':type == 'primary_disabled'},{'plain_disabled':type == 'plain_disabled'},{'primary_big':type == 'primary_big'}]" @click="$emit('callback')">{{text}}</div>
</template>
<script>
	export default{
		props:{
			type:{
				type:String,
			default:'primary'
			},
			text:{
				type:String,
			default:'查询'
			}
		}
	}
</script>
<style lang="less" scoped>
	.button_style{
		width: 88px;
		text-align: center;
		height: 40px;
		line-height: 40px;
		border-radius: 8px;
		font-size: 14px;
	}
	.primary{
		background: #609DFF;
		color: #ffffff;
	}
	.primary_disabled{
		cursor:no-drop;
		background: #CCCCCC;
		color: #ffffff;
	}
	.primary_big{
		background: #609DFF;
		color: #ffffff;
		width: 160px;
		height: 40px;
	}
	.plain{
		border: 1px solid #609DFF;
		background: #EBF3FF;
		color: #609DFF;
	}
	.plain_disabled{
		cursor:no-drop;
		border: 1px solid #AEAEAE;
		background: #EEEEEE;
		color: #989898;
	}
</style>