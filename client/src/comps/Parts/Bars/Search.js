import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { gBar } from '../../../GraphQL/Cache/index';
// import { compose, graphql } from 'react-apollo';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { checkServerIdentity } from 'tls';
import {UserRow} from '../../Parts/Rows/Rows';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import { FileRow } from '../Rows/Rows';


export class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chAll: true,
      chObj: false,
      chDcs: false,
      chMsg: false,
      chUsr: false,
      chTsk: false,
      chTskNew: false,
      chTskWrk: false,
      chTskChk: false,
      chTskEnd: false,
      value:'',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  handleInputChange(event) {
    let { chAll } = this.state;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (target.type === 'checkbox' && target.name !== 'chAll' ){
      this.setState({ chAll: false, [name]: value })
    } else if (target.type === 'checkbox' && target.name === 'chAll'){
      this.setState({ chAll: true,
        chObj: false,
        chDcs: false,
        chMsg: false,
        chUsr: false,
        chTsk: false,
        chTskNew: false,
        chTskWrk: false,
        chTskChk: false,
        chTskEnd: false,
      })
    }else{
      this.setState({ chAll: true,
        chObj: false,
        chDcs: false,
        chMsg: false,
        chUsr: false,
        chTsk: false,
        chTskNew: false,
        chTskWrk: false,
        chTskChk: false,
        chTskEnd: false,
      });
    }

    // target.type === 'checkbox' && target.name !== 'chAll' ? this.setState({chAll: false, [name]: value }) : this.setState({[name]: value});

    // !this.state.chObj && !this.state.chTsk && !this.state.chDcs && !this.state.chUsr && !this.state.chMsg ? this.setState({chAll: true,}) : null
  }

  static propTypes = {

  }

  componentWillUpdate(){
  }

  render() {

    let Obj = `objects{
      id
      name
      address{
        value
      }
    }`;
    let TaskStatus = status =>{return `
      tasks(status: ${status} ){
        id
        name
        objectId
        assignedTo{
          id
          username
        }
        endDate
        status
      }`};

    let Tsk = `tasks{
      id
      name
      objectId
      assignedTo{
        id
        username
      }
      endDate
      status
    }`;
    let Usr = `users{
      id
      username
    }`
    let Msg = `messages{
      id
      text
      isDirect
      groupId
      from{
        username
        id
      }
    }`;
    let Dcs = `files{
      id
      name
    }`;

    let {children} = this.props;
    let {value} = this.state;
    // let query = value;


    

    let SearchBody = `
    ${this.state.chAll || this.state.chObj ? Obj : ""}
    ${this.state.chAll || this.state.chTsk ? Tsk : ""}
    ${this.state.chAll || this.state.chUsr ? Usr : ""}
    ${this.state.chAll || this.state.chMsg ? Msg : ""}
    ${this.state.chAll || this.state.chDcs ? Dcs : ""}
    `;
    let SearchGql = `
    query search($query: String!){
      search(query: $query){
        ${SearchBody}
        __typename
      }
    }
    `;

    let Search = gql(SearchGql);
    let checks = [
      {name: 'chAll', text:'Все', id:'0', some:'data'},
      {name: 'chObj', text:'Объекты', id:'0', some:'data'},
      {name: 'chTsk', text:'Задачи', id:'0', some:'data'},
      {name: 'chUsr', text:'Сотрудники', id:'0', some:'data'},
      {name: 'chMsg', text:'Сообщения', id:'0', some:'data'},
      {name: 'chDcs', text:'Документы', id:'0', some:'data'},
    ];
    let checksTasks = [
      {name: 'chTskNew', text:'Новые', id:'0', status:'1'},
      {name: 'chTskWrk', text:'В работе', id:'0', status:'3'},
      {name: 'chTskChk', text:'Проверяются', id:'0', status:'4'},
      {name: 'chTskEnd', text:'Завершенные', id:'0', status:'5'},
    ];
    let statuses = [
      {name: 'Новая', status:'1'},
      {name: 'В работе', status:'3'},
      {name: 'Проверяется', status:'4'},
      {name: 'Завершена', status:'5'},
    ];



    return <div className="Search">
      <div className="SearchTop">
        <form onSubmit={this.handleSubmit}>
          <label className="LabelInputText" htmlFor="searchinput">
            <input type="text" name="searchinput" value={value} onChange={this.handleChange} placeholder="Найти задачи, человека, объект..." />
          </label>

          <div className="searchTags" onMouseDown="return false" onSelectstart="return false">
            <div className="searchTagsRow">
              {checks.map((e, i) => {
                return <label className={this.state[e.name] ? "searchTag sel" : "searchTag"} htmlFor={e.name} key={"check" + i}>
                  <input id={e.name} name={e.name} type="checkbox" checked={this.state[e.name]} onChange={this.handleInputChange} />
                  <span className="searchTagText">{e.text}</span>
                </label>;
              })}
            </div>
            <div className="searchTagsRow">
              {this.state.chTsk ? checksTasks.map((e, i) => {
                return <label className={this.state[e.name] ? "searchTag sel" : "searchTag"} htmlFor={e.name} key={"checkTsk" + i}>
                  <input id={e.name} name={e.name} type="checkbox" checked={this.state[e.name]} onChange={this.handleInputChange} />
                  <span className="searchTagText">{e.text}</span>
                </label>;
              }) : null}
            </div>
          </div>
        </form>
      </div>
      <div className="SearchBody">
        {value ? <Query query={Search} variables={{ query: value }}>
          {({ data, loading, error }) => {
            if (error) {
              console.log(error);

              return <div id="SeacrhInner">{error.message}</div>;
            }
            if (loading) return "загрузка";
            if (data && data.search) {
              let Search = {};

              data.search.messages && data.search.messages.length > 0 ? (Search.messages = data.search.messages) : null;
              data.search.tasks && data.search.tasks.length > 0 ? (Search.tasks = data.search.tasks) : null;
              data.search.objects && data.search.objects.length > 0 ? (Search.objects = data.search.objects) : null;
              data.search.users && data.search.users.length > 0 ? (Search.users = data.search.users) : null;
              data.search.files && data.search.files.length > 0 ? (Search.files = data.search.files) : null;

              // Search ? console.log("Search", Search) : null

              // Search ? (
              return <div id="SeacrhInner">
                {Search.tasks ? <h3 className="BlockHeader">
                          Задачи
                </h3> : null}
                {Search.tasks ? <div className="BlockContent">
                  {Search.tasks.map(e => (
                    <Link
                      key={e.id}
                      to={{
                        pathname: "/board",
                        state: {
                          taskId: e.id,
                          objectId: e.objectId
                        }
                      }}
                    >
                      <div className="SearchTask" key={e.id}>
                        <div className="SearchTaskTop" key={e.id}>
                          {e.name ? (
                            <span className="SearchName">
                              {e.name}
                            </span>
                          ) : null}
                          {e.endDate ? (
                            <span
                              className={
                                moment(e.endDate).fromNow()
                                  ? "SearchEndDate"
                                  : "SearchEndDate"
                              }
                            >
                              {moment(e.endDate).format(
                                "D MMM, h:mm"
                              )}
                            </span>
                          ) : null}

                          <span className="SearchStatus">
                            {e.status
                              ? statuses.find(
                                x => x.status == e.status
                              ).name
                              : "Новая"}
                          </span>
                        </div>
                        {e.assignedTo ? (
                          <UserRow
                            view="Boxed"
                            id={e.assignedTo.id}
                            icon="1"
                            name={e.assignedTo.username}
                            key={e.assignedTo.id}
                          />
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div> : null}
                {Search.objects ? <h3 className="BlockHeader">
                          Объекты
                </h3> : null}
                {Search.objects ? <div className="BlockContent">
                  {Search.objects.map(e => (
                    <Link
                      key={e.id}
                      to={{
                        pathname: "/board",
                        state: { objectId: e.id }
                      }}
                    >
                      <div className="SearchObjects" key={e.id}>
                        <span className="SearchName">
                          {e.name}{" "}
                        </span>
                        {e.address && e.address.value ? (
                          <span className="SearchStatus">
                            {e.address.value}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div> : null}
                {Search.users ? <h3 className="BlockHeader">
                          Пользователи
                </h3> : null}
                {Search.users ? <div className="BlockContent">
                  {Search.users.map(e => (
                    <Link
                      key={e.id}
                      to={{ pathname: "/login", state: "id" }}
                    >
                      <UserRow
                        view="Boxed"
                        id={e.id}
                        icon="1"
                        name={e.username}
                        key={e.id}
                      />
                    </Link>
                  ))}
                </div> : null}
                {Search.messages ? <h3 className="BlockHeader">
                          Сообщения
                </h3> : null}
                {Search.messages ? <div className="BlockContent">
                  {Search.messages.map(e => (
                    <Link
                      key={e.id}
                      to={{
                        pathname: e.isDirect ? "/chat" : "/board",
                        state: {
                          id: e.groupId,
                          objectId: e.objectId || ""
                        }
                      }}
                    >
                      {e.from && e.from.id && e.from.username ? (
                        <UserRow
                          view="Boxed"
                          id={e.from.id}
                          icon="1"
                          name={e.from.username}
                          key={e.from.id}
                        >
                          {e.isDirect ? (
                            <div className="small cgr">
                                      Личный чат
                            </div>
                          ) : null}
                        </UserRow>
                      ) : (
                        ""
                      )}
                      <div className="SearchMessage" key={e.id}>
                        {e.text}
                      </div>
                    </Link>
                  ))}
                </div> : null}
                {Search.files ? <h3 className="BlockHeader">
                          Документы
                </h3> : null}
                {Search.files ? <div className="BlockContent">
                  {Search.files.map(e =>
                    e.name ? (
                      <FileRow
                        view=""
                        id={e.id}
                        icon="doc"
                        name={e.name}
                        key={"file" + e.id}
                      />
                    ) : (
                      ""
                    )
                  )}
                </div> : null}
              </div>;
              // ) : ("Нет данных")
            }

            return "ничего не найдено";
          }}
        </Query> : "Введите название, адрес, Имя, документ, шифр"}
      </div>
      {children}
    </div>;
  }
}


export default Search;
