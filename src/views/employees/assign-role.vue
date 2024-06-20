<template>
  <el-dialog
    title="新增员工"
    :visible="dialogVisible"
    width="550px"
    @close="closeDialog"
    v-loading="loading"
  >
    <el-checkbox-group v-model="rolesIds">
      <el-checkbox
        v-for="item in roleList"
        :key="item.id"
        :label="item.id"
        style="margin-bottom: 20px"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row
      slot="footer"
      style="padding: 0 150px 0 50px"
      type="flex"
      justify="center"
    >
      <!-- 列被分为24 -->
      <el-col :span="12">
        <el-button type="primary" size="small" @click="assignRoleFn"
          >确定</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-button size="small" @click="closeDialog">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  data() {
    return {
      loading: false,
      roleList: [],
      rolesIds: [],
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
  },
  created() {
    this.getRoleList();
  },
  methods: {
    closeDialog() {
      // 关闭dialog
      this.rolesIds = [];
      this.$emit("update:dialogVisible", false);
    },
    // 给员工添加角色
    async assignRoleFn() {
        if(!this.rolesIds.length){
            return this.$message.warning('角色分配不能为空')
        }
        try{
            this.loading = true
            await assignRoles({
                id:this.userId,
                roleIds:this.rolesIds
            })
            this.$message.success('角色分配成功')
            this.loading = false
            this.$emit('update:dialogVisible', false)
        }catch(err){
            this.loading = false
        }
    },
    // 获取公司角色列表
    async getRoleList() {
      const res = await getRoleList();
      this.roleList = res.rows;
    },
    // 获取用户详细信息
    async getUserDetailById(id) {
      const res = await getUserDetailById(id);
      this.rolesIds = res.roleIds;
    },
  },
};
</script>

<style>
</style>