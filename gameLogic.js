class GameManager {
    constructor() {
        this.currentChapter = 1;
        this.currentSequenceIndex = 0;
        this.keyHandler = new KeyHandler();
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.streak = 0;
        this.perfectStreak = 0;
        this.totalMistakes = 0;
        this.startTime = Date.now();
        // Using normal mode only
        // Simple scoring system - no multipliers
        this.achievements = [];
        
        this.initializeGameEvents();
        this.initializeScoreSystem();
    }

    initializeGameEvents() {
        document.addEventListener('sequenceSuccess', (e) => this.handleSuccess(e.detail));
        document.addEventListener('sequenceFailed', () => this.handleFailure());
        document.addEventListener('keySuccess', () => this.handleKeySuccess());
        document.addEventListener('keyFailed', () => this.handleKeyFailure());
    }

    initializeScoreSystem() {
        // Initialize score display
        this.createScoreUI();
        
        // Load achievements
        this.loadAchievements();
        
        // Simple normal mode
    }

    createScoreUI() {
        // Create simple score panel
        const gameWrapper = document.querySelector('.game-wrapper');
        const scorePanel = document.createElement('div');
        scorePanel.className = 'score-panel';
        scorePanel.innerHTML = `
            <div class="score-display">
                <div class="score-item">
                    <span class="score-label">Điểm:</span>
                    <span class="score-value" id="current-score">0</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Combo:</span>
                    <span class="score-value" id="current-combo">0</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Streak:</span>
                    <span class="score-value" id="current-streak">0</span>
                </div>
            </div>
        `;
        gameWrapper.appendChild(scorePanel);
    }

    startChapter(chapterNum) {
        this.currentChapter = chapterNum;
        this.currentSequenceIndex = 0;
        const chapter = chapters[chapterNum];
        
        this.updateNPCDialogue(chapter.npcDialogue[0]);
        this.startNewSequence();
    }

    startNewSequence() {
        const chapter = chapters[this.currentChapter];
        const sequence = chapter.sequences[this.currentSequenceIndex];
        
        if (!sequence) {
            this.completeChapter();
            return;
        }

        this.updateNPCDialogue(sequence.description);
        this.keyHandler.setNewSequence(sequence.keys, sequence.time);
        displaySequence(sequence.keys); // Hiển thị keys của sequence mới
    }

    handleSuccess(timeBonus = 0) {
        // Calculate base score
        const baseScore = 100 * chapters[this.currentChapter].difficulty;
        
        // Apply combo multiplier
        this.combo++;
        this.streak++;
        this.perfectStreak++;
        
        // Calculate combo bonus
        let comboBonus = Math.floor(this.combo / 5) * 50;
        
        // Calculate time bonus (for completing sequences quickly)
        let speedBonus = Math.max(0, timeBonus);
        
        // Calculate final score (no multiplier, just normal mode)
        let finalScore = baseScore + comboBonus + speedBonus;
        
        // Perfect streak bonus
        if (this.perfectStreak >= 10) {
            finalScore *= 1.5;
        }
        
        this.score += Math.round(finalScore);
        this.updateMaxCombo();
        
        // Check achievements
        this.checkAchievements();
        
        // Update UI
        this.updateScoreDisplay();
        
        // Show enhanced feedback
        const feedbackText = this.getFeedbackText();
        this.showFeedback(feedbackText, "success");
        
        setTimeout(() => {
            this.currentSequenceIndex++;
            this.startNewSequence();
        }, 1000);
    }

    handleFailure() {
        this.combo = 0;
        this.perfectStreak = 0;
        this.totalMistakes++;
        
        // Score penalty based on game mode
        if (this.gameMode === 'perfect') {
            this.score = Math.max(0, this.score - 50);
        }
        
        this.updateScoreDisplay();
        
        // Random failure messages for variety
        const failureMessages = [
            "Thử lại nào! 🎯",
            "Gần rồi! 💪", 
            "Tập trung hơn! 🎮",
            "Cố lên! 🌟",
            "Chưa đúng nhịp! 🎵"
        ];
        const randomMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        this.showFeedback(randomMessage, "failure");
        
        // In perfect mode, restart the sequence
        if (this.gameMode === 'perfect') {
            this.currentSequenceIndex = Math.max(0, this.currentSequenceIndex - 1);
        }
        
        // Small delay before restarting
        setTimeout(() => {
        this.startNewSequence();
        }, 800);
    }

    handleKeySuccess() {
        // Mini combo for individual key presses
        if (this.gameMode === 'speed') {
            this.score += 5;
            this.updateScoreDisplay();
        }
    }

    handleKeyFailure() {
        // Small penalty for wrong keys
        if (this.gameMode === 'speed') {
            this.score = Math.max(0, this.score - 10);
            this.updateScoreDisplay();
        }
        }

    completeChapter() {
        // Chapter completion bonus
        const chapterBonus = 500 * chapters[this.currentChapter].difficulty;
        this.score += chapterBonus;
        
        // Unlock story for this chapter
        let isNewStory = false;
        if (window.storyManager) {
            isNewStory = window.storyManager.unlockStory(this.currentChapter);
        } else {
            console.warn('StoryManager not available');
        }
        
        // Perfect chapter bonus
        if (this.totalMistakes === 0) {
            this.score += 1000;
            this.showFeedback(`🎉 HOÀN HẢO! +${(chapterBonus + 1000).toLocaleString()} điểm! 🎉`, "perfect");
        } else {
            const chapterTitle = chapters[this.currentChapter].title;
            this.showFeedback(`✨ ${chapterTitle} hoàn thành! +${chapterBonus.toLocaleString()} điểm! ✨`, "success");
        }
        
        this.updateScoreDisplay();
        
        // Show story unlock notification if new story unlocked
        if (isNewStory) {
            setTimeout(() => {
                this.showStoryUnlockNotification();
            }, 2000);
        }
        
        // Check if this is a single chapter play (from index.html)
        const selectedChapter = localStorage.getItem('waterPuppet_selectedChapter');
        if (selectedChapter && parseInt(selectedChapter) === this.currentChapter) {
            // Single chapter mode - save progress and return to index
            const gameResult = {
                completed: true,
                chapter: this.currentChapter,
                score: this.score,
                maxCombo: this.maxCombo,
                playTime: (Date.now() - this.startTime) / 1000,
                accuracy: Math.round((this.streak / (this.streak + this.totalMistakes)) * 100),
                storyUnlocked: isNewStory
            };
            
            localStorage.setItem('waterPuppet_gameCompleted', JSON.stringify(gameResult));
            
            // Show completion options
            setTimeout(() => {
                this.showChapterCompletionOptions();
            }, isNewStory ? 5000 : 3000); // Wait longer if story unlocked
        } else {
            // Continue to next chapter in full game mode
            this.totalMistakes = 0; // Reset for next chapter
            
            if (this.currentChapter < Object.keys(chapters).length) {
                setTimeout(() => {
                    this.startChapter(this.currentChapter + 1);
                }, isNewStory ? 5000 : 3000);
            } else {
                setTimeout(() => {
                    this.gameComplete();
                }, isNewStory ? 5000 : 3000);
            }
        }
    }

    showStoryUnlockNotification() {
        const notification = document.createElement('div');
        notification.className = 'story-unlock-notification';
        notification.innerHTML = `
            <div class="story-unlock-content">
                <div class="story-unlock-icon">📖</div>
                <h3>Cốt truyện mới đã mở khóa!</h3>
                <p class="story-unlock-title">"${chapters[this.currentChapter].title}"</p>
                <p class="story-unlock-desc">Khám phá câu chuyện về văn hóa múa rối nước!</p>
                <div class="story-unlock-button">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">
                        ✨ Tuyệt vời!
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.5s ease-out;
        `;
        
        const content = notification.querySelector('.story-unlock-content');
        content.style.cssText = `
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #1A1A1A;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 
                0 20px 50px rgba(255, 215, 0, 0.4),
                0 10px 30px rgba(0, 0, 0, 0.3);
            animation: bounceIn 0.8s ease-out;
        `;
        
        const icon = notification.querySelector('.story-unlock-icon');
        icon.style.cssText = `
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: rotate 2s ease-in-out infinite;
        `;
        
        const title = notification.querySelector('h3');
        title.style.cssText = `
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        `;
        
        const storyTitle = notification.querySelector('.story-unlock-title');
        storyTitle.style.cssText = `
            font-weight: bold;
            font-size: 1.1rem;
            margin: 0.5rem 0;
            color: #8B4513;
        `;
        
        const button = notification.querySelector('button');
        button.style.cssText = `
            background: #8B4513;
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 1rem;
            font-size: 1rem;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#654321';
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#8B4513';
            button.style.transform = 'translateY(0)';
        });
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes rotate {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(10deg); }
                75% { transform: rotate(-10deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 4000);
    }

    showChapterCompletionOptions() {
        const storyUnlocked = window.storyManager.isStoryUnlocked(this.currentChapter);
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="completion-content">
                <h2>🎉 Chương hoàn thành!</h2>
                <div class="completion-stats">
                    <div class="stat-row">
                        <span>Điểm số:</span>
                        <span class="stat-value">${this.score.toLocaleString()}</span>
                    </div>
                    <div class="stat-row">
                        <span>Combo tối đa:</span>
                        <span class="stat-value">${this.maxCombo}</span>
                    </div>
                    <div class="stat-row">
                        <span>Độ chính xác:</span>
                        <span class="stat-value">${Math.round((this.streak / (this.streak + this.totalMistakes)) * 100)}%</span>
                    </div>
                </div>
                ${storyUnlocked ? `
                <div class="cultural-info">
                    <div class="cultural-header">
                        <span class="cultural-icon">🏛️</span>
                        <h4>Kiến thức văn hóa</h4>
                    </div>
                    <div class="cultural-content">
                        <p><strong>Điều thú vị:</strong> ${chapters[this.currentChapter].educationalContent.funFact}</p>
                        <p><strong>Truyền thống:</strong> ${chapters[this.currentChapter].educationalContent.tradition}</p>
                    </div>
                </div>
                ` : ''}
                <div class="completion-actions">
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove(); restartChapter()">
                        🔄 Chơi lại
                    </button>
                    ${storyUnlocked ? `
                    <button class="btn-story" onclick="showChapterStory(${this.currentChapter})">
                        📖 Xem cốt truyện
                    </button>
                    ` : ''}
                    <button class="btn-primary" onclick="returnToIndex()">
                        🏠 Về trang chủ
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        `;
        
        const content = modal.querySelector('.completion-content');
        content.style.cssText = `
            background: linear-gradient(135deg, #b82323, #8b1a1a);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            border: 3px solid #E9E9A4;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        
        // Style stats
        const statsContainer = modal.querySelector('.completion-stats');
        statsContainer.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        `;
        
        const statRows = modal.querySelectorAll('.stat-row');
        statRows.forEach(row => {
            row.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0.5rem 0;
                font-size: 1.1rem;
            `;
        });
        
        const statValues = modal.querySelectorAll('.stat-value');
        statValues.forEach(value => {
            value.style.cssText = `
                font-weight: bold;
                color: #E9E9A4;
                font-size: 1.2rem;
            `;
        });
        
        // Style actions
        const actions = modal.querySelector('.completion-actions');
        actions.style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1.5rem;
        `;
        
        const buttons = modal.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.cssText = `
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            `;
        });
        
        const primaryBtn = modal.querySelector('.btn-primary');
        primaryBtn.style.cssText += `
            background: #E9E9A4;
            color: #b82323;
        `;
        
        const secondaryBtn = modal.querySelector('.btn-secondary');
        secondaryBtn.style.cssText += `
            background: transparent;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        
        const storyBtn = modal.querySelector('.btn-story');
        if (storyBtn) {
            storyBtn.style.cssText += `
                background: linear-gradient(135deg, #8B4513, #A0522D);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            `;
        }
        
        // Style cultural info section
        const culturalInfo = modal.querySelector('.cultural-info');
        if (culturalInfo) {
            culturalInfo.style.cssText = `
                background: rgba(139, 69, 19, 0.1);
                border: 1px solid #8B4513;
                border-radius: 10px;
                padding: 1rem;
                margin: 1rem 0;
                text-align: left;
            `;
        }
        
        const culturalHeader = modal.querySelector('.cultural-header');
        if (culturalHeader) {
            culturalHeader.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            `;
        }
        
        const culturalContent = modal.querySelector('.cultural-content');
        if (culturalContent) {
            culturalContent.style.cssText = `
                font-size: 0.9rem;
                line-height: 1.4;
            `;
        }
        
        document.body.appendChild(modal);
        
        // Add global functions
        window.returnToIndex = () => {
            window.location.href = 'index.html';
        };
        
        window.showChapterStory = (chapterNum) => {
            this.displayStoryModal(chapterNum);
        };
    }

    displayStoryModal(chapterNum) {
        const chapter = chapters[chapterNum];
        const modal = document.createElement('div');
        modal.className = 'story-modal';
        modal.innerHTML = `
            <div class="story-content">
                <button class="story-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <div class="story-header">
                    <h2>📖 ${chapter.title}</h2>
                    <div class="story-cultural-tag">Di sản văn hóa Việt Nam</div>
                </div>
                <div class="story-body">
                    <div class="story-text">
                        ${window.storyManager.getStoryContent(chapterNum)}
                    </div>
                    <div class="cultural-context">
                        <h4>🏛️ Bối cảnh văn hóa</h4>
                        <p><strong>Nguồn gốc:</strong> ${chapter.culturalContext.background}</p>
                        <p><strong>Ý nghĩa:</strong> ${chapter.culturalContext.significance}</p>
                        ${chapter.culturalContext.location ? `<p><strong>Địa điểm:</strong> ${chapter.culturalContext.location}</p>` : ''}
                        ${chapter.culturalContext.evolution ? `<p><strong>Phát triển:</strong> ${chapter.culturalContext.evolution}</p>` : ''}
                        ${chapter.culturalContext.mastery ? `<p><strong>Thành thạo:</strong> ${chapter.culturalContext.mastery}</p>` : ''}
                        ${chapter.culturalContext.artistry ? `<p><strong>Nghệ thuật:</strong> ${chapter.culturalContext.artistry}</p>` : ''}
                        ${chapter.culturalContext.legend ? `<p><strong>Truyền thuyết:</strong> ${chapter.culturalContext.legend}</p>` : ''}
                        ${chapter.culturalContext.celebration ? `<p><strong>Lễ hội:</strong> ${chapter.culturalContext.celebration}</p>` : ''}
                        ${chapter.culturalContext.future ? `<p><strong>Tương lai:</strong> ${chapter.culturalContext.future}</p>` : ''}
                    </div>
                    <div class="educational-content">
                        <h4>🎓 Bài học văn hóa</h4>
                        <p><strong>Điều cần biết:</strong> ${chapter.educationalContent.keyLearning}</p>
                        <p><strong>Thông tin thú vị:</strong> ${chapter.educationalContent.funFact}</p>
                        <p><strong>Truyền thống:</strong> ${chapter.educationalContent.tradition}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const content = modal.querySelector('.story-content');
        content.style.cssText = `
            background: linear-gradient(135deg, #b82323, #8b1a1a);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            border: 3px solid #E9E9A4;
            max-width: 650px;
            width: 90%;
            max-height: 85vh;
            position: relative;
            box-shadow: 
                0 15px 50px rgba(0, 0, 0, 0.6),
                0 8px 25px rgba(0, 0, 0, 0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.1),
                0 0 0 2px rgba(233, 233, 164, 0.3);
        `;
        
        const closeBtn = modal.querySelector('.story-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 2rem;
            color: #E9E9A4;
            cursor: pointer;
        `;
        
        const header = modal.querySelector('.story-header h2');
        header.style.cssText = `
            color: #E9E9A4;
            margin-bottom: 1rem;
            text-align: center;
        `;
        
        const storyText = modal.querySelector('.story-text');
        storyText.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            line-height: 1.6;
            font-size: 1rem;
        `;
        
        const sections = modal.querySelectorAll('.cultural-context, .educational-content');
        sections.forEach(section => {
            section.style.cssText = `
                background: rgba(233, 233, 164, 0.1);
                border: 1px solid rgba(233, 233, 164, 0.3);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            `;
        });
        
        document.body.appendChild(modal);
    }

    updateNPCDialogue(text) {
        const dialogueElement = document.querySelector('.dialogue-text');
        if (dialogueElement) {
            dialogueElement.textContent = text;
        }
    }

    showFeedback(message, type) {
        const feedback = document.querySelector('.feedback-message');
        if (feedback) {
            // Clear any existing animations
            feedback.className = 'feedback-message';
        feedback.textContent = message;
            
            // Add type and show class
            setTimeout(() => {
                feedback.className = `feedback-message ${type} show`;
            }, 10);
            
            // Hide after delay
            const displayTime = type === 'complete' ? 3000 : 2000;
            setTimeout(() => {
                feedback.classList.remove('show');
        setTimeout(() => {
            feedback.textContent = '';
                    feedback.className = 'feedback-message';
                }, 300);
            }, displayTime);
        }
    }
    updateMaxCombo() {
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('current-score');
        const comboElement = document.getElementById('current-combo');
        const streakElement = document.getElementById('current-streak');
        
        if (scoreElement) scoreElement.textContent = this.score.toLocaleString();
        if (comboElement) comboElement.textContent = this.combo;
        if (streakElement) streakElement.textContent = this.streak;
    }

    getFeedbackText() {
        const feedback = [
            "Tuyệt vời! 👏", 
            "Xuất sắc! ⭐", 
            "Hoàn hảo! 🎯", 
            "Tuyệt đỉnh! 🔥"
        ];
        
        const comboMessages = [
            "🔥 SIÊU COMBO x" + this.combo + "!",
            "⚡ COMBO KHỦNG x" + this.combo + "!",
            "💫 COMBO STREAK x" + this.combo + "!",
            "🌟 PERFECT COMBO x" + this.combo + "!"
        ];
        
        if (this.combo >= 20) return comboMessages[0] + " " + feedback[3];
        if (this.combo >= 15) return comboMessages[1] + " " + feedback[3];
        if (this.combo >= 10) return comboMessages[2] + " " + feedback[2];
        if (this.combo >= 5) return comboMessages[3] + " " + feedback[1];
        
        // Random positive feedback for variety
        const randomIndex = Math.floor(Math.random() * feedback.length);
        return feedback[randomIndex];
    }

    // Removed game mode functionality - using normal mode only

    resetGame() {
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.streak = 0;
        this.perfectStreak = 0;
        this.totalMistakes = 0;
        this.startTime = Date.now();
        this.updateScoreDisplay();
        this.startChapter(1);
    }

    checkAchievements() {
        const newAchievements = [];
        
        // Combo achievements
        if (this.combo === 10 && !this.achievements.includes('combo_10')) {
            newAchievements.push({id: 'combo_10', name: 'Combo Master', desc: 'Đạt combo 10'});
        }
        if (this.combo === 25 && !this.achievements.includes('combo_25')) {
            newAchievements.push({id: 'combo_25', name: 'Combo Legend', desc: 'Đạt combo 25'});
        }
        
        // Score achievements
        if (this.score >= 10000 && !this.achievements.includes('score_10k')) {
            newAchievements.push({id: 'score_10k', name: 'High Scorer', desc: 'Đạt 10,000 điểm'});
        }
        
        // Perfect achievements
        if (this.perfectStreak >= 20 && !this.achievements.includes('perfect_20')) {
            newAchievements.push({id: 'perfect_20', name: 'Perfectionist', desc: '20 lần hoàn hảo liên tiếp'});
        }

        // Show new achievements
        newAchievements.forEach(achievement => {
            this.achievements.push(achievement.id);
            this.showAchievement(achievement);
        });
    }

    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadAchievements() {
        const saved = localStorage.getItem('waterPuppet_achievements');
        this.achievements = saved ? JSON.parse(saved) : [];
    }

    saveAchievements() {
        localStorage.setItem('waterPuppet_achievements', JSON.stringify(this.achievements));
    }

    calculateFinalScore(playTime) {
        let finalScore = this.score;
        
        // Time bonus (faster completion = higher bonus)
        const timeBonus = Math.max(0, 10000 - Math.floor(playTime * 10));
        finalScore += timeBonus;
        
        // Combo bonus
        finalScore += this.maxCombo * 100;
        
        // Accuracy bonus
        const accuracy = this.streak / (this.streak + this.totalMistakes);
        finalScore += Math.floor(accuracy * 5000);
        
        return finalScore;
    }

    saveHighScore(score) {
        const highScores = JSON.parse(localStorage.getItem('waterPuppet_highScores') || '[]');
        highScores.push({
            score: score,
            mode: this.gameMode,
            date: new Date().toLocaleDateString(),
            combo: this.maxCombo,
            accuracy: Math.round((this.streak / (this.streak + this.totalMistakes)) * 100)
        });
        
        // Keep only top 10 scores
        highScores.sort((a, b) => b.score - a.score);
        const topScores = highScores.slice(0, 10);
        
        localStorage.setItem('waterPuppet_highScores', JSON.stringify(topScores));
        this.saveAchievements();
    }

    gameComplete() {
        const playTime = (Date.now() - this.startTime) / 1000;
        const finalScore = this.calculateFinalScore(playTime);
        
        // Save final results
        const gameResult = {
            completed: true,
            allChaptersCompleted: true,
            finalScore: finalScore,
            maxCombo: this.maxCombo,
            playTime: playTime,
            accuracy: Math.round((this.streak / (this.streak + this.totalMistakes)) * 100),
            totalStoryUnlocked: window.storyManager ? window.storyManager.unlockedStories.length : 0
        };
        
        localStorage.setItem('waterPuppet_gameCompleted', JSON.stringify(gameResult));
        
        // Show final completion screen
        this.showGameCompletionScreen(gameResult);
    }

    showGameCompletionScreen(gameResult) {
        const modal = document.createElement('div');
        modal.className = 'game-completion-modal';
        modal.innerHTML = `
            <div class="game-completion-content">
                <div class="completion-header">
                    <h1>🎭 CHÚC MỪNG! 🎭</h1>
                    <h2>Bạn đã trở thành Nghệ nhân Múa rối nước!</h2>
                </div>
                
                <div class="completion-story">
                    <p>🌟 <em>"Cháu đã hoàn thành hành trình học nghệ thuật múa rối nước. Từ những bước đầu tiên cho đến khi trở thành nghệ nhân thực thụ, cháu đã khám phá được tinh hoa văn hóa dân tộc qua 10 chương đầy thú vị."</em></p>
                    <p><strong>- Nghệ nhân Năm -</strong></p>
                </div>
                
                <div class="final-stats">
                    <h3>📊 Thành tích cuối cùng</h3>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-value">${gameResult.finalScore.toLocaleString()}</div>
                            <div class="stat-label">Điểm tổng kết</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${gameResult.maxCombo}</div>
                            <div class="stat-label">Combo tối đa</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${Math.floor(gameResult.playTime / 60)}:${String(Math.floor(gameResult.playTime % 60)).padStart(2, '0')}</div>
                            <div class="stat-label">Tổng thời gian</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${gameResult.accuracy}%</div>
                            <div class="stat-label">Độ chính xác</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${gameResult.totalStoryUnlocked}/10</div>
                            <div class="stat-label">Cốt truyện mở khóa</div>
                        </div>
                    </div>
                </div>
                
                <div class="cultural-achievement">
                    <h3>🏛️ Thành tựu văn hóa</h3>
                    <p>✅ Đã tìm hiểu về lịch sử 1000+ năm của múa rối nước</p>
                    <p>✅ Khám phá 10 câu chuyện văn hóa Việt Nam</p>
                    <p>✅ Hiểu về nghệ thuật truyền thống và ý nghĩa sâu sắc</p>
                    <p>✅ Trở thành đại sứ văn hóa múa rối nước</p>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-primary" onclick="window.location.href = 'index.html'">
                        🏠 Về trang chủ
                    </button>
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove(); gameManager.resetGame()">
                        🔄 Chơi lại từ đầu
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.5s ease-out;
        `;
        
        const content = modal.querySelector('.game-completion-content');
        content.style.cssText = `
            background: linear-gradient(135deg, #b82323, #8b1a1a);
            color: white;
            padding: 3rem;
            border-radius: 25px;
            border: 3px solid #E9E9A4;
            max-width: 800px;
            width: 95%;
            max-height: 90vh;
            overflow-y: auto;
            text-align: center;
            box-shadow: 
                0 30px 70px rgba(0, 0, 0, 0.7),
                0 20px 50px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        `;
        
        // Style individual sections
        const header = modal.querySelector('.completion-header h1');
        header.style.cssText = `
            font-size: 3rem;
            margin: 0 0 1rem 0;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
            animation: titleGlow 2s ease-in-out infinite alternate;
        `;
        
        const h2 = modal.querySelector('.completion-header h2');
        h2.style.cssText = `
            color: #E9E9A4;
            font-size: 1.5rem;
            margin-bottom: 2rem;
        `;
        
        const storySection = modal.querySelector('.completion-story');
        storySection.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            padding: 2rem;
            border-radius: 15px;
            margin: 2rem 0;
            font-style: italic;
            line-height: 1.6;
        `;
        
        const statsGrid = modal.querySelector('.stats-grid');
        statsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        `;
        
        const statBoxes = modal.querySelectorAll('.stat-box');
        statBoxes.forEach(box => {
            box.style.cssText = `
                background: rgba(233, 233, 164, 0.1);
                border: 1px solid rgba(233, 233, 164, 0.3);
                border-radius: 10px;
                padding: 1rem;
            `;
        });
        
        const culturalSection = modal.querySelector('.cultural-achievement');
        culturalSection.style.cssText = `
            background: rgba(139, 69, 19, 0.2);
            border: 1px solid #8B4513;
            border-radius: 15px;
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: left;
        `;
        
        const actions = modal.querySelector('.completion-actions');
        actions.style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        `;
        
        const buttons = modal.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.cssText = `
                padding: 1rem 2rem;
                border: none;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
        });
        
        const primaryBtn = modal.querySelector('.btn-primary');
        primaryBtn.style.cssText += `
            background: linear-gradient(135deg, #E9E9A4, #ffd700);
            color: #b82323;
        `;
        
        const secondaryBtn = modal.querySelector('.btn-secondary');
        secondaryBtn.style.cssText += `
            background: transparent;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        
        document.body.appendChild(modal);
        
        // Save high score
        this.saveHighScore(gameResult.finalScore);
    }

    displayFinalStats(playTime) {
        // This method is now replaced by gameComplete()
        this.gameComplete();
    }
}

// Global functions for sequence display
function displaySequence(sequence) {
    const sequenceContainer = document.querySelector('.sequence-display');
    if (!sequenceContainer) return;
    
    sequenceContainer.innerHTML = '';
    
    // Convert string to array if needed
    const keys = Array.isArray(sequence) ? sequence : sequence.split('');
    
    keys.forEach((key, index) => {
        const keyElement = document.createElement('div');
        keyElement.className = 'sequence-key';
        if (index === 0) keyElement.classList.add('current');
        keyElement.textContent = key;
        sequenceContainer.appendChild(keyElement);
    });
}

function updateSequenceDisplay(targetSequence, currentSequence) {
    const sequenceKeys = document.querySelectorAll('.sequence-key');
    
    sequenceKeys.forEach((keyElement, index) => {
        keyElement.classList.remove('current', 'completed', 'wrong');
        
        if (index < currentSequence.length) {
            keyElement.classList.add('completed');
        } else if (index === currentSequence.length) {
            keyElement.classList.add('current');
        }
    });
}

// Thêm hàm để xử lý hiệu ứng khi reset sequence
function resetSequenceDisplay() {
    const sequenceKeys = document.querySelectorAll('.sequence-key');
    sequenceKeys.forEach(key => {
        key.classList.remove('active', 'wrong');
        const ripples = key.querySelectorAll('.ripple');
        ripples.forEach(ripple => ripple.remove());
    });
}

// Global reference for game manager
let gameManager;

// Initialize game when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get selected chapter from localStorage (from index.html)
    const selectedChapter = localStorage.getItem('waterPuppet_selectedChapter');
    const startChapter = selectedChapter ? parseInt(selectedChapter) : 1;
    
    // Update chapter title in navigation
    const chapterTitle = document.getElementById('current-chapter-title');
    if (chapterTitle && chapters[startChapter]) {
        chapterTitle.textContent = `Chương ${startChapter}: ${chapters[startChapter].title}`;
    }
    
    gameManager = new GameManager();
    gameManager.startChapter(startChapter);
});