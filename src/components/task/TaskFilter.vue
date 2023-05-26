<template>
  <div class="clearfix mb-3">
    <div class="float-start d-flex gap-0-75rem">
      <div>
        <label for="filter-order" class="fs-sm text-secondary">Order:</label>
        <select
          v-model="order"
          id="filter-order"
          class="form-select form-select-sm"
        >
          <option value="new">сначала новые</option>
          <option value="old">сначала старые</option>
        </select>
      </div>
      <div>
        <label for="filter-filter" class="fs-sm text-secondary">Filter:</label>
        <select
          v-model="filter"
          id="filter-filter"
          class="form-select form-select-sm"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
    <div class="float-end">
      <label for="filter-limitOnPage" class="fs-sm text-secondary"
        >On page:</label
      >
      <select
        v-model="limitOnPage"
        id="filter-limitOnPage"
        class="form-select form-select-sm"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskFilter",
  computed: {
    filter: {
      get() {
        return this.$store.state.task.filter;
      },
      set(option) {
        this.$store.commit("task/setFilter", option);
      },
    },
    order: {
      get() {
        return this.$store.state.task.order;
      },
      set(option) {
        this.$store.commit("task/setOrder", option);
      },
    },
    limitOnPage: {
      get() {
        return this.$store.state.task.limitOnPage;
      },
      set(option) {
        this.$store.commit("task/setLimitOnPage", option);
      },
    },
  },
};
</script>
