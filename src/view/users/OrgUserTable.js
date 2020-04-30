import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import ApiTable from 'component/ApiTable';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class OrgUserTable extends Component {

  render() {
    const orgUsersFormUri = Routes.DASHBOARD_ORG_USERS_FORM_URI
      .replace(':organizationId', this.props.match.params.organizationId)
    return (
      <>
        <div>
          <Link
            className={'btn btn-success'}
            to={orgUsersFormUri}
          >{translate('Create user')}</Link>
        </div>
        <br />
        <ApiTable
          pageUri={ApiUris.ORG_USERS_PAGE_URI.replace('{organizationId}', this.props.match.params.organizationId)}
          entityUri={ApiUris.ORG_USERS_URI}
          formUri={orgUsersFormUri}
          enableOptionsCell={true}
          enableEditDelete={true}
          columnNames={[
            translate('ID'),
            translate('Username'),
            translate('Enabled'),
            translate('Created at'),
            translate('Updated at')
          ]}
          cellValueExtractors={[
            'id',
            'username',
            'enabled',
            item => (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : null),
            item => (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : null)
          ]}
          searchOptions={[
            { label: translate('Username'), propName: 'username', type: 'text' }
          ]}
        />
      </>
    )
  }

}

export default OrgUserTable;