<template>
    <div class="quiz-page">
        <div class="lobby" v-if="!inGame">
            <div class="lobby-card">
                <div class="lobby-header">
                </div>

                <div class="lobby-body">
                            <h2 class="lobby-title">Word Challenge</h2>
                            <p class="lobby-desc">Time to play with CVC words! Can you be the CVC Word Champ?</p>

                            <label class="label">Difficulty</label>
                            <select v-model="difficulty" class="input">
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <label class="label">Category</label>
                            <select v-model="category" class="input" aria-label="Category">
                                <option value="All">All</option>
                                <option v-for="opt in categoriesOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>

                            <div class="lobby-actions">
                                <button class="btn btn-primary" @click="createGame">Create Game</button>
                            </div>
                        </div>
            </div>
        </div>

        <div class="game" v-else>
                <div class="game-top">
                <div class="game-info">
                    <div class="game-code">Code: <strong>{{ game.code }}</strong></div>
                    <div class="player-name">You: {{ nickname || 'Player' }}</div>
                    <div class="player-score">Score: <strong>{{ points }}</strong></div>
                </div>
                <!-- Score pop animation -->
                <div v-if="scorePopVisible" class="score-pop" :class="scorePopType">{{ scorePopText }}</div>
                <div class="game-actions">
                    <button class="btn btn-ghost" @click="leaveGame">Leave</button>
                </div>
            </div>

                        <div class="question-card" role="region" aria-label="Question card">
                            <div class="question-header">
                                <div class="question-number">Q{{ currentIndex + 1 }} / {{ questions.length }}</div>
                                <h3 class="question-text" id="question-text">{{ currentPrompt }}</h3>
                                            <div class="tts-controls">
                                                <button class="btn btn-ghost" @click="speakCurrentQuestion" :aria-pressed="isSpeaking" aria-label="Read question aloud">🔊 Read again</button>
                                            </div>
                            </div>

                            <div class="progress-row" aria-hidden="false">
                                <div class="timer">{{ remaining }}s</div>
                                <div class="progress-bar" role="progressbar" :aria-valuemin="0" :aria-valuemax="perQuestionTime" :aria-valuenow="perQuestionTime - remaining">
                                    <div class="progress-fill" :style="{ width: ((perQuestionTime - remaining) / perQuestionTime * 100) + '%' }"></div>
                                </div>
                            </div>

                            <div class="answers-grid" role="list" aria-labelledby="question-text">
                                <button
                                    v-for="(a, i) in currentQuestion.choices"
                                    :key="i"
                                    :class="['answer-tile', { shake: wrongFlashIndex === i, selected: selected === i, correct: showResult && i === currentQuestion.correctIndex, wrong: showResult && selected === i && i !== currentQuestion.correctIndex }]"
                                    role="listitem"
                                    :aria-pressed="selected === i"
                                    :aria-disabled="showResult"
                                    @click="selectAnswer(i)"
                                    @keydown.enter.stop.prevent="selectAnswer(i)"
                                    tabindex="0"
                                >
                                    <span class="choice-letter">{{ String.fromCharCode(65 + i) }}</span>
                                    <span class="choice-text">{{ a }}</span>
                                </button>
                            </div>

                            <div class="question-footer">
                                <button class="btn btn-ghost" @click="prevQuestion" :disabled="currentIndex === 0">Prev</button>
                                <button class="btn btn-primary" @click="nextOrReveal">{{ showResult ? 'Next' : 'Reveal' }}</button>
                            </div>
                        </div>
                        <!-- Finish modal -->
                        <div v-if="showFinishModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="finish-title">
                            <div class="finish-card">
                                <h3 id="finish-title">Quiz complete</h3>
                                <p>You scored <strong>{{ points }}</strong> point(s). Would you like to return to the lobby?</p>
                                <div class="finish-actions">
                                    <button class="btn btn-ghost" @click="cancelFinish">Stay</button>
                                    <button class="btn btn-primary" @click="confirmFinish">Return to Lobby</button>
                                </div>
                            </div>
                        </div>
                        <!-- Reveal result modal -->
                        <div v-if="showRevealModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reveal-title">
                            <div class="finish-card">
                                <h3 id="reveal-title">{{ revealIsCorrect ? 'Correct!' : 'Not quite' }}</h3>
                                <p>{{ revealMessage }}</p>
                                <div class="finish-actions">
                                    <button class="btn btn-primary" @click="closeReveal">Continue</button>
                                </div>
                            </div>
                        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.js'

