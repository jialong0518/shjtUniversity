<template>
  <div class="account">
      <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6">
        <div style="display: inline-block;width:25%;">角色名称：</div>
        <el-input style="width: 75%" v-model="searchrolename" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:25%;">角色描述：</div>
        <el-input style="width: 75%" v-model="searchmemo" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <el-button type="primary" @click="getTableData()">搜索</el-button>
    </el-col>
    </el-row>
    <div style="padding: 15px;overflow: hidden;">
      <el-button type="primary" v-if="rights_list['添加']" style="float:right;" @click="addAccountButt('ruleForm')">添加角色权限</el-button>
    </div>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="rolename"
      label="角色名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="memo"
      label="角色描述">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button v-if="rights_list['查看']" @click="seeroleButt(scope.row)" type="text" size="small">查看</el-button>
        <el-button v-if="rights_list['编辑']" type="text" @click="editroleButt(scope.row)" size="small">编辑</el-button>
        <el-popconfirm
            title="是否确定删除该角色权限？"
            @onConfirm="rolesDel(scope.row)" 
        >
        <el-button style="margin: 0 10px;"  slot="reference" v-if="rights_list['删除']" type="text" size="small">删除</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <div style="text-align: center;
    margin-top: 20px;">
      <el-pagination
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total,  prev, pager, next, sizes,jumper"
      :total="totalPage">
    </el-pagination>
  </div>
  <el-dialog :show-close="false" :title="titleForm" :visible.sync="dialogRoleVisible">
  <el-form style="overflow: hidden;" :model="form" :rules="rulesRole" ref="ruleForm" label-width="100px">
    <div style="float: left;">
        <el-form-item label="角色名称" prop="name">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="remarks">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.remarks" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item v-if="titleForm.indexOf('查看')!== -1" label="用户列表" prop="remarks">
       <el-table
    :data="userList"
    border
    style="width: 300px">
    <el-table-column
      prop="username"
      label="账号">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
  </el-table>
    </el-form-item>
    </div>
    <div style="float: right;">
        <el-form-item  label="权限配置" prop="roles">
        <div style="height: 500px;overflow: scroll;">
            <el-tree
            style="width: 300px"
            ref="tree"
            node-key="id"
            :data="funList"
            default-expand-all
            :default-checked-keys="form.roles"
            @check="treeChange" 
            :props="defaultProps"
            show-checkbox>
            </el-tree>
        </div>
    </el-form-item>
    </div>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
    <el-button :disabled="titleForm.indexOf('查看')!== -1" :loading="loadingRole" type="primary" @click="submitRole('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import { userAdd, passwordreset } from "@/api/account";
import { roleslist, functionlist, rolesadd, rolesbind, rolesedit, rolesdel } from "@/api/role";


