<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>

import plugins from './plugins';
import toolbar from './toolbar';
import { post } from '@/api/common';
const tinymceCDN = 'tinymce5.51/tinymce.min.js';
export default {
  name: 'Tinymce',
  props: {
    lookPath: {
      type: String,
      default: ''
    },
    imgUploadPath: {
      type: String,
      default: ''
    },
    fileUploadPath: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default: () => []
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    maxHeight: {
      type: [Number, String],
      required: false,
      default: 600
    },
    manual: { type: Boolean, default: false },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      defaultVal: false,
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    }
  },
  watch: {
    /* 每次打开编辑器时初始化内容开关 || 手动填充内容开关*/
    manual(val) {
      this.defaultVal = !!val;
    },
    value(val) {
      if (this.defaultVal || (!this.hasChange && this.hasInit)) {
        this.defaultVal = false;
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''));
      }
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    init() {
      this.scriptFun(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message);
          return;
        }
        this.initTinymce();
      });
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        max_height: this.maxHeight,
        body_class: 'panel-body',
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        font_formats: '微软雅黑=Microsoft YaHei;宋体=simsun;黑体=SimHei;仿宋=FangSong;楷体=KaiTi;', // 字体
        fontsize_formats: '12px 14px 16px 18px 20px 24px 36px 48px', // 字号
        style_formats: [ // 自定义格式
          { title: '首行缩进', block: 'p', styles: { 'text-indent': '2em' }}
        ],
        style_formats_merge: true, // 自定义个附加到原菜单
        elementpath: false, // 隐藏底栏的元素路径
        branding: false, // 隐藏技术支持
        toolbar_mode: 'sliding', // 工具栏模式
        end_container_on_empty_block: false, // 如果在空的内部块元素中按下Enter键，则可以使用此选项拆分当前容器块元素
        powerpaste_word_import: 'merge', // 此设置控制如何过滤从Microsoft Word粘贴的内容(merge保留原数据结构和样式)
        powerpaste_html_import: 'propmt', // propmt, merge, clear
        powerpaste_allow_local_images: true, // 设置true为时，粘贴后将不会删除在复制内容中使用数据URI的Base64编码图像。
        powerpaste_keep_unsupported_src: true,
        paste_preprocess: function(pluginApi, data) { // 自定义筛选
        },
        autosave_ask_before_unload: false, // 当关闭或跳转URL时，弹出提示框提醒用户仍未保存变更内容。默认开启提示。
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square', // 无序列表项标记
        advlist_number_styles: 'default', // 有序列表项标记
        imagetools_cors_hosts: ['yangujituan.com'], // 图片来源跨域白名单
        default_link_target: '_blank', // 链接target属性默认值
        link_title: false, // 链接标题
        nonbreaking_force_tab: true, // 可以使用tab键创建3个空格
        init_instance_callback: editor => { // 编辑器实例初始化时执行指定函数
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true;
            this.$emit('input', editor.getContent());
          });
        },
        setup(editor) { // 渲染TinyMCE编辑器实例之前执行的回调
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state;
          });
        },
        file_picker_types: 'file image media', // 文件上传类型
        images_upload_handler: _this.customImageUpload, // 自定义的图片上传
        file_picker_callback: function(callback, value, meta) { // 所有文件上传事件(在所有上传input旁边新增一个上传按钮)
          var filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4';
          filetype = meta.filetype;
          let path = _this.imgUploadPath;
          const input = document.createElement('input');
          var formData = new FormData();
          formData.append('source', 'gonhui');
          input.setAttribute('type', 'file');
          input.onchange = function() {
            const file = this.files[0];
            formData.append('file', file, file.name);
            switch (meta.filetype) {
              case 'image':
                filetype = 'image/*';
                input.setAttribute('accept', filetype);
                post(path, formData).then(res => {
                  const fullPath = _this.lookPath ? _this.lookPath + res.data.imgPath : res.data.imgPath;
                  callback(fullPath);
                }).catch(() => {
                  _this.$message.error('上传失败请联系管理员!');
                });
                break;
              case 'media':
                filetype = '.mp3, .mp4';
                input.setAttribute('accept', filetype);
                path = _this.fileUploadPath;
                _this.filUploadFun(callback, path, formData);
                break;
              case 'file':
                path = _this.fileUploadPath;
                input.setAttribute('accept', filetype);
                _this.filUploadFun(callback, path, formData);
                break;
              default:
                _this.message.error('操作失败');
                break;
            }
          };
          input.click();
        },
        convert_urls: false // 自动转换URL
      });
    },
    scriptFun(src, callback) {
      let callbacks = [];
      const existingScript = document.getElementById(src);
      const cb = callback || function() {};
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = src; // src url for the third-party library being loaded.
        script.id = src;
        document.body.appendChild(script);
        callbacks.push(cb);
        const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd;
        onEnd(script);
      }
      if (existingScript && cb) {
        if (window.tinymce) {
          cb(null, existingScript);
        } else {
          callbacks.push(cb);
        }
      }

      function stdOnEnd(script) {
        script.onload = function() {
          this.onerror = this.onload = null;
          for (const cb of callbacks) {
            cb(null, script);
          }
          callbacks = null;
        };
        script.onerror = function() {
          this.onerror = this.onload = null;
          cb(new Error('Failed to load ' + src), script);
        };
      }

      function ieOnEnd(script) {
        script.onreadystatechange = function() {
          if (this.readyState !== 'complete' && this.readyState !== 'loaded') return;
          this.onreadystatechange = null;
          for (const cb of callbacks) {
            cb(null, script); // there is no way to catch loading errors in IE8
          }
          callbacks = null;
        };
      }
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen');
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    filUploadFun(callback, path, formData) {
      post(path, formData).then(res => {
        const fullPath = this.lookPath ? this.lookPath + res.data.filePath : res.data.filePath;
        callback(fullPath);
      }).catch(error => {
        console.log(error);
        this.$message.error('上传失败请联系管理员!');
      });
    },
    customImageUpload(blobInfo, succFun, failFun) {
      const _this = this;
      const formData = new FormData();
      const file = blobInfo.blob();// 转化为易于理解的file对象
      // 直接复制粘贴的word文档图片上传和普通上传图片有所区别,没有是一个blob对象
      formData.append('source', 'gonhui');
      formData.append('file', file);
      post(_this.imgUploadPath, formData).then(res => {
        const fullPath = _this.lookPath ? _this.lookPath + res.data.imgPath : res.data.imgPath;
        succFun(fullPath);
      }).catch(error => {
        console.log(error);
        _this.$message.error('上传失败请联系管理员!');
      });
    }
  }
};
</script>

<style lang="scss">
  .tox.tox-silver-sink.tox-tinymce-aux {
    z-index: 10000 !important;
  }
</style>
<style lang="scss" scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container {
    ::v-deep {
      .mce-fullscreen {
        z-index: 10000;
      }
      .editor-custom-btn-container {
        z-index: 100010;
      }
    }
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
