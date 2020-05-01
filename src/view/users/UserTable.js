import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import ApiTable from 'component/ApiTable';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class UserTable extends Component {

  render() {
    return (
      <>
        <div>
          <Link
            className={'btn btn-success'}
            to={Routes.DASHBOARD_USERS_FORM_URI}
          >{translate('Create user')}</Link>
        </div>
        <br />
        <ApiTable
          pageUri={ApiUris.USERS_PAGE_URI}
          entityUri={ApiUris.USERS_URI}
          formUri={Routes.DASHBOARD_USERS_FORM_URI}
          enableOptionsCell={true}
          enableEdit={true}
          enableDelete={true}
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

export default UserTable;