<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="http://bpic.588ku.com/element_origin_min_pic/17/02/04/1550050248cc95866f6cefa4f92576a3.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button @click="back" type="info">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <Aside @isCollapse="change($event)"></Aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
import Aside from '../components/Aside'

export default {
  name: 'home',
  props: {
    isCollapse: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  components: {
    Aside
  },
  data () {
    return {
    }
  },
  methods: {
    back () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    change (val) {
      this.isCollapse = val
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > img {
      width: 50px;
      height: 50px;
    }
    > span {
      margin: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #edeaf1;
}
</style>
