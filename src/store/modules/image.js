import api from "@/api";

export default {
  namespaced: true,
  state: () => ({
    imageList: {},
  }),
  getters: {},
  mutations: {
    setImages(state, images) {
      state.imageList = images;
    },
    addImage(state, image) {
      state.imageList.push(image);
    },
    deleteImage(state, image) {
      const imageId = image.id;
      state.imageList.splice(
        state.imageList.findIndex((image) => image.id === imageId),
        1
      );
    },
  },
  actions: {
    requestImages({ commit }) {
      return api
        .imageList()
        .then((images) => {
          commit("setImages", images);
        })
        .catch((err) => {
          commit("setImages", {});
          throw err;
        });
    },

    storeImage({ commit }, image) {
      return api.imageStore(image).then((newImage) => {
        commit("addImage", newImage);
      });
    },

    deleteImage({ rootState, commit, dispatch }, image) {
      return new Promise((resolve, reject) => {
        if (rootState.user?.avatar_id === image.id) {
          dispatch("deleteAvatar", null, {
            root: true,
          })
            .then(() => {
              api
                .imageDelete(image.id)
                .then(() => {
                  commit("deleteImage", image);
                  resolve(true);
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        } else
          api
            .imageDelete(image.id)
            .then(() => {
              commit("deleteImage", image);
              resolve(true);
            })
            .catch((err) => {
              reject(err);
            });
      });
    },
  },
};
