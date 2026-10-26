import api from './client';

/**
 * Thin wrapper around the REST endpoints.
 * Every resource (students, courses, faculty, notices) shares this shape:
 *   GET    /api/<endpoint>       -> list (search / filter / paginate)
 *   GET    /api/<endpoint>/:id   -> single record
 *   POST   /api/<endpoint>       -> create
 *   PUT    /api/<endpoint>/:id   -> update
 *   DELETE /api/<endpoint>/:id   -> delete
 */
export const resourceApi = {
  list: (endpoint, params = {}) => api.get(endpoint, { params }).then((res) => res.data),

  getOne: (endpoint, id) => api.get(`${endpoint}/${id}`).then((res) => res.data.data),

  create: (endpoint, payload) => api.post(endpoint, payload).then((res) => res.data),

  update: (endpoint, id, payload) => api.put(`${endpoint}/${id}`, payload).then((res) => res.data),

  remove: (endpoint, id) => api.delete(`${endpoint}/${id}`).then((res) => res.data),
};

export const dashboardApi = {
  get: () => api.get('/dashboard').then((res) => res.data),
};
