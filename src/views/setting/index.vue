<template>
  <div v-loading="loading" class="setting-container">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <!-- 新增角色按钮 -->
          <el-row style="height: 60px">
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="handleAdd"
              >新增角色</el-button
            >
          </el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="80"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="名称"
              width="160"
            >
            </el-table-column>
            <el-table-column align="center" prop="description" label="描述">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="handleBtn(scope.$index, scope.row)"
                  >分配权限</el-button
                >
                <el-button
                  size="small"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height: 60px"
          >
            <!-- 分页组件 -->
            <el-pagination
              background
              :current-page.sync="page.page"
              :page-size="page.pagesize"
              :total="page.total"
              @current-change="getRoleList"
              layout="prev,pager,next"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
          <el-form
            class="companyForm"
            ref="form"
            label-width="80px"
            :model="form"
          >
            <el-form-item label="公司名称">
              <el-input
                v-model="form.name"
                disabled
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="form.companyAddress"
                disabled
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="form.mailbox"
                disabled
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="form.remarks"
                disabled
                style="width: 400px"
                type="textarea"
                rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      title="编辑角色"
      :visible.sync="dialogVisible"
      :close="closeDialog"
    >
      <el-form class="roleForm" ref="roleForm" label-width="80px" :rules="roleRules" :model="roleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleForm.name"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
        style="padding-right: 50px;"
      >
        <!-- 列被分为24 -->
        <el-col :span="12">
          <el-button type="primary" size="small" @click="addAndEditRoleFn"
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
  getRoleList,
  getCompanyInfo,
  delRoles,
  getRoleDetail,
  addRole,
  editRole,
} from "@/api/setting";

export default {
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [
          { required: true, trigger: "blur", message: "角色名称不能为空" },
          {
            min: 1,
            max: 20,
            message: "角色名称长度为1到20位",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, trigger: "blur", message: "角色描述不能为空" },
          {
            min: 1,
            max: 50,
            message: "角色描述长度为1到50位",
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      loading: false,
      form: {},
      activeName: "first",
      tableData: [],
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 5,
        total: 0, // 记录总数
      },
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    // tab切换点击
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    // 分配权限
    handleBtn(index, row) {
      this.$message.success('敬请期待~')
    },
    // 编辑角色
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.getRoleDetail(row.id)
    },
    // 删除角色
    async handleDelete(index, row) {
      this.$confirm("确认删除该角色吗?")
        .then(() => {
          this.loading = true;
          return delRoles(row.id);
        })
        .then(() => {
          this.loading = false;
          this.$message.success("删除成功");
          this.getRoleList();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 添加角色,弹出弹框
    handleAdd(index, row) {
      this.dialogVisible = true;
    },
    // 编辑或者新增角色
    addAndEditRoleFn() {
      this.$refs.roleForm
        .validate()
        .then(() => {
          this.loading = true;
          if(this.roleForm.id){
            return editRole({ ...this.roleForm });
          }else{
            return addRole({ ...this.roleForm });
          }
        })
        .then(() => {
          if(this.roleForm.id){
            this.$message.success('编辑成功')
          }else{
            this.$message.success('新增成功')
          }
          this.loading = false;
          this.dialogVisible = false
          this.getRoleList()
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取角色列表数据
    async getRoleList() {
      this.loading = true;
      const res = await getRoleList(this.page);
      this.tableData = res.rows;
      this.page.total = res.total;
      this.loading = false;
    },
    // 获取公司数据
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.getters.userinfo.companyId);
      this.form = res;
    },
    // 获取角色详细数据
    async getRoleDetail(id) {
      const res = await getRoleDetail(id);
      this.roleForm = res;
    },
    closeDialog() {
      // 重置表单外的字段
      this.roleForm = {name: '',description: ''}
      // 重置表单
      this.$refs.roleForm.resetFields();
      this.dialogVisible = false;
    },
  },
};
</script>
  
<style scoped lang="scss">
.setting-container {
  .box-card {
    margin: 30px 30px 0 30px;
    .companyForm {
      margin-top: 30px;
    }
  }
}
</style>
  
  