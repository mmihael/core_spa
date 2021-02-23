import React, { Component } from 'react';
import ApiClient from 'client/ApiClient';
import WsSocket from 'util/WsSocket';
import Textarea from 'component/form/Textarea';
import CardWrapper from 'component/CardWrapper';
import LoaderOverlay from 'component/LoaderOverlay';
import NotificationManager from 'util/NotificationManager';
import { connect } from "react-redux";
import Routes from 'constants/Routes';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

const mapStateToProps = state => {
  return { config: state.config }
};

class OrgChats extends Component {

  constructor(props) {
    super(props)
    let state = {
      text: '',
      messages: [],
      canSend: true,

      activeChatMessagesLastSize: null,
      activeChatMessagesSize: 10,
      activeChatMessages: null,
      activeChat: null,
      chatsPage: null,
      chatsPageNumber: 1,
      requestCount: 0
    }
    this.state = state
  }

  componentWillUnmount = () => {
    WsSocket.unRegisterEventStreamListener(this.wsChatListener);
  }

  componentDidMount() {
    WsSocket.registerEventStreamListener(this.wsChatListener);
    this.getChatsPage(this.state.chatsPageNumber);
  }

  wsChatListener = event => {
    if (event.type === 'NEW_CHAT_MESSAGE' && this.state.activeChat && event.payload.chat.id === this.state.activeChat.id) {
      let wasOnBottom = this.messageContainerIsOnBottom();
      this.setState(
        state => ({ activeChatMessages: [ ...state.activeChatMessages, event.payload ] }),
        () => { if (wasOnBottom) { this.scrollToBottomOfMessageContainer(); } }
      )
    }
  }

  messageContainerIsOnBottom = () => {
    if (this._messagesContainer) {
      return (this._messagesContainer.scrollTop + this._messagesContainer.clientHeight) === this._messagesContainer.scrollHeight;
    }
    return false;
  }

  scrollToBottomOfMessageContainer = () => {
    if (this._messagesContainer) {
      this._messagesContainer.scrollTop = this._messagesContainer.scrollHeight;
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.canSend) { return; }
    this.setState({canSend: false}, () => {
      ApiClient
        .writeChatMessage(this.props.match.params.organizationId, this.state.activeChat.id, this.state.text)
        .then(res => {
          this.setState({
            text: '',
            activeChatMessages: [
              ...this.state.activeChatMessages,
              { id: res.data.id, message: this.state.text, createdAt: new Date().getTime(), user: { username: this.props.config.user.username } }
            ]
          }, () => { this.scrollToBottomOfMessageContainer() })
          console.log(res.data);
        })
        .catch(err => { console.log(err); NotificationManager.danger(translate('Failed to send message')); })
        .then(() => { this.setState({canSend: true}) })
    })
  }

  getChatsPage = (page) => {
    this.setState({ requestCount: this.state.requestCount + 1 }, () => {
      ApiClient
        .getOrgChats(this.props.match.params.organizationId, { page, size: 8 })
        .then(res => {
           this.setState({ chatsPage: res.data });
        })
        .catch(err => { console.log(err); NotificationManager.danger(translate('Error while fetching chats')); })
        .then(() => { this.setState({ requestCount: this.state.requestCount - 1 }); })
    });
  }

  renderPaginationPages = (page) => {

    let links = [];

    if (page == null) {
      return (<li className='page-item disabled'><button className='page-link'>0</button></li>);
    }

    let totalLinks = this.props.surroundingLinks ? this.props.surroundingLinks : 3;
    let currentPage = page.number;
    let totalPages = page.totalPages;

    let leftCounter = currentPage;
    let total = 0;
    while (leftCounter - 1 > 0 && total < totalLinks) {
      let pageNum = leftCounter - 1;
      links.push(<li key={pageNum} className='page-item'><button className='page-link' onClick={e => this.getChatsPage(pageNum)}>{pageNum}</button></li>);
      total++;
      leftCounter--;
    }

    links.reverse();

    links.push(<li key={currentPage} className='page-item active'><button className='page-link'>{currentPage}</button></li>);

    let rightCounter = currentPage;
    total = 0;
    while (rightCounter + 1 <= totalPages && total < totalLinks) {
      let pageNum = rightCounter + 1;
      links.push(<li key={pageNum} className='page-item'><button className='page-link' onClick={e => this.getChatsPage(pageNum)}>{pageNum}</button></li>);
      total++;
      rightCounter++;
    }

    return links;
  }

