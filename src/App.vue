<template>
  <div>
    <TopNavigation />
    <div
      class="container-md mw-xl-5xl my-3 py-3 px-2 min-vh-50 border border-2 border-start-0 border-end-0 border-blue"
    >
      <RouterView />
    </div>
  </div>
</template>

<script>
import TopNavigation from "@/components/inc/TopNavigation.vue";

export default {
  name: "App",
  components: { TopNavigation },
  created() {
    this.$store.dispatch("startInit");
  },
};
</script>

<style lang="scss">
#app {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
