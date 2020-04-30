import Strings from 'multilanguage/Strings'
import LocalStorage from 'util/LocalStorage'

const getActiveLanguage = () => { return LocalStorage.getActiveLanguage(); };

export default {
  translate: (string) => {
    const translation = Strings[getActiveLanguage()][string];
    return translation ? translation : string;
  }
};