const inGame = ref(false)
const joinCode = ref(localStorage.getItem('joinCode') || '')
const nickname = ref(localStorage.getItem('nickname') || '')
const difficulty = ref(localStorage.getItem('difficulty') || 'Easy')
const category = ref(localStorage.getItem('category') || 'All')
const categoriesOptions = ref([])

const game = ref({ code: '4A2B' })

const questions = ref([])
const allWords = ref([]) // flat list of strings pulled from Easy_words collection

const currentIndex = ref(0)
const selected = ref(null)
const showResult = ref(false)
const points = ref(0)
const scoredQuestions = new Set()
const scorePopVisible = ref(false)
const scorePopType = ref('plus') // 'plus' or 'wrong'
const scorePopText = ref('')
const wrongFlashIndex = ref(null)

const showRevealModal = ref(false)
const revealMessage = ref('')
const revealIsCorrect = ref(false)

const correctMessages = [
    'Wow! You nailed it! 🥳',
    'Amazing job, superstar! 🌟',
    'You got it right—high five! ✋🎉',
    'That’s correct! You’re on fire! 🔥',
    'Bravo! You’re a word wizard! 🪄✨',
    'Yes! You did it—CVC champ alert! 🏆',
    'Woohoo! You’re so smart! 😄🎈',
    'Fantastic! You cracked the word code! 🕵️‍♂️🔤',
    'Correct! You’re rocking this game! 🎸💥',
    'Boom! You’re unstoppable! 💪🎊'
]
const incorrectMessages = [
    'Oops! Not quite, but great try! 😊',
    'Almost there—let’s try again! 💪',
    'Good effort! You’re getting closer! 🎯',
    'Nice try, smarty! Give it another go! 😄',
    'So close! I know you can do it! 🌟',
    'Oopsie! That one’s tricky—but don’t give up! 🧩',
    'Not this time, but you’re doing awesome! 👍',
    'Aww, almost! Let’s listen carefully and try again! 👂💖',
    'Good guess! You’ll get it next time! 🌻',
    'Nice try, champion! Practice makes perfect! 🏅'
]

function pickRevealMessage(isCorrect) {
    const arr = isCorrect ? correctMessages : incorrectMessages
    const i = Math.floor(Math.random() * arr.length)
    return arr[i]
}

// TTS / speaking state
const isSpeaking = ref(false)

const perQuestionTime = ref(12) // seconds
const remaining = ref(perQuestionTime.value)
let timerInterval = null

const currentQuestion = computed(() => questions.value[currentIndex.value])
const showFinishModal = ref(false)
const prompts = [
    'Can you guess the secret word?',
    'Listen closely! What word do you hear?',
    'Mystery Word Time! Can you figure it out?',
    'Shh… a secret word is hiding! Can you guess it?',
    'It’s Word Detective Time! What word do you think it is?',
    'Let’s play ‘What’s That Word?’',
    'Put on your thinking caps—guess the word!',
    'Guess the Magic Word!',
    'Can your ears catch the word?',
    'Listen, think, and shout the word!'
]
const currentPrompt = ref(prompts[0])

function pickRandomPrompt() {
    if (!prompts.length) return
    const i = Math.floor(Math.random() * prompts.length)
    currentPrompt.value = prompts[i]
}

function persistPrefs() {
    localStorage.setItem('joinCode', joinCode.value)
    localStorage.setItem('nickname', nickname.value)
    localStorage.setItem('difficulty', difficulty.value)
    localStorage.setItem('category', category.value)
}

function handleReveal() {
    // increment points only once per question
    const idx = currentIndex.value
    if (scoredQuestions.has(idx)) return
    const isCorrect = selected.value === currentQuestion.value.correctIndex
    if (isCorrect) {
        points.value = points.value + 1
        showScorePop('plus', '+1')
    } else {
        wrongFlashIndex.value = selected.value
        showScorePop('wrong', 'Wrong!')
        setTimeout(() => { wrongFlashIndex.value = null }, 700)
    }
    scoredQuestions.add(idx)

    // set reveal modal message and show it shortly after reveal
    revealIsCorrect.value = isCorrect
    revealMessage.value = pickRevealMessage(isCorrect)
    setTimeout(() => { showRevealModal.value = true }, 350)
}

function showScorePop(type, text) {
    scorePopType.value = type
    scorePopText.value = text
    scorePopVisible.value = true
    // hide after animation
    setTimeout(() => { scorePopVisible.value = false }, 900)
}

