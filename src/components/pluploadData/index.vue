<template>
  <div>
    <el-tooltip class="item" effect="dark" :content="`支持扩展名：${acceptFiles}`" placement="bottom-start">
      <el-button :id="`browseButton${up1}`" type="primary" icon="el-icon-upload2">
        请选择文件  
      </el-button>
    </el-tooltip>
    <em>{{ basicForm.fileName }}</em>
    <div v-if="fileRawList.length">
      <el-table :data="fileRawList" class="d2-mt-10 d2-mb-10">
        <el-table-column
          label="文件名"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === -1">正在计算MD5</span>
            <span v-if="scope.row.status === 1 && scope.row.percent === 0">MD5计算完成，准备上传</span>
            <span v-if="scope.row.status === 4" style="color: brown">上传失败</span>
            <span v-if="scope.row.status === 5" style="color: chartreuse">已上传</span>
            <el-progress
              v-if="scope.row.percent || scope.row.percent === 0"
              :text-inside="true"
              :stroke-width="20"
              :percentage="scope.row.percent"
              :v-if="scope.row.status === 2 || scope.row.status === 1 && scope.row.percent > 0"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="70"
        >
          
        </el-table-column>
      </el-table>
      <el-button :disabled="uploading" type="danger" @click="uploadStart()">
        开始上传
      </el-button>
    </div>
  </div>
</template>
<script>
// plupload参数文档：http://www.phpin.net/tools/plupload/
// import plupload from 'plupload/js/plupload.full.min.js'
import plupload from 'plupload'
import FileMd5 from '@/utils/file-md5.js'
// import { removeFile } from '@/api/filemgr'
export default {
  name: 'Plupload',
  props: {
    // 文件上传类型限制
    acceptFiles: {
      type: String,
      default: '.png,.jpg,.bmp,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
    },
    bizType: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: () => []
    },
    up1: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 5
    },
    mid: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      up: {},
      fname:'',
      basicForm: {},
      fileRawList: [],
      uploading: false
    }
  },
  watch: {
    up(val) {
      this.fileRawList = this.fileList.concat(val.files)
    },
    acceptFiles(val) {
      this[`up_${this.up1}`].refresh()
    }
    // fileList(val) {
    //   console.log('fileList', val, this.up)
    //   this.fileRawList = val.concat(this.up.files)
    //   this.up.refresh()
    // }
  },
  mounted() {
    this.pluploadInit()
  },
  methods: {
    pluploadInit() {
      var that = this
      var uploader = new plupload.Uploader({
        browse_button: `browseButton${this.up1}`,
        url:  'https://mob.hexntc.com/byd/web/plupload/js/plupload/examples/upload.php',
        chunk_size: '2MB',
        headers: that.headers,
        multipart: true, // 为true时将以multipart/form-data
        max_retries: 1, // 当发生plupload.HTTP_ERROR错误时的重试次数，为0时表示不重试
        multi_selection: false, // 是否可以在文件浏览对话框中选择多个文件
        filters: {
          mime_types: [
            { extensions: that.acceptFiles.replace(/\./g, '') }
          ],
          prevent_duplicates: false, // 不允许选取重复文件
          max_file_size: '10240mb' // 最大只能上传400kb的文件
        },
        init: {
          BeforeUpload(up, file) {
            // 上传时的附加参数，以键/值对的形式传入
            up.setOption('multipart_params', {
              'size': file.size,
              'md5': file.md5,
              'bizType': that.bizType,
              "mid":that.mid,
              "type":that.type,
              "uid":sessionStorage.getItem('uid'),  
              "filename":file.name, 
              
            })
          },
          FileFiltered(up, files) {
            // console.log('FileFiltered', up, files)
          },
          FilesAdded(up, files) {
            that.filename = files[0].name
            that.fileRawList = []
            that.fileRawList.push(...files)
            that.mid = that.mid
            that.type = that.type
            that.uid = sessionStorage.getItem('uid')
            if (that.fileRawList.length > that.limit) {
              // that.deleteFile(that.fileRawList[0])
            }
            files.forEach((f) => {
              f.status = -1
              FileMd5(f.getNative(), (e, md5) => {
                f['md5'] = md5
                f.status = 1
              })
            })
          },
          FilesRemoved(upp, files) {
            that.uploading = false
          },
          FileUploaded(up, file, info) {
            if (info.status === 200) {
              that.$emit('onChange', file)
              that.fileRawList = []
            //   const { path } = JSON.parse(info.response).data
            //   file.url = path
              that[`up_${that.up1}`].refresh()
            //   that.$emit('onChange', that.fileRawList)
            }
          },
          UploadComplete(up, files) {
            that.uploading = false
          },
          Error(up, args) {
            that.uploading = false
          }
        }
      })
      uploader.init()
      this[`up_${this.up1}`] = uploader
      // this.up = uploader
    },
    // deleteFile(row) {
    //   console.log(this.fileRawList.indexOf(row))
    //   this.fileRawList.splice(this.fileRawList.indexOf(row), 1)
    //   var file = this.up.getFile(row.id)
    //   file && this.up.removeFile(file)
    //   row.url && removeFile({ filePath: row.url }).then(res => {
    //     if (res.success) {
    //       this.$emit('onChange', this.fileRawList.filter(item => {
    //         return item.url
    //       }))
    //       return
    //     }
    //     this.$message.warning('删除文件出现异常，请与管理员联系!')
    //   })
    // },
    uploadStart() {
      this.uploading = true
      this[`up_${this.up1}`].start()
    }
  }
}
</script>
