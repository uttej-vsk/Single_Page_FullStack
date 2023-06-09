import axios from "axios";
const baseUrl =
  "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((res) => res.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((res) => res.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  request.then((res) => res.data);
};

const del = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((res) => res.data);
};

export default {
  getAll: getAll,
  create: create,
  update: update,
  del: del,
};
