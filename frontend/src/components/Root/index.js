import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './styles.scss';
import CreateLottery from './CreateLottery';
import PlayLottery from './PlayLottery';
import { Input, ClickableText } from 'components';

class ChangeHash extends Component {
  state = {
    hash: '',
  };
  render() {
    const { hash } = this.state;
    return (
      <div className={styles.block}>
        <div className={styles.header}>Добавить hash</div>
        <div className={styles.el}>
          <Input value={hash} onChange={hash => this.setState({ hash })} textAlignCenter/>
        </div>
        <div className={styles.el}>
          <ClickableText text="Изменить" onClick={() => this.props.onClick(hash)}/>
        </div>
      </div>
    );
  }
}



class Root extends Component {
  changeHash = (hash) => {
    this.props.ws.sendMessage({ type: 'ROOT', method: 'change_hash', hash });
  };
  render() {
    return (
      <div className={styles.root}>
        <CreateLottery />
        <ChangeHash onClick={this.changeHash}/>
        <PlayLottery />
      </div>
    );
  }
}

export default connect(
  state => ({
    ws: state.ws,
  })
)(Root);
