import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

var id = 0;

class SideNotifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };
  }

  addNotification = (message, type, icon) => {
    var newId = id++;
    this.setState({ notifications: this.state.notifications.concat([{ message, type, icon, id: newId }]) });
    setTimeout(() => {
      this.setState({ notifications: this.state.notifications.filter(item => item.id !== newId) });
    }, 5000);
  }

  info = (message) => {
    this.addNotification(message, 'primary', faInfoCircle);
  }

  success = (message) => {
    this.addNotification(message, 'success', faCheck);
  }

  warning = (message) => {
    this.addNotification(message, 'warning', faExclamationTriangle);
  }

  danger = (message) => {
    this.addNotification(message, 'danger', faTimes);
  }

  render() {
    return (
      <div style={{ position: 'fixed', top: 12, right: 12, width: 380, zIndex: 8888 }}>
        {this.state.notifications.map(notification => (
          <div key={notification.id} className={'alert border-radius-none alert-' + notification.type} style={{ display: 'flex' }}>
            <div style={{ flex: 0, minWidth: 24, display: 'flex' }}>
              <FontAwesomeIcon
                className={'animation-notification-' + notification.type}
                style={{ alignSelf: 'center' }}
                icon={notification.icon}
              />
            </div>
            <div className='text-left' style={{ flex: 1 }}>
              {notification.message}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default SideNotifications;