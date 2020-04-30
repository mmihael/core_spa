import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

class LoaderOverlay extends Component {

  render() {
    return (
      <div className='loader-overlay' style={this.props.zIndex ? { zIndex: this.props.zIndex } : {}}>
        <FontAwesomeIcon icon={faCircleNotch} spin />
      </div>
    );
  }
}

export default LoaderOverlay;