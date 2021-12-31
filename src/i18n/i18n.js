import login from './login';
import resetPassword from './resetPassword';
import profile from './profile';
import button from './button';
import selectTagsDialog from './selectTagsDialog';

function flattenObject(ob, prefix = '') {
  const toReturn = {}
  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue

    if ((typeof ob[i]) === 'object') {
      const flatObject = flattenObject(ob[i], prefix + i + '.');
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue
        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[prefix + i] = ob[i]
    }
  }
  return toReturn
}

const i18n = {
  ...login,
  ...resetPassword,
  ...profile,
  ...button,
  ...selectTagsDialog,
};

export default flattenObject(i18n)
