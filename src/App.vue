<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
    <a class="navbar-brand">Wemo App</a>
    <div class="d-flex">
      <button class="btn btn-info m-1" @click="allOff">All Off</button> 
      <button class="btn btn-info m-1"  @click="toggleInterfaceType">
        <BIconList v-if="mapInterface" style="height:1.5em; width: 1.5em"/>
        <BIconMap v-else style="height:1.5em; width: 1.5em"/>
      </button>
    </div>
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
import {BIconList, BIconMap} from 'bootstrap-icons-vue'
import { nextTick } from 'vue'
export default {
  name: 'App',
  components: {
    Map,
    BIconList,
    BIconMap
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
      if(vm.mapInterface) vm.$refs.map.initialize()
    })
    vm.$socket.on('stateChange', (data)=>{
      console.log(data)
      vm.switches.find(s=> s.serialNumber == data.serialNumber).state = data.state
    })
    vm.$socket.io.on('reconnect', () => {
      axios.get(process.env.VUE_APP_URL+"/api").then((res)=>{
        vm.switches = res.data
      })
    })
  },
  unmounted(){
    this.$socket.off('stateChange')
  },
  methods: {
    async toggleInterfaceType(){ //toggles interface, manages localStorage, and runs intialization function when switching to map
      var vm = this
      vm.mapInterface = !vm.mapInterface
      if(vm.mapInterface){
        await nextTick()
        vm.$refs.map.initialize()
      }
      localStorage.map = vm.mapInterface
    },
    async toggle(sw){ //toggles a switch, updates switches array accordingly
      console.log('toggling:', sw.name)
      await axios.post(process.env.VUE_APP_URL+"/api", {serialNumber: sw.serialNumber}).then((res)=>{
        if(res.data.BinaryState == "Error")
          sw.state = 'Error'
        else
          sw.state = parseInt(res.data.BinaryState)
      })
    },
    allOff(){ //turns all switches off, with confirmation
      var vm = this
      if(confirm("Are you sure you want to turn off all the lights?"))
        vm.switches.forEach(sw => {
          if(sw.state ==1)
            vm.toggle(sw)
        })
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
.btn:focus, .btn:active{
  outline: none !important;
  box-shadow: none !important;
}
</style>