import React, { Component } from 'react';
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import ApiForm from 'component/ApiForm';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class UserForm extends Component {

  render() {
    const redirectRoute = Routes.DASHBOARD_ORG_FILES_URI.replace(':organizationId', this.props.match.params.organizationId);
    return (
      <ApiForm
        formData={true}
        entityUriRoot={ApiUris.ORG_FILES_URI.replace('{organizationId}', this.props.match.params.organizationId)}
        createSuccessMessage={translate('File created')}
        updateSuccessMessage={translate('File edited')}
        createErrorMessage={translate('Failed to create file')}
        updateErrorMessage={translate('Failed to update file')}
        createSuccessRedirect={redirectRoute}
        updateSuccessRedirect={redirectRoute}
        cancelButtonRedirect={redirectRoute}
        elements={[
          { type: 'file', propSelector: 'file', label: translate('File'), inputId: 'file', excludeOnEdit: true },
          {
            type: 'select',
            apiType: 'string',
            propSelector: 'fileAccessType',
            label: translate('Access type'),
            inputId: 'fileAccessType',
            options: [
              { label: translate('PRIVATE'), value: 'PRIVATE' },
              { label: translate('ORGANIZATION_ONLY'), value: 'ORGANIZATION_ONLY' },
              { label: translate('PUBLIC'), value: 'PUBLIC' }
            ],
            optionsToEntityMapper: (entity, options) => {
              if (entity.accessType) {
                return options.filter(option => entity.accessType === option.value)
              }
              return []
            }
          }
        ]}
      />
    )
  }

}

export default UserForm;