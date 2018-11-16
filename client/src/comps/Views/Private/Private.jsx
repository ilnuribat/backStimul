import React, { Component, Fragment } from 'react'
import 'animate.css';
import { graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import ChatView from '../ChatView/ChatView';
import { getChat, setChat } from '../../../GraphQL/Cache';
import Content from '../../Lays/Content';
import Bar from '../../Lays/Bar';
import PrivateBar from './PrivateBar';
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
    }

    this.setStateProps = this.setStateProps.bind(this)
  }

  componentDidMount(){

    let {getchat} = this.props;

    this.setStateProps(getchat)
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

    return(
      <Fragment>
        <Content view="OvH Row OvH Pad10">
          {
            this.props.getchat && this.props.getchat.id ?
              <ContentInner view="Row OvH Pad10">
                <ChatView key={this.props.getchat.id} name={this.props.getchat.name} id={this.props.getchat.id} priv={1} />
              </ContentInner>
              : 
              (
                <ContentInner view="Row OvH Pad10">
                  <div className="errorMessage">Выберите чат</div>
                </ContentInner>
              )
          }
          <InnerBar>
            <PrivateBar />
          </InnerBar>
          
        </Content>
      </Fragment>
    );
  }
}

Private.propTypes = {
  setChat: PropTypes.func.isRequired,
  getchat: PropTypes.object.isRequired
};


export default compose(
  graphql(getChat, { name: 'getchat' }),
  graphql(setChat, { name: 'setChat' }),
)(Private);
