import React, { Component } from 'react';
import ApiUris from 'constants/ApiUris';
import ApiClient from 'client/ApiClient';
import Routes from 'constants/Routes';
import ApiForm from 'component/ApiForm';
import { connect } from "react-redux";
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

const mapStateToProps = state => {
  return { config: state.config }
};

class OrgChatForm extends Component {

  render() {
    if (this.props.config == null) { return null; }
    const redirectRoute = Routes.DASHBOARD_ORG_CHATS_URI.replace(':organizationId', this.props.match.params.organizationId);
    return (
      <ApiForm
        entityUriRoot={ApiUris.ORG_CHATS_URI.replace('{organizationId}', this.props.match.params.organizationId)}
        createSuccessMessage={translate('Chat created')}
        updateSuccessMessage={translate('Chat edited')}
        createErrorMessage={translate('Failed to create chat')}
        updateErrorMessage={translate('Failed to update chat')}
        createSuccessRedirect={redirectRoute}
        updateSuccessRedirect={redirectRoute}
        cancelButtonRedirect={redirectRoute}
        modifyRequestAfterBuilt={requestBody => {
          if (requestBody.userIds != null) {
            let userId = this.props.config.user.id + ''
            let userIds = new Set(requestBody.userIds.map(e => e.value))
            if (!userIds.has(userId)) {
              requestBody.userIds.push(this.props.config.user.id);
            }
          }
        }}
        elements={[
          { type: 'input', propSelector: 'name', label: translate('Name'), inputId: 'name' },
          {
            type: 'select',
            isMulti: true,
            propSelector: 'userIds',
            options: [],
            loadOptions: new Promise((resolve, reject) => {
              ApiClient
                .getOrgUsersPage(this.props.match.params.organizationId, { size: -1, organizationRole: true })
                .then(res => {
                  resolve(res.data.content.map(item => ({ label: item.username, value: '' + item.id })));
                })
                .catch(err => reject(err))
            }),
            optionsToEntityMapper: (entity, options) => {
              if (entity.chatMemberships) {
                let cmIds = new Set(entity.chatMemberships.map(cm => '' + cm.userId))
                return options.filter(option => cmIds.has(option.value))
              }
              return []
            },
            label: translate('Users'),
            inputId: 'userIds'
          }
        ]}
      />
    )
  }

}

const OrgChatFormConnected = connect(mapStateToProps)(OrgChatForm);

export default OrgChatFormConnected;