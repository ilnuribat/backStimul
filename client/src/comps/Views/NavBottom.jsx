import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom';
// import _ from 'lodash';
import { graphql, compose } from "react-apollo";
// import NavTopInner from './NavTopInner';
// import Logo from './Logo.jpg'
// import logoImg from '../Img/Logo';
// import { qauf, _url } from '../../constants';

import { cGetCountPrivates } from '../../GraphQL/Cache';

// import { UserRow } from '../Parts/Rows/Rows';

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
    let ColorParent,
      ColorSecond,
      BgFirst,
      tr,
      BgSecond,
      BgThird,
      Master,
      Accent,
      BakgrColorPrimary,
      BakgrColorSecondary,
      BakgrColorMaster,
      BakgrColorSlave,
      BakgrColorBlue,
      LightBlue,
      bglight,
      bglight2,
      bglighttr,
      rgba1,
      rgba2,
      rgba3,
      rgba4,
      col1,
      col2,
      col3,
      col4,
      na,
      no;

    if(this.state.theme === 'white'){
      ColorParent = "#222";
      ColorSecond = "#666";
      BakgrColorPrimary = "#f4f8f9";
      BakgrColorSecondary = "#3e74b27c";
      BakgrColorMaster = "#ffffff";
      BgFirst = "#ffffff";
      BgSecond = "#ffffff";
      BgThird = "#ffffff";
      Master = "#ffffff";
      Accent = "#ffffff";
      BakgrColorSlave = "#eaedee";
      BakgrColorBlue = "#3e75b2";
      LightBlue = "#39608c4f";
      LightBlue = "#b3d7ffd4";
      bglight = "#eee";
      bglight2 = "rgb(216, 225, 228)";
      bglighttr = '#eeeeeeee';
      bglighttr = '#eeeeeeee';
      tr = 'transparent';
      rgba1 = 'rgba(255, 255, 255, 0.5)';
      rgba2 = 'rgba(255, 255, 255, 0.1)';
      rgba3 = 'rgba(255, 255, 255, 0.3)';
      rgba4 = 'rgba(255, 255, 255, 1)';
      col1 = '#222';
      col2 = '#555';
      col3 = '#999';
      col4 = '#aaa';
    }

    // if(this.state.theme === 'gold'){
    //   ColorParent = "#222";
    //   ColorSecond = "#666";
    //   BakgrColorPrimary = "#d9ddb9";
    //   BakgrColorSecondary = "#3e74b27c";
    //   BakgrColorMaster = "#bba927";
    //   BakgrColorSlave = "#d9ddb9";
    //   BakgrColorBlue = "#3e75b2";
    // }




    return (
      <div className = "NavBottom" >
        <div className={"ColorButton " + this.state.theme } onClick={this.changeTheme}></div>

        {this.state.theme == "white" ? (<style type="text/css">{`
            body,h1,h2,h3,h4,h5,p,div,span,
            .TileBoardTopCenter,.TileBoardTop .TileBoardTopName h1,
            .TileBoardTop .TileBoardTopCenter h1,
            .Tile .name,
            .Column-Name,
            .Column .Name,
            .Task-Name,
            .Board-Top h1,
            .Board-Top-New  h1,
            .SearchBody .BlockHeader
            {color:${ColorParent};}
            .grey p, .cgr p,
            .grey, .cgr,
            .UserRow .UserName,
            .UserNameText
            {
              color:${ColorSecond};
            }
            .Master{
              color:${ColorSecond};
              background: ${bglighttr};
            }
            .Root{background: ${BakgrColorPrimary};background-color: ${BakgrColorPrimary};}
            .Tile{background: ${BakgrColorMaster};background-color: ${BakgrColorMaster};}
            .Nav, .Panel, .Column,
            .Board-Top,
            .Board-Top-New,
            .Task
            ,.Bar
            ,.InnerBar
            ,.ChatMessages
            {
              background: ${BakgrColorMaster};
              background-color: ${BakgrColorMaster};
              color:${ColorParent};
            }
            .ChatForm,
            .Board-Top,
            .Board-Top-New 
            {
              background: ${Master};
              background-color: ${Master};
            }
            .Tabs-Button .bg
            {
              background: transparent;
              border-left: 10px dotted transparent;
              border-right: 10px solid transparent;
              border-top: 30px solid rgba(0, 0, 0, 0.1);
            }
            .Tabs-Button.active .bg,
            .Tabs-Button.sel .bg,
            .Tabs-Button:hover .bg
            {
              border-top: 30px solid #ffffff;
            }
            .Tabs-Button .text
            {
              position:relative;
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
              background: transparent;
              background-color: transparent;
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
            .EditForm label, label.LabelInputText, label.LabelSelect, label.LabelInputDate, label.LabelInputList{
              background: ${BakgrColorPrimary};
              background-color: ${BakgrColorPrimary};
            }
            .Chats .Row{
              background: #fafbfb;
              border-bottom: 1px solid #e6ecee;
            }
            .Task.Sel .Name,.ChatForm input, .ChatForm textarea, .Task .TaskChat .ChatName{
              color:${ColorParent};
            }
            .Task.Child{
              background:#39608c4f;
              background-color:#39608c4f;
            }
            .Tile.Object{
              background:#39608c4f;
              background-color:#39608c4f;
            }
            .TreePlus svg, .TreeMinus svg{
              fill:;
            }
            .ModalWrap > div > .inner{
              background:${BakgrColorMaster};
            }
            .ModalBlockName{
            }
            .ModalWrap input,
            .ModalWrap label,
            .ModalWrap .InputWrapper,
            .FakeSelect,
            .FakeSelect .FakeOption,
            .FakeSelect .FakeOptionsContainer .FakeOption
            {
              background:${bglight2};
              background-color:${bglight2};
              color:${ColorParent};
            }
            ::-webkit-input-placeholder {
              color: ${ColorParent};
            }
            :-ms-input-placeholder {
              color: ${ColorParent};
            }
            ::-moz-placeholder {
              color: ${ColorParent};
              opacity: 1;
            }
            ::placeholder {
              color: ${ColorParent};
              opacity: 1;
            }
            :placeholder {
              color: ${ColorParent};
              opacity: 1;
            }
            :-moz-placeholder {
              color: ${ColorParent};
              opacity: 1;
            }
            .FakeSelect .FakeOptionsContainer .FakeOption:hover,
            .FakeSelect .FakeOptionsContainer.Out .FakeOption:hover
            {
              background: ${LightBlue};
              background-color: ${LightBlue};
              color: #fff;
            }
            .InputWrapper,
            .InputWrapper input,
            .FakeSelect .FakeOptionsContainer.Out{
              background: ${bglighttr};
              background-color: ${bglighttr};
            }
            .FakeSelect .FakeOptionsContainer .ContainerOuter{
              background: ${bglighttr};
              background-color: ${bglighttr};
            }
            .InputWrapper,
            .InputWrapper input{
              color: ${ColorParent};
            }
            .auth,
            .Profile.auth
            {
              background: ${BgFirst};
              color: ${ColorParent};
            }
            body, .UserRow .UserName,
            .RowBlock, .UserNameText, 
            .authRow .authRowContent, 
            .authBottom .button, input[type="text"], 
            input[type="date"], input[type="datetime"], 
            input[type="email"], input[type="number"], 
            input[type="search"], input[type="time"], 
            input[type="url"], input[type="list"], 
            input[type="password"], input[type="button"], 
            input[type="submit"], select, textarea{
              color: ${ColorParent};
              background:transparent;
            }
            .Tabs-Button .text{
              color:#555;
            }
            .Tabs-Button.a .text,
            .Tabs-Button.active .text,
            .Tabs-Button:hover .text,
            .Tabs-Button.sel .text
            {
              color:#222;
              background:#fff;
            }
            .Tabs-Button.a .text::before,
            .Tabs-Button.active .text::before,
            .Tabs-Button.sel .text::before,
            .Tabs-Button:hover .text::before,
            .Tabs-Button:hover .text::after,
            .Tabs-Button.a .text::after,
            .Tabs-Button.active .text::after,
            .Tabs-Button.sel .text::after
            {
              border-top-color:#fff;
            }
            .TopBar .top{
  background:${rgba1};
}
.Tab .text{
  background: ${rgba1};
  color:${col4};
  border-bottom:1px solid ${rgba1};
}
.Tab::after,
.Tab::before
{
  border-left:0px solid transparent;
  border-right:0px solid transparent;
  border-bottom:0px solid transparent;
}
.Tab.a::after,
.Tab:hover::after,
.Tab.a::before,
.Tab:hover::before{
  border-top:40px solid ${rgba4};
}

.Tab.a::after,
.Tab:hover::after{
  border-right:20px solid transparent;
}
.Tab.a::before,
.Tab:hover::before{
  border-left:20px solid transparent;
}

.Tab.a .text,
.Tab:hover .text
{
  background: ${rgba4};
  color:${col1};
}

.Tab::before
{
  border-top:40px solid ${rgba1};
  border-right:0px solid transparent;
  border-left:20px solid transparent;
}
.Tab::after
{
  border-top:40px solid ${rgba1};
  border-right:20px solid transparent;
  border-left:0px solid transparent;
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
