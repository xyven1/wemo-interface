<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
    <a class="navbar-brand">Wemo App</a>
    <button class="btn btn-info" @click="toggleInterfaceType()">Toggle Inteface Type</button>
  </nav>
  <Map v-if="mapInterface" :switches="switches" :toggle="toggle" ref="map"/>
  <div v-else class="bg-dark d-flex flex-column align-items-center justify-content-end justify-content-sm-start pt-2 pb-5" style="height: 100%">
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
import Map from './components/Map'

export default {
  name: 'App',
  components: {
    Map
  },
  data(){
    return {
      switches: null,
      mapInterface: false
    }
  },
  async mounted(){
    var vm = this
    if(localStorage.map)
      vm.mapInterface = localStorage.map == "true"
    else
      localStorage.map = vm.mapInterface  
    await axios.get(process.env.VUE_APP_URL+"/api").then((res)=>{
      vm.switches = res.data
    })
    vm.$socket.on('stateChange', (data)=>{
      vm.switches.find(s=> s.serialNumber == data.serialNumber).state = data.state
    })
  },
  methods: {
    toggleInterfaceType(){
      var vm = this
      vm.mapInterface = !vm.mapInterface
      localStorage.map = vm.mapInterface
    },
    async toggle(sw){
      console.log(sw)
      var newState
      await axios.post(process.env.VUE_APP_URL+"/api", {serialNumber: sw.serialNumber}).then((res)=>{
        if(res.data.BinaryState == "Error")
          sw.state = -1
        else
          sw.state = parseInt(res.data.BinaryState)
        newState = res.data.BinaryState
      })
      return newState
    },
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
#app, html, body {
  height:100%;
}
body{
  padding-top: 54px
}
</style>