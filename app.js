import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import Main from './Main.jsx'
import Systems from './systems/Systems.jsx'
import OrgStructure from './userManager/orgStructure/OrgStructure.jsx';
import UserGroups from './userManager/userGroups/UserGroups.jsx';
import Templates from './templates/Templates.jsx';
import Access from './access/Access.jsx';
import VirtualMachines from './virtualMachineManager/VirtualMachines.jsx';
import Antivirus from './security/antivirus/Antivirus.jsx';
import Integrity from './security/integrity/Integrity.jsx';
import AccessToDevices from './security/accessToDevices/AccessToDevices.jsx';
import Events from './security/events/Events.jsx';
import Apsv from './networking/apsv/Apsv.jsx';
import Tdsv from './networking/tdsv/Tdsv.jsx';
import FileStorageServers from './fileStorageServers/FileStorageServers.jsx';
import Email from './email/Email.jsx';
import SintezSrk from './srk/sintezSrk/SintezSrk.jsx';
import SrkOvm from './srk/srkOvm/SrkOvm.jsx';
import SintezKuf from './sintezKuf/SintezKuf.jsx';
import Repository from './softwareRepository/Repository.jsx';
import Settings from './settings/Settings.jsx';
import Select from 'react-select';
import MessageSystem from './components/message-system/MessageSystem.jsx';
import ModalWindow from './components/modal-window/ModalWindow.jsx';
import Loading from './components/loading-animation/LoadingAnimationDialog.jsx';
import SoundNotify from './components/sound-notify/SoundNotify.jsx';


import './App.css';
import {
    Nav,
    Badge, Form, FormGroup, Col, ControlLabel,
} from 'react-bootstrap';

import {Router, Route, Switch, Redirect} from 'react-router';
import {BrowserRouter, Link, NavLink} from 'react-router-dom';

