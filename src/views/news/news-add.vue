<template>
    <div class="user-info bg_w">
        <div class="cont-btns mb15">
            <a class="bk-button bk-default bk-button-small fl" @click="$router.push('/news')" title="返回">
                <span>返回</span>
            </a>
        </div>
        <div class="wrap">
            <div class="bk-panel-body p25 cont">
                <div class="b-manage-title mb5">
                    <h5 class="fl">添加新闻</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <!-- 交互说明
                             点击修改后，把保存于取消按钮显示出来，同时把info里所有input 的 readonly 去除
                        -->
                    </div>
                </div>
                <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red">*</span>新闻标题：</label>
                        <div class="bk-form-content">
                            <el-input type="text" v-model="news.title" placeholder="请输入新闻简介"></el-input>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>新闻类型：</label>
                        <div class="bk-form-content">
                            <el-select v-model="news.category" placeholder="请选择">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="仁良业绩" value="1"></el-option>
                                <el-option label="业内资讯" value="2"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>新闻简介：</label>
                        <div class="bk-form-content">
                            <el-input type="textarea" v-model="news.brief" placeholder="请输入新闻简介"></el-input>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>新闻内容：</label>
                        <div class="bk-form-content">
                            <quill-editor ref="myTextEditor" v-model="news.content" :config="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
                            </quill-editor>
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
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
export default {
    name: 'Index',
    components: {
        'quillEditor': quillEditor
    },
    data() {
        return {
            news: {
                title: '',
                brief: '',
                content: '',
                category: ''
            },
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
                    ]
                }
            },
            listLoading: false
        }
    },
    methods: {
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
            this.news.content = html
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
                    case 'category':
                        if (data[val] === '') {
                            text = '请选着类别';
                            isOk = false;
                        }
                        break;
                    case 'brief':
                        if (data[val] === '') {
                            text = '请输入简介';
                            isOk = false;
                        }
                        break;
                    case 'content':
                        if (data[val] === '') {
                            text = '请输入内容';
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
            var reqData = {
                title: this.news.title,
                brief: this.news.brief,
                content: this.news.content,
                category: this.news.category
            }
            console.log(reqData);
            if (this.checkForm(reqData)) {
                this.$confirm('确认提创建吗？', '提示', {}).then(() => {
                    this.listLoading = true;
                    this.$http.ajaxPost({
                        url: 'news/create',
                        params: reqData
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.$router.push('/news');
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
        this.$parent.parentUrlName = "新闻管理";
        this.$parent.parentUrls = '/news';
    }
}
</script>
<style>
.bg_w {
    background: white;
    padding: 15px;
}

.in_news ul li {
    border: 1px solid #DDD;
    height: 38px;
    line-height: 38px;
    margin-bottom: 15px;
}

.in_news ul li .hint {
    float: left;
    margin: 0px 15px;
    color: #FE9802;
}

.in_news ul li .time {
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

.news-type .el-select {
    width: 100%;
}

.ql-snow .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
    position: absolute;
}
</style>