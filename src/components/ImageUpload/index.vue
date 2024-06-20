<template>
  <div>
    <el-upload
      :on-preview="preview"
      :on-change="selImg"
      :on-remove="removeImg"
      :file-list="fileList"
      list-type="picture-card"
      :http-request="onUpload"
      :class="{ disabled: fileComputed }"
      :limit="1"
      action="#"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width: 180px"
    />
    <el-dialog
      title="图片预览"
      :visible.sync="showDialog"
      width="400"
      :before-close="closeDialog"
    >
      <img :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
// 配置腾讯云的公钥信息
var cos = new COS({
});

export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: "",
      currentFileUid: "",
      showPercent: false, // 进度条
      percent: 0, //进度条进度
    };
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    preview(file) {
      console.log("预览" + file);
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    selImg(file, fileList) {
      console.log("选择" + file);
      console.log("选择列表" + fileList);
      this.fileList = fileList.map((item) => item);
    },
    removeImg(file) {
      console.log("删除" + file);
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
    },
    closeDialog() {
      this.showDialog = false;
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024;
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      this.currentFileUid = file.uid;
      return true;
    },
    onUpload(params) {
      console.log("自定义上传" + params.file);
      if (params.file) {
        this.showPercent = true;
        // 执行上传操作,上传到腾讯云
        cos.putObject(
          {
            Bucket: "xxy56397-1327235437", // 存储桶
            Region: "ap-beijing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 进度条
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data);
            if (!err && data.statusCode === 200) {
              //上传成功
              this.fileList = this.fileList.map((item) => {
                if (item.uid === params.file.uid) {
                  return { url: "http://" + data.Location, upload: true };
                }
                return item;
              });
            }
            setTimeout(() => {
              this.showPercent = false; // 隐藏进度条
              this.percent = 0; // 进度归0
            }, 2000);
          }
        );
      }
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>