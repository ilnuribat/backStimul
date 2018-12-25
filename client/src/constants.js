import moment from 'moment';
import ColorHash from 'color-hash';

export const colorHash = new ColorHash({lightness: 0.7, hue: 0.8});


export const savePlace =(id,name,type)=>{
  localStorage.setItem("place", `"id":"${id}","name":"${name}","type":"${type}"`);

  return true;
}

export const timeEdit = (time) => {
  if(time){

    let a = '';

    // const dif = moment(moment().toISOString()).diff(moment(time).toISOString()) / 3600000;//3600000;

    if(moment(time).format("YYYY") !== moment().format("YYYY")){
      a = moment(time).format("YYYY DD MMM, HH:mm");
    }
    else if (moment(time).format("DD MMM") !== moment().format("DD MMM")) {
      a = moment(time).format("DD MMM, HH:mm");
    }
    // else if (dif < 12 && moment(time).format("YYYY") == moment().format("YYYY")) {
    //   a = moment(time).format("hh:mm");
    // }
    else {
      a = moment(time).format("HH:mm");
    }

    return a;
  }else{
    return ''
  }
}

export const colors = {
  blue: {
    deep: 'rgb(0, 121, 191)',
    light: 'lightblue',
    lighter: '#d9fcff',
    soft: '#E6FCFF',
  },
  black: '#4d4d4d',
  shadow: 'rgba(0,0,0,0.2)',
  grey: {
    darker: '#C1C7D0',
    dark: '#E2E4E6',
    medium: '#DFE1E5',
    N30: '#EBECF0',
    light: '#F4F5F7',
  },
  green: 'rgb(185, 244, 188)',
  white: 'white',
  purple: 'rebeccapurple',
};

export const quf = (query) => {
  return fetch(`${protocol}${_url}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  })
    .then(r => r.json())
    .then(data => data)
};
export const qauf = (query, uri, auth) => {
  let url = _url;

  if(uri){
    url = uri;
  }

  if (!url.startsWith('http')) {
    url = `${protocol}${url}`;
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
    body: JSON.stringify({
      query
    })
  })
    .then(r => r.json())
    .then(data => data)
};

export const grid = 8;

export const borderRadius = 2;

export const _url = process.env.REACT_APP_ENDPOINT || '185.168.187.103:8500';
export const protocol = process.env.REACT_APP_PROTOCOL || 'http://';
export const wsProtocol = protocol === 'https://' ? 'wss://' : 'ws://';
// export const _url = 'localhost:8500';

export const AUTH_TOKEN = 'auth-token';
