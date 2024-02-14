<template>
  <div
    ref="imageBlock"
    @mouseover="toggleHover(true)"
    @mouseout="toggleHover(false)"
    class="position-relative"
  >
    <!-- Request Error -->
    <ErrorSingle
      :is-error="requestErrorTrigger"
      :error-object="requestError"
      :reload-trigger="triggerForReloadingErrors"
      class="position-absolute z-2 top-n8"
      :class="[
        errorLeftPositionClass,
        errorRightPositionClass,
        errorWidthClass,
      ]"
    />

    <div
      @click="clickImage"
      class="mx-auto w-32 h-32 box-content d-flex justify-content-center align-items-center border p-px"
      :class="[borderColorClass, bgColorClass]"
    >
      <img :src="image.full_url" class="mh-32 mw-32" />
    </div>

    <Transition name="folding-y-50">
      <div
        v-if="isClicked"
        class="border-top border-transparent position-absolute bottom-n3 start-0 end-0"
      >
        <button
          @click="deleteImage()"
          class="py-0 px-1 mx-auto d-flex justify-content-center align-items-center rounded-md border border-secondary border-red-hover border-opacity-75 bg-secondary bg-red-hover rounded-2 fs-sm text-white cursor-pointer"
        >
          <i class="fa fa-times-circle me-1" aria-hidden="true"></i>
          {{ processing ? "Wait" : "Delete" }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import ErrorSingle from "../inc/ErrorSingle.vue";
import { DoubleClick } from "@/mixins/DoubleClick";
import { RequestErrorMessage } from "@/mixins/RequestErrorMessage";

export default {
  name: "ImageItem",
  components: { ErrorSingle },
  mixins: [DoubleClick, RequestErrorMessage],
  props: {
    image: Object,
    clickTrigger: Number,
  },
  emits: ["setClickTrigger"],
  data() {
    return {
      blockPosition: null,
      isHover: false,
      isClicked: false,
    };
  },
  computed: {
    isAvatar() {
      if (this.image.id === this.$store.getters.avatarId) return true;
      return false;
    },
    leftLimitation() {
      if (!this.blockPosition) return true;
      return this.blockPosition.left < 80;
    },
    rightLimitation() {
      if (!this.blockPosition) return true;
      return window.innerWidth - this.blockPosition.right < 80;
    },
    errorLeftPositionClass() {
      if (this.leftLimitation) return "start-n2";
      else return "start-n20";
    },
    errorRightPositionClass() {
      if (this.rightLimitation) return "end-n2";
      else return "end-n20";
    },
    errorWidthClass() {
      if (this.leftLimitation && this.rightLimitation) return "w-36";
      else if (!this.leftLimitation && !this.rightLimitation) return "w-72";
      else return "w-56";
    },
    borderColorClass() {
      return this.isAvatar
        ? this.isHover
          ? "border-blue-400"
          : "border-blue-300"
        : this.isHover
        ? "border-blue-200"
        : "border-transparent";
    },
    bgColorClass() {
      return this.isAvatar
        ? this.isHover
          ? "bg-blue-300"
          : "bg-blue-200"
        : this.isHover
        ? "bg-blue-light"
        : "bg-transparent";
    },
  },
  methods: {
    clickImage() {
      this.$emit("setClickTrigger");
      this.doubleClickAction("setAvatar");
    },
    setAvatar() {
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      this.$store
        .dispatch("setAvatar", this.image)
        .catch((err) => {
          this.requestError.$message = err;
          this.requestErrorTrigger = true;
        })
        .finally(() => {
          this.processing = false;
        });
    },
    deleteImage() {
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      this.$store
        .dispatch("image/deleteImage", this.image)
        .catch((err) => {
          this.requestError.$message = err;
          this.requestErrorTrigger = true;
        })
        .finally(() => {
          this.processing = false;
        });
    },
    toggleHover(state) {
      this.isHover = state;
    },
    setBlockPosition() {
      if (this.reloadRequestError) {
        this.blockPosition = this.$refs.imageBlock.getBoundingClientRect();
      }
    },
  },
  watch: {
    clickTrigger(newId) {
      if (newId === this.image.id) this.isClicked = true;
      else {
        this.isClicked = false;
        this.reloadRequestError();
      }
    },
    requestErrorTrigger(trigger) {
      if (trigger) this.setBlockPosition();
    },
  },
  mounted() {
    this.setActionList(["setAvatar"]);
    window.addEventListener("resize", this.setBlockPosition);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setBlockPosition);
  },
};
</script>
