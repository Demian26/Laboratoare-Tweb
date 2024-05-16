// storage.tsx
import { ExtendedInfo } from './Info';
import { ContactInfo } from './InfoC';

type LocalStorageData = {
  info: ExtendedInfo | null;
  contacts: ContactInfo[];
};

export const getLocalStorageData = (): LocalStorageData => {
  const data = localStorage.getItem('appData');
  return data ? JSON.parse(data) : { info: null, contacts: [] };
};

export const saveLocalStorageData = (data: LocalStorageData): void => {
  localStorage.setItem('appData', JSON.stringify(data));
};

export const updateLocalStorageData = (updateFunction: (data: LocalStorageData) => void): void => {
  const data = getLocalStorageData();
  updateFunction(data);
  saveLocalStorageData(data);
};

export const checkAndSaveInitialData = (): void => {
  const data = getLocalStorageData();
  if (!data.info && data.contacts.length === 0) {

    saveLocalStorageData({
      info: null, 
      contacts: [],
    });
  }
};
