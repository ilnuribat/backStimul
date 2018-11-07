import React, { Component } from 'react';
import { graphql, compose, Query  } from "react-apollo";
import PropTypes from 'prop-types';
// import Autocomplete from 'react-toolbox/lib/autocomplete';
// import belle from 'belle';
import _ from 'lodash';
import { qauf, _url, colorHash } from '../constants';
import 'animate.css';
import { getPrivateChat, user, group, selectUser, allUsers, glossaryStatus, groupMut, getCUser, GRU_QUERY, userTaskUpdated, tempObj, setTemp, getTemp } from '../graph/querys';
import FirstLayout from './Layout';
import ChatPrivate from './ChatPrivate';
import Loading from './Loading';
import Modal from './TaskParts/Modal';
import ChangerForm from './TaskParts/ChangerForm';
import axios from 'axios';
// const countriesArray = ['Spain', 'England', 'USA', 'Thailand', 'Tongo', 'Slovenia', 'Россия', 'Москва'];
// const countriesObject = {'ES-es': 'Spain', 'TH-th': 'Thailand', 'EN-gb': 'England', 'EN-en': 'USA'};
let usernameAss, statusName;

let subsUser = (id,subscribeToMore, refetch) =>{
  return subscribeToMore({
    document: userTaskUpdated,
    variables: { id: id },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newFeedItem = subscriptionData.data.commentAdded;

      refetch().then(()=>{
      });

      // return true;

      // return Object.assign({}, prev, {
      //   user: {
      //     groups: [newFeedItem, ...prev.entry.comments]
      //   }
      // });
    }
  });
};

