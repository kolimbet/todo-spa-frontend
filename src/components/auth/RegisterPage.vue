<template>
  <div>
    <h2 class="text-center">Register User</h2>
    <div
      class="mb-4 d-flex justify-content-center align-items-center min-vh-50"
    >
      <div class="w-percent-100 mw-md">
        <div class="mb-4">
          <label for="form-name" class="fs-sm text-secondary">Name</label>
          <input
            id="form-name"
            type="email"
            class="form-control"
            placeholder="Name"
          />
        </div>

        <div class="mb-4">
          <label for="form-email" class="fs-sm text-secondary">Email</label>
          <input
            id="form-email"
            type="email"
            class="form-control"
            placeholder="Email"
          />
        </div>

        <div class="mb-4">
          <label for="form-password" class="fs-sm text-secondary"
            >Password</label
          >
          <input
            id="form-password"
            type="password"
            class="form-control"
            placeholder="Password"
          />
        </div>

        <div class="mb-4">
          <label for="form-repeat-password" class="fs-sm text-secondary"
            >Repeat password</label
          >
          <input
            id="form-repeat-password"
            type="password"
            class="form-control"
            placeholder="Repeat password"
          />
        </div>

        <div class="mb-4">
          <button
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
</template>

<script>
export default {
  name: "RegisterPage",
};
</script>
