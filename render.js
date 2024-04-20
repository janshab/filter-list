import { postsContainer } from "./constants.js";
export function renderPosts(posts) {
  postsContainer.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.body}</p>
        `;
    postsContainer.appendChild(postElement);
  });
}
