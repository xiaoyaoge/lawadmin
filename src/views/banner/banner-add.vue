<template>
    <section v-loading="listLoading">
        <div class="cont-btns mb15">
            <a class="bk-button bk-default bk-button-small fl" @click="$router.push('/banner')" title="返回">
                <span>返回</span>
            </a>
        </div>
        <div class="info">
            <div class="bk-panel-body p25 cont">
                <div class="b-manage-title mb5">
                    <h5 class="fl">添加Banner</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <!-- 交互说明
                             点击修改后，把保存于取消按钮显示出来，同时把info里所有input 的 readonly 去除
                        -->
                        <a class="bk-button bk-success bk-button-small ml10 fr" @click="severInfo" title="保存"><span>保 存</span></a>
                    </div>
                </div>
                <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red">*</span>Banner标题：</label>
                        <div class="bk-form-content">
                            <input type="text" class="bk-form-input" v-model="form.title" placeholder="请输入banner标题">
                        </div>
                    </div>
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red"></span>跳转链接：</label>
                        <div class="bk-form-content">
                            <input type="text" class="bk-form-input" v-model="form.jumpUrl" placeholder="请输入跳转链接">
                        </div>
                    </div>
                </form>
            </div>
            <div class="cont">
                <div class="b-manage-title mb5">
                    <h5 class="fl">Banner图片</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <a class="bk-button bk-primary" @click="modifyUpload('企业营业执照','imageUrl')">{{form.imageUrl?'修改照片':'上传照片'}}</a>
                    </div>
                </div>
                <div class="row img-wrap">
                    <div>
                        <div v-if="form.imageUrl" class="img-box" style="height:468px;">
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
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg/webp/gif文件，且不超过10mb</div>
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
import md5 from 'js-md5';
import validate from '../../validate';
export default {
    data() {
        return {
            defaultImgUrl: '',
            collapsed: true,
            collapsedText: '显示更多查询条件',
            formEdit: true,
            formEditBtn: true,
            form: {
                bid: '', //id
                title: '', //banner标题
                jumpUrl: '', //跳转链接
                imageUrl: '', //图片路径
            },
            uploadTitle: '',
            uploadType: '',
            uploadVisible: false,
            dialogVisible: false,
            dialogImageUrl: '',
            uploadPolicy: {},
            uploadConfig: {
                multiple: true,
                thread: 5,
                data: {},
                accept: 'image/png,image/gif,image/jpeg,image/webp'
            },
            fileList: [],
            listLoading: false,
        }
    },
    methods: {
        editIonf(type) {
            if (type === 'edit') {
                this.formEdit = false;
                this.formEditBtn = false;
            } else {
                this.formEdit = true;
                this.formEditBtn = true;
            }
        },
        handleCurrentChange(val) {
            this.table.pageNum = val;

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
        handleChange(value) {},
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
            const isLt5M = file.size / 1024 / 1024 < 10;
            if (!isLt5M) {
                this.fileList = [];
                this.$message.error('上传图片大小不能超过 10MB!');
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
        uploadError(file, fileList) {
            this.$message({
                type: 'info',
                message: '文件上传失败'
            });
        }, 
        previewBox(title, url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        }

    },
    mounted() {
        this.$parent.parentUrlName = "首页管理";
        this.$parent.parentUrls = '/banner';

    }
}
</script>