<template>
  <transition v-touch:swipe="swipeHandler" class="div-slider" :name="back? 'slideback' : 'slide'">
    <svg class="bg-dark svg" viewBox="0 0 295 515" :key="screen">
      <path v-for="(region, index) in regions?.[screen].regions" :key="index" :d="region.d" @click="selecting ? event.emit('selection', region) : toggle(region.sw)"
        style="cursor: pointer;"
        :style="{
          fill: ({ 
            0: '#DDDDDD',
            1: '#FFD300',
            2: '#17a2b8',
            'Error': 'FF0000'
          })[region.sw?.state] || '#707070'
        }">
        <title>
          {{region.title}}
        </title>
      </path>
    </svg>
  </transition>
  <div class="overlay">
    <div class="row align-items-center" style="height:100%; margin: 0;" >
      <div class="col d-none d-sm-block" >
        <BIconCaretLeft class="icon" @click="prev" v-if="screen>0"/>
      </div>
      <div class="col d-flex justify-content-center">
        <div v-if="!switches" class="spinner-border text-light p-2 mb-auto">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div class="col d-none d-sm-block">
        <BIconCaretRight class="icon float-right" @click="next" v-if="screen<regions?.length-1"/>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { EventEmitter, once } from 'events'
import { BIconCaretRight, BIconCaretLeft} from 'bootstrap-icons-vue'
export default {
  components: {
    BIconCaretRight,
    BIconCaretLeft
  },
  props: {
    toggle: Function,
    switches: Array
  },
  data(){
    return {
      regions: null,
      selecting: false,
      event: null,
      back: false,
      screen: 0,
    }
  },
  mounted(){
    var vm = this
    vm.event = new EventEmitter()
  },
  methods:{
    getSwitch(sn){
      return this.switches.find(s => s.serialNumber == sn) || null
    },
    async initialize(){ //gets region data from server
      console.log("getting regions...")
      var vm = this
      await axios.get(process.env.VUE_APP_URL+"/api/svg").then((res)=>{
        vm.regions = res.data.map(g=>{
          g.regions = g.regions.map(s=>{
            s.sw = vm.getSwitch(s.sn)
            return s
          })
          return g
        })
      })
      //vm.associateNewSwitches()
    },
    async associateNewSwitches(){ //alerts client to un associated switches, and prompts a selection
      var vm = this
      vm.selecting = true
      for(var sw of vm.switches){
        if(!vm.regions.flatMap(r=>r.regions).find(r=>r.sn == sw.serialNumber)){
          alert('Switch "' + sw.name + '" not associated with region. Click OK then select a region')
          vm.event.on('selection', (region)=>{
            region.sw = sw
            region.sn = sw.serialNumber
            axios.post(process.env.VUE_APP_URL+"/api/svg", region,)
          })
          await once(vm.event, 'selection')
          vm.event.removeAllListeners('selection')
        }
      }
      vm.selecting = false
    },
    swipeHandler(dir){
      var vm = this
      console.log(dir)
      if(dir == 'left') vm.next()
      if(dir == 'right') vm.prev()
    },next(){
      this.back = false;
      this.screen += this.screen < this.regions.length-1;
    },
    prev(){
      this.back = true;
      this.screen -= this.screen > 0
    }
  },
  computed: {
    screenName: function () {
      return this.regions?.[this.screen].name
    }
  }
}
</script>
<style>
#app{
  overflow: hidden;
}
.slide-enter-active,
.slide-leave-active,
.slideback-enter-active,
.slideback-leave-active {
  position: absolute;
  transition: .25s;
}
.icon {
  height: 3em;
  width: 3em;
  border-radius: 4px;
  background-color: #00000033;
  fill: lightgrey;
  cursor: pointer;
  pointer-events:all;
}
.overlay{
  position:absolute;
  pointer-events: none;
  top:0;
  right:0;
  width: 100%;
  height: 100%;
}

.slide-enter-to,
.slideback-enter-to {
  right: 0;
  top: -100%;
}
.slide-leave-from,
.slideback-leave-from  {
  left: 0;
}
.slide-enter-from {
  right: -100%;
  top: -100%;
}
.slide-leave-to {
  left: -100%;
}
.slideback-enter-from {
  right: 100%;
  top: -100%;
}
.slideback-leave-to {
  left: 100%;
}

.div-slider{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>