<template>
  <div class="videoModule">
    <div style="padding: 15px;">
        <div style="padding-bottom: 15px;">视频：</div>
        <div v-if="action.indexOf('see') === -1">
          <plupload
              :limit="1"
              biz-type="trainModule"
              :up1="0"
              accept-files=".zip,.rar,.xml,.txt,.pdf,.docx,.doc,.xlsx,.xls,.ppt,.pptx,.mp4,.mp3,.gif,.png,.jpg,.jpeg,.bmp"
              @onChange="handleFileChange"
          />
        </div>
    <div style="width: 400px; height: 300px;margin-top: 15px" v-if="filename !== ''">
        <vue-core-video-player :autoplay="false" :src="filename"></vue-core-video-player>
    </div>
    </div>
    <div style="padding: 15px;">
        <div style="padding-bottom: 15px;">视频封面：</div>
        <div v-if="action.indexOf('see') === -1">
          <plupload
              :limit="1"
              biz-type="trainModule"
              :up1="1"
              accept-files=".gif,.png,.jpg,.jpeg,.bmp"
              @onChange="handleFileChange1"
          />
        </div>
    <img v-if="filename1 !== ''" :src="filename1"/>
    </div>
    <div style="padding: 15px;">
        <div style="padding-bottom: 15px;">视频描述：</div>
        <div id="wangeditor" ref="wangeditor"></div>
    </div>
    <div style="padding: 15px;">
        <div style="padding-bottom: 15px;">视频摘要：</div>
        <div>
            <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            @change="abstractchange"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 4}"
            >
            </el-input>
        </div>
    </div>
  </div>
</template>

<script>
import { showModuleDeployList, showModuleDeployList1 } from "@/api/showModuleDeploy";
import { roleslist } from "@/api/role";
import E from 'wangeditor'
import plupload from '@/components/plupload'


export default {
  components: {
    plupload,
  },
  name: 'videoModule',
  data() {
    return {
       editor: null,
       filename:'',
       filename1: '',
       textarea:'',
    }
  },
  props:{
      filesList: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: ''
    },
  },
  watch: {
    filesList(val) {
      console.log(val[0],'filesList')
      this.editor.txt.html(val[0].contents);
      this.filename = val[0].file_url;
      this.filename1 = val[0].headimg;
      this.textarea = val[0].abstract;
      this.$emit('imgfile', this.filename)
      this.$emit('imgfile1', this.filename1)
      this.$emit('onChange', val[0].contents)
      this.$emit('abstract', this.textarea)
    }
  },
  methods: {
      abstractchange(){
        this.$emit('abstract', this.textarea)
    },
    handleFileChange(fileName) {
      this.filename = 'http://mob.hexntc.com/byd/web/uploads/'+fileName;
      this.$emit('imgfile', this.filename)
      console.log('handleFileChange', fileName)
    },
    handleFileChange1(fileName) {
      this.filename1 = 'http://mob.hexntc.com/byd/web/uploads/'+fileName;
      this.$emit('imgfile1', this.filename1)
      console.log('handleFileChange', fileName1)
    },
    initE() {
      this.editor = new E(this.$refs.wangeditor)
      //这里各位小伙伴可以查询官网，根据自己的需求进行菜单栏调整
      this.editor.customConfig = this.editor.customConfig ? this.editor.customConfig : this.editor.config
      this.editor.customConfig.onchange = (html) => {
        //   this.info_ = html // 绑定当前逐渐地值
        this.$emit('onChange', html)
        console.log(html)
        }
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        // 'fontName',  // 字体
        // 'italic',  // 斜体
        'underline',  // 下划线
        // 'strikeThrough',  // 删除线
        // 'foreColor',  // 文字颜色
        // 'backColor',  // 背景颜色
        // 'list',  // 列表
        'justify',  // 对齐方式
        // 'quote',  // 引用
        // 'emoticon',  // 表情
        // 'table',  // 表格
        // 'code',  // 插入代码
      ]
      this.editor.create()
      if(this.action === 'see'){
        this.editor.disable();
      }
    //   setTimeout(() => {
    //       this.editor.txt.html('<p>fwefwaefwafwaf</p>') 
    //   }, 2000);
    },
  },
  mounted: function() {
      this.initE()
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.role{
  height: 100%;
  background: #fff;
}
</style>
