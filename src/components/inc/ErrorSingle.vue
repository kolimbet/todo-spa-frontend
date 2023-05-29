<template>
  <Transition name="slide-left">
    <ErrorMessage
      v-if="isError && !isHidden"
      :error="errorObject"
      @close="close()"
    />
  </Transition>
</template>

<script>
import ErrorMessage from "./ErrorMessage.vue";

export default {
  name: "ErrorSingle",
  components: { ErrorMessage },
  props: {
    isError: Boolean,
    errorObject: Object,
    reloadTrigger: Boolean,
  },
  data() {
    return {
      isHidden: false,
    };
  },
  methods: {
    close() {
      this.isHidden = true;
    },
  },
  watch: {
    reloadTrigger() {
      this.isHidden = false;
    },
  },
};
</script>
