import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { AntDesignOutlined, UserOutlined, GithubOutlined, LinkOutlined,LogoutOutlined, ClearOutlined, CheckOutlined, EditOutlined, DeleteOutlined, FormOutlined, TeamOutlined, PlusOutlined} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Input, FloatButton, Descriptions, Card, Button, Alert} from 'antd';

import Info, {ExtendedInfo} from './Info';
import InfoC, {ContactInfo} from './InfoC';
import Log from './Log';
import { getLocalStorageData, updateLocalStorageData, checkAndSaveInitialData } from './storage';

const { Header, Content, Sider } = Layout;

interface Item {
  key: string;
  icon: JSX.Element;
  label: string;
  to:string;
}

function getItem(label: string, key: string, icon: JSX.Element,to: string): Item {
  return {
    key,
    icon,
    label,
    to,
  };
}

const items: Item[] = [
  getItem('Info', '1', <UserOutlined />, '/User/info'),
  getItem('Edit Info', '2', <EditOutlined />, '/User/edit-info'),
  getItem('Contacte', '3', <TeamOutlined />, '/User/contacte'),
  getItem('Adaugare Contacte', '4', <FormOutlined />, '/User/adaugare-contacte'),
  getItem('Link-uri', '5', <LinkOutlined />, '/User/link-uri'),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('1');
  const [,setSubmittedData] = useState<ExtendedInfo | null>(null);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [,setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 
  const [loggedIn, setLoggedIn] = useState<boolean>(false); 
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false); 
        checkAndSaveInitialData(); 
        if (selectedMenuItem === '1') {
          const data = getLocalStorageData();
          if (data.info && ('nume' in data.info)) { 
            Info.setInfo(data.info);
          } else {
            Info.setInfo({
              nume: '',
              prenume: '',
              nrTelefon: '',
              email: '',
              adresa: '',
              ocupatie: '',
              permisConducere: '',
            });
          }
        }
        
        if (selectedMenuItem === '3') {
          const data = getLocalStorageData();
          setContacts(data.contacts || []);
        }
      }, 2000); 
    };

    fetchData(); 

  }, [selectedMenuItem]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const timestamp = localStorage.getItem('timestamp');
    if (token && timestamp) {
      const expirationTime = parseInt(timestamp) + 10 * 60 * 1000; //timpul sesiunii
      if (Date.now() < expirationTime) {
        setLoggedIn(true);
        localStorage.setItem('timestamp', Date.now().toString());
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('timestamp');
        setLoggedIn(false);
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  const InputChange = (field: string, value: string) => {
    if (field === 'username') {
      setUsername(value);
    } else if (field === 'password') {
      setPassword(value);
    }
  };

  const handleLogin = () => {
    if (username === Log.infoL.Username && password === Log.infoL.Password) {
      setLoggedIn(true);
      const token = 'LoggedIn'; 
      localStorage.setItem('token', token);
      localStorage.setItem('timestamp', Date.now().toString());
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('timestamp');
    setUsername('');
    setPassword('');
    setLoggedIn(false);
};

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenuItem(key);
  };

  const handleInputChange = (field: string, value: string, targetObject: 'Info' | 'InfoC') => {
    const regexLettersOnly = /^[a-zA-Z\s]+$/;
    const regexNumbersOnly = /^[0-9]+$/;
    const regexAddress = /^[a-zA-Z0-9\s-.]+$/;
    const regexDrivingLicense = /^[ABCDE12,;]+$/;

    switch (field) {
      case 'nume':
      case 'prenume':
      case 'ocupatie':
        if (regexLettersOnly.test(value) || value === '') {
          if (targetObject === 'Info') {
            Info.setInfo({ ...Info.info, [field]: value });
          } else if (targetObject === 'InfoC') {
            InfoC.setInfo({ ...InfoC.infoC, [field]: value });
          }
        }
        break;
      case 'nrTelefon':
        if (regexNumbersOnly.test(value) || value === '') {
          if (targetObject === 'Info') {
            Info.setInfo({ ...Info.info, [field]: value });
          } else if (targetObject === 'InfoC') {
            InfoC.setInfo({ ...InfoC.infoC, [field]: value });
          }
        }
        break;
      case 'adresa':
        if (regexAddress.test(value) || value === '') {
          if (targetObject === 'Info') {
            Info.setInfo({ ...Info.info, [field]: value });
          } 
        }
        break;
      case 'permisConducere':
        if (regexDrivingLicense.test(value) || value === '') {
          if (targetObject === 'Info') {
            Info.setInfo({ ...Info.info, [field]: value });
          }
        }
        break;
      case 'email':
        if (targetObject === 'Info') {
          Info.setInfo({ ...Info.info, [field]: value });
        } 
        break;
      default: break;
    }
  };

  const handleSubmit = () => {
    setSubmittedData(Info.info);
    updateLocalStorageData((data) => {
      data.info = Info.info;
    Clear();
    });
  };
  
  const Clear = () =>{
    Info.setInfo({
      nume: '',
      prenume: '',
      nrTelefon: '',
      email: '',
      adresa: '',
      ocupatie: '',
      permisConducere: '',
    });
  }

  const handleClear = () => {
    Clear();
    setSubmittedData(null);
    updateLocalStorageData((data) => {
      data.info = null;
    });
  };

  const ContactClear = () => {
    InfoC.setInfo({
      nume: '',
      prenume: '',
      nrTelefon: '',
    });
  };
  
  const handleAddContact = () => {
    setContacts([...contacts, InfoC.infoC]); 
    updateLocalStorageData((data) => {
      data.contacts.push(InfoC.infoC);
    ContactClear();
    });
  };
  
  const handleDeleteContact = (index: number) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
    updateLocalStorageData((data) => {
      data.contacts.splice(index, 1);
    });
  };

  const handleEditContact = (index: number) => {
    const editedContact = contacts[index]; 
    const nume = prompt('Nume:', editedContact.nume) || editedContact.nume;
    const prenume = prompt('Prenume:', editedContact.prenume) || editedContact.prenume;
    const nrTelefon = prompt('Nr. telefon:', editedContact.nrTelefon) || editedContact.nrTelefon;
  
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...editedContact, nume, prenume, nrTelefon };
    setContacts(updatedContacts);
  
    updateLocalStorageData((data) => {
      data.contacts[index] = { ...editedContact, nume, prenume, nrTelefon };
    });
  };

    return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {loggedIn ? (
          <>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
              <div className="demo-logo-vertical" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleMenuClick}>
                {items.map((item) => (
                  <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.to}>{item.label}</Link>
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ padding: 0, background: colorBgContainer }} />
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>{items.find((item) => item.key === selectedMenuItem)?.label}</Breadcrumb.Item>
                </Breadcrumb>
              <div
                style={{
                  padding: 24,
                  minHeight: 560,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  position: 'relative',
                }}
              >
            {selectedMenuItem === '2' && ( //Edit Info
              <div style={{ position: 'relative' }}>
                <p>Nume:</p>
                <Input
                  placeholder="Nume"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={Info.info.nume}
                  onChange={(e) => handleInputChange('nume', e.target.value, 'Info')}
                />
                <p>Prenume:</p>
                <Input
                  placeholder="Prenume"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={Info.info.prenume}
                  onChange={(e) => handleInputChange('prenume', e.target.value, 'Info')}
                />
                <p>Nr. Telefon:</p>
                <Input
                  placeholder="Nr. Telefon"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={Info.info.nrTelefon}
                  onChange={(e) => handleInputChange('nrTelefon', e.target.value, 'Info')}
                />
                <p>Email:</p>
                <Input
                  placeholder="Email"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={Info.info.email}
                  onChange={(e) => handleInputChange('email', e.target.value, 'Info')}
                />
                <p>Adresa:</p>
                <Input
                  placeholder="Adresa"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={Info.info.adresa}
                  onChange={(e) => handleInputChange('adresa', e.target.value, 'Info')}
                />

                <div style={{ position: 'absolute', left:320, bottom:234}}>
                <p>Ocupație:</p>
                <Input
                  placeholder="Ocupație"
                  variant="filled"
                  style={{ width: '148%' }}
                  value={Info.info.ocupatie}
                  onChange={(e) => handleInputChange('ocupatie', e.target.value, 'Info')}
                />
                <p>Permis de conducere:</p>
                <Input
                  placeholder="Permis de conducere"
                  variant="filled"
                  style={{ width: '148%' }}
                  value={Info.info.permisConducere}
                  onChange={(e) => handleInputChange('permisConducere', e.target.value, 'Info')}
                />
                </div>

                <FloatButton
                  icon={<ClearOutlined />}
                  type="default"
                  style={{ right: 32, border: '3px solid black' }}
                  onClick={handleClear}
                />
                <FloatButton
                  icon={<CheckOutlined />}
                  type="default"
                  style={{ right: 86, border: '3px solid black' }}
                  onClick={handleSubmit}
                />

              </div>
            )}

            {selectedMenuItem === '5' && ( //Link-uri
              <div style={{ position: 'relative' }}>
                <a
                  href="https://github.com/Demian26/Laboratoare-Tweb"
                  style={{
                    position: 'absolute',
                    bottom: -34,
                    left: -10,
                    fontSize: 25,
                    marginLeft: 20,
                    marginBottom: 20,
                    color: 'darkblue',
                  }}
                >
                  <GithubOutlined /> GitHub
                </a>
                <a
                  href="https://ant.design/"
                  style={{
                    position: 'absolute',
                    bottom: -84,
                    left: -10,
                    fontSize: 25,
                    marginLeft: 20,
                    marginBottom: 20,
                    color: 'darkred',
                  }}
                >
                  <AntDesignOutlined /> Ant Design
                </a>
              </div>
            )}

            {selectedMenuItem === '1' && ( //Informatie
              <div style={{ position: 'relative' ,left:-325, top:20}}>
              <Link to="/Login">
              <FloatButton
               icon={<LogoutOutlined />}
               type="default"
               style={{ right: 32, border: '3px solid black', backgroundColor: 'rgb(255, 102, 102)', }}
               onClick={handleLogout} />
              </Link>

              <Descriptions
               column={1}
               style={{ width: '50%', margin: 'auto'}}
              >
               <Descriptions.Item label="Nume">{Info.info.nume}</Descriptions.Item>
               <Descriptions.Item label="Prenume">{Info.info.prenume}</Descriptions.Item>
               <Descriptions.Item label="Nr. Telefon">{Info.info.nrTelefon}</Descriptions.Item>
               <Descriptions.Item label="Email">{Info.info.email}</Descriptions.Item>
               <Descriptions.Item label="Adresa">{Info.info.adresa}</Descriptions.Item>
               <Descriptions.Item label="Ocupație">{Info.info.ocupatie}</Descriptions.Item>
               <Descriptions.Item label="Permis de conducere">{Info.info.permisConducere}</Descriptions.Item>
               </Descriptions>

              </div>
            )}
            
            {selectedMenuItem === '3' && ( //Contacte
               <div style={{ position: 'relative' }}>
               {contacts.map((contact, index) => (
                 <Card key={index} style={{ marginBottom: '10px', width: 600, backgroundColor: 'rgb(240, 240, 240)'}}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                       <p>Nume: {contact.nume}</p>
                       <p>Prenume: {contact.prenume}</p>
                       <p>Nr. Telefon: {contact.nrTelefon}</p>
                     </div>
                     <div>
                       <Button
                         type="text"
                         danger
                         icon={<DeleteOutlined />}
                         onClick={() => handleDeleteContact(index)}
                         style={{ marginRight: '10px' }}
                       />
                       <Button
                         type="text"
                         icon={<EditOutlined />}
                         onClick={() => handleEditContact(index)}
                       />
                     </div>
                   </div>
                 </Card>
               ))}
             </div>
            )}

            {selectedMenuItem === '4' && ( //Adaugare contacte
              <div style={{ position: 'relative' }}>
                <p>Nume:</p>
                <Input
                  placeholder="Nume"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={InfoC.infoC.nume}
                  onChange={(e) => handleInputChange('nume', e.target.value, 'InfoC')}
                />
                <p>Prenume:</p>
                <Input
                  placeholder="Prenume"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={InfoC.infoC.prenume}
                  onChange={(e) => handleInputChange('prenume', e.target.value, 'InfoC')}
                />
                <p>Nr. Telefon:</p>
                <Input
                  placeholder="Nr. Telefon"
                  variant="filled"
                  style={{ width: '20%' }}
                  value={InfoC.infoC.nrTelefon}
                  onChange={(e) => handleInputChange('nrTelefon', e.target.value, 'InfoC')}
                />

                <FloatButton
                  icon={<PlusOutlined />}
                  type="default"
                  style={{ right: 32, border: '3px solid black' }}
                  onClick={handleAddContact}
                />  
              </div>
            )}
          </div>
            </Content>
          </Layout>
        </>
      ) : (
        <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          flexDirection: 'column', 
        }}>
          <div>
            <h1>Autentificare</h1>
            <Input
              placeholder="Nume de utilizator"
              style={{ marginBottom: 10 }}
              value={username}
              onChange={(e) => InputChange('username', e.target.value)}
            />
            <Input
              placeholder="Parolă"
              type="password"
              style={{ marginBottom: 10 }}
              value={password}
              onChange={(e) => InputChange('password', e.target.value)}
            />
            <Link to="/User/info">
            <Button type="primary" onClick={handleLogin}>Autentificare</Button>
            </Link>
          </div>
          {showAlert && (
            <Alert message="Nume de utilizator sau parolă incorectă!" type="error" style={{ marginTop: 10 }} />
          )}
        </div>
      )}
    </Layout>
  </Router>
  );
};

export default observer(App); 