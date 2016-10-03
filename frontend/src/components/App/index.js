import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { Header, Lottery, Histories, Root, VkButton, PrizePopup, VkComments } from 'components';
import classNames from 'classnames';

class AuthWidget extends Component {
  componentDidMount() {
    VK.Widgets.Auth('vk_auth', { width: '200px', onAuth: ({ uid, hash }) => this.props.onAuth({ vkid: uid, hash }) });
  }
  render() {
    return <div id="vk_auth" />;
  }
}

const host = (process.env.NODE_ENV !== 'production' ? 'ws://localhost:80' : `wss://${window.document.location.host}`) + '/ws';
function initWebsocket(dispatch) {
  const ws = new WebSocket(host);

  ws.sendMessage = (data) => ws.send(JSON.stringify(data));

  ws.onopen = () => {
    dispatch({ type: 'SET_WS', ws });
    VK.Auth.getLoginStatus(({ session }) => {
      if (!session) return;
      const { expire, mid: vkid, secret, sid, sig } = session;
      ws.sendMessage({ type: 'LOGIN', expire, vkid, secret, sid, sig });
    });
  };

  ws.onmessage = ({ data: d }) => {
    const data = JSON.parse(d);
    dispatch({ type: 'SET_DATA', ...data });
  }

  ws.onclose = () => {
    dispatch({ type: 'SET_WS', ws: '' });
    dispatch({ type: 'SET_DATA', vkid: '', game: null, lottery: null });
    initWebsocket(dispatch);
  };
}

class App extends Component {
  componentDidMount() {
    initWebsocket(this.props.dispatch);
  }

  render() {
    const { ws, navigation, vkid, prize } = this.props;
    return !ws ? null : (
      <div className={styles.root}>
        <div className={styles.container}>
          {!vkid
          ? <div className={styles.login}>
              <AuthWidget onAuth={({ hash, vkid }) => this.props.ws.sendMessage({ type: 'LOGIN', hash, vkid })}/>
            </div>
          : [
            <div className={styles.header} key="header">
              <Header/>
            </div>,
            <div className={styles.content} key="content">
              <div className={classNames(navigation !== '' && styles.hidden)}><Lottery/></div>
              <div className={classNames(navigation !== 'histories' && styles.hidden)}><Histories/></div>
              {navigation === 'root' && <Root/>}
              {navigation !== 'root' && <div className={styles.block}><VkComments/></div>}
            </div>
          ]}
          {prize > 0 && <PrizePopup prize={prize}/>}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ws: state.ws,
    navigation: state.data.navigation,
    vkid: state.data.vkid,
    prize: state.data.prize,
  })
)(App);


