<template>
  <div class="bg-dark d-flex flex-column align-items-center justify-content-end justify-content-sm-start pt-2 pb-5" style="height: 100%">
    <div v-if="!switches" class="spinner-border text-light p-2 align-self-center mb-auto">
      <span class="sr-only">Loading...</span>
    </div>
    <div v-for="(sw, index) in switches" :key="index" class="p-1">
      <button @click="toggle(sw)" class="btn btn-lg" :class="{'btn-primary': sw.state==1, 'btn-secondary': sw.state==0, 'btn-info': sw.state==2}">
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
    })
    vm.$socket.on('stateChange', (data)=>{
      vm.switches.find(s=> s.serialNumber == data.serialNumber).state = data.state
    })
  },
  methods: {
    async toggle(sw){
      await axios.post("http://10.200.10.195:3000/api", {serialNumber: sw.serialNumber}).then((res)=>{
        sw.state = parseInt(res.data.BinaryState)
      })
    }
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
#app, html, body {
  height:100%;
}

</style>
