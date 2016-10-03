import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class VkontakteComments extends Component {
  componentDidMount() {
    VK.Widgets.Comments('vk_comments', { redesign: 1, limit: 20, width: '500', attach: '*' });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div id='vk_comments'></div>
    );
  }
}

export default connect()(VkontakteComments);
