const axios = require("axios");
//https://docs.thecatapi.com/
//d72f64bb-d2bc-4fbe-a78a-1c797dfbcfa0

const catApi = {
  getBreeds() {
    return axios.request({
      method: "GET",
      url: "https://api.thecatapi.com/v1/breeds",
    });
  },
};

export default catApi;
