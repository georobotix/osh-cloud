<template>
  <v-card flat outlined class="pa-4">
    <h2>More options for {{ config.name }}</h2>
    <v-btn small>Extension Button</v-btn>
  </v-card>
</template>

<script>

module.exports = {
  name: 'AddOn',
  components: {    
  },
  props: ['config'],
  data () {
    return {       
    }
  },
  computed: {    
  },
  methods: {
  },
  mounted() {    
  },
  destroyed() {    
  }
}
</script>

<style scoped>

</style>