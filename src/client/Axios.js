import axios from 'axios';
import MainRouter from 'util/MainRouter';
import Routes from 'constants/Routes';
import NotificationManager from 'util/NotificationManager';

const _axios = axios.create({});

_axios.interceptors.request.use(
  (config) => { return config; },
  (error) => { return Promise.reject(error); }
);

_axios.interceptors.response.use(
  (response) => { return response; },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && MainRouter.getRouter().history.location.pathname !== Routes.LOGIN_URI) {
        MainRouter.getRouter().history.push(Routes.LOGIN_URI);
      } else if (error.response.status === 422 && error.response.data && error.response.data.type === 'validation-error') {
        let keys = Object.keys(error.response.data.propErrors);
        for (let i = 0; i < keys.length; i++) {
          let messages = error.response.data.propErrors[keys[i]];
          if (messages && messages.length > 0) {
            for (let j = 0; j < messages.length; j++) {
              NotificationManager.danger(messages[j]);
            }
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default _axios;