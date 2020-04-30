let sideNotificationsElement = null;

let NotificationManager = {
  setSideNotificationsElement: (element) => { sideNotificationsElement = element; },
  info: (message) => {
    if (sideNotificationsElement) {
      sideNotificationsElement.info(message);
    } else {
      setTimeout(() => NotificationManager.info(message), 1000);
    }
  },
  success: (message) => {
    if (sideNotificationsElement) {
      sideNotificationsElement.success(message);
    } else {
      setTimeout(() => NotificationManager.success(message), 1000);
    }
  },
  warning: (message) => {
    if (sideNotificationsElement) {
      sideNotificationsElement.warning(message);
    } else {
      setTimeout(() => NotificationManager.warning(message), 1000);
    }
  },
  danger: (message) => {
    if (sideNotificationsElement) {
      sideNotificationsElement.danger(message);
    } else {
      setTimeout(() => NotificationManager.danger(message), 1000);
    }
  }
};

export default NotificationManager;