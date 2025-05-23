import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiCallMethodGet {
  endpoint: string | null;
}

interface ApiCallMethodPost {
  endpoint?: string | null;
  data: object | null;
}

export default class ApiCaller {
  private backendUrl = import.meta.env.VITE_APP_BACKEND_URL + '/api';
  private endpoint = '';
  private requestOptions = {};

  setUrl(endpoint: string) {
    this.endpoint += endpoint;
    return this;
  }

  setHeaders(options: AxiosRequestConfig) {
    this.requestOptions = { ...this.requestOptions, ...options };
    return this;
  }

  async get(options?: ApiCallMethodGet): Promise<AxiosResponse<any>> {
    if (!this.endpoint) {
      if (options && options?.endpoint !== null) {
        this.setUrl(options?.endpoint);
      } else {
        throw new Error('URL is not set.');
      }
    }

    return await axios.get(this.backendUrl + this.endpoint, this.requestOptions).catch((error) => {
      if (error.response.status === 401) {
        localStorage.clear();
      }
      return Promise.reject(error);
    });
  }

  async post(options?: ApiCallMethodPost): Promise<AxiosResponse<any>> {
    if (!this.endpoint) {
      if (options && options.endpoint) {
        this.setUrl(options.endpoint);
      } else {
        throw new Error('URL is not set.');
      }
    }

    return await axios.post(this.backendUrl + this.endpoint, options?.data, this.requestOptions);
  }

  async put(options?: ApiCallMethodPost): Promise<AxiosResponse<any>> {
    if (!this.endpoint) {
      if (options && options.endpoint) {
        this.setUrl(options.endpoint);
      } else {
        throw new Error('URL is not set.');
      }
    }

    return await axios
      .put(this.backendUrl + this.endpoint, options?.data, this.requestOptions)
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          location.reload();
        }
        return Promise.reject(error);
      });
  }

  async delete(options?: ApiCallMethodPost): Promise<AxiosResponse<any>> {
    if (!this.endpoint) {
      if (options && options.endpoint) {
        this.setUrl(options.endpoint);
      } else {
        throw new Error('URL is not set.');
      }
    }

    return await axios
      .delete(this.backendUrl + this.endpoint, this.requestOptions)
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          location.reload();
        }
        return Promise.reject(error);
      });
  }
}
