<template>
  <v-app>
    <v-app-bar> 
      <v-app-bar-title>
        <v-template v-if="mapInterface">{{ screenName }}</v-template>
      </v-app-bar-title>
      <v-spacer/>
      <v-btn icon @click="bind" v-if="mapInterface"><v-icon>mdi-plus</v-icon></v-btn>
      <v-btn icon @click="unbind" v-if="mapInterface"><v-icon>mdi-minus</v-icon></v-btn>
      <v-btn @click="allOff">All Off</v-btn> 
      <v-btn icon @click="toggleInterfaceType">
        <v-icon v-if="mapInterface" style="height:1.5em; width: 1.5em">mdi-card-text-outline</v-icon>
        <v-icon v-else style="height:1.5em; width: 1.5em">mdi-map</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main style="height:100%;" :style="{'overflow': mapInterface ? 'hidden' : 'auto'}" fluid > 
      <Map v-if="mapInterface" :switches="switches" :toggle="toggle" ref="map" v-model:screenName="screenName"/>
      <v-container v-else class="text-center d-block">
        <v-progress-circular class="float-middle" :size="70" :width="7" v-if="!switches" indeterminate />
        <template v-for="(sw, index) in switches?.sort((a,b) => a.name.localeCompare(b.name))" :key="index" >
          <v-btn @click="toggle(sw)" class="ma-1" :color="({0: 'btn-secondary', 1:'primary',  2: 'btn-info'})[sw.state]">
            {{sw.name}}
          </v-btn>
        </template>
      </v-container>
      <Dialog ref="allOff" title="Are you sure you want to turn off all the lights?" agreeText="Yes" cancelText="No"/>
    </v-main>
  </v-app>  
</template>

<script>
import axios from 'axios'
import Map from './components/Map.vue'
import Dialog from './components/Dialog.vue'
export default {
  name: 'App',
  components: {
    Map,
    Dialog
  },
  data(){
    return {
      switches: null,
      mapInterface: false,
      duckTemp: null,
      screenName: null,
    }
  },
  mounted(){
    var vm = this
    if(localStorage.map)
      vm.mapInterface = localStorage.map == "true"
    else
      localStorage.map = vm.mapInterface  
    axios.get(process.env.VUE_APP_URL+"/api").then(res =>{
      vm.switches = res.data
    })
    vm.$socket.on('stateChange', (data)=>{
      vm.switches.find(s=> s.serialNumber == data.serialNumber).state = data.state
    })
    vm.$socket.on('duckTemp', (data)=>{
      vm.duckTemp = data.sensor
    })
    vm.$socket.io.on('reconnect', () => {
      if(vm.mapInterface)
        location.reload()
      else
        axios.get(process.env.VUE_APP_URL+"/api").then((res)=>{
          vm.switches = res.data
        })
    })
  },
  unmounted(){
    this.$socket.off('stateChange')
  },
  methods: {
    toggleInterfaceType(){ //toggles interface, manages localStorage, and runs initialization function when switching to map
      var vm = this
      vm.mapInterface = !vm.mapInterface
      localStorage.map = vm.mapInterface
    },
    async toggle(sw){ //toggles a switch, updates switches array accordingly
      await axios.post(process.env.VUE_APP_URL+"/api", {serialNumber: sw.serialNumber}).then((res)=>{
        if(res.data.BinaryState == "Error")
          sw.state = 'Error'
        else
          sw.state = parseInt(res.data.BinaryState)
      })
    },
    async allOff(){ //turns all switches off, with confirmation
      var vm = this
      if(await vm.$refs.allOff.show())
        vm.switches.forEach(sw => {
          if(sw.state ==1)
            vm.toggle(sw)
        })
    },
    bind(){
      this.$refs.map?.associatePrompt()
    },
    unbind(){
      this.$refs.map?.dissociatePrompt()
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Raleway');
html, body, #app{
  height: 100%;
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>