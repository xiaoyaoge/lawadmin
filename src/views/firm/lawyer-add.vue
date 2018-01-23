<template>
    <div class="user-info bg_w">
        <div class="cont-btns mb15">
            <a class="bk-button bk-default bk-button-small fl" @click="$router.push('/lawyer')" title="返回">
                <span>返回</span>
            </a>
        </div>
        <div class="wrap">
            <div class="bk-panel-body p25 cont">
                <div class="b-manage-title mb5">
                    <h5 class="fl">添加律师</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <!-- 交互说明
                             点击修改后，把保存于取消按钮显示出来，同时把info里所有input 的 readonly 去除
                        -->
                    </div>
                </div>
                <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red">*</span>律师名称：</label>
                        <div class="bk-form-content">
                            <el-input type="text" v-model="lawyer.name" placeholder="请输入律师名称"></el-input>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>律师标签：</label>
                        <div class="bk-form-content">
                            <el-input type="textarea" v-model="lawyer.title" placeholder="请输入律师标签（如：清华大学研究生，刑法专家）"></el-input>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>律师头像：</label>
                        <div class="bk-form-content">
                            <div class="img-box" style="height:80px; width:100px; margin-bottom:0;">
                                <img :src="(lawyer.avatar||defaultImgUrl)+'?x-oss-process=image/resize,w_100,h_80/auto-orient,1/quality,q_90'">
                            </div>
                            <a class="bk-button bk-primary" @click="modifyUpload('用户头像','avatar')">{{lawyer.avatar?'修改照片':'上传照片'}}</a>
                        </div>
                    </div>
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red">*</span>新闻排序：</label>
                        <div class="bk-form-content">
                            <el-input type="text" v-model="lawyer.sort" placeholder="请输入数字"></el-input>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>律师简介：</label>
                        <div class="bk-form-content">
                            <editor ref="myTextEditor" :fileName="'myFile'" :canCrop="canCrop" v-model="lawyer.introduction"></editor>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label">&nbsp;</label>
                        <div class="bk-form-content">
                            <el-button type="primary" @click.native="doSave">提交</el-button>
                        </div>
                    </div>
                </form>
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
    </div>
</template>
<script>
import editor from '../../commons/Quilleditor.vue'
import md5 from 'js-md5'
export default {
    name: 'Index',
    components: {
        editor
    },
    data() {
        return {
            canCrop: false,
            listLoading: false,
            defaultImgUrl: 'http://fafashe.oss-cn-shenzhen.aliyuncs.com/images/f6ea28dd98b1ddb41c627d0c64197177',
            lawyer: {
                avatar: '',
                title: '',
                introduction: "",
                name: '',
                top: 0,
                sort: 0
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
            editorOption: {
                theme: 'snow',
                placeholder: "输入任何内容，支持html",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    imageStyles: {
                        class1: 'Class 1',
                        class2: 'Class 2'
                    },
                    imageEditButtons: ['imageAlign', 'imageInfo', 'imageRemove']
                }
            }
        }
    },
    methods: {
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
            this.lawyer[this.uploadType] = url;
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
        uploadError(file, fileList) {
            this.$message({
                type: 'info',
                message: '文件上传失败'
            });
        },
        previewBox(title, url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },
        onEditorBlur(editor) {
            console.log('editor blur!', editor)
        },
        onEditorFocus(editor) {
            console.log('editor focus!', editor)
        },
        onEditorReady(editor) {
            console.log('editor ready!', editor)
        },
        onEditorChange({ editor, html, text }) {
            console.log('editor change!', editor, html, text)
            this.lawyer.content = html
        },
        checkForm(data) { //验证担保人信息
            let isOk = true;
            let text = '';
            Object.keys(data).forEach((val) => {
                switch (val) {
                    case 'title':
                        if (data[val] === '') {
                            text = '标签不能为空';
                            isOk = false;
                        }
                        break;
                    case 'name':
                        if (data[val] === '') {
                            text = '请输入律师姓名';
                            isOk = false;
                        }
                        break;
                    case 'avatar':
                        if (data[val] === '') {
                            text = '请上传律师头像';
                            isOk = false;
                        }
                        break;
                    case 'sort':
                        if (!validate.checkNum(data[val])) {
                            text = '排序只能输入整数数字';
                            isOk = false;
                        }
                        break;
                    case 'introduction':
                        if (data[val] === '') {
                            text = '请输入律师简介';
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
        doSave() {
            let that = this
            let url = '/lawyer/add'
            var reqData = {
                avatar: this.lawyer.avatar,
                title: this.lawyer.title,
                introduction: this.lawyer.introduction,
                name: this.lawyer.name
            }
            console.log(reqData);

            if (this.checkForm(reqData)) {
                this.$confirm('确认添加吗？', '提示', {}).then(() => {
                    this.listLoading = true;
                    this.$http.ajaxPost({
                        url: 'lawyer/create',
                        params: reqData
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.$router.push('/lawyer');
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

        }
    },
    mounted() {
        this.$parent.parentUrlName = "律师管理";
        this.$parent.parentUrls = '/lawyer';
    }
}
</script>
<style>
.bg_w {
    background: white;
    padding: 15px;
}

.in_lawyer ul li {
    border: 1px solid #DDD;
    height: 38px;
    line-height: 38px;
    margin-bottom: 15px;
}

.in_lawyer ul li .hint {
    float: left;
    margin: 0px 15px;
    color: #FE9802;
}

.in_lawyer ul li .time {
    float: right;
    margin-right: 15px;
    color: #666;
    font-size: 12px;
}

.user-info {
    .wrap {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 20px;
        color: #666;
    }
}

.ql-container .ql-editor {
    min-height: 20em;
    padding-bottom: 1em;
    max-height: 25em;
}

.lawyer-type .el-select {
    width: 100%;
}

.ql-snow .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
    position: absolute;
}

.class1 {
    border-radius: 10%;
    border: 2px solid #efefef;
}

.class2 {
    opacity: 0.5;
}
</style>