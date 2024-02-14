export const DoubleClick = {
  data() {
    return {
      actionList: [],
      lastClick: {},
      maxDoubleClickInterval: 1000,
    };
  },

  methods: {
    doubleClickAction(action) {
      if (!this.actionList.includes(action)) {
        console.log(`doubleClickAction: unknown action '${action}'`);
        return false;
      }
      const clickTime = new Date();
      if (
        this.lastClick[action] &&
        clickTime - this.lastClick[action] < this.maxDoubleClickInterval
      ) {
        this.lastClick[action] = null;
        this[action]();
      } else {
        this.lastClick[action] = clickTime;
      }
    },
    setActionList(list) {
      if (list instanceof Array) {
        this.actionList = list;
        this.lastClick = {};
        list.forEach((actionName) => {
          this.lastClick[actionName] = null;
        });
      }
    },
  },
};
