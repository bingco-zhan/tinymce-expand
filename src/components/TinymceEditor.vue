<template>
  <table style="height: 100%; width: 100%">
    <tr>
      <td>
        <editor ref="editor" :init="{
          base_url: '/tinymce',
          height: '100%',
          plugins: 'link lists image code field table wordcount preview template',
          toolbar:'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | table removeformat template | \
           alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | \
           link unlink image code | undo redo',
          branding: true,
          init_instance_callback: init,
          templates: []
        }" v-model="content" />
      </td>
      <td>
        <div v-show="initialize" class="editor-props">
          <div title="主表" class="main-field">
            <a :title="`${item.name} [${item.field}]`" v-for="(item, index) in info.main"
               :class="{'main-field-item':true, 'main-field-item_selected': selected === item.field}"
               :key="index"
               @click="selected = item.field"
               @dblclick="insertField(item)">
              {{item.name}}
            </a>
          </div>
          <div v-if="info.item && info.item[selected]" title="明细表" class="main-item-field">
            <a :title="`${item.name} [${item.field}]`" v-for="(item, index) in info.item[selected]" class="main-item-field-item"
               :key="index"
               @dblclick="insertField(item, true)">
              {{item.name}}
            </a>
          </div>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios'

export default {
  name: 'TinymceEditor',
  props: {
    msg: String
  },
  data() {
    return {
      initialize: false,
      content: '',
      info: {},
      selected: ''
    }
  },
  components: {
    Editor
  },
  methods: {
    init() {
      this.initialize = true
      this.mainInfo()
    },
    mainInfo() {
      axios.post('/mainInfo').then(res => {
        const {code, data} = res.data
        if (code === 200) {
          this.info = data
        }
      })
    },
    insertField(data, ischild) {
      if(!data.child) {
        this.$refs.editor.editor.execCommand('mceUpdateField', false, {...data, ischild})
      }
    }
  },
  created() {
  }
}
</script>

<style scoped>
.editor-props {
  width: 230px;
  height: 100%;
  border: 1px solid #cccccc;
}

.main-field, .main-item-field {
  height: 200px;
  border: 1px solid #cccccc;
  margin: 25px 15px 10px 15px;
  overflow-y: auto;
}

*::-webkit-scrollbar {
  width: 3px;
}

*::-webkit-scrollbar-track {
  background-color: #cccccc;
}

*::-webkit-scrollbar-thumb {
  background-color: #989898;
}

.main-field::before {
  content: attr(title);
  position: absolute;
  top: 15px;
  font-size: 10px;
  z-index: 100;
}

.main-item-field::before {
  content: attr(title);
  position: absolute;
  top: 243px;
  font-size: 10px;
}

.main-field-item, .main-item-field-item {
  display: block;
  border: 1px solid #cccccc;
  margin: 4px;
  padding: 3px 5px;
  font-size: 12px;
  cursor: pointer;
}

.main-field-item:active, .main-item-field-item:active {
  border: 1px solid #a7a7a7;
}

.main-field-item:hover, .main-item-field-item:hover {
  background-color: gainsboro;
}

.main-field-item_selected {
  background-color: gainsboro;
  padding: 3px 5px 2px 5px;
  border-bottom: 2px solid #9b9b9b;
}
</style>
