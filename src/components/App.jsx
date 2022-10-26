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
    nameImage: '',
    imageGallery: null,
    page: 1,
    error: null,
    status: Status.IDLE,
    loadButtonShow: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevName = prevState.nameImage;
    const nextName = this.state.nameImage;

    if (prevName !== nextName) {
      this.setState({ status: Status.PENDING });

      try {
        const response = await newsApiService.getResponse(
          this.state.nameImage,
          this.state.page
        );
        const { hits, totalHits } = response.data;
        if (!hits.length) {
          alert(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          this.setState({ status: Status.RESOLVED });
          return;
        }

        if (this.state.imageGallery) {
          console.log(this.state.imageGallery);
        }
        this.setState({
          imageGallery: response.data.hits,
          status: Status.RESOLVED,
          loadButtonShow: true,
        });
      } catch (error) {
        this.setState({ error, status: Status.REJECTED });
        return;
      }
    }
  }

  loadMore = async query => {
    try {
      const response = await newsApiService.getResponse(query);
      const { hits, totalHits } = response.data;
      if (!hits.length) {
        alert(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        this.setState({ status: Status.RESOLVED });
        return;
      }

      // if (this.state.imageGallery) {
      //   console.log(this.state.imageGallery);
      // }
      this.setState(prevState => ({
        imageGallery: [response.data.hits],
      }));
    } catch (error) {
      // this.setState({ error, status: Status.REJECTED });
      return;
    }
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
      loadButtonShow: true,
    }));
    // this.loadMore(this.props.nameImage, this.state.page);
  };

  handleChangeName = nameImage => {
    this.setState({ nameImage });
  };

  render() {
    const { handleChangeName } = this;
    const { imageGallery } = this.state;

    return (
      <div>
        <Searchbar onSubmit={this.loadMore} />

        <ImageGallery>
          {imageGallery && <ImageGalleryItem imageGallery={imageGallery} />}
        </ImageGallery>
        <LoadMoreBtn onClick={this.handleLoadMore} />
      </div>
    );
  }
}
