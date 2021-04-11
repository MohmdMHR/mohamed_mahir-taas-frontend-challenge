<template>
<div class="entry-container">
<div class="first">
  <input type="text" class="input" placeholder="User name" v-model="user">
  <div class="error" v-if="error">{{errorMsg}}</div>
</div>
  <button class="button" @click="searchUsers" >Search</button>
</div>
</template>

<script>
import axios from 'axios'
export default {
name: "entry",
  data: () => ({
    error: false,
    errorMsg: '',
    user: '',
    repos: null
  }),
  computed: {
    disabled(){
      return this.user.length
    }
  },
  methods: {
    async searchUsers(){
      let api = 'https://api.github.com/users/'+this.user+'/repos'
      await axios.get(api).then((resp)=>{
        if(resp.status === 200){
          this.repos = resp.data;
          const data = {
            user: this.user,
            repos: this.repos
          }
          this.$emit('repos-fetched', data)
        }
        else{
          this.error = true;
          this.errorMsg = 'Something went wrong, please try again'
        }

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-container{
  display: flex;
  justify-content: center;
  gap: 25px;
  align-items: center;
  height: 100vh;
  //background: aliceblue;
  .first{
    display: block;
    .input{
      max-width: 250px;
      width: 100%;
      height: 30px;
      border-radius: 5px;
    }
    .error{
      color: red;
      font-size: 12px;
    }
  }
  .button{
    height: 30px;
    max-width: 120px;
    width: 100%;
    border-radius: 5px;
    background: lightblue;
    color: darkblue;
  }
}
</style>