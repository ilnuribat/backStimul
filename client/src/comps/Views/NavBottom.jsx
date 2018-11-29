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
      if(localStorage.getItem('theme')){
        this.setState({
          theme: localStorage.getItem('theme'),
        })
      }
    }

    changeTheme(){
      if(!this.state.theme){
        localStorage.setItem('theme', 'white')
        this.setState({
          theme: 'white',
        });
      }
      else if(this.state.theme === 'white'){
        localStorage.setItem('theme', 'gold')
        this.setState({
          theme: 'gold',
        });
      }else{
        localStorage.setItem('theme', '')
        this.setState({
          theme: '',
        });
      }
    }

    render() {
      let ColorParent, ColorSecond,BakgrColorPrimary,BakgrColorSecondary,BakgrColorMaster,BakgrColorSlave;

      if(this.state.theme === 'white'){
        ColorParent = "#222";
        ColorSecond = "#666";
        BakgrColorPrimary = "#f4f8f9";
        BakgrColorSecondary = "#3e74b27c";
        BakgrColorMaster = "#ffffff";
        BakgrColorSlave = "#eaedee";
      }

      if(this.state.theme === 'gold'){
        ColorParent = "#222";
        ColorSecond = "#666";
        BakgrColorPrimary = "#d9ddb9";
        BakgrColorSecondary = "#3e74b27c";
        BakgrColorMaster = "#f2d819";
        BakgrColorSlave = "#eaedee";
      }




      return (
        <div className = "NavBottom" >
          <div className={"ColorButton " + this.state.theme } onClick={this.changeTheme}></div>

          {this.state.theme ? (<style type="text/css">{`
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
