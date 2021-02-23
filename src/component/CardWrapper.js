import React, { Component } from 'react';

class CardWrapper extends Component {

  render() {
    return (
      <div className="border-radius-none card" style={this.props.style}>
        <div className="card-body">{this.props.children}</div>
      </div>
    )
  }

}

export default CardWrapper;