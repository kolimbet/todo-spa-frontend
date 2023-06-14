<template>
  <div>
    <h3 class="text-center">Change password</h3>
    <div class="d-flex justify-content-center align-items-center min-vh-50">
      <div class="w-percent-100 mw-md">
        <template v-if="changePasswordIsCompleted">
          <div
            class="px-3 py-2 mx-auto mt-4 rounded-2 border border-green border-opacity-50 bg-green-light text-green-dark"
          >
            <div class="mb-4 text-center">
              Password change completed successfully.
            </div>

            <div class="text-center">
              <button
                @click="goUserHome"
                title="Go to the registration page"
                class="btn btn-green text-white w-24"
              >
                Ok
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- Request Error -->
          <ErrorSingle
            :is-error="requestErrorTrigger"
            :error-object="requestError"
            :reload-trigger="triggerForReloadingErrors"
            class="mb-4"
          />

          <!-- Password input -->
          <div class="mb-4">
            <label for="form-password" class="fs-sm text-secondary"
              >Password</label
            >
            <input
              v-model="form.password"
              id="form-password"
              type="password"
              class="form-control"
              placeholder="Password"
            />

            <ErrorList
              :error-list="v$.form.password.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <!-- New Password input -->
          <div class="mb-4">
            <label for="form-new-password" class="fs-sm text-secondary"
              >Password</label
            >
            <input
              v-model="form.new_password"
              id="form-new-password"
              type="password"
              class="form-control"
              placeholder="New password"
            />

            <ErrorList
              :error-list="v$.form.new_password.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <!-- New Password Repeat input -->
          <div class="mb-4">
            <label for="form-new-password-repeat" class="fs-sm text-secondary"
              >Repeat new password</label
            >
            <input
              v-model="form.new_password_repeat"
              id="form-new-password-repeat"
              type="password"
              class="form-control"
              placeholder="Repeat new password"
            />

            <ErrorList
              :error-list="v$.form.new_password_repeat.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <!-- Submit button -->
          <div class="mb-4">
            <button
              @click="changePassword"
              type="button"
              class="btn btn-blue w-percent-100 position-relative"
            >
              <span
                class="d-flex align-items-center text-light opacity-50 position-absolute top-0 bottom-0 start-0 ps-2"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ processing ? "Please wait" : "Update" }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  sameAs,
  // not,
  helpers,
} from "@vuelidate/validators";
import api from "@/api";
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";

function checkCurrentPassword(value, siblings, vm) {
  let result = {
    $valid: false,
    message: "The current password is entered incorrectly",
    extraParams: {},
  };

  // console.log(
  //   `checking validator checkCurrentPassword(${value})`,
  //   vm.v$.form.password.required
  // );

  return new Promise((resolve, reject) => {
    // canceling the check if one of the previous ones is not passed
    if (vm.v$.form.password.required.$invalid) return resolve(true);

    return api
      .checkUserPassword(value)
      .then((data) => {
        result.$valid = data;
        resolve(result);
      })
      .catch((err) => {
        console.log(`set checkCurrentPassword error message: ${err}`);
        result.message = err;
        reject(result);
      });
  });
}

function notSameAsCurrentPassword(value, siblings, vm) {
  if (value !== vm.form.password) return true;
  else return false;
}

export default {
  name: "UserChangePassword",
  components: { ErrorSingle, ErrorList },
  emits: ["changeComponent"],
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
        password: {
          required,
          checkCurrentPassword: helpers.withMessage(
            ({ $response }) => $response?.message || "Invalid Data",
            helpers.withAsync(checkCurrentPassword)
          ),
        },
        new_password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(25),
          // notCurrent: not(sameAs(() => this.form.password)),
          notCurrent: helpers.withMessage(
            "The new password must be different from the current one",
            // does not work due to a bug
            // https://github.com/vuelidate/vuelidate/issues/1125?ysclid=lamip536sp883894661
            // not(sameAs(this.form.password))
            // bag fix hook
            notSameAsCurrentPassword
          ),
        },
        new_password_repeat: {
          required,
          sameAsPassword: sameAs(this.form.new_password),
        },
      },
    };
  },
  data() {
    return {
      form: {
        password: "",
        new_password: "",
        new_password_repeat: "",
      },
      processing: false,
      triggerForReloadingErrors: true,
      requestErrorTrigger: false,
      requestError: {
        $message: "",
      },
      changePasswordIsCompleted: false,
    };
  },
  methods: {
    changePassword() {
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      this.v$.$validate().then(() => {
        // console.log("after $validate()", this.v$.form);
        if (this.v$.$invalid) {
          this.processing = false;
        } else {
          api
            .updateUserPassword(this.form)
            .then(() => {
              this.changePasswordIsCompleted = true;
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
    reloadRequestError() {
      this.reloadingErrorMessages();
      this.requestErrorTrigger = false;
    },
    reloadingErrorMessages() {
      this.triggerForReloadingErrors = !this.triggerForReloadingErrors;
    },
    goUserHome() {
      this.$emit("changeComponent", "home");
    },
  },
};
</script>
