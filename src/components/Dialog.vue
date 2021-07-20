<template>
  <v-dialog v-model="dialog" persistent @keydown.esc="cancel">
    <v-card :max-width="maxWidth">
      <v-card-title class="justify-center text-center">{{title}}</v-card-title>
      <v-card-text>
        <template v-if="message">
          {{message}}
        </template>
        <slot name="body" v-else></slot>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="error" variant="text" large @click="cancel">{{cancelText}}</v-btn>
        <v-btn color="success" variant="text" large @click="agree">{{agreeText}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "ConfirmDlg",
    data() {
      return {
        dialog: false,
        resolve: null,
      }
    },
    emits: ['agree', 'cancel'],
    props: {
      title: String,
      message: String,
      cancelText: {
        type: String,
        default: "Cancel",
      },
      agreeText: {
        type: String,
        default: "OK",
      },
      maxWidth: {
        type: Number,
        default: 300,
      },
    },
    methods: {
      show() {
        var vm = this
        vm.dialog = true
        return new Promise(res => vm.resolve = res);
      },
      agree() {
        this.resolve(true)
        this.$emit("agree")
        this.dialog = false
      },
      cancel() {
        this.resolve(false)
        this.$emit("cancel")
        this.dialog = false
      },
    }
  };
</script>