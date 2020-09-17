<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-edit" @click="showUser">添加角色</el-button>
          <AddDialog  @addUser="getRightsList" :Visible="Visible" @changeVisible="changeVisible($event)"></AddDialog>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['rowbottom', i1 === 0 ? 'rowtop' : '','vcenter']">
            <el-col :span="5">
              <el-tag closable @close="removeRoleTagById(scope.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'rowtop','vcenter']">
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRoleTagById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" closable @close="removeRoleTagById(scope.row, item3.id)" v-for="(item3, i3) in item2.children" :key="item3.id" :class="[i3 === 0 ? '' : 'rowtop']">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          </template>
        </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
       <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
          <!-- <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false"> -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showDialog(scope.row)">分配权限</el-button>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>
      </el-table>
      <EidtDialog :editVisible="editVisible" :editUserForm="editUserForm" @editUser="getRightsList" @editVisible="updataVisible($event)"></EidtDialog>
      <el-dialog
        title="分配权限"
        :visible.sync="rolesVisible"
        width="50%"
        @close="closedDialog">
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="treeRef"
          :default-checked-keys="delkeys"
          :props="treeProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="alloRights">确 定</el-button>
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
      rolesList: [],
      rightsList: [],
      Visible: false,
      editVisible: false,
      rolesVisible: false,
      editUserForm: {},
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      delkeys: [],
      roleId: '',
      res: '',
      tip: '',
      val: '',
      idstr: '',
      data: ''
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      this.res = await this.$Http.get('roles')
      console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      }
      this.rolesList = this.res.data.data
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
      this.res = await this.$Http.get('roles/' + id)
      // console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('更新角色信息失败！')
      }
      this.editUserForm = this.res.data.data
      this.editVisible = true
    },
    // 删除角色
    async removeRoleById (id) {
      this.tip = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(this.tip)
      if (this.tip !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        this.data = await this.$Http.delete('roles/' + id)
        if (this.data.data.meta.status !== 200) {
          this.$message.error('删除角色失败!')
        }
        this.$message.success('删除角色成功')
        this.getRightsList()
      }
    },
    // 删除角色中权限
    async removeRoleTagById (roles, id) {
      this.tip = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(this.tip)
      if (this.tip !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        this.val = await this.$Http.delete(`roles/${roles.id}/rights/${id}`)
        // if (this.val.data.meta.status !== 200) {
        //   this.$message.error('删除失败!')
        // }
        // this.$message.success('删除成功')
        // this.getRightsList()
        roles.children = this.val.data.data
      }
    },
    async showDialog (roles) {
      this.res = await this.$Http.get('rights/tree')
      // console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      }
      this.rightsList = this.res.data.data
      // 递归获取三级节点
      this.getLeaKeys(roles, this.delkeys)
      this.roleId = roles.id
      this.rolesVisible = true
    },
    // 显示默认权限
    getLeaKeys (node, arr) {
      // 如果没有children属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeaKeys(item, arr)
      })
    },
    // 监听分配权限关闭事件
    closedDialog () {
      this.delkeys = []
    },
    async alloRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      this.idstr = keys.join(',')
      this.val = await this.$Http.post(`roles/${this.roleId}/rights`, { rids: this.idstr })
      if (this.val.data.meta.status !== 200) {
        this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功')
      this.getRightsList()
      this.rolesVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.rowtop {
  border-top: 1px solid #e0e0e0;
}
.rowbottom {
  border-bottom: 1px solid #e0e0e0;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
