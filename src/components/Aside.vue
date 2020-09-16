<template>
  <el-menu class="el-menu-vertical-demo" text-color=' #fff' active-text-color="#409eff" background-color=#333744 unique-opened router :collapse="isCollapse" :collapse-transition="false" :default-active="activePath">
    <div class="toggle" @click="toggleClick">|||</div>
    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <i :class="iconList[item.id]"></i>
        <span slot="title">{{ item.authName }}</span>
      </template>
      <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="changePath('/' + subItem.path)">
        <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ subItem.authName }}</span>
      </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Aside',
  data () {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenuList () {
      var res = await this.$Http.get('menus')
      console.log(res)
      if (res.data.meta.status !== 200) {
        return this.$message.error(res.data.meta.msg)
      }
      this.menuList = res.data.data
      console.log(this.menuList)
    },
    toggleClick () {
      this.isCollapse = !this.isCollapse
      this.$emit('isCollapse', this.isCollapse)
    },
    changePath (active) {
      window.sessionStorage.setItem('activePath', active)
      this.activePath = active
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo {
  width: 100%;
  height: 100%;
}
.toggle {
  background-color: #444;
  text-align: center;
  color: #fff;
  cursor: pointer;
  line-height: 24px;
  letter-spacing: .2em;
}
.el-submenu__title {
  justify-content: space-between;
  align-items: center;
  display: flex;
}
.iconfont {
  margin-right: 10px;
}
</style>
