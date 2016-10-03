import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';

class VkButton extends Component {
  render() {
    const { text, onClick, children } = this.props;
    return (
      <div className={styles.root} onClick={onClick}>
        <span className={styles.icon}/>
        <span>{children}</span>
      </div>
    );
  }
}

export default connect()(VkButton);
