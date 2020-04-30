import React, { Component } from 'react';
import Axios from 'client/Axios';
import { Link } from "react-router-dom";
import LoaderOverlay from 'component/LoaderOverlay';
import Input from 'component/form/Input';
import Modal from 'component/Modal';
import CardWrapper from 'component/CardWrapper';
import NotificationManager from 'util/NotificationManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faMinus, faTrashAlt, faEdit, faSearch, faBan, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class ApiTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      page: null,
      requestCount: 0,
      idForDelete: null,
      searches: this.getBlankSearches()
    }
  }

  componentDidMount = () => {
    this.fetch()
  }

  getBlankSearches = () => {
    let searches = {};
    if (this.props.searchOptions) {
      this.props.searchOptions.forEach(option => {
        if (option.type === 'text') {
          searches[option.propName] = '';
        }
      });
    }
    return searches;
  }

  refreshCurrentPage = () => {
    this.fetch(this.state.page.number)
  }

  fetch = (page) => {
    let config = { params: {} };
    if (this.props.pageSize) {
      config.params.size = this.props.pageSize;
    }
    if (page) {
      config.params.page = page;
    }
    if (this.props.searchOptions) {
      this.props.searchOptions.forEach(option => {
        if (option.type === 'text' && this.state.searches[option.propName] !== '') {
          config.params[option.propName] = this.state.searches[option.propName];
        }
      });
    }
    this.setState(state => ({ requestCount: state.requestCount + 1 }));
    Axios
      .get(this.props.pageUri, config)
      .then(res => {
        this.setState(state => ({ page: res.data }));
      })
      .catch(err => { console.log(err); NotificationManager.danger(translate('Failed to get page')); })
      .then(() => { this.setState(state => ({ requestCount: state.requestCount - 1 })); });

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
      links.push(<li key={pageNum} className='page-item'><button className='page-link' onClick={e => this.fetch(pageNum)}>{pageNum}</button></li>);
      total++;
      leftCounter--;
    }

    links.reverse();

    links.push(<li key={currentPage} className='page-item active'><button className='page-link'>{currentPage}</button></li>);

    let rightCounter = currentPage;
    total = 0;
    while (rightCounter + 1 <= totalPages && total < totalLinks) {
      let pageNum = rightCounter + 1;
      links.push(<li key={pageNum} className='page-item'><button className='page-link' onClick={e => this.fetch(pageNum)}>{pageNum}</button></li>);
      total++;
      rightCounter++;
    }

    return links;
  }

  renderBooleanValue = (value) => {
    return value ?
      <FontAwesomeIcon className='text-success' icon={faCheck}/> :
      <FontAwesomeIcon className='text-danger' icon={faMinus}/>
  }

  reset = () => {
    this.setState({ searches: this.getBlankSearches() }, () => {
      this.fetch(1);
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.fetch(1);
  }

  renderSearchOption = (option, index) => {
    if (option.type === 'text') {
      return <Input
        key={option.propName}
        wrapperAdditionalClasses='col-sm-2'
        label={option.label}
        value={this.state.searches[option.propName]}
        onChange={e => { this.setState({ searches: Object.assign({}, this.state.searches, { [option.propName]: e.target.value }) }); }}
      />
    }
  }

  render() {
    let page = this.state.page;
    return (
      <CardWrapper>
      {this.state.requestCount > 0 ? (<LoaderOverlay />) : null}
      {this.props.searchOptions ? (
        <form onSubmit={this.handleSearch}>
          <div className='row' style={{justifyContent: 'flex-end'}}>
            {this.props.searchOptions.map(this.renderSearchOption)}
            <div className='form-group col-sm-2' style={{ paddingBottom: '.25rem', display: 'flex', alignItems: 'flex-end'}}>
              <button title={translate('Reset filters')} type='button' onClick={this.reset} className='btn btn-outline-dark'><FontAwesomeIcon icon={faBan} /></button>&nbsp;
              <button title={translate('Search')} type='submit' className='btn btn-outline-info'><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
        </form>
      ) : null}
      <div className="table-responsive">
      <table className='table table-bordered table-hover table-sm text-center'>
        <thead>
          <tr>
            {this.props.columnNames.map(name => (<th key={name}>{name}</th>))}
            {this.props.enableOptionsCell === true ? <th></th> : null}
          </tr>
        </thead>
        <tbody>
          {page ? page.content.map(item => {
            return (
              <tr key={item.id}>
                {this.props.cellValueExtractors.map((extractor, index) => {
                  let key = item.id + '|' + index
                  if (typeof extractor === 'string') {
                    let value = item[extractor];
                    if (typeof value === 'boolean') {
                      return <td key={key}>
                        {this.renderBooleanValue(value)}
                      </td>
                    }
                    return <td key={key}>{item[extractor]}</td>
                  } else {
                    let value = extractor(item)
                    return <td key={key}>{typeof value === 'boolean' ? (this.renderBooleanValue(value)) : value}</td>
                  }
                })}
                {this.props.enableOptionsCell === true ? (
                  <td className='text-left'>
                    {this.props.enableEditDelete === true ?
                      <>
                        <Link title={translate('Edit')} to={this.props.formUri + '?entityId=' + item.id} className='btn btn-info btn-sm'><FontAwesomeIcon icon={faEdit}/></Link>&nbsp;
                        <button
                          onClick={e => {
                            this.setState({ idForDelete: item.id }, () => this.__deleteModal.toggle())
                          }}
                          title={translate('Delete')}
                          className='btn btn-danger btn-sm'
                        ><FontAwesomeIcon icon={faTrashAlt}/></button>
                      </> : null}
                    {this.props.additionalOptions ? this.props.additionalOptions(item) : null}
                  </td>
                ) : null}
              </tr>
            )
          }) : null}
        </tbody>
        <tfoot></tfoot>
      </table>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <nav>
        <ul className='pagination pagination-sm mb-0'>
          <li className={'page-item ' + (page == null || page.first ? 'disabled' : '')}>
            <button
              className='page-link'
              onClick={e => (page != null && !page.first ? this.fetch(page.number - 1) : null)}
            >&nbsp;<FontAwesomeIcon icon={faChevronLeft} />&nbsp;</button>
          </li>
          {this.renderPaginationPages(page)}
          <li className={'page-item ' + (page == null || page.last ? 'disabled' : '')}>
            <button
              className='page-link'
              onClick={e => (page != null && !page.last ? this.fetch(page.number + 1) : null)}
            >&nbsp;<FontAwesomeIcon icon={faChevronRight} />&nbsp;</button>
          </li>
        </ul>
      </nav>
      </div>
      </div>
      {this.props.enableOptionsCell === true && this.props.enableEditDelete === true ? (
        <Modal
          ref={ref => this.__deleteModal = ref}
          title={translate('Confirmation required')}
          renderBody={() => { return (<div>{translate('Are you sure you want to delete entity?')}</div>) }}
          renderFooter={() => { return (
            <>
              <button type='button' className='btn btn-danger' onClick={e => {
                this.setState(state => ({ requestCount: state.requestCount + 1 }));
                Axios
                  .delete(this.props.entityUri + '/' + this.state.idForDelete)
                  .then(res => {
                    this.__deleteModal.toggle()
                    this.fetch(this.state.page.number)
                  })
                  .catch(err => { console.log(err); NotificationManager.danger(translate('Failed to delete entity')); })
                  .then(() => { this.setState(state => ({ requestCount: state.requestCount - 1 })); });
              }}>Delete</button>
              <button type='button' className='btn btn-secondary' onClick={e => { this.__deleteModal.toggle(); }}>Close</button>
            </>
          )}}
        />
      ) : null}
      </CardWrapper>
    )
  }

}

export default ApiTable;