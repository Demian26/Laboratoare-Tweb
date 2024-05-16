// Log.tsx

export interface Login {
  Username: string;
  Password: string;
}

class InfoLog {
  infoL: Login = {
    Username: 'mamaliga',
    Password: 'mamaliga',
  };

  setInfo(Logare: Login) {
    this.infoL = Logare;
  }
}

export default new InfoLog();