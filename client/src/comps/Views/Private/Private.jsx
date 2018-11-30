import React, { Component, Fragment } from 'react'
import 'animate.css';
import { Query, graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import ChatView from '../ChatView/ChatView';
import { getChat, setChat, setPlaceName, getPlaceName } from '../../../GraphQL/Cache';
import { PRIV_QUERY } from '../../../GraphQL/Qur/Query';
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
    }

    this.setStateProps = this.setStateProps.bind(this)
    this.openChat = this.openChat.bind(this)
  }

  componentWillMount(){

    const { getPlaceName, location} = this.props;
    let { setPlaceName } = this.props;


    if(location && location.state && location.state.taskId){

      console.log(this.props.location)

      localStorage.setItem('chatId', location.state.taskId)

      this.setState({
        chatId: location.state.taskId,
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

  componentWillUpdate(prevProps, prevState, snapshot) {
    const { location } = this.props;


    // if(location && location.state && location.state.taskId && location.state.taskId !== prevState.chatId){
    //   localStorage.setItem('chatId', location.state.taskId)

    //   this.setState({
    //     chatId: location.state.taskId,
    //   })
    // }
  
    // const { chatId } = this.state;
    // let id = "";
    // let tid = "";
    // let Mount = false;

    // if(location.state && location.state.taskId && location.state.taskId !== chatId){
    //   tid = location.state.taskId
    //   localStorage.setItem('chatId', tid)


    //   this.openChat(tid)
    // }


    if(location && location.state && location.state.taskId && location.state.taskId !== prevState.chatId){
      localStorage.setItem('chatId', location.state.taskId)

      this.setState({
        chatId: location.state.taskId,
      })
    }


    console.log("PREV STATE", prevState);
    console.log("THIS STATE", this.state);
    

    

    // if(prevState.chatId !== this.state.chatId){
    //   localStorage.setItem('chatId', this.state.chatId)
    //   this.setState({
    //     chatId: this.state.chatId,
    //   })
    // }else if(location && location.state && location.state.taskId && location.state.taskId === this.state.chatId){

    //   console.log(this.props.location)

    //   localStorage.setItem('chatId', location.state.taskId)

    //   this.setState({
    //     chatId: location.state.taskId,
    //   })
    // }else{
    //   console.log(this.props.location)

    //   localStorage.setItem('chatId', '')
    //   this.setState({
    //     chatId: '',
    //   })
    // }

  }
  shouldComponentUpdate(nextProps, nextState){

    if(nextState != this.state){
      return true
    }
    // if( nextProps.location.state !== this.props.location.state ){
    //   return false
    // }
    // if(nextState === this.state && nextProps.location.state === this.props.location.state){
    //   return false
    // }
    // if(nextState === this.state){
    //   return false
    // }

    return false

  }

  // componentDidUpdate(prevProps, prevState){
  //   const { location } = this.props;
  //   const { chatId } = this.state;

  //   let chat = prevState.chatId;
  //   // if(this.props.location && this.props.location.taskId ){

  //   //   console.log( this.props.location.taskId);
      

  //   //   this.setState({
  //   //     chatId: this.props.location.taskId
  //   //   })
  //   // }
  //   let tid;
  //   if(location.state && location.state.taskId && location.state.taskId !== chat){
  //     tid = location.state.taskId
  //     localStorage.setItem('chatId', tid)

  //     this.openChat(tid)
  //   }
  // }

  componentWillUnmount(){
    this.props.setChat({
      variables: { id: "", name: "" }
    })
  }

  setStateProps(id){
    // if(!id) return true;
    // this.setState({
    //   chatId: id,
    // })
  }

  openChat(id){
    console.log("ChatId === open",id);
    

    if(id && id !== this.state.chatId){
      localStorage.setItem('chatId', id)
      this.setState({
        chatId: id,
      })
    }
    if(!id || id === this.state.chatId){
      localStorage.setItem('chatId', '')
      this.setState({
        chatId: "",
      })
    }else{

    }

  }


  render() {
    const { chatId } = this.state;

    return(
      <Fragment>
        <Content view="OvH Row OvH Pad10">
          <InnerBar>
            <PrivateBar chatId={chatId} click={(id)=>this.openChat(id)} />
          </InnerBar>
          {
            chatId ?
              (<Query
                query={PRIV_QUERY}
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

                  if (!data || !data.direct)
                    return null

                  return(
                    <ContentInner view="Row OvH Pad010">
                      <ChatView id={chatId} name={data.direct.name} data={ data.direct } />
                    </ContentInner>
                  )}}
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
