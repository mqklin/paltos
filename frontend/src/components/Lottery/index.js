import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import classNames from 'classnames';
import { MembersList, Game, VkButton } from 'components';

class Share extends Component {
  state = {
    counter: '',
  };

  componentDidMount() {
    this.counterInterval = setInterval(this.updateCounter, 3000);
  }

  updateCounter = () => {
    const counterDiv = this.refs.native.querySelector('td:nth-of-type(3) a div:nth-of-type(2)');
    if (counterDiv === null) return;
    const counter = counterDiv.innerHTML;
    this.setState({ counter });
  };

  componentWillUnmount() {
    clearInterval(this.counterInterval);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.counter !== nextState.counter;
  }

  render() {
    const { counter } = this.state;
    return (
      <div>
        <div
          style={{ display: 'none' }}
          ref="native"
          dangerouslySetInnerHTML={{ __html: VK.Share.button()}}
        />
        <VkButton
          onClick={() => this.refs.native.querySelector('td:nth-of-type(2) a').click()}
        >
          <span className={styles.shareButtonContent}>
            <span className={styles.text}>Рассказать друзьям</span>
            {counter !== '' && <span className={styles.counter}>{counter}</span>}
          </span>
        </VkButton>
      </div>
    );
  }
}

function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

class Lottery extends Component {

  componentDidMount() {
    this.fillVkPostWidget();
  }

  fillVkPostWidget() {
    if (!this.refs.vk_post) return;
    const { lottery: { post_id, post_hash } } = this.props;
    if (!post_id || !post_hash) return;
    this.refs.vk_post.innerHTML = '';
    VK.Widgets.Post('vk_post', -115656486, post_id, post_hash, { width: 500 });
  }

  render() {
    const { vkid, lottery } = this.props;
    return lottery && (
      <div className={styles.root}>
        <div className={classNames(styles.block, styles.vkPost)}>
          <div id="vk_post" ref="vk_post"/>
        </div>
        <div className={styles.block}>
          <Game/>
        </div>
        <div className={styles.block}>
          <Share />
        </div>
        <div className={styles.block}>
          {(() => {
            let members = lottery.members.sort((a, b) => cmp(b.points, a.points) || cmp(b.vkid, a.vkid));
            const meIdx = members.findIndex(m => m.vkid === vkid);
            if (meIdx !== -1) {
              const me = members[meIdx];
              members = [...members.slice(0, meIdx), ...members.slice(meIdx + 1)];
              members.unshift(me);
            }
            return <div className={styles.membersList}>
              <MembersList members={members}/>
            </div>;
          })()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    vkid: state.data.vkid,
    lottery: state.data.lottery,
  }),
)(Lottery);
