<template>
    <section v-loading="listLoading">
        <div class="cont-btns mb15">
            <a class="bk-button bk-default bk-button-small fl" title="返回" @click="$router.push('/banner')">
                <span>返回</span>
            </a>
        </div>
        <div class="info">
            <div class="bk-panel-body p25 cont">
                <div class="b-manage-title">
                    <h5 class="fl">Banner信息</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <!-- 交互说明 
                             点击修改后，把保存于取消按钮显示出来，同时把info里所有input 的 readonly 去除
                        -->
                        <a v-show="formEditBtn" class="bk-button bk-primary bk-button-small ml10 fr" @click="editIonf('edit')" title="修改"><span>修改</span></a>
                        <a v-show="!formEdit" class="bk-button bk-success bk-button-small ml10 fr" @click="severInfo" title="保存"><span>保存</span></a>
                        <a v-show="!formEdit" class="bk-button bk-default bk-button-small ml10 fr" @click="editIonf('cancel')" title="取消"><span>取消</span></a>
                    </div>
                </div>
                <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red">*</span>Banner标题：</label>
                        <div class="bk-form-content">
                            <input type="text" class="bk-form-input" v-model="form.title" placeholder="请输入banner标题" :readonly="formEdit">
                        </div>
                    </div>
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red">*</span>跳转链接：</label>
                        <div class="bk-form-content">
                            <input type="text" class="bk-form-input" v-model="form.jumpUrl" placeholder="请输入跳转链接" :readonly="formEdit">
                        </div>
                    </div>
                </form>
            </div>
            <div class="cont">
                <div class="b-manage-title mb5">
                    <h5 class="fl">Banner图片</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <a class="bk-button bk-primary" v-show="!formEdit" @click="modifyUpload('企业营业执照','imageUrl')">{{form.imageUrl?'修改照片':'上传照片'}}</a>
                    </div>
                </div>
                <div class="row img-wrap">
                    <div>
                        <div class="img-box" style="height:468px;">
                            <img :src="form.imageUrl||defaultImgUrl">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="uploadTitle" size="tiny" v-model="uploadVisible" :close-on-click-modal="false" @close="closeDebtDialog">
            <el-form ref="debtForm">
                <el-form-item>
                    <el-upload ref="upload" list-type="picture-card" :action="uploadPolicy.host" :multiple="uploadConfig.multiple" :data="uploadConfig.data" :on-success="uploadSuccess" :on-change="uploadChange" :on-error="uploadError" :on-remove="uploadRemove" :on-preview="uploadPictureCardPreview" :accept="uploadConfig.accept" :file-list="fileList" :before-upload="beforeUpload">
                        <i class="el-icon-plus"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg/webp/gif文件，且不超过5mb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="modal-footer ta-c">
                <a class="bk-button bk-default" @click="uploadVisible = false" title="点错了">确定</a>
            </div>
        </el-dialog>
        <el-dialog v-model="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </section>
</template>
<script>
import {
    regionDataPlus,
    CodeToText,
    TextToCode
} from '../../area'
import moment from 'moment'
import md5 from 'js-md5';
import validate from '../../validate';

