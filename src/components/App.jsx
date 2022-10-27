import React, { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import NewsApiService from './services/image-api';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreBtn } from './Button/Button';
import { Loader } from './Loader/Loader';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Modal } from './Modal/Modal';
import { ErrorMessage } from './ErrorMessage/ErrorMessage';

const newsApiService = new NewsApiService();
const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    searchName: '',
    imageGallery: [],
    page: 1,
    perPage: 12,
    totalImages: 0,
    error: null,
    status: Status.IDLE,
    imageModal: '',
    imageModalAlt: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchName, imageGallery, page, perPage } = this.state;

    if (prevState.searchName !== searchName || prevState.page !== page) {
      this.setState({ status: Status.PENDING });

      try {
        const response = await newsApiService.getResponse(
          searchName,
          page,
          perPage
        );

        const { total, hits } = response.data;

        if (total === 0) {
          this.setState({ status: Status.IDLE });
          Notify.info(
            `Nothing was found for "${searchName}". Please try again by changing the search entry`
          );
          return;
        }

        if (!imageGallery.length) {
          this.setState({
            imageGallery: hits,
            status: Status.RESOLVED,
            totalImages: total,
          });
          return;
        }

        if (imageGallery.length) {
          this.setState({
            imageGallery: [...prevState.imageGallery, ...hits],
            status: Status.RESOLVED,
            totalImages: total,
          });
          this.scroll();
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
    const imageModalAlt = e.target.alt;
    this.setState({ imageModal, imageModalAlt });
  };

  closeModal = () => {
    this.setState({ imageModal: null });
  };

  scroll = () => {
    const { height } = document.getElementById('gallery').firstElementChild.getBoundingClientRect();
    console.log(height);
    window.scrollBy({
      top: height,
      behavior: 'smooth',
    });
  }

  render() {
    const { onSubmitForm, handleLoadMore } = this;
    const {
      searchName,
      imageGallery,
      status,
      page,
      perPage,
      totalImages,
      imageModal,
      imageModalAlt,
      error,
    } = this.state;

    const visibleLoadMoreButton =
      totalImages > page * perPage && status === 'resolved';

    return (
      <>
        <Searchbar onSubmit={onSubmitForm} prevSearchName={searchName} />
        <ImageGallery>
          {imageGallery &&
            <ImageGalleryItem
              imageGallery={imageGallery}
              onClick={this.openModal}
            />
          }
        </ImageGallery>

        {status === 'pending' && <Loader />}

        {visibleLoadMoreButton && <LoadMoreBtn onClick={handleLoadMore} />}

        {imageModal && (
          <Modal url={imageModal} alt={imageModalAlt} onCloseModal={this.closeModal} />
        )}

        {status === 'rejected' && <ErrorMessage onError={error} />}
      </>
    );
  }
}
