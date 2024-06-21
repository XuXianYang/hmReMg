<template>
  <div v-loading="loading" class="employees-container">
    <PageTools :showBefore="true">
      <span slot="before">共{{ page.total }}条记录</span>
      <el-row slot="after">
        <el-button
          size="small"
          type="warning"
          @click="$router.push('/import?type=user')"
          >导入</el-button
        >
        <el-button size="small" type="danger" @click="exportExcelData"
          >普通excel导出</el-button
        >
        <el-button size="small" type="info" @click="exportMutiData"
          >复杂表头excel导出</el-button
        >
        <el-button size="small" type="primary" @click="showAddDialog = true"
          >新增员工</el-button
        >
      </el-row>
      <span slot="after"></span>
    </PageTools>
    <el-card class="em-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column align="center" label="序号" type="index" sortable="" />
        <el-table-column
          align="center"
          label="姓名"
          prop="username"
          sortable=""
        />
        <el-table-column label="头像" align="center">
          <template slot-scope="{ row }">
            <img
              slot="reference"
              v-imageError="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              style="
                border-radius: 50%;
                width: 50px;
                height: 50px;
                padding: 10px;
              "
              alt=""
              @click="showQrCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="工号"
          prop="workNumber"
          sortable=""
        />
        <el-table-column
          align="center"
          label="聘用形式"
          prop="formOfEmployment"
          sortable=""
          :formatter="formatEmployment"
        />
        <el-table-column
          align="center"
          label="部门"
          prop="departmentName"
          sortable=""
        />
        <el-table-column
          align="center"
          label="入职时间"
          prop="timeOfEntry"
          sortable=""
        >
          <template slot-scope="obj">
            {{ obj.row.timeOfEntry | formatTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="账户状态"
          prop="enableState"
          sortable=""
        >
          <template slot-scope="{ row }">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          sortable=""
          fixed="right"
          width="280"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!checkPermission('POINT-USER-UPDATE')"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="addRoles(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delUser(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page="page.page"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </el-card>
    <addEmployeesView
      :dialogVisible.sync="showAddDialog"
      @closeDialog="showAddDialog = false"
    ></addEmployeesView>
    <assignRoleView
      :dialogVisible.sync="showRoleDialog"
      @closeDialog="showRoleDialog = false"
      :userId="userId"
      ref="assignRole"
    ></assignRoleView>
    <el-dialog title="二维码" :visible.sync="showCodeDialog" width="400">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>
  
  <script>
import { getUserList, delUserById } from "@/api/employees";
import employeesUntil from "@/api/constant/employees";
import addEmployeesView from "./add-employee.vue";
import { formatTime } from "@/filters";
import EmployeeEnum from "@/api/constant/employees";
import QrCode from "qrcode";
import assignRoleView from "./assign-role.vue";
import checkPermission from "@/mixin/checkPermission"

export default {
  data() {
    return {
      userId:'',
      showCodeDialog: false,
      showAddDialog: false,
      showRoleDialog: false,
      loading: false,
      tableData: [],
      page: {
        // 放置页码及相关数据
        page: 1,
        size: 10,
        total: 0, // 记录总数
      },
      headers: {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      },
    };
  },
  components: {
    addEmployeesView,
    assignRoleView,
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取员工列表
    async getUserList() {
      this.loading = true;
      const res = await getUserList(this.page);
      this.tableData = res.rows;
      this.page.total = res.total;
      this.loading = false;
    },
    // 页码切换事件
    changePage(newPage) {
      this.page.page = newPage;
      this.getUserList();
    },
    // el-UI属性，格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const emObj = employeesUntil.hireType.find(
        (item) => item.id === cellValue
      );
      return emObj ? emObj.value : "未知";
    },
    // 删除员工
    delUser(id) {
      this.$confirm("确认要删除该员工吗？")
        .then(() => {
          this.loading = true;
          return delUserById(id);
        })
        .then(() => {
          this.loading = false;
          this.$message.success("删除成功");
          this.getUserList();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 导出数据
    exportExcelData() {
      const headers = this.headers;
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      import("@/vendor/Export2Excel").then(async (excel) => {
        this.loading = true;
        const { rows } = await getUserList({ page: 1, size: this.page.total });
        excel.export_json_to_excel({
          filename: "人力资源表",
          header: Object.keys(headers),
          data: this.formatJSON(headers, rows),
        });
        this.loading = false;
      });
    },

    // 导出复杂表头的数据
    exportMutiData() {
      const headers = this.headers;
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      import("@/vendor/Export2Excel").then(async (excel) => {
        this.loading = true;
        const { rows } = await getUserList({ page: 1, size: this.page.total });
        excel.export_json_to_excel({
          filename: "人力资源表",
          header: Object.keys(headers),
          data: this.formatJSON(headers, rows),
          // mutiHeader中表头的长度必须和header的表头长度是对应的 否则报错
          multiHeader: [["姓名", "主要信息", "", "", "", "", "部门"]], // 复杂表头的导出 数组中的一个数组 就是一行表头
          merges: ["A1:A2", "B1:F1", "G1:G2"], // 合并列，不用区分顺序 只写合并的单元格的顺序号
        });
        this.loading = false;
      });
    },

    // 把对象数组转化为excel所需的值数组
    formatJSON(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            // 如果是日期的话 就需要格式化日期
            return formatTime(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            // 要把聘用形式转化成文本
            const obj = EmployeeEnum.hireType.find(
              (o) => o.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },

    // 展示二维码
    showQrCode(url) {
      if (url && url.trim()) {
        this.showCodeDialog = true;
        // 数据更新了弹层不会立刻出现，页面的渲染是异步的！！！！
        // 数据更新完毕，页面渲染完毕之后执行$nextTick
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url);
        });
      } else {
        this.$message.warning("头像不存在");
      }
    },

    // 分配角色
    async addRoles(userId){
      this.userId = userId
      // 直接调用子组件的方法
      await this.$refs.assignRole.getUserDetailById(userId)
      this.showRoleDialog = true
    },

    checkPermission(key){
      return checkPermission.methods.checkPermission(key)
    }
  },
};
</script>
  
<style lang='scss'>
.employees-container {
  .em-card {
    margin: 0 10px 10px 10px;
  }
}
</style>
  