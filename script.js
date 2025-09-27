
document.addEventListener('DOMContentLoaded', () => {
    const blogForm = document.getElementById('blogForm');
    const postsContainer = document.getElementById('posts-container');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author'); 
    const contentInput = document.getElementById('content');
    const editIndexInput = document.getElementById('editIndex');
    const saveButton = blogForm.querySelector('button[type="submit"]');
    const cancelButton = document.getElementById('cancelEdit');
    const noPostsMessage = document.querySelector('.no-posts-message p');

    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

    // --- Functions ---

    function displayPosts() {
        postsContainer.innerHTML = ''; 
        if (posts.length === 0) {
            noPostsMessage.style.display = 'block';
            return;
        } else {
            noPostsMessage.style.display = 'none';
        }

        posts.forEach((post, index) => {
            const postCard = document.createElement('article');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <h3 class="post-card-title">${post.title}</h3>
                <div class="post-meta">By ${post.author} on ${post.date}</div>
                <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
                <div class="post-actions">
                    <button class="btn btn-edit" data-index="${index}">Edit</button>
                    <button class="btn btn-delete" data-index="${index}">Delete</button>
                </div>
            `;
            postsContainer.appendChild(postCard);
        });
    }

    function savePost(event) {
        event.preventDefault(); 

        const title = titleInput.value.trim();
        const author = authorInput.value.trim(); 
        const content = contentInput.value.trim();
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        if (!title || !author || !content) {
            alert('Please fill in all fields.');
            return;
        }

        if (editIndexInput.value !== '') {
            // Editing existing post
            const index = parseInt(editIndexInput.value);
            posts[index] = { ...posts[index], title, author, content }; 
            alert('Post updated successfully!');
        } else {
            // Adding new post
            const newPost = { title, author, content, date };
            posts.unshift(newPost); 
            alert('New post added!');
        }

        localStorage.setItem('blogPosts', JSON.stringify(posts));
        blogForm.reset(); 
        editIndexInput.value = ''; 
        saveButton.textContent = 'Save Post'; 
        cancelButton.style.display = 'none'; 
        displayPosts(); 
    }

    function editPost(index) {
        const post = posts[index];
        titleInput.value = post.title;
        authorInput.value = post.author;
        contentInput.value = post.content;
        editIndexInput.value = index;
        saveButton.textContent = 'Update Post';
        cancelButton.style.display = 'inline-block'; 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }

    function deletePost(index) {
        if (confirm('Are you sure you want to delete this post?')) {
            posts.splice(index, 1);
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            displayPosts();
            alert('Post deleted.');
        }
    }

    function cancelEdit() {
        blogForm.reset();
        editIndexInput.value = '';
        saveButton.textContent = 'Save Post';
        cancelButton.style.display = 'none';
    }

    // --- Event Listeners ---
    blogForm.addEventListener('submit', savePost);
    cancelButton.addEventListener('click', cancelEdit);

    postsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-edit')) {
            const index = parseInt(event.target.dataset.index);
            editPost(index);
        } else if (event.target.classList.contains('btn-delete')) {
            const index = parseInt(event.target.dataset.index);
            deletePost(index);
        }
    });

    // Initial display of posts
    displayPosts();
});