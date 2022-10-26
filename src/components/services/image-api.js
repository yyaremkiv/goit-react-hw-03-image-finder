import axios from 'axios';

export default class NewsApiService {
  baseURL = 'https://pixabay.com/api/';
  params = {
    key: '30566581-29a7d3c7801683e2d838247de',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 4,
  };
  async getResponse(query, page) {
    if (query) {
      this.params.q = query;
      this.params.page = page;
    }

    const config = {
      params: this.params,
    };
    return await axios.get(this.baseURL, config);
  }
}

