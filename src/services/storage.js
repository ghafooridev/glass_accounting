const Storage = {
  setItem(key, data) {
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    localStorage.setItem(key, data);
  },

  getItem(key) {
    let obj = null;
    const value = localStorage.getItem(key);
    if (typeof value === "object") {
      obj = JSON.parse(value);
    } else {
      obj = value;
    }

    return obj;
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },
};

export default Storage;
