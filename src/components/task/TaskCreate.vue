<template>
  <div
    v-if="isOpen"
    class="mb-2 py-2 border border-start-0 border-end-0 border-2 border-green"
  >
    <!-- Request Error -->
    <ErrorSingle
      :is-error="requestErrorTrigger"
      :error-object="requestError"
      :reload-trigger="triggerForReloadingErrors"
      class="mb-2"
    />

    <!-- title -->
    <div class="mb-2">
      <label for="add-form-title" class="fs-sm text-secondary">Email</label>
      <textarea
        v-model.trim="form.title"
        id="add-form-title"
        ref="addTitle"
        rows="3"
        name="title"
        class="form-control"
      ></textarea>

      <ErrorList
        :error-list="v$.form.title.$errors"
        :reload-trigger="triggerForReloadingErrors"
      />
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <!-- is_completed -->
      <div class="form-check">
        <input
          v-model="form.is_completed"
          id="add-form-is-completed"
          type="checkbox"
          class="form-check-input"
          title="is completed"
        />
        <label for="add-form-is-completed" class="form-check-label"
          >is completed</label
        >
      </div>
      <!-- Submit button -->
      <button
        @click="addTask()"
        type="button"
        class="btn lh-1 btn-green px-3 py-2"
      >
        <i class="fa fa-floppy-o me-2" aria-hidden="true"></i>
        <span>Add task</span>
      </button>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";

export default {
  name: "TaskCreate",
  components: { ErrorSingle, ErrorList },
  props: {
    isOpen: Boolean,
  },
  emits: ["close"],
  setup() {
    return {
      v$: useVuelidate({
        $lazy: true,
      }),
    };
  },
  validations() {
    return {
      form: {
        title: { required, minLength: minLength(3), maxLength: maxLength(255) },
        is_completed: { required },
      },
    };
  },
  data() {
    return {
      form: {
        title: "",
        is_completed: false,
      },
      processing: false,
      animationTransition: 500,
      triggerForReloadingErrors: true,
      requestErrorTrigger: false,
      requestError: {
        $message: "",
      },
    };
  },
  methods: {
    reloadingErrorMessages() {
      this.triggerForReloadingErrors = !this.triggerForReloadingErrors;
    },
    clearForm() {
      this.form.title = "";
      this.form.is_completed = false;
      this.v$.$reset();
      this.requestErrorTrigger = false;
    },
    attemptClearForm() {
      if (this.processing) this.requestToClearForm = true;
      else this.clearForm();
    },
    addTask() {
      this.processing = true;
      this.reloadingErrorMessages();
      this.requestErrorTrigger = false;
      this.v$.$validate().then(() => {
        if (!this.v$.$invalid) {
          this.$store
            .dispatch("task/createTask", this.form)
            .then(() => {
              this.$emit("close");
            })
            .catch((err) => {
              this.requestErrorTrigger = true;
              this.requestError.$message = err;
            })
            .finally(() => {
              this.processing = false;
            });
        } else {
          this.processing = false;
        }
      });
    },
  },
  watch: {
    isOpen(newValue) {
      if (newValue === false) this.attemptClearForm();
      else
        setTimeout(() => {
          this.$refs.addTitle.focus();
        }, this.animationTransition);
    },
    processing(newValue) {
      if (newValue === false && this.requestToClearForm) {
        this.requestToClearForm = false;
        this.clearForm();
      }
    },
  },
};
</script>
