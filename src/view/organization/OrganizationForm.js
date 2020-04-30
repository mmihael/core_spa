import React, { Component } from 'react';
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import ApiForm from 'component/ApiForm';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class UserForm extends Component {

  render() {
    return (
      <ApiForm
        entityUriRoot={ApiUris.ORGANIZATION_URI}
        createSuccessMessage={translate('Organization created')}
        updateSuccessMessage={translate('Organization edited')}
        createErrorMessage={translate('Failed to create organization')}
        updateErrorMessage={translate('Failed to update organization')}
        createSuccessRedirect={Routes.DASHBOARD_ORGANIZATIONS_URI}
        updateSuccessRedirect={Routes.DASHBOARD_ORGANIZATIONS_URI}
        cancelButtonRedirect={Routes.DASHBOARD_ORGANIZATIONS_URI}
        elements={[
          { type: 'input', propSelector: 'name', label: translate('Name'), inputId: 'name' }
        ]}
      />
    )
  }

}

export default UserForm;