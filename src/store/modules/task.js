import api from "@/api";

export default {
  namespaced: true,
  state: () => ({
    taskList: [],
    taskCounter: {
      total: 0,
      active: 0,
      completed: 0,
    },
    filter: "all",
    filterValues: ["all", "active", "completed"],
    order: "new",
    orderValues: ["new", "old"],
    limitOnPage: 20,
    limitOnPageValues: [10, 20, 30, 40, 50],
  }),
  getters: {
    filteredTasks(state) {
      switch (state.filter) {
        case "active":
          return state.taskList.filter((task) => task.is_completed == false);
        case "completed":
          return state.taskList.filter((task) => task.is_completed == true);
        default:
          return state.taskList;
      }
    },
    sortedTasks(state, getters) {
      switch (state.order) {
        case "old":
          return getters.filteredTasks.sort((a, b) => {
            if (a.is_completed > b.is_completed) return 1;
            if (a.is_completed < b.is_completed) return -1;
            if (a.is_completed) {
              if (a.end_date > b.end_date) return 1;
              if (a.end_date < b.end_date) return -1;
              return 0;
            } else {
              if (a.id > b.id) return 1;
              return -1;
            }
          });
        case "new":
        default:
          return getters.filteredTasks.sort((a, b) => {
            if (a.is_completed > b.is_completed) return 1;
            if (a.is_completed < b.is_completed) return -1;
            if (a.is_completed) {
              if (a.end_date > b.end_date) return -1;
              if (a.end_date < b.end_date) return 1;
              return 0;
            } else {
              if (a.id > b.id) return -1;
              return 1;
            }
          });
      }
    },
  },
  mutations: {
    setTaskList(state, tasks) {
      state.taskList = tasks;
    },
    deleteTask(state, deletedTask) {
      state.taskList.splice(
        state.taskList.findIndex((task) => task.id === deletedTask.id),
        1
      );
    },
    updateTask(state, changedTask) {
      state.taskList.splice(
        state.taskList.findIndex((task) => task.id === changedTask.id),
        1,
        changedTask
      );
    },
    addTask(state, newTask) {
      state.taskList.push(newTask);
    },
    setTaskCounter(
      state,
      counter = {
        total: 0,
        active: 0,
        completed: 0,
      }
    ) {
      state.taskCounter = counter;
    },
    setFilter(state, option) {
      if (state.filterValues.includes(option)) {
        state.filter = option;
        localStorage.setItem("task.filter", option);
      }
    },
    setOrder(state, option) {
      if (state.orderValues.includes(option)) {
        state.order = option;
        localStorage.setItem("task.order", option);
      }
    },
    setLimitOnPage(state, option) {
      option = parseInt(option);
      if (state.limitOnPageValues.includes(option)) {
        state.limitOnPage = option;
        localStorage.setItem("task.limitOnPage", option);
      }
    },
  },
  actions: {
    initFilters({ commit }) {
      if (localStorage.getItem("task.filter") !== null) {
        commit("setFilter", localStorage.getItem("task.filter"));
      }
      if (localStorage.getItem("task.order") !== null) {
        commit("setOrder", localStorage.getItem("task.order"));
      }
      if (localStorage.getItem("task.limitOnPage") !== null) {
        commit("setLimitOnPage", localStorage.getItem("task.limitOnPage"));
      }
    },

    requestTaskList({ commit }) {
      return api
        .taskList()
        .then((tasks) => {
          commit("setTaskList", tasks);
        })
        .catch((err) => {
          commit("setTaskList", []);
          throw err;
        });
    },

    deleteTask({ commit }, deletedTask) {
      return api.taskDelete(deletedTask.id).then(() => {
        commit("deleteTask", deletedTask);
      });
    },

    completeTask({ commit }, task) {
      return api
        .taskComplete(task.id, task.is_completed)
        .then((changedTask) => {
          commit("updateTask", changedTask);
        });
    },

    updateTaskTitle({ commit }, task) {
      return api.taskTitle(task.id, task.title).then((changedTask) => {
        commit("updateTask", changedTask);
      });
    },

    createTask({ commit }, task) {
      return api.taskCreate(task).then((newTask) => {
        commit("addTask", newTask);
      });
    },

    requestTaskCounter({ commit }) {
      return api
        .taskCounter()
        .then((counter) => {
          commit("setTaskCounter", counter);
        })
        .catch((err) => {
          commit("setTaskCounter");
          throw err;
        });
    },
  },
};
