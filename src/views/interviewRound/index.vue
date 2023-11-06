<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px">
      <!-- <el-col :span="6">
        <div style="display: inline-block;width:30%;">面试编号：</div>
        <el-input style="width: 70%" v-model="searchNo" @change="getTableData()" autocomplete="off"></el-input>
    </el-col> -->
      <el-col :span="6">
        <div style="display: inline-block; width: 30%">年份：</div>
        <el-select v-model="searchYear" style="width: 70%" placeholder="请选择">
          <el-option
            v-for="item in yearData"
            :key="item.year"
            :label="item.year"
            :value="item.year"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div style="display: inline-block; width: 30%">名称：</div>
        <el-input
          style="width: 70%"
          v-model="searchName"
          @change="getTableData()"
          autocomplete="off"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="searchFun">搜 索</el-button>
        <el-button type="primary" plain @click="resetSearch()">重置</el-button>
      </el-col>
    </el-row>
    <div
      style="
        padding: 15px;
        overflow: hidden;
        display: flex;
        justify-content: flex-end;
      "
    >
      <el-button
        type="primary"
        style="margin-left: 15px"
        @click="addAccountButt('ruleForm')"
        >添加场次</el-button
      >
    </div>
    <div style="padding: 0 20px">
      <el-table
        :data="tableData"
        border
        style="width: 100%; border-radius: 10px"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="year" label="年份"> </el-table-column>
        <el-table-column prop="round_name" label="场次名称"> </el-table-column>
        <el-table-column prop="round_num" label="场次"> </el-table-column>
        <el-table-column prop="audition_name" label="计划/实际">
          <template slot-scope="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="planNum(scope.row)"
              >{{ scope.row.count_plan + "/" + scope.row.count_act }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="countWait" label="递补">
          <template slot-scope="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="planNum(scope.row)"
              >{{ scope.row.countWait }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="confirm_begin" label="确实开始">
        </el-table-column>
        <el-table-column prop="confirm_end" label="确认结束"> </el-table-column>
        <el-table-column prop="count_plan" label="限定人数"> </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button
              style="margin-bottom: 10px; margin-left: 10px"
              @click="mateButt(scope.row)"
              type="primary"
              size="mini"
              >匹配确认专家</el-button
            >
            <!-- <el-button  @click="seeAccountButt(scope.row)" type="text" size="small">人员详情</el-button> -->
            <el-button
              style="margin-bottom: 10px"
              @click="exportButt(scope.row, '0')"
              type="primary"
              size="mini"
              >导出未确认人员表格</el-button
            >
            <el-button
              type="primary"
              v-show="powerType == '1'"
              style="margin-bottom: 10px"
              size="mini"
              @click="emlButt(scope.row)"
              >发送通知</el-button
            >
            <el-button
              style="margin-bottom: 10px"
              @click="exportButt(scope.row, '1')"
              type="primary"
              size="mini"
              >签到表</el-button
            >
            <el-button
              style="margin-bottom: 10px"
              type="primary"
              @click="editAccountButt(scope.row)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              style="margin-bottom: 10px"
              type="primary"
              @click="switchButt(scope.row)"
              size="mini"
              >{{ scope.row.status === "已关闭" ? "开启" : "关闭" }}</el-button
            >
            <el-button
                style="margin: 0 10px 10px"
                type="primary"
                size="mini"
                @click="goSecretaryButt(scope.row)"
                >导入秘书对应数据</el-button
              >
            <el-popconfirm
              title="是否确定删除该账号？"
              @onConfirm="accountDel(scope.row)"
            >
              <el-button
                style="margin: 0 10px"
                slot="reference"
                type="danger"
                size="mini"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center; margin-top: 20px">
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total,  prev, pager, next, sizes,jumper"
        :total="totalPage"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="titleForm"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialogAccountVisible"
      width="800px"
    >
      <div style="overflow: auto">
        <div style="width: 50%; float: left">
          <el-form
            :model="form"
            :rules="rulesAccount"
            ref="ruleForm"
            label-width="110px"
          >
            <el-form-item label="年份" prop="year">
              <el-select
                v-model="form.year"
                :disabled="titleForm.indexOf('查看') !== -1"
                style="width: 200px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in yearData"
                  :key="item.year"
                  :label="item.year"
                  :value="item.year"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input
                style="width: 200px"
                placeholder="请填写名称"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="场次序号" prop="round_num">
              <el-input
                style="width: 200px"
                placeholder="请填写场次序号"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.round_num"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认开始" prop="confirmStart">
              <el-date-picker
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.confirmStart"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="确认结束" prop="confirmEnd">
              <el-date-picker
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.confirmEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="面试开始时间" prop="interviewStart">
              <el-date-picker
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.interviewStart"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="面试结束时间" prop="interviewEnd">
              <el-date-picker
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.interviewEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="限定人数" prop="num">
              <el-input
                placeholder="请填写限定人数"
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.num"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="负责人邮箱" prop="email">
      <el-input placeholder="请填写负责人邮箱" style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.email" autocomplete="off"></el-input>
    </el-form-item> -->
            <el-form-item label="联系人姓名" prop="linkName">
              <el-input
                placeholder="请填写联系人姓名"
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.linkName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人电话" prop="linkPhone">
              <el-input
                placeholder="请填写联系人电话"
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.linkPhone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="场次备注" prop="remarks">
              <el-input
                placeholder="请填写场次备注"
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.remarks"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div style="width: 50%; float: right">
          <el-form
            :model="form"
            :rules="rulesAccount"
            ref="ruleForm"
            label-width="110px"
          >
            <el-form-item label="开启线上签到" prop="signIn">
              <el-switch v-model="form.signIn"></el-switch>
            </el-form-item>
            <el-form-item label="签到开始时间" prop="signInBegin">
              <el-date-picker
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.signInBegin"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="签到结束时间" prop="signInEnd">
              <el-date-picker
                style="width: 200px"
                :disabled="titleForm.indexOf('查看') !== -1"
                v-model="form.signInEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="nda"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
        <el-button
          :disabled="titleForm.indexOf('查看') !== -1"
          :loading="loadingAccount"
          type="primary"
          @click="submitAccount('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="匹配确认专家"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialogMateVisible"
    >
      <div>
        <el-row :gutter="20" style="padding: 5px 5px 10px 5px">
          <el-col :span="6">
            <div style="display: inline-block; width: 30%">年份：</div>
            {{ this.form.year }}
          </el-col>
          <el-col :span="6">
            <div style="display: inline-block; width: 50%">场次名称：</div>
            {{ this.form.name }}
          </el-col>
          <el-col :span="6">
            <div style="display: inline-block; width: 30%">场次：</div>
            {{ this.form.round_num }}
          </el-col>
          <el-col :span="6">
            <div style="display: inline-block; width: 50%">限定人数：</div>
            {{ this.form.num }}
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding: 5px 5px 10px 5px">
          <el-col :span="12">
            <div style="display: inline-block; width: 30%">确认开始：</div>
            {{ this.form.confirmStart }}
          </el-col>
          <el-col :span="12">
            <div style="display: inline-block; width: 30%">确认结束：</div>
            {{ this.form.confirmEnd }}
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding: 5px 5px 10px 5px">
          <el-col :span="17">
            <div style="display: inline-block; width: 20%">面试时间段：</div>
            {{ this.form.interviewStart + "——" + this.form.interviewEnd }}
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table
          :data="mateTableData"
          @select="mateTableSelect"
          @select-all="mateTableSelectAll"
          border
          size="mini"
          height="500"
          style="width: 100%; border-radius: 10px"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="college" label="院/系"> </el-table-column>
          <el-table-column prop="sourceCount" label="资格库人数">
          </el-table-column>
          <el-table-column prop="basicCount" label="基础库人数">
          </el-table-column>
          <el-table-column
            prop="matchCount"
            :label="`本次抽取人数（${matchCountNum}）`"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.matchCount"
                @input="matchNumData(scope.$index, scope.row, $event)"
                autocomplete="off"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit('')">取 消</el-button>
        <el-button
          :loading="loadingAccount"
          type="primary"
          @click="submitExtract()"
          >确认抽取</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="发送邮件"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="emlVisible"
    >
      <div>
        <el-form label-width="200px">
          <el-form-item label="通知方式：" prop="year">
            <el-select
              v-model="noticeType"
              style="width: 500px"
              placeholder="请选择"
            >
              <el-option label="邮件" value="邮件"> </el-option>
              <el-option label="短信" value="短信"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场次类型：" prop="year">
            <el-select
              v-model="emlType"
              style="width: 500px"
              placeholder="请选择"
            >
              <el-option label="全部（未确认及已确认）" value="all">
              </el-option>
              <el-option label="未确认" value="unconfirm"> </el-option>
              <el-option label="已确认" value="confiremd"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`${noticeType}内容：`" prop="name">
            <el-input
              style="width: 500px"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="emlTxt"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emlVisible = false">取 消</el-button>
        <el-button
          :loading="loadingAccount"
          type="primary"
          @click="emlsubmitExtract()"
          >确认发送</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTable,
  expertbasicbind,
  expertbasicadd,
  expertbasicdel,
  expertbasicedit,
  expertbasicexport,
  getYearlist,
  expertreadytomatch,
  expertauditionmatch,
  exportFile,
  expertstatus,
  sendemail,
} from "@/api/interviewRound";
import plupload from "@/components/plupload";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  name: "Login",
  components: {
    plupload,
    Editor,
    Toolbar,
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      console.log(rule, value);
      let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!myreg.test(value)) {
        callback(new Error("手机号格式不正确"));
        return;
      }
      callback();
    };
    let validateNo = (rule, value, callback) => {
      let myreg = /^[0-9A-Za-z]+$/;
      if (!myreg.test(value) || value.length > 15 || value.length === 0) {
        callback(new Error("专家工号1至15位，数组或者字母"));
        return;
      }
      callback();
    };
    let validateEml = (rule, value, callback) => {
      let myreg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      if (!myreg.test(value)) {
        callback(new Error("邮箱格式不正确"));
        return;
      }
      callback();
    };
    let validatNum = (rule, value, callback) => {
      let myreg = /^[0-9]*$/;
      if (!myreg.test(value)) {
        callback(new Error("只能填写数字"));
        return;
      }
      callback();
    };
    return {
      noticeType: "邮件",
      searchYear: "",
      searchName: "",
      searchNo: "",
      yearData: [],
      powerType: sessionStorage.getItem("jd_powerType"),
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogAccountVisible: false,
      dialogMateVisible: false,
      form: {
        year: "",
        name: "",
        confirmStart: "",
        confirmEnd: "",
        interviewStart: "",
        interviewEnd: "",
        num: "",
        round_num: "",
        linkName: "",
        linkPhone: "",
        remarks: "",
        signIn: false,
        signInBegin: "",
        signInEnd: "",
      },
      message_: null,
      message1_: null,
      roleList: {},
      titleForm: "",
      rights_list: {},
      rulesAccount: {
        year: [{ required: true, message: "请选择年份", trigger: "blur" }],
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        confirmStart: [
          { required: true, message: "请选择确认开始时间", trigger: "blur" },
        ],
        confirmEnd: [
          { required: true, message: "请选择确认结束时间", trigger: "blur" },
        ],
        interviewStart: [
          { required: true, message: "请选择面试开始时间", trigger: "blur" },
        ],
        interviewEnd: [
          { required: true, message: "请选择面试结束时间", trigger: "blur" },
        ],
        num: [{ required: true, validator: validatNum, trigger: "blur" }],
        round_num: [{ required: true, validator: validatNum, trigger: "blur" }],
        linkName: [
          { required: true, message: "请填写联系人姓名", trigger: "blur" },
        ],
        linkPhone: [
          { required: true, validator: validatePhone, trigger: "blur" },
        ],
        remarks: [
          { required: false, message: "请填写备注", trigger: "change" },
        ],
      },
      loadingAccount: false,
      loginForm: {
        username: "admin",
        password: "111111",
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      tableData: [],
      mateTableData: [],
      accountId: "",
      wordVisible: false,
      word: "",
      account: "",
      mateTableSelectData: [],
      selectionObj: {},
      checkData: {},
      matchCountNum: 0,
      emlTxt: "",
      emlVisible: false,
      emlType: "all",
      editor: null,
      nda: "",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {
    goSecretaryButt(data) {
      console.log(data);
      this.$router.push({path:'/secretary/secretary',query:{round_name:data.round_name, id: data.id}});
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    emlsubmitExtract() {
      this.loadingAccount = true;
      sendemail({
        msgType: this.emlType,
        contentDetail: this.emlTxt,
        auditionId: this.checkData.audition_id,
        auditionRoundId: this.checkData.id,
        source: this.noticeType === "邮件" ? "email" : "sms",
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            this.loadingAccount = false;
            return;
          }
          this.emlTxt = "";
          this.emlType = "all";
          this.loadingAccount = false;
          this.emlVisible = false;
        })
        .catch(() => {
          this.loadingAccount = false;
        });
    },
    emlButt(data) {
      this.checkData = data;
      this.emlTxt = "";
      this.emlType = "all";
      this.loadingAccount = false;
      this.emlVisible = true;
    },
    getYearData() {
      getYearlist({})
        .then((r) => {
          this.yearData = r.data;
        })
        .catch(() => {});
    },

    batchImport(data) {
      console.log(data, "批量导入");
      this.$router.push({
        path: "/importResults",
        query: { data: JSON.stringify(data) },
      });
    },

    expertNoFun(data) {
      console.log(data);
      this.form.expertPwd = data;
    },

    searchFun() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData();
    },

    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getTableData();
    },
    currentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },

    seeAccountButt(data) {
      this.titleForm = "查看面试场次";
      this.accountId = data.id;
      this.getuserbind("Account");
    },
    editAccountButt(data) {
      this.accountId = data.id;
      this.titleForm = "编辑面试场次";
      this.getuserbind("Account");
    },
    addAccountButt(formName) {
      this.accountId = "";
      this.titleForm = "添加面试场次";
      this.form.year = "";
      this.form.name = "";
      this.form.num = "";
      this.form.confirmStart = "";
      this.form.confirmEnd = "";
      this.form.interviewStart = "";
      this.form.interviewEnd = "";
      this.form.linkPhone = "";
      this.form.linkName = "";
      this.form.remarks = "";
      this.form.round_num = "";
      this.form.signIn = false;
      this.form.signInBegin = "";
      this.form.signInEnd = "";
      this.nda = "";
      this.dialogAccountVisible = true;
    },
    cancelSubmit(formName) {
      console.log(formName);
      this.accountId = "";
      if (formName !== "") {
        this.$refs[formName].resetFields();
      }
      this.dialogAccountVisible = false;
      this.dialogMateVisible = false;
    },
    submitAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.titleForm.indexOf("添加") !== -1) {
            console.log(this.titleForm);
            this.addDataFun(formName);
          } else {
            console.log(this.titleForm);
            this.editDataFun(formName);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addDataFun(formName1) {
      this.loadingAccount = true;

      expertbasicadd({
        round_name: this.form.name,
        count_plan: Number(this.form.num),
        confirm_begin: this.form.confirmStart,
        confirm_end: this.form.confirmEnd,
        audition_begin: this.form.interviewStart,
        audition_end: this.form.interviewEnd,
        audition_id: Number(this.searchNo),
        phone: this.form.linkPhone,
        charge_man: this.form.linkName,
        memo: this.form.remarks,
        year: Number(this.form.year),
        round_num: this.form.round_num,
        sign_in: this.form.signIn ? "yes" : "no",
        sign_in_begin: this.form.signInBegin,
        sign_in_end: this.form.signInEnd,
        nda: this.nda,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            this.loadingAccount = false;
            return;
          }
          this.loadingAccount = false;
          this.dialogAccountVisible = false;
          this.account = this.form.account;
          this.$refs[formName1].resetFields();
          this.getTableData();
        })
        .catch(() => {
          this.loadingAccount = false;
        });
    },
    editDataFun(formName) {
      this.loadingAccount = true;
      expertbasicedit({
        round_name: this.form.name,
        count_plan: Number(this.form.num),
        confirm_begin: this.form.confirmStart,
        confirm_end: this.form.confirmEnd,
        audition_begin: this.form.interviewStart,
        audition_end: this.form.interviewEnd,
        audition_id: Number(this.searchNo),
        phone: this.form.linkPhone,
        charge_man: this.form.linkName,
        memo: this.form.remarks,
        year: Number(this.form.year),
        round_num: this.form.round_num,
        id: this.accountId,
        sign_in: this.form.signIn ? "yes" : "no",
        sign_in_begin: this.form.signInBegin,
        sign_in_end: this.form.signInEnd,
        nda: this.nda,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            this.loadingAccount = false;
            return;
          }
          this.loadingAccount = false;
          this.dialogAccountVisible = false;
          this.$refs[formName].resetFields();
          this.getTableData();
        })
        .catch(() => {
          this.loadingAccount = false;
        });
    },
    switchButt(data) {
      expertstatus({
        id: data.id,
        status: data.status === "已关闭" ? "已开启" : "已关闭",
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            return;
          }
          this.getTableData();
          // this.$message({
          //   message: '删除成功！',
          //   type: 'success'
          //   });
        })
        .catch(() => {});
    },
    accountDel(data) {
      expertbasicdel({
        id: data.id,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            return;
          }
          this.getTableData();
          this.$message({
            message: "删除成功！",
            type: "success",
          });
        })
        .catch(() => {});
    },
    resetSearch() {
      this.searchYear = "";
      this.searchName = "";
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    getTableData() {
      getTable({
        year: this.searchYear === "" ? 0 : Number(this.searchYear),
        audition_name: this.searchName,
        audition_id: this.searchNo === "" ? 0 : Number(this.searchNo),
        // "competent": this.searchTitle,
        // "name": this.searchName,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
        .then((r) => {
          this.tableData = r.data.list;
          this.totalPage = r.data.datacount;
        })
        .catch(() => {});
    },
    getMateTableData() {
      console.log(this.searchNo, this.accountId);
      expertreadytomatch({
        auditionId: this.searchNo === "" ? 0 : Number(this.searchNo),
        auditionRoundId: this.accountId,
      })
        .then((r) => {
          r.data.list.map((item, index) => (item.idNo = index));
          this.mateTableData = r.data.list;
        })
        .catch(() => {});
    },
    exportData() {
      expertbasicexport({
        college: this.searchFaculty,
        subject: this.searchSubject,
        competent: this.searchTitle,
        name: this.searchName,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
        .then((r) => {
          window.location.href = r.data;
        })
        .catch(() => {});
    },
    getuserbind(data) {
      expertbasicbind({
        id: this.accountId,
      })
        .then((r) => {
          this.form.year = r.data.year + "";
          this.form.name = r.data.round_name;
          this.form.num = r.data.count_plan + "";
          this.form.confirmStart = r.data.confirm_begin;
          this.form.confirmEnd = r.data.confirm_end;
          this.form.interviewStart = r.data.audition_begin;
          this.form.interviewEnd = r.data.audition_end;
          this.form.linkPhone = r.data.phone;
          this.form.linkName = r.data.charge_man;
          this.form.remarks = r.data.memo;
          this.form.round_num = r.data.round_num;
          this.form.signIn = r.data.sign_in === "yes" ? true : false;
          this.form.signInBegin = r.data.sign_in_begin;
          this.form.signInEnd = r.data.sign_in_end;
          this.nda = r.data.nda;

          if (data === "Mate") {
            this.dialogMateVisible = true;
          } else if (data === "Account") {
            this.dialogAccountVisible = true;
          }
        })
        .catch(() => {});
    },
    mateButt(data) {
      this.accountId = data.id;
      this.checkData = data;
      this.getuserbind("Mate");
      this.getMateTableData();
    },
    matchNumData(index, data, value) {
      console.log(this.selectionObj[data.idNo]);
      if (this.selectionObj[data.idNo] == undefined) {
        this.$alert("请先勾选此条数据", "提示", {
          confirmButtonText: "确定",
        });
        this.mateTableData[index].matchCount = "";
        this.matchCountNumFun();
        return;
      }
      if (!Number(value) && value !== "") {
        this.$alert("请输入数字", "提示", {
          confirmButtonText: "确定",
        });
        this.mateTableData[index].matchCount = "";
        this.matchCountNumFun();
        return;
      }
      if (Number(value) > Number(data.basicCount) + Number(data.sourceCount)) {
        this.$alert("本次抽取人数不能大于资格库人数加基础库人数的和", "提示", {
          confirmButtonText: "确定",
        });
        this.mateTableData[index].matchCount = "";
        this.matchCountNumFun();
        return;
      }
      this.selectionObj[data.idNo].matchCount =
        value === "" ? value : Number(value);
      this.mateTableData[index].matchCount =
        value === "" ? value : Number(value);
      this.matchCountNumFun();
    },
    matchCountNumFun() {
      let matchCountNum = 0;
      for (let i in this.selectionObj) {
        matchCountNum =
          Number(matchCountNum) + Number(this.selectionObj[i].matchCount);
      }
      this.matchCountNum = matchCountNum;
    },
    mateTableSelect(selection, row) {
      this.selectionObj = {};
      let selectId = [];
      this.mateTableSelectData = selection;
      this.mateTableSelectData.map((item) => {
        selectId.push(item.idNo);
        this.selectionObj[item.idNo + ""] = item;
      });
      this.mateTableData.map((item) => {
        if (selectId.indexOf(item.idNo) === -1) {
          item.matchCount = 0;
        }
      });
      this.matchCountNumFun();
    },
    mateTableSelectAll(selection) {
      this.selectionObj = {};
      let selectId = [];
      this.mateTableSelectData = selection;
      this.mateTableSelectData.map((item) => {
        selectId.push(item.idNo);
        this.selectionObj[item.idNo + ""] = item;
      });
      this.mateTableData.map((item) => {
        if (selectId.indexOf(item.idNo) === -1) {
          item.matchCount = 0;
        }
      });
      this.matchCountNumFun();
    },
    submitExtract() {
      let state = true;
      let arr = [];
      let matchCountNum = 0;
      for (let i in this.selectionObj) {
        if (
          !Number(this.selectionObj[i].matchCount) ||
          this.selectionObj[i].matchCount === ""
        ) {
          state = false;
          this.$alert("本次抽取人数不合法", "提示", {
            confirmButtonText: "确定",
          });
          break;
        }
        if (
          Number(this.selectionObj[i].matchCount) >
          Number(this.selectionObj[i].basicCount) +
            Number(this.selectionObj[i].sourceCount)
        ) {
          state = false;
          this.$alert(
            "本次抽取人数不能大于资格库人数加基础库人数的和",
            "提示",
            {
              confirmButtonText: "确定",
            }
          );
          break;
        }
        matchCountNum =
          Number(matchCountNum) + Number(this.selectionObj[i].matchCount);
        arr.push({
          college: this.selectionObj[i].college,
          collegeCode: this.selectionObj[i].collegeCode,
          matchCount: this.selectionObj[i].matchCount,
          auditionId: this.checkData.audition_id,
          auditionRoundId: this.checkData.id,
          year: Number(this.form.year),
          uid: Number(sessionStorage.getItem("jd_uid")),
        });
      }
      // if(matchCountNum > Number(this.form.num)) {
      //   this.$alert('本次抽取人数不能大于限定人数', '提示', {
      //       confirmButtonText: '确定',
      //     });
      //   return
      // }
      if (!state) return;
      expertauditionmatch(arr)
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            return;
          }
          if (r.code === 0) {
            this.dialogMateVisible = false;
          }
        })
        .catch(() => {});
    },
    planNum(data) {
      data.auditionName = this.$route.query.auditionName;
      data.searchNo = this.searchNo;
      this.$router.push({
        path: "/confirmStatus",
        query: { data: JSON.stringify(data) },
      });
    },
    exportButt(data, state) {
      console.log(data);
      exportFile({
        status: state === "0" ? "未确认" : "已确认",
        auditionRoundId: data.id,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
        .then((r) => {
          window.location.href = r.data;
        })
        .catch(() => {});
    },
  },
  beforeDestroy() {
    this.message1_.close();
  },
  //   message_
  mounted: function () {
    this.searchNo = this.$route.query.id || "";
    this.getYearData();
    this.getTableData();
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #283443;
$light_gray: #fff;
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
.role {
  height: 100%;
  background: #fff;
}
</style>