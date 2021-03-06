import login from './login';
import resetPassword from './resetPassword';
import activateAccount from './activateAccount';
import profile from './profile';
import button from './button';
import form from './form';
import datePicker from './datePicker';
import selectTagsDialog from './selectTagsDialog';
import sideMenu from './sideMenu';
import reviewPage from './reviewPage';
import notifications from './notifications';
import feedback from './feedback';
import setting from './setting';
import modifyPassword from './modifyPassword';

function flattenObject(ob, prefix = '') {
  const toReturn = {};
  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) === 'object') {
      const flatObject = flattenObject(ob[i], prefix + i + '.');
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[prefix + i] = ob[i];
    }
  }
  return toReturn;
}

const i18n = {
  ...login,
  ...resetPassword,
  ...activateAccount,
  ...profile,
  ...button,
  ...form,
  ...datePicker,
  ...selectTagsDialog,
  ...sideMenu,
  ...reviewPage,
  ...notifications,
  ...feedback,
  ...setting,
  ...modifyPassword,
};

export default flattenObject(i18n);
