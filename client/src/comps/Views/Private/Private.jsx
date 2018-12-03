import React, { Component, Fragment } from 'react'
import 'animate.css';
import { Query, graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import ChatView from '../ChatView/ChatView';
import { getChat, setChat, setPlaceName, getPlaceName } from '../../../GraphQL/Cache';
import { PRIV_QUERY, TASK_MESSAGES } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
// import Bar from '../../Lays/Bar';
import PrivateBar from './PrivateBar';
import Loading from '../../Loading';
import InnerBar from '../../Lays/InnerBar/InnerBar';
import ContentInner from '../../Lays/ContentInner/ContentInner';


class Private extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chatId: '',
      privateChat: true,
      chatLocation: false,
    }

    this.openChat = this.openChat.bind(this)
  }

  componentWillMount(){

    const { getPlaceName, location} = this.props;
    let { setPlaceName } = this.props;


    if(location && location.state && location.state.id){

      // console.warn(this.props.location)

      localStorage.setItem('chatId', location.state.id)

      this.setState({
        chatId: location.state.id,
      })
    }else if(localStorage.getItem('chatId')){
      this.setState({
        chatId: localStorage.getItem('chatId'),
      })
    }else{

    }


    let place = 'Private';

    if(getPlaceName && getPlaceName.placename != place){
      setPlaceName({
        variables:{
          name: place,
        }
      })
    }

  }

  componentDidUpdate(prevProps, prevState) {
    // console.warn("PRE!!changestate",this.state.chatId, prevState.chatId)
    if (this.props.location && this.props.location.state && prevProps.location && prevProps.location.state
      && prevProps.location.state.id && this.state.chatId !== this.props.location.state.id && this.state.chatId === prevState.chatId)
      this.setState ({ chatId: this.props.location.state.id  })
  }

  componentWillUnmount(){
    this.props.setChat({
      variables: { id: "", name: "" }
    })
  }

  openChat(id, priv){
    // console.warn("ChatId === open",id);
    // console.warn("ChatId === priv",priv);

    if(id && id !== this.state.chatId){
      localStorage.setItem('chatId', id)
      localStorage.setItem('privateChat', priv)
      this.setState({
        chatId: id,
        privateChat: priv === true ? true : false,
        chatLocation: true,
      })
    }
    if(!id || id === this.state.chatId){
      localStorage.setItem('chatId', '')
      localStorage.setItem('privateChat', '')
      this.setState({
        chatId: "",
        chatLocation: true,
      })
    }else{

    }

  }


  render() {
    const { chatId, privateChat } = this.state;
    let CHATQUERY;

    privateChat ? CHATQUERY = PRIV_QUERY : CHATQUERY = TASK_MESSAGES

    return(
      <Fragment>
        <Content view="OvH Row OvH Pad10">
          <InnerBar>
            <PrivateBar chatId={chatId} click={(id, pr)=>this.openChat(id,pr)} />
          </InnerBar>
          {
            chatId ?
              (<Query
                query={CHATQUERY}
                variables={{ id: `${chatId}` }}
              >
                {({ loading, error, data }) => {
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
                  // console.warn ("REFRESH", data.direct)
                  // console.warn ("REFRESH", data.task)

                  if(data && (data.task || data.direct )){
                    return(
                      <ContentInner view="Row OvH Pad010">
                        <ChatView id={chatId} name={privateChat === true ? data.direct.name : data.task.name } data={privateChat === true ? data.direct : data.task} />
                      </ContentInner>
                    )
                  }else{
                    return(
                      <ContentInner view="Row OvH Pad10">
                        <div className="errorMessage">Выберите чат</div>
                      </ContentInner>
                    )
                  }
                }}
              </Query>)
              :
              (
                <ContentInner view="Row OvH Pad10">
                  <div className="errorMessage">Выберите чат</div>
                </ContentInner>
              )
          }
          <InnerBar>

          </InnerBar>

        </Content>
      </Fragment>
    );
  }
}

Private.propTypes = {
  setChat: PropTypes.func.isRequired,
  getchat: PropTypes.object.isRequired,
  setPlaceName: PropTypes.func.isRequired,
  getPlaceName: PropTypes.object.isRequired
};


export default compose(
  graphql(getChat, { name: 'getchat' }),
  graphql(setChat, { name: 'setChat' }),
  graphql(setPlaceName, { name: 'setPlaceName' }),
  graphql(getPlaceName, { name: 'getPlaceName' }),
)(Private);
