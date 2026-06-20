<script setup>
import { ref, computed } from "vue";
import { categories, questionMap } from "./data/questions.js";
import { store, recordAnswer, isBookmarked, toggleBookmark, resetAll } from "./store.js";

const BLOG_URL = "https://kc-notes.com";

const view = ref("home");
const session = ref([]);
const sessionTitle = ref("");
const idx = ref(0);
const chosen = ref(null);
const revealed = ref(false);
const sessionLog = ref([]);

const current = computed(() => session.value[idx.value]);
const totalQ = computed(() => Object.keys(questionMap).length);
const answeredIds = computed(() => Object.keys(store.answers));
const answeredCount = computed(() => answeredIds.value.length);
const correctCount = computed(() => answeredIds.value.filter((id) => store.answers[id]?.correct).length);
const overallRate = computed(() =>
  answeredCount.value ? Math.round((correctCount.value / answeredCount.value) * 100) : 0,
);
const incorrectQ = computed(() =>
  answeredIds.value.filter((id) => !store.answers[id]?.correct).map((id) => questionMap[id]).filter(Boolean),
);
const bookmarkQ = computed(() => store.bookmarks.map((id) => questionMap[id]).filter(Boolean));
const sessionCorrect = computed(() => sessionLog.value.filter(Boolean).length);

function catStat(cat) {
  const ids = cat.questions.map((q) => q.id);
  const ans = ids.filter((id) => store.answers[id]);
  const cor = ans.filter((id) => store.answers[id]?.correct);
  return { answered: ans.length, total: ids.length, correct: cor.length };
}

function start(title, questions) {
  if (!questions.length) return;
  session.value = questions;
  sessionTitle.value = title;
  idx.value = 0;
  chosen.value = null;
  revealed.value = false;
  sessionLog.value = [];
  view.value = "quiz";
}

function choose(i) {
  if (revealed.value) return;
  chosen.value = i;
  revealed.value = true;
  const q = current.value;
  const ok = i === q.answer;
  recordAnswer(q.id, i, ok);
  sessionLog.value.push(ok);
}

function next() {
  if (idx.value + 1 >= session.value.length) view.value = "result";
  else {
    idx.value++;
    chosen.value = null;
    revealed.value = false;
  }
}

function choiceClass(i) {
  if (!revealed.value) return "";
  if (i === current.value.answer) return "correct";
  if (i === chosen.value) return "wrong";
  return "";
}
</script>

<template>
  <header class="topbar">
    <div class="wrap bar">
      <strong class="brand">KCのノート｜株クイズ</strong>
      <a class="bloglink" :href="BLOG_URL">解説ブログへ →</a>
    </div>
  </header>

  <main class="wrap">
    <section v-if="view === 'home'">
      <div class="hero">
        <h1>株式投資クイズ</h1>
        <p>4択・◯×で学ぶ。登録不要・無料。間違えた問題はあとで復習できます。</p>
        <div class="stat">
          <span>回答 {{ answeredCount }}/{{ totalQ }}</span>
          <span>正答率 <b>{{ overallRate }}%</b></span>
        </div>
      </div>

      <div class="actions">
        <button class="btn" :disabled="!incorrectQ.length" @click="start('復習モード', incorrectQ)">
          復習モード（間違い {{ incorrectQ.length }}）
        </button>
        <button class="btn ghost" :disabled="!bookmarkQ.length" @click="start('ブックマーク', bookmarkQ)">
          ★ブックマーク（{{ bookmarkQ.length }}）
        </button>
      </div>

      <h2>カテゴリを選ぶ</h2>
      <div class="cards">
        <button v-for="cat in categories" :key="cat.id" class="card" @click="start(cat.name, cat.questions)">
          <div class="card-name">{{ cat.name }}</div>
          <div class="card-desc">{{ cat.desc }}</div>
          <div class="bar-bg">
            <div class="bar-fill" :style="{ width: (catStat(cat).answered / catStat(cat).total) * 100 + '%' }"></div>
          </div>
          <div class="card-meta">
            {{ catStat(cat).answered }}/{{ catStat(cat).total }} 問<span v-if="catStat(cat).answered"> ・正答 {{ catStat(cat).correct }}</span>
          </div>
        </button>
      </div>

      <p class="reset"><button class="link" @click="resetAll()">学習データをリセット</button></p>
    </section>

    <section v-else-if="view === 'quiz'" class="quiz">
      <div class="quiz-head">
        <button class="link" @click="view = 'home'">← 戻る</button>
        <span>{{ sessionTitle }}（{{ idx + 1 }}/{{ session.length }}）</span>
        <button class="star" :class="{ on: isBookmarked(current.id) }" @click="toggleBookmark(current.id)">★</button>
      </div>
      <div class="qcard">
        <p class="qtext">{{ current.text }}</p>
        <button
          v-for="(c, i) in current.choices"
          :key="i"
          class="choice"
          :class="choiceClass(i)"
          :disabled="revealed"
          @click="choose(i)"
        >
          {{ c }}
        </button>
        <div v-if="revealed" class="feedback">
          <p :class="chosen === current.answer ? 'ok' : 'ng'">
            {{ chosen === current.answer ? "正解！" : "不正解" }}
          </p>
          <p class="exp">{{ current.explanation }}</p>
          <button class="btn" @click="next()">{{ idx + 1 >= session.length ? "結果を見る" : "次の問題へ" }}</button>
        </div>
      </div>
    </section>

    <section v-else-if="view === 'result'" class="result">
      <h1>結果</h1>
      <p class="score">{{ sessionTitle }}：{{ sessionCorrect }} / {{ session.length }} 正解</p>
      <div class="actions">
        <button class="btn" @click="start(sessionTitle, session)">もう一度</button>
        <button class="btn ghost" @click="view = 'home'">トップへ</button>
      </div>
    </section>
  </main>

  <footer class="foot wrap">
    <p>※本クイズは株式投資の基礎を学ぶ教育目的のもので、特定銘柄の売買を推奨するものではありません。投資判断はご自身の責任で。</p>
    <p><a :href="BLOG_URL">KCのノート（相場解説ブログ）</a></p>
  </footer>
</template>
