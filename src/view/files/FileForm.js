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
        formData={true}
        entityUriRoot={ApiUris.FILES_URI}
        createSuccessMessage={translate('File created')}
        updateSuccessMessage={translate('File edited')}
        createErrorMessage={translate('Failed to create file')}
        updateErrorMessage={translate('Failed to update file')}
        createSuccessRedirect={Routes.DASHBOARD_FILES_URI}
        updateSuccessRedirect={Routes.DASHBOARD_FILES_URI}
        cancelButtonRedirect={Routes.DASHBOARD_FILES_URI}
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