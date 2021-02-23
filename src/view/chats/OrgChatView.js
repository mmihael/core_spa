import React, { Component } from 'react';
import ApiClient from 'client/ApiClient';
import WsSocket from 'util/WsSocket';
import Textarea from 'component/form/Textarea';
import NotificationManager from 'util/NotificationManager';
import { connect } from "react-redux";
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

const mapStateToProps = state => {
  return { config: state.config }
};

class OrgChatView extends Component {

  constructor(props) {
    super(props)
    let state = {
      text: '',
      messages: [],
      canSend: true
    }
    this.state = state
  }

  componentDidMount() {
    WsSocket.registerEventStreamListener(event => {
      if (event.type === 'NEW_CHAT_MESSAGE' && event.payload.chat.id + '' === this.props.match.params.chatId) {
        this.setState(state => ({ messages: [ ...state.messages, event.payload ] }))
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.canSend) { return; }
    this.setState({canSend: false}, () => {
      ApiClient
        .writeChatMessage(this.props.match.params.organizationId, this.props.match.params.chatId, this.state.text)
        .then(res => {
          this.setState({
            text: '',
            messages: [
              ...this.state.messages,
              { id: res.data.id, message: this.state.text, user: { username: this.props.config.user.username } }
            ]
          })
          console.log(res.data);
        })
        .catch(err => { console.log(err); NotificationManager.danger(translate('Failed to send message')); })
        .then(() => { this.setState({canSend: true}) })
    })
  }

  renderMessage = (message, index) => {
    return (<div key={message.id}>
      {message.user ? message.user.username : 'null'}: {message.message}
    </div>)
  }

  render() {
    if (this.props.config == null) { return null; }
    return <>
      <div>{this.state.messages.map(this.renderMessage)}</div>
      <div>
        <form onSubmit={this.handleSubmit}>
          <Textarea rows={3} value={this.state.text} onChange={e => this.setState({ text: e.target.value })} label={translate('Message')} id='message' />
          <button className='btn btn-info'>{translate('Send')}</button>
        </form>
      </div>
      <div>WTF {this.props.match.params.organizationId} {this.props.match.params.chatId}</div>
    </>
  }

}

const OrgChatViewConnected = connect(mapStateToProps)(OrgChatView);

export default OrgChatViewConnected;