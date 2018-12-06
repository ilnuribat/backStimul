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
import TaskView from '../TaskView/TaskView';
// import { TextRow } from '../../Parts/Rows/Rows';

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
      if (location.state.privateChat) localStorage.setItem('privateChat', 1)

      this.setState({
        chatId: location.state.id,
        privateChat: location.state.privateChat || true
      })
    }else if(localStorage.getItem('chatId')){
      this.setState({
        chatId: localStorage.getItem('chatId'),
        privateChat: localStorage.getItem('privateChat') == 1 || !localStorage.getItem('privateChat') ? true : false
      })
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
    const { location } = this.props
    const { chatId } = this.state

    if (location && location.state && prevProps.location && prevProps.location.state
      && prevProps.location.state.id && chatId !== location.state.id && chatId === prevState.chatId)
      this.setState ({ chatId: location.state.id, privateChat: location.state.privateChat == 1 || !localStorage.getItem('privateChat') ? true : false })
  }

  componentWillUnmount(){
    this.props.setChat({
      variables: { id: "", name: "" }
    })
  }

  openChat(id, priv){
    if(id && id !== this.state.chatId){
      localStorage.setItem('chatId', id)
      localStorage.setItem('privateChat', priv ? 1 : 0)
      this.setState({
        chatId: id,
        privateChat: priv === true ? true : false,
        chatLocation: true,
      })
    }
    if(!id || id === this.state.chatId){
      localStorage.setItem('chatId', '')
      localStorage.setItem('privateChat', 1)
      this.setState({
        chatId: "",
        chatLocation: true,
      })
    }
  }

  render() {
    const { chatId, privateChat } = this.state;
    let CHATQUERY;

    privateChat ? CHATQUERY = PRIV_QUERY : CHATQUERY = TASK_MESSAGES

    return <Fragment>
      <Content view="OvH Row OvH Pad10">
        <InnerBar>
          <PrivateBar chatId={chatId} click={(id, pr) => this.openChat(id, pr)} />
        </InnerBar>
        {chatId ? <Query query={CHATQUERY} variables={{ id: `${chatId}` }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <div style={{ paddingTop: 20, margin: "auto" }}>
                <Loading />
              </div>;
            }
            if (error) {
              return <div className="errMess">{error.message}</div>;
            }


            if (data && (data.task || data.direct)) {
              // console.warn("AAAAAAAA", data.direct, data.direct.name, privateChat, typeof privateChat)
              let allData = data.direct || data.task;

              return (
                <Fragment>
                  <ContentInner view="Row OvH Pad010">
                    <ChatView id={chatId} priv={allData.__typename === "Direct" ? true : false} name={ allData.__typename === "Direct" ? data.direct.name : data.task.name } data={ allData.__typename === "Direct" ? data.direct : data.task } />
                  </ContentInner>
                  {data.task ? <InnerBar>
                    <TaskView taskId={chatId} objectId={data.task.objectId} data={data.task} />
                  </InnerBar> : ''}
                </Fragment>
              )
            } else {
              return <ContentInner view="Row OvH Pad10">
                <div className="errorMessage">Выберите чат</div>
              </ContentInner>;
            }
          }}
        </Query> : <ContentInner view="Row OvH Pad10">
          <div className="errorMessage">Выберите чат</div>
        </ContentInner>}


      </Content>
    </Fragment>;
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
