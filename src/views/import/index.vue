<template>
  <UploadExcel :on-success="success" />
</template>

<script>
import UploadExcel from './../../components/UploadExcel/index.vue'
import { importEmployees } from '@/api/employees'
export default {
  components: { UploadExcel },
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      if (this.type === 'user') {
        // 如果是导入员工
        const userRelations = {
          入职日期: 'timeOfEntry',
          手机号: 'mobile',
          姓名: 'username',
          转正日期: 'correctionTime',
          工号: 'workNumber'
        }
        const arr = []
        results.forEach((item) => {
          const userInfo = {}
          Object.keys(item).forEach((key) => {
            // key是当前的中文名 找到对应的英文名
            if (
              userRelations[key] === 'timeOfEntry' ||
              userRelations[key] === 'correctionTime'
            ) {
              userInfo[userRelations[key]] = new Date(
                this.formatDate(item[key], '/')
              ) // 只有这样, 才能入库
              return
            }
            userInfo[userRelations[key]] = item[key]
          })
          arr.push(userInfo)
        })
        await importEmployees(arr)
        this.$message.success('导入成功')
      }
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style>
</style>
