import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { graphql, compose } from "react-apollo";
// import NavTopInner from './NavTopInner';
// import Logo from './Logo.jpg'
import logoImg from '../Img/Logo';
import { qauf, _url } from '../../constants';
import { ALL_MESSAGE_CREATED } from '../../GraphQL/Qur/Subscr';
import { lastMessageCache, getlastMessageCache, cGetCountPrivates, cSetCountPrivates, messagesListCacheUpdate, privateListCacheUpdate } from '../../GraphQL/Cache';
import { getUnreadCount } from '../../GraphQL/Qur/Query';
import { UserRow } from '../Parts/Rows/Rows';

class NavBottom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunOnce: false,
      theme: '',
    }

    this.changeTheme = this.changeTheme.bind(this)
  }

    componentDidMount (){
      if(localStorage.getItem('theme') === 'white'){
        this.setState({
          theme: ' white',
        })
      }
    }

    changeTheme(){
      if(localStorage.getItem('theme') === 'white'){
        localStorage.setItem('theme', '')
        this.setState({
          theme: '',
        });
      }else{
        localStorage.setItem('theme', 'white')
        this.setState({
          theme: ' white',
        })
      }
    }

    render() {
      let ColorParent = "#222";
      let ColorSecond = "#666";
      let BakgrColorPrimary = "#f4f8f9";
      let BakgrColorSecondary = "#3e74b27c";
      let BakgrColorMaster = "#ffffff";
      let BakgrColorSlave = "#eaedee";



      return (
        <div className = "NavBottom" >
          <div className={"ColorButton" + this.state.theme } onClick={this.changeTheme}></div>

          {this.state.theme === ' white' ? (<style type="text/css">{`
            body,h1,h2,h3,h4,h5,p,div,span,
            .TileBoardTopCenter,.TileBoardTop .TileBoardTopName h1,
            .TileBoardTop .TileBoardTopCenter h1,
            .Tile .name,
            .Column-Name,
            .Column .Name,
            .Task-Name,
            .Board-Top h1,
            .SearchBody .BlockHeader
            {color:${ColorParent};}
            .grey p, .cgr p,
            .grey, .cgr,
            .UserRow .UserName
            {
              color:${ColorSecond};
            }
            .Root{background: ${BakgrColorPrimary};background-color: ${BakgrColorPrimary};}
            .Tile{background: ${BakgrColorMaster};background-color: ${BakgrColorMaster};}
            .Nav, .Panel, .Column,.Board-Top,.Task
            ,.Bar
            ,.InnerBar
            ,.ChatMessages
            {
              background: ${BakgrColorMaster};
              background-color: ${BakgrColorMaster};
              color:${ColorParent};
            }
            .ChatForm,
            .Board-Top{
              background: transparent;
              background-color: transparent;
            }
            
            .searchTag
            {
              background:${BakgrColorPrimary};
              background-color: ${BakgrColorPrimary};
              color:${ColorParent};
            }
            .Chat       
            {
              background: ${BakgrColorSlave};
              background-color: ${BakgrColorSlave};
              color:${ColorParent};
            }
            
            .EditForm label input, label.LabelInputText input,
            label.LabelSelect input, label.LabelInputDate input,
            label.LabelInputList input
            ,.ChatForm .textarea-wrapper
            
            {
              background: ${BakgrColorPrimary};
              background-color: ${BakgrColorPrimary};
              color:${ColorParent};
            }
            .Task{border-color:rgba(0,0,0,0.1);}
            .Task.Sel,.Task.Sel .Name,.Task.Sel .Task-Name{color:${BakgrColorMaster};}
            .msgs{
              background: ${BakgrColorPrimary};
              background-color: ${BakgrColorPrimary};
            }
            .Chat,
            .msgs{
              box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.2);
            }
            .FileIcon svg{
              fill:${BakgrColorSecondary};
            }
            .FileIcon,
            .FileIcon .Svg{
              background: ${BakgrColorPrimary};
            }

          `}</style>) : null}
        </div>
      )
    }
}


NavBottom.propTypes = {
};

export default compose(
  graphql(cGetCountPrivates, { name: 'cGetCountPrivates' }),
)(NavBottom);