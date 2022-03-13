<template>
  <div class="account">
    <div style="padding: 15px;overflow: hidden;">
       <el-button type="primary"  v-if="rights_list['发布']" style="float:right;" @click="accountDel('', 'all')">全部发布</el-button>
    </div>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="编号"
      width="100"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="动效类型"
      >
    </el-table-column>
    <el-table-column
      prop="publish"
      label="是否发布"
      >
    </el-table-column>
    <el-table-column
      label="开启/关闭">
      <template slot-scope="scope">
        <el-switch
        @change="seeAccountButt(scope.row,scope.$index)"
        v-model="scope.row.state"
        :active-value="'开启'"
        :inactive-value="'关闭'"
        active-text="开启"
        inactive-text="关闭">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="发布">
      <template slot-scope="scope">
        <el-popconfirm
            title="确定发布这条数据吗？"
            @onConfirm="accountDel(scope.row, 'one')" 
        >
        <el-button style="margin: 0 10px;" v-if="rights_list['发布']" slot="reference"  type="text" size="small">发布</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { userlist, userAdd, passwordreset, userdel, useredit, userbind } from "@/api/account";
import { roleslist } from "@/api/role";
import { showModuleDeployList, } from "@/api/showModuleDeploy";

export default {
  name: 'Login',
  data() {
    return {
      dialogAccountVisible: false,
      message_: null,
      message1_:null,
      roleList: {},
      titleForm:'',
      rights_list: {},
      loadingAccount: false,
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      tableData: [],
      accountId: '',
      wordVisible: false,
      word:'',
      module:'',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    seeAccountButt(data1,index) {
      let url = '';
      let data = {};
      
        data= {
             "id": data1.id,
              "state": data1.state,
              "uid": sessionStorage.getItem('uid')
          }
        if(this.module.indexOf('/water') !== -1){
            url = '/byd/web/index.php?r=reg/water_weathercontrol';
        }
        if(this.module.indexOf('/organisms') !== -1){
            url = '/byd/web/index.php?r=reg/organisms_weathercontrol';
        }
        if(this.module.indexOf('/carbon') !== -1){
            url = '/byd/web/index.php?r=reg/carbon_weathercontrol';
        }
        if(this.module.indexOf('/sub4') !== -1){
            url = '/byd/web/index.php?r=reg/sub4_weathercontrol';
        }
        if(this.module.indexOf('/sub5') !== -1){
            url = '/byd/web/index.php?r=reg/sub5_weathercontrol';
        }
        if(this.module.indexOf('/sub6') !== -1){
            url = '/byd/web/index.php?r=reg/sub6_weathercontrol';
        }
        if(this.module.indexOf('/sub7') !== -1){
            url = '/byd/web/index.php?r=reg/sub7_weathercontrol';
        }
        if(this.module.indexOf('/sub8') !== -1){
            url = '/byd/web/index.php?r=reg/sub8_weathercontrol';
        }
        
        showModuleDeployList(url, data).then(r => {
             this.getTableData()
             this.$message({
                message: '修改成功！',
                type: 'success'
                });
            })
            .catch(() => {
            });
    },
    editAccountButt(data) {
      this.accountId = data.id
      this.$router.push({
         path:'editmarkPointModule',
         query:{type:data.type,display: data.display,id: data.id,name:data.pname,action: 'edit'}
      });
    },
    addAccountButt(formName) {
      this.accountId = '';
      this.titleForm = '添加用户'
      this.dialogAccountVisible = true
    },
    cancelSubmit() {
      this.accountId = '';
      this.dialogAccountVisible = false;
      this.$refs[formName].resetFields();
    },
    accountDel(data1, type) {
        console.log(data1)
      let url = '';
      let data = {};
      if(this.module.indexOf('/water') !== -1){
            url = '/byd/web/index.php?r=reg/water_weatherpub';
        }
        if(this.module.indexOf('/organisms') !== -1){
            url = '/byd/web/index.php?r=reg/organisms_weatherpub';
        }
        if(this.module.indexOf('/carbon') !== -1){
            url = '/byd/web/index.php?r=reg/carbon_weatherpub';
        }
        if(this.module.indexOf('/sub4') !== -1){
            url = '/byd/web/index.php?r=reg/sub4_weatherpub';
        }
        if(this.module.indexOf('/sub5') !== -1){
            url = '/byd/web/index.php?r=reg/sub5_weatherpub';
        }
        if(this.module.indexOf('/sub6') !== -1){
            url = '/byd/web/index.php?r=reg/sub6_weatherpub';
        }
        if(this.module.indexOf('/sub7') !== -1){
            url = '/byd/web/index.php?r=reg/sub7_weatherpub';
        }
        if(this.module.indexOf('/sub8') !== -1){
            url = '/byd/web/index.php?r=reg/sub8_weatherpub';
        }
      if(type === 'all'){
        data= {
             "id": 0,
              "type": "all",
              "uid": sessionStorage.getItem('uid')
          }
          const h = this.$createElement;
          this.$msgbox({
          title: '确认',
          message: h('p', null, [
            h('span', null, '确认全部发布 '),
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '发布中...';
              showModuleDeployList(url, data)
            .then(r => {
                this.getTableData()
                this.$message({
                        message: '发布成功！',
                        type: 'success'
                        });
                done();
                instance.confirmButtonLoading = false;
                }).catch(() => {}); 
                
            } else {
              done();
            }
          }
        }).then(action => {
        });
      }else{
        data= {
             "id": data1.id,
              "type": "one",
              "uid": sessionStorage.getItem('uid')
          }
          showModuleDeployList(url, data).then(r => {
             this.getTableData()
             this.$message({
                message: '发布成功！',
                type: 'success'
                });
            })
            .catch(() => {
            });
      }
        
        
        
    },
    getTableData() {
      let url = '';
        if(this.module.indexOf('/water') !== -1){
            url = '/byd/web/index.php?r=reg/water_weatherlist';
        }
        if(this.module.indexOf('/organisms') !== -1){
            url = '/byd/web/index.php?r=reg/organisms_weatherlist';
        }
        if(this.module.indexOf('/carbon') !== -1){
            url = '/byd/web/index.php?r=reg/carbon_weatherlist';
        }
        if(this.module.indexOf('/sub4') !== -1){
            url = '/byd/web/index.php?r=reg/sub4_weatherlist';
        }
        if(this.module.indexOf('/sub5') !== -1){
            url = '/byd/web/index.php?r=reg/sub5_weatherlist';
        }
        if(this.module.indexOf('/sub6') !== -1){
            url = '/byd/web/index.php?r=reg/sub6_weatherlist';
        }
        if(this.module.indexOf('/sub7') !== -1){
            url = '/byd/web/index.php?r=reg/sub7_weatherlist';
        }
        if(this.module.indexOf('/sub8') !== -1){
            url = '/byd/web/index.php?r=reg/sub8_weatherlist';
        }
        
        showModuleDeployList(url, {
            "pname": '',
            "uid": sessionStorage.getItem('uid')
        }).then(r => {
             this.tableData = r.data.data_list;
              this.tableData =r.data.data_list
            r.data.rights_list.map(item=>{
              this.rights_list[item.rights] = item.rights_id
            })
            })
            .catch(() => {
            });
    }
  },
  
//   message_
  mounted: function() {
      this.module = this.$route.path;
      this.getTableData()
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
