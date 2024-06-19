<template>
  <el-card v-loading="loading" class="detail-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="登录账户设置" name="account">
        <el-form
          class="settingForm"
          ref="form"
          label-width="80px"
          :model="formData"
          :rules="formRules"
        >
          <el-form-item label="姓名" prop="username">
            <el-input
              v-model="formData.username"
              style="width: 300px"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input
              v-model="formData.password2"
              style="width: 300px"
              placeholder="请输入密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button
              type="primary"
              size="small"
              @click="confirmFn"
              style="margin-top: 20px"
              >确定</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="$router.back()"
              style="margin-top: 20px"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情" name="person">
        <el-row type="flex" justify="end">
          <el-tooltip content="打印个人基本信息">
            <router-link :to="`/employees/print/${$route.params.id}?type=personal`">
              <i class="el-icon-printer" />
            </router-link>
          </el-tooltip>
        </el-row>
        <userInfo :is="userInfo"></userInfo>
      </el-tab-pane>
      <el-tab-pane label="岗位详情" name="work">
        <el-row type="flex" justify="end">
          <el-tooltip content="打印岗位基本信息">
            <router-link :to="`/employees/print/${$route.params.id}?type=job`">
              <i class="el-icon-printer" />
            </router-link>
          </el-tooltip>
        </el-row>
        <jobInfo :is="jobInfo"></jobInfo>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { updateEmployeesInfo } from "@/api/employees";
import { getUserDetailById } from "@/api/user";
import userInfo from "./user-info.vue";
import jobInfo from "./job-info.vue";

export default {
  components: {
    userInfo,
    jobInfo,
  },
  data() {
    return {
      userInfo: "userInfo",
      jobInfo: "jobInfo",
      formData: {
        username: "",
        password2: "",
      },
      formRules: {
        username: [
          { required: true, trigger: "blur", message: "姓名不能为空" },
          {
            min: 2,
            max: 10,
            message: "姓名长度为1到20位",
            trigger: "blur",
          },
        ],
        password2: [
          { required: true, trigger: "blur", message: "密码不能为空" },
          {
            min: 6,
            max: 24,
            message: "密码长度为6到24位",
            trigger: "blur",
          },
        ],
      },
      loading: false,
      activeName: "account",
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      this.loading = true;
      this.formData = await getUserDetailById(this.$route.params.id);
      this.loading = false;
    },
    // tab切换点击
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    confirmFn() {
      this.$refs.form
        .validate()
        .then(() => {
          this.loading = true;
          return updateEmployeesInfo({
            ...this.formData,
            password: this.formData.password2,
          });
        })
        .then(() => {
          this.$message.success("保存成功");
          this.$router.back();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.detail-container {
  margin: 30px 30px 0 30px;
  .settingForm {
    margin: 30px 0 50px 120px;
  }
}
</style>