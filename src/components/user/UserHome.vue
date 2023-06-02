<template>
  <div>
    <h3 class="text-center">UserHome</h3>
    <div
      class="pb-0-75rem mb-0-75rem border border-2 border-blue border-top-0 border-start-0 border-end-0 text-center"
    >
      <img :src="avatarLink" alt="Текущий аватар" class="w-32 mx-auto mb-1" />
      <div>
        <span class="fw-bold fs-5" title="Your login">{{ user.name }}</span>
      </div>
    </div>
    <div class="text-center">
      <div class="mb-2 text-secondary">Your tasks:</div>

      <!-- Request Error -->
      <ErrorSingle
        :is-error="requestErrorTrigger"
        :error-object="requestError"
        :reload-trigger="triggerForReloadingErrors"
        class="mb-4"
      />

      <div class="d-flex flex-wrap justify-content-center gap-4">
        <div class="text-blue">
          <span class="me-1">active:</span
          ><span class="fw-bold">{{ tasksCounter.active }}</span>
        </div>
        <div class="text-green">
          <span class="me-1">completed:</span
          ><span class="fw-bold">{{ tasksCounter.completed }}</span>
        </div>
        <div class="text-secondary">
          <span class="me-1">total:</span
          ><span class="fw-bold">{{ tasksCounter.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorSingle from "../inc/ErrorSingle.vue";

export default {
  name: "UserHome",
  components: { ErrorSingle },
  data() {
    return {
      triggerForReloadingErrors: true,
      requestErrorTrigger: false,
      requestError: {
        $message: "",
      },
    };
  },
  computed: {
    avatarLink() {
      return this.$store.getters.avatarUrl;
    },
    user() {
      return this.$store.state.user;
    },
    tasksCounter() {
      return this.$store.state.task.taskCounter;
    },
  },
  methods: {
    requestTaskCounter() {
      this.reloadingErrorMessages();
      this.requestErrorTrigger = false;
      return this.$store.dispatch("task/requestTaskCounter").catch((err) => {
        this.requestError.$message = err;
        this.requestErrorTrigger = true;
      });
    },
    reloadingErrorMessages() {
      this.triggerForReloadingErrors = !this.triggerForReloadingErrors;
    },
  },
  created() {
    this.requestTaskCounter();
  },
};
</script>
