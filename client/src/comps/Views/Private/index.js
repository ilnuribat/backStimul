import React, { Component } from 'react'
import 'animate.css';
import { graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import FirstLayout from './Layout';
import ChatPrivate from '../ChatView';
import { getChat, setChat } from '../../../GraphQL/Cache';

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
    }

    this.setStateProps = this.setStateProps.bind(this)
  }

  componentDidMount(){

    let {getchat} = this.props;

    this.setStateProps(getchat)
  }

  componentWillUnmount(){
    // console.warn("UMount")
    this.props.setPrivateChat({
      variables: { id: "", name: "" }
    })
  }

  setStateProps(props){
    this.setState({
      getchat: props,
    })
  }


  render() {

    return(
      <FirstLayout barstate="private">
        <div className="f-container">
          <div className="f-column" style={{color: ""}}>
            {
              this.props.getchat && this.props.getchat.id ? <ChatPrivate key={this.props.getchat.id} name={this.props.getchat.name} id={this.props.getchat.id} priv={1} /> : (<div className="errorMessage">Выберите чат</div>)
            }
          </div>
          <div className="f-column">
            <div className="tab-roll">
              <div className="header"><h4>_</h4></div>
              <div className="content">
                <div className="content-scroll">
                  {

                  }
                </div>
              </div>
            </div>

            <div className="tab-roll">
              <div className="header"><h4>_</h4></div>
              <div className="content">
                <div className="content-scroll">
                  {

                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </FirstLayout>

    );
  }
}

Private.propTypes = {
  setPrivateChat: PropTypes.func.isRequired,
  getchat: PropTypes.object.isRequired
};


export default compose(
  graphql(getChat, { name: 'getchat' }),
  graphql(setChat, { name: 'setPrivateChat' }),
)(Private);
