<template>
  <div id="app">
    <div class="mycontainer">
      <transition name="slide-fade">
        <template v-if="entry">
          <entry @repos-fetched="reposFetched" />
        </template>
        <template v-else>
          <repos :repos="repos" :user="user"/>
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
import entry from './components/entry.vue'
import repos from './components/repos.vue'

export default {
  name: 'App',
  components: {
    entry,
    repos
  },
  data : () => ({
    entry: true,
    repos: null,
    user: null
  }),
  methods: {
    reposFetched(data){
      this.repos = data.repos
      this.user = data.user
      this.entry = false
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  /*background: aliceblue;*/

}
.mycontainer{
  display: flex;
  justify-content: center;
  /*align-items: center;*/
  /*height: 100vh;*/
}
</style>
