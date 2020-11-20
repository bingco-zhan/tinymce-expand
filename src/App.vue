<template>
  <div id="app">
    <TinymceEditor />
  </div>
</template>

<script>
import TinymceEditor from './components/TinymceEditor.vue'

export default {
  name: 'App',
  components: {
    TinymceEditor
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  padding: 5px;
  height: calc(100% - 10px);
}
</style>
