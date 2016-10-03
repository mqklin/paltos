import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

class ClickableText extends Component {
  render() {
    const { text, href, onClick, type, isActive, disabled } = this.props;
    if (href) return (
      <span className={styles.blank}>
        <a href={href} target="_blank">{text}</a>
      </span>
    );

    switch (type) {
      case 'linkButton':
        return <span className={classNames(styles.linkButton, disabled && styles.disabled)} onClick={onClick}>{text}</span>
      default:
        return (
          <button
            onClick={onClick}
            className={classNames(styles.button, isActive && styles.isActive, disabled && styles.disabled)}
          >
            <span className={styles.text}>{text}</span>
          </button>
        );

    }
  }
};


export default ClickableText;
