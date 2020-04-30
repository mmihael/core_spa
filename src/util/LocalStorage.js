import Strings from 'multilanguage/Strings';

const validLanguages = Object.keys(Strings);

export default {

  getActiveLanguage: () => {
    return (localStorage.activeLanguage && validLanguages.indexOf(localStorage.activeLanguage) !== -1) ?
      localStorage.activeLanguage :
      validLanguages[0];
  },

  setActiveLanguage: (activeLanguage) => {
    const activeLanguageLc = activeLanguage.toLowerCase();
    if (validLanguages.indexOf(activeLanguageLc) !== -1) {
      localStorage.activeLanguage = activeLanguageLc;
    }
  }

};