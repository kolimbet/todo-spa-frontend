<template>
  <div class="">
    <h2 class="text-center">Your task List</h2>

    <TaskFilter />

    <div class="clearfix mb-0">
      <div class="float-start mb-2 me-2">
        <button
          v-if="page > 1"
          @click="goPrevPage()"
          type="button"
          class="btn lh-1 btn-blue rounded-pill px-3 py-2"
        >
          Назад
        </button>
        <span class="px-3 py-2 text-blue-dark"
          >page: <strong>{{ page }}</strong> / {{ totalPages }}</span
        >
        <button
          v-if="hasNextPage"
          @click="goNextPage()"
          type="button"
          class="btn lh-1 btn-blue rounded-pill px-3 py-2"
        >
          Вперёд
        </button>
      </div>

      <div class="float-end mb-2">
        <button
          v-if="addFormIsOpen"
          @click="toggleAddForm()"
          type="button"
          class="btn lh-1 btn-red rounded-pill px-3 py-2"
          title="Close add form"
        >
          <i class="fa fa-times-circle me-1" aria-hidden="true"></i>
          <span>Close</span>
        </button>
        <button
          v-else
          @click="toggleAddForm()"
          type="button"
          class="btn lh-1 btn-green rounded-pill px-3 py-2"
          title="Add new task"
        >
          <i class="fa fa-plus-circle me-1" aria-hidden="true"></i>
          <span>Add</span>
        </button>
      </div>
    </div>

    <!-- add form -->
    <TaskCreate :is-open="addFormIsOpen" @close="closeAddForm()" />

    <div
      v-if="tasks.length"
      class="mt-0 row row-cols-1 row-cols-lg-2 gx-0-75rem gy-0-75rem"
    >
      <TaskItem v-for="task in paginatedTasks" :key="task.id" :task="task" />
    </div>
    <div v-else-if="hasTasks" class="mb-2 text-center fs-5 text-secondary">
      No tasks satisfying the conditions were found
    </div>
    <div v-else class="mb-2 text-center fs-5 text-secondary">No tasks</div>
  </div>
</template>

<script>
import TaskItem from "./TaskItem.vue";
import TaskCreate from "./TaskCreate.vue";
import TaskFilter from "./TaskFilter.vue";

export default {
  name: "TaskList",
  components: { TaskItem, TaskCreate, TaskFilter },
  data() {
    return {
      page: 1,
      init: false,
      addFormIsOpen: false,
    };
  },
  computed: {
    hasTasks() {
      return this.$store.state.task.taskList.length;
    },
    tasks() {
      return this.$store.getters["task/sortedTasks"];
    },
    totalPages() {
      return this.tasks.length
        ? Math.ceil(this.tasks.length / this.$store.state.task.limitOnPage)
        : 1;
    },
    hasNextPage() {
      return this.totalPages > this.page;
    },
    paginatedTasks() {
      const start = (this.page - 1) * this.$store.state.task.limitOnPage;
      const end = this.page * this.$store.state.task.limitOnPage;
      return this.tasks.slice(start, end);
    },
  },
  methods: {
    goNextPage() {
      if (this.hasNextPage) this.page += 1;
    },
    goPrevPage() {
      if (this.page > 1) this.page -= 1;
    },
    goLastPage() {
      this.page = this.totalPages;
    },
    resetPage() {
      // console.log("ResetPage");
      this.page = 1;
    },
    fixPageAverage() {
      // console.log("fixPageAverage");
      if (this.page > this.totalPages || this.page < 1) this.resetPage();
    },
    toggleAddForm() {
      this.addFormIsOpen = !this.addFormIsOpen;
    },
    closeAddForm() {
      this.addFormIsOpen = false;
    },
  },
  watch: {
    paginatedTasks() {
      if (this.page > 1 && this.paginatedTasks.length === 0) this.goLastPage();
    },
  },
  created() {
    this.$store.dispatch("task/initFilters");
    this.$store.dispatch("task/requestTaskList").then(() => {
      this.init = true;
    });
  },
};
</script>
