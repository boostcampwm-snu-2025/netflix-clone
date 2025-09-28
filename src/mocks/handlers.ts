import { http, HttpResponse } from 'msw';

import moviesData from '../data/movies.json';

export const handlers = [
  http.get('/api/trending', () => {
    return HttpResponse.json(moviesData);
  }),
];
