<template>
  <div class="calendarContent">
    <el-row type="flex" justify="end">
      <el-select
        v-model="currentYear"
        size="small"
        style="width: 120px"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}</el-option>
      </el-select>
      <el-select
        v-model="currentMonth"
        size="small"
        style="width: 120px; margin-left: 10px"
        @change="dateChange"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{
          item
        }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date, data }">
        <div class="content date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []
    }
  },
  watch: {
    currentDate: {
      immediate: true, // 立即执行
      deep: true, // 深度监听复杂类型的变化
      // 监听当前选中的日期，上面的年月重新计算赋值
      handler(newVal, oldVal) {
        var date = new Date(newVal)
        this.currentMonth = date.getMonth() + 1
        this.currentYear = date.getFullYear()
      }
    }
  },
  created() {
    //    处理起始时间
    // 组件要求起始时间必须是 周一开始 以一个月为开始
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    // 根据当前的年 生成可选年份 前后各加5年
    this.yearList = Array.from(
      Array(11),
      (value, index) => this.currentYear + index - 5
    )
    // 计算 当年当月的第一个周一 再加上 四周之后的一个月月份
    this.dateChange()
  },
  methods: {
    // 是否是休息日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    },
    // 年月份选择改变之后，重新计算当前日期
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    }
  }
}
</script>

<style  scoped>
.calendarContent /deep/ .el-calendar-day {
  height: auto;
}

.calendarContent /deep/ .el-calendar-table__row td,
.calendarContent /deep/ .el-calendar-table tr td:first-child,
.calendarContent /deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
.calendarContent /deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
.calendarContent /deep/ .el-calendar__header {
  display: none;
}
</style>
