<template>
  <el-dialog
    v-loading="loading"
    :title="titleStr"
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
      <el-form-item label="部门名称" prop="name">
        <el-input
          ref="name"
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          ref="code"
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          ref="manager"
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          ref="introduce"
          v-model="formData.introduce"
          style="width: 80%"
          type="textarea"
          rows="3"
          placeholder="1-300个字符"
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
          @click="addDepFn"
        >确定</el-button>
      </el-col>
      <el-col :span="12">
        <el-button size="small" @click="closeDialog">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartment,
  getDepartmentDetail,
  editDepartment
} from '@/api/departments'
import { getUserSimple } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 部门名称自定义校验规则
    const validateName = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      // 编辑
      if (this.formData.id) {
        // 先筛选出自身，然后根据相同的pid筛选出同级部门,判断同级部门是否有相同的部门名称
        isRepeat = depts
          .filter((item) => item.id !== this.formData.id && item.pid === this.formData.pid)
          .some((item) => item.name === value)
      } else { // 新增
        // 根据pid等于父级部门的id筛选出同级部门，判断同级部门是否有相同的部门名称
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }

      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    // 部门编码自定义校验规则
    const validateCode = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      // 编辑
      if (this.formData.id) {
        // 先筛选出自身，判断所有部门是否有相同的部门编码，&& value防止部门编码为空的情况
        isRepeat = depts.some((item) => item.id !== this.formData.id && item.code === value && value)
      } else { // 新增
        // 判断所有部门是否有相同的部门编码，&& value防止部门编码为空的情况
        isRepeat = depts.some((item) => item.code === value && value)
      }
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }
    return {
      loading: false,
      // 员工列表
      peoples: [],
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      formRules: {
        name: [
          { required: true, trigger: 'blur', message: '部门名称不能为空' },
          {
            min: 1,
            max: 50,
            message: '部门名称长度为1到50位',
            trigger: 'blur'
          },
          // 自定义校验规则
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '部门编码不能为空' },
          {
            min: 1,
            max: 50,
            message: '部门名称长度为1到50位',
            trigger: 'blur'
          },
          // 自定义校验规则
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, trigger: 'blur', message: '部门负责人不能为空' }
        ],
        introduce: [
          { required: true, trigger: 'blur', message: '部门介绍不能为空' },
          {
            min: 1,
            max: 300,
            message: '部门名称长度为1到300位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    titleStr() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  created() {
    this.getUserSimple()
  },
  methods: {
    addDepFn() {
      this.$refs.form
        .validate()
        .then(() => {
          this.loading = true
          // 新增部门
          if (this.formData.id) {
            return editDepartment({ ...this.formData })
          } else { // 编辑部门
            return addDepartment({ ...this.formData, pid: this.treeNode.id })
          }
        })
        .then(() => {
          // 新增或编辑成功
          this.$emit('addSuccess')
          // 子组件 update:固定写法 (update:props名称, 值)
          this.$emit('update:dialogVisible', false)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 编辑部门时，获取全部员工的简单信息列表
    async getUserSimple() {
      this.peoples = await getUserSimple()
    },
    // 取消
    closeDialog() {
      // 重置表单
      this.$refs.form.resetFields()
      // 关闭dialog
      this.$emit('update:dialogVisible', false)
    },

    // 编辑部门时，获取该部门的详细信息
    async getDepartmentDetail(id) {
      this.formData = await getDepartmentDetail(id)
    }
  }
}
</script>

<style>
</style>