  fetchChatMessages = (chat, lastId) => {
    this.setState({ requestCount: this.state.requestCount + 1 }, () => {
      ApiClient
        .getChatMessages(this.props.match.params.organizationId, chat.id, lastId ? { idLessThan: lastId } : null)
        .then(res => {
          let reversedMessages = res.data.content.reverse();
          let messagesContainerClientHeight = this._messagesContainer ? this._messagesContainer.clientHeight : null;
          this.setState({
            activeChat: chat,
            activeChatMessages: lastId ? [...reversedMessages, ...this.state.activeChatMessages] : reversedMessages,
            activeChatMessagesLastSize: res.data.content.length
          }, () => {
            if (!lastId) {
              this.scrollToBottomOfMessageContainer();
            } else if (messagesContainerClientHeight && this._messagesContainer) {
              this._messagesContainer.scrollTop = messagesContainerClientHeight;
            }
          });
        })
        .catch(err => { console.log(err); NotificationManager.danger(translate('Error while fetching chat messages')); })
        .then(() => { this.setState({ requestCount: this.state.requestCount - 1 }); })
    });
  }

  renderChatsPage = () => {
    let page = this.state.chatsPage;
    return (
      <>
        <div style={{flex: 1}} className='list-group'>
          {this.state.chatsPage.content.map(chat => {
            return (
              <div
                className={'cursor-pointer list-group-item list-group-item-action' + (this.state.activeChat != null && this.state.activeChat.id === chat.id ? ' active' : '' )}
                key={chat.id}
                onClick={e => { this.fetchChatMessages(chat); }}>{chat.name}</div>
            )
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>{page ? <small className='text-muted'>{translate('Page')}: {page.number} {translate('of')} {page.totalPages}</small> : null}</div>
        <nav>
          <ul className='pagination pagination-sm mb-0'>
            <li className={'page-item ' + (page == null || page.first ? 'disabled' : '')}>
              <button
                className='page-link'
                onClick={e => (page != null && !page.first ? this.getChatsPage(page.number - 1) : null)}
              >&nbsp;<FontAwesomeIcon icon={faChevronLeft} />&nbsp;</button>
            </li>
            {this.renderPaginationPages(page)}
            <li className={'page-item ' + (page == null || page.last ? 'disabled' : '')}>
              <button
                className='page-link'
                onClick={e => (page != null && !page.last ? this.getChatsPage(page.number + 1) : null)}
              >&nbsp;<FontAwesomeIcon icon={faChevronRight} />&nbsp;</button>
            </li>
          </ul>
        </nav>
        </div>
      </>
    )
  }

  renderActiveChat = () => {
    return (
      <div className='p-1' style={{ maxHeight: 500, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
        {this.state.activeChat ? <h5>{this.state.activeChat.name}<hr /></h5> : null}
        {this.state.activeChat && this.state.activeChatMessages ? <>
        <div ref={ref => { this._messagesContainer = ref; }} style={{flex: 1, overflow: 'scroll'}}>
        {this.state.activeChatMessagesLastSize >= this.state.activeChatMessagesSize ? (
          <div className='pb-2 pt-2 text-center'><button className='btn btn-info' onClick={e => {
            this.fetchChatMessages(this.state.activeChat, this.state.activeChatMessages[0].id)
          }}>{translate('Load more')}</button></div>
        ) : null}
        {this.state.activeChatMessages.map(message => {
          return (
            <div key={message.id} className='pb-2'>
              <div><strong className='h5'>{message.user.username}</strong><small className='text-muted'> {message.createdAt ? new Date(message.createdAt).toLocaleString() : null}</small></div>
              <div style={{fontWeight: 300}}>{message.message}</div>
            </div>
          )
        })}</div>
        <form onSubmit={this.handleSubmit}>
          <Textarea rows={1} value={this.state.text} onChange={e => this.setState({ text: e.target.value })} id='message' />
          <button className='btn btn-info'>{translate('Send')}</button>
        </form>
        </> : null}
      </div>
    )
  }

  render() {
    return (
      <CardWrapper>
        {this.state.requestCount > 0 ? (<LoaderOverlay />) : null}
        <div className='row'>
          <div  style={{display: 'flex', flexDirection: 'column'}} className='col-sm-4'>
            <div className='mb-2'>
              <Link
                className={'btn btn-success'}
                to={Routes.DASHBOARD_ORG_CHATS_FORM_URI.replace(':organizationId', this.props.match.params.organizationId)}
              >{translate('New chat')}</Link>
            </div>
            {this.state.chatsPage ? this.renderChatsPage() : null}
          </div>
          <div className='col-sm-8'>{this.renderActiveChat()}</div>
        </div>
      </CardWrapper>
    )
  }

}

const OrgChatsConnected = connect(mapStateToProps)(OrgChats);

export default OrgChatsConnected;