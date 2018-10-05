import React, { Component } from "react";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import moment from 'moment';
import { Query, Mutation, Subscription, graphql, compose  } from "react-apollo";
import { showCurrentGroup, ADD_MUT, getPrivateChat, GR_QUERY, PRIV_QUERY, MESSAGE_CREATED, MESSAGE_READ, MESSAGEREAD_MUT, messRead, MESSAGE_QUERY, messageRead_MUT } from '../../graph/querys';
import AddNew from './AddNew';
import Loading from '../Loading';
import { MsgCheck, MsgDblcheck, MsgDblcheckAck } from '../Svg/index';
import { qauf, _url } from '../../constants';


var colorHash = new ColorHash({lightness: 0.7, hue: 0.8});
let subscrMes;

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) => children(addMes, { data, loading, error }) }
  </Mutation>
);

// const Header = () => (
//   <Query query={getPageNameQuery}>
//       {({ loading, error, data }) => {
//           if (error) return <h1>Error...</h1>;
//           if (loading || !data) return <h1>Loading...</h1>;

//           return <h1>{data.apolloClientDemo.currentPageName}</h1>
//       }}
//   </Query>
// );

class Fetch extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      loading: true,
      id: '',
      name: '',
      datas: [],
    }

    this.fillMessages = this.fillMessages.bind(this)
  }

  fillMessages(datas){
    if(datas && datas != this.state.messages){
      this.setState({
        messages: datas,
      })
    }
  }


  render(){
    let { id, priv } = this.props;
    let { messages } = this.state;
    
    let _query = GR_QUERY;
  
    priv ? _query = PRIV_QUERY : null;
  
    console.log("----------- log1");

    return(
        <Query query={_query} variables={{id: id }}>
        {({ loading, error, data, refetch, subscribeToMore }) => {
          
            if(loading){
              return (
                <div style={{ paddingTop: 20, margin: "auto" }}>
                  <Loading />
                </div>
              );
            }
            if(error){
              return (
                <div style={{ paddingTop: 20 }}>
                  {error}
                </div>
              );
              // return false;
            }


            const subscrMes = (ids)=>{
              console.log("subscriptionData")
              return subscribeToMore({ document: MESSAGE_CREATED, variables: {id: ids,},
                
                updateQuery: (previousResult, { subscriptionData }) => {

                  console.log("subscriptionData")
                  console.log('prev',previousResult)
                  console.log(subscriptionData)

                  let {messages} = this.state;


                  console.log(messages)
                  

                  
                  const newMessage = subscriptionData.data.messageAdded;

                  console.log('newMessage',newMessage)
                  let result = {
                    __typename: 'MessageEdge',
                    node: newMessage,
                    cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
                  };
                  console.log('result',result)
                  let appendmessages = [...messages, result]
                  console.log('appendmessages',appendmessages)
                  // this.messUpdate(result)
                  // return result;

                  // return messages;
                  this.fillMessages(appendmessages)

                  // this.setState({
                  //   messages: messages,
                  // })
                  
                  return true;
                  refetch();


                  // const newMessage = subscriptionData.data.messageAdded;
                  // let result = [...previousResult.group.messages.edges, {
                  //   __typename: 'MessageEdge',
                  //   node: newMessage,
                  //   cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
                  // }];
                  // this.messUpdate(result)
                  // return result;


                  // return update(previousResult, {
                  //   group: {
                  //     messages: {
                  //       edges: {
                  //         $set: [{
                  //           __typename: 'MessageEdge',
                  //           node: newMessage,
                  //           cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
                  //         }],
                  //       },
                  //     },
                  //   },
                  // });
                
                },
                onError: (err)=>{
                  console.log(err)
                },
                
                // updateQuery: () => {
                //   refetch().then(()=>{
                //     this.toBottom()
                //   })
                // },



              });
            };

            subscrMes(id);


            if(data){
              let datas;
              console.log(data)
            
              if(priv && data.direct && data.direct.messages && data.direct.messages.edges ){
                datas = data.direct.messages.edges;
              }else if(data.group && data.group.messages && data.group.messages.edges ){
                datas = data.group.messages.edges;
              }else{
                  return(<div className="mess">нет данных</div>)
                // return false;
              }

              if(datas) this.fillMessages(datas);

              if(messages){
                return(
                  <div>
                  {
                    messages.map((e,i,a)=>{
                      return(
                        <div className="mess" key={'messages'+i}>{e.node.id}</div>
                      )
                    })
                  }
                  </div>
                )
              }
            }
        }}
    
      </Query>
    )
  }
}


class ChatBody extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      loading: true,
      id: '',
      name: '',
      datas: [],
    }
    this.messageList = React.createRef();
    this.toBottom = this.toBottom.bind(this)
    // this.fetch = this.fetch.bind(this)
  }


  componentDidMount(){
    // console.log("----------- log0");
    // this.fetch()
    // setTimeout( this.toBottom, 500)
  }

  componentDidUpdate(){
    this.toBottom()
  }

  toBottom(){
    if(document.getElementById("messageList")){
          const a = document.getElementById("messageList");
          a.scrollTop = a.scrollHeight;

          const node = this.messageList.current;
          node.scrollTop = node.scrollHeight;
    }

  }

  render() {
    let { id, name, priv, data } = this.props;
    let { messages, loading } = this.state;
    let uid = localStorage.getItem('userid');
    let same = false;
    let usid = "";
    let _query = GR_QUERY;

    console.log(this.state)

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

        <Fetch priv={priv} id={id} />

        {/* {
          messages.map((e,i,a)=>{
            return(
              <div className="mess">{e.node.id}</div>
            )
          })
        } */}



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
