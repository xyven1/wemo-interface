<template>
  <div v-if="!switches">
    Loading...
  </div>
  <button v-for="(sw, index) in switches" :key="index">
    {{sw}}
  </button>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      switches: null,
    }
  },
  async mounted(){
    var vm = this
    await axios.get("http://localhost:3000/api").then((res)=>{
      vm.switches = res.data
      console.log(res)
    })
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
  margin-top: 60px;
}
</style>
