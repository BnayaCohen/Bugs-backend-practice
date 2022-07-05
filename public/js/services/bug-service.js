import { storageService } from './async-storage-service.js'

const BUG_URL = '/api/bug/'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

function query(filterBy) {
  return axios.get(BUG_URL, { params: filterBy }).then((res) => res.data)
}

function getById(bugId) {
  return axios.get(BUG_URL + bugId).then(res => res.data)
}

function getEmptyBug() {
  return {
    title: '',
    description: '',
    severity: '',
    createdAt: Date.now(),
    creator: { nickname: '' }
  }
}

function remove(bugId) {
  return axios.delete(BUG_URL + bugId).then((res) => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(BUG_URL + bug._id, bug).then(res => res.data)
  } else {
    return axios.post(BUG_URL, bug).then((res) => res.data)
  }
}
