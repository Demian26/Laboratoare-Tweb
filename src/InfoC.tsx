// InfoC.tsx
import { makeObservable, observable, action } from 'mobx';

export interface ContactInfo {
  nume: string;
  prenume: string;
  nrTelefon: string;
}

class InfoStore {
  infoC: ContactInfo = {
    nume: '',
    prenume: '',
    nrTelefon: '',
  };

  constructor() {
    makeObservable(this, {
      infoC: observable,
      setInfo: action,
    });
  }

  setInfo(Contacts: ContactInfo) {
    this.infoC = Contacts;
  }
}

export default new InfoStore();