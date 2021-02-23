import React, { Component } from 'react';
import ApiUris from 'constants/ApiUris';
import ApiClient from 'client/ApiClient';
import Routes from 'constants/Routes';
import ApiForm from 'component/ApiForm';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class OrgUserForm extends Component {

  render() {
    const redirectRoute = Routes.DASHBOARD_ORG_USERS_URI.replace(':organizationId', this.props.match.params.organizationId);
    return (
      <ApiForm
        entityUriRoot={ApiUris.ORG_USERS_URI.replace('{organizationId}', this.props.match.params.organizationId)}
        createSuccessMessage={translate('User created')}
        updateSuccessMessage={translate('User edited')}
        createErrorMessage={translate('Failed to create user')}
        updateErrorMessage={translate('Failed to update user')}
        createSuccessRedirect={redirectRoute}
        updateSuccessRedirect={redirectRoute}
        cancelButtonRedirect={redirectRoute}
        elements={[
          { type: 'input', propSelector: 'username', label: translate('Username'), inputId: 'username', excludeOnEdit: true },
          { type: 'input', inputType: 'password', propSelector: 'password', label: translate('Password'), inputId: 'password', excludeOnEdit: true },
          { type: 'checkbox', propSelector: 'enabled', label: translate('Enabled'), inputId: 'enabled' },
          {
            type: 'select',
            isMulti: true,
            propSelector: 'roleIds',
            options: [],
            loadOptions: new Promise((resolve, reject) => {
              ApiClient
                .getRolePage({ size: -1, organizationRole: true })
                .then(res => {
                  resolve(res.data.content.map(item => ({ label: item.name, value: '' + item.id })));
                })
                .catch(err => reject(err))
            }),
            optionsToEntityMapper: (entity, options) => {
              if (entity.userRoles) {
                let roleIds = new Set(entity.userRoles.map(ur => '' + ur.roleId))
                return options.filter(option => roleIds.has(option.value))
              }
              return []
            },
            label: translate('Roles'),
            inputId: 'roles'
          }
        ]}
      />
    )
  }

}

export default OrgUserForm;