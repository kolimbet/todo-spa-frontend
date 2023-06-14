<template>
  <div>
    <h2 class="text-center">Login Form</h2>
    <div
      class="mb-4 d-flex justify-content-center align-items-center min-vh-50"
    >
      <div class="w-percent-100 mw-md">
        <!-- Request Error -->
        <ErrorSingle
          :is-error="requestErrorTrigger"
          :error-object="requestError"
          :reload-trigger="triggerForReloadingErrors"
          class="mb-4"
        />

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

        <div class="mb-4 form-check">
          <input
            v-model="form.remember"
            id="remember-me"
            name="remember"
            type="checkbox"
            class="form-check-input"
            title="Remember me"
          />
          <label for="remember-me" class="form-check-label">Remember me</label>
        </div>

        <div class="mb-4">
          <button
            @click="login"
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
            {{ processing ? "Please wait" : "Sign in" }}
          </button>
        </div>

        <div class="mb-4 text-center">
          <RouterLink
            :to="{ name: 'register' }"
            class="text-decoration-none link-blue fw-bold"
          >
            Register new Account
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";

export default {
  name: "LoginPage",
  components: { ErrorSingle, ErrorList },
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
        email: {
          required,
          email,
        },
        password: {
          required,
        },
      },
    };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        remember: false,
      },
      processing: false,
      triggerForReloadingErrors: true,
      requestErrorTrigger: false,
      requestError: {
        $message: "",
      },
    };
  },
  methods: {
    login() {
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      this.v$.$validate().then(() => {
        if (this.v$.$invalid) {
          this.processing = false;
        } else {
          this.$store
            .dispatch("login", this.form)
            .then((userData) => {
              this.form.email = this.form.password = "";
              this.v$.$reset();
              console.log(`Вы успешно вошли как ${userData.name}`);
              this.$router.replace({ name: "home" });
            })
            .catch((err) => {
              // console.log("login() catch:", err);
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
  },
};
</script>
