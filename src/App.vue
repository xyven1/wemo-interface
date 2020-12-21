<template>
  <div class="bg-dark d-flex flex-column" style="height: 100vh; width 100vh">
    <div v-if="!switches" class="text-light">
      <em>Loading...</em>
    </div>
    <div v-for="(sw, index) in switches" :key="index" class="p-1">
      <button @click="toggle(sw)" class="btn" :class="{'btn-primary': sw.state==1, 'btn-secondary': !(sw.state==1)}">
        {{sw.name}}
      </button>
    </div>
  </div>
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
    await axios.get("http://10.200.10.195:3000/api").then((res)=>{
      vm.switches = res.data
      console.log(vm.switches)
    })
    vm.$socket.on('stateChange', (data)=>{
      console.log(vm.switches.find(s=> s.serialNumber == data.serialNumber).state, data.state)
      vm.switches.find(s=> s.serialNumber == data.serialNumber).state = data.state
    })
  },
  methods: {
    async toggle(sw){
      await axios.post("http://10.200.10.195:3000/api", {serialNumber: sw.serialNumber}).then((res)=>{
        console.log(res)
      })
    }
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
