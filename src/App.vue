<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import resource from '@/api/resource.js'
  export default {
    computed:{
      //当前路由地址
      active_path(){
        return this.$store.state.active_path;
      },
    },
    created(){
      //获取用户信息
      resource.getUserInfo().then(res => {
        if (res.data.code == 1) {
          this.$store.commit('setUserInfo',res.data.data);
          this.$router.replace(this.active_path);
        }else{
          this.$message.warning(res.data.msg)
        }
      })
      
    }

  }
</script>