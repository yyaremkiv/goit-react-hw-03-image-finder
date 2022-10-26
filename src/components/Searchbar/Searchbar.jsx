import React, { Component } from 'react';
import css from './Searchbar.module.scss';

export class Searchbar extends Component {
  state = {
    nameImage: '',
  };

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.nameImage) {
      alert('Please input image Name');
      return;
    }

    this.props.onSubmit(this.state.nameImage);
    this.reset();
  };

  handleChangeName = event => {
    this.setState({
      nameImage: event.currentTarget.value,
    });
  };

  reset() {
    this.setState({ nameImage: '' });
  }
  render() {
    return (
      <header className={css.searchbar}>
        <form className={css.searchForm} onSubmit={this.handleSubmit}>
          <button type="submit" className={css.searchFormButton}>
            <span className={css.searchFormButtonLabel}>Search</span>
          </button>

          <input
            className={css.searchFormInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.nameImage}
            onChange={this.handleChangeName}
          />
        </form>
      </header>
    );
  }
}
