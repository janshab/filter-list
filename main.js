"use strict";
import {
  debounce,
  getFilteredPosts,
  getTotalPosts,
  showNoMorePostsMessage,
} from "./utils.js";
import { renderPosts } from "./render.js";
import { API, perPage, filteredElement } from "./constants.js";
let currentPage = 1;
let loading = false;
let filterTitle = "";
let allPosts = [];
let isUpdatePostsCalled = false;
let totalPosts = null;
async function loadPosts(filter = "") {
  if (filter && currentPage === 1) {
    const filteredResults = await getFilteredPosts(filter);
    totalPosts = filteredResults.total;
  } else if (!filter && !totalPosts) {
    totalPosts = await getTotalPosts();
  }
  if (totalPosts === 0) {
    renderPosts(allPosts);
    showNoMorePostsMessage();
    return;
  }
  if (allPosts.length < totalPosts && !loading) {
    loading = true;
    try {
      let posts;
      if (filter) {
        const response = await fetch(
          `${API}/posts?title_like=${encodeURIComponent(
            filter
          )}&_page=${currentPage}&_limit=${perPage}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        posts = await response.json();
      } else {
        const response = await fetch(
          `${API}/posts?_page=${currentPage}&_limit=${perPage}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        posts = await response.json();
      }
      allPosts = [...allPosts, ...posts];
      renderPosts(allPosts);

      if (allPosts.length >= totalPosts) {
        showNoMorePostsMessage();
      }
    } catch (e) {
      throw e;
    } finally {
      loading = false;
      if (!isUpdatePostsCalled) {
        updatePosts();
        isUpdatePostsCalled = true;
      }
    }
  }
}
function updatePosts() {
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
      !loading
    ) {
      currentPage++;
      loadPosts(filterTitle);
    }
  });
}
loadPosts();
const handleFilterInput = debounce((e) => {
  filterTitle = e.target.value;
  currentPage = 1;
  allPosts = [];
  totalPosts = null;
  loadPosts(filterTitle);
}, 500);
filteredElement.addEventListener("input", handleFilterInput);
