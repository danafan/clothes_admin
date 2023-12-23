<template>
	<div class="screen_container flex ac jc ml16 pointer" @click="$emit('checkStatus')">
		<div class="f14 mr8 space-nowrap">{{unfold?'收起':'展开'}}筛选</div>
		<img class="up_down_icon" :class="{'arrow_icon_up':!unfold}" src="@/static/up_down_icon.png">
	</div>
</template>
<script>
	export default{
		props:{
			//展开状态（1:展开；-1:收起）
			unfold:{
				type:Boolean,
			default:true
			}
		}
	}
</script>
<style lang="less" scoped>
	.screen_container{
		width: 102px;
		height: 32px;
		border-radius: 4px;
		border: 1px solid #858B9E;
		color: #858B9E;
		.up_down_icon{
			transform-origin: 50% 50%;
			transition: all 0.3s;
			width: 14px;
			height: 14px;
		}
		.arrow_icon_up{
			transform: rotate(180deg);
		}
	}
</style>