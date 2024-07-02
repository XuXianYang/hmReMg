<template>
  <el-row type="flex" justify="space-between" align="middle" class="body-tree">
    <el-col>{{ treeNode.name }}</el-col>
    <el-col :span="8">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }} </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 下拉菜单点击事件
    handleCommand(command) {
      if (command === 'add') {
        this.$emit('addDep', this.treeNode)
      } else if (command === 'del') {
        this.$confirm('确认要删除' + this.treeNode.name + '吗？').then(() => {
          console.log(this.treeNode)
          return delDepartment(this.treeNode.id)
        }).then(res => {
          this.$emit('delDep')
          this.$message.success('删除' + this.treeNode.name + '成功')
        })
      } else if (command === 'edit') {
        this.$emit('editDep', this.treeNode)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-dropdown-link {
  padding: 5px 10px;
  color: #333;
  font-size: 14px;
}
.body-tree {
  width: 100%;
  height: 50px;
}
</style>
