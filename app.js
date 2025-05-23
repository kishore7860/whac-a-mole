const blocks = document.querySelectorAll('.block');

const model = {
    GameState: {
        score: 0,
        timeLeft: 30,
        activeMoles: new Set(),
        reset() {
            this.score = 0;
            this.timeLeft = 30;
            this.activeMoles.clear();
        },
        updateScore() {
            this.score++;
        }
    }
};

const view = {
    scoreEl: document.getElementById('score'),
    timeEl: document.getElementById('time'),
    startBtn: document.getElementById('start-button'),

    renderScore(score) {
        this.scoreEl.textContent = score;
    },

    renderTime(time) {
        this.timeEl.textContent = time;
    },

    clearBoard() {
        blocks.forEach(block => {
            const mole = block.querySelector('.mole');
            if (mole) block.removeChild(mole);
        });
    },

    showMole(block) {
        const mole = document.createElement('img');
        mole.src = 'images/mole.jpg';
        mole.classList.add('mole');
        block.appendChild(mole);
        return mole;
    }
};

const controller = {
    gameInterval: null,
    moleInterval: null,

    getRandomEmptyBlock() {
        const emptyBlocks = [...blocks].filter(block => !block.querySelector('.mole'));
        if (emptyBlocks.length === 0) return null;
        const randIndex = Math.floor(Math.random() * emptyBlocks.length);
        return emptyBlocks[randIndex];
    },

    spawnMole() {
        if (model.GameState.activeMoles.size >= 3) return;
        const block = controller.getRandomEmptyBlock();
        if (!block) return;

        const mole = view.showMole(block);
        model.GameState.activeMoles.add(block);

        mole.addEventListener('click', () => {
            model.GameState.updateScore();
            view.renderScore(model.GameState.score);
            block.removeChild(mole);
            model.GameState.activeMoles.delete(block);
        });

        setTimeout(() => {
            if (block.contains(mole)) {
                block.removeChild(mole);
                model.GameState.activeMoles.delete(block);
            }
        }, 2000);
    },

    startGame() {
        model.GameState.reset();
        view.renderScore(model.GameState.score);
        view.renderTime(model.GameState.timeLeft);
        view.clearBoard();

        this.gameInterval = setInterval(() => {
            model.GameState.timeLeft--;
            view.renderTime(model.GameState.timeLeft);
            if (model.GameState.timeLeft <= 0) {
                clearInterval(this.gameInterval);
                clearInterval(this.moleInterval);
                alert('Time is Up !!!');
                view.clearBoard();
            }
        }, 1000);

        this.moleInterval = setInterval(() => {
            controller.spawnMole();
        }, 1000);
    }
};

view.startBtn.addEventListener('click', () => controller.startGame());