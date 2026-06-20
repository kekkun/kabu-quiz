// 進捗・ブックマークを LocalStorage に保存する簡易ストア(登録不要・端末ごと匿名)。
import { reactive, watch } from "vue";

const KEY = "kabu-quiz-v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

const saved = load();

export const store = reactive({
  answers: saved.answers || {}, // qid -> { chosen, correct }
  bookmarks: saved.bookmarks || [], // [qid]
});

watch(
  store,
  () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ answers: store.answers, bookmarks: store.bookmarks }),
    );
  },
  { deep: true },
);

export function recordAnswer(qid, chosen, correct) {
  store.answers[qid] = { chosen, correct };
}

export function isBookmarked(qid) {
  return store.bookmarks.includes(qid);
}

export function toggleBookmark(qid) {
  const i = store.bookmarks.indexOf(qid);
  if (i >= 0) store.bookmarks.splice(i, 1);
  else store.bookmarks.push(qid);
}

export function resetAll() {
  store.answers = {};
  store.bookmarks = [];
}
