<template>
  <el-dialog
    title="新增员工"
    :visible="dialogVisible"
    width="500px"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      :rules="formRules"
      :model="formData"
      label-width="120px"
    >
      <!--prop需要和loginRules中的属性对应  -->
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 80%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 80%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 80%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in hireTypeArr"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 80%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 80%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="departs"
          :default-expand-all="true"
          :props="defaultProps"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 80%"
          placeholder="请选择转正时间"
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
          @click="addEmployeesFn"
        >确定</el-button>
      </el-col>
      <el-col :span="12">
        <el-button size="small" @click="closeDialog">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addEmployees } from '@/api/employees'
import employeesUntil from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      departs: [],
      showTree: false,
      hireTypeArr: employeesUntil.hireType,
      loading: false,
      defaultProps: {
        // children: "children",
        label: 'name'
      },
      formData: {
        username: '', // 姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      formRules: {
        username: [
          { required: true, trigger: 'blur', message: '姓名不能为空' },
          { min: 1, max: 5, message: '姓名长度为1到5位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          {
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur',
            message: '手机号格式不正确'
          }
        ],
        formOfEmployment: [
          { required: true, trigger: 'blur', message: '聘用形式不能为空' }
        ],
        workNumber: [
          { required: true, trigger: 'blur', message: '工号不能为空' }
        ],
        departmentName: [
          { required: true, trigger: 'change', message: '部门不能为空' }
        ],
        timeOfEntry: [
          { required: true, trigger: 'blur', message: '入职时间不能为空' }
        ],
        correctionTime: [
          { required: true, trigger: 'blur', message: '转正时间不能为空' }
        ]
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    addEmployeesFn() {
      this.$refs.form
        .validate()
        .then(() => {
          // 新增
          return addEmployees({ ...this.formData })
        })
        .then(() => {
          // 新增成功
          // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
          this.$parent.getUserList()
          this.$parent.showAddDialog = false
        })
        .catch(() => {
        })
    },

    // 取消
    closeDialog() {
      this.formData = {
        username: '', // 姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      this.showTree = false
      // 重置表单
      this.$refs.form.resetFields()
      // 关闭dialog
      this.$emit('update:dialogVisible', false)
    },
    // 获取全部部门信息
    async getDepartments() {
      this.loading = true
      this.showTree = true
      const res = await getDepartments()
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    }
  }
}
</script>

  <style>
</style>