// load unique categories from the chosen difficulty collection
async function loadCategoriesForDifficulty() {
    try {
        const collectionName = (difficulty.value === 'Medium') ? 'Medium_words' : (difficulty.value === 'Hard') ? 'Hard_words' : 'Easy_words'
        const col = collection(db, collectionName)
        const snap = await getDocs(col)
        const set = new Set()
        snap.forEach(d => {
            const data = d.data()
            if (data && data.category) set.add(String(data.category))
        })
        categoriesOptions.value = Array.from(set)
        // if current category is not in options, reset to All
        if (category.value !== 'All' && !categoriesOptions.value.includes(category.value)) {
            category.value = 'All'
            persistPrefs()
        }
    } catch (e) {
        console.warn('Failed to load categories', e)
        categoriesOptions.value = []
    }
}
watch(difficulty, () => {
    loadCategoriesForDifficulty()
})

function joinGame() {
    if (!joinCode.value) return alert('Enter a game code')
    persistPrefs()
    inGame.value = true
    game.value.code = joinCode.value.toUpperCase()
    startTimer()
}
async function createGame() {
    const code = Math.random().toString(36).slice(2, 6).toUpperCase()
    game.value.code = code
    persistPrefs()
    // prepare a fresh randomized set of questions for this new game
    await loadWordsAndPrepareQuestions()
    inGame.value = true
    // start timer for the first question
    startTimer()
    // automatically read the first question aloud for the host
    try { await speakCurrentQuestion() } catch (e) { console.warn('Auto-TTS failed:', e) }
}
function startGame() { inGame.value = true; startTimer() }
function leaveGame() { inGame.value = false; selected.value = null; showResult.value = false; stopTimer(); remaining.value = perQuestionTime.value }

function selectAnswer(i) {
    if (showResult.value) return
    selected.value = i
}

function nextOrReveal() {
    if (!showResult.value) {
        showResult.value = true
        stopTimer()
        handleReveal()
    } else {
        if (currentIndex.value < questions.value.length - 1) {
            currentIndex.value++
            selected.value = null
            showResult.value = false
            remaining.value = perQuestionTime.value
            startTimer()
        } else {
            // all questions have been answered and the last answer was revealed
            // show finish modal; user will confirm to leave
            handleReveal()
            showFinishModal.value = true
        }
    }
}

function prevQuestion() {
    if (currentIndex.value > 0) {
        currentIndex.value--
        selected.value = null
        showResult.value = false
        remaining.value = perQuestionTime.value
        startTimer()
    }
}

function startTimer() {
    stopTimer()
    remaining.value = perQuestionTime.value
    timerInterval = setInterval(() => {
        remaining.value = Math.max(0, remaining.value - 1)
        if (remaining.value === 0) {
            clearInterval(timerInterval)
            // auto reveal when time's up
            showResult.value = true
            handleReveal()
            // if this was the last question, give a short delay then return to lobby
            if (currentIndex.value >= questions.value.length - 1) {
                setTimeout(() => {
                    // ensure UI shows the revealed answer briefly before leaving
                    // show finish modal instead of leaving directly
                    showFinishModal.value = true
                }, 1500)
            }
        }
    }, 1000)
}

function cancelFinish() {
    showFinishModal.value = false
}

function confirmFinish() {
    showFinishModal.value = false
    // call leaveGame to reset state and go back to lobby
    try { leaveGame() } catch (e) { console.warn('leaveGame failed', e) }
}

function closeReveal() {
    showRevealModal.value = false
    // move to next question or show finish modal if last
    if (currentIndex.value < questions.value.length - 1) {
        currentIndex.value++
        selected.value = null
        showResult.value = false
        remaining.value = perQuestionTime.value
        startTimer()
    } else {
        // show finish modal
        showFinishModal.value = true
    }
}

