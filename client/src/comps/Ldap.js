import React, { Component } from 'react'
import PropTypes from 'prop-types'
var ldap = require('ldapjs');

export class Ldap extends Component {
  static propTypes = {

  }

  render() {

    
    var client = ldap.createClient({
      url: 'ldap://pdcg.guss.ru:389/'
    });

    client.bind('CN=LDAP USER', '2wKzTrzIs7mCHb', function (err) {
      if(err){
        console.log(err)
      }
    });
    var opts = {
      filter: '(&((email=*))',
      scope: 'base',
      attributes: null
    };

    client.search('OU=GUOVUsers,DC=guss,DC=ru', opts, function (err, res) {
      if (err) {
        console.log(err)
      }
      console.log(res)

      // res.on('searchEntry', function (entry) {
      //   console.log('entry: ' + JSON.stringify(entry.object));
      // });
      // res.on('searchReference', function (referral) {
      //   console.log('referral: ' + referral.uris.join());
      // });
      // res.on('error', function (err) {
      //   console.error('error: ' + err.message);
      // });
      // res.on('end', function (result) {
      //   console.log('status: ' + result.status);
      // });
    });


    return (
      <div>
        
      </div>
    )
  }
}

export default Ldap
