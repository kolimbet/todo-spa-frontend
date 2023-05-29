<template>
  <div class="">
    <div
      @click="requestTaskList()"
      class="ms-2 mb-1 float-end cursor-pointer link-blue"
      title="Update tasks"
    >
      <i class="fa fa-refresh fs-4" aria-hidden="true"></i>
    </div>

    <h2 class="text-center">Your task List</h2>

    <TaskFilter />

    <div class="clearfix mb-0">
      <div class="float-start mb-2 me-2">
        <Transition name="fade">
          <button
            v-if="page > 1"
            @click="goPrevPage()"
            type="button"
            class="btn lh-1 btn-blue rounded-pill px-3 py-2"
          >
            Назад
          </button>
        </Transition>

        <span class="px-3 py-2 text-blue-dark"
          >page: <strong>{{ page }}</strong> / {{ totalPages }}</span
        >
        <Transition name="fade">
          <button
            v-if="hasNextPage"
            @click="goNextPage()"
            type="button"
            class="btn lh-1 btn-blue rounded-pill px-3 py-2"
          >
            Вперёд
          </button>
        </Transition>
      </div>

      <div class="float-end mb-2">
        <Transition name="fade" mode="out-in">
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
        </Transition>
      </div>
    </div>

    <!-- add form -->
    <TaskCreate :is-open="addFormIsOpen" @close="closeAddForm()" />

    <!-- Request Error -->
    <ErrorSingle
      :is-error="requestErrorTrigger"
      :error-object="requestError"
      :reload-trigger="triggerForReloadingErrors"
      class="mb-4"
    />

    <div
      v-if="tasks.length"
      class="mt-0 row row-cols-1 row-cols-lg-2 gx-0-75rem gy-0-75rem"
    >
      <TransitionGroup name="list-folding-y-100">
        <TaskItem v-for="task in paginatedTasks" :key="task.id" :task="task" />
      </TransitionGroup>
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
import ErrorSingle from "../inc/ErrorSingle.vue";

export default {
  name: "TaskList",
  components: { TaskItem, TaskCreate, TaskFilter, ErrorSingle },
  data() {
    return {
      page: 1,
      init: false,
      addFormIsOpen: false,

      triggerForReloadingErrors: true,
      requestErrorTrigger: false,
      requestError: {
        $message: "",
      },
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
    requestTaskList() {
      return this.$store
        .dispatch("task/requestTaskList")
        .finally(() => {
          this.reloadingErrorMessages();
        })
        .catch((err) => {
          this.requestError.$message = err;
          this.requestErrorTrigger = true;
        });
    },
    reloadingErrorMessages() {
      this.triggerForReloadingErrors = !this.triggerForReloadingErrors;
    },
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
    this.requestTaskList().then(() => {
      this.init = true;
    });
  },
};
</script>
