import React from "react";
import PropTypes from 'prop-types';

export default class NavLink extends React.Component {
  handleClick = () => {
    this.props.onClick1(this.props.index, this.props.name);
  }
  render() {
    return (
      <button type="button" onClick={this.handleClick}  style={{ "width": "100%", "height": "39px" }} >{this.props.children}</button>
    );
  }
}

NavLink.propTypes = {
  onClick1: PropTypes.func.isRequired,
  index: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
};
