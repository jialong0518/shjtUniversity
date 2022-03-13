<template>
  <div class="picTextModule">
    <div style="padding: 15px;">
        <div style="padding-bottom: 15px;">图片：</div>
        <div v-if="action.indexOf('see') === -1">
          <plupload
              :limit="1"
              biz-type="trainModule"
              :up1="0"
              accept-files=".zip,.rar,.xml,.txt,.pdf,.docx,.doc,.xlsx,.xls,.ppt,.pptx,.mp4,.mp3,.gif,.png,.jpg,.jpeg,.bmp"
              @onChange="handleFileChange"
          />
        </div>
    <img v-if="filename !== ''" :src="filename"/>
    </div>
    <div style="padding: 15px;">
        <div style="padding-bottom: 15px;">图片描述：</div>
        <div id="wangeditor" ref="wangeditor"></div>
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
  name: 'picTextModule',
  data() {
    return {
       editor: null,
       filename:'',
       textarea: ''
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
      this.$emit('imgfile', this.filename)
      this.$emit('onChange', val[0].contents)
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
