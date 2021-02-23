import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let socket = null;
let client = null;

let listeners = [];

export default {

  registerEventStreamListener: (listener) => {
    listeners.push(listener)
  },

  unRegisterEventStreamListener: (listener) => {
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  },

  setup: () => {
    socket = new SockJS('/websocket');
    client = Stomp.over(socket);
    client.connect({}, frame => {
      client.subscribe('/user/events/stream', payload => {
        console.log(payload);
        let payloadBody = JSON.parse(payload.body)
        listeners.forEach(listener => {
          listener(payloadBody)
        })
      });
    });
  }

}