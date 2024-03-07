<template>
  <div class="col">
    <div
      class="h-percent-100 px-2 py-2 rounded rounded-2 border border border-1 d-flex align-items-center"
      :class="[cardBorderColorClass]"
    >
      <div class="w-percent-100">
        <!-- Request Error -->
        <ErrorSingle
          :is-error="requestErrorTrigger"
          :error-object="requestError"
          :reload-trigger="triggerForReloadingErrors"
          class="mb-2"
        />

        <div class="d-flex align-items-center gap-0-75rem">
          <div
            @click="doubleClickAction('completing')"
            class="h-8 w-7 cursor-pointer"
            :class="[completeButtonColorClass]"
            :title="announceOfCompletion"
          >
            <i class="fa fa-check-circle-o fa-2x"></i>
          </div>

          <div v-if="editingTitleTrigger" class="flex-grow-1">
            <textarea
              v-model.trim="form.title"
              @keydown.enter="editingTitleEnd"
              @keydown.esc="editingTitleCancel"
              ref="editingTitle"
              rows="3"
              class="form-control w-percent-100 mb-2"
            ></textarea>

            <ErrorList
              :error-list="v$.form.title.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />

            <div
              class="mt-2 d-flex justify-content-center align-items-center gap-0-75rem"
            >
              <button
                @click="editingTitleEnd"
                type="button"
                class="btn btn-green lh-1 rounded-pill px-3 py-2"
                title="Save task title"
              >
                <i class="fa fa-floppy-o me-2" aria-hidden="true"></i>
                <span>Save</span>
              </button>
              <button
                @click="editingTitleCancel"
                type="button"
                class="btn btn-red lh-1 rounded-pill px-3 py-2"
                title="Cancel editing title"
              >
                <i class="fa fa-times-circle me-2" aria-hidden="true"></i>
                <span>Close</span>
              </button>
            </div>
          </div>
          <div
            v-else
            @click="doubleClickAction('editingTitle')"
            class="flex-grow-1"
          >
            {{ task.title
            }}<template v-if="task.end_date">
              <br />end: {{ task.end_date }}
            </template>
          </div>

          <div
            @click="doubleClickAction('deleting')"
            class="w-5 text-secondary text-red-dark-hover cursor-pointer"
          >
            <i class="fa fa-trash-o fs-4 lh-1"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseErrorObject } from "@/lib/errors.js";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";
import { DoubleClick } from "@/mixins/DoubleClick";
import { RequestErrorMessage } from "@/mixins/RequestErrorMessage";

export default {
  name: "TaskItem",
  components: { ErrorSingle, ErrorList },
  mixins: [DoubleClick, RequestErrorMessage],
  props: {
    task: Object,
  },
  setup: () => ({
    v$: useVuelidate({
      $lazy: true,
    }),
  }),
  validations() {
    return {
      form: {
        title: { required, minLength: minLength(3), maxLength: maxLength(255) },
      },
    };
  },
  data() {
    return {
      form: {
        title: "",
      },
      editingTitleTrigger: false,
      editingTransition: 1000,
    };
  },
  computed: {
    endTimeString() {
      if (this.task.is_completed)
        return new Date(this.task.end_date).toLocaleString("ru", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      else return "";
    },
    cardBorderColorClass() {
      return this.task.is_completed ? "border-green" : "border-blue";
    },
    completeButtonColorClass() {
      return this.task.is_completed
        ? "text-green text-green-dark-hover"
        : "text-blue text-blue-dark-hover";
    },
    announceOfCompletion() {
      return this.task.is_completed
        ? "Завершено (двойной клик) " + this.endTimeString
        : "Завершить задачу (двойной клик)";
    },
  },
  methods: {
    deleting() {
      if (this.processing) return;
      this.processing = true;
      this.reloadRequestError();

      this.$store
        .dispatch("task/deleteTask", this.task)
        .catch((err) => {
          this.requestError.$message = parseErrorObject(err);
          this.requestErrorTrigger = true;
        })
        .finally(() => {
          this.processing = false;
        });
    },
    completing() {
      if (this.processing) return;
      this.processing = true;
      this.reloadRequestError();

      this.$store
        .dispatch("task/completeTask", {
          id: this.task.id,
          is_completed: !this.task.is_completed,
        })
        .catch((err) => {
          this.requestError.$message = parseErrorObject(err);
          this.requestErrorTrigger = true;
        })
        .finally(() => {
          this.processing = false;
        });
    },
    editingTitle() {
      if (this.editingTitleTrigger) return false;
      this.uploadDataToForm();
      this.reloadRequestError();
      this.editingTitleTrigger = true;
      setTimeout(() => {
        this.$refs.editingTitle.focus();
      }, this.editingTransition);
    },
    editingTitleEnd() {
      if (this.processing) return;
      if (this.task.title !== this.form.title) {
        this.processing = true;
        this.reloadRequestError();

        this.v$.$validate().then(() => {
          // console.log(this.v$, this.v$.form.title);
          if (this.v$.$invalid) {
            this.processing = false;
          } else {
            this.$store
              .dispatch("task/updateTaskTitle", {
                id: this.task.id,
                title: this.form.title,
              })
              .then(() => {
                this.v$.$reset();
                this.editingTitleTrigger = false;
              })
              .catch((err) => {
                this.requestErrorTrigger = true;
                this.requestError.$message = err;
              })
              .finally(() => {
                this.processing = false;
              });
          }
        });
      } else {
        this.editingTitleTrigger = false;
      }
    },
    editingTitleCancel() {
      this.reloadRequestError();
      this.v$.$reset();
      this.editingTitleTrigger = false;
    },
    uploadDataToForm() {
      this.form.title = this.task.title;
    },
  },
  watch: {},
  mounted() {
    this.setActionList(["deleting", "completing", "editingTitle"]);
  },
};
</script>
