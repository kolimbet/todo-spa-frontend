<template>
  <div
    v-if="isOpen"
    class="mb-2 py-2 border border-start-0 border-end-0 border-2 border-green"
  >
    <!-- title -->
    <div class="mb-2">
      <label for="add-form-title" class="fs-sm text-secondary">Email</label>
      <textarea
        id="add-form-title"
        ref="addTitle"
        rows="3"
        name="title"
        class="form-control"
      ></textarea>
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <!-- is_completed -->
      <div class="form-check">
        <input
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
      <button type="button" class="btn lh-1 btn-green px-3 py-2">
        <i class="fa fa-floppy-o me-2" aria-hidden="true"></i>
        <span>Add task</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskCreate",
  props: {
    isOpen: Boolean,
  },
  emits: ["close"],
};
</script>
