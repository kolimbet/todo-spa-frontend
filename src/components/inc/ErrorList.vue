<template>
  <TransitionGroup name="slide-left">
    <ErrorMessage
      v-for="err in filteredErrors"
      :key="err.$uid"
      :error="err"
      @close="close(err.$uid)"
    />
  </TransitionGroup>
</template>

<script>
import ErrorMessage from "./ErrorMessage.vue";

export default {
  name: "ErrorList",
  components: { ErrorMessage },
  props: {
    errorList: Array,
    reloadTrigger: Boolean,
  },
  data() {
    return {
      areHidden: [],
    };
  },
  computed: {
    filteredErrors() {
      return this.errorList.filter((err) => !this.areHidden.includes(err.$uid));
    },
  },
  methods: {
    close(uid) {
      this.areHidden.push(uid);
    },
  },
  watch: {
    reloadTrigger() {
      this.areHidden = [];
    },
  },
};
</script>