export default {
    data() {
        return {
            defaultImgUrl: 'http://fafashe.oss-cn-shenzhen.aliyuncs.com/images/f6ea28dd98b1ddb41c627d0c64197177',
            collapsed: true,
            collapsedText: '显示更多查询条件',
            TextToCode: TextToCode,
            CodeToText: CodeToText,
            address: [' ', '', ' '],
            registerAddress: [' ', ' ', ' '],
            provinceAndCityDataPlus: regionDataPlus,
            formEdit: true,
            formEditBtn: true,
            form: {
                account: '', //帐号
                ename: '', //企业名称
                shortEname: '', //企业简称
                address: '', //办公地址
                areaCode: '',
                areaName: '',
                registerAddress: '', //登记地址
                registerAreaCode: '',
                registerAreaName: '',
                linkman: '', //联系人
                telephone: '', //联系电话 
                legalPersonIdCard: '', //法人身份证
                legalPersonName: '', //法人姓名
                licenseNumber: '', //统一社会信用代码
                taxpayerNumber: '', //纳税人识别  
                agreement2Pic: '', //企业协议2
                agreementPic: '', //企业协议1
                licensePic: '', //企业执照
                sealPic: '', //企业印章图样
                eid: 0
            },
            balanceEdit: true,
            balanceEditBtn: true,
            balanceUrl: '',
            balanceInfo: {
                uid: '', //uid  企业
                userType: 1, //1企业
                emailCount: 0, //电子信函
                letterCount: 0, //纸质信函
                smsCount: 0 //msg
            },
            uploadTitle: '',
            uploadType: '',
            uploadVisible: false,
            dialogVisible: false,
            dialogImageUrl: '',
            uploadPolicy: {
                host: ''
            },
            uploadConfig: {
                multiple: true,
                thread: 5,
                data: {},
                accept: 'image/png,image/gif,image/jpeg,image/webp'
            },
            fileList: [],
            table: {
                dataList: [],
                total: 0,
                pageSize: 10,
                pageNum: 1
            },
            listLoading: false,
        }
    },
    methods: {
        dateTime(val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        },
        editIonf(type) {
            if (type === 'edit') {
                this.formEdit = false;
                this.formEditBtn = false;
            } else {
                this.formEdit = true;
                this.formEditBtn = true;
                this.getDataList();
            }
        },
        balanceEditIonf(type) {
            if (type === 'edit') {
                this.balanceEdit = false;
                this.balanceEditBtn = false;
            } else {
                this.balanceEdit = true;
                this.balanceEditBtn = true;
            }
        }, 
        handleCurrentChange(val) {
            this.table.pageNum = val;
            this.getDataList();
        },
        getDataList() {
            let params = {};
            params = {
                bid: this.$route.params.id
            };

            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'banner/getInfo',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    let data = res.body.data.bannerInfo;
                    delete(data.password);
                    this.form = data;
                    if (res.body.data.bannerInfo) {
                        this.balanceUrl = 'banner/modify';
                    } else {
                        this.balanceUrl = 'banner/create';
                    }
                     
                    this.listLoading = false;
                });
            });
        },
        checkForm(data) { //验证担保人信息
            let isOk = true;
            let text = '';
            Object.keys(data).forEach((val) => {
                switch (val) {
                    case 'title':
                        if (data[val] === '') {
                            text = '标题不能为空';
                            isOk = false;
                        }
                        break;
                    case 'imageUrl':
                        if (data[val] === '') {
                            text = '请上传图片';
                            isOk = false;
                        }
                        break;
                }
            });
            if (!isOk) {
                this.$message.error(text);
                return false;
            }
            return true;
        },
        severInfo() {
            let params = {
                bannerInfo: this.form,
            };
            console.log(params.bannerInfo)
            if (this.checkForm(params.bannerInfo)) {
                this.$confirm('确认提创建吗？', '提示', {}).then(() => {
                    this.listLoading = true;
                    this.$http.ajaxPost({
                        url: 'banner/create',
                        params: params
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '入驻成功',
                                type: 'success'
                            });
                            this.$router.push('/banner');
                        });
                        this.listLoading = false;
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        modifyUpload(title, type) { // 初始化上传控件 
            if (type !== this.uploadType) {
                this.fileList = [];
            }
            this.$http.post('upload/getAliyunPostPolicy', {}).then((res) => {
                this.$http.aop(res, () => {
                    this.uploadPolicy = res.body.data || {};
                    this.uploadConfig.data.policy = this.uploadPolicy.policy;
                    this.uploadConfig.data.OSSAccessKeyId = this.uploadPolicy.accessid;
                    this.uploadConfig.data.signature = this.uploadPolicy.signature;

                    this.uploadTitle = title;
                    this.uploadType = type;
                    this.uploadVisible = true;
                });
            }, (res) => {
                this.$http.aop(res);
            });
        },
        closeDebtDialog() {
            this.uploadVisible = false;
        },
        uploadSuccess(response, file, fileList) { //文件长传成功  
            let url = this.uploadPolicy.host + '/' + this.uploadConfig.data.key;
            this.form[this.uploadType] = url;
        },
        beforeUpload(file) {
            let key = this.uploadPolicy.dir + '/' + md5('' + Date.now + this.uploadPolicy.uid + Math.random());
            this.uploadConfig.data.key = key;
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.fileList = [];
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            return isLt5M;
        },
        uploadRemove(file, fileList) {
            if (fileList.length > 0) { this.fileList = fileList.slice(-1); }
        },
        uploadChange(file, fileList) {
            if (fileList.length > 0) {
                this.fileList = fileList.slice(-1);
            } else {
                this.fileList = [];
            }

        },
        uploadPictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        previewBox(title, url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },
        uploadError(file, fileList) {
            this.$message({
                type: 'info',
                message: '文件上传失败'
            });
        },
        convertTextToCode(provinceText, cityText, regionText) {
            let code = ''
            if (provinceText && this.TextToCode[provinceText]) {
                const province = this.TextToCode[provinceText]
                code += province.code + ', '
                if (cityText && province[cityText]) {
                    const city = province[cityText]
                    code += city.code + ', '
                    if (regionText && city[regionText]) {
                        code += city[regionText].code
                    }
                }
            }
            return code
        },
        onSubmit() {
            this.getDataList();

        },
        handleChange(value) {}
    },
    mounted() {
        this.$parent.parentUrlName = "首页Banner管理";
        this.$parent.parentUrls = '/banner';
        //this.getDataList();
    }
}
</script>