import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ClickableText } from 'components';
import styles from './styles.scss';

class PlayLottery extends Component {
  render() {
    return (
      <div className={styles.block}>
        <div className={styles.header}>Разыграть лотерею</div>
        <div className={styles.el}>
          <ClickableText
            text="Разыграть"
            onClick={() => this.props.ws.sendMessage({ type: 'ROOT', method: 'play_lottery', })}/>
          </div>
      </div>
    );
  }
}

export default  connect(
  state => ({ ws: state.ws })
)(PlayLottery);
