<template>
  <div>
    <h3 class="text-center">UserAvatar</h3>
    <div class="min-vh-50">
      <div
        class="pb-0-75rem mb-0-75rem border border-2 border-blue border-top-0 border-start-0 border-end-0 text-center"
      >
        <img :src="avatarLink" alt="Текущий аватар" class="w-32 mx-auto mb-1" />
        <div class="text-center">
          <template v-if="hasAvatar">
            <button
              @click="deleteAvatar()"
              type="submit"
              class="w-32 p-px mt-px mx-auto d-flex justify-content-center align-items-center rounded-md border border-secondary border-red-hover border-opacity-75 bg-secondary bg-red-hover rounded-2 text-white cursor-pointer"
            >
              <i class="fa fa-times-circle me-1" aria-hidden="true"></i>
              {{ processing ? "Wait" : "Delete" }}
            </button>
          </template>
          <template v-else>
            <span
              >Аватар не установлен.<br />Кликните дважды по любой из
              загруженных картинок, чтобы выбрать её.</span
            >
          </template>
        </div>
      </div>

      <div class="mb-2 clearfix">
        <div
          @click="requestImages()"
          class="float-start p-1 me-2 cursor-pointer link-blue"
          title="Update images"
        >
          <i class="fa fa-refresh fs-4" aria-hidden="true"></i>
        </div>
        <div class="float-end">
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
      <ImageAdd :is-open="addFormIsOpen" @close="closeAddForm()" />

      <!-- Request Error -->
      <ErrorSingle
        :is-error="requestErrorTrigger"
        :error-object="requestError"
        :reload-trigger="triggerForReloadingErrors"
        class="mb-4"
      />

      <template v-if="hasImages">
        <div class="d-flex flex-wrap gap-0-75rem justify-content-center">
          <TransitionGroup name="list-folding-y-150">
            <ImageItem
              v-for="image in images"
              :key="image.id"
              :image="image"
              :clickTrigger="clickImageTrigger"
              @set-click-trigger="setClickImageTrigger(image.id)"
            />
          </TransitionGroup>
        </div>
      </template>
      <template v-else>
        <div class="mb-2 text-center">
          Images not found. Click on the Add button to open the upload form.
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { RequestErrorMessage } from "@/mixins/RequestErrorMessage";
import ImageAdd from "../image/ImageAdd.vue";
import ImageItem from "../image/ImageItem.vue";
import ErrorSingle from "../inc/ErrorSingle.vue";

export default {
  name: "UserAvatar",
  components: { ImageItem, ErrorSingle, ImageAdd },
  mixins: [RequestErrorMessage],
  emits: ["changeComponent"],
  data() {
    return {
      addFormIsOpen: false,
      init: false,
      clickImageTrigger: 0,
    };
  },
  computed: {
    images() {
      return this.$store.state.image.imageList;
    },
    hasImages() {
      return this.images.length;
    },
    hasAvatar() {
      return this.$store.getters.avatarId;
    },
    avatarLink() {
      return this.$store.getters.avatarUrl;
    },
    avatarTitle() {
      if (this.hasAvatar) return "Текущий аватар";
      else
        return "Аватар не установлен. Кликните дважды по любой из загруженных картинок, чтобы выбрать её.";
    },
  },
  methods: {
    toggleAddForm() {
      this.addFormIsOpen = !this.addFormIsOpen;
    },
    closeAddForm() {
      this.addFormIsOpen = false;
    },
    deleteAvatar() {
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      this.$store
        .dispatch("deleteAvatar")
        .catch((err) => {
          this.requestError.$message = err;
          this.requestErrorTrigger = true;
        })
        .finally(() => {
          this.processing = false;
        });
    },
    setClickImageTrigger(imageId) {
      this.clickImageTrigger = imageId;
    },
    requestImages() {
      if (this.processing) return false;
      this.processing = true;
      this.reloadRequestError();
      return this.$store
        .dispatch("image/requestImages")
        .catch((err) => {
          this.requestErrorTrigger = true;
          this.requestError.$message = err;
        })
        .finally(() => {
          this.processing = false;
        });
    },
  },
  created() {
    this.requestImages().then(() => {
      this.init = true;
    });
  },
};
</script>
