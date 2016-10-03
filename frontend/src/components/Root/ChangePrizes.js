import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, ClickableText } from 'components';
import styles from './styles.scss';
import Prizes from './Prizes';

class ChangePrizes extends Component {
  render() {
    return (
      <div className={styles.block}>
        <div className={styles.header}>Призовые места</div>
        <Prizes />
      </div>
    );
  }
}


export default  connect(
  state => ({ ws: state.ws })
)(ChangePrizes);
