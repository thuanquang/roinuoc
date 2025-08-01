# PROJECT STRUCTURE - Water Puppet Game

## Core Architecture - 7 Chapter Water Puppet Heritage Game
- **HTML**: `index.html` (main menu/chapter selection), `game.html` (gameplay interface)
- **CSS**: `index-styles.css` (menu styles), `game-styles.css` (game UI), `debug-styles.css` (debug tools)
- **JS Modules**:
  - `chapterData.js`: 7 water puppet heritage chapters, sequences, cultural stories
  - `index-game.js`: Chapter selection, progress management, modal handling
  - `gameLogic.js`: Main game manager, scoring, progression  
  - `keyHandler.js`: WASD input handling (W=bow, A=left, S=wave, D=right)
  - `supabase.js`: Database integration (unused)

## Game Flow
1. User opens `index.html` → sees chapter grid
2. Click chapter → modal opens with chapter info
3. Click "Chơi ngay" → navigate to `game.html` with selected chapter
4. GameManager initializes → starts selected chapter
5. Chapter displays NPC dialogue + key sequences
6. KeyHandler validates user input against target sequence
7. Success → score increase → next sequence/chapter
8. Completion → return to index.html with progress saved

## Key Classes
- `GameProgressManager`: Manages chapter progress, unlocking, UI rendering
- `GameManager`: Controls game state, chapter progression, scoring
- `KeyHandler`: Manages input, sequence validation, timing
- `StoryManager`: Handles story unlocking system

## Data Structure
```
chapters[1-7] = {
  title: string (water puppet cultural theme),
  culturalContext: {background, significance, tradition},
  story: {isUnlocked: boolean, content: educational story},
  npcDialogue: string[] (Master artisan guidance),
  sequences: [{keys: "WASD", time, description}],
  educationalContent: {keyLearning, funFact, tradition},
  difficulty: 1-7 (progressive learning)
}
```

## UI Components
### Index.html:
- Chapter grid with cards
- Progress bar and stats
- Chapter detail modal
- Debug tools

### Game.html:
- Water stage with puppet animation
- NPC dialogue box
- Key sequence display (WASD)
- Score panel
- Control hints
- Navigation bar

## Progress System
- Completed chapters unlock next chapter
- Story content unlocks after completing chapters
- High scores and achievements tracked
- All data stored in localStorage

## Recent Fixes Applied
- Fixed event binding for modal buttons
- Enhanced navigation from index to game
- Added comprehensive debugging and error handling
- Improved modal display and interaction
- Added loading states and user feedback