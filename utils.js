import { API, postsContainer } from "./constants.js";
export async function getFilteredPosts(title) {
  try {
    const response = await fetch(
      `${API}/posts?title_like=${encodeURIComponent(title)}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const posts = await response.json();
    const total = posts.length;
    return { posts, total };
  } catch (e) {
    throw e;
  }
}
export async function getTotalPosts() {
  try {
    const response = await fetch(`${API}/posts`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.length;
  } catch (e) {
    throw new Error("Unable to get total posts.");
  }
}
export function debounce(fn, ms) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}
export function showNoMorePostsMessage() {
  const postsEndContainer = document.createElement("div");
  postsEndContainer.classList.add("posts-end");
  postsEndContainer.innerHTML = "No more posts found!";
  postsContainer.appendChild(postsEndContainer);
}
