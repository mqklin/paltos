import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { ClickableText } from 'components';

class Header extends Component {
  handleLogout = () => {
    VK.Auth.logout(() => this.props.ws.close());
  };

  changeNavigation = (navigation) => {
    this.props.dispatch({ type: 'SET_DATA', navigation });
  };

  render() {
    const { name, vkid, navigation } = this.props;
    return (
      <div className={styles.root}>
        <span className={styles.el}>
          <ClickableText
            text="Главная"
            isActive={navigation === ''}
            onClick={() => this.changeNavigation('')}
          />
        </span>
        <span className={styles.el}>
          <ClickableText
            text="История"
            isActive={navigation === 'histories'}
            onClick={() => this.changeNavigation('histories')}
          />
        </span>
        {<span className={styles.el}>
           <span className={styles.name}>
            {name}
            <ClickableText type="linkButton" onClick={this.handleLogout} text="выйти"/>
          </span>
        </span>}
        {vkid === 158610174 && <span className={styles.el}>
          <ClickableText
            text="?"
            onClick={() => this.changeNavigation('root')}
            isActive={navigation === 'root'}
          />
        </span>}
      </div>
    );
  }
};

export default connect(
  state => ({
    ws: state.ws,
    vkid: state.data.vkid,
    name: state.data.name,
    navigation: state.data.navigation,
  })
)(Header);
