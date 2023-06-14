<template>
  <Transition name="folding-y-300">
    <div
      v-if="isOpen"
      class="py-0-75rem mb-0-75rem border border-2 border-start-0 border-end-0 border-green"
    >
      <!-- Request Error -->
      <ErrorSingle
        :is-error="requestErrorTrigger"
        :error-object="requestError"
        :reload-trigger="triggerForReloadingErrors"
        class="mb-2"
      />

      <!-- Image input -->
      <div class="mb-2">
        <label for="form-image" class="d-block fs-sm text-secondary"
          >Email</label
        >
        <!-- accept="image/png, image/jpeg" -->
        <input
          @change="previewImage()"
          id="form-image"
          ref="imageAddInput"
          type="file"
          class="form-file-input"
          placeholder="Image"
        />

        <ErrorList
          :error-list="v$.form.image.$errors"
          :reload-trigger="triggerForReloadingErrors"
        />
      </div>

      <div class="text-center">
        <!-- Submit button -->
        <button
          @click="loadImage()"
          type="button"
          class="btn lh-1 btn-green px-3 py-2"
        >
          <i class="fa fa-floppy-o me-2" aria-hidden="true"></i>
          <span>{{ processing ? "Please wait" : "Load image" }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { nextTick } from "vue";
import ErrorList from "../inc/ErrorList.vue";
import ErrorSingle from "../inc/ErrorSingle.vue";

function imageCheckSize(value, siblings, vm) {
  const maxSizeMB = 1;
  const maxSizeB = maxSizeMB * 1024 * 1024;
  let result = {
    $valid: false,
    message: `The file size should not exceed ${maxSizeMB} MB`,
    extraParams: {},
  };

  if (vm.v$.form.image.required.$invalid) return true;

  if (value.size <= maxSizeB) return true;
  else return result;
}

function imageCheckType(value, siblings, vm) {
  const acceptableTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    // "image/gif",
  ];
  let result = {
    $valid: false,
    message: "Acceptable image types: jpeg, png, webp",
    extraParams: {},
  };

  if (vm.v$.form.image.required.$invalid) return true;

  if (acceptableTypes.includes(value.type)) return true;
  else return result;
}

export default {
  name: "ImageAdd",
  components: { ErrorList, ErrorSingle },
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
        image: {
          required,
          imageCheckSize: helpers.withMessage(
            ({ $response }) => $response?.message || "Invalid Data",
            imageCheckSize
          ),
          imageCheckType: helpers.withMessage(
            ({ $response }) => $response?.message || "Invalid Data",
            imageCheckType
          ),
        },
      },
    };
  },
  data() {
    return {
      form: {
        image: "",
      },
      processing: false,
      triggerForReloadingErrors: true,
      requestToClearForm: false,
      requestErrorTrigger: false,
      requestError: {
        $message: "",
      },
    };
  },
  methods: {
    loadImage() {
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      this.v$.$validate().then(() => {
        if (this.v$.$invalid) {
          this.processing = false;
        } else {
          let formData = new FormData();
          formData.append("image", this.form.image);
          formData.append("image_name", this.form.image.name);

          this.$store
            .dispatch("image/storeImage", formData)
            .then(() => {
              this.$emit("close");
            })
            .catch((err) => {
              this.requestError.$message = err;
              this.requestErrorTrigger = true;
            })
            .finally(() => {
              this.processing = false;
            });
        }
      });
    },
    previewImage() {
      this.form.image = this.$refs.imageAddInput.files[0];
    },
    attemptClearForm() {
      if (this.processing) this.requestToClearForm = true;
      else this.clearForm();
    },
    clearForm() {
      this.reloadRequestError();
      // this.$refs.imageAddInput.value = "";
      this.form.image = "";
      this.v$.$reset();
    },
    reloadRequestError() {
      this.reloadingErrorMessages();
      this.requestErrorTrigger = false;
    },
    reloadingErrorMessages() {
      this.triggerForReloadingErrors = !this.triggerForReloadingErrors;
    },
  },
  watch: {
    isOpen(newValue) {
      if (newValue === false) this.attemptClearForm();
      else {
        nextTick(() => {
          this.$refs.imageAddInput.focus();
        });
      }
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
