const Storage = {
  push(key, data) {
    localStorage.setItem(key, data);
  },

  pull(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  delete(key) {
    localStorage.removeItem(key);
  },
};

export default Storage;
