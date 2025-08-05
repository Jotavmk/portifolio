// Sistema de gerenciamento de projetos do GitHub
class GitHubProjectsManager {
    constructor() {
        this.apiUrl = '/sitejv/api/github_projects.php';
        this.projectsContainer = document.querySelector('.projects-grid');
        this.lastUpdate = null;
        this.updateInterval = 5 * 60 * 1000; // 5 minutos
        this.isUpdating = false;
        
        this.init();
    }
    
    init() {
        // Carregar projetos na inicialização
        this.loadProjects();
        
        // Configurar atualização periódica
        setInterval(() => {
            this.checkForUpdates();
        }, this.updateInterval);
        
        // Adicionar listener para atualização manual
        this.addUpdateButton();
    }
    
    async loadProjects() {
        try {
            this.isUpdating = true;
            this.showLoadingState();
            
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            
            if (data.success) {
                this.renderProjects(data.projects);
                this.lastUpdate = data.last_updated;
                this.hideLoadingState();
                console.log('Projetos carregados com sucesso:', data.count, 'projetos');
            } else {
                throw new Error(data.error || 'Erro ao carregar projetos');
            }
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            this.hideLoadingState();
            this.showErrorState();
        } finally {
            this.isUpdating = false;
        }
    }
    
    async checkForUpdates() {
        if (this.isUpdating) return;
        
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            
            if (data.success && data.last_updated !== this.lastUpdate) {
                console.log('Novos projetos detectados, atualizando...');
                this.renderProjects(data.projects);
                this.lastUpdate = data.last_updated;
                this.showUpdateNotification();
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error);
        }
    }
    
    renderProjects(projects) {
        if (!this.projectsContainer) return;
        
        const projectsHTML = projects.map(project => this.createProjectCard(project)).join('');
        this.projectsContainer.innerHTML = projectsHTML;
        
        // Adicionar animações aos novos cards
        setTimeout(() => {
            const newCards = this.projectsContainer.querySelectorAll('.project-card');
            newCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 100);
            });
        }, 100);
    }
    
    createProjectCard(project) {
        const techTags = project.tech.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        // Debug: log para verificar o demo_url
        console.log('Project:', project.name, 'Demo URL:', project.demo_url);
        
        const demoLink = project.demo_url ? 
            `<a href="${project.demo_url}" class="project-link" target="_blank">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` :
            `<a href="javascript:void(0)" class="project-link demo-unavailable" style="opacity: 0.7; cursor: not-allowed;" onclick="showDemoUnavailableMessage()">
                <i class="fas fa-external-link-alt"></i> Demo Indisponível
            </a>`;
        
        return `
            <div class="project-card">
                <div class="project-image">
                    <div class="project-placeholder">
                        <i class="${project.icon}"></i>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
                    <p class="project-description">${this.escapeHtml(project.description)}</p>
                    <div class="project-tech">
                        ${techTags}
                    </div>
                    <div class="project-links">
                        <a href="${project.github_url}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                        ${demoLink}
                    </div>
                </div>
            </div>
        `;
    }
    
    showLoadingState() {
        if (!this.projectsContainer) return;
        
        this.projectsContainer.innerHTML = `
            <div class="loading-projects">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>Carregando projetos do GitHub...</p>
            </div>
        `;
    }
    
    hideLoadingState() {
        // Remove o estado de loading quando os projetos são carregados
    }
    
    showErrorState() {
        if (!this.projectsContainer) return;
        
        this.projectsContainer.innerHTML = `
            <div class="error-projects">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>Erro ao carregar projetos do GitHub</p>
                <button onclick="projectsManager.loadProjects()" class="retry-btn">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
    }
    
    showUpdateNotification() {
        // Criar notificação de atualização
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <i class="fas fa-sync-alt"></i>
            <span>Projetos atualizados automaticamente!</span>
            <button onclick="this.parentElement.remove()" class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Remover notificação após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    addUpdateButton() {
        const projectsSection = document.querySelector('#projects');
        if (!projectsSection) return;
        
        const header = projectsSection.querySelector('.section-header');
        if (!header) return;
        
        const updateBtn = document.createElement('button');
        updateBtn.className = 'update-projects-btn';
        updateBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        updateBtn.title = 'Atualizar projetos';
        updateBtn.onclick = () => this.loadProjects();
        
        header.appendChild(updateBtn);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

            // Função para mostrar mensagem quando demo não está disponível
            function showDemoUnavailableMessage() {
                // Criar notificação
                const notification = document.createElement('div');
                notification.className = 'update-notification';
                notification.style.background = '#e74c3c';
                notification.innerHTML = `
                    <i class="fas fa-info-circle"></i>
                    <span>Demo não disponível para este projeto</span>
                    <button onclick="this.parentElement.remove()" class="close-notification">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                document.body.appendChild(notification);
                
                // Remover notificação após 3 segundos
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 3000);
            }
            
            // Inicializar o gerenciador de projetos quando a página carregar
            let projectsManager;
            
            document.addEventListener('DOMContentLoaded', function() {
                projectsManager = new GitHubProjectsManager();
            }); 