<template>
	<div>
		<SettingButton :img="require('@/static/create_icon.png')" text="自定义列表" @callback="getData"/>
		<custom-dialog dialogTitle="自定义列表" ref="columnDialog" dialogWidth="520px" :showDefault="true" @setDefault="setDefault" @close="setDefault('close')" @callback="confirmFn">
			<div>
				<el-checkbox-group v-model="selected_ids">
					<el-checkbox style="width:100px;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
				</el-checkbox-group>
			</div>
		</custom-dialog>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'

	import SettingButton from '@/components/settingButton'
	import CustomDialog from '@/components/customDialog'
	export default{
		data(){
			return{
				view_row:[],						//列表的所有列
				selected_ids:[],					//当前选中的所有列
				data_selected_ids:[],				//当前选中的所有列（备用）
			}
		},
		props:{
			//所有列
			viewRow:{
				type:Array,
			default:()=>[]
			},
			//当前选中的id列表
			selectedIds:{
				type:Array,
			default:()=>[]
			},
			//菜单ID
			menuId:{
				type:String,
			default:''
			}
		},
		methods:{
			//点击自定义列
			getData(){
				this.$refs.columnDialog.show_dialog = true;
				this.view_row = this.viewRow;
				this.selected_ids = this.selectedIds;
				this.data_selected_ids = this.selectedIds;
			},
			//恢复默认
			setDefault(type){
				if(type == 'close'){		//取消
					this.selected_ids = this.data_selected_ids;
				}else{						//重置
					this.selected_ids = this.view_row.map(item => {
						return item.row_id;
					})
				}
			},
			//保存
			confirmFn(){
				let arg = {
					menu_id:this.menuId,
					row_ids:this.selected_ids.join(',')
				}
				resource.setColumns(arg).then(res => {
					if (res.data.code == 1) {
						this.$refs.columnDialog.show_dialog = false;
						this.$emit('callback');
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			}
		},
		components:{
			SettingButton,
			CustomDialog
		}
	}
</script>
<style lang="less" scoped>
	
</style>