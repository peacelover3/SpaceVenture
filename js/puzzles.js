// Puzzle System for Boss Fights
const PuzzleSystem = {
    currentPuzzle: null,
    currentLevel: 0,
    selectedOption: null,
    draggedItem: null,

    // Generate puzzle based on level
    generatePuzzle(levelId) {
        this.currentLevel = levelId;
        const puzzles = this.getPuzzlesForLevel(levelId);
        this.currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        return this.currentPuzzle;
    },

    getPuzzlesForLevel(levelId) {
        const puzzles = {
            0: [ // Sequencing
                {
                    type: 'drag-drop',
                    title: 'Sequence the Launch Protocol',
                    instruction: 'Drag the steps in the correct order to launch your super weapon:',
                    items: ['Initialize systems', 'Load ammunition', 'Aim at target', 'Fire weapon'],
                    correctOrder: ['Initialize systems', 'Load ammunition', 'Aim at target', 'Fire weapon'],
                    hint: 'Think about what you need to do first before firing!'
                },
                {
                    type: 'drag-drop',
                    title: 'Morning Routine Sequence',
                    instruction: 'Put these programming steps in order:',
                    items: ['Write code', 'Test program', 'Plan solution', 'Debug errors'],
                    correctOrder: ['Plan solution', 'Write code', 'Test program', 'Debug errors'],
                    hint: 'You need a plan before you start coding!'
                }
            ],
            1: [ // Loops
                {
                    type: 'multiple-choice',
                    title: 'Loop Pattern Recognition',
                    instruction: 'The alien attacks repeat every 3 seconds. Which loop correctly represents this?',
                    options: [
                        'for i in range(5): attack()',
                        'while True: attack(); wait(3)',
                        'attack() attack() attack()',
                        'if attack: wait(3)'
                    ],
                    correct: 1,
                    hint: 'We need continuous repetition with a 3-second delay!'
                },
                {
                    type: 'multiple-choice',
                    title: 'Counting Loop',
                    instruction: 'Which loop fires exactly 5 lasers?',
                    options: [
                        'for i in range(4): fire()',
                        'for i in range(5): fire()',
                        'for i in range(6): fire()',
                        'fire() * 5'
                    ],
                    correct: 1,
                    hint: 'range(5) gives us 0,1,2,3,4 = 5 iterations!'
                }
            ],
            2: [ // Conditions
                {
                    type: 'multiple-choice',
                    title: 'Battle Decision',
                    instruction: 'Choose the correct if/else statement: If enemy is close, shoot. Otherwise, reload.',
                    options: [
                        'if close: reload()\nelse: shoot()',
                        'if close: shoot()\nelse: reload()',
                        'if shoot: close()\nelse: reload()',
                        'close: shoot()'
                    ],
                    correct: 1,
                    hint: 'When enemy is close, what should you do?'
                },
                {
                    type: 'multiple-choice',
                    title: 'Health Check',
                    instruction: 'Which condition checks if health is below 30?',
                    options: [
                        'if health > 30:',
                        'if health < 30:',
                        'if health = 30:',
                        'if health != 30:'
                    ],
                    correct: 1,
                    hint: 'Below means less than...'
                }
            ],
            3: [ // Variables
                {
                    type: 'multiple-choice',
                    title: 'Variable Assignment',
                    instruction: 'What is the value of score after this code?\nscore = 100\nscore = score + 50',
                    options: ['100', '50', '150', '200'],
                    correct: 2,
                    hint: '100 + 50 = ?'
                },
                {
                    type: 'multiple-choice',
                    title: 'Track the Variable',
                    instruction: 'What does enemies equal at the end?\nenemies = 10\nenemies = enemies - 3\nenemies = enemies + 1',
                    options: ['7', '8', '9', '10'],
                    correct: 1,
                    hint: '10 - 3 = 7, then 7 + 1 = ?'
                }
            ],
            4: [ // Functions
                {
                    type: 'multiple-choice',
                    title: 'Function Call',
                    instruction: 'Which line calls the function shootEnemy()?',
                    options: [
                        'def shootEnemy():',
                        'shootEnemy()',
                        'function shootEnemy',
                        'call shootEnemy'
                    ],
                    correct: 1,
                    hint: 'Function calls use the name followed by parentheses!'
                },
                {
                    type: 'multiple-choice',
                    title: 'Function Definition',
                    instruction: 'Which is the correct way to define a function?',
                    options: [
                        'function myFunc():',
                        'def myFunc():',
                        'define myFunc():',
                        'myFunc = function()'
                    ],
                    correct: 1,
                    hint: 'Python uses "def" keyword!'
                }
            ],
            5: [ // Debugging
                {
                    type: 'multiple-choice',
                    title: 'Find the Bug',
                    instruction: 'What\'s wrong with this code?\nfor i in range(1, 10):\n    print(i)',
                    options: [
                        'Wrong variable name',
                        'Missing colon',
                        'Off-by-one error (misses 0)',
                        'Nothing wrong'
                    ],
                    correct: 2,
                    hint: 'range(1, 10) starts at 1, not 0!'
                },
                {
                    type: 'multiple-choice',
                    title: 'Syntax Error',
                    instruction: 'What\'s the bug here?\nprnt("Hello")',
                    options: [
                        'Wrong quotes',
                        'Missing parentheses',
                        'Typo: should be print()',
                        'Semicolon needed'
                    ],
                    correct: 2,
                    hint: 'Look carefully at the function name...'
                }
            ],
            6: [ // Mixed
                {
                    type: 'multiple-choice',
                    title: 'Final Challenge',
                    instruction: 'What does this code do?\nfor i in range(3):\n    if i < 2:\n        score = score + 10',
                    options: [
                        'Adds 30 to score',
                        'Adds 20 to score',
                        'Adds 10 to score',
                        'Error'
                    ],
                    correct: 1,
                    hint: 'Loop runs 3 times (0,1,2). Condition is true for 0 and 1 only.'
                },
                {
                    type: 'drag-drop',
                    title: 'Complete the Code',
                    instruction: 'Arrange these to make a working function:',
                    items: ['return result', 'def calculate(x, y):', 'result = x + y'],
                    correctOrder: ['def calculate(x, y):', 'result = x + y', 'return result'],
                    hint: 'Define function first, then calculate, then return!'
                }
            ]
        };

        return puzzles[levelId] || puzzles[0];
    },

    renderPuzzle(puzzle) {
        const container = document.getElementById('puzzle-area');
        container.innerHTML = '';

        if (puzzle.type === 'drag-drop') {
            this.renderDragDrop(container, puzzle);
        } else if (puzzle.type === 'multiple-choice') {
            this.renderMultipleChoice(container, puzzle);
        }

        this.selectedOption = null;
        document.getElementById('puzzle-feedback').className = 'feedback';
        document.getElementById('puzzle-feedback').style.display = 'none';
    },

    renderDragDrop(container, puzzle) {
        const wrapper = document.createElement('div');
        wrapper.className = 'drag-drop-container';

        // Source chips (shuffled) - tappable, no drag needed
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'drag-source';
        sourceDiv.innerHTML = '<h4>Steps (tap in order):</h4>';
        
        const shuffledItems = [...puzzle.items].sort(() => Math.random() - 0.5);
        shuffledItems.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'draggable-item tap-chip';
            chip.textContent = item;
            chip.dataset.value = item;
            
            chip.addEventListener('click', () => {
                if (chip.classList.contains('used')) return;
                const slots = Array.from(wrapper.querySelectorAll('.drop-slot'));
                const openSlot = slots.find(s => !s.classList.contains('filled'));
                if (!openSlot) return;
                openSlot.classList.add('filled');
                openSlot.dataset.value = item;
                const num = openSlot.querySelector('.slot-num');
                if (num) num.textContent = '✓';
                const label = openSlot.querySelector('.slot-label');
                if (label) label.textContent = item;
                chip.classList.add('used');
            });
            
            sourceDiv.appendChild(chip);
        });

        // Order slots: tap to fill next, tap a filled slot to remove it
        const dropDiv = document.createElement('div');
        dropDiv.className = 'drop-zone';
        dropDiv.innerHTML = '<h4>Correct Order:</h4>';
        
        puzzle.items.forEach((item, i) => {
            const slot = document.createElement('div');
            slot.className = 'drop-slot';
            slot.dataset.index = i;
            const num = document.createElement('span');
            num.className = 'slot-num';
            num.textContent = i + 1;
            slot.appendChild(num);
            const label = document.createElement('span');
            label.className = 'slot-label';
            slot.appendChild(label);
            
            slot.addEventListener('click', () => {
                if (!slot.classList.contains('filled')) return;
                const usedChip = Array.from(wrapper.querySelectorAll('.tap-chip'))
                    .find(c => c.dataset.value === slot.dataset.value && c.classList.contains('used'));
                if (usedChip) usedChip.classList.remove('used');
                slot.classList.remove('filled');
                delete slot.dataset.value;
                num.textContent = i + 1;
                label.textContent = '';
            });
            
            dropDiv.appendChild(slot);
        });

        wrapper.appendChild(sourceDiv);
        wrapper.appendChild(dropDiv);
        container.appendChild(wrapper);
    },

    renderMultipleChoice(container, puzzle) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'multiple-choice-options';
        
        puzzle.options.forEach((option, index) => {
            const choiceDiv = document.createElement('div');
            choiceDiv.className = 'choice-option';
            choiceDiv.textContent = option;
            choiceDiv.dataset.index = index;
            
            choiceDiv.addEventListener('click', () => {
                document.querySelectorAll('.choice-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                choiceDiv.classList.add('selected');
                this.selectedOption = index;
            });
            
            optionsDiv.appendChild(choiceDiv);
        });
        
        container.appendChild(optionsDiv);
    },

    checkAnswer() {
        const feedback = document.getElementById('puzzle-feedback');
        
        if (!this.currentPuzzle) return false;

        let isCorrect = false;

        if (this.currentPuzzle.type === 'drag-drop') {
            const slots = document.querySelectorAll('.drop-slot');
            const userOrder = Array.from(slots).map(slot => slot.dataset.value || '');
            isCorrect = JSON.stringify(userOrder) === JSON.stringify(this.currentPuzzle.correctOrder);
        } else if (this.currentPuzzle.type === 'multiple-choice') {
            isCorrect = this.selectedOption === this.currentPuzzle.correct;
        }

        if (isCorrect) {
            feedback.textContent = '✅ CORRECT! Weapon fired successfully!';
            feedback.className = 'feedback correct';
            AudioSystem.playPuzzleCorrect();
            return true;
        } else {
            feedback.textContent = '❌ WRONG! Try again or use a hint!';
            feedback.className = 'feedback incorrect';
            AudioSystem.playPuzzleWrong();
            return false;
        }
    },

    showHint() {
        if (this.currentPuzzle && this.currentPuzzle.hint) {
            const feedback = document.getElementById('puzzle-feedback');
            feedback.textContent = '💡 HINT: ' + this.currentPuzzle.hint;
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(255, 200, 0, 0.3)';
            feedback.style.borderColor = '#ffc800';
            feedback.style.color = '#ffc800';
        }
    }
};
