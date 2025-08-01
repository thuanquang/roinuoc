// ===== GAME PROGRESS MANAGER =====
class GameProgressManager {
    constructor() {
        this.progress = this.loadProgress();
        this.currentChapter = null;
        this.init();
    }

    init() {
        this.renderChapters();
        this.updateProgressBar();
        this.updateStats();
        this.bindEvents();
        
        // Check if returning from game
        this.checkReturnFromGame();
    }

    // ===== PROGRESS MANAGEMENT =====
    loadProgress() {
        // Force reset progress on every load for debugging
        console.log('🔄 Loading progress...');
        
        const defaultProgress = {
            completedChapters: [],
            unlockedChapters: [1], // Chương 1 luôn mở
            highScore: 0,
            totalScore: 0,
            achievements: []
        };
        
        const saved = localStorage.getItem('waterPuppet_progress');
        
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                // Merge với default để đảm bảo có đủ properties
                console.log('📊 Loaded existing progress:', progress);
                return { ...defaultProgress, ...progress };
            } catch (e) {
                console.warn('❌ Invalid progress data, using defaults');
                return defaultProgress;
            }
        }
        
        console.log('📊 Using default progress');
        return defaultProgress;
    }

    saveProgress() {
        localStorage.setItem('waterPuppet_progress', JSON.stringify(this.progress));
    }

    completeChapter(chapterNum, score) {
        if (!this.progress.completedChapters.includes(chapterNum)) {
            this.progress.completedChapters.push(chapterNum);
        }
        
        // Unlock next chapter
        const nextChapter = chapterNum + 1;
        if (nextChapter <= 7 && !this.progress.unlockedChapters.includes(nextChapter)) {
            this.progress.unlockedChapters.push(nextChapter);
        }
        
        // Update scores
        if (score > this.progress.highScore) {
            this.progress.highScore = score;
        }
        this.progress.totalScore += score;
        
        this.saveProgress();
        this.updateProgressBar();
        this.updateStats();
        this.renderChapters();
    }

    isChapterUnlocked(chapterNum) {
        return this.progress.unlockedChapters.includes(chapterNum);
    }

    isChapterCompleted(chapterNum) {
        return this.progress.completedChapters.includes(chapterNum);
    }

    // ===== UI RENDERING =====
    renderChapters() {
        const grid = document.getElementById('chapters-grid');
        if (!grid) {
            console.error('chapters-grid not found!');
            return;
        }
        
        grid.innerHTML = '';
        
        console.log('=== RENDERING CHAPTERS ===');
        console.log('Total chapters to render:', Object.keys(chapters).length);
        
        let renderedCount = 0;
        
        // Render all available chapters (7 total)
        const totalChapters = Object.keys(chapters).length;
        console.log(`📊 Total chapters in data: ${totalChapters}`);
        
        // Sort chapter numbers to ensure proper order
        const sortedChapterNums = Object.keys(chapters)
            .map(num => parseInt(num))
            .sort((a, b) => a - b);
            
        console.log('📋 Chapter numbers found:', sortedChapterNums);
        
        sortedChapterNums.forEach(num => {
            const chapter = chapters[num];
            
            if (!chapter) {
                console.warn(`Chapter ${num} is undefined!`);
                return;
            }
            
            const isUnlocked = this.isChapterUnlocked(num);
            const isCompleted = this.isChapterCompleted(num);
            
            console.log(`🎭 Rendering Chapter ${num}: ${chapter.title} (Unlocked: ${isUnlocked}, Completed: ${isCompleted})`);
            
            const card = this.createChapterCard(num, chapter, isUnlocked, isCompleted);
            grid.appendChild(card);
            renderedCount++;
        });
        
        console.log(`📊 Actually rendered: ${renderedCount} chapters out of ${totalChapters} total`);
        
        console.log(`Successfully rendered ${renderedCount} chapters`);
        
        // Add debug attribute to grid
        grid.setAttribute('data-chapter-count', renderedCount);
        
        // Debug grid layout
        setTimeout(() => {
            const actualRendered = grid.children.length;
            const expectedCount = Object.keys(chapters).length;
            
            console.log(`Grid children count: ${actualRendered}`);
            console.log(`Expected count: ${expectedCount}`);
            
            if (actualRendered !== expectedCount) {
                console.error(`❌ CHAPTER DISPLAY MISMATCH!`);
                console.error(`Expected: ${expectedCount} chapters`);
                console.error(`Actually rendered: ${actualRendered} chapters`);
                
                // Check if any chapters are hidden by CSS
                const hiddenCards = Array.from(grid.children).filter(card => {
                    const styles = window.getComputedStyle(card);
                    return styles.display === 'none' || styles.visibility === 'hidden';
                });
                
                if (hiddenCards.length > 0) {
                    console.warn(`Found ${hiddenCards.length} hidden chapter cards`);
                }
                
                // Check grid layout
                const gridStyles = window.getComputedStyle(grid);
                console.log('Grid template columns:', gridStyles.gridTemplateColumns);
                console.log('Grid gap:', gridStyles.gap);
            } else {
                console.log(`✅ All ${expectedCount} chapters rendered correctly`);
            }
        }, 100);
    }

    createChapterCard(chapterNum, chapter, isUnlocked, isCompleted) {
        const card = document.createElement('div');
        card.className = `chapter-card ${isCompleted ? 'completed' : (isUnlocked ? 'available' : 'locked')}`;
        card.dataset.chapter = chapterNum;

        const chapterIcons = {
            1: '🎭', 2: '🏮', 3: '💕', 4: '🐲', 5: '🔥',
            6: '🎊', 7: '💎', 8: '👑', 9: '⚡', 10: '🏆'
        };

        const descriptions = {
            1: 'Học các động tác cơ bản của múa rối nước',
            2: 'Trình diễn trong không khí lễ hội sôi động',
            3: 'Kể câu chuyện tình yêu qua các động tác nhẹ nhàng',
            4: 'Chiến đấu với thủy quái trong hồ nước',
            5: 'Điều khiển rồng huyền thoại phun nước thiêng',
            6: 'Mừng Tết với những điệu múa truyền thống',
            7: 'Khám phá kho báu dưới đáy hồ sâu',
            8: 'Tái hiện truyền thuyết Lạc Long Quân - Âu Cơ',
            9: 'Thử thách tốc độ và phản xạ cực hạn',
            10: 'Trở thành cao thủ múa rối chân chính'
        };

        card.innerHTML = `
            <div class="chapter-header">
                <div class="chapter-number">${chapterNum}</div>
                <div class="chapter-title">
                    ${chapterIcons[chapterNum]} ${chapter.title}
                </div>
            </div>
            <div class="chapter-description">
                ${descriptions[chapterNum]}
            </div>
            <div class="chapter-meta">
                <div class="difficulty-stars">
                    ${'★'.repeat(chapter.difficulty)}${'☆'.repeat(7 - chapter.difficulty)}
                </div>
                <div class="chapter-progress">
                    ${isCompleted ? 'Hoàn thành' : (isUnlocked ? 'Sẵn sàng' : 'Chưa mở khóa')}
                </div>
            </div>
        `;

        if (isUnlocked) {
            card.addEventListener('click', (e) => {
                console.log(`🎯 Chapter ${chapterNum} card clicked`);
                e.preventDefault();
                e.stopPropagation();
                this.showChapterModal(chapterNum, chapter);
            });
            
            // Add keyboard support
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    console.log(`⌨️ Chapter ${chapterNum} activated via keyboard`);
                    e.preventDefault();
                    this.showChapterModal(chapterNum, chapter);
                }
            });
        } else {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
        }

        return card;
    }

    updateProgressBar() {
        const completed = this.progress.completedChapters.length;
        const total = Object.keys(chapters).length;
        const percentage = (completed / total) * 100;
        
        document.getElementById('total-progress').style.width = `${percentage}%`;
        document.getElementById('progress-text').textContent = `${completed}/${total}`;
    }

    updateStats() {
        document.getElementById('high-score').textContent = this.progress.highScore.toLocaleString();
        document.getElementById('completed-chapters').textContent = this.progress.completedChapters.length;
    }

    // ===== MODAL HANDLING =====
    showChapterModal(chapterNum, chapter) {
        console.log('🎭 Showing modal for chapter:', chapterNum);
        this.currentChapter = chapterNum;
        const modal = document.getElementById('chapter-modal');
        
        if (!modal) {
            console.error('❌ Modal element not found!');
            return;
        }
        
        // Populate modal content
        const modalTitle = document.getElementById('modal-title');
        const modalDifficulty = document.getElementById('modal-difficulty');
        const modalDescription = document.getElementById('modal-description');
        const modalSequences = document.getElementById('modal-sequences');
        const modalStats = document.getElementById('modal-stats');
        
        if (modalTitle) modalTitle.textContent = chapter.title;
        if (modalDifficulty) {
            modalDifficulty.innerHTML = '★'.repeat(chapter.difficulty) + '☆'.repeat(7 - chapter.difficulty);
        }
        
        // Description
        const descriptions = {
            1: 'Chào mừng đến với thế giới múa rối nước! Bước đầu tiên khám phá di sản văn hóa 1000+ năm tuổi.',
            2: 'Học từ Chú Tễu - nhân vật kinh điển và đáng yêu nhất trong múa rối nước Việt Nam.',
            3: 'Khám phá truyện cổ tích Tấm Cám qua nghệ thuật múa rối - bài học về lòng tốt và công lý.',
            4: 'Trải nghiệm lễ hội mùa gặt - niềm vui sau mùa màng bội thu của nông dân Việt Nam.',
            5: 'Gặp gỡ Rồng Thiêng - biểu tượng quyền uy và phước lành trong tâm linh người Việt.',
            6: 'Đón Tết Nguyên Đán với múa sư tử, phượng hoàng - xuân về đầy may mắn.',
            7: 'Câu chuyện ngư dân và biển cả - sự dũng cảm trước thiên nhiên bao la.',
            8: 'Sử thi Lạc Long Quân - Âu Cơ: nguồn gốc dân tộc con rồng cháu tiên.',
            9: 'Lễ hội đình làng - tinh thần cộng đồng và tôn vinh tổ tiên của người Việt.',
            10: 'Trở thành nghệ nhân múa rối - hoàn thành hành trình khám phá văn hóa dân tộc.'
        };
        
        if (modalDescription) {
            modalDescription.textContent = descriptions[chapterNum];
        }
        
        // Sequences
        if (modalSequences) {
            modalSequences.innerHTML = `
                <h4>Các động tác trong chương:</h4>
                <ul class="sequence-list">
                    ${chapter.sequences.map(seq => 
                        `<li class="sequence-item">${seq.description} (${seq.keys})</li>`
                    ).join('')}
                </ul>
            `;
        }
        
        // Stats
        if (modalStats) {
            modalStats.innerHTML = `
                <div class="stat-box">
                    <span class="stat-value">${chapter.sequences.length}</span>
                    <span class="stat-label">Động tác</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${chapter.difficulty}</span>
                    <span class="stat-label">Độ khó</span>
                </div>
            `;
        }
        
        // Show modal with delay to ensure DOM is updated
        setTimeout(() => {
            modal.classList.add('show');
            console.log('✅ Modal shown for chapter:', chapterNum);
            
            // Focus the play button for accessibility
            const playButton = document.getElementById('modal-play');
            if (playButton) {
                playButton.focus();
            }
        }, 10);
    }

    hideChapterModal() {
        console.log('🚪 Hiding modal...');
        const modal = document.getElementById('chapter-modal');
        if (modal) {
            modal.classList.remove('show');
            // Don't clear currentChapter here as it might be needed for navigation
        }
    }

    startChapter() {
        console.log('🚀 Start chapter clicked:', this.currentChapter);
        
        if (!this.currentChapter) {
            console.error('❌ No chapter selected');
            alert('Lỗi: Không có chương nào được chọn!');
            return;
        }
        
        // Validate chapter exists
        if (!chapters[this.currentChapter]) {
            console.error('❌ Invalid chapter:', this.currentChapter);
            alert('Lỗi: Chương không hợp lệ!');
            return;
        }
        
        console.log('💾 Saving chapter to localStorage:', this.currentChapter);
        
        // Clear any existing game data
        localStorage.removeItem('waterPuppet_gameCompleted');
        
        // Save current chapter to localStorage for game.html
        localStorage.setItem('waterPuppet_selectedChapter', this.currentChapter.toString());
        localStorage.setItem('waterPuppet_returnUrl', 'index.html');
        
        // Hide modal first
        this.hideChapterModal();
        
        // Show loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.style.position = 'fixed';
        loadingDiv.style.top = '0';
        loadingDiv.style.left = '0';
        loadingDiv.style.width = '100%';
        loadingDiv.style.height = '100%';
        loadingDiv.style.background = 'rgba(0, 0, 0, 0.8)';
        loadingDiv.style.display = 'flex';
        loadingDiv.style.alignItems = 'center';
        loadingDiv.style.justifyContent = 'center';
        loadingDiv.style.zIndex = '10000';
        loadingDiv.style.color = 'white';
        loadingDiv.style.fontSize = '1.5rem';
        loadingDiv.innerHTML = `
            <div style="text-align: center;">
                <div>🎭 Đang tải chương ${this.currentChapter}...</div>
                <div style="font-size: 1rem; margin-top: 1rem;">${chapters[this.currentChapter].title}</div>
            </div>
        `;
        document.body.appendChild(loadingDiv);
        
        // Navigate to game with small delay to ensure everything is saved
        setTimeout(() => {
            console.log('🎮 Navigating to game.html...');
            window.location.href = 'game.html';
        }, 500);
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        console.log('🔧 Setting up event listeners...');
        
        // Use event delegation for better reliability
        document.addEventListener('click', (e) => {
            // Handle modal close button
            if (e.target.id === 'modal-close') {
                console.log('❌ Modal close clicked via delegation');
                e.preventDefault();
                e.stopPropagation();
                this.hideChapterModal();
                return;
            }
            
            // Handle modal cancel button
            if (e.target.id === 'modal-cancel') {
                console.log('🚫 Modal cancel clicked via delegation');
                e.preventDefault();
                e.stopPropagation();
                this.hideChapterModal();
                return;
            }
            
            // Handle modal play button
            if (e.target.id === 'modal-play') {
                console.log('🎮 Modal play clicked via delegation for chapter:', this.currentChapter);
                e.preventDefault();
                e.stopPropagation();
                this.startChapter();
                return;
            }
            
            // Handle modal overlay click (close modal)
            if (e.target.id === 'chapter-modal' && e.target.classList.contains('modal-overlay')) {
                console.log('🖱️ Modal overlay clicked via delegation');
                this.hideChapterModal();
                return;
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('⌨️ ESC key pressed - closing modal');
                this.hideChapterModal();
            }
        });
        
        console.log('✅ Event delegation set up successfully');
    }

    // ===== RETURN FROM GAME HANDLING =====
    checkReturnFromGame() {
        const returnedFromGame = localStorage.getItem('waterPuppet_gameCompleted');
        if (returnedFromGame) {
            const gameResult = JSON.parse(returnedFromGame);
            
            // Process game completion
            if (gameResult.completed) {
                this.completeChapter(gameResult.chapter, gameResult.score);
                
                // Show completion message
                setTimeout(() => {
                    this.showCompletionMessage(gameResult);
                }, 500);
            }
            
            // Clear the flag
            localStorage.removeItem('waterPuppet_gameCompleted');
        }
    }

    showCompletionMessage(result) {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div class="completion-content">
                <h3>🎉 Chúc mừng!</h3>
                <p>Bạn đã hoàn thành <strong>${chapters[result.chapter].title}</strong></p>
                <p>Điểm số: <strong>${result.score.toLocaleString()}</strong></p>
                <p>Combo tối đa: <strong>${result.maxCombo}</strong></p>
                <button onclick="this.parentElement.parentElement.remove()">Đóng</button>
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        message.querySelector('.completion-content').style.cssText = `
            background: linear-gradient(135deg, #b82323, #8b1a1a);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #E9E9A4;
            text-align: center;
            max-width: 400px;
        `;
        
        message.querySelector('button').style.cssText = `
            background: #E9E9A4;
            color: #b82323;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 1rem;
        `;
        
        document.body.appendChild(message);
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing Game Progress Manager...');
    window.gameProgress = new GameProgressManager();
    
    // Ensure events are bound after everything is ready
    setTimeout(() => {
        window.gameProgress.bindEvents();
    }, 50);
});

// ===== RESET MODAL FUNCTIONS =====
function showResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function confirmResetProgress() {
    console.log('🔄 Resetting all game data...');
    
    // Clear all game data
    const keysToRemove = [
        'waterPuppet_progress',
        'waterPuppet_achievements', 
        'waterPuppet_highScores',
        'waterPuppet_unlockedStories',
        'waterPuppet_gameCompleted',
        'waterPuppet_selectedChapter',
        'waterPuppet_returnUrl'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('🗑️ Removed:', key);
    });
    
    console.log('✅ All game data cleared!');
    hideResetModal();
    
    // Show success message and reload
    setTimeout(() => {
        alert('✅ RESET THÀNH CÔNG!\n\nTất cả tiến trình đã được xóa. Trang sẽ reload...');
        window.location.reload(true);
    }, 300);
}

// Expose functions globally
window.showResetModal = showResetModal;
window.hideResetModal = hideResetModal;
window.confirmResetProgress = confirmResetProgress;