// Firestore: load Easy_words collection and prepare questions
async function loadWordsAndPrepareQuestions() {
    try {
    // choose collection by difficulty selection
    const collectionName = (difficulty.value === 'Medium') ? 'Medium_words' : (difficulty.value === 'Hard') ? 'Hard_words' : 'Easy_words'
    const col = collection(db, collectionName)
        const snap = await getDocs(col)
        const words = []
        snap.forEach(d => {
            const data = d.data()
            if (!data) return
            // Apply simple filtering if document contains difficulty/category fields
            if (difficulty.value && data.difficulty && String(data.difficulty) !== String(difficulty.value)) return
            if (category.value && category.value !== 'All' && data.category && String(data.category) !== String(category.value)) return
            if (data.word) words.push(String(data.word))
        })
        // remove duplicates and shuffle
        const unique = Array.from(new Set(words))
        shuffle(unique)
        allWords.value = unique

        // Build a sequence of questions that won't repeat the first words
        // We'll create up to N questions or as many unique words as available
        const maxQuestions = Math.min(20, unique.length)
        const qlist = []
        const used = new Set()
        for (let i = 0; i < maxQuestions; i++) {
            // pick a word not used yet
            const candidate = unique.find(w => !used.has(w))
            if (!candidate) break
            used.add(candidate)
            // build choices: include candidate + 3 other random distinct words
            const others = unique.filter(w => w !== candidate)
            shuffle(others)
            const choices = [candidate, ...others.slice(0, Math.min(3, others.length))]
            shuffle(choices)
            const correctIndex = choices.indexOf(candidate)
            qlist.push({ text: candidate, choices, correctIndex })
        }
        questions.value = qlist
        // reset indexes
        currentIndex.value = 0
        selected.value = null
        showResult.value = false
        points.value = 0
        scoredQuestions.clear()
        pickRandomPrompt()
    } catch (err) {
        console.error('Failed to load words:', err)
        // fallback: keep existing sample questions if Firestore fails
        if (questions.value.length === 0) {
            questions.value = [
                { text: 'Which color mixes to make purple?', choices: ['Red + Blue', 'Red + Green', 'Blue + Yellow', 'Red + Yellow'], correctIndex: 0 },
                { text: 'What is 2 + 2?', choices: ['3', '4', '5', '22'], correctIndex: 1 },
            ]
        }
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
}

// load words on mount
onMounted(() => {
    loadWordsAndPrepareQuestions()
    // also load category options for the initial difficulty
    loadCategoriesForDifficulty()
})

function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
}

// Keyboard shortcuts: 1-4 select, arrows navigate, Space/Enter reveal/next

function onKey(e) {
    if (!inGame.value) return
    const key = e.key
    if (key >= '1' && key <= '4') {
        const idx = Number(key) - 1
        selectAnswer(idx)
    } else if (key === 'ArrowRight') {
        nextOrReveal()
    } else if (key === 'ArrowLeft') {
        prevQuestion()
    } else if (key === ' ' || key === 'Enter') {
        e.preventDefault()
        nextOrReveal()
    }
}

onMounted(() => {
    window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    stopTimer()
})

