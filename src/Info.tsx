// Info.tsx
import Password from 'antd/es/input/Password';
import { makeObservable, observable, action } from 'mobx';

export interface BasicInfo {
  nume: string;
  prenume: string;
  nrTelefon: string;
  email: string;
  adresa: string;
}

export interface ExtendedInfo extends BasicInfo {
  ocupatie: string;
  permisConducere: string;
}

class InfoStore {
  info: ExtendedInfo = {
    nume: '',
    prenume: '',
    nrTelefon: '',
    email: '',
    adresa: '',
    ocupatie: '',
    permisConducere: '',
  };

  constructor() {
    makeObservable(this, {
      info: observable,
      setInfo: action,
    });
  }

  setInfo(info: ExtendedInfo) {
    this.info = info;
  }
}

export default new InfoStore();
