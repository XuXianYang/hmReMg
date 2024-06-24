import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

//格式化时间
export function formatTime(time, option){
    //return dayjs().to(dayjs(time))
    return dayjs(time).format('YYYY-MM-DD')
}

// 上传文档格式控制
export function updatedFile(file, obj, callback, func) {
    if (file.size < 10100000) {
      var fileName = file.name
      var suffix = fileName
        .substring(fileName.lastIndexOf('.') + 1)
        .toUpperCase()
      if (
        suffix === 'DOC' ||
        suffix === 'DOCX' ||
        suffix === 'XLS' ||
        suffix === 'XLSX' ||
        suffix === 'PDF' ||
        suffix === 'ZIP' ||
        suffix === 'RAR'
      ) {
        return true
      } else {
        var tipType = '文件类型不正确,请重新上传'
        callback(tipType)
        return false
      }
    } else {
      var tipSize = '文件大小超过5M,请重新上传'
      callback(tipSize)
      return false
    }
  }
  export function importFile(file, obj, callback, func) {
    if (file.size < 10100000) {
      var fileName = file.name
      var suffix = fileName
        .substring(fileName.lastIndexOf('.') + 1)
        .toUpperCase()
      if (
        suffix === 'XLS' ||
        suffix === 'XLSX'
      ) {
        return true
      } else {
        var tipType = '文件类型不正确,请重新上传'
        callback(tipType)
        return false
      }
    } else {
      var tipSize = '文件大小超过10M,请重新上传'
      callback(tipSize)
      return false
    }
  }

  export function importFilexml(file, obj, func) {
    if (file.size < 10100000) {
      var fileName = file.name
      var suffix = fileName
        .substring(fileName.lastIndexOf('.') + 1)
        .toUpperCase()
      if (
        suffix === 'xml' ||
        suffix === 'XML'
      ) {
        return true
      } else {
        var tipType = '文件类型不正确,请重新上传'
        func(tipType)
        return false
      }
    } else {
      var tipSize = '文件大小超过10M,请重新上传'
      func(tipSize)
      return false
    }
  }