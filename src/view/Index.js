import React, { Component } from 'react';
import CardWrapper from 'component/CardWrapper';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class Index extends Component {

  render() {
    return (
      <div className='row'>
        <div className='col'>
          <CardWrapper>
            {translate('Total users:')}
          </CardWrapper>
        </div>
        <div className='col'>
          <CardWrapper>
            {translate('Total Organizations:')}
          </CardWrapper>
        </div>
      </div>
    );
  }

}

export default Index;