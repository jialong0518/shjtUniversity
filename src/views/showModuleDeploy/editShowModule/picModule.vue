<template>
  <div class="picTextModule">
      <div style="padding: 15px;">
        <div style="padding-bottom: 15px;">图片摘要：</div>
            <div>
                <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="dataArr[0].abstract"
                @change="abstractchange($event,0)"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 4}"
                >
                </el-input>
            </div>
        </div>
      <div :key="index" v-for="(item, index) in dataArr">
          <div style="padding: 15px;">
            <div style="padding-bottom: 15px;">图片：</div>
            <div v-if="action.indexOf('see') === -1">
              <plupload
                  :limit="1"
                  biz-type="trainModule"
                  :up1="index"
                  accept-files=".zip,.rar,.xml,.txt,.pdf,.docx,.doc,.xlsx,.xls,.ppt,.pptx,.mp4,.mp3,.gif,.png,.jpg,.jpeg,.bmp"
                  @onChange="handleFileChange($event,index)"
              />
            </div>
        <img style="margin-top: 15px" v-if="item.src !== ''" :src="item.src"/>
        </div>
        <div style="padding: 15px;">
            <div style="padding-bottom: 15px;">顺序：</div>
                <el-select :disabled="action.indexOf('see') !== -1" v-model="item.sort" placeholder="请选择展示顺序">
                <el-option :label="index+1" :value="index+1" v-for="(item, index) in dataArr"></el-option>
            </el-select>
        </div>
        <div style="padding: 15px;">
            <div style="padding-bottom: 15px;">图片描述：</div>
            <div :id="`wangeditor${item.only}`" :ref="`wangeditor${item.only}`"></div>
        </div>
        
        <div v-if="action.indexOf('see') === -1" style="margin: 0 0 15px 15px;">
          <el-button type="primary" @click="addShowModule">新增</el-button>
          <el-button type="primary" @click="delShowModule(index)">删除</el-button>
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
  name: 'picTextModule',
  data() {
    return {
       editor: null,
       filename:'',
       dataArr: [
           {
               src:'',
               html:'',
               abstract:'',
               editor:null,
               only:(new Date()).valueOf(),
               sort:''
           }
       ],
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
      // src:'',
      //          html:'',
      //          editor:null,
      //          only:(new Date()).valueOf()
      let arr = [];
      this.dataArr[0].editor.destroy()
      this.dataArr[0].editor = null
      val.map((item, index)=>{
        arr.push({
          src:item.file_url,
          html:item.contents,
          editor:null,
          abstract: item.abstract,
          only:(new Date()).valueOf()+index,
          sort:item.file_sort
        })
      })
      this.dataArr = arr
      setTimeout(() => {
        this.dataArr.map((item, index)=>{
          console.log(item)
            this.initE(index, item)
       })
      }, 100);
    }
  },
  methods: {
    abstractchange(data, index){
        console.log(this.dataArr)
        // this.$emit('fileList', this.dataArr)
    },
    addShowModule(){
        this.dataArr.push({
               src:'',
               html:'',
               abstract:'',
               editor:null,
               only:(new Date()).valueOf(),
               sort:''
        })
        this.$emit('fileList', this.dataArr)
        setTimeout(() => {
            this.dataArr.map((item, index)=>{
            this.initE(index, item)
       })
        }, 100);
    },
    delShowModule(index){
        this.dataArr[index].editor.destroy()
        this.dataArr[index].editor = null
        this.dataArr.splice(index,1);
        this.$emit('fileList', this.dataArr)
        setTimeout(() => {
            this.dataArr.map((item, index)=>{
            item.editor.destroy()
            item.editor = null
            this.initE(index, item)
       })
        }, 100);
    },
    handleFileChange(fileName, index) {
    //   this.filename = 'http://mob.hexntc.com/byd/web/uploads/'+fileName;
    //   this.$emit('imgfile', this.filename)
      this.dataArr[index].src = 'http://mob.hexntc.com/byd/web/uploads/'+fileName;
      this.$emit('fileList', this.dataArr)
      console.log(this.dataArr)
    },
    initE(index, only) {
        let editor = only.editor
        if(editor != null)return
        console.log(editor,'editor',only)
      editor = new E(this.$refs[`wangeditor${only.only}`])
      only.editor = editor
      //这里各位小伙伴可以查询官网，根据自己的需求进行菜单栏调整
      editor.customConfig = editor.customConfig ? editor.customConfig : editor.config
      editor.customConfig.onchange = (html) => {
        //   this.info_ = html // 绑定当前逐渐地值
        only.html = html
        this.$emit('fileList', this.dataArr)
        }
      editor.customConfig.menus = [
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
      editor.create()
      editor.txt.html(this.dataArr[index].html)
      if(this.action === 'see'){
        editor.disable();
      }
    //   setTimeout(() => {
    //       this.editor.txt.html('<p>fwefwaefwafwaf</p>') 
    //   }, 2000);
    },
  },
  mounted: function() {
       this.dataArr.map((item, index)=>{
           this.initE(index, item)
       })
      
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
