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
        <v-icon v-if="mapInterface">mdi-card-text-outline</v-icon>
        <v-icon v-else>mdi-map</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main style="height:100%;" :style="{'overflow': mapInterface ? 'hidden' : 'auto'}" fluid> 
      <Map v-if="mapInterface" ref="map" v-model:screenName="screenName"/>
      <ListOfButtons v-else ref="list"/>
      <Dialog ref="allOff" title="Are you sure you want to turn off all the lights?" agreeText="Yes" cancelText="No"/>
    </v-main>
  </v-app>
</template>

<script>
import Map from './components/Map.vue'
import Dialog from './components/Dialog.vue'
import ListOfButtons from './components/ListOfButtons.vue'
export default {
  name: 'App',
  components: {
    Map,
    Dialog,
    ListOfButtons
  },
  data(){
    return {
      mapInterface: false,
      screenName: null,
    }
  },
  mounted(){
    var vm = this
    if(localStorage.map)
      vm.mapInterface = localStorage.map == "true"
    else
      localStorage.map = vm.mapInterface
    vm.$socket.io.on('reconnect', () => {
      location.reload()
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
html, body, #app{
  height: 100%;
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>