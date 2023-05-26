<template>
  <div class="col">
    <div
      class="h-percent-100 px-2 py-2 rounded rounded-2 border border border-1 d-flex align-items-center"
      :class="[cardBorderColorClass]"
    >
      <div
        class="h-8 w-7 cursor-pointer"
        :class="[completeButtonColorClass]"
        :title="announceOfCompletion"
      >
        <i class="fa fa-check-circle-o fa-2x"></i>
      </div>
      <div class="flex-grow-1 px-2">
        {{ task.title
        }}<template v-if="task.end_date">
          <br />end: {{ task.end_date }}
        </template>
      </div>
      <div class="w-5 text-secondary text-red-dark-hover cursor-pointer">
        <i class="fa fa-trash-o fs-4 lh-1"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskItem",
  props: {
    task: Object,
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
};
</script>
