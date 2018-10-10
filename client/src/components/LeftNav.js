import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
import PropTypes from 'prop-types';

import Private from './Nav/Private';
import Groups from './Nav/Groups';
import Profile from './Nav/Profile';
import Loading from './Loading';

import { PRIVS_QUERY, cSetCountPrivates } from '../graph/querys';

class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
    }
  }

  hidePanel = () => {
  }

  render() {
    // const { getUnreadCount } = this.props;

    // console.warn ("user: " , getUnreadCount.user)

    return (
      <Fragment>
        <nav className="left-nav">
          <Profile />
          <Groups />
          <Query query={PRIVS_QUERY}>
            {({ loading, error, data, refetch, subscribeToMore }) => {
              if (loading){
                return (
                  <div style={{ paddingTop: 20 }}>
                    <Loading />
                  </div>
                );
              }
              if (error){
                return (
                  <div style={{ paddingTop: 20 }}>
                    <Loading />
                  </div>
                );
              }
              if(data && data.user && data.user.directs){
                let privs = 0;

                data.user.directs.map((e,i)=>{
                  privs = privs + e.unreadCount;
                })
                this.props.cSetCountPrivates({
                  variables: { unr: privs }
                });
              }

              return <Private />
            }}
          </Query>

        </nav>
      </Fragment>
    )
  }
}

LeftNav.propTypes = {
  getUnreadCount: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      directs: PropTypes.array,
      groups: PropTypes.array,
    }),
  }),
  cSetCountPrivates: PropTypes.func
};


export default compose(
  graphql(cSetCountPrivates, { name: 'cSetCountPrivates' }),
)(LeftNav);


// {/* <div className="nav-button" name="users" onClick={() => { this.props.lstate('users') }}>
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path fill="none" d="M0 0h24v24H0V0z"/><circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-2.5c2.33 0 4.32-1.45 5.12-3.5h-1.67c-.69 1.19-1.97 2-3.45 2s-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5z"/></svg>
// </div> */}

// // <div className="nav-button" name="private" onClick={() => { this.props.lstate('private') }}>
// //   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.07 0-1.93-.86-1.93-1.93-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36 0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96 1.05-1.12 3.67-1.69 5.14-1.69.53 0 1.2.08 1.9.22-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13 1.07 0 2.92.39 3.84 1.15-1.17 2.97-4.06 5.09-7.45 5.09z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
// // </div>

// {/* <div className="nav-button" name="chat" onClick={() => { this.props.lstate('chat') }}>
//   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
//     <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
//     <path d="M0 0h24v24H0z" fill="none" />
//   </svg><div className="indic g">15</div>
// </div> */}


// // <div className="nav-button" name="kan-root">
// //   <Link
// //     className="link dim black b f6 f5-ns dib mr3"
// //     to="/"
// //     title="Root"
// //   >
// //     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
// //       <path d="M0 0h24v24H0z" fill="none" />
// //       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
// //     </svg>
// //   </Link>
// // </div>

// {/* <div className="nav-button" name="test" onClick={() => { this.props.lstate('test') }}>
//   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
//     <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
//     <path d="M0 0h24v24H0z" fill="none" />
//   </svg>
//   <div className="indic">3</div>
// </div> */}

// {/* <div className="nav-button" name="search">
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//     <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//     <path d="M0 0h24v24H0z" fill="none" />
//   </svg>
// </div> */}

// {/* <div className="nav-button" name="fire" onClick={() => { this.props.lstate('fire') }}>

//   <svg xmlns="http://www.w3.org/2000/svg" className="fill-rd" width="24" height="24" viewBox="0 0 24 24">
//     <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
//     <path d="M0 0h24v24H0z" fill="none" />
//   </svg>
// </div> */}

// {/* <div className="nav-button" name="favor" onClick={() => { this.props.lstate('favor') }}>
//   <svg xmlns="http://www.w3.org/2000/svg" className="fill-yl" width="24" height="24" viewBox="0 0 24 24">
//     <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
//     <path d="M0 0h24v24H0z" fill="none" />
//   </svg>
// </div> */}

// {/* <div className="nav-button" name="help" onClick={() => { this.props.lstate('help') }}>
//   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
//     <path d="M0 0h24v24H0z" fill="none" />
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
//   </svg>
// </div> */}



