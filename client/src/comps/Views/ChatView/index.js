import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Mutation, graphql, compose  } from "react-apollo";
import AddNew from './AddNew';
import MessagesListData from './MessagesListData';
import { ADD_MUT } from "../../../GraphQL/Qur/Mutation";
import { getChat } from "../../../GraphQL/Cache";
import { GR_QUERY, PRIV_QUERY } from "../../../GraphQL/Qur/Query";
import '../../../newcss/taskview.css'

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) => children(addMes, { data, loading, error }) }
  </Mutation>
);


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
    if(datas && datas !== this.state.messages){
      this.setState({
        messages: datas,
      })
    }
  }

  render(){
    let { id, priv } = this.props;
    let _query = GR_QUERY;

    if (priv) {
      _query = PRIV_QUERY
    }

    return(
      <MessagesListData query={_query} id={id} priv={priv} {...this.props} />
    );
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
  }


  toBottom(){
    // if(document.getElementById("messageList")){
    //       const a = document.getElementById("messageList");
    //       a.scrollTop = a.scrollHeight;

    //       const node = this.messageList.current;
    //       node.scrollTop = node.scrollHeight;
    // }

  }

  render() {
    let { id, name, priv } = this.props;
    // let _query = GR_QUERY;

    // priv ? _query = PRIV_QUERY : null;

    return (
      <div className="ChatParent nChat flexbox2">
        <header className="ChatHead chat-header col1">
          <section className="chat-header-section">
            <div className="chat-name online">{name ? name : 'Группа'}</div>
            <div className="small">
              описание:
              {' '}
              {id}
            </div>
          </section>
        </header>
        <section id="ChatMessages messageList" ref={this.messageList} className="messages col1">
          <Fetch priv={priv} id={id} {...this.props} />
        </section>

          <AddMesMut>
            {(add) => (
              <AddNew
                key={id}
                add={({ id, text }) => add({ variables: { id: `${id}`, text } })}
                toBottom={()=>{this.toBottom();}}
              />
            )}
          </AddMesMut>
      </div>
    );
  }
}


ChatBody.propTypes = {
  getchat: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
};


AddMesMut.propTypes = {
  children: PropTypes.func.isRequired,
};

ChatBody.defaultProps = {
};

export default compose(
  graphql(getChat, { name: 'getchat' }),
)(ChatBody);

