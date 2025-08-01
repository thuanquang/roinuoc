class KeyHandler {
    constructor() {
        this.currentSequence = '';
        this.targetSequence = '';
        this.sequenceTimeout = null;
        this.isWaiting = false;
        this.keyDelay = 500; // 1 second delay between keys
        this.lastKeyTime = 0;
        
        this.initializeKeyListeners();
    }

    initializeKeyListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Add click listeners for mobile support
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                this.handleKeyPress({ key: key.dataset.key.toLowerCase() });
            });
        });
    }

    setNewSequence(sequence, timeLimit) {
        this.targetSequence = sequence;
        this.currentSequence = '';
        this.sequenceStartTime = Date.now();
        this.displaySequence();
        
        if (this.sequenceTimeout) {
            clearTimeout(this.sequenceTimeout);
        }
        
        this.sequenceTimeout = setTimeout(() => {
            this.checkSequence(false);
        }, timeLimit);
    }

    handleKeyPress(e) {
        if (this.isWaiting) return;
        
        const key = e.key.toLowerCase();
        if (!['w', 'a', 's', 'd'].includes(key)) return;

        const currentTime = Date.now();
        if (currentTime - this.lastKeyTime < this.keyDelay) return;

        this.lastKeyTime = currentTime;
        this.currentSequence += key.toUpperCase();
        this.highlightKey(key.toUpperCase());
        
        this.checkSequence(true);

        this.isWaiting = true;
        setTimeout(() => {
            this.isWaiting = false;
        }, this.keyDelay);
    }

    highlightKey(key) {
        const keyElement = document.querySelector(`[data-key="${key}"]`);
        keyElement.classList.add('active');
        setTimeout(() => {
            keyElement.classList.remove('active');
        }, this.keyDelay);
    }

    displaySequence() {
        const display = document.querySelector('.sequence-display');
        if (!display) return;
        
        display.innerHTML = '';
        
        this.targetSequence.split('').forEach((key, index) => {
            const keyElement = document.createElement('div');
            keyElement.className = 'sequence-key';
            if (index === 0) keyElement.classList.add('current');
            keyElement.textContent = key;
            display.appendChild(keyElement);
        });
    }

    checkSequence(partial) {
        if (partial) {
            if (!this.targetSequence.startsWith(this.currentSequence)) {
                // Wrong key - show error
                this.showWrongKeyEffect();
                this.currentSequence = this.currentSequence.slice(0, -1); // Remove last wrong key
                this.triggerFailure();
                // Trigger key failure event for scoring
                document.dispatchEvent(new CustomEvent('keyFailed'));
            } else {
                // Correct key - trigger success event for scoring
                document.dispatchEvent(new CustomEvent('keySuccess'));
                
                // Update display
                if (typeof updateSequenceDisplay === 'function') {
                    updateSequenceDisplay(this.targetSequence, this.currentSequence);
                }
                
                // Check if sequence is complete
                if (this.currentSequence === this.targetSequence) {
                    const timeBonus = this.calculateTimeBonus();
                    this.triggerSuccess(timeBonus);
                }
            }
        } else {
            if (this.currentSequence === this.targetSequence) {
                const timeBonus = this.calculateTimeBonus();
                this.triggerSuccess(timeBonus);
            } else {
                this.triggerFailure();
            }
        }
    }

    showWrongKeyEffect() {
        const sequenceKeys = document.querySelectorAll('.sequence-key');
        const currentIndex = this.currentSequence.length - 1;
        
        if (sequenceKeys[currentIndex]) {
            sequenceKeys[currentIndex].classList.add('wrong');
            setTimeout(() => {
                sequenceKeys[currentIndex].classList.remove('wrong');
            }, 500);
        }
        
        // Shake water stage
        const waterStage = document.querySelector('.water-stage');
        if (waterStage) {
            waterStage.classList.add('shake');
            setTimeout(() => {
                waterStage.classList.remove('shake');
            }, 500);
        }
    }

    calculateTimeBonus() {
        // Calculate bonus based on how fast the sequence was completed
        const sequenceStartTime = this.sequenceStartTime || Date.now();
        const elapsedTime = Date.now() - sequenceStartTime;
        const timeLimit = 8000; // Default time limit
        const timeRatio = Math.max(0, (timeLimit - elapsedTime) / timeLimit);
        return Math.floor(timeRatio * 200); // Max 200 bonus points for perfect timing
    }

    triggerSuccess(timeBonus = 0) {
        // Clear timeout
        if (this.sequenceTimeout) {
            clearTimeout(this.sequenceTimeout);
        }
        
        document.dispatchEvent(new CustomEvent('sequenceSuccess', { detail: timeBonus }));
    }

    triggerFailure() {
        // Reset current sequence
        this.currentSequence = '';
        
        // Reset display
        this.displaySequence();
        
        document.dispatchEvent(new CustomEvent('sequenceFailed'));
    }
}
const originalHandleKeyPress = KeyHandler.prototype.handleKeyPress;
KeyHandler.prototype.handleKeyPress = function(e) {
    // Call original method
    originalHandleKeyPress.call(this, e);
    
    // Trigger character animation
    if (window.character3D && !this.isWaiting) {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            // Character will handle the animation
            window.character3D.handleKeyPress(e);
        }
    }
};