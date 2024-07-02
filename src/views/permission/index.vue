<template>
  <div v-loading="loading" class="permission-container">
    <PageTools>
      <el-row slot="after">
        <!-- addPermission第一个参数 是当前添加的节点的pid  第二个参数是添加的节点的类型 1 -->
        <!-- 1 代表访问权 2 代表操作权 -->
        <el-button
          size="small"
          type="primary"
          @click="addPermission('0', 1)"
        >新增权限</el-button>
      </el-row>
    </PageTools>
    <el-card class="pm-card">
      <!--  如果需要树状表格， 需要给el-table配置row-key属性id -->
      <el-table :data="permissionList" row-key="id" border style="width: 100%">
        <el-table-column align="center" label="名称" prop="name" sortable="" />
        <el-table-column align="center" label="标识" prop="code" sortable="" />
        <el-table-column
          align="center"
          label="描述"
          prop="description"
          sortable=""
        />
        <el-table-column
          align="center"
          label="操作"
          sortable=""
          fixed="right"
          width="200"
        >
          <template slot-scope="{ row }">
            <!-- 当type为1时为访问权限，type为2时为功能权限 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              size="small"
              @click="addPermission(row.id, 1)"
            >添加</el-button>
            <el-button
              type="text"
              size="small"
              @click="editPermission(row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="delPermission(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="showText"
      :visible="showDialog"
      width="550px"
      @close="closeDialog"
    >
      <el-form
        ref="form"
        :rules="formRules"
        :model="formData"
        label-width="120px"
      >
        <!--prop需要和loginRules中的属性对应  -->
        <el-form-item label="权限名称" prop="name">
          <el-input
            v-model="formData.name"
            style="width: 80%"
            placeholder="请输入权限名称"
          />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input
            v-model="formData.code"
            style="width: 80%"
            placeholder="请输入权限标识"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            style="width: 80%"
            placeholder="请输入描述信息"
          />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
      <el-row
        slot="footer"
        style="padding: 0 150px 0 50px"
        type="flex"
        justify="center"
      >
        <!-- 列被分为24 -->
        <el-col :span="12">
          <el-button
            type="primary"
            size="small"
            @click="addEditPermissionRq"
          >确定</el-button>
        </el-col>
        <el-col :span="12">
          <el-button size="small" @click="closeDialog">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  delPermissionById,
  updatePermissionById,
  addPermission
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      loading: false,
      permissionList: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      formRules: {
        name: [
          { required: true, trigger: 'blur', message: '权限名称不能为空' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '权限标识不能为空' }
        ]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取权限列表
    async getPermissionList() {
      this.loading = true
      const res = await getPermissionList()
      this.permissionList = tranListToTreeData(res, '0')
      this.loading = false
      console.log(this.permissionList)
    },
    // 关闭弹框
    closeDialog() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.form.resetFields()
      this.showDialog = false
    },
    // 添加权限
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    // 编辑权限
    editPermission(data) {
      this.formData = { ...data }
      this.showDialog = true
    },
    // 发起添加编辑权限请求
    addEditPermissionRq() {
      this.$refs.form.validate().then(() => {
        this.loading = true
        if (this.formData.id) {
          return updatePermissionById(this.formData)
        } else {
          return addPermission(this.formData)
        }
      })
        .then(() => {
          if (this.formData.id) {
            this.$message.success('更新权限成功')
          } else {
            this.$message.success('添加权限成功')
          }
          this.getPermissionList()
          this.showDialog = false
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 删除权限
    async delPermission(id) {
      this.$confirm('确认要删除该权限吗？')
        .then(() => {
          this.loading = true
          return delPermissionById(id)
        })
        .then(() => {
          this.loading = false
          this.$message.success('删除权限成功')
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss'>
.permission-container {
  .pm-card {
    margin: 0 10px 10px 10px;
  }
}
</style>
