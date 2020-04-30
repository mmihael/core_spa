import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import ApiTable from 'component/ApiTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class OrganizationTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      organizationForAssignment: null
    }
  }

  render() {
    return (
      <>
        <div>
          <Link
            className={'btn btn-success'}
            to={Routes.DASHBOARD_ORGANIZATIONS_FORM_URI}
          >{translate('Create organization')}</Link>
        </div>
        <br />
        <ApiTable
          pageUri={ApiUris.ORGANIZATION_PAGE_URI}
          entityUri={ApiUris.ORGANIZATION_URI}
          formUri={Routes.DASHBOARD_ORGANIZATIONS_FORM_URI}
          enableOptionsCell={true}
          enableEditDelete={true}
          additionalOptions={item => { return (
            <>&nbsp;
              <Link
                title={translate('Manage users')}
                to={Routes.DASHBOARD_ORGANIZATIONS_USERS_URI.replace(':id', item.id)}
                className='btn btn-primary btn-sm'
              ><FontAwesomeIcon icon={faUsers}/></Link>
            </>
          ); }}
          columnNames={[
            translate('ID'),
            translate('Name'),
            translate('Created at'),
            translate('Updated at')
          ]}
          cellValueExtractors={[
            'id',
            'name',
            item => (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : null),
            item => (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : null)
          ]}
        />
      </>
    )
  }

}

export default OrganizationTable;