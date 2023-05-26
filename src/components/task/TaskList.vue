<template>
  <div class="">
    <h2 class="text-center">Your task List</h2>

    <TaskFilter />

    <div class="clearfix mb-0">
      <div class="float-start mb-2 me-2">
        <button type="button" class="btn lh-1 btn-blue rounded-pill px-3 py-2">
          Назад
        </button>
        <span class="px-3 py-2 text-blue-dark">page: <strong>2</strong>/4</span>
        <button type="button" class="btn lh-1 btn-blue rounded-pill px-3 py-2">
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

    <div class="mt-0 row row-cols-1 row-cols-lg-2 gx-0-75rem gy-0-75rem">
      <TaskItem v-for="task in fakeTasks" :key="task.id" :task="task" />
    </div>
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
      addFormIsOpen: false,
      fakeTasks: [
        {
          id: 6,
          user_id: 1,
          title: "test string 6",
          is_completed: 0,
          end_date: null,
        },
        {
          id: 5,
          user_id: 1,
          title: "test string 5",
          is_completed: 0,
          end_date: null,
        },
        {
          id: 4,
          user_id: 1,
          title: "test string 4",
          is_completed: 0,
          end_date: null,
        },
        {
          id: 3,
          user_id: 1,
          title: "test string 3",
          is_completed: 1,
          end_date: "2023-04-22 11:39:08",
        },
        {
          id: 2,
          user_id: 1,
          title: "test string 2",
          is_completed: 1,
          end_date: "2023-04-22 11:39:08",
        },
        {
          id: 1,
          user_id: 1,
          title: "test string 1",
          is_completed: 1,
          end_date: "2023-04-22 11:39:08",
        },
      ],
    };
  },
  methods: {
    toggleAddForm() {
      this.addFormIsOpen = !this.addFormIsOpen;
    },
    closeAddForm() {
      this.addFormIsOpen = false;
    },
  },
};
</script>
