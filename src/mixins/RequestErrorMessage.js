export const RequestErrorMessage = {
  data() {
    return {
      processing: false,
      triggerForReloadingErrors: true,
      requestErrorTrigger: false,
      requestError: {
        $message: "",
      },
    };
  },

  methods: {
    reloadingErrorMessages() {
      this.triggerForReloadingErrors = !this.triggerForReloadingErrors;
    },
    reloadRequestError() {
      this.reloadingErrorMessages();
      this.requestErrorTrigger = false;
    },
  },
};
