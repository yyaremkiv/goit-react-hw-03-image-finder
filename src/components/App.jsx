import React, { Component } from 'react';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';

import NewsApiService from './services/image-api';
import { LoadMoreBtn } from './Button/Button';
import { Loader } from './Loader/Loader';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Modal } from './Modal/Modal';
import {ErrorMessage} from './ErrorMessage/ErrorMessage'

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
    perPage: 4,
    totalImages: 0,
    error: null,
    status: Status.IDLE,
    imageModal: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchName, imageGallery, page, perPage } = this.state;

    if (prevState.searchName !== searchName || prevState.page !== page) {
      this.setState({ status: Status.PENDING });

      try {
        const response = await newsApiService.getResponse(searchName, page, perPage);
        
        if (response.data.total === 0) {
          this.setState({ status: Status.REJECTED });
          console.log('ничего не знайдено');
          return;
        }
        if (!imageGallery.length) {
          this.setState({
            imageGallery: response.data.hits,
            status: Status.RESOLVED,
            totalImages: response.data.total,
          });
          return;
        }

        if (imageGallery.length) {
          console.log(response.data.total);
          this.setState({
            imageGallery: [...prevState.imageGallery, ...response.data.hits],
            status: Status.RESOLVED,
            totalImages: response.data.total,
          });
          return;
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

  openModal = e => {
    const imageModal = e.target.dataset.url;
    console.log(e.target.dataset.url);
    this.setState({ imageModal: imageModal });
  };

  closeModal = () => {
    this.setState({ imageModal: null });
  };

  render() {
    const { onSubmitForm, handleLoadMore } = this;
    const { imageGallery, status, page, perPage, totalImages, imageModal, error} = this.state;

    const visibleLoadMoreButton = totalImages > page*perPage && status === 'resolved';

    return (
      <>
        <Searchbar onSubmit={onSubmitForm} />
        <ImageGallery>
          {imageGallery && <ImageGalleryItem imageGallery={imageGallery} onClick={this.openModal} />}
        </ImageGallery>
        {status === 'pending' && <Loader />}
        {visibleLoadMoreButton && <LoadMoreBtn onClick={handleLoadMore} />}
        {imageModal && <Modal url={this.state.imageModal} onCloseModal={this.closeModal} />}
        {status === 'rejected' && <ErrorMessage onError={error} />}
      </>
    );
  }
}
