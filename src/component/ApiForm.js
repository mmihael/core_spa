import React, { Component } from 'react';
import Axios from 'client/Axios';
import LoaderOverlay from 'component/LoaderOverlay';
import CardWrapper from 'component/CardWrapper';
import Input from 'component/form/Input';
import Checkbox from 'component/form/Checkbox';
import Select from 'component/form/Select';
import MainRouter from 'util/MainRouter';
import Translator from 'multilanguage/Translator';
import NotificationManager from 'util/NotificationManager';
const translate = Translator.translate;

class ApiForm extends Component {

  constructor(props) {
    super(props)
    this.validateProps()
    this.state = { requestCount: 0 }
    let editedId = null
    let params = new URLSearchParams(window.location.search)
    let entityId = params.get('entityId')
    if (entityId) {
      editedId = parseInt(entityId)
    }
    this.state.editedId = editedId;
    let entity = {}
    this.getActiveElements().forEach(element => {
      if (element.type === 'input') {
        entity[element.propSelector] = ''
      } else if (element.type === 'checkbox') {
        entity[element.propSelector] = false
      } else if (element.type === 'select') {
        entity[element.propSelector] = null
      }
    })
    this.state.entity = entity;
  }

  validateProps = () => {
    let inputIdSet = new Set()
    this.props.elements.forEach(element => {
      if (element.inputId == null) {
        throw new Error('Each element must have inputId prop')
      }
      inputIdSet.add(element.inputId)
    })
    if (this.props.elements.length !== inputIdSet.size) {
      throw new Error('Some of inputIds are duplicated, each element must have unique inputId')
    }
  }

  componentDidMount = () => {
    this.setupForm();
  }

  setupForm = () => {
    let stateKeys = []
    let promises = []
    this.getActiveElements().filter(element => element.loadOptions != null).forEach(element => {
      promises.push(element.loadOptions)
      stateKeys.push('__options:' + element.inputId)
    });
    if (this.state.editedId) {
      promises.push(this.getEditedEntityPromise(this.state.editedId));
    }
    this.setState(state => ({ requestCount: state.requestCount + 1 }));
    Promise
      .all(promises)
      .then(res => {
        res.forEach((value, index) => {
          if (index < stateKeys.length) {
            this.setState({ [stateKeys[index]]: value })
          } else {
            let entity = {}
            this.getActiveElements().forEach(element => {
              if (element.optionsToEntityMapper) {
                entity[element.propSelector] = element.optionsToEntityMapper(value.data, this.state['__options:' + element.inputId])
              } else {
                entity[element.propSelector] = value.data[element.propSelector]
              }
            })
            this.setState({ entity })
          }
        })
      })
      .catch(err => { console.log(err); NotificationManager.danger(translate('Failed to get required form data')) })
      .then(() => { this.setState(state => ({ requestCount: state.requestCount - 1 })); })
  }

  handleSubmit = e => {
    e.preventDefault();
    let isEdit = this.state.editedId != null;
    if (isEdit) {
      this.updateEntity();
    } else {
      this.createEntity();
    }
  }

  getEditedEntityPromise = (id) => {
    return Axios.get(this.props.entityUriRoot + '/' + id)
  }

  createEntity = () => {
    let requestEntity = this.buildRequestObject();
    this.setState(state => ({ requestCount: state.requestCount + 1 }));
    Axios
      .post(this.props.entityUriRoot, requestEntity)
      .then(res => {
        NotificationManager.success(this.props.createSuccessMessage);
        if (this.props.createSuccessRedirect) {
          MainRouter.getRouter().history.push(this.props.createSuccessRedirect);
        }
      })
      .catch(err => {
        console.log(err);
        NotificationManager.danger(this.props.createErrorMessage);
      })
      .then(res => { this.setState(state => ({ requestCount: state.requestCount - 1 })); })
  }

  updateEntity = () => {
    let requestEntity = this.buildRequestObject();
    this.setState(state => ({ requestCount: state.requestCount + 1 }));
    Axios
      .put(this.props.entityUriRoot + '/' + this.state.editedId, requestEntity)
      .then(res => {
        NotificationManager.success(this.props.updateSuccessMessage);
        if (this.props.createSuccessRedirect) {
          MainRouter.getRouter().history.push(this.props.updateSuccessRedirect);
        }
      })
      .catch(err => {
        console.log(err);
        NotificationManager.danger(this.props.updateErrorMessage);
      })
      .then(res => { this.setState(state => ({ requestCount: state.requestCount - 1 })); })
  }

  buildRequestObject = () => {
    let requestEntity = {};
    this.getActiveElements().forEach(element => {
      let value = null;
      if (element.type === 'input') {
        value = this.state.entity[element.propSelector]
      } else if (element.type === 'checkbox') {
        value = this.state.entity[element.propSelector] === true
      } else if (element.type === 'select') {
        if (element.isMulti) {
          value = this.state.entity[element.propSelector] ? this.state.entity[element.propSelector].map(el => parseInt(el.value)) : null;
        } else {
          value = this.state.entity[element.propSelector] ? parseInt(this.state.entity[element.propSelector].value) : null;
        }
      }
      requestEntity[element.propSelector] = value
    })
    return requestEntity
  }

  renderInput = (element, index) => {
    return <Input
      key={index}
      label={element.label}
      inputId={element.inputId}
      inputType={element.inputType ? element.inputType : 'text'}
      value={this.state.entity[element.propSelector]}
      onChange={event => {
        let value = event.target.value
        this.setState(state => ({ entity: Object.assign({}, this.state.entity, { [element.propSelector]: value }) }));
      }}
    />
  }

  renderCheckbox = (element, index) => {
    return <Checkbox
      key={index}
      inputId={element.inputId}
      label={element.label}
      checked={this.state.entity[element.propSelector] === true}
      onChange={event => {
        this.setState(state => ({ entity: Object.assign({}, state.entity, { [element.propSelector]: !(this.state.entity[element.propSelector] === true) }) }));
      }}
    />
  }

  renderSelect = (element, index) => {
    return <Select
      key={index}
      inputId={element.inputId}
      label={element.label}
      isMulti={element.isMulti}
      options={element.loadOptions ? this.state['__options:' + element.inputId] : element.options}
      value={this.state.entity[element.propSelector]}
      onChange={data => {
        this.setState(state => ({ entity: Object.assign({}, state.entity, { [element.propSelector]: data }) }));
      }}
    />
  }

  renderElement = (element, index) => {
    if (element.type === 'input') {
      return this.renderInput(element, index)
    } else if (element.type === 'checkbox') {
      return this.renderCheckbox(element, index)
    } else if (element.type === 'select') {
      return this.renderSelect(element, index)
    }
  }

  getActiveElements() {
    let isEdit = this.state.editedId != null;
    return this.props.elements.filter(element => { return isEdit ? !element.excludeOnEdit : true; });
  }

  render() {
    return (
      <CardWrapper>
        {this.state.requestCount > 0 ? (<LoaderOverlay />) : null}
        <form onSubmit={this.handleSubmit}>
          {this.getActiveElements().map(this.renderElement)}
          <div className='text-right'>
            <button type='submit' className='btn btn-primary'>{translate('Submit')}</button>
            {this.props.cancelButtonRedirect ? (<>&nbsp;<button
              type='button'
              className='btn btn-secondary'
              onClick={e => { MainRouter.getRouter().history.push(this.props.cancelButtonRedirect); }}
            >{translate('Cancel')}</button></>) : null}
          </div>
        </form>
      </CardWrapper>
    )
  }

}

export default ApiForm;