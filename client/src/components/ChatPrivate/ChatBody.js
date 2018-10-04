import React, { Component } from "react";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import moment from 'moment';
import { Query, Mutation, graphql, compose  } from "react-apollo";
// import gql from 'graphql-tag';
import { showCurrentGroup, ADD_MUT, getPrivateChat, GR_QUERY, PRIV_QUERY, MESSAGE_CREATED } from '../../graph/querys';
import AddNew from './AddNew';
import Loading from '../Loading';
// import { qauf, _url } from '../../constants';


var colorHash = new ColorHash({lightness: 0.7, hue: 0.8});
let subscrMes;
// let fillFun;

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) => children(addMes, { data, loading, error }) }
  </Mutation>
);

class ChatBody extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      id: '',
      name: '',
    }
    this.messageList = React.createRef();
    this.toBottom = this.toBottom.bind(this)
  }

  componentDidMount(){
    // setTimeout( this.toBottom, 500)
  }

  componentDidUpdate(){
    this.toBottom()
  }

  toBottom(){
    const node = this.messageList.current;
    node.scrollTop = node.scrollHeight;
  }

  render() {
    let { messages, id, name, priv, data } = this.props;
    let uid = localStorage.getItem('userid');
    let same = false;
    let usid = "";
    let _query = GR_QUERY;

    priv ? _query = PRIV_QUERY : null;


    // console.log(this.props)

    return (
      <div className="nChat flexbox2">
        <header className="chat-header col1">
          <section className="chat-header-section">
            <div className="chat-name online">{name ? name : 'Группа'}</div>
            <div className="small">
              описание:
              {' '}
              {id}
            </div>
          </section>
        </header>
        <section id="messageList" ref={this.messageList} className="messages col1">
          {/* <MesQr id={id} priv={priv} /> */}

          <Query query={_query} variables={{id: id }}>
            {({ loading, error, data, refetch, subscribeToMore }) => {
              if (loading){
                return (
                  <div style={{ paddingTop: 20 }}>
                    <Loading />
                  </div>
                );
              }else{
                this.toBottom()
              }


              if (error){
                return (
                  <p className="mess">
                    {' '}
                    {'Ошибочка вышла :( ' + error.toString()}
                    {' '}
                  </p>
                )
              }

              subscrMes = ()=>{
                return subscribeToMore({ document: MESSAGE_CREATED, variables: {id: id,},
                  updateQuery: () => {
                    // refetch();
                    refetch().then(()=>{
                      this.toBottom()
                    })
                  },
                });
              };

              subscrMes();

              let datas;

              if(priv && data.direct && data.direct.messages && data.direct.messages.edges ){
                datas = data.direct.messages.edges;
              }else if(data.group && data.group.messages && data.group.messages.edges ){
                datas = data.group.messages.edges;
              }else{
                return <div className="mess">нет данных</div>
              }

              if(datas && datas.length > 0){
                return(
                  datas.map((el,i)=>{
                    let {node} = el;
                    let tr = 'them';
                    let createdAt = node.createdAt || "none";
                    let text = node.text || "none";
                    let id = node.from.id || "none";
                    let username = node.from.username || "none";
                    let date = moment(createdAt).fromNow() || "none";

                    if(id === uid){
                      tr = 'me';
                      username = "Я"
                    }
                    usid === id ? same = true : same = false;
                    usid = id;

                    return(
                      <div className={'msg '+ tr} key={'chat-'+i} from={id}>
                        <div className="msg-flex">
                          {same ? ('') : (
                            <div className="msg-user" style={{color: colorHash.hex(username)}}>
                              {username}
                                              :
                            </div>)}
                          <blockquote className="2msg">
                            <div className="text">{text}</div>
                            <div className="msg-date">{date}</div>
                          </blockquote>
                        </div>
                      </div>
                    )
                  })
                )
              }else{
                return <div className="mess">нет сообщений</div>
              }

              // if(!data.direct || !data.direct.messages.edges || data.direct.messages.edges.length === 0 ){
              //   return <div className="mess">нет сообщений</div>
              // }else{
              //   return(
              //     data.direct.messages.edges.map((el,i)=>{
              //       let {node} = el;
              //       let tr = 'them';
              //       let createdAt = node.createdAt || "none";
              //       let text = node.text || "none";
              //       let id = node.from.id || "none";
              //       let username = node.from.username+':' || "none";
              //       let date = moment(createdAt).fromNow() || "none";

              //       if(id === uid){
              //         tr = 'me';
              //         username = "Я"
              //       }
              //       usid === id ? same = true : same = false;
              //       usid = id;

              //     return(
              //       <div className={'msg '+ tr} key={'chat-'+i} from={id}>
              //         <div className="msg-flex">
              //           {same ? ('') : (<div className="msg-user" style={{color: colorHash.hex(username)}}>{username}</div>)}
              //           <blockquote className="2msg">
              //             <div className="text">{text}</div>
              //             <div className="msg-date">{date}</div>
              //           </blockquote>
              //         </div>
              //       </div>
              //     )
              //     })
              //   )

              // }
              return "Not work";
            }}

          </Query>

        </section>

        <div className="rela col1" style={{textAlign: "center"}}>
          <AddMesMut>
            {(add) => (
              <AddNew
                add={({ id, text }) => add({ variables: { id: `${id}`, text } })}
                toBottom={()=>{this.toBottom();}}
              />
            )}
          </AddMesMut>
        </div>
      </div>
    );
  }

}

ChatBody.propTypes = {
  showCurrentGroup: PropTypes.shape({
    currentGroup: PropTypes.string
  }).isRequired,
};


AddMesMut.propTypes = {
  children: PropTypes.func.isRequired,
};

ChatBody.defaultProps = {
};

export default compose(
  graphql(showCurrentGroup, { name: 'showCurrentGroup' }),
  graphql(getPrivateChat, { name: 'getchat' }),
)(ChatBody);
