import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import ApiTable from 'component/ApiTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from "react-redux";
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

const mapStateToProps = state => {
  return { config: state.config }
};

class OrgFileTable extends Component {

  render() {
    return (
      <>
        <div>
          <Link
            className={'btn btn-success'}
            to={Routes.DASHBOARD_FILES_FORM_URI}
          >{translate('Create file')}</Link>
        </div>
        <br />
        <ApiTable
          pageUri={ApiUris.FILES_PAGE_URI}
          entityUri={ApiUris.FILES_URI}
          formUri={Routes.DASHBOARD_FILES_FORM_URI}
          enableOptionsCell={true}
          enableDelete={true}
          enableEdit={true}
          columnNames={[
            translate('ID'),
            translate('Link'),
            translate('Original name'),
            translate('File type'),
            translate('Access type'),
            translate('Size'),
            translate('Created at'),
            translate('Updated at')
          ]}
          cellValueExtractors={[
            'id',
            item => {
              let uri = '/api/file/' + item.id + '/content'
              let inside = null
              if (item.fileType && item.fileType.indexOf('image') >= 0) {
                inside = <img src={uri} alt={item.originalName} className='image-contain-sm' />
              } else {
                inside = <FontAwesomeIcon icon={faFileAlt} style={{fontSize: 36}} />
              }
              return (<a href={uri} target='_blank'  rel='noopener noreferrer'>{inside}</a>)
            },
            'originalName',
            'fileType',
            'accessType',
            'size',
            item => (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : null),
            item => (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : null)
          ]}
          searchOptions={[
            { label: translate('Original name'), propName: 'originalName', type: 'text' },
            { label: translate('File type'), propName: 'fileType', type: 'text' }
          ]}
        />
      </>
    )
  }

}

const OrgFileTableConnected = connect(mapStateToProps)(OrgFileTable);

export default OrgFileTableConnected;