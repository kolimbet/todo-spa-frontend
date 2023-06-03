<template>
  <div>
    <h2 class="text-center mb-0-75rem">User Page</h2>
    <div
      class="mb-0-75rem p-1 d-flex flex-wrap justify-content-center gap-0-75rem bg-blue text-white text-opacity-90"
    >
      <template v-for="comp in userComponents" :key="comp">
        <div
          @click="toggleTabComponent(comp.alias)"
          class="px-0-75rem py-1 rounded-2 cursor-pointer text-nowrap"
          :class="[buttonClasses(comp.alias)]"
        >
          {{ comp.title }}
        </div>
      </template>
    </div>
    <Transition name="slide-left" mode="out-in">
      <component :is="currentTabComponent" @changeComponent="changeComponent" />
    </Transition>
  </div>
</template>

<script>
import UserHome from "./UserHome.vue";
import UserAvatar from "./UserAvatar.vue";
import UserChangePassword from "./UserChangePassword.vue";

export default {
  name: "UserPage",
  components: { UserHome, UserAvatar, UserChangePassword },
  data() {
    return {
      currentTabComponent: "UserHome",
      userComponents: {
        home: {
          alias: "UserHome",
          title: "Home",
        },
        avatar: {
          alias: "UserAvatar",
          title: "Avatar",
        },
        password: {
          alias: "UserChangePassword",
          title: "Change Password",
        },
      },
    };
  },
  methods: {
    toggleTabComponent(installableComponent) {
      if (installableComponent !== this.currentTabComponent)
        this.currentTabComponent = installableComponent;
    },
    buttonClasses(testedComponent) {
      if (testedComponent === this.currentTabComponent) return "bg-blue-dark";
      else return "";
    },
    changeComponent(component) {
      console.log("changeComponent", component);
      if (this.userComponents[component] !== "undefined")
        this.currentTabComponent = this.userComponents[component].alias;
    },
  },
};
</script>
