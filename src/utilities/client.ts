import { RootState } from "../store";
import {
  NotFoundError,
  TechnicalError,
  UnauthorizedError,
  ValidationError,
} from "./errors";

const getAuthDataFromLocalStorage = () => {
  try {
    const authData = localStorage.getItem(
      "3bcbaf8f-5d37-419a-adff-14e949447bc1"
    );
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error("Error while retrieving auth data from localStorage:", error);
    return null;
  }
};

interface FetchConfig {
  path: string;
  body?: any;
  method: string;
}

export enum HttpMethod {
  get = "GET",
  post = "POST",
  put = "PUT",
  delete = "DELETE",
  patch = "PATCH",
}

class HttpClient {
  private store: RootState;

  constructor(store: RootState) {
    this.store = store;
  }

  private async fetchClient(
    config: FetchConfig,
  ) {
    const headers: any = {
      "Content-Type": "application/json",
      Accept:
        "text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8",
    };

    const authData: any = getAuthDataFromLocalStorage();
    if (
      authData
    ) {
      headers.Authorization = this.authHeader();
    }

    return fetch(`https://caregiving.sightnetic.com${config.path}`, {
      method: config.method,
      body: JSON.stringify(config.body),
      headers: headers,
    }).then(this.handleResponse);
  }

  getRequest(path: string) {
    const req: FetchConfig = {
      path: path,
      method: HttpMethod.get,
    };
    return this.fetchClient(req);
  }

  postRequest(path: string, payload?: any) {
    const req: FetchConfig = {
      path: path,
      body: payload,
      method: HttpMethod.post,
    };
    return this.fetchClient(req);
  }

  patchRequest(path: string, payload?: any) {
    const req: FetchConfig = {
      path: path,
      body: payload,
      method: HttpMethod.patch,
    };
    return this.fetchClient(req);
  }

  putRequest(path: string, payload: any) {
    const req: FetchConfig = {
      path: path,
      body: payload,
      method: HttpMethod.put,
    };
    return this.fetchClient(req);
  }

  deleteRequest(path: string) {
    const req: FetchConfig = {
      path: path,
      method: HttpMethod.delete,
    };
    return this.fetchClient(req);
  }

  async handleResponse(response: Response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);

      if (!response.ok) {
        if (response.status === 401) {
          this.store.dispatch({ action: "authentication.signOut" })
          return Promise.reject(new UnauthorizedError());
        }

        if (response.status === 500) {
          return Promise.reject(new TechnicalError());
        }

        if (response.status === 404) {
          return Promise.reject(new NotFoundError());
        }

        if (response.status === 400) {
          return Promise.reject(new ValidationError(new Error(data.message)));
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }

      return data;
    });
  }

  authHeader() {
    let token = localStorage.getItem("accessToken");
    if (token) {
      return "Bearer " + token;
    } else {
      return "";
    }
  }
}

export default HttpClient;
