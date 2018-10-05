import React, { Component } from "react";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import moment from 'moment';
import { Query, Mutation, graphql, compose  } from "react-apollo";
import { showCurrentGroup, ADD_MUT, getPrivateChat, GR_QUERY, PRIV_QUERY, MESSAGE_CREATED } from '../../graph/querys';
import AddNew from './AddNew';
import Loading from '../Loading';


var colorHash = new ColorHash({lightness: 0.7, hue: 0.8});
let subscrMes;

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
    const a = document.getElementById("messageList");
    a.scrollTop = a.scrollHeight;

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
                
                let n = 0;

                return(
                  datas.map((el,i)=>{
                    n++;
                    let {node} = el;
                    let tr = 'them';
                    let createdAt = node.createdAt || "none";
                    let text = node.text || "none";
                    let id = node.from.id || "none";
                    let username = node.from.username || "none";
                    let date = moment(createdAt).fromNow() || "none";
                    let messageText = text;


                    if(id === uid){
                      tr = 'me';
                      username = "Я"
                    }
                    usid === id ? same = true : same = false;
                    usid = id;

                    console.log("n",n)
                    console.log("i",i+1)
                    let l = i+1;
                    if(datas.length == l ){
                      this.toBottom()
                    }

                    return(
                      <div className={'msg '+ tr} key={'chat-'+i} from={id}>
                        <div className="msg-flex">
                          {same ? ('') : (
                            <div className="msg-user" style={{color: colorHash.hex(username)}}>
                              {username}
                                              :
                            </div>)}
                          <blockquote className="2msg">
                            <div className="text prewr">{messageText}</div>
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