import './node_modules_modify/admin-lte/dist/css/AdminLTE.min.css';
import './node_modules_modify/admin-lte/dist/css/skins/skin-blue.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            mode: '',
            authorization: false,
            showMenu: false,
            selectedHost: "",
            hostLabel: "",
            selectOneHost: [],
            sidebarCollapse: false,
            selectOneKsa: [],
            ksa: null,
            securityEvents: [],
            bill: null
        }
    }

    getChildContext() {
        return {
            ksa: this.state.ksa,
            ksaList: this.state.selectOneKsa
        };
    }

    componentDidMount() {
        let url = 'rest/automated_system/astopmenu/';
        let method = 'GET';
        let selectOneKsa = [];
        let allKsa = {
            value: 'all_ksa',
            label: 'Все КСА',
            ksaObject: 'all_ksa'
        };
        let isChange = false;
        fetch(url, {method}).then(
            result => {
                result.json()
                    .then((json1) => {

                        selectOneKsa.push(allKsa);

                        json1.map((as) => {
                                selectOneKsa.push({
                                    value: as.id,
                                    label: as.name,
                                    disabled: true
                                });

                                as.ksa_id.map((ksa) => {
                                    selectOneKsa.push({
                                        value: ksa.id,
                                        label: `${ksa.name} (${ksa.orgstructnode_id !== null ? ksa.orgstructnode_id.name : ''})`,
                                        ksaObject: ksa
                                    });
                                });
                            }
                        )
                    })
            }
        ).then(() => {
            this.setState({
                selectOneKsa: selectOneKsa,
                ksa: allKsa
            })
        });
        // this.getSecurityEvents();
        setInterval(() => {
            console.log('1')
            this.getSecurityEvents()
            {this.state.json['4065e5d6-4f47-4282-a45e-a951e8760257']!=undefined &&  this.state.json['4065e5d6-4f47-4282-a45e-a951e8760257'].count>0 ? SoundNotify.getInstance().playCritical() : null}

        }, 5000);

    }

    getSecurityEvents() {
        fetch('/rest/systemevents/system_event_alert/')
            .then(result => result.json())
            .then(json => {
                    json = Object.keys(json).map(key => {
                        return json[key]
                    });
                    this.setState({
                        securityEvents: json,
                    })
                    //SoundNotify.getInstance().playCritical();
                }
          );
    }

    // srkGetHosts() {
    //     document.getElementById('srkframe').style.display = "block";
    //     document.getElementById('loading').style.display = "none";
    //
    //     let srkHosts = [];
    //     let srkDomHosts = document.getElementById('srkframe').contentWindow.document.getElementsByTagName('select')[0].options;
    //     for (let i = 1; i < srkDomHosts.length; i++) {
    //         srkHosts.push({value: srkDomHosts[i].value, label: srkDomHosts[i].label});
    //     }
    //
    //     this.setState({
    //         selectOneHost: srkHosts
    //     })
    // }

    // kufRemoveMenu() {
    //     document.getElementById('kufframe').contentWindow.document.getElementById('mmenu').remove();
    //     document.getElementById('loading').style.display = "none";
    //     document.getElementById('kufframe').style.display = "block";
    // }

    onSelect(selectedKey) {
        this.setState({
            mode: selectedKey !== undefined ? selectedKey : ""
        })
    }

    // setHostOnChange(event) {
    //     this.setState({
    //         selectedHost: event.value,
    //         hostLabel: event.label,
    //         mode: "srkHostStatus"
    //     })
    // }

    setKsaOnChange(event) {
        this.setState({
            ksa: event
        })
    }

    toggleSidebar() {
        this.setState({sidebarCollapse: !this.state.sidebarCollapse});
        setTimeout(() => {
            this.forceUpdate();
        }, 500)
    }


    setNewcomponent(provProps, nextProps) {
        if (provProps.securityEvents.count !== nextProps.securityEvents.count) {
            this.setState({bill: this.state.securityEvents})
        }
    }


    render() {
        return (
            <div
                className={this.state.sidebarCollapse ? 'skin-blue sidebar-mini sidebar-collapse' : 'skin-blue sidebar-mini'}>
                <MessageSystem/>
                <ModalWindow/>
                <Loading/>

                <BrowserRouter>
                    <div className="wrapper" style={{position: 'initial'}}>
                        <header className="main-header">
                            <div className="logo">
                                <span className="logo-mini"><i className="fa fa-gears"/></span>
                                <span className="logo-lg"><b>ПОРТАЛ УПРАВЛЕНИЯ</b></span>

                            </div>

                            <nav className="navbar navbar-static-top">
                                <div className="sidebar-toggle" data-toggle="offcanvas" role="button"
                                     onClick={this.toggleSidebar}>
                                </div>
                                {!document.getElementById('entry_point') || this.state.mode != '' ?
                                    <div className="navbar-custom-menu" id="ksa">


                                        <ul className="nav navbar-nav">

                                            <li>
            <span
                style={{
                    color: '#fff',
                    lineHeight: '48px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                }}>КСА: </span>
                                            </li>
                                            <li style={{margin: '5px'}}>
                                                <Select className="select-ksa" placeholder="Выберите ..."
                                                        value={this.state.ksa}
                                                        noResultsText="КСА отсутствуют"
                                                        clearable={false}
                                                        searchable={false}
                                                        options={this.state.selectOneKsa}
                                                        onChange={this.setKsaOnChange}
                                                        style={{width: '300px'}}/>
                                            </li>
                                            <li className="dropdown notifications-menu" style={{marginRight: '10px'}}>
                                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                                    <i className="fa fa-bell-o"></i>
                                                    <span className="label label-warning">10</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div> : null}
                            </nav>
                        </header>

                        <aside className="main-sidebar">
                            <section className="sidebar" style={{height: 'auto'}}>
                                <Nav className="sidebar-menu">
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('systems')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/systems' activeClassName='navLink-active'><i*/}
                                    {/*className="fa fa-gear"/><span>&nbsp;Автоматизированная система</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('orgStructure')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/orgStructure' activeClassName='navLink-active'>*/}
                                    {/*<i className='fa fa-sitemap'/><span>&nbsp;*/}
                                    {/*Организационная<br/>структура</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('usersGroups')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/usersGroups' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-users'/>*/}
                                    {/*&nbsp;<span>Группы пользователей / Пользователи</span>*/}

                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('templates')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/templates' activeClassName='navLink-active'><i*/}
                                    {/*className="fa fa-clone"/><span>&nbsp;Шаблоны</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('access')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/access' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-lock'/>*/}
                                    {/*<span>&nbsp;Настройка разграничения доступа</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('virtualMachines')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/virtualMachines' activeClassName='navLink-active'>*/}
                                    {/*<i className='fa fa-tachometer'/>*/}
                                    {/*<span>&nbsp;Мониторинг</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('apsv')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/apsv' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-desktop'/><i*/}
                                    {/*className={this.state.sidebarCollapse ? 'fa fa-exchange fa-rotate-90' : 'fa fa-exchange'}*/}
                                    {/*style={!this.state.sidebarCollapse ? {*/}
                                    {/*marginLeft: '5px',*/}
                                    {/*marginRight: '5px'*/}
                                    {/*} : {margin: '1px'}}/>*/}
                                    {/*<i className='fa fa-globe'/>*/}
                                    {/*<span>&nbsp;АПСВ</span></NavLink>*/}
                                    {/*</li>*/}

                                    {/*<li onClick={() => {
                                     this.onSelect('tdsv')
                                     }}>
                                     <NavLink to='/tdsv' activeClassName='navLink-active'><i
                                     className='fa fa-desktop'/><i
                                     className={this.state.sidebarCollapse ? 'fa fa-exchange fa-rotate-90' : 'fa fa-exchange'}
                                     style={!this.state.sidebarCollapse ? {
                                     marginLeft: '5px',
                                     marginRight: '5px'
                                     } : {margin: 0}}/>
                                     <i className='fa fa-desktop'/>
                                     <span>&nbsp;ТДСВ</span>
                                     </NavLink>
                                     </li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('fileStorageServers')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/fileStorageServers' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-desktop'/><i*/}
                                    {/*className={this.state.sidebarCollapse ? 'fa fa-exchange fa-rotate-90' : 'fa fa-exchange'}*/}
                                    {/*style={!this.state.sidebarCollapse ? {*/}
                                    {/*marginLeft: '5px',*/}
                                    {/*marginRight: '5px'*/}
                                    {/*} : {margin: 0}}/>*/}
                                    {/*<i className='fa fa-server'/>*/}
                                    {/*<span>&nbsp;СФХ</span></NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('email')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/email' activeClassName='navLink-active'>*/}
                                    {/*<i className='fa fa-envelope'/>*/}
                                    {/*<span>&nbsp;Электронная почта</span></NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('sintezSrk')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/sintezSrk' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-history'/>*/}
                                    {/*<span>&nbsp;Синтез-СРК</span></NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('srkOvm')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/srkOvm' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-history'/>*/}
                                    {/*<span>&nbsp;СРК ОВМ</span></NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('sintezKuf')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/sintezKuf' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-eye'/>*/}
                                    {/*<span>&nbsp;Синтез-КУФ</span></NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('repository')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to="/repository" activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-database'/>*/}
                                    {/*<span>&nbsp;Репозиторий</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('adressBook')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/adressBook' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-address-book'/>*/}
                                    {/*<span>&nbsp;Адресная книга</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('antivirus')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/antivirus' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-bug'/>*/}
                                    {/*<span>&nbsp;Антивирусная защита</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('integrity')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/integrity' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-lock'/>*/}
                                    {/*<span>&nbsp;Контроль целостности</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*this.onSelect('accessToDevices')*/}
                                    {/*}}>*/}
                                    {/*<NavLink to='/accessToDevices' activeClassName='navLink-active'><i*/}
                                    {/*className='fa fa-usb'/><span*/}
                                    {/*>&nbsp; Разграничение доступа к устройствам</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</li>*/}
                                    <li onClick={() => {
                                        this.onSelect('settings')
                                    }}>
                                        <NavLink to='/settings' activeClassName='navLink-active'><i
                                            className='fa fa-wrench'/>
                                            <span>&nbsp;Системные настройки</span>
                                        </NavLink>
                                    </li>
                                    <li onClick={() => {
                                        this.onSelect('events')
                                    }}>
                                        <NavLink to='/events' activeClassName='navLink-active'><i
                                            className='fa fa-shield'/>
                                            <span>&nbsp;События безопасности
        <br/>
                                                {this.state.securityEvents.map(item => {
                                                    return item.count !== 0 ? <Badge style={{
                                                        backgroundColor: item.color,
                                                        color: '#1e282c'
                                                    }}>{item.count}</Badge> : null
                                                })}
                                                {/*<Badge bsClass="badge alert-danger">0</Badge>*/}
                                                {/*<Badge bsClass="badge alert-warning">0</Badge>*/}
                                                {/*<Badge>0</Badge>*/}
        </span>
                                        </NavLink>
                                    </li>
                                </Nav>
                            </section>
                        </aside>
                        <div className="content-wrapper">
                            <Route exact path="/" component={Main}/>
                            <Route exact path="/systems" component={Systems}/>
                            <Route exact path="/orgstructure" component={OrgStructure}/>
                            <Route exact path="/usersgroups" render={() => <UserGroups ksa={this.state.ksa}/>}/>
                            <Route exact path="/users" render={() => <Users ksa={this.state.ksa}/>}/>
                            <Route exact path="/templates" render={() => <Templates ksaList={this.state.selectOneKsa}
                                                                                    ksa={this.state.ksa}/>}/>
                            <Route exact path="/access" component={Access}/>
                            <Route exact path="/virtualMachines"
                                   render={() => <VirtualMachines ksa={this.state.ksa}/>}/>
                            <Route exact path="/apsv" component={Apsv}/>
                            <Route exact path="/tdsv" component={Tdsv}/>
                            <Route exact path="/fileStorageServers" component={FileStorageServers}/>
                            <Route exact path="/email" component={Email}/>
                            <Route exact path="/repository" component={Repository}/>
                            <Route exact path="/antivirus" component={Antivirus}/>
                            <Route exact path="/integrity" component={Integrity}/>
                            <Route exact path="/accessToDevices" component={AccessToDevices}/>
                            <Route exact path="/events" component={Events}/>
                            <Route exact path="/sintezSrk" component={SintezSrk}/>
                            <Route exact path="/srkOvm" component={SrkOvm}/>
                            <Route exact path="/sintezKuf" component={SintezKuf}/>
                            <Route exact path="/settings"
                                   render={() => <Settings ksaList={this.state.selectOneKsa}/>}/>
                        </div>

                        <footer className="app-footer main-footer">
                            <div className="pull-right hidden-xs">
                                <b>Версия</b> 0.8.1
                            </div>
                            <strong>Портал Управления. 2018</strong>
                        </footer>
                    </div>
                </BrowserRouter>

            </div>
        );
    }
}

App.childContextTypes = {
    ksa: PropTypes.object,
    ksaList: PropTypes.array
};

export default App;