class GroupList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      allusers: [],
      status: [],
      input: {},
      groupName: "",
      groupId: "",
      groupInfo: {},
      modal: false,
      inputSaver: {},
      newUser: "",
      newAddress: "",
      addressList: [],
    }

    // this.loadg = this.loadg.bind(this);
    // this.loadu = this.loadu.bind(this);
    this.allUserGet = this.allUserGet.bind(this);
    this.userAdd = this.userAdd.bind(this);
    this.glossStatus = this.glossStatus.bind(this);
    this.onStatSelected = this.onStatSelected.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.inputSave = this.inputSave.bind(this);
    this.newUser = this.newUser.bind(this);
    this.newAddress = this.newAddress.bind(this);
    this.addressAdd = this.addressAdd.bind(this);
  }

  componentDidMount(){

    let obj = {name:'name'};
    let arr = [].push(obj);

    this.props.setTemp({
      variables:{
        tempObj:  {stingh: "sa"},
        // tempObj: [{name: "New anme",str: "String", __typename: "str",}],
      }
    })


    const {getPrivateChat, getCUser} = this.props;
    const { users } = this.state;
    let _grid = getPrivateChat.id || localStorage.getItem('grid');

    this.setState({
      groupName: getPrivateChat.name,
      groupId: getPrivateChat.id,
      _grid: getPrivateChat.id,
    });

    // this.loadg();
    // this.loadu(_grid);
    this.allUserGet();
    this.glossStatus();

    if(getCUser.user  && getCUser.user.groups){
      let groups = getCUser.user.groups;
      let thisGrId = getPrivateChat.id || _grid;
      let thisUsers;

      thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

      this.setState({
        groupInfo: thisUsers,
      });

      if(thisUsers && thisUsers.users && users){
        var result1 = isArrayEqual(
          thisUsers.users,
          users
        );

        if( result1 ){
          return false;
        }else{
          this.setState({
            users: [...thisUsers.users],
          });

        }
      }else{
        return false;
      }
    }



  }

  allUserGet(){
    qauf(allUsers(), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        this.setState({
          allusers: a.data.users
        })
      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  changeState(a){
    return false;
  }

  changeGrUsers(a){
    this.setState({
      users: [...a],
    })
  }

  newUser(e){
    // console.log(e.target)
    this.setState({
      newUser: e.target.value,
    })
  }


  newAddress(e){
    this.setState({
      newAddress: e.target.value,
    })
    // this.daDataReqName(e.target.value)
  }


  // loadg(){
  //   qauf(user(localStorage.getItem('userid')), _url, localStorage.getItem('auth-token')).then(a=>{
  //     if(a && a.data.user.groups){
  //       this.changeState(a.data.user.groups);
  //     }
  //   }).catch((e)=>{
  //     console.warn(e);
  //   });
  // }



  loadu(g){

    const {users, _grid } = this.state;
    const {getPrivateChat, getCUser} = this.props;
    let thisUsers;

    if(_grid !== g ){
      this.setState({
        _grid: g,
      });
    }



    if(getCUser.user  && getCUser.user.groups){
      let groups = getCUser.user.groups;
      let thisGrId = getPrivateChat.id || _grid;

      thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

      this.setState({
        groupInfo: thisUsers,
      })

      // if(thisUsers && thisUsers.users && users){
      //   var result1 = isArrayEqual(
      //     thisUsers.users,
      //     users
      //   );

      //   if( result1 ){
      //   }else{
      //     // this.setState({
      //     //   users: [...thisUsers.users],
      //     // });
      //   }
      // }
    }

    // qauf(group(g), _url, localStorage.getItem('auth-token')).then(a=>{
    //   if(a && a.data.group.users && a.data.group.users.length !== users.length){

    //     // this.changeGrUsers(a.data.group.users);
    //     this.setState({
    //       groupName: a.data.group.name,
    //       groupInfo: a.data.group,
    //     });
    //   }
    // })
    //   .then(
    //     ()=>{
    //       if(this.state.groupInfo.assignedTo){
    //         usernameAss = _.find(this.state.groupInfo.users, (obj)=> { return obj.id === this.state.groupInfo.assignedTo; })
    //       }else{
    //         usernameAss = {name: "Не назначен"};
    //       }
    //     }
    //   )
    //   .catch((e)=>{
    //     console.warn(e);
    //   });

  }

  userSelect(n,i){
    const {selectUser} = this.props;

    selectUser({
      variables: { userName: n, userId: i }
    })
  }

  userAdd(i,add){

    let {allusers} = this.state;
    let q;
    let dels = true;
    let userId = "";
    let id = i || this.state.newUser;

    if(add){
      dels = false;
      let user = _.find(allusers, (obj)=> { return obj.username === id; });

      if(user){
        // console.log(user);
        userId = user.id;

      }else{

        console.warn("Неправильный юзер");
      }
    }else{
      userId = id;
    }


    q = () => {return(`mutation{
      updateUsersGroup(group: {id: "${this.props.getPrivateChat.id}", delete: ${dels}, users: ["${userId}"]} )
    }`)} ;

    let a = q();
    // console.log(a);

    // return true;
    if(typeof q === "function"){
      qauf(q(), _url, localStorage.getItem('auth-token')).then(a=>{
        // console.log("Answer updUsrGr",a)
      })
        .then(()=>{
          // this.loadu(this.props.getPrivateChat.id)
        })
        .catch((e)=>{
          console.warn(e);
        });
    }else{
      return false;
    }

  }

  async daDataReqId (id) {
    const res = await axios(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address',

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token a9a4c39341d2f4072db135bd25b751336b1abb83"
        },
        data: {
          "query": id
        }
      })

    return res.data.suggestions[0].data;
  }

  async daDataReqIdPaid (address) {
    const res = await axios(
      'https://dadata.ru/api/v2/clean/address',

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token a9a4c39341d2f4072db135bd25b751336b1abb83",
          // "X-Secret" : "53298fa2e7d1762e0e329388eb3fd66ae4a3312a"
        },
        data: [address]
      })

    return res.data.suggestions[0].data;
  }

  addressAdd(address, addressList){
    // console.warn(address)
    // let addressInsideData = false
    // let streetId = "";

    // addressList && addressList.map((e)=>{
    //   if (e.value === address) {
    //     addressInsideData = true
    //     streetId = e.data.street_fias_id
    //   }
    // })
    // if (!addressInsideData || streetId === "" || !streetId) {
    //   console.warn("НЕТ КООРДИНАТ!!!!!!")
    //   console.warn(addressInsideData, streetId)
    // } else {
    //   this.daDataReqId(address).then(data => {
    //     console.warn(data)
    //     let param = `address:{
    //       geoLat: "${data.geo_lat}",
    //       geoLon: "${data.geo_lon}",
    //       value: "${address}",
    //       coordinates: ["${data.geo_lat}","${data.geo_lon}"]
    //     }`;
    //     const A = groupMut(this.props.getPrivateChat.id, `${param}`);

    //     qauf(A, _url, localStorage.getItem('auth-token')).then(a=>{
    //       console.warn(a)
    //     })
    //       .catch((e)=>{
    //         console.warn(e);
    //       });

    //     console.warn(param)
    //   }
    //   )
    // }

    let param = `address: "${address}"`;
    const A = groupMut(this.props.getPrivateChat.id, `${param}`);

    qauf(A, _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn(a)
    })
      .catch((e)=>{
        console.warn(e);
      });
  }


  glossStatus(){

    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
      this.setState({
        status: [" ",...a.data.glossary.taskStatuses]
      });
    })
      .catch((e)=>{
        console.warn(e);
      });
  }

  onStatSelected(e){

    qauf(groupMut(this.props.getPrivateChat.id, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      // console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }

  onUserSelected(e){

    qauf(groupMut(this.props.getPrivateChat.id, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      // console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }
  inputSave(){

  }

  inputChange(e){

  }

  componentDidUpdate(){

    // this.focusInput = () => {
    //   if (this.Input) this.Input.focus();
    // };

    const {getPrivateChat, getCUser} = this.props;
    const { users, groupInfo } = this.state;
    let _grid = getPrivateChat.id || localStorage.getItem('grid');

    if(getCUser.user  && getCUser.user.groups){
      let groups = getCUser.user.groups;
      let thisGrId = getPrivateChat.id || _grid;
      let thisUsers;

      thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

      if(JSON.stringify(groupInfo) !== JSON.stringify(thisUsers)){
        this.setState({
          groupInfo: thisUsers,
        });
      }

      if(thisUsers && thisUsers.users && users){
        // if (isArrayEqual(
        //   thisUsers.users,
        //   users
        // )) {
        //   this.setState({
        //     users: [...thisUsers.users],
        //   });
        // }

        var result1 = isArrayEqual(
          thisUsers.users,
          users
        );

        if( result1 ){
        }else{
          this.setState({
            users: [...thisUsers.users],
          });
        }
      }else{
      }



    }

    // const {users, _grid } = this.state;
    // const {getPrivateChat, getCUser} = this.props;

    // if(getPrivateChat.id !== _grid){
    //   this.loadu(getPrivateChat.id)
    // }

    // let thisUsers;

    // if(getCUser.user && getCUser.user.groups && users ){
    //   let groups = getCUser.user.groups;
    //   let thisGrId = getPrivateChat.id || _grid;
    //   thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });


    //   if(thisUsers && thisUsers.users && users){
    //     var result1 = isArrayEqual(
    //       thisUsers.users,
    //       users
    //     );

    //     if( result1 ){
    //       console.log("USERS 1",thisUsers.users);
    //       console.log("USERS 2",users);

    //       console.log("result -----",result1);

    //       // this.changeGrUsers(thisUsers.users);
    //       // onlyunicusers = _.differenceWith(allusers, thisUsers.users, _.isEqual);
    //      }else{
    //       console.log("USERS 1",thisUsers.users);
    //       console.log("USERS 2",users);
    //       this.setState({
    //         users: [...thisUsers.users],
    //       })
    //       console.log("need update");

    //     }
    //   }

    // }

    // console.log("____GROUPS",groups, );
    // console.log("____GROUPS ID",getPrivateChat.id, thisGrId);
  }

  // usersSelector(){


  // this.changeGrUsers(a.data.group.users);

  // const {users, _grid, allusers, groupName, groupInfo, modal, status} = this.state;
  // const {getPrivateChat, getCUser} = this.props;

  // let thisUsers;
  // let onlyunicusers;

  // if(!getCUser.user || !getCUser.user.groups) return true;

  // let groups = getCUser.user.groups;
  // let thisGrId = getPrivateChat.id || _grid;

  // console.log("____GROUPS",groups, );
  // console.log("____GROUPS ID",getPrivateChat.id, thisGrId);


  // thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

  // if( thisUsers && thisUsers.users){
  //   console.log("USERS",thisUsers.users);
  //   onlyunicusers = _.differenceWith(allusers, thisUsers.users, _.isEqual);
  // }
  // }

  render() {
    const {users, _grid, allusers, groupName, groupInfo, modal, status, addressList} = this.state;
    const {getPrivateChat, getCUser, getTemp} = this.props;

    // let thisUsers;
    let onlyunicusers;


    // console.log(getTemp.tempObj);

    // if(!getCUser.user || !getCUser.user.groups) return true;

    // let groups = getCUser.user.groups;
    // let thisGrId = getPrivateChat.id || _grid;

    // console.log("____GROUPS",groups, );
    // console.log("____GROUPS ID",getPrivateChat.id, thisGrId);


    // thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

    // if( thisUsers && thisUsers.users){
    //   console.log("USERS",thisUsers.users);
    //   onlyunicusers = _.differenceWith(allusers, thisUsers.users, _.isEqual);
    // }


    return(
      <FirstLayout barstate="chat">
        <div className="f-container">
          <div className="f-column">
            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? <ChatPrivate name={this.props.getPrivateChat.name} id={this.props.getPrivateChat.id} priv={0} /> : (<div className="errorMessage">Выберите чат</div>)
            }
          </div>
          <div className="f-column">
            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? (
                <div className="tab-roll">
                  <div className="header"><h4>Пользователи</h4></div>
                  <div className="content">
                    <div className="content-scroll">

                      <Query query={GRU_QUERY} variables={{ id: getPrivateChat.id }} >
                        {({ loading, error, data, refetch, subscribeToMore }) => {
                          if (loading){
                            return (
                              <div style={{ paddingTop: 20, margin: "auto"}}>
                                <Loading />
                              </div>
                            );
                          }
                          if (error){
                            return (
                              <div className="errMess">
                                {error.message}
                              </div>
                            );
                          }


                          subsUser(getPrivateChat.id, subscribeToMore, refetch);

                          if(data){
                            let usrs = data.group.users;

                            onlyunicusers = _.differenceWith(allusers, usrs, _.isEqual);

                            return(

                              data.group.users.map(
                                (e,i)=>{
                                  return(
                                    <div className="username" role="presentation" key={'usr-'+i} >
                                      <div className="name" style={{color: colorHash.hex(e.username)}} >{e.username}{localStorage.getItem('userid') === e.id ? (<span className="me"> - это я</span>) : '' }</div>
                                      <div className="hoverTrigger">
                                        <div className="hover">
                                          <div className="btn v2" onClick={()=>this.userSelect(e.username, e.id)}>Написать {e.username}</div>
                                          <div className="btn v2" onClick={()=>this.userAdd(e.id)}>Удалить {e.username}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              )
                            )


                            // return true;
                          }

                          return true;
                        }}
                      </Query>
                      {
                        // users.map(
                        //   (e,i,a)=>{
                        //     return(
                        //       <div className="username" role="presentation" style={{color: colorHash.hex(e.username)}} key={'usr-'+i} onClick={()=>this.userSelect(e.username, e.id)}>
                        //         {e.username}
                        //         {' '}
                        //         {localStorage.getItem('userid') === e.id ? (<span className="me"> - это я</span>) : '' }
                        //         {' '}
                        //       </div>
                        //     )
                        //   }
                        // )
                      }
                    </div>
                  </div>
                </div>
              ): null
            }

            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? (
                <div className="tab-roll">
                  <div className="header"><h4>Добавить пользователя</h4></div>
                  <div className="content">
                    <div className="content-scroll">
                      <div>

                        <input type="list" list="users" autoComplete="on" onChange={this.newUser} />
                        {
                          this.state.newUser ? (
                            <div className="button" onClick={()=>this.userAdd(this.state.newUser, 1)}>Добавить {this.state.newUser}</div>
                          ): null
                        }

                        <datalist id="users">
                          {
                            onlyunicusers && onlyunicusers.length > 0 ? onlyunicusers.map((e,i)=>{
                              return(
                                <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                              )
                            }) : allusers.map((e,i)=>{
                              return(
                                <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                              )
                            })
                          }

                          <option>Москва</option>
                          <option>Моська</option>
                          <option>Питер</option>
                          <option>Васька</option>
                        </datalist>
                      </div>


                      {/* {
                        onlyunicusers && onlyunicusers.length > 0 ? onlyunicusers.map((e,i)=>{
                          return(
                            <div className="username" role="presentation" style={{color: colorHash.hex(e.username)}} key={'usr-'+i} onClick={()=>this.userAdd(e.id, 1)}>
                              {e.username}
                              {' '}
                              {localStorage.getItem('userid') === e.id ? (<span className="me"> - это я</span>) : null }
                              {' '}
                            </div>
                          )
                        }) : ("Нет юзеров")
                      } */}
                    </div>
                  </div>
                </div>
              ) : null
            }
            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? (
                <div className="tab-roll">
                  <div className="header"></div>
                  <div className="content">
                    <div className="button" onClick={()=>{this.setState({modal: !modal})}}>Информация</div>
                    <div className="content-scroll">
                    </div>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>

        {modal ? (
          <Modal header="Подробная информация" body="Текст" close={()=>{ this.setState({modal: !modal})}} fullInfo="">
            <div className="overWrap">
              <div>
                {  statusName = _.result(_.find(status, (obj)=> {
                  return obj.id === groupInfo.status;
                }), 'name')
                }

                <ChangerForm id={getPrivateChat.id} defaults={groupInfo.name} name={"Название"} change={"name"} string={1} />
                <ChangerForm id={getPrivateChat.id} defaults={groupInfo.endDate} defaultText={groupInfo.endDate?groupInfo.endDate:"Не указано"} name={"Дата Завершения"} change={"endDate"} type={"date"} string={1} />
                <ChangerForm id={getPrivateChat.id} defaults={groupInfo.status < 1 ? 1 : groupInfo.status} name={"Статус"} change={"status"} type={"text"} string={0} select={1} options={status} defaultText={status[groupInfo.status < 1 ? 1 : groupInfo.status ]} />
                <ChangerForm id={getPrivateChat.id} defaults={groupInfo.assignedTo && groupInfo.assignedTo.id ? groupInfo.assignedTo.id : null } name={"Ответственный"} change={"assignedTo"} type={"text"} string={1} select={1} options={users} defaultText={groupInfo.assignedTo && groupInfo.assignedTo.username ? {name: groupInfo.assignedTo.username}  : {name: "Не назначен"} } />

                {/* <ChangerForm id={getPrivateChat.id} defaults={groupInfo.address && groupInfo.address.value ? groupInfo.address.value : null } name={"Адрес"} change={"address"} type={"list"} options={addressList} defaultText={groupInfo.address && groupInfo.address.value ? {name: groupInfo.address.value}  : {name: "Не указан"} } newAddress={this.newAddress} newAddressValue={this.state.newAddress} addressList={addressList} addressAdd={this.addressAdd}/> */}

              </div>
            </div>
          </ Modal>
        ) : null

        }

      </FirstLayout>
    );
  }
}



GroupList.propTypes = {
  getPrivateChat: PropTypes.shape({
    id: PropTypes.string,
    name:  PropTypes.string,
  }).isRequired,
  selectUser: PropTypes.func.isRequired
};

export default compose(
  graphql(getPrivateChat, { name: 'getPrivateChat' }),
  graphql(selectUser, { name: 'selectUser' }),
  graphql(getCUser, { name: 'getCUser' }),
  graphql(tempObj, { name: 'tempObj' }),
  graphql(setTemp, { name: 'setTemp' }),
  graphql(getTemp, { name: 'getTemp' }),
)(GroupList);

const isArrayEqual = (x, y) => {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
};
