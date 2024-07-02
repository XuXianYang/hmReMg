<template>
  <div v-loading="loading" class="departments-container">
    <el-card class="box-card">
      <treeToolsVue
        :is-root="true"
        :tree-node="company"
        @addDep="addDep"
      />
      <el-tree
        :data="departs"
        :props="defaultProps"
        :default-expand-all="true"
        @node-click="handleNodeClick"
      >
        <treeToolsVue
          slot-scope="{ data }"
          :is-root="false"
          :tree-node="data"
          @delDep="getDepartments"
          @addDep="addDep"
          @editDep="editDep"
        />
      </el-tree>
    </el-card>
    <!-- 只要用sync修饰，就可以省略父组件的监听和方法，直接将值赋值给dialogVisible-->
    <addDeptVue
      ref="addDept"
      :dialog-visible.sync="showAddDialog"
      :tree-node="currentNode"
      @closeDialog="showAddDialog = false"
      @addSuccess="getDepartments"
    />
  </div>
</template>

<script>
import treeToolsVue from './tree-tools.vue'
import addDeptVue from './add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: {
    treeToolsVue,
    addDeptVue
  },
  data() {
    return {
      loading: false,
      company: {}, // 顶部公司节点信息
      departs: [], // 所有部门信息
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showAddDialog: false,
      currentNode: null// 当前操作的节点信息
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 节点点击事件
    handleNodeClick(data) {
    },
    // 获取全部部门信息
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      // 跟节点中没有id，id便是undefined，但是通过undefined进行等值判断是寻找不到对应的根节点的，
      // 所以在传值时，我们将id属性设置为空串""
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    // 新增部门
    addDep(node) {
      this.currentNode = node
      this.showAddDialog = true
    },
    // 编辑部门
    editDep(node) {
      this.currentNode = node
      this.showAddDialog = true
      // 通过refs调用子组件的方法
      this.$refs.addDept.getDepartmentDetail(node.id)
    }
  }
}
</script>

<style scoped lang="scss">
.departments-container {
  .box-card {
    margin: 30px 30px 0 30px;
    .el-dropdown-link {
      padding: 5px 10px;
    }
    .tagTitle {
      color: #333;
      font-size: 14px;
    }
    .body-tree {
      width: 100%;
      height: 50px;
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
}
</style>
