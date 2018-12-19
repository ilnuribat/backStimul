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

    });


    return (
      <div>
        
      </div>
    )
  }
}

export default Ldap
