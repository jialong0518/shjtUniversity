<template>
  <div class="editShowModule">
    <div style="padding: 15px;">
      <span>{{name}}</span>
      <el-button type="primary" style="float:right;" v-if="action.indexOf('see') === -1" :loading="loadingShowModuleDeploy" @click="addShowModuleDeployButt()">保存</el-button>
    </div>
    <div style="padding: 15px;z-index: 1;position: relative;">
      <el-row :gutter="20">
        <el-col :span="6">
          <div><span>图片/视频：</span>
          <el-select :disabled="action.indexOf('see') !== -1" v-model="type" placeholder="请选择图片/视频">
            <el-option label="图片" value="图片"></el-option>
            <el-option label="视频" value="视频"></el-option>
          </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div><span>显示/隐藏：</span>
          <el-select :disabled="action.indexOf('see') !== -1" v-model="isShow" placeholder="请选择显示/隐藏">
            <el-option label="显示" value="显示"></el-option>
            <el-option label="隐藏" value="隐藏"></el-option>
          </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="z-index: 0;position: relative;">
        <picTextModule @imgfile="imgfile" :filesList="files" @abstract="abstract" :action="action" @onChange="htmlText" />
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { userlist, userAdd, passwordreset, userdel, useredit } from "@/api/account";
import { showModuleDeployList, } from "@/api/showModuleDeploy";
import { roleslist } from "@/api/role";

import picTextModule from './picTextModule'

export default {
  components: {
    picTextModule,
  },
  name: 'editShowModule',
  data() {
    return {
       type:'',
       moduleName: '',
       module:'',
       isShow:'',
       sort:'',
       imgfile_:'',
       htmlText_:'',
       loadingShowModuleDeploy: false,
       id:'',
       action:'',
       files:[],
       fileList: [],
       echartDataArr: [],
       echartType: '',
       statsData:[],
       abstractText: '',
       display:'',
       name:''
    }
  },
  
  methods: {
    abstract(data){
        this.abstractText = data
    },
    execlData(data, type){
      console.log(data, type)
      let echartDataArr = [];
      this.echartType = type;
      if(type === '表格'){
        this.echartDataArr = data
      }
      if(type === '数列'){
        data.map((item, index)=>{
            item.tableData.map((val, q)=>{
                echartDataArr.push({
                    title: item.name,
                    groupnum: index+1,
                    name: val.title,
                    val: val.val,
                    unit: val.unit
                })
            })
        })
        this.echartDataArr = echartDataArr
      }
    },
    echartData(data, type){
        console.log(data,'echartData')
        this.echartType = type;
        let echartDataArr = [];
        data.map((item, index)=>{
            item.tableData.map((val, q)=>{
                echartDataArr.push({
                    title: item.name,
                    groupnum: index+1,
                    row_val: val.name,
                    cols_val: val.record,
                    unit: val.unit
                })
            })
        })
        this.echartDataArr = echartDataArr
    },
    getfileList(data){
      this.fileList = data;
      console.log(data)
    },
    imgfile(data){
        this.imgfile_ = data
        console.log(data,'imgfile')
    },
    imgfile1(data){
        this.imgfile_1 = data
        console.log(data,'imgfile')
    },
    htmlText(data){
        console.log(data,'htmlText')
        this.htmlText_ = data
    },
    addShowModuleDeployButt(){
        let url = '';
        let params = {
            title:"",
            type:'',
            sort:'',
            display:'',
            files:'',
            uid:'',
            stats:''
        };
        if(this.module.indexOf('/water') !== -1){
            url = `/byd/web/index.php?r=reg/water_pointedit`;
        }

        if(this.module.indexOf('/organisms') !== -1){
            url = `/byd/web/index.php?r=reg/organisms_pointedit`;
        }
        if(this.module.indexOf('/carbon') !== -1){
            url = `/byd/web/index.php?r=reg/carbon_pointedit`;
        }
        if(this.module.indexOf('/sub4') !== -1){
            url = `/byd/web/index.php?r=reg/sub4_pointedit`;
        }
        if(this.module.indexOf('/sub5') !== -1){
            url = `/byd/web/index.php?r=reg/sub5_pointedit`;
        }
        if(this.module.indexOf('/sub6') !== -1){
            url = `/byd/web/index.php?r=reg/sub6_pointedit`;
        }
        if(this.module.indexOf('/sub7') !== -1){
            url = `/byd/web/index.php?r=reg/sub7_pointedit`;
        }
        if(this.module.indexOf('/sub8') !== -1){
            url = `/byd/web/index.php?r=reg/sub8_pointedit`;
        }
        
        //////////
        
            params = {
                "display":this.isShow,
                "file_url":this.imgfile_,
                "contents":this.htmlText_,
                "uid": sessionStorage.getItem('uid'),
                "type": this.type,
                "pname": this.name,
            }
        if(this.id !== '')params.id = this.id
        this.loadingShowModuleDeploy = false
        showModuleDeployList(url, params)
            .then(r => {
              this.loadingShowModuleDeploy = false
              this.$router.push({
                path:'markPointManage',
                query:{}
            });
            })
            .catch(() => {
              this.loadingShowModuleDeploy = false
            });
    },
    getData(){
        let url = '';
        if(this.module.indexOf('/water') !== -1){
            url = '/byd/web/index.php?r=reg/water_pointbind';
        }
        if(this.module.indexOf('/organisms') !== -1){
            url = '/byd/web/index.php?r=reg/organisms_pointbind';
        }
        if(this.module.indexOf('/carbon') !== -1){
            url = '/byd/web/index.php?r=reg/carbon_pointbind';
        }
        if(this.module.indexOf('/sub4') !== -1){
            url = `/byd/web/index.php?r=reg/sub4_pointbind`;
        }
        if(this.module.indexOf('/sub5') !== -1){
            url = `/byd/web/index.php?r=reg/sub5_pointbind`;
        }
        if(this.module.indexOf('/sub6') !== -1){
            url = `/byd/web/index.php?r=reg/sub6_pointbind`;
        }
        if(this.module.indexOf('/sub7') !== -1){
            url = `/byd/web/index.php?r=reg/sub7_pointbind`;
        }
        if(this.module.indexOf('/sub8') !== -1){
            url = `/byd/web/index.php?r=reg/sub8_pointbind`;
        }
        
        showModuleDeployList(url, {
            "id": this.id,
            "uid": sessionStorage.getItem('uid')
        }).then(r => {
            this.isShow = r.data.display
            this.files = [{
                contents: r.data.contents,
                file_url: r.data.file_url
            }]
            this.filesList = this.files
            })
            .catch(() => {
            });
    }
  },
  mounted: function() {
      this.type = this.$route.query.type;
      this.name = this.$route.query.name;
      this.module = this.$route.path;
      this.action = this.$route.query.action
      this.display = this.$route.query.display

          this.id = this.$route.query.id
          this.getData()
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
