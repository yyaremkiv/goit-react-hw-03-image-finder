import React, { Component } from 'react';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';

import NewsApiService from './services/image-api';
import { LoadMoreBtn } from './Button/Button';
import { Loader } from './Loader/Loader';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};
const newsApiService = new NewsApiService();

export class App extends Component {
  state = {
    searchName: '',
    imageGallery: [],
    page: 1,
    error: null,
    status: Status.IDLE,

  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchName, imageGallery, page } = this.state;

    if (prevState.searchName !== searchName || prevState.page !== page) {
      this.setState({ status: Status.PENDING });

      try {
        const response = await newsApiService.getResponse(searchName, page);

        if (!imageGallery.length) {
          this.setState({
            imageGallery: response.data.hits,
            status: Status.RESOLVED,
          });
        }

        if (imageGallery.length) {
          this.setState({
            imageGallery: [...prevState.imageGallery, ...response.data.hits],
            status: Status.RESOLVED,
          });
        }
      } catch (error) {
        this.setState({ error, status: Status.REJECTED });
        return;
      }
    }
  }

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  onSubmitForm = searchName => {
    this.setState({ searchName, imageGallery: [] });
  };

  render() {
    const { onSubmitForm, handleLoadMore } = this;
    const { imageGallery, status } = this.state;

    return (
      <>
        <Searchbar onSubmit={onSubmitForm} />
        <ImageGallery>
          {imageGallery && <ImageGalleryItem imageGallery={imageGallery} />}
        </ImageGallery>
        {status === 'pending' && <Loader />}
        {status === 'resolved' && <LoadMoreBtn onClick={handleLoadMore} />}
      </>
    );
  }
}
