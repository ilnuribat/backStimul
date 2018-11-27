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
      users: [
        {id:"1",name:"Юзерь Ван"},
        {id:"2",name:"Юзерь Пач"},
        {id:"3",name:"Юзерь Ман"},
        {id:"4",name:"Юзерь 4"},
        {id:"5",name:"Юзерь 5"},

      ],
      grl: [],
      grid: '',
      grnm: '',
      gid: '',
      getchat: '',
      chatId: "",
    }

    this.setStateProps = this.setStateProps.bind(this)
  }

  componentDidMount(){

    const {getchat, getPlaceName, location} = this.props;
    let { setPlaceName } = this.props;
    const { chatId } = this.state;


    // if(location && location.state && location.state.id){
    //   this.setState({
    //     chatId: location.state.id,
    //   })
    // }else
    if(getchat && getchat.id){
      this.setState({
        chatId: getchat.id,
      })
    }else{
      // this.setState({
      //   chatId: "",
      // })
    }

    

    let place = 'Private';

    if(getPlaceName && getPlaceName.placename != place){
      setPlaceName({
        variables:{
          name: place,
        }
      })
    }

    this.setStateProps(getchat)
  }

  componentWillUpdate(){
    const {getchat, getPlaceName, location} = this.props;

    if(getchat && getchat.id){
      this.setState({
        chatId: getchat.id,
      })
    }else{
      // this.setState({
      //   chatId: "",
      // })
    }
    // const {getchat, location} = this.props;
    // const {chatId} = this.state;

    // if(location && location.state && location.state.id && location.state.id !== chatId){
    //   let id = location.state.id;

    //   this.setState({
    //     chatId: id,
    //   })
    // }else if(getchat && getchat.id && getchat.id !== chatId){
    //   let id = getchat.id;

    //   this.setState({
    //     chatId: id,
    //   })
    // }else{
    //   return true;
    // }

  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps === this.props && nextState === this.state){
      return false
    }
    if(nextProps.getchat.id === this.props.getchat.id){
      return false
    }
    if(nextState.chatId === this.state.chatId){
      return false
    }

    return true
  }

  componentWillUnmount(){
    // console.warn("UMount")
    this.props.setChat({
      variables: { id: "", name: "" }
    })
  }

  setStateProps(props){
    this.setState({
      getchat: props,
    })
  }


  render() {
    const {chatId} = this.state;
    return(
      <Fragment>
        <Content view="OvH Row OvH Pad10">
          <InnerBar>
            <PrivateBar />
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
                    <ContentInner view="Row OvH Pad10">
                      <ChatView id={chatId} data={ data.direct } />
                    </ContentInner>
                  )}}
              </Query>)
              :
              (
                <ContentInner>
                  <div className="errorMessage">Выберите чат</div>
                </ContentInner>
              )
          }
          <InnerBar>
            <div>
              Вложения
            </div>
            <div>
              Вложения
            </div>
            <div>
              Вложения
            </div>
            <div>
              Вложения
            </div>
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
