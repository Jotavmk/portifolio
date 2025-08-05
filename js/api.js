// API Configuration
const API_BASE_URL = '/sitejv/api';

// Login management
let currentUser = null;

// Check if user is logged in from localStorage
function checkLoginStatus() {
    const userData = localStorage.getItem('sitejv_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        console.log('User logged in from localStorage:', currentUser);
        return true;
    }
    return false;
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('sitejv_user', JSON.stringify(userData));
    currentUser = userData;
}

// Clear user data from localStorage
function clearUserData() {
    localStorage.removeItem('sitejv_user');
    currentUser = null;
}

// Login function
async function loginUser(username, password) {
    try {
        const response = await fetch(API_BASE_URL + '/login_simple.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (data.success) {
            saveUserData(data.user);
            showNotification('Login realizado com sucesso!', 'success');
            return data;
        } else {
            showNotification('Erro no login: ' + data.error, 'error');
            return data;
        }
    } catch (error) {
        console.error('Login Error:', error);
        showNotification('Erro ao fazer login', 'error');
        throw error;
    }
}

// Logout function
function logoutUser() {
    clearUserData();
    showNotification('Logout realizado com sucesso!', 'success');
    // Reload comments to update the display
    loadComments();
    // Update navbar
    updateNavbarLoginStatus();
}

// Get comments function
async function getComments() {
    try {
        const response = await fetch(API_BASE_URL + '/comments.php');
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
        const response = await fetch(API_BASE_URL + '/comments.php', {
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

// Check if user is admin
async function checkIfAdmin(userId) {
    try {
        const response = await fetch(API_BASE_URL + '/check_admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        return data.success && data.is_admin;
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
}

// Delete comment function
async function deleteComment(commentId) {
    try {
        const requestBody = { id: commentId };
        
        // Adicionar user_id se o usuário estiver logado
        if (currentUser) {
            requestBody.user_id = currentUser.id;
        }
        
        const response = await fetch(API_BASE_URL + '/delete_comment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Function to render comments
async function renderComments(comments) {
    const commentsCarousel = document.querySelector('.comments-carousel');
    if (!commentsCarousel) {
        console.error('Comments carousel not found');
        return;
    }
    
    // Clear the carousel first
    commentsCarousel.innerHTML = '';
    
    if (!comments || comments.length === 0) {
        // Show a message when there are no comments
        commentsCarousel.innerHTML = '<div class="no-comments"><p>Nenhum depoimento ainda. Seja o primeiro a deixar um depoimento!</p></div>';
        return;
    }
    
    console.log('Rendering comments:', comments);
    console.log('Current user:', currentUser);
    
    // Verificar se o usuário atual é administrador (uma vez só)
    let isCurrentUserAdmin = false;
    if (currentUser) {
        console.log('Current user found:', currentUser);
        try {
            isCurrentUserAdmin = await checkIfAdmin(currentUser.id);
            console.log(`Current user admin status: ${isCurrentUserAdmin}`);
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    } else {
        console.log('No current user found');
    }
    
    // Função para renderizar um comentário individual
    function renderComment(comment) {
        // Verificar se o comentário tem user_id (é de um usuário logado)
        const isOwnComment = comment.user_id && comment.user_id !== null;
        console.log(`Comment ${comment.id}: user_id = ${comment.user_id}, isOwnComment = ${isOwnComment}`);
        
        // Verificar se o usuário atual é o autor do comentário ou administrador
        const canDelete = (isOwnComment && currentUser && comment.user_id == currentUser.id) || isCurrentUserAdmin;
        
        console.log(`Can delete comment ${comment.id}: ${canDelete}`);
        
        // DEBUG: Forçar exibição do botão para teste
        const forceShowDelete = true; // Temporário para debug
        const deleteButton = (canDelete || forceShowDelete) ? 
            `<button class="delete-comment-btn" onclick="deleteCommentHandler(${comment.id})" title="Apagar depoimento">
                <i class="fas fa-trash"></i>
            </button>` : '';
        
        return `
            <div class="comment-card slide-in-element" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-user">
                        <div class="user-avatar-placeholder">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-info">
                            <h4>${escapeHtml(comment.name)}</h4>
                            <p class="user-bio">${isOwnComment ? 'Usuário Registrado' : 'Visitante'}</p>
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
                    ${deleteButton}
                </div>
            </div>
        `;
    }
    
    // Renderizar todos os comentários
    const commentsHTML = comments.map(comment => renderComment(comment)).join('');
    
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

// Function to handle comment deletion
async function deleteCommentHandler(commentId) {
    if (confirm('Tem certeza que deseja apagar este depoimento?')) {
        try {
            const response = await deleteComment(commentId);
            if (response.success) {
                showNotification('Depoimento apagado com sucesso!', 'success');
                // Reload comments to update the list
                const commentsResponse = await getComments();
                if (commentsResponse.success) {
                    await renderComments(commentsResponse.comments);
                }
            } else {
                showNotification('Erro ao apagar depoimento: ' + response.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            showNotification('Erro ao apagar depoimento', 'error');
        }
    }
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Function to load comments
async function loadComments() {
    try {
        const response = await getComments();
        console.log('Comments loaded:', response);
        if (response.success) {
            await renderComments(response.comments);
        } else {
            console.error('Failed to load comments:', response.error);
            showNotification('Erro ao carregar depoimentos', 'error');
        }
    } catch (error) {
        console.error('Error loading comments:', error);
        showNotification('Erro ao carregar depoimentos', 'error');
    }
}

// Function to update navbar login status
function updateNavbarLoginStatus() {
    const loginLink = document.querySelector('.nav-link[href="#login"]');
    if (loginLink) {
        if (currentUser) {
            loginLink.textContent = `Logout (${currentUser.username})`;
            loginLink.onclick = function(e) {
                e.preventDefault();
                logoutUser();
                this.textContent = 'Login';
                this.onclick = null;
            };
        } else {
            loginLink.textContent = 'Login';
            loginLink.onclick = null;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Check login status first
    checkLoginStatus();
    
    // Load comments
    await loadComments();
    
    // Update navbar login status
    updateNavbarLoginStatus();
});

// Function to perform login from login section
async function performLoginFromSection() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showNotification('Preencha usuário e senha', 'error');
        return;
    }
    
    try {
        const result = await loginUser(username, password);
        if (result.success) {
            // Update navbar
            updateNavbarLoginStatus();
            // Reload comments to show delete buttons
            await loadComments();
            // Clear form
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
} 