export default {
  name: 'Login',
  data() {
      let sectionUserPoListChecked=(rule, value, callback)=>{
          console.log(this.$refs.tree.getCheckedKeys())
               if(this.$refs.tree.getCheckedKeys().length===0){
                   return callback(new Error('请选择菜单'));
               }else{
                   callback();
               }
           };
    return {
        searchrolename:'',
        searchmemo:'',
        currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogRoleVisible: false,
      form: {
        name: '',
        remarks: '',
        roles:[],
        userList:[]
      },
      titleForm:'',
      rights_list: {},
      rulesRole: {
        name: [
            { required: true, message: '请填写名字', trigger: 'blur' }
        ],
        remarks: [
            { required: true, message: '请填写描述', trigger: 'blur' }
        ],
        roles: [
            {required: true, validator: sectionUserPoListChecked, trigger: 'change'}
        ],
      },
      loadingRole: false,
      tableData: [],
      accountId: '',
      funList: '',
      defaultProps: {
          disabled: this.disabledFn
        }
    }
  },
  methods: {
      sizeChange(val){
        this.currentPage = 1;
        this.pageSize = val;
        this.getTableData()
    },
    currentChange(val){
        this.currentPage = val;
        this.getTableData()
    },
    seeroleButt(data) {
      rolesbind({
          "id": data.id,
          "uid": sessionStorage.getItem('uid')}).then(r => {
              this.form = {
            name: r.data.rolename,
            remarks: r.data.memo,
            roles: r.data.fids
        }
        this.userList = r.data.userlist
      }).catch(() => {
      });
      this.titleForm = '查看角色权限'
      this.dialogRoleVisible = true
    },
    editroleButt(data) {
      rolesbind({
          "id": data.id,
          "uid": sessionStorage.getItem('uid')}).then(r => {
              this.form = {
            name: r.data.rolename,
            remarks: r.data.memo,
            roles: r.data.fids
        }
      }).catch(() => {
      });
      this.accountId = data.id
      this.titleForm = '编辑角色权限'
      this.dialogRoleVisible = true
    },
    addAccountButt(formName) {
      this.accountId = '';
      this.titleForm = '添加角色权限'
      this.dialogRoleVisible = true
    },
    cancelSubmit(formName) {
      this.accountId = '';
      this.dialogRoleVisible = false;
      this.$refs.tree.setCheckedKeys([])
      this.$refs[formName].resetFields();
    },
    submitRole(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.titleForm.indexOf('添加') !== -1){
              this.addDataFun(formName)
            }else{
              this.editDataFun(formName)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    addDataFun(formName){
      this.loadingRole = true
      rolesadd({
        "rolename": this.form.name,
        "memo": this.form.remarks,
        "fids": this.form.roles,
        "uid": sessionStorage.getItem('uid')}).then(r => {
          this.loadingRole = false
          this.dialogRoleVisible = false
          this.$refs.tree.setCheckedKeys([])
          this.$refs[formName].resetFields();
          this.getTableData();
        }).catch(() => {
          this.loadingRole = false
        });
    },
    editDataFun(formName) {
      this.loadingRole = true
      rolesedit({
        "id": this.accountId,
        "rolename": this.form.name,
        "memo": this.form.remarks,
        "fids": this.form.roles,
        "uid": sessionStorage.getItem('uid')}).then(r => {
          this.loadingRole = false
          this.dialogRoleVisible = false
          this.$refs.tree.setCheckedKeys([])
          this.$refs[formName].resetFields();
          this.getTableData();
      }).catch(() => {
        this.loadingRole = false
      });
    },
    resetAccount(data) {
        passwordreset({
            "id": data.id,
            "uid": sessionStorage.getItem('uid')})
            .then(r => {
              console.log(r)
            })
            .catch(() => {
            });      
    },
    treeChange() {
        this.form.roles=[]
        this.$refs.tree.getCheckedKeys().map((item)=>{
            if(Number(item)){
               this.form.roles.push(item)
            }
        })
    },
    treeData() {
      //
      let treeData = JSON.parse(JSON.stringify(this.funList))
      let treeRecursion = (data) =>{
        for(let item of data){
          item.id =  item['id'] || item['category'];
          item.label =  item['category']  || item['fname'];
          if(!item.children){
            item.children = [];
          }
          if(item['category_list']){
              if(item['category_list'].length > 0){
                  let category_list = {}
                category_list['fname'] = '权限';
                category_list['id'] = '权限';
                category_list['children'] = item['category_list'];
                item.children.push(category_list)
              }
            
          }
          if(item['module_list']){
            let module_list = {}
            module_list['fname'] = '展示模块';
            module_list['id'] = '展示模块';
            module_list['children'] = item['module_list'];
            item.children.push(module_list)
          }
          if(item['position_list']){
            let position_list = {}
            position_list['fname'] = '标记点';
            position_list['id'] = '标记点';
            position_list['children'] = item['position_list'];
            item.children.push(position_list)
          }
          if(item['weather_list']){
            let weather_list = {}
            weather_list['fname'] = '天气';
            weather_list['id'] = '天气';
            weather_list['children'] = item['weather_list'];
            item.children.push(weather_list)
          }
            treeRecursion(item['children'])
        }
      }
      treeRecursion(treeData)
      this.funList = treeData
    },
    disabledFn() {
        return this.titleForm.indexOf('查看')!== -1
    },
    getTableData() {
      roleslist({"rolename": this.searchrolename,
      "memo": this.searchmemo,
      "uid": sessionStorage.getItem('uid'),
      "pages": this.currentPage,
      "pagesize": this.pageSize
      })
      .then(r => {
          this.tableData = r.data.data_list;
          this.totalPage = r.data.datacount
            r.data.rights_list.map(item=>{
            this.rights_list[item.rights] = item.rights_id
            })           
      }).catch(() => {});
      functionlist({"uid": sessionStorage.getItem('uid')})
      .then(r => {
        this.funList = r.data;
        this.treeData()
      }).catch(() => {});
    },
    rolesDel(data) {
      rolesdel({
            "id": data.id,
            "uid": sessionStorage.getItem('uid')})
            .then(r => {
              console.log(r)
              this.$message({
                message: '删除成功！',
                type: 'success'
                });
              this.getTableData()
            })
            .catch(() => {
            }); 
    }
  },
  mounted: function() {
    this.getTableData();
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
