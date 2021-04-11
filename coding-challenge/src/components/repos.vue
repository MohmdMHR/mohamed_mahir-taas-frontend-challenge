<template>
  <div class="mb-6" style="width: 1155px;">
    <section class="hero is-medium is-primary is-bold mb-6">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Get GitHub Repositories By Name</h1>
          <div class="actions">
            <input class="input" v-model="repoName" type="text" @input="onChange">
            <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
              <li v-for="(result, i) in results.map(res=>res.name)" :key="i" @click="setResult(result)" class="autocomplete-result" :class="{ 'is-active': i === arrowCounter }">
                {{ result }}
              </li>
            </ul>
            <!--            <button class="button" @click="logrepo">Search</button>-->
          </div>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="table-container">
        <table class="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>URL</th>
            <th>Language</th>
            <th>Login</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="repo in filteredRepos" v-bind:key="repo.id">
            <td>{{ repo.id }}</td>
            <td>{{ repo.name }}</td>
            <td>{{ repo.html_url }}</td>
            <td>{{ repo.language }}</td>
            <td>{{ repo.owner.login }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br>
    <br>
    <div class="table-container" v-if="showCommits">
      <h1 class="title">Commits In Repo</h1>
      <div class="select">
        <select name="slct" id="slct" @change="selectChange">
          <option selected disabled>branches</option>
          <option v-for="(branch, b) in branches" v-bind:key="b" >{{ branch.name }}</option>
        </select>
      </div>
      <table class="table is-bordered is-striped is-hoverable is-fullwidth">
        <thead>
        <tr>
          <th>Author</th>
          <th>Email</th>
          <th>Message</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(commit, c) in commits" v-bind:key="c">
          <td>{{ commit.author.name }}</td>
          <td>{{ commit.author.email }}</td>
          <td>{{ commit.message }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "repos",
  data: () => ({
    repoName: '',
    isOpen: false,
    results: [],
    search: "",
    isLoading: false,
    arrowCounter: 0,
    showCommits: false,
    commits: [],
    branches: []
  }),
  props: {
    repos: {
      type: [Array, Object],
      default: () => ([])
    },
    user: {
      type: String,
      default:  ''
    }
  },
  methods: {
    selectChange(event){
      // console.log('select', value)
      this.getCommitsByBranch(event.target.value)
    },
    setResult(result) {
      this.repoName = result;
      this.isOpen = false;
      this.getCommits(result, '')
    },
    getCommitsByBranch(branch){
      this.getCommits(this.repoName, branch)
    },
    async getBranches(repo){
      let api = 'https://api.github.com/repos/'+this.user+'/'+repo+'/branches'
      await axios.get(api).then((resp)=>{
        console.log('branches', resp);
        this.branches = resp.data
      })
    },
    async getCommits(repo, branch){
      let api = 'https://api.github.com/repos/'+this.user+'/'+repo+'/commits?sha='+branch
      await axios.get(api).then((resp)=>{
        this.commits = resp.data.map(item=>item.commit)
        this.showCommits = true
      })
      this.getBranches(repo)
    },
    onChange() {
      this.$emit("input", this.repoName);
      this.filterResults();
      this.isOpen = true;
    },
    filterResults() {
      this.results = this.repos.filter(item => {
        return item.name.toLowerCase().includes(this.repoName.toLowerCase());
      });
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  computed: {
    filteredRepos() {
      if (!this.repoName.length) {
        return this.repos
      } else {
        return this.repos.filter(repo =>
            repo.name.includes(this.repoName)
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  font: 15px/1.8 "Poppins", sans-serif !important;
}

.table td,
.table th {
  padding: 20px !important;
}
.select {
  margin-inline: auto;
  margin-block: 15px;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  outline: 0;
  box-shadow: none;
  border: 0 !important;
  background: #2c3e50;
  background-image: none;
}
/* Remove IE arrow */
select::-ms-expand {
  display: none;
}
/* Custom Select */
.select {
  position: relative;
  display: flex;
  width: 20em;
  height: 3em;
  line-height: 3;
  background: #2c3e50;
  overflow: hidden;
  border-radius: .25em;
}
select {
  flex: 1;
  padding: 0 .5em;
  color: #fff;
  cursor: pointer;
}
/* Arrow */
//.select::after {
//  content: '\25BC';
//  position: absolute;
//  top: 0;
//  right: 0;
//  padding: 0 1em;
//  background: #34495e;
//  cursor: pointer;
//  pointer-events: none;
//  -webkit-transition: .25s all ease;
//  -o-transition: .25s all ease;
//  transition: .25s all ease;
//}
/* Transition */
.select:hover::after {
  color: #f39c12;
}

.autocomplete-results{
  width: 500px;
  margin-inline: auto;
  max-height: 250px;
  height: auto;
  overflow-y: scroll;
  scroll-behavior: smooth;
  background: darkcyan;
  border-radius: 10px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  .autocomplete-result{
    &.is-active{
      background: coral;
    }
    &:hover{
      background: coral;
    }
  }
}
.actions {
  .input {
    max-width: 500px;
    margin-bottom: 10px;
    width: 100%;
    height: 30px;
    border-radius: 5px;
    //margin-inline-end: 25px;
  }

  .button {
    height: 30px;
    max-width: 120px;
    width: 100%;
    border-radius: 5px;
    background: lightblue;
    color: darkblue;
  }

}
</style>