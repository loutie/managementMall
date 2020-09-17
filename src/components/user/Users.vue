<template>
  <div>
   <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <!-- 搜索和添加 -->
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getUserList()">
           <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="showUser">添加用户</el-button>
        <AddDialog  @addUser="getUserList" :Visible="Visible" @changeVisible="changeVisible($event)"></AddDialog>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="userList" stripe border>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <EidtDialog :editVisible="editVisible" :editUserForm="editUserForm" @editUser="getUserList" @editVisible="updataVisible($event)"></EidtDialog>
    <el-dialog
      title="分配角色"
      :visible.sync="rolesVisible"
      width="50%"
      @close="closedDialog">
      <div>
        <p>
          <span>当前用户：</span>
          {{ userInfo.username }}
        </p>
        <p>
          <span>当前的角色：</span>
          {{ userInfo.role_name }}
        </p>
        <p>
          <span>分配新角色：</span>
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRights">确 定</el-button>
      </span>
      </el-dialog>
  </el-card>
  </div>
</template>

<script>
import AddDialog from './Dialog/AddDialog'
import EidtDialog from './Dialog/updataDialog'
export default {
  components: {
    AddDialog,
    EidtDialog
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      res: '',
      userList: [],
      total: 0,
      data: '',
      tip: '',
      Visible: false,
      editVisible: false,
      rolesVisible: false,
      editUserForm: {},
      userInfo: [],
      roleList: [],
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      this.res = await this.$Http.get('users', {
        params: this.queryInfo
      })
      if (this.res.data.meta.status !== 200) {
        return this.$message.error('获取用户列表信息失败')
      }
      this.userList = this.res.data.data.users
      this.total = this.res.data.data.total
      // console.log(this.userList)
    },
    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页面值
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    showUser () {
      this.Visible = true
      // console.log(this.Visible)
    },
    changeVisible (res) {
      // console.log(res)
      this.Visible = res
    },
    updataVisible (res) {
      // console.log(res)
      this.editVisible = res
    },
    async editDialog (id) {
      this.res = await this.$Http.get('users/' + id)
      console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('更新用户信息失败！')
      }
      this.editUserForm = this.res.data.data
      this.editVisible = true
    },
    // 改变操作状态
    async stateChange (res) {
      this.data = await this.$Http.put(`users/${res.id}/state/${res.mg_state}`)
      // console.log(this.data)
      if (this.data.data.meta.status !== 200) {
        res.mg_state = !res.mg_state
        this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功')
    },
    async removeUserById (id) {
      this.tip = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(this.tip)
      if (this.tip !== 'confirm') {
        this.$message.info('已取消删除')
      }
      this.data = await this.$Http.delete('users/' + id)
      if (this.data.data.meta.status !== 200) {
        this.$message.error('删除用户失败!')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 分配角色
    async setRole (val) {
      this.userInfo = val
      this.data = await this.$Http.get('roles')
      if (this.data.data.meta.status !== 200) {
        this.$message.error('获取角色列表失败!')
      }
      this.roleList = this.data.data.data
      console.log(this.roleList)
      this.rolesVisible = true
    },
    closedDialog () {
      this.selectRoleId = ''
      this.userInfo = {}
    },
    async saveRights () {
      if (!this.selectRoleId) {
        return this.$message.error('请选择分配的角色')
      }
      this.data = await this.$Http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      })
      if (this.data.data.meta.status !== 200) {
        this.$message.error('更新角色失败!')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.rolesVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
