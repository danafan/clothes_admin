<template>
	<div class="radio_container flex">
		<div class="radio_item relative flex ac pointer" :class="[{'left_radius':index == 0},{'right_radius':index == radioList.length - 1},{'border_left_none':index > 0 && index != activeIndex},{'border_right_none':index == activeIndex - 1},{'active_radio_item':index == activeIndex},{'active_left_boder':index > 0 && index == activeIndex}]" v-for="(item,index) in radioList" @click="$emit('checkRadio',index)">
			<img class="radio_icon" :src="item.icon_active" v-if="activeIndex == index">
			<img class="radio_icon" :src="item.icon" v-else>
			<div class="f14 fw400 space-nowrap">{{item.name}}</div>
			<div class="dot absolute top-0" v-if="item.unread"></div>
		</div>
	</div>
</template>
<script>
	export default{
		props:{
			activeIndex:{
				type:Number,
			default:0
			},
			//列表
			radioList:{
				type:Array,
			default:() => []
			}
		}
	}
</script>
<style lang="less" scoped>
	.radio_container{
		height: 32px;
	}
	.radio_item{
		border: 1px solid #999999;
		padding:0 16px;
		color:#999999;
		.radio_icon{
			margin-right: 8px;
			width: 17px;
			height: 17px;
		}
		.dot{
			background: #DB0000;
			border-radius: 4px;
			right: 0;
			width: 8px;
			height: 8px;
		}
	}
	.active_radio_item{
		border: 1px solid #609DFF;
		color: #609DFF;
	}
	.active_left_boder{
		border-left: 1px solid #609DFF;
	}
	.left_radius{
		border-radius: 4px 0 0 4px;
	}
	.right_radius{
		border-radius: 0 4px 4px 0;
	}
	.border_left_none{
		border-left:none;
	}
	.border_right_none{
		border-right:none;
	}
</style>