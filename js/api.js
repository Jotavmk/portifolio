// API Configuration
const API_BASE_URL = '/sitejv/api';

// Get comments function
async function getComments() {
    try {
        const response = await fetch(API_BASE_URL + '/test_comments.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Create comment function
async function createComment(commentData) {
    try {
        const response = await fetch(API_BASE_URL + '/test_comments.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Function to render comments
function renderComments(comments) {
    const commentsCarousel = document.querySelector('.comments-carousel');
    if (!commentsCarousel) return;
    
    // Clear the carousel first
    commentsCarousel.innerHTML = '';
    
    if (!comments || comments.length === 0) {
        // Show a message when there are no comments
        commentsCarousel.innerHTML = '<div class="no-comments"><p>Nenhum depoimento ainda. Seja o primeiro a deixar um depoimento!</p></div>';
        return;
    }
    
    const commentsHTML = comments.map(comment => `
        <div class="comment-card slide-in-element">
            <div class="comment-header">
                <div class="comment-user">
                    <div class="user-avatar-placeholder">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <h4>${escapeHtml(comment.name)}</h4>
                        <p class="user-bio">Visitante</p>
                    </div>
                </div>
                <div class="comment-rating">
                    ${renderStars(comment.rating)}
                </div>
            </div>
            <div class="comment-content">
                <p class="comment-text">${escapeHtml(comment.message)}</p>
            </div>
            <div class="comment-footer">
                <span class="comment-date">${formatDate(comment.created_at)}</span>
            </div>
        </div>
    `).join('');
    
    // Set all comments in the carousel
    commentsCarousel.innerHTML = commentsHTML;
    
    // Trigger animation for all comments
    setTimeout(() => {
        const newComments = commentsCarousel.querySelectorAll('.slide-in-element');
        newComments.forEach(comment => {
            comment.classList.add('animate');
        });
    }, 100);
}

// Function to render stars
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'star-filled' : 'star-empty'}"></i>`;
    }
    return stars;
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await getComments();
        console.log('Comments loaded:', response);
        if (response.success) {
            renderComments(response.comments);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}); 