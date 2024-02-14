<template>
  <div>
    <h2 class="text-center">Register User</h2>
    <div
      class="mb-4 d-flex justify-content-center align-items-center min-vh-50"
    >
      <div class="w-percent-100 mw-md">
        <div
          v-if="registrationIsCompleted"
          class="px-3 py-2 mx-auto mt-4 rounded-2 border border-green border-opacity-50 bg-green-light text-green-dark"
        >
          <div class="mb-4 text-center">
            Registration completed successfully. Тow log in using the entered
            email and password
          </div>

          <div class="text-center">
            <button
              @click="goLoginPage"
              title="Go to the login page"
              class="btn btn-green text-white w-24"
            >
              Ok
            </button>
          </div>
        </div>
        <div v-else>
          <!-- Request Error -->
          <ErrorSingle
            :is-error="requestErrorTrigger"
            :error-object="requestError"
            :reload-trigger="triggerForReloadingErrors"
            class="mb-4"
          />

          <!-- Name input -->
          <div class="mb-4">
            <label for="form-name" class="fs-sm text-secondary">Name</label>
            <input
              v-model="form.name"
              id="form-name"
              type="email"
              class="form-control"
              placeholder="Name"
            />

            <ErrorList
              :error-list="v$.form.name.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <!-- Email input -->
          <div class="mb-4">
            <label for="form-email" class="fs-sm text-secondary">Email</label>
            <input
              v-model="form.email"
              id="form-email"
              type="email"
              class="form-control"
              placeholder="Email"
            />

            <ErrorList
              :error-list="v$.form.email.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

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

          <!-- Password Repeat input -->
          <div class="mb-4">
            <label for="form-repeat-password" class="fs-sm text-secondary"
              >Repeat password</label
            >
            <input
              v-model="form.password_repeat"
              id="form-repeat-password"
              type="password"
              class="form-control"
              placeholder="Repeat password"
            />

            <ErrorList
              :error-list="v$.form.password_repeat.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <!-- Submit button -->
          <div class="mb-4">
            <button
              @click="register"
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
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  email,
  sameAs,
  maxLength,
  helpers,
} from "@vuelidate/validators";
import api from "@/api.js";
import { parseErrorObject } from "@/lib/errors.js";
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";
import { RequestErrorMessage } from "@/mixins/RequestErrorMessage";

function nameIsFree(value, siblings, vm) {
  let result = {
    $valid: false,
    message: "This name is already being used by another user",
    extraParams: {},
  };
  // console.log("nameIsFree", vm.v$.form.name);
  return new Promise((resolve, reject) => {
    // canceling the check if one of the previous ones is not passed
    if (
      vm.v$.form.name.required.$invalid ||
      vm.v$.form.name.minLength.$invalid ||
      vm.v$.form.name.maxLength.$invalid
    )
      resolve(true);
    else
      api
        .nameIsFree(value)
        .then((data) => {
          result.$valid = data;
          resolve(result);
        })
        .catch((err) => {
          console.log(`set nameIsFree error message: ${err}`);
          result.message = err;
          reject(result);
        });
  });
}

function emailIsFree(value, siblings, vm) {
  let result = {
    $valid: false,
    message: "This email is already being used by another user",
    extraParams: {},
  };
  // console.log("emailIsFree", vm.v$.form.email);
  return new Promise((resolve, reject) => {
    // canceling the check if one of the previous ones is not passed
    if (vm.v$.form.email.required.$invalid || vm.v$.form.email.email.$invalid)
      return resolve(true);
    else
      api
        .emailIsFree(value)
        .then((data) => {
          result.$valid = data;
          resolve(result);
        })
        .catch((err) => {
          console.log(`set emailIsFree error message: ${err}`);
          result.message = err;
          reject(result);
        });
  });
}

export default {
  name: "RegisterPage",
  components: { ErrorSingle, ErrorList },
  mixins: [RequestErrorMessage],
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
        name: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(50),
          isFree: helpers.withMessage(
            ({ $response }) => $response?.message || "Invalid Data",
            helpers.withAsync(nameIsFree)
          ),
        },
        email: {
          required,
          email,
          isFree: helpers.withMessage(
            ({ $response }) => $response?.message || "Invalid Data",
            helpers.withAsync(emailIsFree)
          ),
        },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(25),
        },
        password_repeat: {
          required,
          sameAsPassword: sameAs(this.form.password),
        },
      },
    };
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        password_repeat: "",
      },
      registrationIsCompleted: false,
    };
  },
  methods: {
    register() {
      // console.log("register");
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      this.v$.$validate().then(() => {
        if (this.v$.$invalid) {
          this.processing = false;
        } else {
          api
            .register(this.form)
            .then(() => {
              this.registrationIsCompleted = true;
            })
            .catch((err) => {
              this.requestError.$message = parseErrorObject(err);
              this.requestErrorTrigger = true;
            })
            .finally(() => {
              this.processing = false;
            });
        }
      });
    },
    goLoginPage() {
      this.$router.replace({ name: "login" });
    },
  },
};
</script>
