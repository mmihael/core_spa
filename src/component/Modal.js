import React, { Component } from 'react';

class Modal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      additionalClasses: '',
      display: false
    }
  }

  toggle() {
    if (this.state.display) {
      this.setState({ additionalClasses: '' }, () => { setTimeout(() => { this.setState({ display: false }); }, 200); });
    } else {
      this.setState({ display: true }, () => { setTimeout(() => { this.setState({ additionalClasses: 'show' }); }); });
    }
  }

  renderDefaultHeader = () => {
    return (
      <React.Fragment>
        <h5 className='modal-title'>{this.props.title}</h5>
        <button type='button' className='close' onClick={e => { this.toggle(); }}>
          <span>&times;</span>
        </button>
      </React.Fragment>
    );
  }

  renderDefaultFooter = () => {
    return (
      <React.Fragment>
        <button type='button' className='btn btn-secondary' onClick={e => { this.toggle(); }}>Close</button>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div
        className={'modal fade ' + this.state.additionalClasses}
        style={{ display: this.state.display ? 'block' : 'none' }}
        onClick={e => { this.toggle(); }}
      >
        <div className={'modal-dialog modal-' + (this.props.size ? this.props.size : 'md')} onClick={e => e.stopPropagation()}>
          <div className='modal-content'>
            <div className='modal-header'>
              {this.props.renderHeader ? this.props.renderHeader(this) : this.renderDefaultHeader()}
            </div>
            <div className='modal-body'>
              {this.props.renderBody ? this.props.renderBody(this) : null}
            </div>
            {this.props.showFooter === false ? (null) : (<div className='modal-footer'>
              {this.props.renderFooter ? this.props.renderFooter(this) : this.renderDefaultFooter()}
            </div>)}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;