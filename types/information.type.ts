export interface InformationSimpleResponse {
  id: number;
  title: string;
  body: string;
  bannerUri: string;
  createdAt: string;
  author: Author;
  hasRead: boolean;
}

export interface Author {
  id: number;
  name: string;
  email: string;
}