<template>
  <transition @wheel="onScroll" v-touch="{left: () => swipeHandler('left'), right: () => swipeHandler('right')}" class="div-slider" :name="back? 'slideback' : 'slide'">
    <svg viewBox="0 0 295 515" :key="screen">
      <image v-if="svg?.[screen].background" width="295" height="515" x="0" y="0" :xlink:href="require(`../assets/${svg[screen].background.name}`)"/> 
      <path v-for="(region, index) in svg?.[screen].regions" :key="index" :d="region.d" @click="selecting ? event.emit('selection', region) : toggle(region.sw)"
        style="cursor: pointer; stroke: transparent"
        :style="{
          fill: selecting ? 
            region.sn ? '#FC8C00'
              : '#707070'
          :({ 
            0: '#DDDDDD',
            1: '#FFD300',
            2: '#17a2b8',
            'Error': 'FF0000'
          })[region.sw?.state] || '#707070',
          'stroke-width': region.stroke??0,
        }">
        <title>
          {{region.title}}
        </title>
      </path>
    </svg>
  </transition>
  <div class="overlay">
    <v-row class="row" align="center" style="height:100%; margin: 0;">
      <v-col cols="1">
        <v-btn v-show="screen>0  && !mobile" icon class="interactable" @click="prev">
          <v-icon size="x-large">mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-progress-circular class="float-middle" :size="70" :width="7" v-if="!switches" indeterminate />
      </v-col>
      <v-col cols="1">
        <v-btn v-show="screen<svg?.length-1 && !mobile" @click="next" icon class="interactable float-right">
          <v-icon size="x-large">mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <Dialog ref="addDialog" agreeText="Continue" title="Choose Switch To Associate" :maxWidth="500" @cancel="selectedSwitch = null" @agree="associateSwitch(selectedSwitch); selectedSwitch = null; ">
    <template v-slot:body>
      <div class="text-center ma-2">
        <v-btn class="ma-1" :color="selectedSwitch == sw ? 'primary' : ''" variant="outlined" v-for="sw in switches.filter(sw=>!svg.flatMap(r=>r.regions).find(r=>r.sn == sw.serialNumber))" :key="sw" @click="selectedSwitch = sw">
          {{sw.name}}
        </v-btn>
      </div>
    </template>
  </Dialog>
  <Dialog ref="removeDialog" agreeText="Continue" title="Dissociate Region" message="Select a region to clear" @agree="dissociateSwitch"/>
</template>
<script>
import axios from 'axios'
import Dialog from '../components/Dialog'
import { EventEmitter, once } from 'events'
import { useDisplay } from 'vuetify/lib/composables/display'
export default {
  components: {
    Dialog,
  },
  props: {
    toggle: Function,
    switches: Array,
    screenName: String,
  },
  data(){
    return {
      svg: null,
      selecting: false,
      event: null,
      back: false,
      screen: 1,
      selectedSwitch: null,
      timeOut: null,
    }
  },
  async mounted(){
    var vm = this
    if(localStorage.screen) vm.screen = parseInt(localStorage.screen)
    else localStorage.screen = vm.screen
    vm.event = new EventEmitter()
    axios.get(process.env.VUE_APP_URL+"/api/svg").then(res=>{vm.svg = res.data; if(vm.switches) vm.initialize()})
  },
  methods:{
    getSwitch(sn){
      return this.switches.find(s => s.serialNumber == sn) || null
    },
    onScroll(e){
      var vm = this
      if(!vm.timeOut){
        if(e.deltaY < 0) vm.next()
        else vm.prev()
        vm.timeOut = setTimeout(()=>vm.timeOut = null, 250)
      }
    },
    initialize(){ //associates regions with switches
      console.log("intializing state...")
      var vm = this
      vm.svg.forEach(r=>{
        r.regions.forEach(s=>{
          s.sw = vm.getSwitch(s.sn)
        })
      })
      vm.$emit('update:screenName', vm.svg?.[vm.screen].name)
    },
    associatePrompt(){
      this.$refs.addDialog.show()
    },
    dissociatePrompt(){
      this.$refs.removeDialog.show()
    },
    async associateSwitch(sw){ //alerts client to un associated switches, and prompts a selection
      var vm = this
      vm.selecting = true
      vm.event.on('selection', (region)=>{
        region.sw = sw
        region.sn = sw.serialNumber
        axios.post(process.env.VUE_APP_URL+"/api/svg", region)
      })
      await once(vm.event, 'selection')
      vm.event.removeAllListeners('selection')
      vm.selecting = false
    },
    async dissociateSwitch(){
      var vm = this
      vm.selecting = true
      vm.event.on('selection', (region)=>{
        delete region.sw
        region.sn = ""
        axios.post(process.env.VUE_APP_URL+"/api/svg", region)
      })
      await once(vm.event, 'selection')
      vm.event.removeAllListeners('selection')
      vm.selecting = false
    },
    swipeHandler(dir){
      var vm = this
      console.log(dir)
      if(dir == 'left') vm.next()
      if(dir == 'right') vm.prev()
    },
    next(){
      this.back = false;
      this.screen += this.screen < this.svg.length-1;
    },
    prev(){
      this.back = true;
      this.screen -= this.screen > 0
    }
  },
  computed: {
    mobile: function () {
      return useDisplay().mobile.value
    }
  },
  watch: {
    screen: function (n){
      localStorage.screen = n;
      this.$emit('update:screenName', this.svg?.[n].name)  
    },
    switches: function (){
      this.initialize()
    }
  }
}
</script>
<style>
.slide-enter-active,
.slide-leave-active,
.slideback-enter-active,
.slideback-leave-active {
  position: absolute !important;
  transition: .25s;
}

.div-slider{
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.overlay{
  position:absolute;
  pointer-events: none;
  top:0;
  right:0;
  width: 100%;
  height: 100%;
}
.overlay .interactable{
  cursor: pointer;
  pointer-events:all;
}
.slide-enter-to,
.slideback-enter-to {
  right: 0;
}
.slide-leave-from,
.slideback-leave-from  {
  left: 0;
}
.slide-enter-from {
  right: -100%;
}
.slide-leave-to {
  left: -100%;
}
.slideback-enter-from {
  right: 100%;
}
.slideback-leave-to {
  left: 100%;
}
</style>