// Text-to-Speech: try Google Cloud TTS REST using VITE_GOOGLE_TTS_KEY, fallback to Web Speech API
async function synthesizeWithGoogle(text) {
    const key = import.meta.env.VITE_GOOGLE_TTS_KEY
    if (!key) throw new Error('No Google TTS key in env')
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`
    const body = {
        input: { text },
            // Use Chirp3 HD voice by default (per request). Allow overrides via env vars.
            // The docs expect languageCode and name keys for the voice object.
            voice: {
                languageCode: import.meta.env.VITE_TTS_LANGUAGE || 'en-US',
                name: import.meta.env.VITE_TTS_VOICE || 'en-us-Chirp3-HD-Leda'
            },
        audioConfig: { audioEncoding: 'MP3' }
    }
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) {
        const txt = await res.text()
        throw new Error(`TTS request failed: ${res.status} ${txt}`)
    }
    const data = await res.json()
    return data.audioContent // base64
}

let currentAudio = null
async function playBase64Audio(base64, mime = 'audio/mpeg') {
    stopAnySpeech()
    const byteString = atob(base64)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
    const blob = new Blob([ab], { type: mime })
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    currentAudio = audio
    isSpeaking.value = true
    audio.play()
    audio.onended = () => { isSpeaking.value = false; URL.revokeObjectURL(url); currentAudio = null }
}

function stopAnySpeech() {
    // stop Web Speech API
    if ('speechSynthesis' in window) {
        try { speechSynthesis.cancel() } catch (e) { /* ignore */ }
    }
    // stop any audio element
    if (currentAudio) {
        currentAudio.pause()
        try { currentAudio.currentTime = 0 } catch (e) {}
        URL.revokeObjectURL(currentAudio.src)
        currentAudio = null
    }
    isSpeaking.value = false
}

async function speakCurrentQuestion() {
    // Speak the chosen (hidden) word aloud
    const text = currentQuestion.value?.text || ''
    // prefer Google TTS if key configured
    try {
        if (import.meta.env.VITE_GOOGLE_TTS_KEY) {
            const b64 = await synthesizeWithGoogle(text)
            await playBase64Audio(b64)
            return
        }
    } catch (err) {
        console.warn('Google TTS failed, falling back to Web Speech API:', err)
    }

    // Fallback: Web Speech API
    if ('speechSynthesis' in window) {
        stopAnySpeech()
        isSpeaking.value = true
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'en-US'
        u.onend = () => { isSpeaking.value = false }
        speechSynthesis.speak(u)
    } else {
        alert('Text-to-Speech is not available in this browser')
    }
}

// Auto-read when question appears
watch(currentIndex, (newIdx, oldIdx) => {
    // speak when the question changes
    if (inGame.value) {
        // small delay to ensure UI settled
        pickRandomPrompt()
        setTimeout(() => speakCurrentQuestion(), 150)
    }
})
</script>

<style scoped>
.quiz-page { padding: 2rem; display: flex; justify-content: center; }
.lobby-card { width: 520px; background: white; border-radius: 16px; padding: 1.25rem; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 3px solid #FFD700 }
.lobby-header h2 { margin: 0; font-size: 1.6rem }
.muted { color: #666; margin-top: 0.25rem }
.label { display:block; margin-top: 1rem; font-weight:700 }
.input { width:100%; padding:0.65rem; border-radius:10px; border:2px solid #f0f0f0; margin-top:0.4rem }
.lobby-actions { margin-top:1rem; display:flex; gap:0.75rem }
.host-controls { margin-top:1rem; color:#444 }
.game { width: min(880px, 96vw) }
.game-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem }
.question-card { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a8edea 100%); padding:1.25rem; border-radius:16px; color:white; box-shadow:0 20px 40px rgba(0,0,0,0.12); }
.question-text { margin: 0.5rem 0 1rem }
.answers-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem }
.answer-tile { display:flex; align-items:center; gap:0.75rem; padding:0.9rem; border-radius:12px; background:rgba(255,255,255,0.12); color:white; border:none; cursor:pointer; font-weight:700 }
.answer-tile .choice-letter { background:rgba(255,255,255,0.18); padding:0.25rem 0.5rem; border-radius:8px }
.answer-tile.selected { outline: 3px solid rgba(255,255,255,0.3) }
.answer-tile.correct { background: rgba(76, 175, 80, 0.85) }
.answer-tile.wrong { background: rgba(244, 67, 54, 0.85) }
.answer-tile.shake { animation: shake 0.6s ease }
.score-pop { position: fixed; right: 20px; top: 84px; z-index:80; padding:0.5rem 0.8rem; border-radius:10px; font-weight:800; transform-origin:center; }
.score-pop.plus { background: linear-gradient(135deg,#FF6B9D,#C44569); color:white; animation: pop 0.9s ease }
.score-pop.wrong { background: rgba(0,0,0,0.8); color:#fff; animation: popwrong 0.9s ease }

@keyframes pop {
    0% { transform: scale(0.2); opacity: 0 }
    60% { transform: scale(1.05); opacity: 1 }
    100% { transform: scale(1); opacity: 1 }
}

@keyframes popwrong {
    0% { transform: translateY(-10px) scale(0.8); opacity:0 }
    50% { transform: translateY(0) scale(1.03); opacity:1 }
    100% { transform: translateY(0) scale(1); opacity:1 }
}

@keyframes shake {
    0% { transform: translateX(0) }
    25% { transform: translateX(-6px) }
    50% { transform: translateX(6px) }
    75% { transform: translateX(-4px) }
    100% { transform: translateX(0) }
}
.question-footer { display:flex; justify-content:space-between; margin-top:1rem }
.btn { padding:0.6rem 1rem; border-radius:12px; cursor:pointer }
.btn-primary { background: linear-gradient(135deg,#FF6B9D,#C44569); color:white; border:none; font-weight:800 }
.btn-ghost { background:white; color:#C44569; border:2px solid #fff }

@media (max-width:640px) {
    .lobby-card { width: 100%; padding: 0.9rem }
    .answers-grid { grid-template-columns: 1fr }
}

/* Finish modal styles */
.modal-backdrop { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.45); z-index: 60 }
.finish-card { background: white; color: #222; padding: 1.25rem; border-radius: 12px; width: 420px; box-shadow: 0 24px 48px rgba(0,0,0,0.16); text-align:center }
.finish-card h3 { margin: 0 0 0.5rem; font-size:1.25rem }
.finish-actions { display:flex; justify-content:space-between; gap:0.75rem; margin-top:1rem }
.finish-card .btn-ghost { background: transparent; border:2px solid #ddd; color:#333 }
.finish-card .btn-primary { flex:1 }

/* Lobby title styles */
.lobby-title { font-size: 2rem; margin: 0 0 0.25rem; font-weight: 800; color: #222 }
.lobby-desc { margin: 0 0 1rem; color: #444 }
</style>