// =====================================================================
// 編集ゾーン：設定と問題データ（問題を追加・修正するときはここだけを編集）
// =====================================================================

// アプリの名前（画面左上に表示）
const APP_TITLE = "Grammar Book 演習";

// 学習記録の送信先（Google Apps Script のウェブアプリ URL）。空 "" にすると記録は送らない
const LOG_URL = "https://script.google.com/macros/s/AKfycbzmgGcLSJc50ijxHDKUCTmUPB8dhkbjAKqpgby6tvqltto-PMfC2qTDAHjoYE36-NHI/exec";

// 最初に選べる問題数（範囲の問題数より多いものは表示しない。「全問」は自動で追加）
const COUNT_OPTIONS = [10, 20, 30];

// 選択肢に表示するダミーの数（各問の dummies の中から，出題のたびにランダムに選ぶ）
const DUMMY_COUNT = 2;

// 指示文（問題の inst，なければ type で選ばれる。レッスンごとに inst で上書きできる）
const INSTRUCTIONS = {
  form:         "日本語に合うように，（ ）に入る語句の組み合わせを選びなさい。",
  formPhrase:   "日本語に合うように，下線部に入る語句を選びなさい。",
  translate:    "次の英文を日本語にするとき，（ ）に入る語句を選びなさい。",
  blanks:       "日本語に合うように，（　）に入る語を選びなさい。動詞は枠内の語群から選ぶこと。",
  order:        "日本語，または【状況】に合うように，語句を並べかえなさい。",
  orderMeaning: "意味の通る英文になるように，語句を並べかえなさい。"
};

// ---------------------------------------------------------------------
// 問題データの書き方
//   LESSONS.push({ id: "9-1", title: "受動態", inst: {…}, questions: [ … ] });
//     id     … レッスン番号（「Lesson 9-1」の「9-1」の部分）。前半は -1，後半は -2
//     title  … レッスン名
//     inst   … （省略可）このレッスンだけの指示文。{ 名前: "指示文" } と書き，問題の inst に名前を指定する
//
//   各問題の項目
//     src    … 教材の問題番号（例 "1 ⑴ a"）
//     type   … "form"（語句の組み合わせを3択）／ "order"（並べかえ）／ "blanks"（空所ごとに選択）
//     ja     … 日本語の問題文や【状況】（英文和訳の問題では英文）
//     verb   … ［ ］内に示す語句
//     words  … 語群 { box: 枠内に表示する文字, choices: 語群から選ぶ空所の選択肢（blanks のみ） }
//     template … 問題文。{} が空所
//     answer / dummies … 正答と，ダミーの候補（候補を4つ。毎回 DUMMY_COUNT 個をランダムに表示）
//     before / after / chunks … 並べかえの前後の文と，並べかえる語句（answer が正しい順番）
//     extra  … 並べかえで使わない語句（形を選ばせる問題で，まちがいの形を入れる）
//     blanks … 空所ごとの { answer, dummies }。語群から選ぶ空所は { answer, verb: true }
//     trans  … 答え合わせ後に表示する訳，note … 答え合わせ後に表示する解説（\n で改行）
//   文頭にくる語は小文字で書く（表示のときに自動で大文字にする）
// ---------------------------------------------------------------------

const LESSONS = [];

// ===== Lesson 1　時制①（現在形・現在進行形） =====
const W1_1 = { box: "like / belong / live / look / understand" };
const W1_2 = { box: "leave / own / be / speak / rise / water" };
const W1_5 = { box: "swim / look / live / get / complain / enjoy / talk" };

LESSONS.push({ id: "1-1", title: "時制①（現在形・現在進行形）",
  inst: {
    box1: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語句を選びなさい。",
    box2: "日本語に合うように，枠内の動詞を1回ずつ使って現在を表す英文を完成させるとき，（ ）に入る語を選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "box1", words: W1_1,
      ja: "姉は東京でひとり暮らしをしている。",
      template: "My sister {} alone in Tokyo.",
      answer: ["lives"],
      dummies: [["live"], ["is live"], ["lived"], ["looks"]],
      note: "今の習慣や状態は現在形で表す。主語 My sister は3人称単数（I・you 以外の1人・1つ）なので，動詞に s をつけて lives にする。\nis live のように be動詞と動詞の原形を並べる形はない。" },

    { src: "1 ⑵", type: "form", inst: "box1", words: W1_1,
      ja: "彼は私の気持ちをあまりよく理解していない。",
      template: "He {} {} my feelings very well.",
      answer: ["doesn’t", "understand"],
      dummies: [["don’t", "understand"], ["doesn’t", "understands"], ["isn’t", "understand"], ["doesn’t", "like"]],
      note: "一般動詞の現在の否定文は〈do not / does not＋動詞の原形〉。主語 He は3人称単数なので doesn’t（= does not）を使う。\ndoesn’t のあとは原形なので，understands は誤り。" },

    { src: "1 ⑶", type: "form", inst: "box1", words: W1_1,
      ja: "ブライアンは舞台の上では別人のように見える。",
      template: "Bryan {} like a different person on stage.",
      answer: ["looks"],
      dummies: [["look"], ["is look"], ["looking"], ["belongs"]],
      note: "look like A で「A のように見える」。主語 Bryan は3人称単数なので looks にする。\nlike のあとには名詞（a different person）が続く。" },

    { src: "1 ⑷", type: "form", inst: "box1", words: W1_1,
      ja: "辛いものは好きですか。",
      template: "{} you {} spicy food?",
      answer: ["do", "like"],
      dummies: [["are", "like"], ["do", "likes"], ["does", "like"], ["are", "liking"]],
      note: "一般動詞の疑問文は〈Do / Does＋主語＋動詞の原形 ～?〉。主語が you なので Do を使う。\nlike（好きだ）は状態を表す動詞なので，ふつう進行形にしない。" },

    { src: "1 ⑸", type: "form", inst: "box1", words: W1_1,
      ja: "これらすべての本はエマのものだ。",
      template: "All these books {} to Emma.",
      answer: ["belong"],
      dummies: [["belongs"], ["are belong"], ["belonging"], ["look"]],
      note: "belong to A で「A のものである，A に所属している」。主語 All these books は複数なので，s をつけない belong。\nbelong は状態を表す動詞なので，進行形にしない。" },

    { src: "2 ⑴", type: "form", inst: "box2", words: W1_2,
      ja: "「水やりをする」",
      template: "Sam {} the plants in his garden every morning.",
      answer: ["waters"],
      dummies: [["water"], ["watered"], ["is water"], ["speaks"]],
      trans: "サムは毎朝，庭の草木に水をやる。",
      note: "every morning（毎朝）のようにくり返す習慣は現在形で表す。water は動詞だと「～に水をやる」。主語 Sam は3人称単数なので waters。" },

    { src: "2 ⑵", type: "form", inst: "box2", words: W1_2,
      ja: "「ポルトガル語を話す」",
      template: "Brazilians {} Portuguese.",
      answer: ["speak"],
      dummies: [["speaks"], ["spoke"], ["are speak"], ["own"]],
      trans: "ブラジル人はポルトガル語を話す。",
      note: "いつもそうである事実は現在形で表す。主語 Brazilians（ブラジル人）は複数なので，s をつけない speak。" },

    { src: "2 ⑶", type: "form", inst: "box2", words: W1_2,
      ja: "「本屋を所有している」",
      template: "My aunt {} a small bookstore.",
      answer: ["owns"],
      dummies: [["own"], ["is owning"], ["owned"], ["leaves"]],
      trans: "おばは小さな本屋を所有している。",
      note: "own は「（法的に）所有している」という状態を表す動詞なので，「～している」でも進行形にせず現在形で表す。主語 My aunt は3人称単数なので owns。" },

    { src: "2 ⑷", type: "form", inst: "box2", words: W1_2,
      ja: "「学校へ行く（出発する）」",
      template: "What time do you usually {} for school?",
      answer: ["leave"],
      dummies: [["leaves"], ["leaving"], ["left"], ["rise"]],
      trans: "あなたはふだん何時に学校へ行きますか。",
      note: "leave for A で「A に向けて出発する」。do you のあとなので動詞は原形 leave。usually（ふだん）は習慣を表す。" },

    { src: "2 ⑸", type: "form", inst: "box2", words: W1_2,
      ja: "「東から昇る」",
      template: "The sun {} in the east.",
      answer: ["rises"],
      dummies: [["rise"], ["rose"], ["is rise"], ["raises"]],
      trans: "太陽は東から昇る。",
      note: "いつも変わらない事実は現在形で表す。主語 The sun は3人称単数なので rises。\nraise は「～を上げる」という別の動詞なので，ここでは使えない。in the east は「東の方角に」。" },

    { src: "2 ⑹", type: "form", inst: "box2", words: W1_2,
      ja: "「時は金なり」（ことわざ）",
      template: "Time {} money.",
      answer: ["is"],
      dummies: [["are"], ["be"], ["was"], ["has"]],
      trans: "時は金なり。",
      note: "ことわざのように，いつでも当てはまることは現在形で表す。主語 Time は単数なので be動詞は is。" },

    { src: "3 ⑴", type: "order",
      ja: "リアムはよくネットで服を買う。",
      before: "", after: "online.",
      chunks: ["buys", "often", "Liam", "clothes"],
      answer: ["Liam", "often", "buys", "clothes"],
      note: "often（よく）のように「どのくらいの頻度か」を表す語は，一般動詞の前に置く。Liam often buys clothes で「リアムはよく服を買う」。\nonline は「ネットで」という意味の副詞。" },

    { src: "3 ⑵", type: "order",
      ja: "だれもその事故の原因を知らない。",
      before: "", after: "the accident.",
      chunks: ["knows", "the", "of", "nobody", "cause"],
      answer: ["nobody", "knows", "the", "cause", "of"],
      note: "nobody（だれも～ない）が主語。nobody は単数扱いなので knows と s がつく。\nthe cause of the accident で「その事故の原因」。" },

    { src: "3 ⑶", type: "order",
      ja: "マリとサユリは双子で，お互いに似ている。",
      before: "Mari and", after: "each other.",
      chunks: ["twins", "resemble", "Sayuri", "are", "and"],
      answer: ["Sayuri", "are", "twins", "and", "resemble"],
      note: "Mari and Sayuri（マリとサユリ）が主語で複数なので are。are twins（双子だ）と resemble each other（お互いに似ている）を and でつなぐ。\nresemble は「～に似ている」で，あとに to などの前置詞は入れない。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】いつもはバスで学校に行くケイトですが，違う日もあるようです。",
      before: "Kate", after: "bicycle.",
      chunks: ["school", "goes", "sometimes", "by", "to"],
      answer: ["sometimes", "goes", "to", "school", "by"],
      trans: "ケイトはときどき，自転車で学校に行く。",
      note: "sometimes（ときどき）は頻度を表す語なので，一般動詞 goes の前に置く。go to school は「学校に行く」，by bicycle は「自転車で」。" }
  ]
});

LESSONS.push({ id: "1-2", title: "時制①（現在形・現在進行形）",
  inst: {
    box5: "枠内の動詞を1回ずつ使って現在進行形の文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "box5", words: W1_5,
      template: "Mike {} {} on the phone now.",
      answer: ["is", "talking"],
      dummies: [["are", "talking"], ["is", "talk"], ["was", "talking"], ["is", "talks"]],
      trans: "マイクは今，電話で話している。",
      note: "今まさにしていることは，現在進行形〈am / are / is＋動詞の -ing 形〉で表す。主語 Mike は単数なので is talking。\nnow（今）が進行形の手がかりになる。" },

    { src: "5 ⑵", type: "form", inst: "box5", words: W1_5,
      template: "A few children {} {} in the pool.",
      answer: ["are", "swimming"],
      dummies: [["is", "swimming"], ["are", "swiming"], ["are", "swim"], ["were", "swimming"]],
      trans: "数人の子どもたちがプールで泳いでいる。",
      note: "主語 A few children（数人の子どもたち）は複数なので are。swim の -ing 形は m を重ねて swimming。\na few は「少数の」で，数えられる名詞の複数形につく。" },

    { src: "5 ⑶", type: "form", inst: "box5", words: W1_5,
      template: "We {} {} the school festival.",
      answer: ["are", "enjoying"],
      dummies: [["is", "enjoying"], ["are", "enjoy"], ["am", "enjoying"], ["were", "enjoy"]],
      trans: "私たちは文化祭を楽しんでいる。",
      note: "今していることなので現在進行形。主語 We は複数なので are enjoying。\nare enjoy のように，be動詞のあとに動詞の原形を置く形はない。" },

    { src: "5 ⑷", type: "form", inst: "box5", words: W1_5,
      template: "I {} {} for my glasses. Where are they?",
      answer: ["am", "looking"],
      dummies: [["is", "looking"], ["am", "look"], ["are", "looking"], ["am", "living"]],
      trans: "めがねを探している。どこだろう。",
      note: "look for A で「A を探す」。今探している最中なので現在進行形。主語が I なので am looking。" },

    { src: "5 ⑸", type: "form", inst: "box5", words: W1_5,
      template: "The sky {} {} dark.",
      answer: ["is", "getting"],
      dummies: [["is", "geting"], ["are", "getting"], ["is", "get"], ["was", "get"]],
      trans: "空が暗くなってきている。",
      note: "現在進行形は「（だんだん）～しつつある」という変化の途中も表す。get dark は「暗くなる」。get の -ing 形は t を重ねて getting。" },

    { src: "5 ⑹", type: "form", inst: "box5", words: W1_5,
      template: "She {} {} in Singapore to work on a large-scale project.",
      answer: ["is", "living"],
      dummies: [["is", "liveing"], ["are", "living"], ["is", "live"], ["was", "live"]],
      trans: "彼女は大規模なプロジェクトに取り組むためにシンガポールに住んでいる。",
      note: "live は状態を表す動詞だが，「（一時的に）住んでいる」ときは現在進行形にできる。live の -ing 形は e をとって living。\nwork on A は「A に取り組む」。" },

    { src: "5 ⑺", type: "form", inst: "box5", words: W1_5,
      template: "Ms. Brown {} always {} about her hard job.",
      answer: ["is", "complaining"],
      dummies: [["is", "complain"], ["are", "complaining"], ["does", "complaining"], ["is", "complained"]],
      trans: "ブラウンさんはいつもたいへんな仕事の文句ばかり言っている。",
      note: "〈be動詞＋always＋-ing 形〉で「いつも～してばかりいる」という，話し手の不満の気持ちを表す。always は be動詞と -ing 形の間に置く。\ncomplain about A は「A について不平を言う」。" },

    { src: "6 ⑴", type: "form", inst: "translate",
      ja: "I’m not playing a game. I’m studying.",
      template: "私は（{}）。私は（{}）。",
      answer: ["ゲームで遊んでいるのではない", "勉強している"],
      dummies: [["ゲームで遊ばない", "勉強する"], ["ゲームで遊んでいなかった", "勉強していた"], ["ゲームで遊ぶつもりはない", "勉強するつもりだ"], ["ゲームで遊んだことがない", "勉強したことがある"]],
      note: "I’m not playing ～ は現在進行形の否定文で「（今）～しているのではない」。I’m studying は「（今）勉強している」。\n現在進行形は「今していること」を表すので，「～する」（習慣）や「～していた」（過去）にはならない。" },

    { src: "6 ⑵", type: "form", inst: "translate",
      ja: "Spring is over, and summer is beginning.",
      template: "春が終わって，（{}）。",
      answer: ["夏が始まりかけている"],
      dummies: [["夏が始まった"], ["夏が始まるだろう"], ["夏は毎年始まる"], ["夏が始まっていた"]],
      note: "summer is beginning は現在進行形で，「始まりかけている」「始まりつつある」という変化の途中を表す。\n「始まった」なら summer has begun，「始まるだろう」なら summer will begin になる。" },

    { src: "6 ⑶", type: "form", inst: "translate",
      ja: "Aki is moving to Hokkaido this spring with her family.",
      template: "アキはこの春，家族とともに（{}）。",
      answer: ["北海道へ引っ越す予定だ"],
      dummies: [["北海道へ引っ越している最中だ"], ["北海道へ引っ越した"], ["北海道に住んでいる"], ["北海道へ引っ越していた"]],
      note: "現在進行形は，this spring（この春）のような未来を表す語とともに使うと，「～する予定だ」という個人的な予定を表す。\n「今引っ越している最中だ」という意味ではないことに注意。" },

    { src: "6 ⑷", type: "form", inst: "translate",
      ja: "The next train arrives at noon.",
      template: "次の電車は（{}）。",
      answer: ["正午に到着する"],
      dummies: [["正午に到着した"], ["正午に到着している"], ["正午に到着していた"], ["正午に到着したことがある"]],
      note: "時刻表などで確定している予定は，未来のことでも現在形で表すことがある。arrives at noon で「正午に到着する」。" },

    { src: "7 ⑴", type: "order",
      ja: "あなたは今，夕食に何を作っていますか。",
      before: "", after: "dinner now?",
      chunks: ["making", "are", "what", "for", "you"],
      answer: ["what", "are", "you", "making", "for"],
      note: "現在進行形の疑問文は〈be動詞＋主語＋-ing 形 ～?〉。「何を」をたずねるので，What を文頭に置いて What are you making ～? とする。\nfor dinner は「夕食に」。" },

    { src: "7 ⑵", type: "order",
      ja: "私はこの夏にオーストラリアを訪問します。",
      before: "", after: "summer.",
      chunks: ["am", "I", "visiting", "this", "Australia"],
      answer: ["I", "am", "visiting", "Australia", "this"],
      note: "this summer（この夏）のような未来を表す語とともに現在進行形を使うと，「～する予定だ」という個人的な予定を表す。I am visiting Australia this summer で「この夏オーストラリアを訪問する」。" },

    { src: "7 ⑶", type: "order",
      ja: "兄は今，歯を磨いているところです。少しお待ちください。",
      before: "", after: "now. Please wait a few minutes.",
      chunks: ["brushing", "teeth", "my brother", "his", "is"],
      answer: ["my brother", "is", "brushing", "his", "teeth"],
      note: "今している最中のことなので現在進行形。My brother is brushing his teeth で「兄は歯を磨いているところだ」。\nbrush one’s teeth は「歯を磨く」。one’s には主語に合わせて his が入る。" },

    { src: "7 ⑷", type: "order",
      ja: "彼女はこの冬，料理教室に通っています。",
      before: "She", after: "winter.",
      chunks: ["classes", "cooking", "this", "taking", "is"],
      answer: ["is", "taking", "cooking", "classes", "this"],
      note: "現在進行形は「（ある期間）～している」という，しばらくの間続いていることも表す。is taking cooking classes で「料理教室に通っている」。\ntake classes は「授業を受ける」。" },

    { src: "7 ⑸", type: "order",
      ja: "【状況】アメリカ人の友人が，見たことのないアプリを使っているので聞いてみると…。",
      before: "", after: "the U.S.",
      chunks: ["popular", "becoming", "in", "this app", "is"],
      answer: ["this app", "is", "becoming", "popular", "in"],
      trans: "このアプリはアメリカで人気が出てきている。",
      note: "現在進行形で「（だんだん）～になりつつある」という変化の途中を表す。is becoming popular で「人気が出てきている」。\nin the U.S. は「アメリカで」。" }
  ]
});

// ===== Lesson 2　時制②（過去形・過去進行形） =====
const W2_1 = { box: "hear / listen / sing / love / have / know" };
const W2_5 = { box: "study / become / plan / talk / come / practice / wear" };

LESSONS.push({ id: "2-1", title: "時制②（過去形・過去進行形）",
  inst: {
    box1: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語句を選びなさい。",
    verb2: "日本語に合うように，［ ］の語を適切な形で使い，必要なら語句を補って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "box1", words: W2_1,
      ja: "その女の子は父親のカレーライスが大好きだった。",
      template: "The girl {} her father’s curry and rice.",
      answer: ["loved"],
      dummies: [["love"], ["loves"], ["was loving"], ["had"]],
      note: "過去のことは過去形で表す。love の過去形は loved。\nlove（大好きだ）は状態を表す動詞なので，ふつう進行形にしない。" },

    { src: "1 ⑵", type: "form", inst: "box1", words: W2_1,
      ja: "少し前に大きな音が聞こえた。",
      template: "I {} a loud noise a little while ago.",
      answer: ["heard"],
      dummies: [["heared"], ["hear"], ["hears"], ["listened"]],
      note: "a little while ago（少し前に）は過去を表すので過去形。hear の過去形は heard（不規則動詞：hear – heard – heard）。\nlisten は「（注意して）聞く」で，listen to A の形で使う。" },

    { src: "1 ⑶", type: "form", inst: "box1", words: W2_1,
      ja: "その家には美しい庭があった。",
      template: "The house {} a beautiful garden.",
      answer: ["had"],
      dummies: [["has"], ["haved"], ["have"], ["was having"]],
      note: "「～があった」は have の過去形 had で表せる（have – had – had）。\nhave が「持っている」という意味のときは状態を表すので，進行形にしない。" },

    { src: "1 ⑷", type: "form", inst: "box1", words: W2_1,
      ja: "彼が私の話を聞いてくれなかったので悲しかった。",
      template: "I was sad because he {} {} to me.",
      answer: ["didn’t", "listen"],
      dummies: [["didn’t", "listened"], ["wasn’t", "listen"], ["doesn’t", "listen"], ["didn’t", "hear"]],
      note: "一般動詞の過去の否定文は〈didn’t（= did not）＋動詞の原形〉。didn’t のあとは原形 listen になる。\nlisten to A は「A（の話）を聞く」。hear のあとに to は続かない。" },

    { src: "1 ⑸", type: "form", inst: "box1", words: W2_1,
      ja: "祖父は歌をたくさん知っていた。それを僕に歌ってくれた。",
      template: "My grandfather {} many songs. He often {} them for me.",
      answer: ["knew", "sang"],
      dummies: [["knowed", "sang"], ["knew", "sung"], ["knows", "sings"], ["know", "sang"]],
      note: "どちらも過去の文。know の過去形は knew（know – knew – known），sing の過去形は sang（sing – sang – sung）。\noften（よく）と過去形を使うと「昔よく～した」を表す。sing A for B は「B に A を歌う」。" },

    { src: "2 ⑴", type: "form", inst: "verb2",
      ja: "私は今朝，6 時に起きた。", verb: "get",
      template: "I {} {} {} six this morning.",
      answer: ["got", "up", "at"],
      dummies: [["get", "up", "at"], ["got", "up", "in"], ["getted", "up", "at"], ["got", "up", "on"]],
      note: "「起きる」は get up。過去の文なので get の過去形 got を使う（get – got – got / gotten）。\n時刻の前には at を置く。at six this morning のように，小さい単位（時刻）→大きい単位（今朝）の順に並べる。" },

    { src: "2 ⑵", type: "form", inst: "verb2",
      ja: "そのバスは私たちの学校の前に止まった。", verb: "stop",
      template: "The bus {} in front {} our school.",
      answer: ["stopped", "of"],
      dummies: [["stoped", "of"], ["stopped", "to"], ["stops", "of"], ["stopping", "of"]],
      note: "stop の過去形は p を重ねて stopped。つづりに注意。\nin front of A で「A の前に」。" },

    { src: "2 ⑶", type: "form", inst: "verb2",
      ja: "昨日の夜，雪は降りましたか。", verb: "snow",
      template: "{} it {} last night?",
      answer: ["did", "snow"],
      dummies: [["was", "snow"], ["did", "snowed"], ["does", "snow"], ["was", "snowed"]],
      note: "一般動詞の過去の疑問文は〈Did＋主語＋動詞の原形 ～?〉。Did のあとは原形 snow。\n天気を表す文では it を主語にする。この snow は「雪が降る」という動詞。" },

    { src: "2 ⑷", type: "form", inst: "verb2",
      ja: "去年，私たちはときどきその川に行った。", verb: "go",
      template: "We {} {} {} the river last year.",
      answer: ["sometimes", "went", "to"],
      dummies: [["went", "sometimes", "to"], ["sometimes", "goed", "to"], ["sometimes", "go", "to"], ["sometimes", "went", "at"]],
      note: "sometimes（ときどき）は一般動詞の前に置く。go の過去形は went（go – went – gone）。\ngo to A で「A に行く」。" },

    { src: "3 ⑴", type: "order",
      ja: "この前の夏，ケイは合宿に参加した。",
      before: "Kei", after: "last summer.",
      chunks: ["part", "the training camp", "took", "in"],
      answer: ["took", "part", "in", "the training camp"],
      note: "take part in A で「A に参加する」。過去の文なので take の過去形 took を使う（take – took – taken）。" },

    { src: "3 ⑵", type: "order",
      ja: "中学では何のクラブに所属していましたか。",
      before: "What", after: "in junior high school?",
      chunks: ["did", "to", "you", "club", "belong"],
      answer: ["club", "did", "you", "belong", "to"],
      note: "「何のクラブ」は What club でひとまとまり。そのあとに過去の疑問文〈did＋主語＋動詞の原形〉を続ける。\nbelong to A（A に所属する）の to は文の最後に残る。" },

    { src: "3 ⑶", type: "order",
      ja: "春休みの間，図書館でたくさんの本を読んだ。",
      before: "", after: "during spring vacation.",
      chunks: ["books", "the library", "a lot", "read", "I", "of", "in"],
      answer: ["I", "read", "a lot", "of", "books", "in", "the library"],
      note: "〈主語＋動詞＋目的語〉の順に I read a lot of books とする。read の過去形は read（発音は「レッド」）。\nそのあとに場所（in the library）→時（during spring vacation）の順に並べる。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】学校でたくさん汗をかいたので…。",
      before: "", after: "dinner.",
      chunks: ["a shower", "took", "I", "before"],
      answer: ["I", "took", "a shower", "before"],
      trans: "私は夕食前にシャワーを浴びた。",
      note: "take a shower で「シャワーを浴びる」。過去の文なので took。before dinner は「夕食前に」。" }
  ]
});

LESSONS.push({ id: "2-2", title: "時制②（過去形・過去進行形）",
  inst: {
    box5: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    fill6: "日本語に合うように，（ ）に入る適切な語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "box5", words: W2_5,
      ja: "3 時ごろ，私はピアノの練習をしていた。",
      template: "I {} {} the piano around three o’clock.",
      answer: ["was", "practicing"],
      dummies: [["were", "practicing"], ["was", "practice"], ["am", "practicing"], ["was", "practiceing"]],
      note: "過去のある時点でしている最中だったことは，過去進行形〈was / were＋動詞の -ing 形〉で表す。主語が I なので was practicing。\npractice の -ing 形は e をとって practicing。" },

    { src: "5 ⑵", type: "form", inst: "box5", words: W2_5,
      ja: "そのとき私たちは彼の誕生日パーティーの計画を立てていた。",
      template: "We {} {} his birthday party at that time.",
      answer: ["were", "planning"],
      dummies: [["was", "planning"], ["were", "planing"], ["are", "planning"], ["were", "plan"]],
      note: "at that time（そのとき）にしていた最中なので過去進行形。主語 We は複数なので were。\nplan の -ing 形は n を重ねて planning。" },

    { src: "5 ⑶", type: "form", inst: "box5", words: W2_5,
      ja: "そのころ，その本は日本で人気になりつつあった。",
      template: "The book {} {} popular in Japan at that time.",
      answer: ["was", "becoming"],
      dummies: [["were", "becoming"], ["was", "becomeing"], ["is", "becoming"], ["was", "become"]],
      note: "「～になりつつあった」は，過去に変化の途中だったことなので過去進行形 was becoming で表す。\nbecome の -ing 形は e をとって becoming。" },

    { src: "5 ⑷", type: "form", inst: "box5", words: W2_5,
      ja: "彼女はふだんコンタクトをしているが，昨日はめがねをかけていた。",
      template: "She usually wears contacts, but yesterday she {} {} glasses.",
      answer: ["was", "wearing"],
      dummies: [["is", "wearing"], ["was", "wear"], ["were", "wearing"], ["was", "wore"]],
      note: "wear は「身に着けている」という状態を表すが，「（そのときだけ一時的に）着けていた」ことは過去進行形 was wearing で表せる。\nなお，「身に着ける」という動作は put on で表す。" },

    { src: "5 ⑸", type: "form", inst: "box5", words: W2_5,
      ja: "私は去年の夏には中国語を勉強していた。",
      template: "I {} {} Chinese last summer.",
      answer: ["was", "studying"],
      dummies: [["was", "studing"], ["am", "studying"], ["were", "studying"], ["was", "studyed"]],
      note: "過去のある時期にしていたことなので過去進行形。主語が I なので was studying。\nstudy の -ing 形は y をそのまま残して studying。" },

    { src: "5 ⑹", type: "form", inst: "box5", words: W2_5,
      ja: "あなたがここに来たとき，彼らは何の話をしていましたか。",
      template: "What {} they {} about when you {} here?",
      answer: ["were", "talking", "came"],
      dummies: [["was", "talking", "came"], ["were", "talking", "come"], ["were", "talk", "came"], ["were", "talking", "were coming"]],
      note: "when you came here（あなたがここに来たとき）という過去の時点にしていた最中のことを，過去進行形でたずねる。疑問文は〈疑問詞＋was / were＋主語＋-ing 形 ～?〉の語順。\ncome の過去形は came（come – came – come）。" },

    { src: "6 ⑴", type: "form", inst: "fill6",
      ja: "私の母は昔，銀行で働いていた。",
      template: "My mother {} {} {} at a bank.",
      answer: ["used", "to", "work"],
      dummies: [["use", "to", "work"], ["used", "to", "working"], ["was", "used", "to"], ["used", "for", "work"]],
      note: "〈used to＋動詞の原形〉で「昔は～していた（今はしていない）」という過去の習慣を表す。used to work で「昔は働いていた」。\nto のあとは原形 work。" },

    { src: "6 ⑵", type: "form", inst: "fill6",
      ja: "かつて，この町には大きな公園があった。",
      template: "There {} {} {} a large park in this town.",
      answer: ["used", "to", "be"],
      dummies: [["used", "to", "is"], ["was", "used", "to"], ["use", "to", "be"], ["used", "to", "been"]],
      note: "〈used to＋動詞の原形〉は「昔は～だった（今はちがう）」という過去の状態も表す。There used to be A で「かつて A があった」。\nto のあとは be動詞の原形 be。" },

    { src: "7 ⑴", type: "order",
      ja: "すみません。私はあなたの話を聞いていませんでした。",
      before: "I’m sorry.", after: ".",
      chunks: ["to", "I", "listening", "you", "wasn’t"],
      answer: ["I", "wasn’t", "listening", "to", "you"],
      note: "過去進行形の否定文は〈was / were not＋-ing 形〉。I wasn’t listening to you で「あなたの話を聞いていなかった」。\nlisten to A は「A（の話）を聞く」。" },

    { src: "7 ⑵", type: "order",
      ja: "私は以前，よくゲームをしたが，今はしない。",
      before: "I", after: ", but not now.",
      chunks: ["games", "used", "a lot", "play", "to"],
      answer: ["used", "to", "play", "games", "a lot"],
      note: "〈used to＋動詞の原形〉「昔はよく～したものだ（今はしない）」。used to play games で「昔はよくゲームをした」。\na lot（たくさん）は文の後ろに置く。" },

    { src: "7 ⑶", type: "order",
      ja: "リコには韓国旅行をしている間に出会った。",
      before: "I", after: "in South Korea.",
      chunks: ["Riko", "was", "while", "met", "traveling", "I"],
      answer: ["met", "Riko", "while", "I", "was", "traveling"],
      note: "I met Riko（リコに出会った）のあとに，while I was traveling（旅行している間に）を続ける。while は「～している間に」。\n出会ったのは1回の出来事なので過去形，旅行は続いていたことなので過去進行形。" },

    { src: "7 ⑷", type: "order",
      ja: "彼らはいつもどなり合ってばかりいた。",
      before: "They", after: "each other.",
      chunks: ["at", "always", "were", "shouting"],
      answer: ["were", "always", "shouting", "at"],
      note: "〈was / were＋always＋-ing 形〉で「いつも～してばかりいた」。always は be動詞と -ing 形の間に置く。\nshout at A は「A にどなる」，each other は「お互い」。" },

    { src: "7 ⑸", type: "order",
      ja: "【状況】ショートヘアが気に入っている私。でもかつては…。",
      before: "I", after: ".",
      chunks: ["hair", "to", "long", "have", "used"],
      answer: ["used", "to", "have", "long", "hair"],
      trans: "私はかつてロングヘアだった。",
      note: "〈used to＋動詞の原形〉で「昔は～だった（今はちがう）」という過去の状態を表す。used to have long hair で「かつては髪が長かった」。" }
  ]
});

// ===== Lesson 3　時制③（未来を表す表現） =====
const W3_1 = { box: "get / give / arrive / have / clean" };
const W3_7 = { box: "stay / finish / help / stop / arrive / need" };

LESSONS.push({ id: "3-1", title: "時制③（未来を表す表現）",
  inst: {
    box1: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    verb2: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "box1", words: W3_1,
      ja: "あなたたちは修学旅行ですばらしいときを過ごすだろう。",
      template: "You {} {} a great time on your school trip.",
      answer: ["will", "have"],
      dummies: [["will", "has"], ["are", "have"], ["will", "having"], ["will", "had"]],
      note: "〈will＋動詞の原形〉で「～するだろう」という，話し手が「そうなる」と思っている未来のことを表す。will のあとは必ず原形 have。\nhave a great time は「すばらしい時を過ごす」。" },

    { src: "1 ⑵", type: "form", inst: "box1", words: W3_1,
      ja: "彼女はたぶん次のテストでよい点を取るだろう。",
      template: "She {} probably {} a good score on the next test.",
      answer: ["will", "get"],
      dummies: [["will", "gets"], ["is", "get"], ["will", "got"], ["does", "get"]],
      note: "〈will＋動詞の原形〉「～するだろう」。probably（たぶん）は will のあとに置き，「そうなる」という確信を少し弱める。\n主語が She でも will のあとは原形 get。" },

    { src: "1 ⑶", type: "form", inst: "box1", words: W3_1,
      ja: "私の部屋が散らかっている。あとで自分の部屋を掃除しよう。",
      template: "My room is messy. I {} {} it later.",
      answer: ["will", "clean"],
      dummies: [["will", "cleaning"], ["am", "clean"], ["will", "cleaned"], ["was", "clean"]],
      note: "will は「（今その場で決めて）～しよう」という意志も表す。部屋が散らかっているのを見て，その場で「掃除しよう」と決めている。\nwill のあとは原形 clean。" },

    { src: "1 ⑷", type: "form", inst: "box1", words: W3_1,
      ja: "ケイトはタフだ。彼女はあきらめないだろう。",
      template: "Kate is tough. She {} not {} up.",
      answer: ["will", "give"],
      dummies: [["will", "gives"], ["is", "give"], ["will", "giving"], ["will", "given"]],
      note: "will not（= won’t）で「～しないだろう」。give up は「あきらめる」。\nwill のあとは原形なので gives や giving は誤り。" },

    { src: "1 ⑸", type: "form", inst: "box1", words: W3_1,
      ja: "彼は明日，いつ空港に到着するでしょうか。",
      template: "When {} he {} at the airport tomorrow?",
      answer: ["will", "arrive"],
      dummies: [["will", "arrives"], ["is", "arrive"], ["will", "arriving"], ["does", "arrives"]],
      note: "will の疑問文は〈Will＋主語＋動詞の原形 ～?〉。「いつ」をたずねるので When を前に置いて When will he arrive ～? とする。\narrive at A は「A に到着する」。" },

    { src: "2 ⑴", type: "form", inst: "verb2",
      ja: "私は彼らに本当のことを言うつもりだ。", verb: "tell",
      template: "I’m {} {} {} them the truth.",
      answer: ["going", "to", "tell"],
      dummies: [["going", "to", "telling"], ["going", "for", "tell"], ["go", "to", "tell"], ["going", "to", "told"]],
      note: "〈be going to＋動詞の原形〉で「～するつもりだ」という，前から決めている予定を表す。I’m going to tell で「言うつもりだ」。\nto のあとは原形 tell。tell A B は「A に B を言う」。" },

    { src: "2 ⑵", type: "form", inst: "verb2",
      ja: "彼は私たちと一緒に来るつもりだろうか。", verb: "come",
      template: "{} he {} {} {} with us?",
      answer: ["is", "going", "to", "come"],
      dummies: [["does", "going", "to", "come"], ["is", "going", "to", "coming"], ["is", "go", "to", "come"], ["will", "going", "to", "come"]],
      note: "be going to の疑問文は，be動詞を主語の前に出して〈be動詞＋主語＋going to＋動詞の原形 ～?〉にする。主語が he なので Is he going to come ～?。" },

    { src: "2 ⑶", type: "form", inst: "verb2",
      ja: "私は考えを変えるつもりはありません。", verb: "change",
      template: "{} {} {} to {} my mind.",
      answer: ["I’m", "not", "going", "change"],
      dummies: [["I’m", "going", "not", "change"], ["I", "don’t", "going", "change"], ["I’m", "not", "going", "changing"], ["I’m", "not", "go", "change"]],
      note: "be going to の否定文は，be動詞のあとに not を置いて〈be動詞＋not going to＋動詞の原形〉にする。I’m not going to change で「変えるつもりはない」。\nchange one’s mind は「考えを変える」。" },

    { src: "3 ⑴", type: "order",
      ja: "この花は 2～3 週間もちますよ。",
      before: "", after: "a few weeks.",
      chunks: ["flowers", "last", "for", "will", "these"],
      answer: ["these", "flowers", "will", "last", "for"],
      note: "will で「～するだろう」という未来の見通しを表す。この last は動詞で「もつ，続く」という意味。\nfor a few weeks で「2～3 週間（の間）」。" },

    { src: "3 ⑵", type: "order",
      ja: "あなたは大学で何を学ぶつもりですか。",
      before: "", after: "in college?",
      chunks: ["study", "are", "to", "what", "you", "going"],
      answer: ["what", "are", "you", "going", "to", "study"],
      note: "「何を」をたずねるので What を文頭に置き，be going to の疑問文〈be動詞＋主語＋going to＋動詞の原形〉を続ける。\nWhat are you going to study ～? で「何を学ぶつもりですか」。" },

    { src: "3 ⑶", type: "order",
      ja: "【状況】「先生が探していたよ」と友人が言うので，こう答えました。",
      before: "“I see.", after: "soon.”",
      chunks: ["go", "the teachers’ room", "I’ll", "to"],
      answer: ["I’ll", "go", "to", "the teachers’ room"],
      trans: "「わかった。すぐに職員室に行くよ」",
      note: "その場で決めたことは will で表す。I’ll は I will の短縮形。\n友人に言われてその場で「行こう」と決めているので，be going to ではなく will を使う。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】そのホラー映画を観るように何度もすすめられているのですが…。",
      before: "", after: "the horror movie.",
      chunks: ["not", "watch", "to", "I’m", "going"],
      answer: ["I’m", "not", "going", "to", "watch"],
      trans: "私はそのホラー映画を観るつもりはありません。",
      note: "be going to の否定文〈be動詞＋not going to＋動詞の原形〉で「～するつもりはない」。すでに「観ない」と決めていることを表す。" }
  ]
});

LESSONS.push({ id: "3-2", title: "時制③（未来を表す表現）",
  inst: {
    verb5: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    trans6: "次の英文の日本語訳として適切なものを選びなさい。",
    box7: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語句を選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "verb5",
      ja: "寒くなってきました。今夜は雪が降りそうだ。", verb: "snow",
      template: "It’s getting cold. It’s going {} {} tonight.",
      answer: ["to", "snow"],
      dummies: [["to", "snowing"], ["for", "snow"], ["to", "snows"], ["to", "snowed"]],
      note: "be going to は「（今の様子から見て）～しそうだ」という，兆候があってそうなりそうなことも表す。寒くなってきたことが「雪が降りそう」の手がかり。\nto のあとは原形 snow。" },

    { src: "5 ⑵", type: "form", inst: "verb5",
      ja: "彼らは校門のところで会うことになっている。", verb: "meet",
      template: "They {} {} {} at the school gate.",
      answer: ["will", "be", "meeting"],
      dummies: [["will", "be", "meet"], ["are", "be", "meeting"], ["will", "been", "meeting"], ["will", "is", "meeting"]],
      note: "〈will be＋-ing 形〉は「（成り行きで）～することになっている」という予定を表す。will のあとは原形 be。" },

    { src: "5 ⑶", type: "form", inst: "verb5",
      ja: "明日の今ごろ，あなたはステージでギターを弾いているだろう。", verb: "play",
      template: "You {} {} {} the guitar on stage at this time tomorrow.",
      answer: ["will", "be", "playing"],
      dummies: [["will", "be", "play"], ["will", "are", "playing"], ["are", "be", "playing"], ["will", "have", "play"]],
      note: "〈will be＋-ing 形〉は「（未来のある時点で）～しているだろう」という，未来の進行中の動作も表す。at this time tomorrow（明日の今ごろ）が手がかり。" },

    { src: "6 ⑴", type: "form", inst: "trans6",
      ja: "Look! The baby is going to cry.",
      template: "{}",
      answer: ["見て！ 赤ちゃんが泣きそうだ。"],
      dummies: [["見て！ 赤ちゃんが泣いている。"], ["見て！ 赤ちゃんが泣くつもりだ。"], ["見て！ 赤ちゃんが泣いていた。"], ["見て！ 赤ちゃんはよく泣く。"]],
      note: "be going to は「（兆候があって）～しそうだ」という意味も表す。赤ちゃんの様子を見て「泣きそうだ」と言っている。\n赤ちゃんが自分で決めた予定ではないので，「泣くつもりだ」とはならない。" },

    { src: "6 ⑵", type: "form", inst: "trans6",
      ja: "Who will be speaking first in the speech contest?",
      template: "{}",
      answer: ["スピーチコンテストではだれが最初に話すことになっていますか。"],
      dummies: [["スピーチコンテストではだれが最初に話していましたか。"], ["スピーチコンテストではだれが最初に話しましたか。"], ["スピーチコンテストではだれが最初に話したいですか。"], ["スピーチコンテストではだれが最初に話していますか。"]],
      note: "〈will be＋-ing 形〉は「（成り行きで）～することになっている」という予定を表す。Who will be speaking first ～? で「だれが最初に話すことになっていますか」。" },

    { src: "7 ⑴", type: "form", inst: "box7", words: W3_7,
      ja: "昼食が終わったら散歩に行きましょう。",
      template: "Let’s go for a walk when we {} lunch.",
      answer: ["finish"],
      dummies: [["will finish"], ["finished"], ["finishes"], ["are finish"]],
      note: "when（～するとき）や if（もし～なら）で始まる「時」や「条件」を表す部分では，未来のことでも現在形で表す。when we finish lunch で「昼食が終わったら」。\nwill finish とはしないことに注意。" },

    { src: "7 ⑵", type: "form", inst: "box7", words: W3_7,
      ja: "もし必要があれば，お手伝いしますよ。",
      template: "If you {} me, I {} {} you.",
      answer: ["need", "will", "help"],
      dummies: [["will need", "will", "help"], ["need", "am", "help"], ["needs", "will", "help"], ["need", "will", "helping"]],
      note: "if で始まる「条件」の部分では，未来のことでも現在形 need を使う。主節（I ～ の部分）は未来のことなので will help。" },

    { src: "7 ⑶", type: "form", inst: "box7", words: W3_7,
      ja: "タクシーが到着するまで，私たちは家の中にいます。",
      template: "We {} {} in the house until the taxi {}.",
      answer: ["will", "stay", "arrives"],
      dummies: [["will", "stay", "will arrive"], ["will", "stay", "arrive"], ["are", "stay", "arrives"], ["will", "stays", "arrives"]],
      note: "until（～するまで）で始まる「時」の部分では，未来のことでも現在形を使う。主語 the taxi は3人称単数なので arrives。\n主節は未来のことなので will stay。" },

    { src: "7 ⑷", type: "form", inst: "box7", words: W3_7,
      ja: "この雨がいつやむかわからない。",
      template: "I don’t know when this rain {} {}.",
      answer: ["will", "stop"],
      dummies: [["will", "stops"], ["is", "stop"], ["will", "stopped"], ["was", "stopping"]],
      note: "この when ～ は「いつ～するか」という意味で，know の目的語になっている。この場合は「時」を表す部分ではないので，未来のことは will で表す。\nwill のあとは原形 stop。" },

    { src: "8 ⑴", type: "order",
      ja: "今夜の 11 時には彼はベッドで眠っているだろう。",
      before: "He", after: "at eleven tonight.",
      chunks: ["bed", "sleeping", "will", "in", "be"],
      answer: ["will", "be", "sleeping", "in", "bed"],
      note: "〈will be＋-ing 形〉で「（未来のある時点で）～しているだろう」。will be sleeping で「眠っているだろう」。\nin bed は「ベッドで（寝て）」。" },

    { src: "8 ⑵", type: "order",
      ja: "あなたの準備ができ次第，私たちは家を出ます。",
      before: "We", after: "ready.",
      chunks: ["home", "are", "leave", "as soon as", "will", "you"],
      answer: ["will", "leave", "home", "as soon as", "you", "are"],
      note: "as soon as ～ で「～するとすぐに」。「時」を表す部分なので，未来のことでも現在形 you are ready を使う。\n主節は未来のことなので will leave home。" },

    { src: "8 ⑶", type: "order",
      ja: "【状況】リサに会う予定があるかと聞かれたので…。",
      before: "“", after: "at the club meeting after school.”",
      chunks: ["her", "be", "I", "seeing", "will"],
      answer: ["I", "will", "be", "seeing", "her"],
      trans: "「私は放課後，部活のミーティングで彼女と会うことになっています」",
      note: "〈will be＋-ing 形〉で「（成り行きで）～することになっている」。部活のミーティングがあるので，自然に会うことになっている，という意味。" }
  ]
});

// ===== Lesson 4　時制④（現在完了形） =====
const W4_1 = { box: "be / try / lie / visit / watch / use" };
const W4_5 = { box: "clean / eat / write / lose" };
const W4_6 = { box: "sleep / be / live / wait" };

LESSONS.push({ id: "4-1", title: "時制④（現在完了形）",
  inst: {
    box1: "枠内の動詞を1回ずつ使って現在完了形の文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    verb2: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "box1", words: W4_1,
      template: "I {} {} this movie twice.",
      answer: ["have", "watched"],
      dummies: [["has", "watched"], ["have", "watch"], ["am", "watched"], ["have", "visited"]],
      trans: "私はこの映画を 2 回観たことがある。",
      note: "現在完了形〈have / has＋過去分詞〉は「（今までに）～したことがある」という経験を表す。twice（2回）が手がかり。主語が I なので have watched。\n家などで映画を観るときは watch を使う。" },

    { src: "1 ⑵", type: "form", inst: "box1", words: W4_1,
      template: "He {} {} this zoo with his parents before.",
      answer: ["has", "visited"],
      dummies: [["have", "visited"], ["has", "visit"], ["is", "visited"], ["has", "visiting"]],
      trans: "彼は以前，両親と一緒にこの動物園を訪れたことがある。",
      note: "経験を表す現在完了形。主語 He は3人称単数なので has visited。before（以前に）も経験の手がかりになる。" },

    { src: "1 ⑶", type: "form", inst: "box1", words: W4_1,
      template: "She {} {} the puzzle many times, but she can’t solve it.",
      answer: ["has", "tried"],
      dummies: [["has", "tryed"], ["have", "tried"], ["has", "try"], ["is", "tried"]],
      trans: "彼女はそのパズルを何回もやってみたが，解くことができない。",
      note: "many times（何回も）は経験の手がかり。主語 She なので has tried。\ntry の過去分詞は y を i に変えて tried。" },

    { src: "1 ⑷", type: "form", inst: "box1", words: W4_1,
      template: "{} you ever {} an electronic dictionary?",
      answer: ["have", "used"],
      dummies: [["did", "used"], ["have", "use"], ["has", "used"], ["are", "used"]],
      trans: "電子辞書を使ったことがありますか。",
      note: "経験をたずねる疑問文は〈Have / Has＋主語＋ever＋過去分詞 ～?〉。ever は「今までに」。\n主語が you なので Have you ever used ～?。" },

    { src: "1 ⑸", type: "form", inst: "box1", words: W4_1,
      template: "I {} {} to South Korea once.",
      answer: ["have", "been"],
      dummies: [["have", "gone"], ["has", "been"], ["have", "be"], ["am", "been"]],
      trans: "私は一度韓国に行ったことがある。",
      note: "「～に行ったことがある」は have been to A で表す。be の過去分詞は been。\nhave gone to A は「A に行ってしまった（今ここにいない）」という意味になるので，ここでは使わない。" },

    { src: "1 ⑹", type: "form", inst: "box1", words: W4_1,
      template: "My little sister {} never {} down in a hammock.",
      answer: ["has", "lain"],
      dummies: [["has", "lied"], ["has", "laid"], ["have", "lain"], ["has", "lay"]],
      trans: "妹は一度もハンモックに横たわったことがない。",
      note: "never（一度も～ない）を使うと「一度も～したことがない」という経験の否定になる。\nlie down（横になる）の lie の過去分詞は lain（lie – lay – lain）。lied は「うそをつく」の lie の過去分詞。" },

    { src: "2 ⑴", type: "form", inst: "verb2",
      ja: "私はこの歌を何回か聞いたことがある。", verb: "hear",
      template: "I {} {} this song several {}.",
      answer: ["have", "heard", "times"],
      dummies: [["have", "heared", "times"], ["has", "heard", "times"], ["have", "heard", "time"], ["have", "hear", "times"]],
      note: "経験を表す現在完了形。hear の過去分詞は heard（hear – heard – heard）。\n「何回か」は several times。「～回」の times は複数形にする。" },

    { src: "2 ⑵", type: "form", inst: "verb2",
      ja: "そんなに高いものは一度も買ったことがない。", verb: "buy",
      template: "I {} {} {} such an expensive thing.",
      answer: ["have", "never", "bought"],
      dummies: [["have", "never", "buyed"], ["never", "have", "bought"], ["have", "ever", "bought"], ["have", "never", "brought"]],
      note: "「一度も～したことがない」は〈have never＋過去分詞〉。never は have と過去分詞の間に置く。\nbuy の過去分詞は bought（buy – bought – bought）。brought は bring の過去分詞なので注意。" },

    { src: "2 ⑶", type: "form", inst: "verb2",
      ja: "あなたは今までに校長先生と話をしたことがありますか。", verb: "talk",
      template: "{} you {} {} with the principal?",
      answer: ["have", "ever", "talked"],
      dummies: [["have", "never", "talked"], ["did", "ever", "talked"], ["have", "ever", "talk"], ["has", "ever", "talked"]],
      note: "経験をたずねる疑問文〈Have＋主語＋ever＋過去分詞 ～?〉。ever は「今までに」で，過去分詞の直前に置く。" },

    { src: "2 ⑷", type: "form", inst: "verb2",
      ja: "彼は今までにあの島に行ったことはない。", verb: "be",
      template: "He {} {} {} to that island.",
      answer: ["has", "never", "been"],
      dummies: [["has", "never", "gone"], ["have", "never", "been"], ["has", "ever", "been"], ["never", "has", "been"]],
      note: "「～に行ったことがない」は〈have / has never been to A〉。主語 He なので has。\n経験を表すときは been を使い，gone は使わない。" },

    { src: "2 ⑸", type: "form", inst: "verb2",
      ja: "あなたは何回クジラを見たことがありますか。", verb: "see",
      template: "{} many {} {} you {} a whale?",
      answer: ["how", "times", "have", "seen"],
      dummies: [["how", "time", "have", "seen"], ["how", "times", "did", "seen"], ["how", "times", "have", "saw"], ["what", "times", "have", "seen"]],
      note: "「何回」は How many times。そのあとに現在完了形の疑問文〈have＋主語＋過去分詞〉を続ける。\nsee の過去分詞は seen（see – saw – seen）。" },

    { src: "2 ⑹", type: "form", inst: "verb2",
      ja: "私は去年，その本を 2 回読んだ。", verb: "read",
      template: "I {} that book {} last year.",
      answer: ["read", "twice"],
      dummies: [["have read", "twice"], ["readed", "twice"], ["have read", "two"], ["read", "two"]],
      note: "last year（去年）のように，過去のはっきりした時を表す語があるときは，現在完了形ではなく過去形を使う。read の過去形は read（発音は「レッド」）。\n「2回」は twice。" },

    { src: "3 ⑴", type: "order",
      ja: "私は以前に一度だけ，彼に話しかけたことがある。",
      before: "I", after: "before.",
      chunks: ["spoken", "only once", "to him", "have"],
      answer: ["have", "spoken", "to him", "only once"],
      note: "経験を表す現在完了形 have spoken to him（彼に話しかけたことがある）。そのあとに only once（一度だけ）を置く。\nspeak to A は「A に話しかける」。" },

    { src: "3 ⑵", type: "order",
      ja: "彼女は今までに舞台の上で踊ったことがありますか。",
      before: "", after: "on stage?",
      chunks: ["ever", "has", "she", "danced"],
      answer: ["has", "she", "ever", "danced"],
      note: "経験をたずねる疑問文〈Has＋主語＋ever＋過去分詞 ～?〉。ever（今までに）は過去分詞 danced の直前に置く。" },

    { src: "3 ⑶", type: "order",
      ja: "【状況】祖父は海外旅行に行きたくないと言っています。その理由は…。",
      before: "", after: "an airplane.",
      chunks: ["has", "on", "never", "he", "been"],
      answer: ["he", "has", "never", "been", "on"],
      trans: "彼は一度も飛行機に乗ったことがない。",
      note: "〈has never been＋場所〉で「一度も～にいたことがない」。be on an airplane で「飛行機に乗っている」。\n飛行機やバスなどの大きな乗り物には on を使う。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】友人が自分で撮った富士登山の写真を見せてくれたので，こう聞きました。",
      before: "“Have", after: "?”",
      chunks: ["many", "you", "Mt. Fuji", "climbed", "times"],
      answer: ["you", "climbed", "Mt. Fuji", "many", "times"],
      trans: "「何度も富士山に登ったことがあるのですか」",
      note: "経験をたずねる疑問文〈Have＋主語＋過去分詞 ～?〉。Have you climbed Mt. Fuji で「富士山に登ったことがありますか」。\nmany times（何度も）は文の最後に置く。" }
  ]
});

LESSONS.push({ id: "4-2", title: "時制④（現在完了形）",
  inst: {
    box5: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語句を選びなさい。",
    box6: "枠内の動詞を1回ずつ使って現在完了形の文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    trans7: "次の英文の日本語訳として適切なものを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "box5", words: W4_5,
      ja: "私はちょうどレポートを書いたところだ。",
      template: "I {} just {} my report.",
      answer: ["have", "written"],
      dummies: [["have", "wrote"], ["has", "written"], ["have", "writed"], ["am", "written"]],
      note: "現在完了形は「（ちょうど）～したところだ」という完了も表す。just（ちょうど）は have と過去分詞の間に置く。\nwrite の過去分詞は written（write – wrote – written）。" },

    { src: "5 ⑵", type: "form", inst: "box5", words: W4_5,
      ja: "私は昨日，部屋を掃除した。",
      template: "I {} my room yesterday.",
      answer: ["cleaned"],
      dummies: [["have cleaned"], ["clean"], ["has cleaned"], ["was clean"]],
      note: "yesterday（昨日）のように過去のはっきりした時を表す語があるときは，現在完了形ではなく過去形を使う。clean の過去形は cleaned。" },

    { src: "5 ⑶", type: "form", inst: "box5", words: W4_5,
      ja: "彼女はすでにお昼ごはんを食べたので，おなかがすいていない。",
      template: "She is not hungry because she {} already {} lunch.",
      answer: ["has", "eaten"],
      dummies: [["has", "ate"], ["have", "eaten"], ["is", "eaten"], ["has", "eat"]],
      note: "完了を表す現在完了形。already（すでに）は has と過去分詞の間に置く。\neat の過去分詞は eaten（eat – ate – eaten）。" },

    { src: "5 ⑷", type: "form", inst: "box5", words: W4_5,
      ja: "私は家の鍵を探しています。なくしてしまったと思います。",
      template: "I’m looking for my house key. I think I {} {} it.",
      answer: ["have", "lost"],
      dummies: [["have", "lose"], ["has", "lost"], ["have", "losted"], ["am", "lost"]],
      note: "現在完了形は「～してしまった（その結果，今も…だ）」という結果も表す。鍵をなくして，今も見つかっていない。\nlose の過去分詞は lost（lose – lost – lost）。" },

    { src: "6 ⑴", type: "form", inst: "box6", words: W4_6,
      template: "Kate {} {} sick in bed {} a month.",
      answer: ["has", "been", "for"],
      dummies: [["has", "been", "since"], ["have", "been", "for"], ["has", "be", "for"], ["is", "been", "for"]],
      trans: "ケイトは 1 か月間，病気で寝ていた。",
      note: "現在完了形は「（ずっと）～している」という継続も表す。期間の長さ（a month：1か月）の前には for を置く。\nbe の過去分詞は been。" },

    { src: "6 ⑵", type: "form", inst: "box6", words: W4_6,
      template: "I {} {} in this city {} 2015.",
      answer: ["have", "lived", "since"],
      dummies: [["have", "lived", "for"], ["has", "lived", "since"], ["have", "live", "since"], ["am", "lived", "since"]],
      trans: "私は 2015 年からこの街に住んでいます。",
      note: "継続を表す現在完了形。2015（2015年）のように「いつから」という始まりの時点の前には since を置く。\n期間の長さには for，始まりの時点には since。" },

    { src: "6 ⑶", type: "form", inst: "box6", words: W4_6,
      template: "I have {} {} for him since this morning.",
      answer: ["been", "waiting"],
      dummies: [["be", "waiting"], ["been", "waited"], ["being", "waiting"], ["was", "waiting"]],
      trans: "私は今朝からずっと彼を待っている。",
      note: "〈have / has been＋-ing 形〉（現在完了進行形）で「（今まで）ずっと～し続けている」という動作の継続を表す。\nwait for A は「A を待つ」。" },

    { src: "6 ⑷", type: "form", inst: "box6", words: W4_6,
      template: "The baby {} {} {} for three hours.",
      answer: ["has", "been", "sleeping"],
      dummies: [["have", "been", "sleeping"], ["has", "be", "sleeping"], ["has", "been", "slept"], ["is", "been", "sleeping"]],
      trans: "その赤ちゃんは 3 時間眠っている。",
      note: "現在完了進行形〈has been＋-ing 形〉で「ずっと～し続けている」。主語 The baby は3人称単数なので has。" },

    { src: "7 ⑴", type: "form", inst: "trans7",
      ja: "He is singing karaoke now. / He has been singing karaoke for a few hours.",
      template: "（{}）／（{}）",
      answer: ["彼は今カラオケを歌っています", "彼は数時間ずっとカラオケを歌っています"],
      dummies: [["彼は今カラオケを歌っています", "彼は数時間前にカラオケを歌いました"], ["彼はいつもカラオケを歌います", "彼は数時間ずっとカラオケを歌っています"], ["彼は今カラオケを歌っています", "彼は数時間カラオケを歌うでしょう"], ["彼は今カラオケを歌うつもりです", "彼は数時間カラオケを歌っていました"]],
      note: "is singing は現在進行形で「今歌っている」。has been singing は現在完了進行形で「（今まで）ずっと歌っている」。\nfor a few hours は「数時間（の間）」。" },

    { src: "7 ⑵", type: "form", inst: "trans7",
      ja: "She has already gone to work. / She has just been to the post office.",
      template: "（{}）／（{}）",
      answer: ["彼女はすでに仕事へ行ってしまった", "彼女はちょうど郵便局へ行ってきたところだ"],
      dummies: [["彼女はすでに仕事へ行ってしまった", "彼女はちょうど郵便局へ行ってしまった"], ["彼女はすでに仕事へ行ってきたところだ", "彼女はちょうど郵便局へ行ってきたところだ"], ["彼女はすでに仕事へ行ったことがある", "彼女はちょうど郵便局にいたところだ"], ["彼女は仕事へ行くところだ", "彼女はちょうど郵便局へ行ってきたところだ"]],
      note: "has gone to A は「A へ行ってしまった（今ここにいない）」。has been to A は「A へ行ってきたところだ（今は戻っている）」。\nalready は「すでに」，just は「ちょうど」。" },

    { src: "7 ⑶", type: "form", inst: "trans7",
      ja: "Have you washed your hands yet? / I haven’t washed my hands yet.",
      template: "（{}）／（{}）",
      answer: ["あなたはもう手を洗いましたか", "私はまだ手を洗っていません"],
      dummies: [["あなたはまだ手を洗っていないのですか", "私はまだ手を洗っていません"], ["あなたはもう手を洗いましたか", "私はもう手を洗いません"], ["あなたは手を洗ったことがありますか", "私は手を洗ったことがありません"], ["あなたは手を洗っていますか", "私はまだ手を洗っていません"]],
      note: "yet は疑問文では「もう」，否定文では「まだ」という意味になる。Have you ～ yet? で「もう～しましたか」，I haven’t ～ yet. で「まだ～していない」。" },

    { src: "8 ⑴", type: "order",
      ja: "私は初めて見たときからずっとこのバッグが欲しいと思っている。",
      before: "", after: "I first saw it.",
      chunks: ["wanted", "since", "I", "this bag", "have"],
      answer: ["I", "have", "wanted", "this bag", "since"],
      note: "継続を表す現在完了形 have wanted（ずっと欲しいと思っている）。want は状態を表す動詞なので，進行形ではなく現在完了形で継続を表す。\nsince I first saw it は「初めて見たときから」。" },

    { src: "8 ⑵", type: "order",
      ja: "あなたはどれくらいの間，彼らを知っていますか［知り合ってどれくらいですか］。",
      before: "", after: "them?",
      chunks: ["long", "have", "you", "how", "known"],
      answer: ["how", "long", "have", "you", "known"],
      note: "How long（どれくらいの間）は期間の長さをたずねる。そのあとに現在完了形の疑問文 have you known を続ける。\nknow の過去分詞は known。" },

    { src: "8 ⑶", type: "order",
      ja: "【状況】どうしてジェーンと口をきかないのか，とたずねられたので…。",
      before: "“Jane", after: "since last week.”",
      chunks: ["angry", "me", "has", "with", "been"],
      answer: ["has", "been", "angry", "with", "me"],
      trans: "「ジェーンは先週から私に怒っています」",
      note: "継続を表す現在完了形 has been angry（ずっと怒っている）。since last week は「先週から」。\nbe angry with A は「A に腹を立てている」。" }
  ]
});

// ===== Lesson 5　時制⑤（過去完了形・未来完了形） =====
LESSONS.push({ id: "5-1", title: "時制⑤（過去完了形・未来完了形）",
  inst: {
    verb1: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    conj2: "日本語に合うように，［ ］の動詞を適切な形にするとき，（ ）に入る語句の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "verb1",
      ja: "私が電話したとき，ケンはちょうど帰宅したところだった。", verb: "come",
      template: "Ken {} just {} home when I called him.",
      answer: ["had", "come"],
      dummies: [["has", "come"], ["had", "came"], ["was", "come"], ["had", "comed"]],
      note: "過去完了形〈had＋過去分詞〉は，過去のある時点（ここでは「私が電話したとき」）までに「～してしまっていた」という完了を表す。\ncome の過去分詞は come（come – came – come）。" },

    { src: "1 ⑵", type: "form", inst: "verb1",
      ja: "昨日の 7 時には，私たちはまだ家を出ていなかった。", verb: "leave",
      template: "We {} {} home yet at seven yesterday.",
      answer: ["hadn’t", "left"],
      dummies: [["haven’t", "left"], ["hadn’t", "leave"], ["didn’t", "left"], ["hadn’t", "leaved"]],
      note: "過去完了形の否定文〈had not（= hadn’t）＋過去分詞〉で「（過去のある時点までに）まだ～していなかった」。基準の時点は at seven yesterday（昨日の7時）。\nleave の過去分詞は left（leave – left – left）。" },

    { src: "1 ⑶", type: "form", inst: "verb1",
      ja: "あなたが映画館に着いたときまでに映画は始まっていましたか。", verb: "start",
      template: "{} the movie {} by the time you got to the theater?",
      answer: ["had", "started"],
      dummies: [["has", "started"], ["did", "started"], ["had", "start"], ["was", "started"]],
      note: "過去完了形の疑問文は〈Had＋主語＋過去分詞 ～?〉。by the time ～（～するときまでに）という過去の時点までの完了をたずねている。" },

    { src: "1 ⑷", type: "form", inst: "verb1",
      ja: "ケイトは日本に来る前に，着物を 1 回着たことがあった。", verb: "wear",
      template: "Kate {} {} a kimono once before she came to Japan.",
      answer: ["had", "worn"],
      dummies: [["had", "wore"], ["has", "worn"], ["had", "weared"], ["was", "worn"]],
      note: "過去完了形は「（過去のある時点までに）～したことがあった」という経験も表す。基準の時点は「日本に来たとき」。\nwear の過去分詞は worn（wear – wore – worn）。" },

    { src: "1 ⑸", type: "form", inst: "verb1",
      ja: "トムは昨日まで一度もジェリーと話したことがなかった。", verb: "talk",
      template: "Tom {} never {} with Jerry until yesterday.",
      answer: ["had", "talked"],
      dummies: [["has", "talked"], ["had", "talk"], ["did", "talked"], ["was", "talked"]],
      note: "〈had never＋過去分詞〉で「（過去のある時点まで）一度も～したことがなかった」という経験の否定。until yesterday（昨日まで）が基準。" },

    { src: "1 ⑹", type: "form", inst: "verb1",
      ja: "彼女はそれより前にそんなミスをしたことがありましたか。", verb: "make",
      template: "{} she {} such a mistake before that?",
      answer: ["had", "made"],
      dummies: [["has", "made"], ["had", "make"], ["did", "made"], ["had", "maked"]],
      note: "経験をたずねる過去完了形の疑問文〈Had＋主語＋過去分詞 ～?〉。before that（それより前に）が過去の基準の時点。\nmake a mistake は「間違える」。make の過去分詞は made。" },

    { src: "2 ⑴", type: "form", inst: "conj2",
      ja: "アンは，私が前日にスマホをなくしたことを知っていた。", verb: "know / lose",
      template: "Ann {} that I {} my smartphone the day before.",
      answer: ["knew", "had lost"],
      dummies: [["had known", "lost"], ["knew", "have lost"], ["knows", "had lost"], ["knew", "had losed"]],
      note: "アンが知っていたのは過去なので knew。私がスマホをなくしたのはそれよりさらに前なので，過去完了形 had lost で表す（「大過去」という）。\nthe day before は「（過去のある日から見て）その前日」。" },

    { src: "2 ⑵", type: "form", inst: "conj2",
      ja: "前の週にしっかり勉強したので，エドはテストでよい成績を取った。", verb: "do / study",
      template: "Ed {} well on the test because he {} hard the previous week.",
      answer: ["did", "had studied"],
      dummies: [["had done", "studied"], ["did", "has studied"], ["does", "had studied"], ["did", "had studyed"]],
      note: "テストでよい成績を取ったのは過去なので did。勉強したのはそれより前なので，過去完了形 had studied。\ndo well は「うまくいく，よい成績を取る」。the previous week は「その前の週」。" },

    { src: "2 ⑶", type: "form", inst: "conj2",
      ja: "姉は新しいシャツを買って，それを私にくれた。", verb: "buy / give",
      template: "My sister {} a new jacket and {} it to me.",
      answer: ["bought", "gave"],
      dummies: [["had bought", "gave"], ["bought", "had given"], ["buyed", "gave"], ["brought", "gave"]],
      note: "「買った」→「くれた」と起こった順に述べているときは，前のことでも過去完了形にせず，どちらも過去形で表す。\nbuy の過去形は bought，give の過去形は gave。" },

    { src: "3 ⑴", type: "order",
      ja: "ユカが家に着くまでには，もう暗くなっていた。",
      before: "", after: "by the time Yuka got home.",
      chunks: ["dark", "already", "had", "it", "gotten"],
      answer: ["it", "had", "already", "gotten", "dark"],
      note: "過去完了形〈had＋過去分詞〉で「（ユカが家に着いたときまでに）すでに～していた」。get dark は「暗くなる」，主語は明るさを表す it。\nalready は had と過去分詞の間に置く。" },

    { src: "3 ⑵", type: "order",
      ja: "以前にその道を歩いたことがあったので，私は迷わなかった。",
      before: "I didn’t get lost because", after: ".",
      chunks: ["walked", "had", "I", "the way", "before"],
      answer: ["I", "had", "walked", "the way", "before"],
      note: "迷わなかったのは過去。その道を歩いたのはそれより前の経験なので，過去完了形 had walked で表す。\nget lost は「道に迷う」。" },

    { src: "3 ⑶", type: "order",
      ja: "【状況】クリスマスの朝，カーテンを開けたら外が真っ白で驚きました。",
      before: "I didn’t know that", after: "the night before.",
      chunks: ["snowed", "had", "a lot", "it"],
      answer: ["it", "had", "snowed", "a lot"],
      trans: "私は前の晩にたくさん雪が降ったことを知らなかった。",
      note: "知らなかったのは過去（クリスマスの朝）。雪が降ったのはそれより前（前の晩）なので，過去完了形 had snowed で表す。\nthe night before は「その前の晩」。" }
  ]
});

LESSONS.push({ id: "5-2", title: "時制⑤（過去完了形・未来完了形）",
  inst: {
    conj5: "［ ］の動詞の一方を過去形，もう一方を過去完了形または過去完了進行形にするとき，（ ）に入る語句の組み合わせを選びなさい。",
    verb6: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "conj5",
      verb: "know / get",
      template: "Bill {} Sarah for five years when they {} married last year.",
      answer: ["had known", "got"],
      dummies: [["knew", "had gotten"], ["has known", "got"], ["had known", "had gotten"], ["had been knowing", "got"]],
      trans: "昨年結婚したとき，ビルはサラと知り合って 5 年経っていた。",
      note: "過去のある時点（昨年結婚したとき）までずっと続いていた状態は，過去完了形 had known で表す。結婚したのは過去の1回の出来事なので got。\nknow は状態を表す動詞なので，進行形にしない。" },

    { src: "5 ⑵", type: "form", inst: "conj5",
      verb: "believe / tell",
      template: "I {} your explanation until someone {} me the truth yesterday.",
      answer: ["had believed", "told"],
      dummies: [["believed", "had told"], ["have believed", "told"], ["had believed", "had told"], ["had been believing", "told"]],
      trans: "昨日ある人から真実を聞かされるまで，私はあなたの説明を信じていた。",
      note: "「真実を聞かされたとき（昨日）」までずっと信じていたので，過去完了形 had believed。聞かされたのは過去の出来事なので told。\nbelieve は状態を表す動詞なので，進行形にしない。" },

    { src: "5 ⑶", type: "form", inst: "conj5",
      verb: "go / be",
      template: "When she {} to the doctor, she {} sick for a few days.",
      answer: ["went", "had been"],
      dummies: [["had gone", "was"], ["went", "has been"], ["had gone", "had been"], ["went", "was being"]],
      trans: "彼女が医者に診てもらったとき，数日前から［数日間］具合が悪かった。",
      note: "医者に行ったのは過去の出来事なので went。それまで数日間ずっと具合が悪かったので，過去完了形 had been。\nfor a few days は「数日間」。" },

    { src: "5 ⑷", type: "form", inst: "conj5",
      verb: "play / stop",
      template: "Jim {} a game for two hours when I {} him.",
      answer: ["had been playing", "stopped"],
      dummies: [["played", "had stopped"], ["has been playing", "stopped"], ["had been playing", "had stopped"], ["had been played", "stopped"]],
      trans: "私がジムを止めたとき，彼は 2 時間ゲームをやり続けていた。",
      note: "過去のある時点（私が止めたとき）までずっと続いていた動作は，過去完了進行形〈had been＋-ing 形〉で表す。止めたのは過去の出来事なので stopped。" },

    { src: "5 ⑸", type: "form", inst: "conj5",
      verb: "rain / turn",
      template: "It {} since early morning before it {} to snow in the evening.",
      answer: ["had been raining", "turned"],
      dummies: [["rained", "had turned"], ["has been raining", "turned"], ["had been raining", "had turned"], ["was raining", "has turned"]],
      trans: "夕方雪に変わるまで，早朝からずっと雨が降っていた。",
      note: "雪に変わった（過去）ときまで，早朝からずっと降り続いていたので過去完了進行形 had been raining。turn to A は「A に変わる」。" },

    { src: "6 ⑴", type: "form", inst: "verb6",
      ja: "私は明日の朝までに，これらの単語を暗記しているだろう。", verb: "learn",
      template: "I {} {} {} these words by heart by tomorrow morning.",
      answer: ["will", "have", "learned"],
      dummies: [["will", "has", "learned"], ["will", "have", "learn"], ["will", "be", "learned"], ["have", "will", "learned"]],
      note: "未来完了形〈will have＋過去分詞〉は，未来のある時点（明日の朝）までに「～してしまっているだろう」という完了を表す。will のあとは原形 have。\nlearn A by heart は「A を暗記する」。" },

    { src: "6 ⑵", type: "form", inst: "verb6",
      ja: "今度の 3 月で，彼女はこのスイミングクラブに所属して 2 年になる。", verb: "belong",
      template: "She {} {} {} to this swimming club for two years next March.",
      answer: ["will", "have", "belonged"],
      dummies: [["will", "has", "belonged"], ["will", "be", "belonging"], ["has", "been", "belonged"], ["will", "have", "belong"]],
      note: "未来完了形は「（未来のある時点まで）ずっと～していることになる」という継続も表す。next March（今度の3月）までに2年になる。\nbelong は状態を表す動詞なので，進行形にしない。" },

    { src: "6 ⑶", type: "form", inst: "verb6",
      ja: "もう一度観たら，私はその動画を 10 回見たことになる。", verb: "watch",
      template: "I {} {} {} the movie ten times if I watch it again.",
      answer: ["will", "have", "watched"],
      dummies: [["will", "had", "watched"], ["will", "have", "watch"], ["have", "been", "watched"], ["will", "be", "watched"]],
      note: "未来完了形は「（未来のある時点で）～したことになる」という経験も表す。もう一度観たときに10回になる。\nif のあとは条件を表すので，未来のことでも現在形 watch。" },

    { src: "6 ⑷", type: "form", inst: "verb6",
      ja: "私たちが着くころには試合は始まっているだろう。", verb: "start",
      template: "By the time we get there, the game {} {} {}.",
      answer: ["will", "have", "started"],
      dummies: [["will", "had", "started"], ["has", "been", "started"], ["will", "have", "start"], ["will", "be", "start"]],
      note: "未来完了形で「（私たちが着くころまでに）始まってしまっているだろう」という完了を表す。\nby the time ～（～するころまでに）の部分は「時」を表すので，未来のことでも現在形 get。" },

    { src: "7 ⑴", type: "order",
      ja: "ジェーンはヨーロッパに発つ前に，５年間日本に住んでいた。",
      before: "Jane", after: "before she left for Europe.",
      chunks: ["for", "in", "had", "Japan", "five years", "lived"],
      answer: ["had", "lived", "in", "Japan", "for", "five years"],
      note: "過去のある時点（ヨーロッパに発ったとき）までの継続は過去完了形 had lived で表す。for five years は「5年間」。\nleave for A は「A に向けて出発する」。" },

    { src: "7 ⑵", type: "order",
      ja: "来月までには，彼らはそんなうわさは忘れているだろう。",
      before: "They", after: "next month.",
      chunks: ["rumors", "have", "forgotten about", "such", "by", "will"],
      answer: ["will", "have", "forgotten about", "such", "rumors", "by"],
      note: "未来完了形 will have forgotten で「（来月までには）忘れてしまっているだろう」。by next month は「来月までに」。\nsuch rumors は「そんなうわさ」。" },

    { src: "7 ⑶", type: "order",
      ja: "【状況】店内で迷子になった男の子を預かっていました。",
      before: "The boy", after: "until he found his mother.",
      chunks: ["crying", "for", "been", "a long time", "had"],
      answer: ["had", "been", "crying", "for", "a long time"],
      trans: "男の子は母親を見つけるまで，長い間泣き続けていた。",
      note: "過去完了進行形〈had been＋-ing 形〉で「（過去のある時点まで）ずっと～し続けていた」。母親を見つけるまで泣き続けていた。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】レンはすでに２回の優勝経験があります。",
      before: "Ren", after: "times if he wins the next match.",
      chunks: ["have", "three", "the championship", "won", "will"],
      answer: ["will", "have", "won", "the championship", "three"],
      trans: "レンは次の試合に勝つと，３回優勝したことになる。",
      note: "未来完了形 will have won で「（次の試合に勝てば）優勝したことになる」という経験を表す。win the championship は「優勝する」。\nif のあとは条件を表すので，未来のことでも現在形 wins。" }
  ]
});

// ===== Lesson 6　助動詞①（can / may） =====
const W6_1 = { box: "jump / fly / borrow / answer / swim / translate" };

LESSONS.push({ id: "6-1", title: "助動詞①（can / may）",
  inst: {
    box1: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    trans2: "次の英文の下線部に注意して日本語にするとき，（ ）に入る語句を選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "box1", words: W6_1,
      ja: "ペンギンは上手に泳ぐことができるが，空を飛ぶことはできない。",
      template: "Penguins {} {} well, but they {} {}.",
      answer: ["can", "swim", "can’t", "fly"],
      dummies: [["can", "swims", "can’t", "fly"], ["can", "swim", "can’t", "flying"], ["are", "swim", "can’t", "fly"], ["can", "swimming", "can’t", "fly"]],
      note: "〈can＋動詞の原形〉で「～することができる」，〈can’t（= cannot）＋動詞の原形〉で「～することができない」という能力を表す。\ncan のあとは，主語が何でも動詞の原形。" },

    { src: "1 ⑵", type: "form", inst: "box1", words: W6_1,
      ja: "私たちは図書館で一度に３冊本を借りることができる。",
      template: "We {} {} three books at a time from the library.",
      answer: ["can", "borrow"],
      dummies: [["can", "borrows"], ["are", "borrow"], ["can", "borrowing"], ["can", "to borrow"]],
      note: "can は「～してよい，～できる」という許可や可能も表す。can のあとは原形 borrow。\nat a time は「一度に」。borrow は「借りる」。" },

    { src: "1 ⑶", type: "form", inst: "box1", words: W6_1,
      ja: "あなたたちはこの英語の文を日本語に翻訳することができますか。",
      template: "{} you {} this English sentence into Japanese?",
      answer: ["can", "translate"],
      dummies: [["are", "translate"], ["can", "translating"], ["can", "translates"], ["able", "translate"]],
      note: "can の疑問文は〈Can＋主語＋動詞の原形 ～?〉。\ntranslate A into B は「A を B に翻訳する」。" },

    { src: "1 ⑷", type: "form", inst: "box1", words: W6_1,
      ja: "ケイトはこのバーを跳び越えることができる。",
      template: "Kate {} {} {} {} over this bar.",
      answer: ["is", "able", "to", "jump"],
      dummies: [["can", "able", "to", "jump"], ["is", "able", "to", "jumping"], ["is", "able", "for", "jump"], ["are", "able", "to", "jump"]],
      note: "〈be able to＋動詞の原形〉も「～することができる」を表す。主語 Kate は3人称単数なので is able to jump。\ncan と be able to を重ねて can able to とはしない。" },

    { src: "1 ⑸", type: "form", inst: "box1", words: W6_1,
      ja: "彼らはその質問に答えることができなかった。",
      template: "They {} {} {} {} the question.",
      answer: ["weren’t", "able", "to", "answer"],
      dummies: [["didn’t", "able", "to", "answer"], ["weren’t", "able", "to", "answered"], ["wasn’t", "able", "to", "answer"], ["couldn’t", "able", "to", "answer"]],
      note: "be able to の過去の否定文は〈was / were not able to＋動詞の原形〉。主語 They なので weren’t（= were not）。\nto のあとは原形 answer。" },

    { src: "2 ⑴", type: "form", inst: "trans2",
      ja: "My little brother could read Chinese characters when he was four.",
      template: "弟は 4 歳で（{}）。",
      answer: ["漢字が読めた"],
      dummies: [["漢字が読めるかもしれない"], ["漢字を読んでもよかった"], ["漢字が読めるだろう"], ["漢字を読んだことがあった"]],
      note: "could は can の過去形で，「～することができた」という過去の能力を表す。\nChinese characters は「漢字」。" },

    { src: "2 ⑵", type: "form", inst: "trans2",
      ja: "We were able to pass the exam the third time.",
      template: "私たちは 3 回目に（{}）。",
      answer: ["その試験に合格することができた"],
      dummies: [["その試験に合格するかもしれなかった"], ["その試験に合格してもよかった"], ["その試験に合格できるだろう"], ["その試験に合格しなければならなかった"]],
      note: "were able to は「（実際に）～することができた」という，過去に1回できたことを表す。この意味では could ではなく was / were able to を使う。" },

    { src: "2 ⑶", type: "form", inst: "trans2",
      ja: "Mari couldn’t go to the concert yesterday.",
      template: "マリは昨日，（{}）。",
      answer: ["そのコンサートに行くことができなかった"],
      dummies: [["そのコンサートに行かないかもしれなかった"], ["そのコンサートに行ってはいけなかった"], ["そのコンサートに行くはずがなかった"], ["そのコンサートに行くつもりがなかった"]],
      note: "couldn’t は「～することができなかった」。否定のときは，1回の出来事にも couldn’t を使うことができる。" },

    { src: "2 ⑷", type: "form", inst: "trans2",
      ja: "John will be able to speak Japanese soon.",
      template: "ジョンは（{}）。",
      answer: ["すぐに日本語を話すことができるようになるだろう"],
      dummies: [["すぐに日本語を話すことができた"], ["すぐに日本語を話してもよいだろう"], ["すぐに日本語を話さなければならないだろう"], ["すぐに日本語を話しているだろう"]],
      note: "〈will be able to＋動詞の原形〉で「～することができるようになるだろう」。will と can は並べて使えないので，未来のことは will be able to で表す。" },

    { src: "3 ⑴", type: "order",
      ja: "私たちは彼に何もかも頼ることはできません。",
      before: "", after: "everything.",
      chunks: ["depend on", "we", "him", "for", "can’t"],
      answer: ["we", "can’t", "depend on", "him", "for"],
      note: "〈can’t＋動詞の原形〉で「～することができない」。depend on A for B は「B のことで A に頼る」。" },

    { src: "3 ⑵", type: "order",
      ja: "そのアメリカ人は生魚を食べることができますか。",
      before: "Is", after: "?",
      chunks: ["raw fish", "the American", "to", "eat", "able"],
      answer: ["the American", "able", "to", "eat", "raw fish"],
      note: "be able to の疑問文は，be動詞を主語の前に出して〈be動詞＋主語＋able to＋動詞の原形 ～?〉にする。\nraw fish は「生魚」。" },

    { src: "3 ⑶", type: "order",
      ja: "消防士たちはその女の子を火事から救い出すことができた。",
      before: "", after: "from the fire.",
      chunks: ["able", "save", "firefighters", "to", "the girl", "were"],
      answer: ["firefighters", "were", "able", "to", "save", "the girl"],
      note: "were able to save で「（実際に）救い出すことができた」。過去に1回できたことなので could ではなく were able to を使う。\nsave A from B は「A を B から救い出す」。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】父はいつも，昔は力持ちだったと自慢します。",
      before: "“When I was younger,", after: ".”",
      chunks: ["could", "30 kilograms", "lift", "one hand", "I", "with"],
      answer: ["I", "could", "lift", "30 kilograms", "with", "one hand"],
      trans: "「若いころは，片手で 30 kg 持ち上げることができた」",
      note: "could は「（いつでも）～することができた」という過去の能力を表す。I could lift ～ で「～を持ち上げることができた」。\nwith one hand は「片手で」。" }
  ]
});

LESSONS.push({ id: "6-2", title: "助動詞①（can / may）",
  inst: {
    fill5: "日本語に合うように，（ ）に入る適切な語の組み合わせを選びなさい。",
    trans6: "次の英文を日本語にするとき，（ ）に入る語句を選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "fill5",
      ja: "先生はその答えを知っているかもしれない。",
      template: "Our teacher {} {} the answer.",
      answer: ["may", "know"],
      dummies: [["may", "knows"], ["can’t", "know"], ["must", "know"], ["may", "to know"]],
      note: "〈may＋動詞の原形〉で「～かもしれない」という推量を表す（might / could でもよい）。may のあとは原形なので knows は誤り。\nmust know は「知っているにちがいない」，can’t know は「知っているはずがない」。" },

    { src: "5 ⑵", type: "form", inst: "fill5",
      ja: "電気はとても危険なことがある。",
      template: "Electricity {} {} very dangerous.",
      answer: ["can", "be"],
      dummies: [["can", "is"], ["can’t", "be"], ["must", "be"], ["can", "being"]],
      note: "can は「～することがある」という，ありうること（可能性）を表す。can のあとは be動詞の原形 be。\nElectricity は「電気」。" },

    { src: "5 ⑶", type: "form", inst: "fill5",
      ja: "こんな夜遅くに彼女がここにいるはずがない。",
      template: "She {} {} here this late at night.",
      answer: ["can’t", "be"],
      dummies: [["can’t", "is"], ["may", "be"], ["must", "be"], ["can", "be"]],
      note: "〈can’t（= cannot）＋動詞の原形〉で「～のはずがない」という，可能性がないことを表す。can’t be here で「ここにいるはずがない」。\nthis late at night は「こんな夜遅くに」。" },

    { src: "5 ⑷", type: "form", inst: "fill5",
      ja: "彼はあまり強そうには見えないかもしれない。",
      template: "He {} {} {} very strong.",
      answer: ["may", "not", "look"],
      dummies: [["may", "not", "looks"], ["may", "no", "look"], ["not", "may", "look"], ["can’t", "not", "look"]],
      note: "〈may not＋動詞の原形〉で「～ではないかもしれない」。not は may の直後に置く（might not でもよい）。\nlook＋形容詞 で「～に見える」。" },

    { src: "6 ⑴ a", type: "form", inst: "trans6",
      ja: "Emma doesn’t talk to me. She might be angry.",
      template: "エマは私に話しかけない。（{}）。",
      answer: ["彼女は怒っているのかもしれない"],
      dummies: [["彼女は怒っていたのかもしれない"], ["彼女は怒っているにちがいない"], ["彼女は怒っているはずがない"], ["彼女は怒ってもよい"]],
      note: "〈might＋動詞の原形〉で「～かもしれない」という，今のことについての推量を表す。might be angry で「怒っているのかもしれない」。" },

    { src: "6 ⑴ b", type: "form", inst: "trans6",
      ja: "Emma didn’t talk to me. She may have been angry.",
      template: "エマは私に話しかけなかった。（{}）。",
      answer: ["彼女は怒っていたのかもしれない"],
      dummies: [["彼女は怒っているのかもしれない"], ["彼女は怒っていたにちがいない"], ["彼女は怒っていたはずがない"], ["彼女は怒ることがある"]],
      note: "〈may have＋過去分詞〉で「～だったかもしれない」という，過去のことについての推量を表す。may have been angry で「怒っていたのかもしれない」。" },

    { src: "6 ⑵ a", type: "form", inst: "trans6",
      ja: "Such a person can’t be a true friend.",
      template: "そんな人は（{}）。",
      answer: ["本当の友だちであるはずがない"],
      dummies: [["本当の友だちであったはずがない"], ["本当の友だちでなくてもよい"], ["本当の友だちかもしれない"], ["本当の友だちにちがいない"]],
      note: "〈can’t＋動詞の原形〉で「～のはずがない」という，今のことについて可能性がないことを表す。can’t be a true friend で「本当の友だちであるはずがない」。" },

    { src: "6 ⑵ b", type: "form", inst: "trans6",
      ja: "She can’t have written this report by herself.",
      template: "彼女が自分で（{}）。",
      answer: ["このレポートを書いたはずがない"],
      dummies: [["このレポートを書くはずがない"], ["このレポートを書くことができない"], ["このレポートを書いたかもしれない"], ["このレポートを書いたにちがいない"]],
      note: "〈can’t have＋過去分詞〉で「～したはずがない」という，過去のことについて可能性がないことを表す。\nby oneself は「ひとりで，自分で」。" },

    { src: "7 ⑴", type: "order",
      ja: "あの男の子は，私の近所に住んでいるのかもしれない。",
      before: "The boy", after: ".",
      chunks: ["my", "may", "live", "neighborhood", "in"],
      answer: ["may", "live", "in", "my", "neighborhood"],
      note: "〈may＋動詞の原形〉で「～かもしれない」。may live で「住んでいるのかもしれない」。\nin one’s neighborhood は「～の近所に」。" },

    { src: "7 ⑵", type: "order",
      ja: "事故はどんなときでも起こりうる。",
      before: "", after: "time.",
      chunks: ["can", "happen", "any", "accidents", "at"],
      answer: ["accidents", "can", "happen", "at", "any"],
      note: "can は「～することがある，～しうる」という可能性を表す。Accidents can happen で「事故は起こりうる」。\nat any time は「どんなときでも」。" },

    { src: "7 ⑶", type: "order",
      ja: "私はそこにいなかった。あなたがそこで私を見たはずがない。",
      before: "I wasn’t there.", after: "there.",
      chunks: ["can’t", "me", "have", "you", "seen"],
      answer: ["you", "can’t", "have", "seen", "me"],
      note: "〈can’t have＋過去分詞〉で「～したはずがない」。You can’t have seen me で「あなたが私を見たはずがない」。" },

    { src: "7 ⑷", type: "order",
      ja: "これは，大きな問題ではないかもしれないが，やはり少し心配だ。",
      before: "", after: ", but I’m a little worried.",
      chunks: ["not", "this", "might", "a big problem", "be"],
      answer: ["this", "might", "not", "be", "a big problem"],
      note: "〈might not＋動詞の原形〉で「～ではないかもしれない」。not は might の直後に置く。\nThis might not be a big problem で「これは大きな問題ではないかもしれない」。" },

    { src: "7 ⑸", type: "order",
      ja: "【状況】昨日，ネコのタマが遅くまで帰ってこなかったので…。",
      before: "Tama", after: "on his way home.",
      chunks: ["gotten", "may", "lost", "have"],
      answer: ["may", "have", "gotten", "lost"],
      trans: "タマは帰り道で迷ったのかもしれない。",
      note: "〈may have＋過去分詞〉で「～したのかもしれない」という過去のことへの推量。get lost は「道に迷う」で，get の過去分詞は gotten。\non one’s way home は「家へ帰る途中で」。" }
  ]
});

// ===== Lesson 7　助動詞②（must / should） =====
const W7_1 = { box: "stay / hand / use / understand / find / bring" };
const W7_2 = { box: "laugh / see / hurry" };

LESSONS.push({ id: "7-1", title: "助動詞②（must / should）",
  inst: {
    box1: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    box2: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，下線部に入る語句を選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "box1", words: W7_1,
      ja: "私たちはお互いを理解しなければならない。",
      template: "We {} {} each other.",
      answer: ["must", "understand"],
      dummies: [["must", "understands"], ["must", "to understand"], ["have", "understand"], ["must", "understanding"]],
      note: "〈must＋動詞の原形〉で「～しなければならない」という義務を表す。must のあとは原形 understand。\neach other は「お互い」。" },

    { src: "1 ⑵", type: "form", inst: "box1", words: W7_1,
      ja: "私は読書感想文を提出しなければならない。",
      template: "I {} {} {} in a book report.",
      answer: ["have", "to", "hand"],
      dummies: [["has", "to", "hand"], ["have", "to", "handing"], ["must", "to", "hand"], ["have", "for", "hand"]],
      note: "〈have to＋動詞の原形〉も「～しなければならない」を表す。主語が I なので have to。\nhand in A は「A を提出する」。must のあとに to は入らない。" },

    { src: "1 ⑶", type: "form", inst: "box1", words: W7_1,
      ja: "彼は新しい仕事を見つけなければならなかった。",
      template: "He {} {} {} a new job.",
      answer: ["had", "to", "find"],
      dummies: [["must", "to", "find"], ["has", "to", "found"], ["had", "to", "found"], ["have", "to", "find"]],
      note: "must には過去形がないので，「～しなければならなかった」は〈had to＋動詞の原形〉で表す。\nto のあとは原形 find。" },

    { src: "1 ⑷", type: "form", inst: "box1", words: W7_1,
      ja: "雨が降ったら私は家にいなければならないだろう。",
      template: "I will {} {} {} home if it rains.",
      answer: ["have", "to", "stay"],
      dummies: [["must", "to", "stay"], ["has", "to", "stay"], ["have", "to", "staying"], ["had", "to", "stay"]],
      note: "will と must は並べて使えないので，「～しなければならないだろう」は〈will have to＋動詞の原形〉で表す。will のあとは原形 have。" },

    { src: "1 ⑸", type: "form", inst: "box1", words: W7_1,
      ja: "あなたは自分のタオルを持ってくる必要はない。",
      template: "You {} {} {} {} your own towel.",
      answer: ["don’t", "have", "to", "bring"],
      dummies: [["don’t", "has", "to", "bring"], ["doesn’t", "have", "to", "bring"], ["don’t", "have", "to", "brought"], ["not", "have", "to", "bring"]],
      note: "〈don’t have to＋動詞の原形〉で「～する必要はない」。must not（～してはいけない）とは意味がちがうので注意。\n主語が You なので don’t。" },

    { src: "1 ⑹", type: "form", inst: "box1", words: W7_1,
      ja: "生徒はこの部屋でスマートフォンを使ってはいけない。",
      template: "Students {} {} {} their smartphones in this room.",
      answer: ["must", "not", "use"],
      dummies: [["must", "not", "using"], ["don’t", "must", "use"], ["must", "no", "use"], ["mustn’t", "not", "use"]],
      note: "〈must not＋動詞の原形〉で「～してはいけない」という禁止を表す。not は must の直後に置く。" },

    { src: "2 ⑴", type: "form", inst: "box2", words: W7_2,
      ja: "気分が悪いのなら，保健室へ行くほうがいいですよ。",
      template: "If you feel sick, you {} a doctor.",
      answer: ["should see"],
      dummies: [["should seeing"], ["should to see"], ["should saw"], ["ought see"]],
      note: "〈should＋動詞の原形〉で「～するほうがよい，～すべきだ」という助言を表す（ought to see でもよい）。\nsee a doctor は「医者に診てもらう」。ought は ought to の形で使う。" },

    { src: "2 ⑵", type: "form", inst: "box2", words: W7_2,
      ja: "彼はあんなふうに人を笑うべきではない。",
      template: "He {} at others like that.",
      answer: ["should not laugh"],
      dummies: [["should not to laugh"], ["not should laugh"], ["should not laughing"], ["doesn’t should laugh"]],
      note: "〈should not＋動詞の原形〉で「～すべきではない」。not は should の直後に置く（ought not to laugh でもよい）。\nlaugh at A は「A を笑う」。" },

    { src: "2 ⑶", type: "form", inst: "box2", words: W7_2,
      ja: "遅れたくないなら，急がないといけませんよ。",
      template: "You {} if you don’t want to be late.",
      answer: ["had better hurry"],
      dummies: [["had better to hurry"], ["had better hurrying"], ["have better hurry"], ["better had hurry"]],
      note: "〈had better＋動詞の原形〉で「～したほうがいい，～しないといけない」という強い忠告を表す。had better のあとは to のない原形。\n現在のことでも have ではなく had を使う。" },

    { src: "3 ⑴", type: "order",
      ja: "あなたは失敗のことで自分を責める必要はない。",
      before: "You", after: "for the failure.",
      chunks: ["don’t", "yourself", "have", "blame", "to"],
      answer: ["don’t", "have", "to", "blame", "yourself"],
      note: "〈don’t have to＋動詞の原形〉で「～する必要はない」。\nblame A for B は「B のことで A を責める」。" },

    { src: "3 ⑵", type: "order",
      ja: "世界のだれもがよい教育を受けられるべきだと思う。",
      before: "I think", after: "access to a good education.",
      chunks: ["the world", "have", "everyone", "should", "in"],
      answer: ["everyone", "in", "the world", "should", "have"],
      note: "everyone in the world（世界のだれもが）を主語にして，〈should＋動詞の原形〉「～すべきだ」を続ける。\nhave access to A は「A を利用できる，受けられる」。" },

    { src: "3 ⑶", type: "order",
      ja: "【状況】いつもバスで登校するのに，今朝は定期券を忘れてしまったので…。",
      before: "", after: "cash.",
      chunks: ["had", "in", "pay", "I", "the fare", "to"],
      answer: ["I", "had", "to", "pay", "the fare", "in"],
      trans: "私は現金で運賃を払わなければならなかった。",
      note: "〈had to＋動詞の原形〉で「～しなければならなかった」。\npay A in cash は「A を現金で払う」。fare は「運賃」。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】友だちとサッカーをする予定でしたが，今日は猛暑日なので…。",
      before: "", after: "in this heat.",
      chunks: ["not", "had", "we", "go out", "better"],
      answer: ["we", "had", "better", "not", "go out"],
      trans: "この暑さでは外出しないほうがいい。",
      note: "had better の否定は〈had better not＋動詞の原形〉で「～しないほうがいい」。not は better のあとに置く。" }
  ]
});

LESSONS.push({ id: "7-2", title: "助動詞②（must / should）",
  inst: {
    fill5: "日本語に合うように，（ ）に入る適切な語の組み合わせを選びなさい。",
    trans6: "次の英文の下線部に注意して日本語にするとき，（ ）に入る語句を選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "fill5",
      ja: "この掃除機は最新型にちがいない。",
      template: "This vacuum cleaner {} {} the latest model.",
      answer: ["must", "be"],
      dummies: [["must", "is"], ["can’t", "be"], ["must", "being"], ["may", "is"]],
      note: "〈must＋動詞の原形〉は「～にちがいない」という強い確信も表す。must のあとは be動詞の原形 be。\nthe latest は「最新の」。" },

    { src: "5 ⑵", type: "form", inst: "fill5",
      ja: "彼女は本当の答えを知っているにちがいない。",
      template: "She {} {} the true answer.",
      answer: ["must", "know"],
      dummies: [["must", "knows"], ["can’t", "know"], ["may", "know"], ["must", "to know"]],
      note: "〈must＋動詞の原形〉「～にちがいない」。主語が She でも must のあとは原形 know。\nmay know は「知っているかもしれない」，can’t know は「知っているはずがない」。" },

    { src: "5 ⑶", type: "form", inst: "fill5",
      ja: "父は今ごろ，家で私を待っているはずだ。",
      template: "My father {} {} waiting for me at home now.",
      answer: ["should", "be"],
      dummies: [["should", "is"], ["can’t", "be"], ["should", "being"], ["shouldn’t", "be"]],
      note: "〈should＋動詞の原形〉は「～のはずだ」という当然の推量も表す。should be waiting で「待っているはずだ」。\nshould のあとは原形 be。" },

    { src: "5 ⑷", type: "form", inst: "fill5",
      ja: "シャーロットはその問いに答えることができるはずだ。",
      template: "Charlotte {} {} able to {} that question.",
      answer: ["should", "be", "answer"],
      dummies: [["should", "is", "answer"], ["should", "be", "answering"], ["can", "be", "answer"], ["should", "be", "answered"]],
      note: "「～できるはずだ」は〈should be able to＋動詞の原形〉。should と can は並べて使えないので，can の代わりに be able to を使う。" },

    { src: "5 ⑸", type: "form", inst: "fill5",
      ja: "彼は私の電話番号を知らないはずだ。",
      template: "He {} {} my phone number.",
      answer: ["shouldn’t", "know"],
      dummies: [["shouldn’t", "knows"], ["should", "know"], ["isn’t", "know"], ["shouldn’t", "knowing"]],
      note: "〈shouldn’t（= should not）＋動詞の原形〉で「～しないはずだ」。shouldn’t のあとは原形 know。" },

    { src: "5 ⑹", type: "form", inst: "fill5",
      ja: "マイクは体育館にいるはずだ。",
      template: "Mike {} to {} in the gym.",
      answer: ["ought", "be"],
      dummies: [["ought", "being"], ["ought", "is"], ["should", "be"], ["must", "be"]],
      note: "〈ought to＋動詞の原形〉は should と同じく「～のはずだ」を表す。to のあとは原形 be。\nshould や must のあとには to は入らない。" },

    { src: "6 ⑴ a", type: "form", inst: "trans6",
      ja: "I’ve seen her on TV. She must be a famous actor.",
      template: "彼女をテレビで見たことがある。（{}）。",
      answer: ["彼女は有名な俳優にちがいない"],
      dummies: [["彼女は有名な俳優だったにちがいない"], ["彼女は有名な俳優になるべきだ"], ["彼女は有名な俳優であるはずがない"], ["彼女は有名な俳優でなければならない"]],
      note: "〈must＋状態を表す動詞〉は，今のことについての強い確信「～にちがいない」を表す。must be a famous actor で「有名な俳優にちがいない」。" },

    { src: "6 ⑴ b", type: "form", inst: "trans6",
      ja: "I’ve seen her in old movies. She must have been a famous actor.",
      template: "彼女を昔の映画で観たことがある。（{}）。",
      answer: ["彼女は有名な俳優であったにちがいない"],
      dummies: [["彼女は有名な俳優にちがいない"], ["彼女は有名な俳優になるべきだった"], ["彼女は有名な俳優であったはずがない"], ["彼女は有名な俳優にならなければならなかった"]],
      note: "〈must have＋過去分詞〉は，過去のことについての強い確信「～だったにちがいない」を表す。" },

    { src: "6 ⑵ a", type: "form", inst: "trans6",
      ja: "You should tell her about the trouble.",
      template: "あなたは（{}）。",
      answer: ["その問題について彼女に言うべきだ"],
      dummies: [["その問題について彼女に言うべきだった"], ["その問題について彼女に言ったにちがいない"], ["その問題について彼女に言う必要はない"], ["その問題について彼女に言ったはずだ"]],
      note: "〈should＋動詞の原形〉で「～すべきだ」。今するべきことを表す。" },

    { src: "6 ⑵ b", type: "form", inst: "trans6",
      ja: "You should have told her about the trouble.",
      template: "あなたは（{}）。",
      answer: ["その問題について彼女に言うべきだった"],
      dummies: [["その問題について彼女に言うべきだ"], ["その問題について彼女に言ったにちがいない"], ["その問題について彼女に言わなければならない"], ["その問題について彼女に言ったかもしれない"]],
      note: "〈should have＋過去分詞〉で「～すべきだった（のに，しなかった）」という，過去にしなかったことへの後悔や非難を表す。" },

    { src: "7 ⑴", type: "order",
      ja: "カズは部活の練習のあとで，空腹にちがいない。",
      before: "", after: "the club practice.",
      chunks: ["be", "Kazu", "must", "after", "hungry"],
      answer: ["Kazu", "must", "be", "hungry", "after"],
      note: "〈must＋動詞の原形〉で「～にちがいない」。Kazu must be hungry で「カズは空腹にちがいない」。\nafter the club practice は「部活の練習のあとで」。" },

    { src: "7 ⑵", type: "order",
      ja: "メアリーは今ごろ電車に乗っているはずだ。",
      before: "", after: "by now.",
      chunks: ["on", "Mary", "the train", "should", "be"],
      answer: ["Mary", "should", "be", "on", "the train"],
      note: "〈should＋動詞の原形〉で「～のはずだ」。should be on the train で「電車に乗っているはずだ」。\nby now は「今ごろは」。" },

    { src: "7 ⑶", type: "order",
      ja: "私の留守中に，弟が私の部屋に入ったにちがいない。",
      before: "My", after: "while I was out.",
      chunks: ["must", "my room", "entered", "brother", "have"],
      answer: ["brother", "must", "have", "entered", "my room"],
      note: "〈must have＋過去分詞〉で「～したにちがいない」という，過去のことへの強い確信を表す。\nwhile I was out は「私の留守中に」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】ケーキ食べ放題から帰ってきたら，お腹が痛くなってきました。",
      before: "", after: "so many pieces of cake.",
      chunks: ["should", "I", "not", "eaten", "have"],
      answer: ["I", "should", "not", "have", "eaten"],
      trans: "私はそんなに多くのケーキを食べるべきでなかった。",
      note: "〈should not have＋過去分詞〉で「～すべきではなかった（のに，してしまった）」。実際にはケーキを食べすぎてしまった。" }
  ]
});

// ===== Lesson 8　助動詞③（will / would など） =====
const W8_5 = { box: "use / start / fight / send / forget / allow" };

LESSONS.push({ id: "8-1", title: "助動詞③（will / would など）",
  inst: {
    fill1: "日本語に合うように，（ ）に入る適切な語の組み合わせを選びなさい。",
    trans2: "次の英文の下線部に注意して日本語にするとき，（ ）に入る語句を選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "fill1",
      ja: "少し待っていただけませんか。―いいですよ。問題ありません。",
      template: "{} {} wait a minute? ― Sure. No problem.",
      answer: ["would", "you"],
      dummies: [["shall", "I"], ["may", "I"], ["shall", "we"], ["would", "I"]],
      note: "Would you ～? / Could you ～? で「～していただけませんか」というていねいな依頼を表す。\nShall I ～? は「～しましょうか」，May I ～? は「～してもよろしいですか」。" },

    { src: "1 ⑵", type: "form", inst: "fill1",
      ja: "パスポートを見てもよろしいですか。―いいですよ。はい，どうぞ。",
      template: "{} {} see your passport? ― Sure. Here you are.",
      answer: ["may", "I"],
      dummies: [["shall", "I"], ["will", "you"], ["would", "you"], ["shall", "we"]],
      note: "May I ～? で「～してもよろしいですか」と許可を求める（Could I ～? / Can I ～? でもよい）。\nHere you are. は物を渡すときの「はい，どうぞ」。" },

    { src: "1 ⑶", type: "form", inst: "fill1",
      ja: "このあたりをご案内しましょうか。―はい，お願いします。ありがとう。",
      template: "{} {} show you around? ― Yes, please. Thank you.",
      answer: ["shall", "I"],
      dummies: [["will", "you"], ["shall", "we"], ["would", "you"], ["may", "you"]],
      note: "Shall I ～? で「（私が）～しましょうか」と申し出る（Can I ～? でもよい）。\nshow A around は「A を案内して回る」。" },

    { src: "1 ⑷", type: "form", inst: "fill1",
      ja: "静かにしてくれますか。―ああ，ごめんなさい。",
      template: "{} {} be quiet, please? ― Oh, I’m sorry.",
      answer: ["will", "you"],
      dummies: [["shall", "I"], ["may", "I"], ["shall", "we"], ["will", "I"]],
      note: "Will you ～? で「～してくれますか」という依頼を表す（Can you ～? でもよい）。Would you ～? よりくだけた言い方。" },

    { src: "1 ⑸", type: "form", inst: "fill1",
      ja: "しばらく休憩しませんか。―はい，そうしましょう。",
      template: "{} {} take a rest for a while? ― Yes, let’s.",
      answer: ["shall", "we"],
      dummies: [["shall", "I"], ["will", "you"], ["may", "we"], ["would", "I"]],
      note: "Shall we ～? で「（一緒に）～しませんか」と提案する。答えるときは Yes, let’s. / No, let’s not. を使う。\ntake a rest は「休憩する」。" },

    { src: "1 ⑹", type: "form", inst: "fill1",
      ja: "生徒は講演のあとに質問をしてもよろしい。",
      template: "Students {} {} questions after the lecture.",
      answer: ["may", "ask"],
      dummies: [["may", "asking"], ["must", "ask"], ["shall", "ask"], ["may", "to ask"]],
      note: "〈may＋動詞の原形〉で「～してもよい」という許可を表す（can ask でもよい）。may のあとは原形 ask。" },

    { src: "2 ⑴", type: "form", inst: "trans2",
      ja: "I feel cold. Can you close the window?",
      template: "私は寒いです。（{}）。",
      answer: ["窓を閉めてくれますか"],
      dummies: [["窓を閉めてもいいですか"], ["窓を閉めましょうか"], ["窓を閉めたことがありますか"], ["窓を閉めなければなりませんか"]],
      note: "Can you ～? は「～してくれますか」という依頼を表す。寒いので相手に窓を閉めるよう頼んでいる。" },

    { src: "2 ⑵", type: "form", inst: "trans2",
      ja: "It’s hot in here. May I take off my jacket?",
      template: "ここは暑いです。（{}）。",
      answer: ["上着を脱いでもよろしいですか"],
      dummies: [["上着を脱いでくれますか"], ["上着を脱ぎましょうか"], ["上着を脱ぐかもしれません"], ["上着を脱がなければなりませんか"]],
      note: "May I ～? で「～してもよろしいですか」と許可を求める。take off は「～を脱ぐ」（反対は put on）。" },

    { src: "2 ⑶", type: "form", inst: "trans2",
      ja: "We’re going out to eat. Will you join us?",
      template: "私たちは外に食べに行くつもりです。（{}）。",
      answer: ["あなたも加わりませんか"],
      dummies: [["あなたも加わってもいいですか"], ["私たちも加わりましょうか"], ["あなたは加わらなければなりません"], ["あなたは加わったことがありますか"]],
      note: "Will you ～? は「～しませんか」という勧誘も表す。Will you join us? で「一緒に行きませんか」。" },

    { src: "2 ⑷", type: "form", inst: "trans2",
      ja: "Would you take care of the dog while I’m away?",
      template: "私が留守の間，（{}）。",
      answer: ["イヌの世話をしていただけませんか"],
      dummies: [["イヌの世話をしましょうか"], ["イヌの世話をしてもよろしいですか"], ["イヌの世話をしたものだ"], ["イヌの世話をするべきだ"]],
      note: "Would you ～? で「～していただけませんか」というていねいな依頼。take care of A は「A の世話をする」。" },

    { src: "3 ⑴", type: "order",
      ja: "最寄りの駅までの道を教えていただけますか。",
      before: "Could", after: "the nearest station?",
      chunks: ["tell", "to", "please", "me", "you", "the way"],
      answer: ["you", "please", "tell", "me", "the way", "to"],
      note: "Could you ～? はていねいな依頼。please を Could you のあとに入れると，さらにていねいになる。\ntell A the way to B は「A に B への道を教える」。" },

    { src: "3 ⑵", type: "order",
      ja: "私もゲームに参加していいですか。",
      before: "", after: "the game?",
      chunks: ["I", "part", "in", "can", "take"],
      answer: ["can", "I", "take", "part", "in"],
      note: "Can I ～? で「～してもいいですか」と許可を求める。take part in A は「A に参加する」。" },

    { src: "3 ⑶", type: "order",
      ja: "彼にあなたのメッセージを伝えておきましょうか。",
      before: "", after: "him?",
      chunks: ["to", "message", "pass on", "I", "shall", "your"],
      answer: ["shall", "I", "pass on", "your", "message", "to"],
      note: "Shall I ～? で「～しましょうか」と申し出る。pass on A to B は「A を B に伝える」。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】ペットボトルを持ったまま美術館に入ろうとしたら，係員にこう言われました。",
      before: "“", after: ".”",
      chunks: ["can’t", "or drinks", "inside", "bring", "you", "food"],
      answer: ["you", "can’t", "bring", "food", "or drinks", "inside"],
      trans: "「（美術館の）中に食べ物や飲み物は持ち込めません」",
      note: "can’t は「～してはいけない」という不許可も表す。You can’t bring A inside で「A を中に持ち込んではいけない」。" }
  ]
});

LESSONS.push({ id: "8-2", title: "助動詞③（will / would など）",
  inst: {
    box5: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    trans6: "次の英文を日本語にするとき，（ ）に入る語句を選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "box5", words: W8_5,
      ja: "私がお客様にこれらの本をお送りします。",
      template: "{} {} these books to the customer.",
      answer: ["I’ll", "send"],
      dummies: [["I’ll", "sends"], ["I’ll", "sent"], ["I’m", "send"], ["I’ll", "sending"]],
      note: "will は「～します」という話し手の意志を表す。I’ll は I will の短縮形。will のあとは原形 send。\ncustomer は「客」。" },

    { src: "5 ⑵", type: "form", inst: "box5", words: W8_5,
      ja: "あなたの誕生日を忘れません。約束します。",
      template: "I {} {} your birthday. I promise.",
      answer: ["won’t", "forget"],
      dummies: [["won’t", "forgot"], ["won’t", "forgets"], ["willn’t", "forget"], ["won’t", "forgetting"]],
      note: "won’t（= will not）は「～しない（つもりだ）」という意志を表す。will not の短縮形は won’t（willn’t とはしない）。" },

    { src: "5 ⑶", type: "form", inst: "box5", words: W8_5,
      ja: "私たちはチームのために戦います。",
      template: "We {} {} for the team.",
      answer: ["will", "fight"],
      dummies: [["will", "fought"], ["will", "fights"], ["are", "fight"], ["will", "fighting"]],
      note: "will で「～します」という強い意志を表す。will のあとは原形 fight。" },

    { src: "5 ⑷", type: "form", inst: "box5", words: W8_5,
      ja: "これ以上の言い訳は許さないよ。",
      template: "I {} {} {} any more excuses.",
      answer: ["will", "not", "allow"],
      dummies: [["will", "no", "allow"], ["not", "will", "allow"], ["will", "not", "allows"], ["will", "not", "allowed"]],
      note: "will not で「（絶対に）～しない」という強い意志を表す。not は will の直後に置く。\nexcuse は「言い訳」。" },

    { src: "5 ⑸", type: "form", inst: "box5", words: W8_5,
      ja: "私の祖母はどうしてもスマートフォンを使おうとしない。",
      template: "My grandmother {} {} a smartphone.",
      answer: ["won’t", "use"],
      dummies: [["won’t", "uses"], ["wouldn’t", "used"], ["won’t", "using"], ["isn’t", "use"]],
      note: "won’t は「どうしても～しようとしない」という拒絶も表す。主語が3人称単数でも won’t のあとは原形 use。" },

    { src: "5 ⑹", type: "form", inst: "box5", words: W8_5,
      ja: "今朝，車のエンジンがどうしてもかからなかった。",
      template: "My car engine {} {} this morning.",
      answer: ["wouldn’t", "start"],
      dummies: [["won’t", "start"], ["wouldn’t", "started"], ["didn’t", "started"], ["wasn’t", "start"]],
      note: "wouldn’t は過去の拒絶「どうしても～しようとしなかった」を表す。this morning（今朝）は過去なので won’t ではなく wouldn’t。\nエンジンが「かかる」は start で表す。" },

    { src: "6 ⑴", type: "form", inst: "trans6",
      ja: "I’m not quite sure, but I think this would be the best solution.",
      template: "よくわからないけれど，これが（{}）。",
      answer: ["最善の解決策だろう"],
      dummies: [["最善の解決策だった"], ["最善の解決策にちがいない"], ["最善の解決策になるつもりだ"], ["最善の解決策だったものだ"]],
      note: "would は「（たぶん）～だろう」という，will よりひかえめな推量を表す。強い確信がもてないときに使う。" },

    { src: "6 ⑵", type: "form", inst: "trans6",
      ja: "I only met her once. She wouldn’t remember me.",
      template: "彼女に会ったのは一度だけだ。彼女は（{}）。",
      answer: ["たぶん私を覚えていないだろう"],
      dummies: [["どうしても私を覚えようとしなかった"], ["私を覚えていなかったものだ"], ["私を覚えているにちがいない"], ["私を覚えているはずだ"]],
      note: "wouldn’t は「（たぶん）～ないだろう」という推量の否定を表す。一度しか会っていないので「覚えていないだろう」と考えている。" },

    { src: "6 ⑶", type: "form", inst: "trans6",
      ja: "I would often play catch with Tom when I was in elementary school.",
      template: "私は小学生のころ（{}）。",
      answer: ["よくトムとキャッチボールをしたものだ"],
      dummies: [["よくトムとキャッチボールをするだろう"], ["よくトムとキャッチボールをしたかった"], ["トムとキャッチボールをしようとしなかった"], ["よくトムとキャッチボールをするべきだった"]],
      note: "〈would often＋動詞の原形〉で「（昔は）よく～したものだ」という過去の習慣を表す。\nplay catch with A は「A とキャッチボールをする」。" },

    { src: "7 ⑴", type: "order",
      ja: "このシャツは彼には少し大きすぎるだろう。",
      before: "This shirt", after: "for him.",
      chunks: ["a bit", "would", "big", "be", "too"],
      answer: ["would", "be", "a bit", "too", "big"],
      note: "would be で「（たぶん）～だろう」というひかえめな推量。a bit（少し）は too big の前に置いて a bit too big とする。" },

    { src: "7 ⑵", type: "order",
      ja: "駅に着いたら電話します。",
      before: "", after: "at the station.",
      chunks: ["call", "when", "I", "you", "arrive", "I’ll"],
      answer: ["I’ll", "call", "you", "when", "I", "arrive"],
      note: "I’ll call you で「電話します」という意志。when のあとは「時」を表す部分なので，未来のことでも現在形 arrive を使う（when I’ll arrive とはしない）。" },

    { src: "7 ⑶", type: "order",
      ja: "【状況】荷物が重くて階段の下で困っているお年寄りがいたので，声をかけました。",
      before: "“", after: "you.”",
      chunks: ["carry", "your baggage", "I’ll", "for", "upstairs"],
      answer: ["I’ll", "carry", "your baggage", "upstairs", "for"],
      trans: "「私があなたの荷物を 2 階に運びますよ」",
      note: "I’ll ～ で「（私が）～しますよ」という申し出・意志。upstairs（上の階へ）は副詞なので to はつけない。\ncarry A for B は「B のために A を運ぶ」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】妹がまだ寝室から出てきません。今日も遅刻しそうです。",
      before: "", after: "in the morning.",
      chunks: ["up", "she", "get", "early", "won’t"],
      answer: ["she", "won’t", "get", "up", "early"],
      trans: "彼女は朝早く起きようとしない。",
      note: "won’t は「どうしても～しようとしない」という拒絶を表す。She won’t get up early で「早く起きようとしない」。" }
  ]
});

// ===== Lesson 9　受動態 =====
const W9_5 = { box: "make / steal / discover / take / print / bring", choices: ["made", "stolen", "discovered", "taken", "printed", "brought"] };

LESSONS.push({ id: "9-1", title: "受動態",
  inst: {
    form: "［ ］の動詞の適切な形を選びなさい。"
  },
  questions: [
    { src: "1 ⑴ a", type: "form",
      verb: "clean",
      template: "I {} the room yesterday.",
      answer: ["cleaned"],
      dummies: [["was cleaned"], ["is cleaned"], ["clean"], ["cleaning"]],
      trans: "私は昨日部屋を掃除した。",
      note: "「私が部屋を掃除した」のように、主語（I）が自分で動作をする文を「能動態」という。yesterday（昨日）があるので過去の文。clean の過去形 cleaned を入れる。\nwas cleaned は「掃除された」という受動態なので、主語が I のこの文には合わない。" },

    { src: "1 ⑴ b", type: "form",
      verb: "clean",
      template: "The room {} yesterday.",
      answer: ["was cleaned"],
      dummies: [["cleaned"], ["was cleaning"], ["is cleaned"], ["were cleaned"]],
      trans: "部屋は昨日掃除された。",
      note: "主語の The room（部屋）は自分で掃除をしない。「部屋が掃除された」のように、主語が動作を受ける文を「受動態」という。受動態の形は〈be動詞＋過去分詞〉。yesterday があるので be動詞は過去形 was にする。\ncleaned だけだと「部屋が掃除をした」という意味になってしまう。" },

    { src: "1 ⑵ a", type: "form",
      verb: "speak",
      template: "Today people {} English all over the world.",
      answer: ["speak"],
      dummies: [["are spoken"], ["speaks"], ["is spoken"], ["speaking"]],
      trans: "今では人々は世界中で英語を話す。",
      note: "主語の people（人々）が英語を話すので能動態。Today（今では）があるので現在の文。people は複数なので、s をつけない speak を使う。\nspeaks は主語が he / she などの3人称単数のときの形。are spoken は「話される」という受動態。" },

    { src: "1 ⑵ b", type: "form",
      verb: "speak",
      template: "Today English {} all over the world.",
      answer: ["is spoken"],
      dummies: [["speaks"], ["is speaking"], ["is spoke"], ["are spoken"]],
      trans: "今では英語は世界中で話される。",
      note: "主語の English（英語）は「話される」側なので受動態〈be動詞＋過去分詞〉。現在の文で English は単数なので、be動詞は is。speak の過去分詞は spoken（speak – spoke – spoken）。\nis speaking は「話している」という進行形なので、意味が合わない。" },

    { src: "1 ⑶ a", type: "form",
      verb: "not invite",
      template: "She {} Tom to the party last night.",
      answer: ["did not invite"],
      dummies: [["was not invited"], ["did not invited"], ["was not invite"], ["does not invite"]],
      trans: "彼女は昨晩トムをパーティーに招かなかった。",
      note: "主語の She（彼女）がトムを招待する側なので能動態。last night（昨晩）があるので過去の否定文。一般動詞の過去の否定文は〈did not＋動詞の原形〉。\ndid not のあとは必ず原形なので、did not invited は誤り。" },

    { src: "1 ⑶ b", type: "form",
      verb: "not invite",
      template: "Tom {} to the party last night.",
      answer: ["was not invited"],
      dummies: [["did not invite"], ["was not invite"], ["did not invited"], ["is not invited"]],
      trans: "昨晩トムはパーティーに招かれなかった。",
      note: "主語の Tom は招待される側なので受動態。受動態の否定文は、be動詞のあとに not を置いて〈be動詞＋not＋過去分詞〉にする。過去の文なので was not invited。\nwas not のあとは過去分詞が来るので、was not invite は誤り。" },

    { src: "1 ⑷ a", type: "form",
      verb: "will hold",
      template: "They {} the festival next weekend.",
      answer: ["will hold"],
      dummies: [["will be held"], ["will held"], ["will holds"], ["will be hold"]],
      trans: "彼らは来週末，祭りを開催するだろう。",
      note: "hold には「（イベントなど）を開く、開催する」という意味がある。主語の They（彼ら）が祭りを開く側なので能動態。next weekend（来週末）なので未来の文。〈will＋動詞の原形〉で表す。\nwill のあとは原形なので、will held は誤り。" },

    { src: "1 ⑷ b", type: "form",
      verb: "will hold",
      template: "The festival {} next weekend.",
      answer: ["will be held"],
      dummies: [["will hold"], ["will be hold"], ["will be holding"], ["will being held"]],
      trans: "来週末，祭りが開催されるだろう。",
      note: "主語の The festival（祭り）は開催される側なので受動態。未来の受動態は〈will be＋過去分詞〉。will のあとの be動詞は原形 be になる。hold の過去分詞は held（hold – held – held）。\nwill be hold は、be のあとが原形になっているので誤り。" },

    { src: "2 ⑴", type: "order",
      ja: "これらの映画は多くの若い人たちに愛されている。",
      before: "These movies", after: ".",
      chunks: ["young", "loved", "are", "people", "by", "many"],
      answer: ["are", "loved", "by", "many", "young", "people"],
      note: "受動態の基本の形は〈be動詞＋過去分詞＋by＋行為者〉で、「～によって…される」という意味。主語 These movies は複数で現在の文なので are loved。\n「多くの若い人たちによって」は by many young people。many（多くの）→ young（若い）→ people（人たち）の順に並べる。" },

    { src: "2 ⑵", type: "order",
      ja: "あなたの家は昨日の台風によって被害を受けましたか。",
      before: "", after: "yesterday’s typhoon?",
      chunks: ["by", "your", "damaged", "was", "house"],
      answer: ["was", "your", "house", "damaged", "by"],
      note: "受動態の疑問文は、be動詞を主語の前に出して〈be動詞＋主語＋過去分詞＋by …?〉の形にする。「昨日」の話なので be動詞は過去形 Was。主語は your house。\n物が被害を受けるときは be damaged、人がけがをするときは be injured を使う。" },

    { src: "2 ⑶", type: "order",
      ja: "幸い，その衝突事故で亡くなった人はいなかった。",
      before: "Fortunately,", after: "the crash.",
      chunks: ["was", "in", "no one", "killed"],
      answer: ["no one", "was", "killed", "in"],
      note: "「亡くなった人はいなかった」は、no one（だれも～ない）を主語にして no one was killed と表す。直訳は「だれも殺されなかった」。\n事故や災害で人が亡くなるとき、英語では be killed という受動態をよく使う。in the crash は「その衝突事故で」。" },

    { src: "2 ⑷", type: "order",
      ja: "そのイベントは 1 か月延期された。",
      before: "", after: "a month.",
      chunks: ["put", "the event", "for", "was", "off"],
      answer: ["the event", "was", "put", "off", "for"],
      note: "put off は「～を延期する」という意味で、2語でひとまとまりの動詞。受動態でも put off をまとめて〈be動詞＋put off〉とする。\nput は過去分詞も put（put – put – put）なので、「延期された」は was put off。for a month は「1か月間」。" },

    { src: "2 ⑸", type: "order",
      ja: "このカメラは祖父から私に贈られたものだ。",
      before: "This camera", after: "my grandfather.",
      chunks: ["to", "was", "by", "me", "given"],
      answer: ["was", "given", "to", "me", "by"],
      note: "give A to B「A を B に与える」の A（このカメラ）を主語にした受動態。This camera was given（このカメラは与えられた）のあとに、to me（私に）、by my grandfather（祖父によって）を続ける。give の過去分詞は given。" },

    { src: "3 ⑴", type: "order",
      ja: "この絵は有名な画家によって描かれたのですか。",
      before: "", after: "artist?",
      chunks: ["famous", "a", "painted", "this picture", "was", "by"],
      answer: ["was", "this picture", "painted", "by", "a", "famous"],
      note: "受動態の疑問文〈be動詞＋主語＋過去分詞＋by …?〉。過去の文なので Was を文頭に置き、主語 this picture、過去分詞 painted（描かれた）と続ける。\n「有名な画家によって」は by a famous artist。a（1人の）→ famous（有名な）→ artist（画家）の順。" },

    { src: "3 ⑵", type: "order",
      ja: "私は帰り道で知らない人に話しかけられた。",
      before: "", after: "a stranger on my way home.",
      chunks: ["by", "was", "to", "I", "spoken"],
      answer: ["I", "was", "spoken", "to", "by"],
      note: "speak to ～「～に話しかける」は、2語でひとまとまりの動詞。受動態にしても to は残るので、「話しかけられた」は was spoken to。\nそのあとに by a stranger（知らない人によって）が続くので、to と by が並ぶ形になる。on my way home は「帰り道で」。" },

    { src: "3 ⑶", type: "order",
      ja: "彼女は子どものころ友だちにヒメと呼ばれていた。",
      before: "When she was a child,", after: "her friends.",
      chunks: ["called", "was", "by", "she", "Hime"],
      answer: ["she", "was", "called", "Hime", "by"],
      note: "call A B は「A を B と呼ぶ」。受動態にすると A is called B「A は B と呼ばれる」になる。ここでは she was called Hime「彼女はヒメと呼ばれていた」。\nそのあとに by her friends（友だちによって）を続ける。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】割引商品をさらに安く買おうと思って，レジでクーポンを出したら…。",
      before: "“Sorry,", after: "discounted items.”",
      chunks: ["be", "that coupon", "for", "cannot", "used"],
      answer: ["that coupon", "cannot", "be", "used", "for"],
      trans: "「申し訳ありません，そのクーポンは割引商品には使えません」",
      note: "助動詞を使った受動態は〈助動詞＋be＋過去分詞〉。cannot のあとの be動詞は原形 be になるので、cannot be used「使われることができない＝使えない」。\ndiscounted items は「割引商品」。for discounted items で「割引商品に対して」。" }
  ]
});

LESSONS.push({ id: "9-2", title: "受動態",
  questions: [
    { src: "5 ⑴", type: "blanks", words: W9_5,
      ja: "昨夜，金庫から何が盗まれたのですか。",
      template: "{} {} {} from the safe last night?",
      blanks: [
        { answer: "what", dummies: ["who", "how", "where", "when"] },
        { answer: "was", dummies: ["did", "is", "were", "does"] },
        { answer: "stolen", verb: true }
      ],
      note: "「何が盗まれたか」の「何が」は文の主語。疑問詞 what が主語のときは、What のあとにそのまま〈be動詞＋過去分詞〉を続ける。\n過去の文なので was。steal の過去分詞は stolen（steal – stole – stolen）。" },

    { src: "5 ⑵", type: "blanks", words: W9_5,
      ja: "この植物はどのようにして日本に持ち込まれたのですか。",
      template: "{} {} this plant {} into Japan?",
      blanks: [
        { answer: "how", dummies: ["what", "why", "where", "when"] },
        { answer: "was", dummies: ["did", "is", "were", "does"] },
        { answer: "brought", verb: true }
      ],
      note: "「どのようにして」は how。How のあとに受動態の疑問文〈be動詞＋主語＋過去分詞〉を続ける。\n過去の文なので was。bring の過去分詞は brought（bring – brought – brought）。" },

    { src: "5 ⑶", type: "blanks", words: W9_5,
      ja: "それらの美しいグラスはどこで作られているのですか。",
      template: "{} {} those beautiful glasses {}?",
      blanks: [
        { answer: "where", dummies: ["when", "what", "why", "how"] },
        { answer: "are", dummies: ["is", "do", "was", "does"] },
        { answer: "made", verb: true }
      ],
      note: "「どこで」は where。Where のあとに受動態の疑問文〈be動詞＋主語＋過去分詞〉を続ける。\n主語 those beautiful glasses は複数で現在の文なので、be動詞は are。make の過去分詞は made（make – made – made）。" },

    { src: "5 ⑷", type: "blanks", words: W9_5,
      ja: "この写真はいつ撮られたのですか。",
      template: "{} {} this photo {}?",
      blanks: [
        { answer: "when", dummies: ["where", "what", "why", "how"] },
        { answer: "was", dummies: ["did", "were", "is", "does"] },
        { answer: "taken", verb: true }
      ],
      note: "「いつ」は when。When のあとに受動態の疑問文〈be動詞＋主語＋過去分詞〉を続ける。\n過去の文なので was。写真を「撮る」は take で、過去分詞は taken（take – took – taken）。" },

    { src: "5 ⑸", type: "blanks", words: W9_5,
      ja: "その書類には，だれの名前が印刷されていますか。",
      template: "{} name {} {} on the contract?",
      blanks: [
        { answer: "whose", dummies: ["who", "what", "whom", "how"] },
        { answer: "is", dummies: ["are", "does", "do", "were"] },
        { answer: "printed", verb: true }
      ],
      note: "「だれの名前が」は whose name でひとまとまり。これが文の主語なので、そのあとに〈be動詞＋過去分詞〉をそのまま続ける。\nname は単数で現在の文なので is。print の過去分詞は printed。" },

    { src: "5 ⑹", type: "blanks", words: W9_5,
      ja: "ラジウムはだれによって発見されたのですか。",
      template: "Who {} radium {} {}?",
      blanks: [
        { answer: "was", dummies: ["did", "is", "were", "does"] },
        { answer: "discovered", verb: true },
        { answer: "by", dummies: ["from", "with", "for", "of"] }
      ],
      note: "「だれによって～されたか」は、Who のあとに受動態の疑問文を続け、最後に by を置いて Who ～ by? の形にする。\n過去の文なので was radium discovered。discover（発見する）の過去分詞は discovered。最後の by を忘れないこと。" },

    { src: "6 ⑴", type: "order",
      ja: "多くの新しいタイプの機械が発明され続けている。",
      before: "Many new types of", after: ".",
      chunks: ["being", "invented", "are", "machines"],
      answer: ["machines", "are", "being", "invented"],
      note: "「～され続けている」「～されているところだ」は、進行形の受動態〈be動詞＋being＋過去分詞〉で表す。\n主語 Many new types of machines は複数なので are being invented。invent は「発明する」。" },

    { src: "6 ⑵", type: "order",
      ja: "この本はたくさんの子どもたちに読まれてきた。",
      before: "This book", after: "many children.",
      chunks: ["been", "by", "has", "read"],
      answer: ["has", "been", "read", "by"],
      note: "「～されてきた」は、現在完了形の受動態〈have / has been＋過去分詞〉で表す。\n主語 This book は単数なので has been read。read の過去分詞は read（つづりは同じで、発音は「レッド」）。" },

    { src: "6 ⑶", type: "order",
      ja: "そのチケットはすでに売り切れている。",
      before: "The tickets", after: "out.",
      chunks: ["sold", "already", "have", "been"],
      answer: ["have", "already", "been", "sold"],
      note: "現在完了形の受動態〈have been＋過去分詞〉。sell out は「売り切る」なので、be sold out で「売り切れている」。sell の過去分詞は sold。\nalready（すでに）は have と been の間に置く。" },

    { src: "7 ⑴", type: "order",
      ja: "だれが MVP に選ばれるだろうか。",
      before: "", after: "MVP?",
      chunks: ["will", "who", "chosen", "be"],
      answer: ["who", "will", "be", "chosen"],
      note: "「だれが選ばれるだろうか」の「だれが」は文の主語。Who のあとに、未来の受動態〈will be＋過去分詞〉をそのまま続ける。\nchoose の過去分詞は chosen（choose – chose – chosen）。" },

    { src: "7 ⑵", type: "order",
      ja: "この道路はどれくらいの間，通行止めになりますか。",
      before: "", after: "?",
      chunks: ["will", "be", "how long", "closed", "this road"],
      answer: ["how long", "will", "this road", "be", "closed"],
      note: "how long は「どれくらいの間」と期間をたずねる表現。How long のあとに、未来の受動態の疑問文〈will＋主語＋be＋過去分詞〉を続ける。\n「通行止めになる」は be closed（閉じられる）で表す。" },

    { src: "7 ⑶", type: "order",
      ja: "その棚は今まで一度も使われたことがない。",
      before: "", after: "before.",
      chunks: ["been", "never", "the shelf", "used", "has"],
      answer: ["the shelf", "has", "never", "been", "used"],
      note: "「一度も～されたことがない」は、現在完了形の受動態に never を入れて〈has never been＋過去分詞〉で表す。\nnever は has と been の間に置く。before は「今までに」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】今朝，駅のトイレに入ろうとしたら…。",
      before: "The restroom", after: "I tried to use it.",
      chunks: ["was", "cleaned", "being", "when"],
      answer: ["was", "being", "cleaned", "when"],
      trans: "トイレは私が使おうとしたとき，清掃中だった。",
      note: "「～されているところだった」は、過去進行形の受動態〈was / were being＋過去分詞〉で表す。The restroom was being cleaned で「トイレは掃除されているところだった」。\nwhen I tried to use it は「私がそれを使おうとしたとき」。" }
  ]
});

// ===== Lesson 10　不定詞①（名詞用法） =====
LESSONS.push({ id: "10-1", title: "不定詞①（名詞用法）",
  inst: {
    form: "日本語に合うように，［ ］の語句を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form",
      ja: "雨の日に自転車に乗るのは危険だ。", verb: "ride",
      template: "{} is dangerous {} {} a bike on a rainy day.",
      answer: ["it", "to", "ride"],
      dummies: [["that", "to", "ride"], ["it", "to", "riding"], ["it", "for", "ride"], ["it", "to", "rode"]],
      note: "「～することは…だ」は〈It is … to＋動詞の原形〉で表せる。この It は「形式主語」といい，本当の主語 to ride a bike on a rainy day（雨の日に自転車に乗ること）の代わりに文の先頭に置かれている。It は「それは」とは訳さない。\nto のあとは必ず動詞の原形なので，to riding は誤り。" },

    { src: "1 ⑵", type: "form",
      ja: "船の上でクジラを見るのは楽しいにちがいない。", verb: "watch",
      template: "{} must be fun {} {} whales on the boat.",
      answer: ["it", "to", "watch"],
      dummies: [["this", "to", "watch"], ["it", "to", "watching"], ["it", "for", "watch"], ["it", "to", "watched"]],
      note: "⑴と同じく形式主語 It を使った文。It は to watch whales on the boat（船の上でクジラを見ること）を指す。must be ～ は「～にちがいない」。\nto のあとは動詞の原形 watch。" },

    { src: "1 ⑶", type: "form",
      ja: "これらすべての書類に記入することが必要ですか。", verb: "fill",
      template: "Is {} necessary {} {} out all these forms?",
      answer: ["it", "to", "fill"],
      dummies: [["this", "to", "fill"], ["it", "to", "filling"], ["it", "for", "fill"], ["that", "to", "fill"]],
      note: "形式主語 it を使った文の疑問文。It is necessary to ～ を疑問文にすると，be動詞を前に出して Is it necessary to ～? になる。\nfill out は「（書類）に記入する」。to のあとは原形 fill。" },

    { src: "1 ⑷", type: "form",
      ja: "外国にひとりで住むのはどんな感じですか。", verb: "live",
      template: "What is {} like {} {} alone in a foreign country?",
      answer: ["it", "to", "live"],
      dummies: [["that", "to", "live"], ["it", "to", "living"], ["it", "for", "live"], ["this", "to", "live"]],
      note: "What is A like? は「A はどのようなものか」。この A に形式主語 it を入れ，本当の主語 to live alone in a foreign country（外国にひとりで住むこと）をあとに置いた文。\nto のあとは原形 live。" },

    { src: "1 ⑸", type: "form",
      ja: "私の希望は世界のさまざまな文化を体験することだ。", verb: "experience",
      template: "My hope {} {} {} different cultures of the world.",
      answer: ["is", "to", "experience"],
      dummies: [["is", "for", "experience"], ["is", "to", "experiencing"], ["is", "to", "experienced"], ["are", "to", "experience"]],
      note: "〈主語＋is＋to＋動詞の原形〉で「（主語）は～することだ」という意味になる。to experience は「体験すること」で，is のあとにきて主語 My hope の内容を説明している（補語）。\nto のあとは原形なので，to experiencing は誤り。" },

    { src: "1 ⑹", type: "form",
      ja: "向上することは，変化することだ。", verb: "improve / change",
      template: "{} {} is {} {}.",
      answer: ["to", "improve", "to", "change"],
      dummies: [["to", "improve", "for", "change"], ["to", "improved", "to", "changed"], ["to", "improving", "to", "change"], ["for", "improve", "to", "change"]],
      note: "「～すること」は〈to＋動詞の原形〉で表せる。To improve（向上すること）を主語にし，is のあとに to change（変化すること）を置く。\nこの文は形式主語 It を使わず，to不定詞をそのまま主語にしている。文頭なので To は大文字で書く。" },

    { src: "2 ⑴", type: "form",
      ja: "彼女があなたに腹を立てるのは当然だ。", verb: "get",
      template: "It is natural {} {} {} {} angry with you.",
      answer: ["for", "her", "to", "get"],
      dummies: [["for", "she", "to", "get"], ["of", "her", "to", "get"], ["for", "her", "to", "got"], ["to", "her", "for", "get"]],
      note: "「（人）が～するのは…だ」は〈It is … for＋人＋to＋動詞の原形〉で表す。for her は「彼女が」という意味で，to get angry の動作をする人を表す（意味上の主語）。\nfor のあとは目的格なので，she ではなく her。get angry with ～ は「～に腹を立てる」。" },

    { src: "2 ⑵", type: "form",
      ja: "日本の学生が留学するのはよい考えだ。", verb: "Japanese students",
      template: "It’s a good idea {} {} {} {} {} abroad.",
      answer: ["for", "Japanese", "students", "to", "study"],
      dummies: [["of", "Japanese", "students", "to", "study"], ["for", "Japanese", "students", "studying", "to"], ["for", "Japanese", "students", "for", "study"], ["to", "Japanese", "students", "to", "study"]],
      note: "⑴と同じく〈It is … for＋人＋to＋動詞の原形〉の形。for Japanese students で「日本の学生が」，to study abroad で「留学すること」。\nIt’s は It is の短縮形。study abroad は「留学する」。" },

    { src: "3 ⑴", type: "order",
      ja: "駅の近くに住むのは便利だ。",
      before: "", after: "the station.",
      chunks: ["live", "convenient", "it", "to", "near", "is"],
      answer: ["it", "is", "convenient", "to", "live", "near"],
      note: "形式主語 It を使って It is convenient to ～ とする。It is のあとに「どうなのか」（convenient：便利な）を置き，そのあとに本当の主語 to live near the station（駅の近くに住むこと）を続ける。" },

    { src: "3 ⑵", type: "order",
      ja: "いちばん大切なことは，あなたが幸せであることだ。",
      before: "The most important thing is", after: ".",
      chunks: ["be", "for", "happy", "to", "you"],
      answer: ["for", "you", "to", "be", "happy"],
      note: "〈for＋人＋to＋動詞の原形〉で「（人）が～すること」。for you to be happy で「あなたが幸せであること」。to のあとは原形 be になる。\nis のあとにこのまとまりを置いて「いちばん大切なことは～だ」とする。" },

    { src: "3 ⑶", type: "order",
      ja: "【状況】友だちに「今度のお正月はどうするの」とたずねたら，こんな返事でした。",
      before: "My", after: "in Hawaii.",
      chunks: ["plan", "to", "spend", "is", "the New Year"],
      answer: ["plan", "is", "to", "spend", "the New Year"],
      trans: "私の予定はお正月をハワイで過ごすことです。",
      note: "〈主語＋is＋to＋動詞の原形〉「（主語）は～することだ」の形。My plan is to spend ～ で「私の予定は～を過ごすことだ」。spend は「（時間）を過ごす」。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】兄ははじめてマラソン大会に出場するために走り込んでいますが…。",
      before: "It won’t", after: "the marathon.",
      chunks: ["easy", "to", "for", "finish", "my brother", "be"],
      answer: ["be", "easy", "for", "my brother", "to", "finish"],
      trans: "兄がマラソンを完走することはたやすいことではないだろう。",
      note: "〈It is … for＋人＋to＋動詞の原形〉に won’t（= will not）を入れた未来の否定文。won’t のあとは原形なので be easy になる。\nそのあとに for my brother（兄が），to finish the marathon（マラソンを完走すること）の順に並べる。" }
  ]
});

LESSONS.push({ id: "10-2", title: "不定詞①（名詞用法）",
  inst: {
    form: "日本語に合うように，［ ］の語句を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    formPhrase: "日本語に合うように，不定詞を使って英文を完成させるとき，下線部に入る語句を選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form",
      ja: "私たちは，次の日曜日にまたあなたに会えることを希望しています。", verb: "hope",
      template: "We {} {} {} you again next Sunday.",
      answer: ["hope", "to", "see"],
      dummies: [["hope", "for", "see"], ["hope", "to", "seeing"], ["hope", "to", "saw"], ["hopes", "to", "see"]],
      note: "hope to ～ で「～することを望む」。〈to＋動詞の原形〉が hope の目的語になっている。to see you で「あなたに会うこと」（see の代わりに meet でもよい）。\nto のあとは原形なので，to seeing は誤り。" },

    { src: "5 ⑵", type: "form",
      ja: "雨が激しく降り始めた。", verb: "begin",
      template: "It {} {} {} hard.",
      answer: ["began", "to", "rain"],
      dummies: [["begin", "to", "rain"], ["began", "to", "rained"], ["began", "for", "rain"], ["began", "to", "raining"]],
      note: "begin to ～ で「～し始める」。過去の文なので begin の過去形 began（begin – began – begun）を使う。天気を表す文なので主語は It。\nto のあとは原形 rain。" },

    { src: "5 ⑶", type: "form",
      ja: "彼らはあなたのために歓迎パーティーを開くことを計画している。", verb: "hold",
      template: "They’re {} {} {} a welcome party for you.",
      answer: ["planning", "to", "hold"],
      dummies: [["plan", "to", "hold"], ["planning", "to", "holding"], ["planning", "for", "hold"], ["planning", "to", "held"]],
      note: "plan to ～ で「～することを計画する」。They’re（= They are）のあとなので，現在進行形 are planning にする。\nhold a party は「パーティーを開く」。to のあとは原形 hold。" },

    { src: "5 ⑷", type: "form",
      ja: "その赤ちゃんはまもなく歩けるようになるだろう。", verb: "learn",
      template: "The baby will {} {} {} soon.",
      answer: ["learn", "to", "walk"],
      dummies: [["learns", "to", "walk"], ["learn", "to", "walking"], ["learn", "for", "walk"], ["learn", "to", "walked"]],
      note: "learn to ～ で「～するようになる，～できるようになる」。will のあとは原形なので learn。\nlearns（s がつく形）や to walking は誤り。" },

    { src: "5 ⑸", type: "form",
      ja: "私は音を立てないようにした。", verb: "make",
      template: "I {} {} {} {} any noise.",
      answer: ["tried", "not", "to", "make"],
      dummies: [["tried", "to", "not", "make"], ["not", "tried", "to", "make"], ["tried", "not", "to", "making"], ["tried", "no", "to", "make"]],
      note: "try to ～ は「～しようと努める」。「～しないように努める」と否定するときは，to の直前に not を置いて try not to ～ にする。過去の文なので tried not to make。\nmake noise は「音を立てる」。not の位置に注意。" },

    { src: "5 ⑹", type: "form",
      ja: "彼は英語で気持ちを表現するのが難しいとわかった。", verb: "express",
      template: "He {} it hard {} {} his feelings in English.",
      answer: ["found", "to", "express"],
      dummies: [["found", "for", "express"], ["found", "to", "expressing"], ["found", "of", "express"], ["found", "to", "expressed"]],
      note: "find it … to ～ で「～するのは…だとわかる」。この it は「形式目的語」で，あとの to express his feelings in English（英語で気持ちを表現すること）を指す。\n過去の文なので found（find – found – found）。express one’s feelings は「気持ちを表現する」。" },

    { src: "6 ⑴", type: "form", inst: "formPhrase",
      ja: "「何を言えばよいのか」",
      template: "Sam didn’t know {} to her.",
      answer: ["what to say"],
      dummies: [["what to tell"], ["to say what"], ["what saying"], ["what to said"]],
      trans: "サムは彼女に何を言えばいいのかわからなかった。",
      note: "〈疑問詞＋to＋動詞の原形〉で「～すべきか，～したらよいか」という意味になる。what to say で「何を言えばよいのか」。\nあとに to her が続くので say を使う（say A to B「B に A を言う」）。tell は tell her のように to がいらないので，ここでは使えない。" },

    { src: "6 ⑵", type: "form", inst: "formPhrase",
      ja: "「だれを招くべきか」",
      template: "Let’s decide {} to the wedding.",
      answer: ["who to invite"],
      dummies: [["who invite to"], ["to invite who"], ["who to invited"], ["who inviting"]],
      trans: "結婚式にだれを招くべきか決めましょう。",
      note: "〈疑問詞＋to＋動詞の原形〉の形。who to invite で「だれを招くべきか」（who は whom でもよい）。\n疑問詞が先頭，そのあとに〈to＋動詞の原形〉の順。invite は「招待する」。" },

    { src: "6 ⑶", type: "form", inst: "formPhrase",
      ja: "「どのバスに乗るべきか」",
      template: "Can you tell me {}?",
      answer: ["which bus to take"],
      dummies: [["which to take bus"], ["to take which bus"], ["which bus taking"], ["which bus to took"]],
      trans: "どのバスに乗るべきか教えてくれますか。",
      note: "which bus（どのバス）をひとまとまりの疑問詞として使い，which bus to take で「どのバスに乗るべきか」。which と bus は離さない。\nバスなどに「乗る」は take。" },

    { src: "6 ⑷", type: "form", inst: "formPhrase",
      ja: "「～になる方法」",
      template: "I want to know {} an astronaut.",
      answer: ["how to become"],
      dummies: [["how become"], ["how to becoming"], ["to become how"], ["how to became"]],
      trans: "宇宙飛行士になる方法を知りたい。",
      note: "how to ～ で「～する方法，～のしかた」。how to become an astronaut で「宇宙飛行士になる方法」（become は be でもよい）。\nhow のあとの to を忘れないこと。astronaut は「宇宙飛行士」。" },

    { src: "6 ⑸", type: "form", inst: "formPhrase",
      ja: "「どこで待つべきか」",
      template: "The question is {} for him.",
      answer: ["where to wait"],
      dummies: [["where waiting"], ["to wait where"], ["where to waiting"], ["where wait"]],
      trans: "問題は彼をどこで待つべきかだ。",
      note: "where to ～ で「どこで～すべきか」。where to wait for him で「彼をどこで待つべきか」。wait for ～ は「～を待つ」。\nThe question is ～ は「問題は～だ」。" },

    { src: "6 ⑹", type: "form", inst: "formPhrase",
      ja: "「いつ来ればよいか」",
      template: "I’m not sure {} next.",
      answer: ["when to come"],
      dummies: [["when coming"], ["to come when"], ["when to came"], ["when come"]],
      trans: "次はいつ来ればよいか定かではない。",
      note: "when to ～ で「いつ～すればよいか」。when to come next で「次はいつ来ればよいか」。\nI’m not sure ～ は「～がよくわからない」。" },

    { src: "7 ⑴", type: "order",
      ja: "トムはケイトに謝ることを拒否している。",
      before: "", after: ".",
      chunks: ["apologize", "refuses", "Kate", "Tom", "to", "to"],
      answer: ["Tom", "refuses", "to", "apologize", "to", "Kate"],
      note: "refuse to ～ で「～することを拒否する」。apologize to ～ は「～に謝る」。\n1つ目の to は〈to＋動詞の原形〉の to，2つ目の to は「～に」を表す to。" },

    { src: "7 ⑵", type: "order",
      ja: "地震の際にどこに避難すべきかを確認するほうがいいですよ。",
      before: "You", after: "to in case of an earthquake.",
      chunks: ["evacuate", "should", "check", "to", "where"],
      answer: ["should", "check", "where", "to", "evacuate"],
      note: "where to ～「どこに～すべきか」を check（確認する）の目的語にする。should check で「確認するほうがよい」。\nevacuate to ～ は「～に避難する」なので，where to evacuate のあとに to が残る。in case of ～ は「～の場合に備えて」。" },

    { src: "7 ⑶", type: "order",
      ja: "【状況】医師から間食を控えるよう言われたので，私は…。",
      before: "I", after: "between meals.",
      chunks: ["not", "eat", "decided", "sweets", "to"],
      answer: ["decided", "not", "to", "eat", "sweets"],
      trans: "私は間食に甘いものを食べないと決めた。",
      note: "decide to ～ は「～することに決める」。「～しないことに決める」は，to の直前に not を置いて decide not to ～ にする。\n過去の文なので decided not to eat。between meals は「食事と食事の間に（間食に）」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】ルーシーは最近悩みがあり，だれかに相談したいのですが…。",
      before: "Lucy", after: "for advice.",
      chunks: ["ask", "know", "who", "doesn’t", "to"],
      answer: ["doesn’t", "know", "who", "to", "ask"],
      trans: "ルーシーはだれに助言を求めるべきかわからない。",
      note: "who to ～ で「だれに～すべきか」。who to ask を know の目的語にして，doesn’t know who to ask「だれに頼めばよいかわからない」とする。\nask for advice は「助言を求める」。" }
  ]
});

// ===== Lesson 11　不定詞②（形容詞用法・副詞用法） =====
const W11_1 = { box: "wake / catch / watch / find / get", choices: ["wake", "catch", "watch", "find", "get"] };
const W11_5 = { box: "eat / call / drive / trust / see", choices: ["eat", "call", "drive", "trust", "see"] };

LESSONS.push({ id: "11-1", title: "不定詞②（形容詞用法・副詞用法）",
  questions: [
    { src: "1 ⑴", type: "blanks", words: W11_1,
      ja: "彼女はテレビでサッカーの試合を見るために遅くまで起きていた。",
      template: "She stayed up late {} {} a soccer game on TV.",
      blanks: [
        { answer: "to", dummies: ["for", "in", "at", "on"] },
        { answer: "watch", verb: true }
      ],
      note: "〈to＋動詞の原形〉には「～するために」と目的を表す使い方がある（不定詞の副詞用法）。to watch a soccer game on TV で「テレビでサッカーの試合を見るために」。\nstay up late は「夜遅くまで起きている」。" },

    { src: "1 ⑵", type: "blanks", words: W11_1,
      ja: "通りでタクシーを止めるには，手を挙げさえすればよい。",
      template: "{} {} a taxi on the street, just raise your hand.",
      blanks: [
        { answer: "to", dummies: ["for", "in", "at", "on"] },
        { answer: "catch", verb: true }
      ],
      note: "目的を表す〈to＋動詞の原形〉「～するために」を文の最初に置いた形。To catch a taxi で「タクシーをつかまえるために」。文頭なので To は大文字。\n「タクシーを止める」は，英語では catch（つかまえる）を使って表す。" },

    { src: "1 ⑶", type: "blanks", words: W11_1,
      ja: "私たちはよい席を取るために劇場に急いだ。",
      template: "We hurried to the theater in {} {} {} good seats.",
      blanks: [
        { answer: "order", dummies: ["case", "fact", "time", "spite"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "get", verb: true }
      ],
      note: "in order to ～ も「～するために」と目的を表す。to ～ だけよりも，目的であることがはっきり伝わる。in order to get good seats で「よい席を取るために」。\nhurry to ～ は「～へ急ぐ」。" },

    { src: "1 ⑷", type: "blanks", words: W11_1,
      ja: "私は赤ちゃんを起こさないように静かに歩いた。",
      template: "I walked quietly so as {} {} {} the baby.",
      blanks: [
        { answer: "not", dummies: ["for", "no", "don’t", "without"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "wake", verb: true }
      ],
      note: "「～しないように」は，to の直前に not を置いて not to ～ とする。so as not to ～ / in order not to ～ の形で使うことが多い。so as not to wake the baby で「赤ちゃんを起こさないように」。\nnot の位置（to の前）に注意。" },

    { src: "1 ⑸", type: "blanks", words: W11_1,
      ja: "彼は家に帰って，玄関のドアが開いているのを見つけた。",
      template: "He came home {} {} the front door open.",
      blanks: [
        { answer: "to", dummies: ["for", "in", "at", "on"] },
        { answer: "find", verb: true }
      ],
      note: "〈to＋動詞の原形〉が「（その結果）～した」という結果を表すことがある。came home to find ～ で「家に帰ると～だとわかった」。\nfind A open は「A が開いているのに気づく」。" },

    { src: "2 ⑴", type: "order", inst: "orderMeaning",
      before: "Here are some", after: ".",
      chunks: ["show", "you", "to", "pictures"],
      answer: ["pictures", "to", "show", "you"],
      trans: "ここにあなたに見せたい写真があります。",
      note: "〈名詞＋to＋動詞の原形〉で「～するための（名詞）」「～すべき（名詞）」という意味になる（不定詞の形容詞用法）。pictures to show you で「あなたに見せるための写真」。\nto 以下は，前の名詞 pictures を後ろから説明している。" },

    { src: "2 ⑵", type: "order", inst: "orderMeaning",
      before: "I’ll make you", after: "if you are hungry.",
      chunks: ["eat", "hot", "to", "something"],
      answer: ["something", "hot", "to", "eat"],
      trans: "お腹がすいていたら，何か温かい食べ物を作りますよ。",
      note: "something を説明する形容詞は，something の後ろに置く（something hot：何か温かいもの）。さらに to eat（食べるための）も後ろに続けるので，something hot to eat の語順になる。\nmake A B は「A に B を作る」。" },

    { src: "2 ⑶", type: "order", inst: "orderMeaning",
      before: "We have a lot of", after: "at today’s meeting.",
      chunks: ["to", "about", "topics", "talk"],
      answer: ["topics", "to", "talk", "about"],
      trans: "今日の会議で話すべき話題がたくさんある。",
      note: "topics to talk about で「話すべき話題」。talk about topics（話題について話す）のように about が必要なので，最後に about が残る。about を忘れないこと。\na lot of は「たくさんの」。" },

    { src: "2 ⑷", type: "order", inst: "orderMeaning",
      before: "Who was", after: "a Nobel Prize?",
      chunks: ["win", "the first", "to", "woman"],
      answer: ["the first", "woman", "to", "win"],
      trans: "ノーベル賞をとった初の女性はだれですか。",
      note: "the first woman to win ～ で「～した最初の女性」。the first（最初の）がついた名詞を，to 以下が後ろから説明している。\nwin a Nobel Prize は「ノーベル賞をとる」。" },

    { src: "2 ⑸", type: "order", inst: "orderMeaning",
      before: "I didn’t", after: "a shower this morning.",
      chunks: ["take", "have", "to", "time"],
      answer: ["have", "time", "to", "take"],
      trans: "今朝はシャワーを浴びる時間がなかった。",
      note: "time to ～ で「～する時間」。have time to take a shower で「シャワーを浴びる時間がある」。didn’t のあとなので動詞は原形 have。\ntake a shower は「シャワーを浴びる」。" },

    { src: "3 ⑴", type: "order",
      ja: "エネルギーを節約するために，家を出るときエアコンを消しなさい。",
      before: "Turn off", after: "when you leave home.",
      chunks: ["save", "energy", "the air conditioner", "to"],
      answer: ["the air conditioner", "to", "save", "energy"],
      note: "目的を表す〈to＋動詞の原形〉「～するために」。Turn off the air conditioner（エアコンを消しなさい）のあとに，to save energy（エネルギーを節約するために）を続ける。\nsave は「節約する」。turn off は「（電気製品など）を消す」。" },

    { src: "3 ⑵", type: "order",
      ja: "私の町には，訪ねるべきおもしろい場所がいくつかある。",
      before: "There are", after: "in my town.",
      chunks: ["visit", "interesting", "to", "places", "a few"],
      answer: ["a few", "interesting", "places", "to", "visit"],
      note: "「訪ねるべき場所」は places to visit。places の前に interesting（おもしろい），さらにその前に a few（いくつかの）を置き，a few interesting places to visit の順にする。" },

    { src: "3 ⑶", type: "order",
      ja: "彼は寝坊しないように，目覚まし時計を３つかけた。",
      before: "In", after: ", he set three alarm clocks.",
      chunks: ["not", "oversleep", "order", "to"],
      answer: ["order", "not", "to", "oversleep"],
      note: "「～しないように」は in order not to ～。not は to の直前に置く。In order not to oversleep で「寝坊しないように」。\noversleep は「寝坊する」。set an alarm clock は「目覚まし時計をかける」。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】メモを取ろうと思って鉛筆がないのに気づき，隣の友人にたずねました。",
      before: "“Can you lend", after: "?”",
      chunks: ["write", "me", "to", "with", "something"],
      answer: ["me", "something", "to", "write", "with"],
      trans: "「何か書くものを貸してくれますか」",
      note: "lend A B で「A に B を貸す」。something to write with で「書くための道具（何か書くもの）」。with は「～を使って」という意味で，write with a pencil（鉛筆で書く）の with が残る。\n「何か書く内容」なら something to write，「書くための紙」なら something to write on になる。" }
  ]
});

LESSONS.push({ id: "11-2", title: "不定詞②（形容詞用法・副詞用法）",
  inst: {
    form: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "blanks", words: W11_5,
      ja: "こんなに夜遅くにあなたに電話をしてすみません。",
      template: "I’m {} {} {} you so late at night.",
      blanks: [
        { answer: "sorry", dummies: ["glad", "happy", "sad", "angry"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "call", verb: true }
      ],
      note: "〈感情を表す語＋to＋動詞の原形〉で「～して（その気持ちだ）」と，その気持ちになった原因を表す。sorry to call you で「あなたに電話をしてすみません」。\nI’m は I am の短縮形。" },

    { src: "5 ⑵", type: "blanks", words: W11_5,
      ja: "私は昨日，カフェであなたたち 2 人を見かけて驚いた。",
      template: "I was {} {} {} you two at the café yesterday.",
      blanks: [
        { answer: "surprised", dummies: ["sorry", "glad", "surprising", "surprise"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "see", verb: true }
      ],
      note: "surprised to see ～ で「～を見て驚いた」。to see が，驚いた原因を表している。\nsurprised（驚いて）のほか，glad / happy / sad なども同じ形で使える。" },

    { src: "5 ⑶", type: "blanks", words: W11_5,
      ja: "あの男を信じるなんて，私はばかだった。",
      template: "{} was foolish {} me {} {} that man.",
      blanks: [
        { answer: "it", dummies: ["this", "that", "there", "what"] },
        { answer: "of", dummies: ["for", "to", "at", "with"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "trust", verb: true }
      ],
      note: "〈It is＋人の性質を表す語＋of＋人＋to＋動詞の原形〉で「～するとは（人）は…だ」。foolish（ばかな）のように人の性質を表す語のときは，for ではなく of を使う。\n過去の文なので It was foolish of me to trust that man。" },

    { src: "5 ⑷", type: "blanks", words: W11_5,
      ja: "野菜をたくさん食べるとは，あなたは賢明だ。",
      template: "It is smart {} you {} {} a lot of vegetables.",
      blanks: [
        { answer: "of", dummies: ["for", "to", "at", "with"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "eat", verb: true }
      ],
      note: "⑶と同じく〈It is＋人の性質を表す語＋of＋人＋to＋動詞の原形〉の形。smart（賢い）は人の性質を表すので of you。\nfor を使うのは，easy / difficult など「行為の性質」を表す語のとき。" },

    { src: "5 ⑸", type: "blanks", words: W11_5,
      ja: "私たちを車で家まで送ってくれるとは，アンはとても親切だった。",
      template: "Ann was very {} {} {} us home.",
      blanks: [
        { answer: "kind", dummies: ["kindly", "kindness", "kinds", "kinder"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "drive", verb: true }
      ],
      note: "〈人＋be動詞＋kind to＋動詞の原形〉で「～するとは（人）は親切だ」。was very kind to drive us home で「私たちを車で家まで送ってくれるとはとても親切だった」。\ndrive A home は「A を車で家まで送る」。home は「家へ」という意味なので，to home とはしない。" },

    { src: "6 ⑴", type: "form",
      ja: "その水は飲んでも安全です。", verb: "safe",
      template: "The water is {} {} {}.",
      answer: ["safe", "to", "drink"],
      dummies: [["safe", "for", "drink"], ["safely", "to", "drink"], ["safe", "to", "drinking"], ["safety", "to", "drink"]],
      note: "〈安全・難しさなどを表す語＋to＋動詞の原形〉で「～するのに…だ」。safe to drink で「飲むのに安全だ（飲んでも安全だ）」。\nbe動詞のあとなので safe（形容詞）を使い，safely（副詞）は使わない。" },

    { src: "6 ⑵", type: "form",
      ja: "私の担任の先生は話しかけやすい。", verb: "talk",
      template: "My homeroom teacher is {} {} {} to.",
      answer: ["easy", "to", "talk"],
      dummies: [["easy", "to", "talking"], ["easily", "to", "talk"], ["easy", "for", "talk"], ["easy", "to", "talked"]],
      note: "easy to talk to で「話しかけやすい」。最後の to は，talk to my teacher（先生に話しかける）の to が残ったもの。\nto のあとは原形 talk。be動詞のあとなので easy（形容詞）を使い，easily（副詞）は使わない。" },

    { src: "6 ⑶", type: "form",
      ja: "最近私は忙しすぎて，映画を観ることができない。", verb: "watch",
      template: "I’m {} busy {} {} movies these days.",
      answer: ["too", "to", "watch"],
      dummies: [["very", "to", "watch"], ["too", "for", "watch"], ["too", "to", "watching"], ["so", "to", "watch"]],
      note: "〈too … to＋動詞の原形〉で「…すぎて～できない」。too busy to watch movies で「忙しすぎて映画を観ることができない」。\nvery busy to ～ という形はない。these days は「最近」。" },

    { src: "6 ⑷", type: "form",
      ja: "この本は子どもが読むには難しすぎる。", verb: "for",
      template: "This book is {} difficult {} a child to {}.",
      answer: ["too", "for", "read"],
      dummies: [["too", "of", "read"], ["very", "for", "read"], ["too", "for", "reading"], ["so", "for", "read"]],
      note: "〈too … for＋人＋to＋動詞の原形〉で「（人）が～するには…すぎる」。for a child は「子どもが」で，to read の動作をする人を表す（意味上の主語）。\ndifficult は人の性質ではなく行為の性質を表すので，of ではなく for を使う。" },

    { src: "6 ⑸", type: "form",
      ja: "彼はその天井に手が届くくらいの背の高さだった。", verb: "enough",
      template: "He was {} {} {} reach the ceiling.",
      answer: ["tall", "enough", "to"],
      dummies: [["enough", "tall", "to"], ["tall", "enough", "for"], ["enough", "tall", "for"], ["tall", "enough", "of"]],
      note: "〈… enough to＋動詞の原形〉で「～するのに十分…」「～できるほど…」。tall enough to reach ～ で「～に届くほど背が高い」。\nenough は形容詞（tall）の後ろに置く。enough tall は誤り。" },

    { src: "7 ⑴", type: "order",
      ja: "新しいチームメンバーが入って，みんなうれしかった。",
      before: "Everyone was", after: "team member.",
      chunks: ["have", "happy", "a", "to", "new"],
      answer: ["happy", "to", "have", "a", "new"],
      note: "感情の原因を表す〈happy to＋動詞の原形〉「～してうれしい」。happy to have a new team member で「新しいチームメンバーを持ってうれしい」。\nEveryone（みんな）は単数扱いなので be動詞は was。" },

    { src: "7 ⑵", type: "order",
      ja: "彼はプライドが高すぎて，人の話を聞かない。",
      before: "He is", after: "to others.",
      chunks: ["proud", "listen", "of", "too", "himself", "to"],
      answer: ["too", "proud", "of", "himself", "to", "listen"],
      note: "〈too … to＋動詞の原形〉「…すぎて～できない」の … に，proud of himself（自分を誇りに思う＝プライドが高い）が入った形。\nlisten to others は「人の話を聞く」。" },

    { src: "7 ⑶", type: "order",
      ja: "ひとりで海外を旅行するとはアヤは勇敢だ。",
      before: "It is", after: "alone.",
      chunks: ["travel", "Aya", "brave", "to", "of", "abroad"],
      answer: ["brave", "of", "Aya", "to", "travel", "abroad"],
      note: "〈It is＋人の性質を表す語＋of＋人＋to＋動詞の原形〉「～するとは（人）は…だ」。brave（勇敢な）は人の性質を表すので of Aya。\ntravel abroad は「海外を旅行する」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】妹の部屋がひどく散らかっています。理由を聞いたら，こんな返事が…。",
      before: "The reason for this", after: "a few words.",
      chunks: ["to", "hard", "is", "in", "explain"],
      answer: ["is", "hard", "to", "explain", "in"],
      trans: "これの理由を少ない言葉で説明するのは難しい。",
      note: "〈難しさを表す語＋to＋動詞の原形〉「～するのが…だ」。is hard to explain で「説明するのが難しい」。hard はここでは「難しい（= difficult）」の意味。\nin a few words は「少ない言葉で，簡潔に」。" }
  ]
});

// ===== Lesson 12　不定詞③（SVO＋不定詞） =====
const W12_5 = { box: "carry / open / help / stop / know / move", choices: ["carry", "open", "help", "stop", "know", "move"] };

LESSONS.push({ id: "12-1", title: "不定詞③（SVO＋不定詞）",
  inst: {
    form: "日本語に合うように，［ ］の語を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form",
      ja: "先生はみんなに落ち着くように言った。", verb: "calm",
      template: "The teacher {} everyone {} {} down.",
      answer: ["told", "to", "calm"],
      dummies: [["said", "to", "calm"], ["told", "to", "calming"], ["told", "for", "calm"], ["told", "to", "calmed"]],
      note: "〈tell＋人＋to＋動詞の原形〉で「（人）に～するように言う」。The teacher told everyone to calm down で「先生はみんなに落ち着くように言った」。\nsay は say to＋人 の形で使い，say＋人＋to ～ とはしない。calm down は「落ち着く」。" },

    { src: "1 ⑵", type: "form",
      ja: "あなたは私に何をしてほしいのですか。", verb: "do",
      template: "What do you {} {} {} {}?",
      answer: ["want", "me", "to", "do"],
      dummies: [["want", "I", "to", "do"], ["want", "to", "me", "do"], ["want", "me", "to", "doing"], ["want", "me", "for", "do"]],
      note: "〈want＋人＋to＋動詞の原形〉で「（人）に～してほしい」。What do you want me to do? で「あなたは私に何をしてほしいのですか」。\nwant のあとの「人」は目的格なので，I ではなく me。「人」は want と to の間に置く。" },

    { src: "1 ⑶", type: "form",
      ja: "私は彼に，そのドアを開けないように頼んだ。", verb: "open",
      template: "I {} him {} {} {} the door.",
      answer: ["asked", "not", "to", "open"],
      dummies: [["asked", "to", "not", "open"], ["said", "not", "to", "open"], ["asked", "not", "to", "opening"], ["asked", "no", "to", "open"]],
      note: "〈ask＋人＋to＋動詞の原形〉で「（人）に～するように頼む」。「～しないように」と頼むときは，to の直前に not を置いて ask＋人＋not to ～ とする。\nnot の位置（to の前）に注意。" },

    { src: "1 ⑷", type: "form",
      ja: "両親は私がネットの動画を見てほしくない。", verb: "watch",
      template: "My parents don’t {} me {} {} online videos.",
      answer: ["want", "to", "watch"],
      dummies: [["wants", "to", "watch"], ["want", "to", "watching"], ["want", "for", "watch"], ["want", "to", "watched"]],
      note: "〈want＋人＋to＋動詞の原形〉「（人）に～してほしい」の否定文。don’t のあとなので want は原形（wants は誤り）。\nto のあとは原形 watch。online videos は「ネットの動画」。" },

    { src: "2 ⑴", type: "order", inst: "orderMeaning",
      before: "You are", after: "ball in this park.",
      chunks: ["play", "not", "to", "allowed"],
      answer: ["not", "allowed", "to", "play"],
      trans: "この公園でボール遊びすることは許されていない。",
      note: "〈allow＋人＋to＋動詞の原形〉「（人）が～するのを許す」の受動態は，〈人＋be allowed to＋動詞の原形〉「～することを許されている」。否定の not は allowed の前に置いて are not allowed to play とする。\nplay ball は「ボール遊びをする」。" },

    { src: "2 ⑵", type: "order", inst: "orderMeaning",
      before: "No one", after: "during the examination.",
      chunks: ["speak", "permitted", "is", "to"],
      answer: ["is", "permitted", "to", "speak"],
      trans: "試験中にしゃべることはだれも許されていない。",
      note: "〈permit＋人＋to＋動詞の原形〉「（人）が～するのを許可する」の受動態〈be permitted to ～〉。No one is permitted to speak で「だれもしゃべることを許されていない」。\nNo one（だれも～ない）は単数扱いなので is。" },

    { src: "2 ⑶", type: "order", inst: "orderMeaning",
      before: "Hard work", after: "her dream university.",
      chunks: ["enabled", "to", "her", "enter"],
      answer: ["enabled", "her", "to", "enter"],
      trans: "一生懸命努力したおかげで，彼女は夢の大学に入学することができた。",
      note: "〈enable＋人＋to＋動詞の原形〉で「（人）が～することを可能にする」。Hard work enabled her to enter ～ は，直訳すると「一生懸命な努力が，彼女が～に入学することを可能にした」。\nenter は「（学校）に入学する」。" },

    { src: "2 ⑷", type: "order", inst: "orderMeaning",
      before: "I", after: "my English essay.",
      chunks: ["Tom", "check", "to", "got"],
      answer: ["got", "Tom", "to", "check"],
      trans: "トムに私の英作文を確認してもらった。",
      note: "〈get＋人＋to＋動詞の原形〉で「（人）に～してもらう」。got Tom to check my English essay で「トムに英作文を確認してもらった」。\n同じ意味の〈have＋人＋動詞の原形〉とちがい，get のときは to が必要。" },

    { src: "3 ⑴", type: "order",
      ja: "妹は私に宿題を手伝ってほしがった。",
      before: "My sister", after: "with her homework.",
      chunks: ["me", "to", "wanted", "her", "help"],
      answer: ["wanted", "me", "to", "help", "her"],
      note: "〈want＋人＋to＋動詞の原形〉「（人）に～してほしい」。wanted me to help her で「私に彼女を手伝ってほしがった」。\nhelp A with B は「A の B を手伝う」。" },

    { src: "3 ⑵", type: "order",
      ja: "医者は彼に，食べ過ぎないようにアドバイスした。",
      before: "The doctor", after: "too much.",
      chunks: ["eat", "him", "to", "advised", "not"],
      answer: ["advised", "him", "not", "to", "eat"],
      note: "〈advise＋人＋to＋動詞の原形〉で「（人）に～するように忠告する」。「～しないように」は to の直前に not を置いて advised him not to eat とする。\neat too much は「食べすぎる」。" },

    { src: "3 ⑶", type: "order",
      ja: "その男の子は，1 か月の間毎日，皿洗いをするように言われた。",
      before: "The boy", after: "every day for a month.",
      chunks: ["wash", "told", "to", "the dishes", "was"],
      answer: ["was", "told", "to", "wash", "the dishes"],
      note: "〈tell＋人＋to＋動詞の原形〉「（人）に～するように言う」の受動態は，〈人＋be told to＋動詞の原形〉「～するように言われる」。was told to wash the dishes で「皿洗いをするように言われた」。\nwash the dishes は「皿洗いをする」。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】駅への行き方がわからず困っている旅行者がいたので，声をかけました。",
      before: "“Would you", after: "the way to the station?”",
      chunks: ["to", "like", "you", "me", "show"],
      answer: ["like", "me", "to", "show", "you"],
      trans: "「駅への行き方をご案内しましょうか」",
      note: "〈would like＋人＋to＋動詞の原形〉で「（人）に～してほしい」（want よりていねいな言い方）。Would you like me to ～? で「私が～しましょうか」という申し出になる。\nshow A the way to ～ は「A に～への道を案内する」。" },

    { src: "3 ⑸", type: "order",
      ja: "【状況】部外者立ち入り禁止の部屋にうっかり入ったら，中にいた人にどなられました。",
      before: "“Who", after: "? Get out!”",
      chunks: ["come", "allowed", "in", "you", "to"],
      answer: ["allowed", "you", "to", "come", "in"],
      trans: "「だれが入っていいと許可したんだ？ 出ていけ！」",
      note: "〈allow＋人＋to＋動詞の原形〉「（人）が～するのを許す」。Who allowed you to come in? で「だれがあなたが入ることを許したのか」。Who が主語なので，そのあとにそのまま動詞 allowed を続ける。\ncome in は「入る」。" }
  ]
});

LESSONS.push({ id: "12-2", title: "不定詞③（SVO＋不定詞）",
  questions: [
    { src: "5 ⑴", type: "blanks", words: W12_5,
      ja: "あなたの新しい住所をすぐ私に知らせてください。",
      template: "Please {} me {} your new address at once.",
      blanks: [
        { answer: "let", dummies: ["tell", "allow", "get", "want"] },
        { answer: "know", verb: true }
      ],
      note: "〈let＋人＋動詞の原形〉で「（人）に～させてやる」。let me know で「私に知らせる」。let のあとは to のない動詞の原形。\ntell や allow は〈人＋to＋動詞の原形〉の形をとるので，to のない know とはつながらない。at once は「すぐに」。" },

    { src: "5 ⑵", type: "blanks", words: W12_5,
      ja: "警官はその男にスーツケースを開けさせた。",
      template: "The police officer {} the man {} his suitcase.",
      blanks: [
        { answer: "made", dummies: ["told", "wanted", "asked", "got"] },
        { answer: "open", verb: true }
      ],
      note: "〈make＋人＋動詞の原形〉で「（人）に（無理に）～させる」。made the man open his suitcase で「その男にスーツケースを開けさせた」。make のあとは to のない原形。\ntell や want は〈人＋to＋動詞の原形〉の形をとるので，ここには合わない。" },

    { src: "5 ⑶", type: "blanks", words: W12_5,
      ja: "だれかにこれらの箱を全部，下の階に運んでもらいます。",
      template: "I’ll {} someone {} all these boxes downstairs.",
      blanks: [
        { answer: "have", dummies: ["want", "ask", "tell", "get"] },
        { answer: "carry", verb: true }
      ],
      note: "〈have＋人＋動詞の原形〉で「（人）に～してもらう」。have someone carry ～ で「だれかに～を運んでもらう」。\nwant や ask は〈人＋to＋動詞の原形〉の形をとる。downstairs は「下の階へ」という意味なので，to はつけない。" },

    { src: "5 ⑷", type: "blanks", words: W12_5,
      ja: "彼女は，家の前で１台のタクシーが止まるのを見た。",
      template: "She {} a taxi {} in front of her house.",
      blanks: [
        { answer: "saw", dummies: ["looked", "showed", "seen", "watching"] },
        { answer: "stop", verb: true }
      ],
      note: "〈see＋人・もの＋動詞の原形〉で「（人・もの）が～するのを見る」。saw a taxi stop で「タクシーが止まるのを見た」。see のあとは to のない原形。\nlook は look at ～ の形で使うので，ここでは使えない。" },

    { src: "5 ⑸", type: "blanks", words: W12_5,
      ja: "クリスは父親の仕事を手伝わされた。",
      template: "Chris was {} {} {} his father with his work.",
      blanks: [
        { answer: "made", dummies: ["make", "making", "makes", "maked"] },
        { answer: "to", dummies: ["for", "of", "at", "on"] },
        { answer: "help", verb: true }
      ],
      note: "〈make＋人＋動詞の原形〉「（人）に～させる」を受動態にすると，〈人＋be made to＋動詞の原形〉「～させられる」となり，to が必要になる。was made to help で「手伝わされた」。\nhelp A with B は「A の B を手伝う」。" },

    { src: "5 ⑹", type: "blanks", words: W12_5,
      ja: "私たちはユキが新しいアパートに引っ越すのを手伝った。",
      template: "We helped {} {} into her new apartment.",
      blanks: [
        { answer: "Yuki", dummies: ["for", "of", "to", "with"] },
        { answer: "move", verb: true }
      ],
      note: "〈help＋人＋動詞の原形〉で「（人）が～するのを手伝う」（help＋人＋to＋動詞の原形 でもよい）。helped Yuki move into ～ で「ユキが～に引っ越すのを手伝った」。\nmove into ～ は「～に引っ越す」。" },

    { src: "6 ⑴", type: "form", inst: "translate",
      ja: "It’s pleasant to be sitting here with you.",
      template: "ここであなたと（{}）。",
      answer: ["座っているのは楽しい"],
      dummies: [["座っていたのは楽しかった"], ["座るのは楽しいだろう"], ["座ったことは楽しかった"], ["座らせるのは楽しい"]],
      note: "〈to be＋～ing〉は不定詞の進行形で，「（今）～していること」を表す。It’s pleasant to be sitting here with you. は「ここであなたと（今）座っているのは楽しい」。\nIt’s（= It is）は現在の文なので，「楽しかった」（過去）や「楽しいだろう」（未来）にはならない。" },

    { src: "6 ⑵", type: "form", inst: "translate",
      ja: "I don’t like to be talked to when I’m studying.",
      template: "私は勉強中に（{}）。",
      answer: ["話しかけられるのが好きではない"],
      dummies: [["話しかけるのが好きではない"], ["話しかけられたことがない"], ["話しかけられたくなかった"], ["話すのが好きではない"]],
      note: "〈to be＋過去分詞〉は不定詞の受動態で，「～されること」を表す。to be talked to で「話しかけられること」。don’t like は「好きではない」。\nto talk to なら「話しかけること」になる。when I’m studying は「勉強しているとき」。" },

    { src: "6 ⑶", type: "form", inst: "translate",
      ja: "She seems to have forgotten my name.",
      template: "彼女は（{}）。",
      answer: ["私の名前を忘れてしまったようだ"],
      dummies: [["私の名前を忘れているように見えた"], ["私の名前を忘れそうだ"], ["私の名前を忘れるつもりだ"], ["私の名前を忘れたかった"]],
      note: "〈seem to have＋過去分詞〉は「～したようだ」と，前にしたことについて今そう見えることを表す。seems to have forgotten で「（前に）忘れてしまったようだ」。\nseems は現在なので「見えた」ではなく「ようだ」。seem to forget なら「忘れるようだ」になる。" },

    { src: "7 ⑴", type: "order",
      ja: "彼女はいつも家の裏庭で，イヌを自由に走らせている。",
      before: "She always", after: "the backyard of her house.",
      chunks: ["her dog", "run freely", "in", "lets"],
      answer: ["lets", "her dog", "run freely", "in"],
      note: "〈let＋人・もの＋動詞の原形〉で「（人・もの）に（自由に）～させてやる」。lets her dog run freely で「イヌを自由に走らせている」。let のあとは to のない原形。\nShe が主語で現在の文なので lets。" },

    { src: "7 ⑵", type: "order",
      ja: "私はレイが失敗について文句を言うのを聞いたことがない。",
      before: "I’ve", after: "her failures.",
      chunks: ["complain", "Rei", "heard", "about", "never"],
      answer: ["never", "heard", "Rei", "complain", "about"],
      note: "〈hear＋人＋動詞の原形〉で「（人）が～するのを聞く」。I’ve never heard Rei complain about ～ で「レイが～について文句を言うのを聞いたことがない」。\nnever は have と過去分詞の間に置く。complain about ～ は「～について不満を言う」。" },

    { src: "7 ⑶", type: "order",
      ja: "ダンは，何かほかのことを考えているようだ。",
      before: "Dan", after: "something else.",
      chunks: ["thinking", "to", "of", "seems", "be"],
      answer: ["seems", "to", "be", "thinking", "of"],
      note: "〈seem to＋動詞の原形〉で「～するようだ」。進行形を入れて seem to be ～ing にすると，「（今）～しているようだ」になる。seems to be thinking of ～ で「～のことを考えているようだ」。\nthink of ～ は「～について考える」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】迷っていた友人がとうとう留学する決心をしたので，理由をたずねました。",
      before: "What", after: "abroad?",
      chunks: ["you", "made", "to", "decide", "study"],
      answer: ["made", "you", "decide", "to", "study"],
      trans: "何があなたに留学を決意させたのですか。",
      note: "〈make＋人＋動詞の原形〉「（人）に～させる」。What made you decide ～? は，直訳すると「何があなたに～を決意させたのか」。What が主語なので，そのあとにそのまま made を続ける。\ndecide to study abroad は「留学することを決める」。" }
  ]
});

// ===== Lesson 13　動名詞 =====
const W13_1 = { box: "drive / draw / live / travel / get" };
const W13_6 = { box: "treat / meet / miss / laugh / catch" };

LESSONS.push({ id: "13-1", title: "動名詞",
  inst: {
    box1: "日本語に合うように，枠内の動詞を1回ずつ使って動名詞を使った英文を完成させるとき，（ ）に入る語を選びなさい。",
    verb2: "日本語に合うように，［ ］の語を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "box1", words: W13_1,
      ja: "「十分な睡眠を得ること」",
      template: "{} enough sleep is necessary for good health.",
      answer: ["getting"],
      dummies: [["get"], ["geting"], ["gets"], ["got"]],
      trans: "十分な睡眠を得ることは良好な健康に必要だ。",
      note: "動詞の -ing 形（動名詞）は「～すること」という意味で，名詞のように使える。ここでは Getting enough sleep（十分な睡眠を得ること）が文の主語。\nget の -ing 形は t を重ねて getting。" },

    { src: "1 ⑵", type: "form", inst: "box1", words: W13_1,
      ja: "「新しい場所へ旅すること」",
      template: "{} to new places gives me a lot of pleasure.",
      answer: ["traveling"],
      dummies: [["travel"], ["travels"], ["traveled"], ["to traveling"]],
      trans: "新しい場所へ旅することは私にたくさんの楽しみを与えてくれる。",
      note: "動名詞 Traveling to new places（新しい場所へ旅すること）が主語。動名詞の主語は単数扱いなので，動詞は gives。\npleasure は「喜び，楽しみ」。" },

    { src: "1 ⑶", type: "form", inst: "box1", words: W13_1,
      ja: "「観光バスを運転すること」",
      template: "My uncle’s job is {} a sightseeing bus.",
      answer: ["driving"],
      dummies: [["driveing"], ["drive"], ["drives"], ["drove"]],
      trans: "おじの仕事は観光バスを運転することだ。",
      note: "動名詞は is のあとに置いて「～することだ」という補語にもなる。driving a sightseeing bus で「観光バスを運転すること」。\ndrive の -ing 形は e をとって driving。" },

    { src: "1 ⑷", type: "form", inst: "box1", words: W13_1,
      ja: "「花の絵を描くこと」",
      template: "“What’s your hobby?” “It is {} pictures of flowers.”",
      answer: ["drawing"],
      dummies: [["draw"], ["drawn"], ["draws"], ["drew"]],
      trans: "「趣味は何ですか。」「花の絵を描くことです。」",
      note: "動名詞 drawing pictures of flowers（花の絵を描くこと）が is のあとの補語。\ndraw は「（線で）絵を描く」。" },

    { src: "1 ⑸", type: "form", inst: "box1", words: W13_1,
      ja: "「住むこと」",
      template: "It’s convenient {} near the sea because I can go swimming anytime.",
      answer: ["living"],
      dummies: [["liveing"], ["live"], ["lives"], ["lived"]],
      trans: "いつでも泳ぎに行くことができるので，海の近くに住むのは便利だ。",
      note: "It は形式主語で，本当の主語は living near the sea（海の近くに住むこと）。動名詞も形式主語 it で後ろに回すことがある。\nlive の -ing 形は e をとって living。" },

    { src: "2 ⑴", type: "form", inst: "verb2",
      ja: "私のイヌはボールで遊ぶのが大好きだ。", verb: "love",
      template: "My dog {} {} with a ball.",
      answer: ["loves", "playing"],
      dummies: [["love", "playing"], ["loves", "play"], ["loves", "played"], ["loves", "to playing"]],
      note: "動名詞は動詞の目的語にもなる。love doing で「～することが大好きだ」。主語 My dog は3人称単数なので loves。" },

    { src: "2 ⑵", type: "form", inst: "verb2",
      ja: "ナンシーは人前で話すことが苦手だ。", verb: "poor",
      template: "Nancy is {} {} {} in front of people.",
      answer: ["poor", "at", "speaking"],
      dummies: [["poor", "at", "speak"], ["poor", "in", "speaking"], ["poor", "to", "speak"], ["poorly", "at", "speaking"]],
      note: "be poor at doing で「～するのが苦手だ」（反対は be good at doing）。前置詞 at のあとに動詞を置くときは動名詞にする。" },

    { src: "2 ⑶", type: "form", inst: "verb2",
      ja: "私はここでしばらく待つのはかまいません。", verb: "mind",
      template: "I don’t {} {} here for a while.",
      answer: ["mind", "waiting"],
      dummies: [["mind", "to wait"], ["mind", "wait"], ["minds", "waiting"], ["mind", "waited"]],
      note: "mind（～するのをいやがる）は目的語に動名詞をとる動詞。don’t mind doing で「～するのはかまわない」。\nmind のあとに to不定詞は使えない。" },

    { src: "2 ⑷", type: "form", inst: "verb2",
      ja: "彼女はまだスーツケースの荷造りを終えていない。", verb: "pack",
      template: "She hasn’t {} {} her suitcase yet.",
      answer: ["finished", "packing"],
      dummies: [["finished", "to pack"], ["finish", "packing"], ["finished", "pack"], ["finishing", "packing"]],
      note: "finish doing で「～し終える」。finish は目的語に動名詞をとる動詞なので，to pack とはしない。\nhasn’t のあとは過去分詞 finished。" },

    { src: "2 ⑸", type: "form", inst: "verb2",
      ja: "あなたは私たちのチームに入ることに興味がありますか。", verb: "join",
      template: "Are you interested {} {} our team?",
      answer: ["in", "joining"],
      dummies: [["in", "join"], ["to", "joining"], ["on", "joining"], ["in", "to join"]],
      note: "be interested in doing で「～することに興味がある」。前置詞 in のあとは動名詞 joining。" },

    { src: "2 ⑹", type: "form", inst: "verb2",
      ja: "彼は歯磨きをせずに寝た。", verb: "without",
      template: "He went to bed {} {} his teeth.",
      answer: ["without", "brushing"],
      dummies: [["without", "brush"], ["without", "to brush"], ["with", "brushing"], ["without", "brushed"]],
      note: "without doing で「～せずに」。without は前置詞なので，あとの動詞は動名詞にする。\nbrush one’s teeth は「歯を磨く」。" },

    { src: "3 ⑴", type: "order",
      ja: "1 週間後，私は日記を毎日書くことをあきらめた。",
      before: "After a week, I", after: "day.",
      chunks: ["in my diary", "gave up", "every", "writing"],
      answer: ["gave up", "writing", "in my diary", "every"],
      note: "give up doing で「～することをあきらめる」。give up は目的語に動名詞をとる。\n「日記をつける」は write in a diary（または keep a diary）。" },

    { src: "3 ⑵", type: "order",
      ja: "私は将来，ソフトウェアエンジニアになることを考えている。",
      before: "I’m", after: "in the future.",
      chunks: ["becoming", "of", "software engineer", "thinking", "a"],
      answer: ["thinking", "of", "becoming", "a", "software engineer"],
      note: "think of doing で「～することを考える」。前置詞 of のあとなので動名詞 becoming。I’m thinking は現在進行形。" },

    { src: "3 ⑶", type: "order",
      ja: "バスに乗り損ねるというのは，遅刻の言い訳としてはよくない。",
      before: "", after: "for being late.",
      chunks: ["the bus", "a good excuse", "missing", "isn’t"],
      answer: ["missing", "the bus", "isn’t", "a good excuse"],
      note: "動名詞 Missing the bus（バスに乗り損ねること）が主語。動名詞の主語は単数扱いなので isn’t。\nfor being late の being も動名詞（前置詞 for のあと）。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】エミリーがもっと日本語を話せるようになりたいと言うので，こう提案しました。",
      before: "“You can", after: "after school.”",
      chunks: ["me", "speaking", "with", "practice", "Japanese"],
      answer: ["practice", "speaking", "Japanese", "with", "me"],
      trans: "「放課後，私と日本語を話す練習ができますよ」",
      note: "practice doing で「～することを練習する」。practice は目的語に動名詞をとる動詞。" }
  ]
});

LESSONS.push({ id: "13-2", title: "動名詞",
  inst: {
    fill5: "日本語に合うように，（ ）に入る適切な語の組み合わせを選びなさい。",
    box6: "日本語に合うように，枠内の動詞を1回ずつ使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "fill5",
      ja: "私は，彼が私といるときにスマホを使っても気にしない。",
      template: "I don’t mind {} {} his smartphone when he is with me.",
      answer: ["his", "using"],
      dummies: [["he", "using"], ["his", "use"], ["he", "uses"], ["his", "to use"]],
      note: "動名詞の動作をする人（意味上の主語）は，動名詞の前に所有格（his）または目的格（him）で置く。his using で「彼が使うこと」。\n主格の he は使わない。" },

    { src: "5 ⑵", type: "form", inst: "fill5",
      ja: "彼らが試合に勝つ見込みはありますか。",
      template: "Is there any chance of {} {} the game?",
      answer: ["their", "winning"],
      dummies: [["they", "winning"], ["their", "wining"], ["their", "win"], ["they", "win"]],
      note: "意味上の主語 their（彼らが）を動名詞の前に置く（them でもよい）。win の -ing 形は n を重ねて winning。\nchance of A は「A の見込み」。" },

    { src: "5 ⑶", type: "form", inst: "fill5",
      ja: "彼女は，十分な経験がないことを心配していた。",
      template: "She was worried about {} {} enough experience.",
      answer: ["not", "having"],
      dummies: [["having", "not"], ["no", "having"], ["not", "have"], ["don’t", "having"]],
      note: "動名詞を否定するときは，動名詞の直前に not を置いて not doing とする。not having で「持っていないこと」。\nbe worried about A は「A を心配している」。" },

    { src: "5 ⑷", type: "form", inst: "fill5",
      ja: "朝食を食べないことは，あなたの学校での勉強に影響する可能性がある。",
      template: "{} {} breakfast can affect your studies in school.",
      answer: ["not", "eating"],
      dummies: [["don’t", "eating"], ["eating", "not"], ["not", "eat"], ["no", "eat"]],
      note: "動名詞の否定 Not eating（食べないこと）が文の主語になっている（Not having でもよい）。\naffect は「～に影響する」。" },

    { src: "5 ⑸", type: "form", inst: "fill5",
      ja: "エラは隣人の子どもたちが騒がしいことについて文句を言った。",
      template: "Ella complained of the neighbor’s {} {} noisy.",
      answer: ["children", "being"],
      dummies: [["children", "be"], ["children", "were"], ["child", "being"], ["children", "been"]],
      note: "the neighbor’s children（隣人の子どもたち）が，動名詞 being noisy（騒がしいこと）の意味上の主語。\ncomplain of A は「A について不平を言う」。" },

    { src: "6 ⑴", type: "form", inst: "box6", words: W13_6,
      ja: "そのどろぼうは，捕まえられるのを避けられないだろう。",
      template: "The thief won’t be able to avoid {} {}.",
      answer: ["being", "caught"],
      dummies: [["being", "catched"], ["been", "caught"], ["to be", "caught"], ["being", "catching"]],
      note: "「～されること」は動名詞の受動態〈being＋過去分詞〉で表す。being caught で「捕まえられること」。\navoid doing は「～することを避ける」。catch の過去分詞は caught。" },

    { src: "6 ⑵", type: "form", inst: "box6", words: W13_6,
      ja: "私たちは子どものように扱われるのにうんざりしている。",
      template: "We are tired of {} {} like children.",
      answer: ["being", "treated"],
      dummies: [["been", "treated"], ["being", "treating"], ["to be", "treated"], ["be", "treated"]],
      note: "前置詞 of のあとに動名詞の受動態 being treated（扱われること）を置く。\nbe tired of A は「A にうんざりしている」。" },

    { src: "6 ⑶", type: "form", inst: "box6", words: W13_6,
      ja: "たいていの人は笑われるのが好きではない。",
      template: "Most people don’t like {} {} at.",
      answer: ["being", "laughed"],
      dummies: [["being", "laughing"], ["been", "laughed"], ["be", "laughed"], ["having", "laughed"]],
      note: "laugh at A（A を笑う）の受動態は be laughed at（笑われる）。動名詞にすると being laughed at（笑われること）。at を忘れないこと。" },

    { src: "6 ⑷", type: "form", inst: "box6", words: W13_6,
      ja: "私は以前その女の子に会ったことを確信している。",
      template: "I’m sure of {} {} the girl before.",
      answer: ["having", "met"],
      dummies: [["having", "meet"], ["have", "met"], ["having", "meeting"], ["being", "met"]],
      note: "確信しているのは今，会ったのはそれより前なので，動名詞の完了形〈having＋過去分詞〉を使う。having met で「会ったこと」。\nbe sure of A は「A を確信している」。" },

    { src: "6 ⑸", type: "form", inst: "box6", words: W13_6,
      ja: "彼は留学の機会を逃したことを後悔している。",
      template: "He regrets {} {} the chance to study abroad.",
      answer: ["having", "missed"],
      dummies: [["having", "miss"], ["being", "missed"], ["have", "missed"], ["to have", "missed"]],
      note: "後悔しているのは今，機会を逃したのはそれより前なので，動名詞の完了形 having missed（逃したこと）を使う。\nregret doing は「～したことを後悔する」。" },

    { src: "7 ⑴", type: "order",
      ja: "私が映画で主演するなんて想像できますか。",
      before: "Can", after: "a movie?",
      chunks: ["imagine", "you", "in", "me", "starring"],
      answer: ["you", "imagine", "me", "starring", "in"],
      note: "imagine doing で「～することを想像する」。me は starring の意味上の主語（私が主演すること）。\nstar in A は「A に主演する」。" },

    { src: "7 ⑵", type: "order",
      ja: "ミスのことで私を責めないでくれてありがとう。",
      before: "Thank", after: "for the mistake.",
      chunks: ["not", "me", "for", "blaming", "you"],
      answer: ["you", "for", "not", "blaming", "me"],
      note: "Thank you for doing で「～してくれてありがとう」。動名詞の否定は not を前に置いて not blaming（責めないこと）。\nblame A for B は「B のことで A を責める」。" },

    { src: "7 ⑶", type: "order",
      ja: "【状況】図書館で，隣の人たちの話し声が気になったので，思い切って言いました。",
      before: "“Would", after: "?”",
      chunks: ["talking", "not", "in", "mind", "the library", "you"],
      answer: ["you", "mind", "not", "talking", "in", "the library"],
      trans: "「図書館では話をしないでもらえませんか」",
      note: "Would you mind doing ～? で「～していただけませんか」（直訳は「～するのはおいやですか」）。not talking（話さないこと）なので「話をしないでもらえませんか」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】難しい交換留学プログラムの審査に合格した友だちに…。",
      before: "“Congratulations on", after: "!”",
      chunks: ["being", "the exchange program", "accepted", "to"],
      answer: ["being", "accepted", "to", "the exchange program"],
      trans: "「交換留学プログラムの合格おめでとう！」",
      note: "Congratulations on A で「A おめでとう」。前置詞 on のあとに動名詞の受動態 being accepted（受け入れられること）を置く。" }
  ]
});

// ===== Lesson 14　分詞① =====
LESSONS.push({ id: "14-1", title: "分詞①",
  inst: {
    choose1: "日本語に合うように，（ ）に入る適切な語を選びなさい。",
    verb2: "日本語に合うように，［ ］の語を適切な分詞の形にして前置詞を補うとき，下線部に入る語句を選びなさい。",
    order3: "日本語，または【状況】に合うように，語句を並べかえなさい。ただし，分詞は適切な形を選ぶこと（使わない語句が1つあります）。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "choose1",
      ja: "その映画は退屈で，私はすぐに眠ってしまった。",
      template: "The movie was {} and I fell asleep soon.",
      answer: ["boring"],
      dummies: [["bored"]],
      note: "-ing 形の形容詞は「（人を）～させるような」，-ed 形（過去分詞）の形容詞は「（人が）～させられた」という意味。\n映画は人を退屈させるものなので boring（退屈な）。bored は「（人が）退屈した」。" },

    { src: "1 ⑵", type: "form", inst: "choose1",
      ja: "彼らはその製品の品質に満足した。",
      template: "They were {} with the quality of the product.",
      answer: ["pleased"],
      dummies: [["pleasing"]],
      note: "主語 They（彼ら）は満足させられた側なので，過去分詞 pleased（満足した）。\nbe pleased with A は「A に満足している」。pleasing は「（人を）喜ばせるような」。" },

    { src: "1 ⑶", type: "form", inst: "choose1",
      ja: "興味があるなら，一緒に来てもいいですよ。",
      template: "You can come with me if you are {}.",
      answer: ["interested"],
      dummies: [["interesting"]],
      note: "主語 you は興味をもたされる側なので，過去分詞 interested（興味をもった）。\ninteresting は「（人に）興味をもたせるような，おもしろい」。" },

    { src: "1 ⑷", type: "form", inst: "choose1",
      ja: "ニュージーランドの自然景観は驚くべきものだ。",
      template: "New Zealand’s natural landscape is {}.",
      answer: ["amazing"],
      dummies: [["amazed"]],
      note: "景観は人を驚かせるものなので，-ing 形の amazing（驚くべき）。amazed は「（人が）驚いた」。" },

    { src: "1 ⑸", type: "form", inst: "choose1",
      ja: "私の両親は私の試験結果にがっかりした。",
      template: "My parents were {} with my exam result.",
      answer: ["disappointed"],
      dummies: [["disappointing"]],
      note: "主語 My parents はがっかりさせられた側なので，過去分詞 disappointed（がっかりした）。\ndisappointing は「（人を）がっかりさせるような」。" },

    { src: "1 ⑹", type: "form", inst: "choose1",
      ja: "彼女は私の質問に衝撃的な回答をした。",
      template: "She gave a {} answer to my question.",
      answer: ["shocking"],
      dummies: [["shocked"]],
      note: "回答は人に衝撃を与えるものなので，-ing 形の shocking（衝撃的な）。shocked は「（人が）ショックを受けた」。" },

    { src: "2 ⑴", type: "form", inst: "verb2",
      ja: "だれもがそのビンテージ車の値段に驚いた。", verb: "surprise",
      template: "Everyone was {} the price of the vintage car.",
      answer: ["surprised at"],
      dummies: [["surprising at"], ["surprise at"], ["surprising to"], ["surprised in"]],
      note: "「（人が）驚いた」は過去分詞 surprised。be surprised at A で「A に驚く」（by でもよい）。" },

    { src: "2 ⑵", type: "form", inst: "verb2",
      ja: "大部分のお客様は私たちのサービスに満足している。", verb: "satisfy",
      template: "Most customers are {} our service.",
      answer: ["satisfied with"],
      dummies: [["satisfying with"], ["satisfyed with"], ["satisfied at"], ["satisfy with"]],
      note: "「（人が）満足した」は過去分詞 satisfied。be satisfied with A で「A に満足している」。\nsatisfy の過去分詞は y を i に変えて satisfied。" },

    { src: "2 ⑶", type: "form", inst: "verb2",
      ja: "私たちは皆，あなたの健康を心配している。", verb: "worry",
      template: "All of us are {} your health.",
      answer: ["worried about"],
      dummies: [["worrying about"], ["worryed about"], ["worried at"], ["worry about"]],
      note: "「（人が）心配している」は過去分詞 worried。be worried about A で「A を心配している」。" },

    { src: "3 ⑴", type: "order", inst: "order3",
      ja: "ネットで動物の動画を見るのは楽しい。",
      before: "It", after: "of animals online.",
      chunks: ["amusing", "watch", "to", "is", "videos"], extra: ["amused"],
      answer: ["is", "amusing", "to", "watch", "videos"],
      note: "It は形式主語で，本当の主語は to watch videos of animals online。見ることは人を楽しませるものなので amusing（楽しい，おもしろい）。" },

    { src: "3 ⑵", type: "order", inst: "order3",
      ja: "彼はおびえた声で「いいえ」と答えた。",
      before: "He", after: "voice.",
      chunks: ["frightened", "“no”", "a", "answered", "in"], extra: ["frightening"],
      answer: ["answered", "“no”", "in", "a", "frightened"],
      note: "分詞1語で名詞を説明するときは，名詞の前に置く。a frightened voice で「おびえた声」。\na frightening voice なら「（人を）こわがらせる声」になる。" },

    { src: "3 ⑶", type: "order", inst: "order3",
      ja: "【状況】明日から楽しみにしている修学旅行。生徒たちはもうそわそわしています。",
      before: "The students", after: "the school trip.",
      chunks: ["excited", "about", "are", "very"], extra: ["exciting"],
      answer: ["are", "very", "excited", "about"],
      trans: "生徒たちは修学旅行にとてもわくわくしている。",
      note: "生徒たちはわくわくさせられている側なので過去分詞 excited。be excited about A で「A にわくわくしている」。" },

    { src: "3 ⑷", type: "order", inst: "order3",
      ja: "【状況】先生からおもしろいとすすめられた本を何冊か読んだのですが…。",
      before: "None", after: "me.",
      chunks: ["interesting", "to", "the books", "of", "was"], extra: ["interested"],
      answer: ["of", "the books", "was", "interesting", "to"],
      trans: "その本のどれも私にはおもしろくなかった。",
      note: "none of A で「（3つ以上の）A のどれも～ない」。本は人に興味をもたせるものなので interesting。\ninteresting to me で「私にとっておもしろい」。" }
  ]
});

LESSONS.push({ id: "14-2", title: "分詞①",
  inst: {
    verb5: "［ ］の動詞を適切な形にして英文を完成させるとき，（ ）に入る語を選びなさい。",
    order6: "語句を並べかえて英文を完成させなさい。ただし，分詞は適切な形を選ぶこと（使わない語句が1つあります）。",
    verb7: "日本語に合うように，［ ］の語を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    order8: "日本語，または【状況】に合うように，語句を並べかえなさい。ただし，分詞は適切な形を選ぶこと（使わない語句が1つあります）。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "verb5",
      verb: "live",
      template: "This is a story about a rabbit family {} in the forest.",
      answer: ["living"],
      dummies: [["lived"], ["lives"], ["live"], ["to living"]],
      trans: "これは森に住むウサギの家族の話です。",
      note: "分詞が語句をともなって名詞を説明するときは，名詞の後ろに置く。ウサギの家族は「住んでいる」側なので現在分詞 living。\na rabbit family living in the forest で「森に住むウサギの家族」。" },

    { src: "5 ⑵", type: "form", inst: "verb5",
      verb: "throw",
      template: "We picked up trash {} away on the street.",
      answer: ["thrown"],
      dummies: [["throwing"], ["threw"], ["throwed"], ["throw"]],
      trans: "私たちは通りに捨てられたごみを拾った。",
      note: "ごみは「捨てられた」側なので過去分詞 thrown。throw の過去分詞は thrown（throw – threw – thrown）。\nthrow away は「～を捨てる」。" },

    { src: "5 ⑶", type: "form", inst: "verb5",
      verb: "boil",
      template: "Cook the potatoes in {} water for twenty minutes.",
      answer: ["boiling"],
      dummies: [["boiled"], ["boil"], ["boils"], ["to boil"]],
      trans: "じゃがいもを熱湯で 20 分間煮てください。",
      note: "boiling water で「沸騰しているお湯，熱湯」。お湯が今「沸騰している」ので現在分詞。分詞1語なので名詞の前に置く。" },

    { src: "5 ⑷", type: "form", inst: "verb5",
      verb: "boil",
      template: "I often have a {} egg and toast for breakfast.",
      answer: ["boiled"],
      dummies: [["boiling"], ["boil"], ["boils"], ["to boil"]],
      trans: "私はよく朝食にゆで卵とトーストを食べる。",
      note: "a boiled egg で「ゆで卵（ゆでられた卵）」。卵は「ゆでられた」側なので過去分詞 boiled。" },

    { src: "6 ⑴", type: "order", inst: "order6",
      before: "The family lives in", after: ".",
      chunks: ["built", "a house", "the Meiji era", "in"], extra: ["building"],
      answer: ["a house", "built", "in", "the Meiji era"],
      trans: "その家族は明治時代に建てられた家に住んでいる。",
      note: "家は「建てられた」側なので過去分詞 built。語句をともなうので名詞の後ろに置いて，a house built in the Meiji era（明治時代に建てられた家）とする。" },

    { src: "6 ⑵", type: "order", inst: "order6",
      before: "Anyone", after: "find helpful information on this site.",
      chunks: ["looking", "a job", "can", "for"], extra: ["looked"],
      answer: ["looking", "for", "a job", "can"],
      trans: "仕事を探している人はだれでもこのサイトで役立つ情報を見つけることができる。",
      note: "人が「探している」ので現在分詞 looking。Anyone looking for a job（仕事を探しているだれでも）が主語で，そのあとに can find を続ける。" },

    { src: "6 ⑶", type: "order", inst: "order6",
      before: "We", after: "the school festival.",
      chunks: ["preparing", "busy", "for", "are"], extra: ["prepared"],
      answer: ["are", "busy", "preparing", "for"],
      trans: "私たちは学校祭の準備で忙しい。",
      note: "be busy doing で「～するのに忙しい」。prepare for A は「A の準備をする」。" },

    { src: "7 ⑴", type: "form", inst: "verb7",
      ja: "何度も試したのに，エラーメッセージが出続けた。", verb: "keep / get",
      template: "I tried again and again, but I {} {} error messages.",
      answer: ["kept", "getting"],
      dummies: [["kept", "to get"], ["kept", "got"], ["keep", "getting"], ["kept", "gotten"]],
      note: "keep doing で「～し続ける」。過去の文なので keep の過去形 kept（keep – kept – kept）。\nkept getting error messages で「エラーメッセージが出続けた」。" },

    { src: "7 ⑵", type: "form", inst: "verb7",
      ja: "彼女は腕を組んだまま音楽を聞いていた。", verb: "with / fold",
      template: "She was listening to the music {} her arms {}.",
      answer: ["with", "folded"],
      dummies: [["with", "folding"], ["with", "fold"], ["in", "folded"], ["by", "folded"]],
      note: "〈with＋名詞＋分詞〉で「…が～した［している］状態で」。腕は「組まれた」側なので過去分詞 folded。with her arms folded で「腕を組んだまま」。" },

    { src: "7 ⑶", type: "form", inst: "verb7",
      ja: "私は夏の間にヨーロッパを旅行して 1 か月過ごした。", verb: "spend / travel",
      template: "I {} a month {} around Europe during the summer.",
      answer: ["spent", "traveling"],
      dummies: [["spent", "to travel"], ["spend", "traveling"], ["spent", "traveled"], ["spended", "traveling"]],
      note: "spend＋時間＋doing で「～して（時間）を過ごす」。spend の過去形は spent（spend – spent – spent）。" },

    { src: "7 ⑷", type: "form", inst: "verb7",
      ja: "皇居の周りをたくさんの人がジョギングしている。", verb: "there / jog",
      template: "{} {} many people {} around the Imperial Palace.",
      answer: ["there", "are", "jogging"],
      dummies: [["there", "is", "jogging"], ["there", "are", "jogged"], ["there", "are", "jog"], ["it", "is", "jogging"]],
      note: "〈There is / are＋名詞＋現在分詞〉で「…が～している」。many people は複数なので are。\njog の -ing 形は g を重ねて jogging。" },

    { src: "8 ⑴", type: "order", inst: "order8",
      ja: "私は，リサイクルされたプラスチックから作られた製品をよく買う。",
      before: "I often buy", after: "plastic.",
      chunks: ["made", "recycled", "from", "products"], extra: ["making"],
      answer: ["products", "made", "from", "recycled"],
      note: "製品は「作られた」側なので過去分詞 made。products made from recycled plastic で「リサイクルされたプラスチックから作られた製品」。\nbe made from A は「A（原料）から作られる」。" },

    { src: "8 ⑵", type: "order", inst: "order8",
      ja: "私たちは，日没後も長い間，ビーチに座ったままでいた。",
      before: "We", after: "long after sunset.",
      chunks: ["sitting", "the beach", "remained", "on"], extra: ["sit"],
      answer: ["remained", "sitting", "on", "the beach"],
      note: "remain doing で「～したままでいる」。私たちは「座っている」側なので現在分詞 sitting。" },

    { src: "8 ⑶", type: "order", inst: "order8",
      ja: "最終電車をホームで待っている人たちは疲れているように見える。",
      before: "", after: "on the platform look tired.",
      chunks: ["waiting", "the people", "the last train", "for"], extra: ["waited"],
      answer: ["the people", "waiting", "for", "the last train"],
      note: "人たちが「待っている」ので現在分詞 waiting。The people waiting for the last train（最終電車を待っている人たち）が主語。" },

    { src: "8 ⑷", type: "order", inst: "order8",
      ja: "【状況】クラスのみんなの前でスピーチを始めようとして，足が震え出しました。",
      before: "I was very nervous", after: ".",
      chunks: ["watching", "all my classmates", "with", "me"], extra: ["watched"],
      answer: ["with", "all my classmates", "watching", "me"],
      trans: "クラスメイト全員が私を見ていて，とても緊張した。",
      note: "〈with＋名詞＋分詞〉で「…が～している状態で」。クラスメイトが「見ている」ので現在分詞 watching。" }
  ]
});

// ===== Lesson 15　分詞② =====
LESSONS.push({ id: "15-1", title: "分詞②",
  inst: {
    verb1: "日本語に合うように，［ ］の語を適切な分詞の形にして英文を完成させるとき，（ ）に入る語句を選びなさい。",
    order3: "日本語，または【状況】に合うように，語句を並べかえなさい。ただし，分詞は適切な形を選ぶこと（使わない語句が1つあります）。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "verb1",
      ja: "授業中は脳を働いている状態にしておかなければならない。", verb: "work",
      template: "You have to keep your brain {} in class.",
      answer: ["working"],
      dummies: [["worked"], ["works"], ["to work"], ["work"]],
      note: "〈keep＋O＋分詞〉で「O を～の状態にしておく」。脳が「働いている」ので現在分詞 working。\nyour brain と work は「脳が働く」という主語と動詞の関係。" },

    { src: "1 ⑵", type: "form", inst: "verb1",
      ja: "床がほこりをかぶったままにしておいてはいけない。", verb: "cover",
      template: "Don’t leave the floor {} with dust.",
      answer: ["covered"],
      dummies: [["covering"], ["covers"], ["to cover"], ["cover"]],
      note: "〈leave＋O＋分詞〉で「O を～のままにしておく」。床は「（ほこりで）覆われる」側なので過去分詞 covered。\nbe covered with A は「A で覆われている」。" },

    { src: "1 ⑶", type: "form", inst: "verb1",
      ja: "自分の部屋にいるとき，私はいつもドアに鍵をかけたままにしておく。", verb: "lock",
      template: "I always {} the door {} when I’m in my room.",
      answer: ["keep", "locked"],
      dummies: [["keep", "locking"], ["make", "locked"], ["keep", "lock"], ["am", "locked"]],
      note: "〈keep＋O＋過去分詞〉で「O を～された状態にしておく」。ドアは「鍵をかけられる」側なので過去分詞 locked（keep の代わりに leave でもよい）。" },

    { src: "1 ⑷", type: "form", inst: "verb1",
      ja: "彼女は赤ん坊を泣いているままにしておかなかった。", verb: "cry",
      template: "She didn’t {} her baby {}.",
      answer: ["leave", "crying"],
      dummies: [["leave", "cried"], ["leave", "cry"], ["left", "crying"], ["leave", "to cry"]],
      note: "〈leave＋O＋現在分詞〉で「O を～しているままにしておく」。赤ん坊が「泣いている」ので crying。\ndidn’t のあとは原形 leave。" },

    { src: "1 ⑸", type: "form", inst: "verb1",
      ja: "騒がしすぎて，私の声は聞き取ってもらえなかった。", verb: "hear",
      template: "I couldn’t make myself {} because it was too noisy.",
      answer: ["heard"],
      dummies: [["hearing"], ["hear"], ["to hear"], ["hears"]],
      note: "make oneself heard で「自分の声を（相手に）聞いてもらう」。自分（の声）は「聞かれる」側なので過去分詞 heard。" },

    { src: "2 ⑴", type: "order", inst: "orderMeaning",
      before: "She", after: "the accident.",
      chunks: ["broken", "her leg", "in", "got"],
      answer: ["got", "her leg", "broken", "in"],
      trans: "彼女は事故で脚を骨折した。",
      note: "〈get＋O＋過去分詞〉は「O を～される」という被害を表すことがある。got her leg broken で「脚を折られた（骨折した）」。" },

    { src: "2 ⑵", type: "order", inst: "orderMeaning",
      before: "", after: "at a photo studio.",
      chunks: ["a family picture", "had", "taken", "we"],
      answer: ["we", "had", "a family picture", "taken"],
      trans: "私たちは写真スタジオで家族写真を撮ってもらった。",
      note: "〈have＋O＋過去分詞〉で「O を～してもらう」。写真は「撮られる」側なので過去分詞 taken。" },

    { src: "2 ⑶", type: "order", inst: "orderMeaning",
      before: "Somehow he", after: "in one night.",
      chunks: ["prepared", "presentation", "got", "the"],
      answer: ["got", "the", "presentation", "prepared"],
      trans: "彼はどうにか一晩でプレゼンの準備をした。",
      note: "〈get＋O＋過去分詞〉は「O を～してしまう」という完了も表す。got the presentation prepared で「プレゼンを準備し終えた」。" },

    { src: "2 ⑷", type: "order", inst: "orderMeaning",
      before: "I’m", after: "tomorrow.",
      chunks: ["to", "have", "cut", "going", "my hair"],
      answer: ["going", "to", "have", "my hair", "cut"],
      trans: "私は明日，髪を切ってもらう予定だ。",
      note: "〈have＋O＋過去分詞〉で「O を～してもらう」。髪は「切られる」側。cut の過去分詞は cut（cut – cut – cut）。\nbe going to は「～する予定だ」。" },

    { src: "3 ⑴", type: "order", inst: "order3",
      ja: "その肉は，冷凍庫の中で凍ったままにしておくべきだ。",
      before: "The meat", after: "the freezer.",
      chunks: ["frozen", "kept", "should", "in", "be"], extra: ["freezing"],
      answer: ["should", "be", "kept", "frozen", "in"],
      note: "keep the meat frozen（肉を凍らせたままにしておく）の受動態 The meat should be kept frozen。肉は「凍らされる」側なので過去分詞 frozen（freeze – froze – frozen）。" },

    { src: "3 ⑵", type: "order", inst: "order3",
      ja: "多くの家が，昨夜の嵐で屋根を吹き飛ばされた。",
      before: "Many", after: "in the storm last night.",
      chunks: ["blown off", "their roofs", "houses", "got"], extra: ["blowing off"],
      answer: ["houses", "got", "their roofs", "blown off"],
      note: "〈get＋O＋過去分詞〉で「O を～される」という被害。屋根は「吹き飛ばされる」側なので過去分詞 blown（blow – blew – blown）。" },

    { src: "3 ⑶", type: "order", inst: "order3",
      ja: "【状況】私は友だちとの待ち合わせに 1 時間遅れてしまいました。",
      before: "I", after: "in front of the station.",
      chunks: ["waiting", "kept", "friends", "my"], extra: ["waited"],
      answer: ["kept", "my", "friends", "waiting"],
      trans: "私は友だちを駅前でずっと待たせた。",
      note: "〈keep＋O＋現在分詞〉で「O を～させたままにする」。友だちが「待っている」ので現在分詞 waiting。" },

    { src: "3 ⑷", type: "order", inst: "order3",
      ja: "【状況】旅行中にかばんが壊れてしまいましたが，修理店が見つかりました。",
      before: "Fortunately,", after: "within an hour.",
      chunks: ["fixed", "my bag", "I", "had"], extra: ["fixing"],
      answer: ["I", "had", "my bag", "fixed"],
      trans: "幸運にも，かばんを１時間以内で直してもらった。",
      note: "〈have＋O＋過去分詞〉で「O を～してもらう」。かばんは「直される」側なので過去分詞 fixed。\nwithin は「～以内に」。" }
  ]
});

LESSONS.push({ id: "15-2", title: "分詞②",
  inst: {
    verb6: "日本語に合うように，［ ］の語を適切な分詞の形にするとき，（ ）に入る語を選びなさい。",
    order7: "日本語，または【状況】に合うように，語句を並べかえなさい。ただし，分詞は適切な形を選ぶこと（使わない語句が1つあります）。"
  },
  questions: [
    { src: "5 ⑴", type: "order", inst: "orderMeaning",
      before: "I", after: "the flood.",
      chunks: ["from", "a girl", "rescued", "saw"],
      answer: ["saw", "a girl", "rescued", "from"],
      trans: "私は女の子が洪水から救助されるのを見た。",
      note: "〈see＋O＋過去分詞〉で「O が～されるのを見る」。女の子は「救助される」側なので過去分詞 rescued。" },

    { src: "5 ⑵", type: "order", inst: "orderMeaning",
      before: "", after: "in the toaster.",
      chunks: ["burning", "smelled", "the bread", "she"],
      answer: ["she", "smelled", "the bread", "burning"],
      trans: "彼女はトースターの中でパンが焦げているにおいをかいだ。",
      note: "〈smell＋O＋現在分詞〉で「O が～しているにおいがする」。パンが「焦げている」ので現在分詞 burning。" },

    { src: "5 ⑶", type: "order", inst: "orderMeaning",
      before: "I once", after: "English.",
      chunks: ["this Japanese song", "heard", "in", "sung"],
      answer: ["heard", "this Japanese song", "sung", "in"],
      trans: "かつてこの日本の歌が英語で歌われるのを聞いた。",
      note: "〈hear＋O＋過去分詞〉で「O が～されるのを聞く」。歌は「歌われる」側なので過去分詞 sung（sing – sang – sung）。" },

    { src: "5 ⑷", type: "order", inst: "orderMeaning",
      before: "He", after: "his wife last night.",
      chunks: ["with", "arguing", "heard", "was"],
      answer: ["was", "heard", "arguing", "with"],
      trans: "彼は昨晩，妻と口論しているのを聞かれた。",
      note: "hear A doing（A が～しているのを聞く）の受動態は A is heard doing。He was heard arguing で「彼は口論しているのを聞かれた」。\nargue with A は「A と口論する」。" },

    { src: "6 ⑴", type: "form", inst: "verb6",
      ja: "繁華街をドライブしているとき，私たちは新しいピザ屋を見つけた。", verb: "drive",
      template: "{} downtown, we found a new pizza place.",
      answer: ["driving"],
      dummies: [["driven"], ["drove"], ["drive"], ["drives"]],
      note: "分詞で始まる語句が文に説明を加える形を「分詞構文」という。ここでは「～しているとき」という時を表す。私たちが「運転している」ので現在分詞 Driving。" },

    { src: "6 ⑵", type: "form", inst: "verb6",
      ja: "爆発音に驚いて，ビリーはジェーンに何が起こったのかとたずねた。", verb: "surprise",
      template: "{} at the explosion, Billy asked Jane what had happened.",
      answer: ["surprised"],
      dummies: [["surprising"], ["surprise"], ["to surprise"], ["surprises"]],
      note: "理由を表す分詞構文「～して」。ビリーは「驚かされた」側なので過去分詞 Surprised。\nbe surprised at A は「A に驚く」。" },

    { src: "6 ⑶", type: "form", inst: "verb6",
      ja: "彼らは美しい夕日を見ながら浜辺に座っていた。", verb: "watch",
      template: "They sat on the beach {} the beautiful sunset.",
      answer: ["watching"],
      dummies: [["watched"], ["watch"], ["watches"], ["to watching"]],
      note: "分詞構文は「～しながら」という同時に起こっていることも表す。彼らが「見ている」ので現在分詞 watching。" },

    { src: "6 ⑷", type: "form", inst: "verb6",
      ja: "彼女は転んで，ひざを地面に強く打ちつけた。", verb: "hit",
      template: "She fell down, {} her knee hard on the ground.",
      answer: ["hitting"],
      dummies: [["hiting"], ["hits"], ["to hitting"], ["hitted"]],
      note: "分詞構文は「～して，そして…」という連続して起こることも表す。彼女が「打ちつける」ので現在分詞 hitting。\nhit の -ing 形は t を重ねて hitting。" },

    { src: "6 ⑸", type: "form", inst: "verb6",
      ja: "遠くから見ると，その丘はピラミッドのように見える。", verb: "see",
      template: "{} from a distance, the hill looks like a pyramid.",
      answer: ["seen"],
      dummies: [["seeing"], ["saw"], ["see"], ["sees"]],
      note: "分詞構文の主語は文の主語 the hill（その丘）と同じ。丘は「見られる」側なので過去分詞 Seen（see – saw – seen）。" },

    { src: "7 ⑴", type: "order", inst: "order7",
      ja: "彼女は，多くの人がパニック状態で叫んでいるのを聞いた。",
      before: "She", after: "in panic.",
      chunks: ["screaming", "people", "heard", "many"], extra: ["screamed"],
      answer: ["heard", "many", "people", "screaming"],
      note: "〈hear＋O＋現在分詞〉で「O が～しているのを聞く」。人々が「叫んでいる」ので現在分詞 screaming。" },

    { src: "7 ⑵", type: "order", inst: "order7",
      ja: "私たちの世代は，毎日インターネットを使いながら育った。",
      before: "Our", after: "every day.",
      chunks: ["using", "grew up", "generation", "the internet"], extra: ["used"],
      answer: ["generation", "grew up", "using", "the internet"],
      note: "「～しながら」を表す分詞構文。私たちの世代が「使っている」ので現在分詞 using。\ngrow up は「育つ」で，過去形は grew up。" },

    { src: "7 ⑶", type: "order", inst: "order7",
      ja: "暗い部屋にひとりでとり残され，その男の子は泣きたい気分だった。",
      before: "", after: "room, the boy felt like crying.",
      chunks: ["left", "dark", "alone", "the", "in"], extra: ["leaving"],
      answer: ["left", "alone", "in", "the", "dark"],
      note: "leave A alone は「A をひとりにしておく」。男の子は「とり残された」側なので過去分詞 Left で始まる分詞構文にする。\nfeel like doing は「～したい気分だ」。" },

    { src: "7 ⑷", type: "order", inst: "order7",
      ja: "【状況】人気者の俳優が街の中を歩いたら…。",
      before: "The famous", after: "in the crowd.",
      chunks: ["whispered", "actor", "his name", "heard"], extra: ["whispering"],
      answer: ["actor", "heard", "his name", "whispered"],
      trans: "その人気俳優は，人混みで自分の名前がささやかれるのを聞いた。",
      note: "〈hear＋O＋過去分詞〉で「O が～されるのを聞く」。名前は「ささやかれる」側なので過去分詞 whispered。" }
  ]
});

// ===== Lesson 16　関係代名詞① =====
LESSONS.push({ id: "16-1", title: "関係代名詞①",
  inst: {
    rel1: "（ ）に入る適切な関係代名詞を選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "rel1",
      template: "Yesterday I saw an actor {} often appears on TV.",
      answer: ["who"],
      dummies: [["which"], ["whose"], ["whom"], ["what"]],
      trans: "昨日私は，よくテレビに出る俳優を見た。",
      note: "関係代名詞は，前の名詞（先行詞）を後ろから説明する文をつなぐ。先行詞 an actor は人で，あとの often appears の主語になるので，主格の who（that でもよい）。" },

    { src: "1 ⑵", type: "form", inst: "rel1",
      template: "The bus {} goes to the station will arrive soon.",
      answer: ["which"],
      dummies: [["who"], ["whose"], ["what"], ["where"]],
      trans: "駅に行くバスはもうすぐ到着します。",
      note: "先行詞 The bus は人以外で，あとの goes の主語になるので，主格の which（that でもよい）。" },

    { src: "1 ⑶", type: "form", inst: "rel1",
      template: "Penguins are a type of seabirds {} cannot fly.",
      answer: ["which"],
      dummies: [["who"], ["whose"], ["what"], ["whom"]],
      trans: "ペンギンは飛べない海鳥の一種です。",
      note: "先行詞 seabirds（海鳥）は人以外で，あとの cannot fly の主語になるので，主格の which（that でもよい）。" },

    { src: "1 ⑷", type: "form", inst: "rel1",
      template: "The girl {} showed me the way to the library was very kind.",
      answer: ["who"],
      dummies: [["which"], ["whose"], ["whom"], ["what"]],
      trans: "私に図書館への道を教えてくれた少女はとても親切だった。",
      note: "先行詞 The girl は人で，あとの showed の主語になるので，主格の who（that でもよい）。The girl who showed ～ library までが文の主語。" },

    { src: "1 ⑸", type: "form", inst: "rel1",
      template: "Do you know the book {} title is The Lord of the Rings?",
      answer: ["whose"],
      dummies: [["which"], ["who"], ["that"], ["what"]],
      trans: "『指輪物語』というタイトルの本を知っていますか。",
      note: "the book と title は「その本のタイトル」という持ち主の関係なので，所有格の whose を使う。whose title で「その（本の）タイトル」。" },

    { src: "2 ⑴", type: "order", inst: "orderMeaning",
      before: "This is", after: "watered every day.",
      chunks: ["that", "be", "a plant", "must"],
      answer: ["a plant", "that", "must", "be"],
      trans: "これは毎日水やりをしなくてはならない植物だ。",
      note: "先行詞 a plant のあとに，主格の関係代名詞 that で始まる説明を続ける。must be watered は「水をやられなければならない」という受動態。" },

    { src: "2 ⑵", type: "order", inst: "orderMeaning",
      before: "A bilingual", after: "two languages.",
      chunks: ["someone", "is", "speaks", "who"],
      answer: ["is", "someone", "who", "speaks"],
      trans: "バイリンガルとは二か国語を話す人です。",
      note: "someone who speaks two languages で「二か国語を話す人」。who は主格の関係代名詞。" },

    { src: "2 ⑶", type: "order", inst: "orderMeaning",
      before: "The artist", after: "in our city.",
      chunks: ["was", "painted", "who", "born", "this picture"],
      answer: ["who", "painted", "this picture", "was", "born"],
      trans: "この絵を描いた芸術家は私たちの街で生まれた。",
      note: "The artist who painted this picture（この絵を描いた芸術家）までが主語。そのあとに動詞 was born（生まれた）を続ける。" },

    { src: "2 ⑷", type: "order", inst: "orderMeaning",
      before: "You", after: "contains a lot of fat.",
      chunks: ["which", "eat", "a meal", "shouldn’t"],
      answer: ["shouldn’t", "eat", "a meal", "which"],
      trans: "脂肪を多く含む食事をとるべきではない。",
      note: "a meal which contains a lot of fat で「脂肪を多く含む食事」。which は主格の関係代名詞。\ncontain は「～を含む」。" },

    { src: "2 ⑸", type: "order", inst: "orderMeaning",
      before: "I have", after: "dentists.",
      chunks: ["are", "whose", "a classmate", "parents"],
      answer: ["a classmate", "whose", "parents", "are"],
      trans: "私には，両親が歯科医のクラスメイトがいる。",
      note: "a classmate と parents は「そのクラスメイトの両親」という持ち主の関係なので，所有格の whose を使う。" },

    { src: "3 ⑴", type: "order",
      ja: "3 番ホームから出る電車に乗ってください。",
      before: "Take", after: ".",
      chunks: ["from", "the train", "platform 3", "that", "leaves"],
      answer: ["the train", "that", "leaves", "from", "platform 3"],
      note: "the train that leaves from platform 3 で「3番ホームから出る電車」。that は主格の関係代名詞。" },

    { src: "3 ⑵", type: "order",
      ja: "ちょうど今入ってきた女の子の名前は何ですか。",
      before: "What’s the name", after: "in?",
      chunks: ["the girl", "just", "who", "of", "came"],
      answer: ["of", "the girl", "who", "just", "came"],
      note: "the name of the girl（その女の子の名前）の the girl を，who just came in（ちょうど入ってきた）で説明する。" },

    { src: "3 ⑶", type: "order",
      ja: "たまたま飛行機にいた医師が，その具合が悪くなった乗客を助けた。",
      before: "A doctor", after: "the sick passenger.",
      chunks: ["helped", "on the plane", "happened to", "who", "be"],
      answer: ["who", "happened to", "be", "on the plane", "helped"],
      note: "A doctor who happened to be on the plane（たまたま飛行機にいた医師）が主語。そのあとに動詞 helped を続ける。\nhappen to do は「たまたま～する」。" },

    { src: "3 ⑷", type: "order",
      ja: "彼女は教室にいた全員にあいさつした。",
      before: "She greeted", after: ".",
      chunks: ["was", "in", "everybody", "the classroom", "that"],
      answer: ["everybody", "that", "was", "in", "the classroom"],
      note: "everybody that was in the classroom で「教室にいた全員」。everybody は単数扱いなので was。" },

    { src: "3 ⑸", type: "order",
      ja: "【状況】知り合ったアメリカ人は関西弁がペラペラ。なんでも日本人女性と結婚しているとか。",
      before: "I got to know", after: "Osaka.",
      chunks: ["is", "whose", "an American", "from", "wife"],
      answer: ["an American", "whose", "wife", "is", "from"],
      trans: "私は，奥さんが大阪出身のアメリカ人と知り合った。",
      note: "an American whose wife is from Osaka で「奥さんが大阪出身のアメリカ人」。whose は所有格の関係代名詞。\nget to do は「～するようになる」。" }
  ]
});

LESSONS.push({ id: "16-2", title: "関係代名詞①",
  inst: {
    verb5: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "verb5",
      ja: "私たちが昨年発見した薬は，何千人もの命を救うだろう。", verb: "discover",
      template: "The drug {} {} {} last year will save thousands of lives.",
      answer: ["that", "we", "discovered"],
      dummies: [["who", "we", "discovered"], ["that", "we", "discover"], ["that", "us", "discovered"], ["whose", "we", "discovered"]],
      note: "先行詞 The drug は，あとの discovered の目的語になるので，目的格の関係代名詞 that（which でもよい）を使う。\nThe drug that we discovered last year（私たちが昨年発見した薬）までが主語。" },

    { src: "5 ⑵", type: "form", inst: "verb5",
      ja: "彼は，私が長い間知っている男の子だ。", verb: "know",
      template: "He is a boy {} {} {} {} for a long time.",
      answer: ["whom", "I", "have", "known"],
      dummies: [["which", "I", "have", "known"], ["whom", "I", "have", "knew"], ["whom", "me", "have", "known"], ["whose", "I", "have", "known"]],
      note: "先行詞 a boy は人で，know の目的語になるので，目的格の whom（who でもよい）。\nfor a long time（長い間）とあるので現在完了形 have known。" },

    { src: "5 ⑶", type: "form", inst: "verb5",
      ja: "その先生はしばしば私たちが答えられない質問をしてくる。", verb: "answer",
      template: "The teacher often asks us questions {} {} {}.",
      answer: ["we", "can’t", "answer"],
      dummies: [["us", "can’t", "answer"], ["who", "can’t", "answer"], ["we", "can’t", "answering"], ["we", "not", "answer"]],
      note: "目的格の関係代名詞は省略できる。questions (that) we can’t answer で「私たちが答えられない質問」。" },

    { src: "5 ⑷", type: "form", inst: "verb5",
      ja: "彼女が旅行中に出会った女性はとてもフレンドリーだった。", verb: "meet",
      template: "The woman {} {} {} during the trip was very friendly.",
      answer: ["whom", "she", "met"],
      dummies: [["which", "she", "met"], ["whom", "she", "meet"], ["whom", "her", "met"], ["whose", "she", "met"]],
      note: "先行詞 The woman は人で，met の目的語になるので，目的格の whom（who でもよい）。The woman whom she met during the trip までが主語。" },

    { src: "6 ⑴", type: "order",
      ja: "先日あなたが話していた本は，本当におもしろかった。",
      before: "The book", after: "the other day was really interesting.",
      chunks: ["you", "about", "talking", "that", "were"],
      answer: ["that", "you", "were", "talking", "about"],
      note: "talk about the book（その本について話す）の the book が先行詞。前置詞 about は関係詞の文の最後に残る。\nabout that のように，前置詞を that の前に置くことはできない。" },

    { src: "6 ⑵", type: "order",
      ja: "お金がすべてと言う人もいる。",
      before: "There are some", after: "is everything.",
      chunks: ["for", "money", "people", "whom"],
      answer: ["people", "for", "whom", "money"],
      note: "Money is everything for some people.（一部の人にとってお金がすべてだ）を，関係代名詞を使って書きかえた形。〈前置詞＋whom〉で for whom（その人たちにとって）。" },

    { src: "6 ⑶", type: "order",
      ja: "これは，私がシドニーで通っていた高校の写真だ。",
      before: "This is a picture of", after: "in Sydney.",
      chunks: ["I", "to", "the high school", "went"],
      answer: ["the high school", "I", "went", "to"],
      note: "目的格の関係代名詞が省略された形。the high school (that) I went to で「私が通っていた高校」。go to the high school の to が最後に残る。" },

    { src: "7 ⑴", type: "order",
      ja: "エミリーは，私が彼女のために作ったバースデーケーキをとても気に入ってくれた。",
      before: "Emily", after: "for her.",
      chunks: ["that", "the birthday cake", "loved", "I", "made"],
      answer: ["loved", "the birthday cake", "that", "I", "made"],
      note: "the birthday cake that I made for her で「私が彼女のために作ったバースデーケーキ」。that は目的格の関係代名詞。" },

    { src: "7 ⑵", type: "order",
      ja: "これは私がいつも集中するために聞く歌だ。",
      before: "This is", after: "to concentrate.",
      chunks: ["listen", "I", "to", "the song", "always"],
      answer: ["the song", "I", "always", "listen", "to"],
      note: "目的格の関係代名詞が省略された形。the song (that) I always listen to で「私がいつも聞く歌」。listen to the song の to が最後に残る。" },

    { src: "7 ⑶", type: "order",
      ja: "私が荷物を運ぶのを手伝ってあげた女性は，お礼も言わなかった。",
      before: "The woman", after: "didn’t even thank me.",
      chunks: ["her baggage", "I", "with", "helped"],
      answer: ["I", "helped", "with", "her baggage"],
      note: "目的格の関係代名詞が省略された形。The woman (whom) I helped with her baggage までが主語。\nhelp A with B は「A の B を手伝う」。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】ケンは親元から離れて暮らすことにしたものの，ひとりでは家賃が払えないので…。",
      before: "Ken is looking for someone", after: ".",
      chunks: ["with", "can", "who", "share an apartment", "he"],
      answer: ["who", "he", "can", "share an apartment", "with"],
      trans: "ケンはアパートをシェアできる人を探している。",
      note: "share A with B（A を B と共有する）の B が先行詞 someone。with は最後に残る。\nsomeone who he can share an apartment with で「アパートをシェアできる人」。" }
  ]
});

// ===== Lesson 17　関係代名詞② =====
LESSONS.push({ id: "17-1", title: "関係代名詞②",
  inst: {
    verb1: "日本語に合うように，［ ］の語と適切な関係代名詞を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    trans2: "次の英文の下線部に注意して日本語にするとき，（ ）に入る語句を選びなさい。",
    add3: "上の英文に［ ］の説明を加えて1つの英文にするとき，（ ）に入る語の組み合わせを選びなさい。",
    order4: "日本語，または【状況】に合うように，語句を並べかえなさい。適切な位置にコンマ（ , ）も入れること。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "verb1",
      ja: "彼はとつぜん母親を抱きしめ，母親は驚いたようだった。", verb: "look",
      template: "He suddenly hugged his mother, {} {} {}.",
      answer: ["who", "looked", "surprised"],
      dummies: [["that", "looked", "surprised"], ["which", "looked", "surprised"], ["who", "looked", "surprising"], ["who", "look", "surprised"]],
      note: "コンマのあとに関係代名詞を置くと，先行詞に情報を付け加える言い方になる（非限定用法）。「母親は～」と説明を加えている。\nコンマのあとの関係代名詞には that は使えない。look surprised は「驚いたように見える」。" },

    { src: "1 ⑵", type: "form", inst: "verb1",
      ja: "スージーは動物が大好きで，動物園で働きたいと思っている。", verb: "love",
      template: "Susie, {} {} {}, wants to work at a zoo.",
      answer: ["who", "loves", "animals"],
      dummies: [["that", "loves", "animals"], ["which", "loves", "animals"], ["who", "love", "animals"], ["whose", "loves", "animals"]],
      note: "Susie のような人名は1人に決まっているので，コンマで区切って情報を付け加える（非限定用法）。先行詞 Susie は3人称単数なので loves。" },

    { src: "1 ⑶", type: "form", inst: "verb1",
      ja: "彼らはウェリントンの出身だが，そこはニュージーランドの首都だ。", verb: "capital",
      template: "They are from Wellington, {} {} the {} of New Zealand.",
      answer: ["which", "is", "capital"],
      dummies: [["that", "is", "capital"], ["where", "is", "capital"], ["who", "is", "capital"], ["which", "are", "capital"]],
      note: "地名 Wellington に情報を付け加える非限定用法。あとの is の主語になるので which。コンマのあとには that は使えない。\nwhere はあとに主語が欠けていない文が続くときに使う。" },

    { src: "2 ⑴ a", type: "form", inst: "trans2",
      ja: "The teacher praised the students who got good grades.",
      template: "先生は，（{}）。",
      answer: ["よい成績をとった生徒たちを褒めた"],
      dummies: [["生徒たちを褒めたが，彼らはよい成績をとった"], ["よい成績をとった生徒たちに褒められた"], ["生徒たちを褒めて，よい成績をとらせた"], ["生徒たちを褒めたので，彼らはよい成績をとるだろう"]],
      note: "コンマのない関係代名詞は，先行詞を限定する（限定用法）。「よい成績をとった生徒たち」だけが褒められ，ほかにも生徒がいる可能性がある。" },

    { src: "2 ⑴ b", type: "form", inst: "trans2",
      ja: "The teacher praised the students, who got good grades.",
      template: "先生は，（{}）。",
      answer: ["生徒たちを褒めたが，彼らはよい成績をとった"],
      dummies: [["よい成績をとった生徒たちを褒めた"], ["生徒たちに褒められたが，彼らはよい成績をとった"], ["生徒たちを褒めたので，彼らはよい成績をとるだろう"], ["よい成績をとった生徒たちだけを褒めた"]],
      note: "コンマのある関係代名詞は，情報を付け加える（非限定用法）。生徒全員が褒められ，全員がよい成績だった。前から順に「～したが，彼らは…」と訳すとよい。" },

    { src: "2 ⑵ a", type: "form", inst: "trans2",
      ja: "I have two books here. This one is the book that I told you about yesterday.",
      template: "ここに本が 2 冊ある。（{}）。",
      answer: ["これが昨日あなたに話した本だ"],
      dummies: [["これが昨日あなたが私に話した本だ"], ["これは本で，昨日あなたに話した"], ["これは昨日あなたに話すつもりだった本だ"], ["これは昨日あなたに話しかけた本だ"]],
      note: "that I told you about yesterday（昨日私があなたに話した）が the book を限定している（限定用法）。2冊のうち「昨日話した本」はこちらだ，という意味。\ntell A about B は「A に B について話す」。" },

    { src: "2 ⑵ b", type: "form", inst: "trans2",
      ja: "This book, which I told you about yesterday, is very interesting.",
      template: "この本は，（{}）。",
      answer: ["昨日あなたに話しましたが，とてもおもしろいです"],
      dummies: [["昨日あなたが私に話しましたが，とてもおもしろいです"], ["昨日あなたに話したものより，とてもおもしろいです"], ["昨日あなたに話すほど，とてもおもしろいです"], ["昨日あなたに話しかけたので，とてもおもしろいです"]],
      note: "コンマで区切った which ～ は This book に情報を付け加える（非限定用法）。「この本は，昨日話しましたが，～」と補足的に訳す。" },

    { src: "3 ⑴", type: "form", inst: "add3",
      ja: "The food contains a lot of minerals. ［ Most of them are good for our body. ］",
      template: "The food contains a lot of minerals, {} {} {} are good for our body.",
      answer: ["most", "of", "which"],
      dummies: [["most", "of", "them"], ["most", "of", "that"], ["most", "of", "whom"], ["which", "of", "most"]],
      trans: "その食べ物は多くのミネラルを含むが，そのほとんどが体にいいものだ。",
      note: "〈most of which〉で「それらのほとんど」。them を関係代名詞 which に変えて2つの文をつなぐ。先行詞 minerals は人以外なので which。\n「…, most of them are ～」とコンマだけで2つの文をつなぐことはできない。" },

    { src: "3 ⑵", type: "form", inst: "add3",
      ja: "Many volunteers participated in the cleanup. ［ Some of them were students. ］",
      template: "Many volunteers, {} {} {} were students, participated in the cleanup.",
      answer: ["some", "of", "whom"],
      dummies: [["some", "of", "them"], ["some", "of", "who"], ["some", "of", "which"], ["whom", "of", "some"]],
      trans: "多くのボランティアが，その何人かは学生だったが，清掃活動に参加した。",
      note: "〈some of whom〉で「その人たちの何人か」。先行詞 volunteers は人で，前置詞 of のあとなので目的格の whom を使う。\nparticipate in A は「A に参加する」。" },

    { src: "4 ⑴", type: "order", inst: "order4",
      ja: "彼女の車は 20 年前に買ったものだが，まだちゃんと動く。",
      before: "Her car", after: "still works fine.",
      chunks: ["twenty years ago", "she", "which", "bought", ",", ","],
      answer: [",", "which", "she", "bought", "twenty years ago", ","],
      note: "「彼女の車」は1台に決まっているので，コンマで区切って情報を付け加える（非限定用法）。説明が文の途中に入るときは，前後をコンマではさむ。" },

    { src: "4 ⑵", type: "order", inst: "order4",
      ja: "その俳優の夫婦には一人娘がいて，その娘は歌手になった。",
      before: "The actor couple", after: "a singer.",
      chunks: ["became", "who", "an only daughter", "has", ","],
      answer: ["has", "an only daughter", ",", "who", "became"],
      note: "an only daughter（一人娘）に「その娘は歌手になった」と情報を付け加えるので，コンマのあとに who を置く（非限定用法）。" },

    { src: "4 ⑶", type: "order", inst: "order4",
      ja: "【状況】ボールは，私からメアリーへ，さらにアンへと渡りました。",
      before: "I passed the ball to", after: "to Ann.",
      chunks: ["it", "Mary", "passed", "who", ","],
      answer: ["Mary", ",", "who", "passed", "it"],
      trans: "私はボールをメアリーにパスし，彼女はアンへパスしました。",
      note: "人名 Mary に情報を付け加えるので，コンマのあとに who を置く。前から順に「メアリーにパスし，彼女は～」と読むとよい。" }
  ]
});

LESSONS.push({ id: "17-2", title: "関係代名詞②",
  inst: {
    trans6: "関係代名詞の先行詞が何であるかに注意して英文を日本語にするとき，（ ）に入る語句を選びなさい。",
    what7: "日本語に合うように，［ ］の語句と関係代名詞 what を使って英文を完成させるとき，下線部に入る語句を選びなさい。",
    order8: "日本語，または【状況】に合うように，語句を並べかえなさい。必要であれば，適切な位置にコンマ（ , ）も入れること（使わない語句がある場合もあります）。"
  },
  questions: [
    { src: "6 ⑴", type: "form", inst: "trans6",
      ja: "Jessie bought a used car, which was very cheap.",
      template: "ジェシーは（{}）。",
      answer: ["中古車を買ったが，それはとても安かった"],
      dummies: [["中古車を買ったので，とても安くなった"], ["とても安い中古車を買わなかった"], ["中古車を買ったが，それは友だちを驚かせた"], ["中古車を買ったが，安くなかった"]],
      note: "which の先行詞は a used car（中古車）。「中古車を買ったが，その車はとても安かった」という意味。" },

    { src: "6 ⑵", type: "form", inst: "trans6",
      ja: "Jessie bought a used car, which surprised her friends.",
      template: "ジェシーは（{}）。",
      answer: ["中古車を買ったが，それは彼女の友だちを驚かせた"],
      dummies: [["彼女の友だちを驚かせた中古車を買った"], ["中古車を買ったが，彼女の友だちに驚いた"], ["中古車を買って，友だちを驚かせるつもりだった"], ["中古車を買ったが，それはとても安かった"]],
      note: "非限定用法の which は，前の文全体の内容を先行詞にすることがある。ここでは「中古車を買ったこと」が友だちを驚かせた。" },

    { src: "6 ⑶", type: "form", inst: "trans6",
      ja: "I decided to go alone, which everyone opposed.",
      template: "私は（{}）。",
      answer: ["ひとりで行こうと決めたが，皆が反対した"],
      dummies: [["皆が反対したので，ひとりで行こうと決めた"], ["ひとりで行こうと決めたが，皆が賛成した"], ["ひとりで行くか，皆に反対されるか決めた"], ["皆が反対したひとりの道を選んだ"]],
      note: "which の先行詞は前の文全体（ひとりで行こうと決めたこと）。それに皆が反対した。oppose は「～に反対する」。" },

    { src: "6 ⑷", type: "form", inst: "trans6",
      ja: "We found that there was no water left, which was a serious problem.",
      template: "私たちは（{}）。",
      answer: ["水が残っていないことに気づいたが，それは深刻な問題だった"],
      dummies: [["深刻な問題になる水が残っていないことに気づいた"], ["水が残っていたことに気づいたが，それは深刻な問題だった"], ["深刻な問題が残っていないことに気づいた"], ["水が残っていないことに気づいたので，深刻な問題を解決した"]],
      note: "which の先行詞は前の文の一部 there was no water left（水が残っていないこと）。それが深刻な問題だった。" },

    { src: "7 ⑴", type: "form", inst: "what7",
      ja: "ホワイトボードに書かれていることが読めますか。", verb: "write",
      template: "Can you read {} on the whiteboard?",
      answer: ["what is written"],
      dummies: [["which is written"], ["what is writing"], ["that is written"], ["what written"]],
      note: "関係代名詞 what は先行詞をふくみ，「～すること・もの」という意味の名詞のかたまりをつくる。what is written で「書かれていること」。read の目的語になっている。" },

    { src: "7 ⑵", type: "form", inst: "what7",
      ja: "美しく見えるものが，常によいとは限らない。", verb: "look",
      template: "{} is not always good.",
      answer: ["what looks beautiful"],
      dummies: [["which looks beautiful"], ["what looks beautifully"], ["that looks beautiful"], ["what is looked beautiful"]],
      note: "What looks beautiful（美しく見えるもの）が文の主語。look＋形容詞 で「～に見える」なので beautiful（beautifully ではない）。\nnot always は「いつも～とは限らない」。" },

    { src: "7 ⑶", type: "form", inst: "what7",
      ja: "私が言おうとしていることを聞いてください。", verb: "try",
      template: "Please listen {} to say.",
      answer: ["to what I’m trying"],
      dummies: [["what I’m trying"], ["to which I’m trying"], ["to that I’m trying"], ["to what I’m tried"]],
      note: "listen to A（A を聞く）の A に what I’m trying to say（私が言おうとしていること）が入る。listen のあとの to を忘れないこと。\ntry to do は「～しようとする」。" },

    { src: "7 ⑷", type: "form", inst: "what7",
      ja: "それはまさに私たちが話していたことだ。", verb: "talk about",
      template: "That’s just {}.",
      answer: ["what we are talking about"],
      dummies: [["which we are talking about"], ["what we are talking"], ["that we are talking about"], ["what are we talking about"]],
      note: "what we are talking about で「私たちが話していること」（were でもよい）。talk about A の about は最後に残る。\nwhat のあとは疑問文の語順にしない。" },

    { src: "7 ⑸", type: "form", inst: "what7",
      ja: "あなたは，食べて楽しめるものを食べるほうがいい。", verb: "enjoy ～ing",
      template: "You should eat {}.",
      answer: ["what you can enjoy eating"],
      dummies: [["what you can enjoy to eat"], ["which you can enjoy eating"], ["what can you enjoy eating"], ["that you can enjoy eating"]],
      note: "what you can enjoy eating で「あなたが食べて楽しめるもの」（can はなくてもよい）。enjoy は動名詞を目的語にとるので enjoy eating。" },

    { src: "8 ⑴", type: "order", inst: "order8",
      ja: "上司は私に 5 時までに退社するように言ったが，私はそれが不可能だとわかった。",
      before: "My boss told me to leave work by five", after: ".",
      chunks: ["impossible", "which", "found", "I", ","],
      answer: [",", "which", "I", "found", "impossible"],
      note: "which の先行詞は前の文の一部（5時までに退社すること）。前の文の内容を受ける which の前にはコンマが必要。\nfind A＋形容詞 で「A を～だと思う」。" },

    { src: "8 ⑵", type: "order", inst: "order8",
      ja: "私にとって今重要なのは，自分の将来について考えることだ。",
      before: "", after: "now is to think about my own future.",
      chunks: ["important", "what", "for", "me", "is"], extra: [","],
      answer: ["what", "is", "important", "for", "me"],
      note: "What is important for me（私にとって重要なこと）が文の主語。what は「～すること・もの」で，コンマは必要ない。" },

    { src: "8 ⑶", type: "order", inst: "order8",
      ja: "今日できることを明日に延ばすな。",
      before: "Never put off until tomorrow", after: ".",
      chunks: ["can", "you", "do", "today", "what"], extra: [","],
      answer: ["what", "you", "can", "do", "today"],
      note: "what you can do today（今日できること）が put off の目的語。コンマは必要ない。\nput off は「～を延期する」。" },

    { src: "8 ⑷", type: "order", inst: "order8",
      ja: "【状況】学校で目立たなかったサキでしたが，トーナメントで優勝したとたん…。",
      before: "Saki won the tournament", after: "at school.",
      chunks: ["popular", "made", "which", "her", ","],
      answer: [",", "which", "made", "her", "popular"],
      trans: "サキはトーナメントで優勝し，そのおかげで彼女は学校で人気者になりました。",
      note: "which の先行詞は前の文全体（サキがトーナメントで優勝したこと）。そのことが彼女を人気者にした。make A＋形容詞 で「A を～にする」。" }
  ]
});

// ===== Lesson 18　関係副詞・複合関係詞 =====
LESSONS.push({ id: "18-1", title: "関係副詞・複合関係詞",
  inst: {
    rel1: "（ ）に入る適切な関係詞を選びなさい（日本語訳は答え合わせのあとに表示されます）。",
    fill2: "日本語に合うように，関係副詞と適切な語を補って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "rel1",
      template: "Spring is the season {} many flowers bloom.",
      answer: ["when"],
      dummies: [["which"], ["where"], ["what"], ["who"]],
      trans: "春は多くの花が咲く季節だ。",
      note: "空所のあとの many flowers bloom は，主語も動詞もそろった欠けのない文。このときは関係副詞を使う。先行詞 the season（季節）は「時」なので when。" },

    { src: "1 ⑵", type: "form", inst: "rel1",
      template: "Spring is the season {} comes between winter and summer.",
      answer: ["which"],
      dummies: [["when"], ["where"], ["what"], ["whose"]],
      trans: "春は冬と夏の間にくる季節だ。",
      note: "空所のあとの comes between ～ には主語がない（欠けのある文）。このときは関係代名詞を使う。主格の which（that でもよい）。\n先行詞が「時」でも，when を使うとは限らないことに注意。" },

    { src: "1 ⑶", type: "form", inst: "rel1",
      template: "I moved out of the house {} I was born.",
      answer: ["where"],
      dummies: [["which"], ["when"], ["what"], ["whose"]],
      trans: "私は生まれた家から引っ越した。",
      note: "空所のあとの I was born は欠けのない文なので関係副詞。先行詞 the house は「場所」なので where。" },

    { src: "1 ⑷", type: "form", inst: "rel1",
      template: "I moved into the house {} my parents bought last month.",
      answer: ["which"],
      dummies: [["where"], ["when"], ["what"], ["who"]],
      trans: "私は両親が先月買った家に引っ越した。",
      note: "空所のあとの my parents bought には bought の目的語がない（欠けのある文）ので，目的格の関係代名詞 which（that でもよい）。\n先行詞が「場所」でも，where を使うとは限らない。" },

    { src: "1 ⑸", type: "form", inst: "rel1",
      template: "The train station is not far from {} she works.",
      answer: ["where"],
      dummies: [["which"], ["when"], ["that"], ["who"]],
      trans: "その駅は彼女が働いているところからさほど離れていない。",
      note: "where の先行詞 the place が省略された形。where she works で「彼女が働いているところ」。" },

    { src: "1 ⑹", type: "form", inst: "rel1",
      template: "The weekend is the only time {} I can relax.",
      answer: ["when"],
      dummies: [["which"], ["where"], ["what"], ["whose"]],
      trans: "週末は私がのんびりできる唯一のときだ。",
      note: "空所のあとの I can relax は欠けのない文。先行詞 the only time は「時」なので関係副詞 when（that でもよい）。" },

    { src: "1 ⑺", type: "form", inst: "rel1",
      template: "There are many hotels around the area in {} the temple is located.",
      answer: ["which"],
      dummies: [["where"], ["that"], ["what"], ["whom"]],
      trans: "その寺がある地域の周辺には多くのホテルがある。",
      note: "〈前置詞＋関係代名詞〉の形。in which は「その地域に」という意味で，関係副詞 where と同じはたらきをする。前置詞のあとに that や where は置けない。" },

    { src: "2 ⑴", type: "form", inst: "fill2",
      ja: "彼は 2015 年に起業したが，そのとき彼はまだ独身だった。",
      template: "He started his own business in 2015, {} {} {} still single.",
      answer: ["when", "he", "was"],
      dummies: [["which", "he", "was"], ["where", "he", "was"], ["when", "he", "is"], ["that", "he", "was"]],
      note: "コンマのあとの関係副詞 when で「そしてそのとき～」と情報を付け加える。先行詞は 2015（時）。過去の話なので was。" },

    { src: "2 ⑵", type: "form", inst: "fill2",
      ja: "私は最初の数ページを読み，そこでいくつかのスペルミスを見つけた。",
      template: "I read the first few pages, {} {} {} some spelling errors.",
      answer: ["where", "I", "found"],
      dummies: [["which", "I", "found"], ["what", "I", "found"], ["where", "I", "find"], ["where", "me", "found"]],
      note: "コンマのあとの where で「そしてそこで～」と情報を付け加える。where は具体的な場所でなくても「そこで」の意味で使える。find の過去形は found。" },

    { src: "2 ⑶", type: "form", inst: "fill2",
      ja: "関市は，私たちが住んでいるところだが，刀で有名だ。",
      template: "Seki City, {} {} {}, is famous for blades.",
      answer: ["where", "we", "live"],
      dummies: [["which", "we", "live"], ["where", "we", "lives"], ["that", "we", "live"], ["when", "we", "live"]],
      note: "地名 Seki City に情報を付け加える。we live は欠けのない文なので関係副詞 where。説明が文の途中に入るので，前後をコンマではさむ。" },

    { src: "3 ⑴", type: "order",
      ja: "私たちが泳いだビーチは，子ども連れの家族で混み合っていた。",
      before: "", after: "crowded with families with children.",
      chunks: ["swam", "where", "we", "the beach", "was"],
      answer: ["the beach", "where", "we", "swam", "was"],
      note: "The beach where we swam（私たちが泳いだビーチ）が主語。そのあとに was crowded を続ける。\nbe crowded with A は「A で混み合っている」。" },

    { src: "3 ⑵", type: "order",
      ja: "困難に向き合わなければならないときもある。",
      before: "There are", after: "difficulties.",
      chunks: ["when", "face", "times", "have to", "you"],
      answer: ["times", "when", "you", "have to", "face"],
      note: "times when you have to face difficulties で「困難に向き合わなければならないとき」。先行詞 times（時）を関係副詞 when で説明する。" },

    { src: "3 ⑶", type: "order",
      ja: "【状況】なかなか観る時間がなかった映画。さいわい昨夜は宿題がなかったので…。",
      before: "I finally watched the movie", after: "homework to do.",
      chunks: ["no", "when", "last night", "I had", ","],
      answer: ["last night", ",", "when", "I had", "no"],
      trans: "私は昨晩，やっとその映画を観たのだが，そのときはやらなくてはならない宿題がなかった。",
      note: "コンマのあとの when で last night に「そしてそのとき～」と情報を付け加える。" }
  ]
});

LESSONS.push({ id: "18-2", title: "関係副詞・複合関係詞",
  inst: {
    fill5: "日本語に合うように，（ ）に入る適切な語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "fill5",
      ja: "あなたが学校を休んだ理由を私に教えてよ。",
      template: "Tell me {} {} {} you were absent from school.",
      answer: ["the", "reason", "why"],
      dummies: [["the", "reason", "which"], ["the", "reason", "how"], ["the", "way", "why"], ["a", "reason", "what"]],
      note: "the reason why ～ で「～する理由」。先行詞 the reason（理由）には関係副詞 why を使う（that でもよい）。\nbe absent from A は「A を休む」。" },

    { src: "5 ⑵", type: "form", inst: "fill5",
      ja: "こうやってその事故は起こりました。",
      template: "This {} {} the accident happened.",
      answer: ["is", "how"],
      dummies: [["is", "what"], ["is", "which"], ["was", "why"], ["is", "where"]],
      note: "This is how ～ で「このようにして～」。how は「～する方法・様子」を表す関係副詞で，先行詞 the way をふくんでいる。" },

    { src: "5 ⑶", type: "form", inst: "fill5",
      ja: "そういうわけで，私の父はゴルフをするのをやめた。",
      template: "That’s {} {} {} quit playing golf.",
      answer: ["why", "my", "father"],
      dummies: [["because", "my", "father"], ["how", "my", "father"], ["why", "my", "fathers"], ["which", "my", "father"]],
      note: "That’s why ～ で「そういうわけで～」（直訳は「それが～する理由だ」）。\nThat’s because ～ は「それは～だからだ」となり，理由と結果が逆になる。quit doing は「～するのをやめる」。" },

    { src: "5 ⑷", type: "form", inst: "fill5",
      ja: "私は彼女がチームを率いるやり方を見習いたい。",
      template: "I want to learn from {} {} {} leads her team.",
      answer: ["the", "way", "she"],
      dummies: [["the", "way", "how"], ["how", "the", "way"], ["the", "way", "her"], ["the", "why", "she"]],
      note: "「～するやり方」は the way ～ または how ～ で表す。the way how ～ のように2つを並べることはできない。" },

    { src: "6 ⑴", type: "order", inst: "orderMeaning",
      before: "He", after: ".",
      chunks: ["he", "helps", "whoever", "meets"],
      answer: ["helps", "whoever", "he", "meets"],
      trans: "彼はだれでも会う人を助ける。",
      note: "whoever は「～する人はだれでも」。whoever he meets（彼が会う人はだれでも）が helps の目的語になっている。" },

    { src: "6 ⑵", type: "order", inst: "orderMeaning",
      before: "", after: "makes me smile.",
      chunks: ["cat", "whatever", "does", "my"],
      answer: ["whatever", "my", "cat", "does"],
      trans: "私のネコがすることは何でも私を笑顔にする。",
      note: "whatever は「～するものは何でも」。Whatever my cat does（私のネコがすることは何でも）が文の主語。" },

    { src: "6 ⑶", type: "order", inst: "orderMeaning",
      before: "", after: ", I always eat at that restaurant.",
      chunks: ["downtown", "I", "whenever", "go"],
      answer: ["whenever", "I", "go", "downtown"],
      trans: "街へ出るときはいつでも，そのレストランで食事をする。",
      note: "whenever は「～するときはいつでも」。Whenever I go downtown で「街へ出るときはいつでも」。" },

    { src: "6 ⑷", type: "order", inst: "orderMeaning",
      before: "She goes", after: "exciting.",
      chunks: ["there", "wherever", "something", "is"],
      answer: ["wherever", "there", "is", "something"],
      trans: "彼女は何かわくわくすることがあるならどこへでも行く。",
      note: "wherever は「～するところならどこへでも」。wherever there is something exciting で「何かわくわくすることがあるところならどこへでも」。" },

    { src: "6 ⑸", type: "order", inst: "orderMeaning",
      before: "", after: ", do not forget to contact me.",
      chunks: ["you", "wherever", "are"],
      answer: ["wherever", "you", "are"],
      trans: "あなたがどこにいても，忘れずに連絡してください。",
      note: "wherever は「どこに～しても」という譲歩も表す。Wherever you are で「あなたがどこにいても」。" },

    { src: "7 ⑴", type: "order",
      ja: "それは本当にトムが腹を立てた理由ですか。",
      before: "Is that really", after: "angry?",
      chunks: ["got", "the reason", "why", "Tom"],
      answer: ["the reason", "why", "Tom", "got"],
      note: "the reason why ～ で「～する理由」。get angry は「腹を立てる」。" },

    { src: "7 ⑵", type: "order",
      ja: "あなたは将来，何でもなりたいものになれる。",
      before: "You can be", after: "in the future.",
      chunks: ["want", "you", "be", "whatever", "to"],
      answer: ["whatever", "you", "want", "to", "be"],
      note: "whatever you want to be で「あなたがなりたいものは何でも」。be の補語になっている。" },

    { src: "7 ⑶", type: "order",
      ja: "彼女の英語の発音のしかたはきれいで聞き取りやすい。",
      before: "The", after: "nice and easy to understand.",
      chunks: ["she", "is", "way", "pronounces", "English"],
      answer: ["way", "she", "pronounces", "English", "is"],
      note: "The way she pronounces English（彼女が英語を発音するしかた）が主語。そのあとに動詞 is を続ける。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】大人気の新しいスマートフォンの発売を待っている人が大勢います。",
      before: "", after: ", it will be a big hit.",
      chunks: ["out", "the new smartphone", "whenever", "comes"],
      answer: ["whenever", "the new smartphone", "comes", "out"],
      trans: "新しいスマートフォンが出るときはいつも，大ヒットになるでしょう。",
      note: "whenever は「いつ～しても」。come out は「（品物が）発売される」。\n「時」を表す部分なので，未来のことでも現在形 comes。" }
  ]
});

// ===== Lesson 19　比較①（原級・比較級） =====
LESSONS.push({ id: "19-1", title: "比較①（原級・比較級）",
  inst: {
    fill1: "日本語に合うように，（ ）に入る適切な語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "fill1",
      ja: "母の髪は私と同じ長さだ。",
      template: "My mother’s hair is {} {} {} mine.",
      answer: ["as", "long", "as"],
      dummies: [["as", "longer", "as"], ["as", "long", "than"], ["more", "long", "than"], ["so", "long", "than"]],
      note: "〈as＋原級（もとの形）＋as〉で「…と同じくらい～」。as long as mine で「私の（髪）と同じくらい長い」。\nmine は my hair のこと。" },

    { src: "1 ⑵", type: "form", inst: "fill1",
      ja: "カレンはそのゲームで私と同じ点を取った。",
      template: "Karen scored as {} points {} {} did in the game.",
      answer: ["many", "as", "I"],
      dummies: [["much", "as", "I"], ["many", "as", "me"], ["many", "than", "I"], ["more", "as", "I"]],
      note: "数を比べるときは〈as many＋名詞の複数形＋as〉。points（点）は数えられるので many。\nas I did は「私が取ったのと同じくらい」。did は scored の代わり。" },

    { src: "1 ⑶", type: "form", inst: "fill1",
      ja: "私はそのテストのために彼と同じだけ一生懸命に勉強した。",
      template: "I studied {} {} {} him for the test.",
      answer: ["as", "hard", "as"],
      dummies: [["as", "hardly", "as"], ["as", "harder", "as"], ["so", "hard", "than"], ["as", "hard", "than"]],
      note: "〈as＋副詞の原級＋as〉で「…と同じくらい～に」。hard は「一生懸命に」という副詞。\nhardly は「ほとんど～ない」という別の意味なので注意。" },

    { src: "1 ⑷", type: "form", inst: "fill1",
      ja: "鉄は金ほど高価ではない。",
      template: "Iron is {} {} {} as gold.",
      answer: ["not", "as", "expensive"],
      dummies: [["not", "more", "expensive"], ["no", "as", "expensive"], ["not", "as", "more expensive"], ["as", "not", "expensive"]],
      note: "〈not as＋原級＋as〉で「…ほど～ではない」（not so ～ as でもよい）。Iron is not as expensive as gold で「鉄は金ほど高価ではない」。" },

    { src: "1 ⑸", type: "form", inst: "fill1",
      ja: "５月には４月と同じ量の雨が降った。",
      template: "We had {} {} {} in May as in April.",
      answer: ["as", "much", "rain"],
      dummies: [["as", "many", "rain"], ["as", "much", "rains"], ["as", "more", "rain"], ["so", "much", "rains"]],
      note: "量を比べるときは〈as much＋数えられない名詞＋as〉。rain（雨）は数えられないので much を使い，s もつけない。" },

    { src: "2 ⑴", type: "order", inst: "orderMeaning",
      before: "This computer works", after: "as that one.",
      chunks: ["as", "times", "fast", "three"],
      answer: ["three", "times", "as", "fast"],
      trans: "このコンピューターはあのコンピューターよりも 3 倍速く動く。",
      note: "「…の～倍」は〈～ times as＋原級＋as …〉。three times は as fast as の前に置く。\nwork は「（機械が）動く」。" },

    { src: "2 ⑵", type: "order", inst: "orderMeaning",
      before: "That park is", after: "a football ground.",
      chunks: ["as", "as", "large", "half"],
      answer: ["half", "as", "large", "as"],
      trans: "あの公園はサッカー場の半分の広さです。",
      note: "「…の半分」は half を as ～ as の前に置いて〈half as＋原級＋as〉。" },

    { src: "2 ⑶", type: "order", inst: "orderMeaning",
      before: "Our school has only", after: "as theirs.",
      chunks: ["students", "as", "one-third", "many"],
      answer: ["one-third", "as", "many", "students"],
      trans: "私たちの学校は彼らの学校の 3 分の 1 の生徒しかいない。",
      note: "分数も as ～ as の前に置く。one-third as many students as theirs で「彼らの学校の3分の1の数の生徒」。theirs は their school のこと。" },

    { src: "2 ⑷", type: "order", inst: "orderMeaning",
      before: "Her new book is", after: "her last one.",
      chunks: ["as", "as", "about", "good"],
      answer: ["about", "as", "good", "as"],
      trans: "彼女の新刊は前作とほぼ同じくらいよい。",
      note: "about（ほぼ）も as ～ as の前に置く。about as good as で「ほぼ同じくらいよい」。her last one は her last book のこと。" },

    { src: "3 ⑴", type: "order",
      ja: "その女の子はプロの歌手と同じくらい見事に歌っていた。",
      before: "The girl", after: "a professional singer.",
      chunks: ["as", "as", "was", "beautifully", "singing"],
      answer: ["was", "singing", "as", "beautifully", "as"],
      note: "動詞を説明するので副詞 beautifully を使い，〈as＋副詞＋as〉とする。was singing は過去進行形。" },

    { src: "3 ⑵", type: "order",
      ja: "飛行機で行くのは，電車で行く 2 倍のお金がかかる。",
      before: "Flying costs", after: "the train.",
      chunks: ["as", "as", "taking", "twice", "much"],
      answer: ["twice", "as", "much", "as", "taking"],
      note: "「2倍」は twice。twice as much as で「2倍の（お金）」。比べるのは Flying（飛行機で行くこと）と taking the train（電車に乗ること）。" },

    { src: "3 ⑶", type: "order",
      ja: "【状況】スマホを買いたいのですが，とても高額です。",
      before: "This smartphone", after: "a laptop.",
      chunks: ["as", "as", "is", "expensive", "nearly"],
      answer: ["is", "nearly", "as", "expensive", "as"],
      trans: "このスマホはノートパソコンとほぼ同じくらい高額だ。",
      note: "nearly（ほぼ）は as ～ as の前に置く。nearly as expensive as で「ほぼ同じくらい高い」。" },

    { src: "3 ⑷", type: "order",
      ja: "【状況】エリックと魚釣りに行きました。最後に，2 人の釣った魚の数を比べたら…。",
      before: "I", after: "as Eric.",
      chunks: ["as", "didn’t", "many", "fish", "catch"],
      answer: ["didn’t", "catch", "as", "many", "fish"],
      trans: "私はエリックほどたくさんの魚を釣れなかった。",
      note: "数を比べる〈as many＋名詞＋as〉の否定文。not as many fish as Eric で「エリックほど多くの魚を～ない」。fish は複数でも fish。" }
  ]
});

LESSONS.push({ id: "19-2", title: "比較①（原級・比較級）",
  inst: {
    verb5: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，下線部に入る語句を選びなさい。",
    verb6: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴", type: "form", inst: "verb5",
      ja: "日本はほかの国より安全だと思いますか。", verb: "safe",
      template: "Do you think Japan {} other countries?",
      answer: ["is safer than"],
      dummies: [["is more safe than"], ["is safer as"], ["is safe than"], ["is safest than"]],
      note: "〈比較級＋than …〉で「…より～」。safe のような短い語は er をつけて safer にする。" },

    { src: "5 ⑵", type: "form", inst: "verb5",
      ja: "アレックスは，私よりも上手に料理ができる。", verb: "well",
      template: "Alex can cook {} can.",
      answer: ["better than I"],
      dummies: [["weller than I"], ["more well than I"], ["better than me"], ["best than I"]],
      note: "well（上手に）の比較級は better（well – better – best）。\n後ろに can が続くので，than のあとは主語の形 I にする。" },

    { src: "5 ⑶", type: "form", inst: "verb5",
      ja: "悪いニュースはよいニュースより速く広まる。", verb: "quickly",
      template: "Bad news spreads {} good news.",
      answer: ["more quickly than"],
      dummies: [["quicklier than"], ["more quick than"], ["quickly than"], ["most quickly than"]],
      note: "-ly で終わる副詞は，ふつう more をつけて比較級にする（early は例外で earlier）。" },

    { src: "5 ⑷", type: "form", inst: "verb5",
      ja: "オンラインショッピングは，店に行くよりも便利だ。", verb: "convenient",
      template: "Online shopping {} going to the store.",
      answer: ["is more convenient than"],
      dummies: [["is convenienter than"], ["is more convenient as"], ["is most convenient than"], ["more convenient than"]],
      note: "convenient のような長い語は，more をつけて比較級にする。be動詞 is を忘れないこと。" },

    { src: "5 ⑸", type: "form", inst: "verb5",
      ja: "この繊維は人間の髪の毛よりもずっと細い。", verb: "thin",
      template: "This fiber is {} a human hair.",
      answer: ["much thinner than"],
      dummies: [["very thinner than"], ["much thiner than"], ["much more thin than"], ["more much thinner than"]],
      note: "比較級を強めて「ずっと～」と言うときは，比較級の前に much を置く（far / a lot でもよい）。very は使えない。\nthin の比較級は n を重ねて thinner。" },

    { src: "5 ⑹", type: "form", inst: "verb5",
      ja: "小さな町は大都市より駅の数が少ない。", verb: "few",
      template: "Small towns have {} big cities.",
      answer: ["fewer stations than"],
      dummies: [["less stations than"], ["fewer station than"], ["more few stations than"], ["fewest stations than"]],
      note: "few（数が少ない）の比較級は fewer。数えられる名詞には fewer を使い，名詞は複数形 stations にする。" },

    { src: "5 ⑺", type: "form", inst: "verb5",
      ja: "彼女は私よりも 3 つ多くの質問に答えた。", verb: "many",
      template: "She answered {} I did.",
      answer: ["three more questions than"],
      dummies: [["more three questions than"], ["three many questions than"], ["three more question than"], ["three questions more as"]],
      note: "差を表す数（three）は比較級の前に置く。many の比較級は more。three more questions で「3つ多くの質問」。" },

    { src: "6 ⑴", type: "form", inst: "verb6",
      ja: "私は以前ほど頻繁には泳ぎに行かない。", verb: "often",
      template: "I don’t go swimming as {} {} {} {} to.",
      answer: ["often", "as", "I", "used"],
      dummies: [["oftener", "as", "I", "used"], ["often", "than", "I", "used"], ["often", "as", "I", "use"], ["often", "as", "me", "used"]],
      note: "not as often as I used to で「以前ほど頻繁には～ない」。used to のあとの go swimming は，くり返しを避けるために省略されている。" },

    { src: "6 ⑵", type: "form", inst: "verb6",
      ja: "その結婚式は私が予想していたよりも感動的だった。", verb: "moving",
      template: "The wedding was {} {} than {} {}.",
      answer: ["more", "moving", "I", "expected"],
      dummies: [["more", "moved", "I", "expected"], ["most", "moving", "I", "expected"], ["more", "moving", "I", "expect"], ["much", "moving", "I", "expected"]],
      note: "moving（感動的な）のような -ing 形の形容詞は more をつけて比較級にする。than I expected で「私が予想していたより」。" },

    { src: "6 ⑶", type: "form", inst: "verb6",
      ja: "今日の仕事はいつもより 2 時間長くかかった。", verb: "long",
      template: "Today’s job took {} {} {} than {}.",
      answer: ["two", "hours", "longer", "usual"],
      dummies: [["two", "hours", "more long", "usual"], ["longer", "two", "hours", "usual"], ["two", "hour", "longer", "usual"], ["two", "hours", "longer", "usually"]],
      note: "差を表す two hours は比較級 longer の前に置く。than usual で「いつもより」。" },

    { src: "6 ⑷", type: "form", inst: "verb6",
      ja: "あなたのシャツのデザインは私のシャツのデザインよりもかわいい。", verb: "pretty",
      template: "The design of your shirt is {} {} {} {} mine.",
      answer: ["prettier", "than", "that", "of"],
      dummies: [["prettier", "than", "those", "of"], ["more pretty", "than", "that", "of"], ["prettier", "than", "it", "of"], ["prettyer", "than", "that", "of"]],
      note: "pretty の比較級は y を i に変えて prettier。比べるのは「デザイン」どうしなので，the design のくり返しを避けて that of mine とする（複数なら those）。" },

    { src: "7 ⑴", type: "order",
      ja: "私のテスト結果は，前回よりも少し悪かった。",
      before: "My test results", after: ".",
      chunks: ["than", "worse", "a little", "last time", "were"],
      answer: ["were", "a little", "worse", "than", "last time"],
      note: "bad（悪い）の比較級は worse（bad – worse – worst）。a little（少し）は比較級の前に置く。" },

    { src: "7 ⑵", type: "order",
      ja: "この問題は，あなたが思うよりもずっと難しい。",
      before: "This problem", after: ".",
      chunks: ["you", "more", "is", "than", "difficult", "think", "far"],
      answer: ["is", "far", "more", "difficult", "than", "you", "think"],
      note: "far（ずっと）は比較級 more difficult の前に置いて強める。than you think で「あなたが思うより」。" },

    { src: "7 ⑶", type: "order",
      ja: "【状況】文化祭には彼女の案が採用されそうです。",
      before: "Her ideas", after: "of her classmates.",
      chunks: ["more", "those", "are", "than", "creative"],
      answer: ["are", "more", "creative", "than", "those"],
      trans: "彼女の案はほかのクラスメイトのものより独創的だ。",
      note: "比べるのは「案」どうし。the ideas のくり返しを避けて，複数の代名詞 those を使う。those of her classmates で「クラスメイトの案」。" }
  ]
});

// ===== Lesson 20　比較②（最上級） =====
LESSONS.push({ id: "20-1", title: "比較②（最上級）",
  inst: {
    verb1: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    order3: "日本語，または【状況】に合うように，語句を並べかえなさい。ただし，最上級の形を選ぶこと（使わない語句が1つあります）。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "verb1",
      ja: "私はたいてい家族の中で最も早く起きる。", verb: "early",
      template: "I usually get up {} {} {} my family.",
      answer: ["the", "earliest", "in"],
      dummies: [["the", "earliest", "of"], ["the", "earlyest", "in"], ["the", "most early", "in"], ["the", "earlier", "in"]],
      note: "〈the＋最上級＋in / of …〉で「…の中で最も～」。early の最上級は y を i に変えて earliest。\n家族やクラスのような「範囲」には in を使う。" },

    { src: "1 ⑵", type: "form", inst: "verb1",
      ja: "ティムは 3 人兄弟のうちで最も創造的だ。", verb: "creative",
      template: "Tim is {} {} {} {} the three brothers.",
      answer: ["the", "most", "creative", "of"],
      dummies: [["the", "most", "creative", "in"], ["the", "more", "creative", "of"], ["most", "the", "creative", "of"], ["the", "much", "creative", "of"]],
      note: "creative のような長い語は most をつけて最上級にする。the three brothers（3人の兄弟）のような「仲間の集まり」には of を使う。" },

    { src: "1 ⑶", type: "form", inst: "verb1",
      ja: "最も単純な答えが，しばしば最もよい答えだ。", verb: "simple / good",
      template: "{} {} answer is often {} {} one.",
      answer: ["the", "simplest", "the", "best"],
      dummies: [["the", "simplest", "the", "goodest"], ["the", "simpler", "the", "better"], ["the", "most simple", "a", "best"], ["a", "simplest", "the", "best"]],
      note: "simple の最上級は simplest，good の最上級は best（good – better – best）。最上級の前には the を置く。one は answer のくり返しを避けるための語。" },

    { src: "1 ⑷", type: "form", inst: "verb1",
      ja: "これは彼女が今までに作った中で最も長い映画だ。", verb: "long",
      template: "This is {} {} movie {} she has ever made.",
      answer: ["the", "longest", "that"],
      dummies: [["the", "longest", "what"], ["the", "longer", "that"], ["the", "most long", "that"], ["a", "longest", "that"]],
      note: "〈the＋最上級＋名詞＋that＋主語＋have ever＋過去分詞〉で「今までに～した中で最も…な」。最上級がつく先行詞には，関係代名詞 that がよく使われる。" },

    { src: "1 ⑸", type: "form", inst: "verb1",
      ja: "この夏はここ 10 年で飛び抜けて暑かった。", verb: "hot",
      template: "This summer was {} {} {} {} in the last decade.",
      answer: ["by", "far", "the", "hottest"],
      dummies: [["by", "far", "the", "hotest"], ["far", "by", "the", "hottest"], ["by", "very", "the", "hottest"], ["by", "far", "the", "hotter"]],
      note: "by far は最上級を強めて「飛び抜けて」。the hottest の前に置く。hot の最上級は t を重ねて hottest。" },

    { src: "1 ⑹", type: "form", inst: "verb1",
      ja: "日本には世界で最も多くの自動販売機（vending machine）がある。", verb: "many",
      template: "Japan has {} {} {} {} in the world.",
      answer: ["the", "most", "vending", "machines"],
      dummies: [["the", "more", "vending", "machines"], ["the", "most", "vending", "machine"], ["the", "manyest", "vending", "machines"], ["a", "most", "vending", "machines"]],
      note: "many の最上級は most（many – more – most）。the most vending machines で「最も多くの自動販売機」。数えられる名詞なので複数形にする。" },

    { src: "2 ⑴", type: "order", inst: "orderMeaning",
      before: "He talked to", after: "in Hollywood last week.",
      chunks: ["famous", "of", "most", "actors", "the", "one"],
      answer: ["one", "of", "the", "most", "famous", "actors"],
      trans: "彼は先週，ハリウッドで最も有名な俳優のひとりに話しかけた。",
      note: "〈one of the＋最上級＋名詞の複数形〉で「最も～な…のひとつ［ひとり］」。名詞は複数形 actors にする。" },

    { src: "2 ⑵", type: "order", inst: "orderMeaning",
      before: "What", after: "?",
      chunks: ["tallest", "Japan", "is", "the", "tower", "in", "third"],
      answer: ["is", "the", "third", "tallest", "tower", "in", "Japan"],
      trans: "日本で 3 番目に高い塔は何ですか。",
      note: "〈the＋序数（third など）＋最上級〉で「～番目に最も…な」。the third tallest tower で「3番目に高い塔」。" },

    { src: "3 ⑴", type: "order", inst: "order3",
      ja: "彼女は，いつもクラスで最も熱心に勉強する。",
      before: "She always", after: ".",
      chunks: ["hardest", "her", "studies", "class", "in"], extra: ["harder"],
      answer: ["studies", "hardest", "in", "her", "class"],
      note: "副詞 hard（熱心に）の最上級 hardest。副詞の最上級の前の the は省略されることがある。" },

    { src: "3 ⑵", type: "order", inst: "order3",
      ja: "あなたが今まで食べた中でいちばんおいしい食べ物は何ですか。",
      before: "What is", after: "?",
      chunks: ["most delicious", "ever", "you", "eaten", "the", "have", "food"], extra: ["more delicious"],
      answer: ["the", "most delicious", "food", "you", "have", "ever", "eaten"],
      note: "〈the＋最上級＋名詞＋（that）＋主語＋have ever＋過去分詞〉で「今までに～した中で最も…な」。delicious は長い語なので most delicious。" },

    { src: "3 ⑶", type: "order", inst: "order3",
      ja: "【状況】毎年クリスマスが近づくと，ケーキ屋さんは大忙しです。",
      before: "For cake shops,", after: "of the year.",
      chunks: ["busiest", "the Christmas season", "the", "time", "is"], extra: ["busier"],
      answer: ["the Christmas season", "is", "the", "busiest", "time"],
      trans: "ケーキ店にとって，クリスマスの時期は一年で最も忙しいときです。",
      note: "busy の最上級は y を i に変えて busiest。the busiest time of the year で「一年で最も忙しいとき」。" },

    { src: "3 ⑷", type: "order", inst: "order3",
      ja: "【状況】都道府県のうちで面積がいちばん小さいのは香川県ですが…。",
      before: "Osaka is", after: "47 prefectures.",
      chunks: ["smallest", "Japan’s", "the", "second", "of"], extra: ["smaller"],
      answer: ["the", "second", "smallest", "of", "Japan’s"],
      trans: "大阪は日本の 47 都道府県の中で 2 番目に小さい。",
      note: "〈the second＋最上級〉で「2番目に最も～」。the second smallest で「2番目に小さい」。" }
  ]
});

LESSONS.push({ id: "20-2", title: "比較②（最上級）",
  inst: {
    same5: "上の英文とほぼ同じ意味になるように，（ ）に入る適切な語の組み合わせを選びなさい。",
    verb6: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "5 ⑴ ①", type: "form", inst: "same5",
      ja: "Tom is practicing harder than any other swimmer.",
      template: "No other {} is practicing as {} {} Tom.",
      answer: ["swimmer", "hard", "as"],
      dummies: [["swimmers", "hard", "as"], ["swimmer", "harder", "as"], ["swimmer", "hard", "than"], ["swimmer", "hardly", "as"]],
      trans: "トムほど懸命に練習している泳ぎ手はほかにいない。",
      note: "〈No other＋単数名詞＋as＋原級＋as …〉で「…ほど～なものはほかにない」。最上級と同じ意味を原級で表す言い方。other のあとは単数形 swimmer。" },

    { src: "5 ⑴ ②", type: "form", inst: "same5",
      ja: "Tom is practicing harder than any other swimmer.",
      template: "Tom is practicing {} {} of all the swimmers.",
      answer: ["the", "hardest"],
      dummies: [["the", "harder"], ["the", "most hard"], ["a", "hardest"], ["the", "hardiest"]],
      trans: "トムはすべての泳ぎ手のうちで最も懸命に練習している。",
      note: "〈比較級＋than any other＋単数名詞〉「ほかのどの…よりも～」は，最上級 the hardest of all ～ と同じ意味になる。" },

    { src: "5 ⑵ ①", type: "form", inst: "same5",
      ja: "Lake Tazawa is the deepest lake in Japan.",
      template: "Lake Tazawa is {} than {} other {} in Japan.",
      answer: ["deeper", "any", "lake"],
      dummies: [["deeper", "any", "lakes"], ["deepest", "any", "lake"], ["more deep", "any", "lake"], ["deeper", "all", "lake"]],
      trans: "田沢湖は日本のほかのどの湖より深い。",
      note: "〈比較級＋than any other＋単数名詞〉で「ほかのどの…よりも～」。any other のあとは単数形 lake。" },

    { src: "5 ⑵ ②", type: "form", inst: "same5",
      ja: "Lake Tazawa is the deepest lake in Japan.",
      template: "{} {} lake in Japan is {} {} Lake Tazawa.",
      answer: ["no", "other", "deeper", "than"],
      dummies: [["no", "other", "deeper", "as"], ["any", "other", "deeper", "than"], ["no", "another", "deeper", "than"], ["no", "other", "deepest", "than"]],
      trans: "日本のほかのどの湖も田沢湖より深くない。",
      note: "〈No other＋単数名詞＋比較級＋than …〉で「…より～なものはほかにない」。これも最上級と同じ意味になる。" },

    { src: "5 ⑶", type: "form", inst: "same5",
      ja: "No other student has as many talents as you do.",
      template: "You have {} {} {} any {} {}.",
      answer: ["more", "talents", "than", "other", "student"],
      dummies: [["more", "talents", "than", "other", "students"], ["many", "talents", "than", "other", "student"], ["more", "talent", "than", "other", "student"], ["more", "talents", "as", "other", "student"]],
      trans: "あなたはほかのどの生徒よりも多くの才能をもつ。",
      note: "〈比較級＋than any other＋単数名詞〉で書きかえる。many の比較級は more。any other のあとは単数形 student。" },

    { src: "5 ⑷ ①", type: "form", inst: "same5",
      ja: "Nothing is more important than health.",
      template: "{} is {} {} as health.",
      answer: ["nothing", "as", "important"],
      dummies: [["nothing", "as", "more important"], ["anything", "as", "important"], ["nothing", "more", "important"], ["nothing", "as", "importantly"]],
      trans: "健康ほど大事なものは何もない。",
      note: "〈Nothing is as＋原級＋as …〉で「…ほど～なものはない」。as と as の間は原級 important。" },

    { src: "5 ⑷ ②", type: "form", inst: "same5",
      ja: "Nothing is more important than health.",
      template: "Health is {} {} than {} {}.",
      answer: ["more", "important", "anything", "else"],
      dummies: [["more", "important", "something", "else"], ["most", "important", "anything", "else"], ["more", "important", "anything", "other"], ["much", "important", "anything", "else"]],
      trans: "健康はほかのどんなものよりも大事だ。",
      note: "〈比較級＋than anything else〉で「ほかのどんなものよりも～」。anything else は「ほかのどんなもの」。" },

    { src: "6 ⑴", type: "form", inst: "verb6",
      ja: "その医者はできるだけ急いでやってきた。", verb: "quickly",
      template: "The doctor came as {} {} {}.",
      answer: ["quickly", "as", "possible"],
      dummies: [["quickly", "as", "possibly"], ["quick", "as", "possible"], ["quickly", "than", "possible"], ["more quickly", "as", "possible"]],
      note: "〈as＋原級＋as possible〉で「できるだけ～」。came（来た）を説明するので副詞 quickly を使う。" },

    { src: "6 ⑵", type: "form", inst: "verb6",
      ja: "できるだけ多くのお金をためなさい。", verb: "much",
      template: "Save as {} money {} you {}.",
      answer: ["much", "as", "can"],
      dummies: [["many", "as", "can"], ["much", "than", "can"], ["more", "as", "can"], ["much", "as", "possible"]],
      note: "〈as＋原級＋as＋主語＋can〉で「できるだけ～」（as possible と同じ意味）。money は数えられないので much。" },

    { src: "6 ⑶", type: "form", inst: "verb6",
      ja: "卒業が近づけば近づくほど，私は悲しく感じた。", verb: "close / sad",
      template: "The {} graduation came, {} {} I felt.",
      answer: ["closer", "the", "sadder"],
      dummies: [["closer", "the", "sader"], ["closer", "more", "sad"], ["more close", "the", "sadder"], ["closest", "the", "saddest"]],
      note: "〈The＋比較級 ～, the＋比較級 …〉で「～すればするほど，ますます…」。close の比較級は closer，sad の比較級は d を重ねて sadder。" },

    { src: "6 ⑷", type: "form", inst: "verb6",
      ja: "早く出発すればするほど，よい席が取れるだろう。", verb: "early / good",
      template: "{} {} you leave, the {} seat you will get.",
      answer: ["the", "earlier", "better"],
      dummies: [["the", "earlyer", "better"], ["the", "earlier", "gooder"], ["the", "more early", "better"], ["an", "earlier", "best"]],
      note: "〈The＋比較級 ～, the＋比較級 …〉「～すればするほど…」。early の比較級は earlier，good の比較級は better。" },

    { src: "7 ⑴", type: "order",
      ja: "ほかのどの都市にも，パリほど多くの美術館［博物館］はない。",
      before: "No other", after: "as Paris.",
      chunks: ["as", "city", "museums", "many", "has"],
      answer: ["city", "has", "as", "many", "museums"],
      note: "〈No other＋単数名詞＋as＋原級＋as …〉で「…ほど～なものはほかにない」。other のあとは単数形 city。" },

    { src: "7 ⑵", type: "order",
      ja: "問題が難しければ難しいほど，私はそれをおもしろいと思う。",
      before: "The", after: "find it.",
      chunks: ["is", "harder", "problem", "a", ",", "interesting", "the", "I", "more"],
      answer: ["harder", "a", "problem", "is", ",", "the", "more", "interesting", "I"],
      note: "〈The＋比較級 ～, the＋比較級 …〉。後半は find A＋形容詞（A を～と思う）の形容詞が the more interesting になって前に出た形。" },

    { src: "7 ⑶", type: "order",
      ja: "【状況】彼は，よくケアレスミスをするので，作文を何度も見直しました。",
      before: "He checked", after: "to avoid mistakes.",
      chunks: ["as", "as", "could", "the essay", "he", "carefully"],
      answer: ["the essay", "as", "carefully", "as", "he", "could"],
      trans: "彼は間違いを防ぐため，できる限り念入りに作文を確認しました。",
      note: "〈as＋原級＋as＋主語＋could〉で「できるだけ～」。過去の文なので can ではなく could。" },

    { src: "7 ⑷", type: "order",
      ja: "【状況】クリスはいつもおかしなことを言ってクラスのみんなを笑わせてくれます。",
      before: "Chris", after: "in our class.",
      chunks: ["student", "is", "than", "other", "funnier", "any"],
      answer: ["is", "funnier", "than", "any", "other", "student"],
      trans: "クリスは私たちのクラスでほかのどの生徒よりもおもしろい。",
      note: "〈比較級＋than any other＋単数名詞〉で「ほかのどの…よりも～」。funny の比較級は y を i に変えて funnier。" }
  ]
});

// ===== Lesson 21　仮定法 =====
LESSONS.push({ id: "21-1", title: "仮定法",
  inst: {
    verb1: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    fill2: "日本語の意味に合うように，（ ）に入る適切な語の組み合わせを選びなさい。",
    talk3: "会話が成り立つように，（ ）に入る適切な語の組み合わせを選びなさい。"
  },
  questions: [
    { src: "1 ⑴", type: "form", inst: "verb1",
      ja: "もしそのリスクを知っていたら，彼はもっと慎重に考えるだろう。", verb: "know / think",
      template: "If he {} the risks, he {} {} more carefully.",
      answer: ["knew", "would", "think"],
      dummies: [["knows", "would", "think"], ["knew", "will", "think"], ["knew", "would", "thought"], ["had known", "would", "thinks"]],
      note: "今の事実とちがうことを仮定するときは〈If＋主語＋過去形 ～, 主語＋would＋動詞の原形 …〉（仮定法過去）を使う。実際には彼はリスクを知らない。\nknow の過去形は knew。" },

    { src: "1 ⑵", type: "form", inst: "verb1",
      ja: "スマホが手元にあれば，それをすぐ確認できるのになあ。", verb: "have / check",
      template: "If I {} a smartphone with me, I {} {} it right away.",
      answer: ["had", "could", "check"],
      dummies: [["have", "could", "check"], ["had", "can", "check"], ["had", "could", "checked"], ["has", "could", "check"]],
      note: "仮定法過去。「～できるのに」は〈could＋動詞の原形〉で表す（would でもよい）。実際にはスマホを持っていない。" },

    { src: "1 ⑶", type: "form", inst: "verb1",
      ja: "私があなたなら，そんなに安い服は買わないだろう。", verb: "be / buy",
      template: "If I {} you, I {} {} such cheap clothes.",
      answer: ["were", "wouldn’t", "buy"],
      dummies: [["am", "wouldn’t", "buy"], ["were", "won’t", "buy"], ["were", "wouldn’t", "bought"], ["be", "wouldn’t", "buy"]],
      note: "仮定法過去では，be動詞は主語が何でもふつう were を使う（話し言葉では was も使う）。If I were you は「私があなたなら」。" },

    { src: "1 ⑷", type: "form", inst: "verb1",
      ja: "もし雨が降っていなければ，今すぐジョギングに行くのに。", verb: "be / go",
      template: "If it {} raining, I {} {} jogging right now.",
      answer: ["weren’t", "could", "go"],
      dummies: [["isn’t", "could", "go"], ["weren’t", "can", "go"], ["weren’t", "could", "went"], ["don’t", "could", "go"]],
      note: "今の事実（雨が降っている）とちがうことを仮定するので仮定法過去。If it weren’t raining で「もし雨が降っていなければ」（wasn’t でもよい。could は would でもよい）。" },

    { src: "1 ⑸", type: "form", inst: "verb1",
      ja: "もし一歩後ろに下がれば，あなたはがけから落ちるでしょう。", verb: "take / fall",
      template: "If you {} one step backward, you {} {} off the cliff.",
      answer: ["took", "would", "fall"],
      dummies: [["take", "would", "fall"], ["took", "will", "fall"], ["took", "would", "fell"], ["had taken", "would", "falls"]],
      note: "仮定法過去は「（実際には）まず起こりそうにないこと」を仮定するときにも使う。take の過去形は took。" },

    { src: "2 ⑴", type: "form", inst: "fill2",
      ja: "「あなたがその答えを知っていたらいいのに」",
      template: "I wish {} {} the answer.",
      answer: ["you", "knew"],
      dummies: [["you", "know"], ["you", "known"], ["your", "knew"], ["you", "will know"]],
      note: "〈I wish＋主語＋過去形〉で「～ならいいのに」という，今の事実とちがうことへの願望を表す。実際にはあなたは答えを知らない。" },

    { src: "2 ⑵", type: "form", inst: "fill2",
      ja: "「彼があんなに無礼でなければいいのに」",
      template: "I wish {} {} so rude.",
      answer: ["he", "weren’t"],
      dummies: [["he", "isn’t"], ["he", "doesn’t"], ["him", "weren’t"], ["he", "aren’t"]],
      note: "〈I wish＋主語＋were not〉で「～でなければいいのに」（wasn’t でもよい）。仮定法なので is ではなく were を使う。" },

    { src: "2 ⑶", type: "form", inst: "fill2",
      ja: "「私のネコが話せたらいいのに」",
      template: "I wish my cat {} {}.",
      answer: ["could", "talk"],
      dummies: [["can", "talk"], ["could", "talked"], ["would", "talking"], ["will", "talk"]],
      note: "「～できればいいのに」は〈I wish＋主語＋could＋動詞の原形〉で表す。ネコと会話したいので speak より talk が自然。" },

    { src: "2 ⑷", type: "form", inst: "fill2",
      ja: "「私に羽さえあればなあ！」",
      template: "If only {} {} wings!",
      answer: ["I", "had"],
      dummies: [["I", "have"], ["I", "has"], ["me", "had"], ["I", "had had"]],
      note: "〈If only＋主語＋過去形！〉で「～でさえあればなあ」という強い願望を表す。I wish より気持ちが強い。" },

    { src: "3 ⑴", type: "form", inst: "talk3",
      template: "A: I skipped breakfast this morning.　B: Oh, really? If you {} hungry, I {} make you a nice lunch.",
      answer: ["are", "will"],
      dummies: [["were", "would"], ["were", "will"], ["are", "would"], ["be", "will"]],
      trans: "A：今朝は朝食を抜いたんだ。　B：えっ，本当？ お腹がすいていたら，おいしい昼食を作りますよ。",
      note: "A は朝食を抜いたので，実際にお腹がすいている可能性が高い。本当にありうることを仮定するときは仮定法ではなく，ふつうの現在形（If you are ～, I will …）を使う。" },

    { src: "3 ⑵", type: "form", inst: "talk3",
      template: "A: Would you like some more meat?　B: No, thank you. If I {} full, I {} have another plate.",
      answer: ["weren’t", "would"],
      dummies: [["am not", "will"], ["weren’t", "will"], ["aren’t", "would"], ["were", "would"]],
      trans: "A：お肉をもっといかがですか。　B：いいえ，結構です。お腹がいっぱいでなければ，おかわりするのですが。",
      note: "実際にはお腹がいっぱいなので，今の事実とちがう仮定を表す仮定法過去 If I weren’t full, I would ～ を使う（wasn’t / could でもよい）。" },

    { src: "3 ⑶", type: "form", inst: "talk3",
      template: "A: Those boys are so noisy, aren’t they?　B: Yes, I really {} they {} go away!",
      answer: ["wish", "would"],
      dummies: [["wish", "will"], ["wish", "can"], ["want", "would"], ["hope", "would"]],
      trans: "A：あの少年たちはとても騒がしいよね。　B：本当に。立ち去ってくれたらいいのに。",
      note: "〈I wish＋主語＋would＋動詞の原形〉で「～してくれたらいいのに」という，相手や周りへの願望（いらだち）を表す。" },

    { src: "4 ⑴", type: "order",
      ja: "一生懸命勉強すれば，彼はテストでよい点を取るかもしれないのに。",
      before: "", after: "on tests.",
      chunks: ["he", "hard", "if", "studied", ",", "good", "might", "he", "grades", "get"],
      answer: ["if", "he", "studied", "hard", ",", "he", "might", "get", "good", "grades"],
      note: "仮定法過去〈If＋主語＋過去形 ～, 主語＋might＋動詞の原形 …〉。might は「～かもしれない」。実際には彼は一生懸命勉強していない。" },

    { src: "4 ⑵", type: "order",
      ja: "彼がただ冗談を言おうとしているんだったらいいのに。",
      before: "I", after: "to make a joke.",
      chunks: ["were", "he", "trying", "wish", "just"],
      answer: ["wish", "he", "were", "just", "trying"],
      note: "〈I wish＋主語＋were＋-ing 形〉で「（今）～していればいいのに」。仮定法なので is ではなく were。" },

    { src: "4 ⑶", type: "order",
      ja: "【状況】私は毎日運動をしているので，ストレスを解消できていますが…。",
      before: "", after: "stressed.",
      chunks: ["I", "exercise", "if", "didn’t", "every day, I", "be", "would", "more"],
      answer: ["if", "I", "didn’t", "exercise", "every day, I", "would", "be", "more"],
      trans: "毎日運動しなければ，もっとストレスがたまるだろう。",
      note: "実際には毎日運動しているので，その逆を仮定する仮定法過去。If I didn’t exercise ～, I would be … で「もし運動しなければ，…だろう」。\nbe stressed は「ストレスを感じている」。" }
  ]
});

LESSONS.push({ id: "21-2", title: "仮定法",
  inst: {
    verb6: "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
    fill7: "日本語の意味に合うように，（ ）に入る適切な語の組み合わせを選びなさい。",
    talk8: "会話が成り立つように，語句を並べかえなさい。"
  },
  questions: [
    { src: "6 ⑴", type: "form", inst: "verb6",
      ja: "昨日暇だったら，あなたたちと夕食を一緒に食べたのに。", verb: "be / join",
      template: "If I {} {} free yesterday, I {} {} {} you for dinner.",
      answer: ["had", "been", "would", "have", "joined"],
      dummies: [["had", "been", "would", "has", "joined"], ["had", "been", "will", "have", "joined"], ["were", "being", "would", "have", "joined"], ["had", "be", "would", "have", "joined"]],
      note: "過去の事実とちがうことを仮定するときは〈If＋主語＋had＋過去分詞 ～, 主語＋would have＋過去分詞 …〉（仮定法過去完了）を使う。実際には昨日は暇ではなかった。" },

    { src: "6 ⑵", type: "form", inst: "verb6",
      ja: "私があのミスをしなければ，私たちのチームは勝つことができたのに。", verb: "make / win",
      template: "If I {} {} that mistake, our team {} {} {}.",
      answer: ["hadn’t", "made", "could", "have", "won"],
      dummies: [["hadn’t", "made", "could", "have", "win"], ["didn’t", "made", "could", "have", "won"], ["hadn’t", "made", "can", "have", "won"], ["hadn’t", "make", "could", "have", "won"]],
      note: "仮定法過去完了。「～できたのに」は〈could have＋過去分詞〉。win の過去分詞は won。実際にはミスをして，チームは負けた。" },

    { src: "6 ⑶", type: "form", inst: "verb6",
      ja: "あなたが事前に電話をくれていたらなあ。", verb: "call",
      template: "I {} you {} {} me in advance.",
      answer: ["wish", "had", "called"],
      dummies: [["wish", "have", "called"], ["wish", "had", "call"], ["hope", "had", "called"], ["wish", "were", "called"]],
      note: "〈I wish＋主語＋had＋過去分詞〉で「～していたらよかったのに」という，過去の事実とちがうことへの願望を表す。in advance は「事前に」。" },

    { src: "6 ⑷", type: "form", inst: "verb6",
      ja: "彼が 5 分早く到着してさえいたらなあ。", verb: "arrive",
      template: "If {} he {} {} five minutes earlier!",
      answer: ["only", "had", "arrived"],
      dummies: [["only", "has", "arrived"], ["only", "had", "arrive"], ["even", "had", "arrived"], ["only", "was", "arrived"]],
      note: "〈If only＋主語＋had＋過去分詞！〉で「～してさえいたらなあ」という，過去のことへの強い後悔を表す。" },

    { src: "7 ⑴", type: "form", inst: "fill7",
      ja: "「私の上司であるかのように」",
      template: "Why do you act as if {} {} my boss?",
      answer: ["you", "were"],
      dummies: [["you", "be"], ["your", "were"], ["you", "had"], ["you", "been"]],
      trans: "あなたはなぜ私の上司であるかのように振る舞うのですか。",
      note: "〈as if＋主語＋過去形〉で「まるで～であるかのように」。相手は実際には上司ではないので，仮定法過去 were を使う。" },

    { src: "7 ⑵", type: "form", inst: "fill7",
      ja: "「幽霊を見たかのように」",
      template: "She screamed as if she {} {} a ghost.",
      answer: ["had", "seen"],
      dummies: [["has", "seen"], ["had", "saw"], ["were", "seen"], ["have", "seen"]],
      trans: "彼女はまるで幽霊を見たかのように叫んだ。",
      note: "〈as if＋主語＋had＋過去分詞〉で「まるで～したかのように」。叫んだときより前に「見た」ことを表すので仮定法過去完了。" },

    { src: "7 ⑶", type: "form", inst: "fill7",
      ja: "「私たちは出発してもいいころだ」",
      template: "It’s {} we {} for school.",
      answer: ["time", "left"],
      dummies: [["time", "leave"], ["time", "leaves"], ["time", "leaving"], ["times", "left"]],
      trans: "私たちは学校へ出発してもいいころだ。",
      note: "〈It’s time＋主語＋過去形〉で「もう～してもいいころだ」。提案や忠告を表すときにも仮定法過去を使う。leave の過去形は left。" },

    { src: "8 ⑴", type: "order", inst: "talk8",
      ja: "A: Didn’t you have a map with you?",
      before: "B: No. If I had had one,", after: ".",
      chunks: ["have", "I", "lost", "wouldn’t", "gotten"],
      answer: ["I", "wouldn’t", "have", "gotten", "lost"],
      trans: "A：地図は持ってなかったの？　B：うん。地図を持っていたら，道に迷わなかったよ。",
      note: "仮定法過去完了〈If＋主語＋had＋過去分詞 ～, 主語＋wouldn’t have＋過去分詞 …〉。get lost は「道に迷う」。実際には地図がなくて道に迷った。" },

    { src: "8 ⑵", type: "order", inst: "talk8",
      ja: "A: Lisa told me your secret.",
      before: "B: Oh, no! I", after: "to you.",
      chunks: ["told", "it", "hadn’t", "she", "wish"],
      answer: ["wish", "she", "hadn’t", "told", "it"],
      trans: "A：リサがきみの秘密を教えてくれたよ。　B：えっ，ウソ！ 彼女があなたに言わないでくれたらよかったのに。",
      note: "〈I wish＋主語＋had not＋過去分詞〉で「～しなかったらよかったのに」。実際にはリサは秘密を話してしまった。" },

    { src: "8 ⑶", type: "order", inst: "talk8",
      ja: "A: What was it like to be in the old castle?",
      before: "B: Amazing! I", after: "back in the Edo period.",
      chunks: ["as", "I", "if", "were", "felt"],
      answer: ["felt", "as", "if", "I", "were"],
      trans: "A：古城の中にいるのはどんな感じだった？　B：すばらしかった！ まるで江戸時代に戻ったかのような気がしたよ。",
      note: "feel as if ～ で「まるで～であるかのように感じる」。as if のあとは仮定法なので were を使う。" },

    { src: "9 ⑴", type: "order",
      ja: "医者の言うことを聞いていたら，彼はもっと早く回復していたかもしれない。",
      before: "If", after: ".",
      chunks: ["to", "had", "he", "listened", "the doctor, he", "faster", "might", "recovered", "have"],
      answer: ["he", "had", "listened", "to", "the doctor, he", "might", "have", "recovered", "faster"],
      note: "仮定法過去完了。「～していたかもしれない」は〈might have＋過去分詞〉。listen to A は「A の言うことを聞く」。" },

    { src: "9 ⑵", type: "order",
      ja: "今朝，夜の間に雨が降ったかのように道路がぬれていた。",
      before: "This morning the road was wet", after: "during the night.",
      chunks: ["rained", "if", "it", "had", "as"],
      answer: ["as", "if", "it", "had", "rained"],
      note: "〈as if＋主語＋had＋過去分詞〉で「まるで～したかのように」。実際には雨は降っていない。" },

    { src: "9 ⑶", type: "order",
      ja: "【状況】下校時間を過ぎても友だちと残っていたら，先生に言われました。",
      before: "", after: ".",
      chunks: ["time", "home", "it’s", "went", "students"],
      answer: ["it’s", "time", "students", "went", "home"],
      trans: "生徒たちは家に帰る時間だ。",
      note: "〈It’s time＋主語＋過去形〉で「もう～する時間だ」。相手に対する要求や提案を表す。go の過去形は went。" }
  ]
});


// =====================================================================
// ここから下はロジック（通常は編集不要）
// =====================================================================

// 全レッスンの問題を1列に並べる（各問題にレッスン番号を付ける）
const ALL = [];
LESSONS.forEach((L, li) => {
  L.questions.forEach(q => {
    if (q.type === "form" && !q.template) {   // 旧形式（before / answer / after）にも対応
      q.template = [q.before, "{}", q.after].filter(Boolean).join(" ");
      q.answer = [q.answer];
      q.dummies = q.dummies.map(d => [d]);
    }
    q.lesson = L.id;
    q.lessonIndex = li;
    ALL.push(q);
  });
});

const app = document.getElementById("app");
const progressEl = document.getElementById("progress");

let queue = [];    // 出題する問題（ALL のインデックス）
let records = [];  // 各問の解答状態
let pos = 0;
let studentId = "";
let sessionLabel = "";  // 記録用：出題数（例：「10問」「復習5問」）
let rangeLabel = "";    // 記録用：練習範囲（例：「Lesson 9-1」「Lesson 9-1～Lesson 10-2」）

// ---------- この端末のブラウザに記憶（学籍番号・前回の範囲） ----------
function load(key) {
  try { return localStorage.getItem(key) || ""; } catch (e) { return ""; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

// ---------- 学習記録の送信 ----------
const RESULT_LABELS = { correct: "正解", wrong: "不正解", skipped: "とばした" };

function post(data) {
  if (!LOG_URL) return;
  try {
    fetch(LOG_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(data) })
      .catch(() => {});
  } catch (e) {}
}

function chosenText(q, rec) {
  if (rec.result === "skipped") return "";
  if (q.type === "form") return optionLabel(q, rec.options[rec.choice]);
  if (q.type === "blanks") return rec.sels.join(" / ");
  return rec.picked.map(pi => rec.pool[pi]).join(" ");
}

function sendLog(q, rec) {
  post({
    student: studentId,
    lesson: "Lesson " + q.lesson,
    question: q.src,
    result: RESULT_LABELS[rec.result],
    choice: chosenText(q, rec),
    count: sessionLabel
  });
}

// 練習を始めたときに1行送る（sessions シート用）
function sendSession() {
  post({ type: "session", student: studentId, lesson: rangeLabel, count: sessionLabel });
}

// ---------- 共通の小さな関数 ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ダミー候補から DUMMY_COUNT 個をランダムに選ぶ
function pickDummies(list) { return shuffle(list).slice(0, DUMMY_COUNT); }

// 先頭の英字を大文字にする（先頭の引用符などは飛ばす）
function cap(s) { return s ? s.replace(/^([“"‘(\s]*)([a-z])/, (m, a, b) => a + b.toUpperCase()) : s; }

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function joinSentence(parts) {
  return parts.filter(Boolean).join(" ").replace(/ ([.,?!”])/g, "$1").replace(/“ /g, "“");
}

function fillTemplate(template, words) {
  let i = 0;
  return cap(template.replace(/\{\}/g, () => words[i++]));
}

function fullAnswer(q) {
  if (q.type === "form") return fillTemplate(q.template, q.answer);
  if (q.type === "order") return cap(joinSentence([q.before, ...q.answer.map((c, k) => displayChunk(q, c, k === 0)), q.after]));
  return fillTemplate(q.template, q.blanks.map(b => b.answer));
}

// 選択肢の表示：隣り合う空所はスペース，離れた空所は「…」でつなぐ
function optionLabel(q, words) {
  const parts = q.template.split("{}");
  const atStart = q.template.startsWith("{}");
  return words.map((w, k) => (k === 0 && atStart ? cap(w) : w) +
    (k < words.length - 1 ? (parts[k + 1].trim() === "" ? " " : " … ") : "")).join("");
}

// 文頭にくる語句だけ大文字で表示
// （並べかえの前の文が空・文の終わり・開きかっこのとき）
function displayChunk(q, text, isFirst) {
  return isFirst && (!q.before || /[.?!“"]$/.test(q.before.trim())) ? cap(text) : text;
}

function instruction(q) {
  const key = q.inst || q.type;
  const L = LESSONS[q.lessonIndex];
  return (L.inst && L.inst[key]) || INSTRUCTIONS[key] || "";
}

function lessonLabel(L) { return `Lesson ${L.id}　${L.title}`; }

// 答え合わせ済み、またはとばした問題は解答を確定（解説を表示）
function isChecked(rec) { return !!rec.result; }

// ---------- 画面：最初の画面（学籍番号・範囲・問題数） ----------
function renderHome() {
  progressEl.textContent = "";
  const savedFrom = LESSONS.findIndex(L => L.id === load("rangeFrom"));
  const savedTo = LESSONS.findIndex(L => L.id === load("rangeTo"));
  let from = savedFrom >= 0 ? savedFrom : 0;
  let to = savedTo >= from ? savedTo : from;

  const opts = LESSONS.map((L, i) => `<option value="${i}">${esc(lessonLabel(L))}</option>`).join("");
  let html = `<p class="label">学籍番号（4桁）</p>`;
  html += `<p><input type="text" id="sid" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(studentId || load("studentId"))}"></p>`;
  html += `<p class="label">練習するレッスン</p>`;
  html += `<div class="range"><span class="range-tag">はじめ</span><select id="from">${opts}</select></div>`;
  html += `<div class="range"><span class="range-tag">おわり</span><select id="to">${opts}</select></div>`;
  html += `<p class="sub" id="rangeInfo"></p>`;
  html += `<p class="label">問題数</p><div class="actions" id="counts"></div>`;
  app.innerHTML = html;

  const sid = document.getElementById("sid");
  const fromSel = document.getElementById("from");
  const toSel = document.getElementById("to");
  fromSel.value = from;
  toSel.value = to;

  const pool = () => ALL.map((q, i) => i).filter(i => ALL[i].lessonIndex >= from && ALL[i].lessonIndex <= to);

  const update = () => {
    sid.value = sid.value.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
                         .replace(/\D/g, "").slice(0, 4);
    const total = pool().length;
    document.getElementById("rangeInfo").textContent =
      (from === to ? `Lesson ${LESSONS[from].id}` : `Lesson ${LESSONS[from].id} ～ Lesson ${LESSONS[to].id}`) + `（全${total}問）`;
    const counts = COUNT_OPTIONS.filter(n => n < total);
    const ok = /^\d{4}$/.test(sid.value);
    document.getElementById("counts").innerHTML =
      counts.map(n => `<button class="primary count" data-n="${n}" ${ok ? "" : "disabled"}>${n}問</button>`).join("") +
      `<button class="primary count" data-n="${total}" ${ok ? "" : "disabled"}>全問（${total}問）</button>`;
    app.querySelectorAll("button.count").forEach(b => b.addEventListener("click", () => {
      studentId = sid.value;
      save("studentId", studentId);
      save("rangeFrom", LESSONS[from].id);
      save("rangeTo", LESSONS[to].id);
      rangeLabel = from === to ? `Lesson ${LESSONS[from].id}` : `Lesson ${LESSONS[from].id}～Lesson ${LESSONS[to].id}`;
      const n = Number(b.dataset.n);
      start(shuffle(pool()).slice(0, n), n === total ? `全問${n}問` : `${n}問`);
    }));
  };

  fromSel.addEventListener("change", () => {
    from = Number(fromSel.value);
    if (to < from) { to = from; toSel.value = to; }
    update();
  });
  toSel.addEventListener("change", () => {
    to = Number(toSel.value);
    if (to < from) { from = to; fromSel.value = from; }
    update();
  });
  sid.addEventListener("input", update);
  update();
}

function start(indices, label) {
  sessionLabel = label;
  sendSession();
  queue = shuffle(indices);
  records = queue.map(() => ({}));
  pos = 0;
  renderQuestion();
}

// ---------- 画面：問題 ----------
function renderQuestion() {
  const q = ALL[queue[pos]];
  const rec = records[pos];
  const checked = isChecked(rec);
  progressEl.textContent = `${studentId}｜${pos + 1} / ${queue.length}`;

  let html = `<p class="source">Lesson ${esc(q.lesson)}　EXERCISES ${esc(q.src)}</p>`;
  html += `<p class="instruction">${esc(instruction(q))}</p>`;
  if (q.ja) html += `<p class="ja">${esc(q.ja)}</p>`;

  if (q.type === "form") {
    if (!rec.options) rec.options = shuffle([q.answer, ...pickDummies(q.dummies)]);
    const fills = rec.choice === undefined ? null : rec.options[rec.choice];
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      return `<span class="slot">${fills ? esc(k === 0 && atStart ? cap(fills[k]) : fills[k]) : "&nbsp;"}</span>`;
    });
    if (q.words) html += `<div class="verbs">${esc(q.words.box)}</div>`;
    if (q.verb) html += `<p class="hint">［ ${esc(q.verb)} ］</p>`;
    html += `<p class="sentence">${body}</p>`;
    html += `<div class="pool" id="options">` + rec.options.map((o, oi) =>
      `<button class="chunk${oi === rec.choice ? " selected" : ""}" data-i="${oi}" ${checked ? "disabled" : ""}>${esc(optionLabel(q, o))}</button>`
    ).join("") + `</div>`;
  }

  if (q.type === "blanks") {
    if (!rec.sels) rec.sels = q.blanks.map(() => "");
    if (!rec.opts) rec.opts = q.blanks.map(b => b.verb ? q.words.choices : shuffle([b.answer, ...pickDummies(b.dummies)]));
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      const opts = rec.opts[k].map(o =>
        `<option value="${esc(o)}" ${o === rec.sels[k] ? "selected" : ""}>${esc(k === 0 && atStart ? cap(o) : o)}</option>`
      ).join("");
      return `<select data-k="${k}" ${checked ? "disabled" : ""}><option value="">―</option>${opts}</select>`;
    });
    if (q.words) html += `<div class="verbs">${esc(q.words.box)}</div>`;
    html += `<p class="sentence">${body}</p>`;
  }

  if (q.type === "order") {
    if (!rec.pool) {
      const all = q.chunks.concat(q.extra || []);   // extra：使わない語句（形を選ばせるためのもの）
      do { rec.pool = shuffle(all); } while (all.length > 1 && rec.pool.join(" ") === q.answer.join(" "));
      rec.picked = [];
    }
    html += `<p class="sentence" id="line"></p><div class="pool" id="pool"></div>`;
  }

  html += `<div class="actions">`;
  html += `<button id="back" ${pos === 0 ? "disabled" : ""}>もどる</button>`;
  if (!checked) html += `<button id="skip">とばす</button>`;
  html += `<button class="primary" id="main">${checked ? (pos + 1 < queue.length ? "次へ" : "結果を見る") : "答え合わせ"}</button>`;
  html += `</div><div id="fb"></div>`;
  app.innerHTML = html;

  document.getElementById("back").addEventListener("click", () => { pos--; renderQuestion(); });
  if (!checked) document.getElementById("skip").addEventListener("click", onSkip);
  document.getElementById("main").addEventListener("click", onMain);

  if (q.type === "form" && !checked) {
    app.querySelectorAll("#options button").forEach(b => b.addEventListener("click", () => {
      rec.choice = Number(b.dataset.i);
      renderQuestion();
    }));
  }
  if (q.type === "blanks" && !checked) {
    app.querySelectorAll("select").forEach(el => el.addEventListener("change", () => {
      rec.sels[Number(el.dataset.k)] = el.value;
      updateMain(q, rec);
    }));
  }
  if (q.type === "order") renderOrder(q, rec, checked);

  if (checked) renderFeedback(q, rec.result);
  else updateMain(q, rec);
}

function renderOrder(q, rec, checked) {
  const line = document.getElementById("line");
  const poolEl = document.getElementById("pool");

  const chosen = rec.picked.map((pi, k) =>
    `<button class="chunk" data-k="${k}" ${checked ? "disabled" : ""}>${esc(displayChunk(q, rec.pool[pi], k === 0))}</button>`
  ).join(" ");
  const slots = rec.picked.length < q.answer.length ? ` <span class="slot">&nbsp;</span>` : "";
  line.innerHTML = joinSentence([esc(q.before || ""), chosen + slots, esc(q.after || "")]);

  poolEl.innerHTML = rec.pool.map((text, pi) =>
    rec.picked.includes(pi) ? "" : `<button class="chunk" data-pi="${pi}" ${checked ? "disabled" : ""}>${esc(text)}</button>`
  ).join("");

  if (checked) return;
  line.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    rec.picked.splice(Number(b.dataset.k), 1);
    renderOrder(q, rec, false);
  }));
  poolEl.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    if (rec.picked.length >= q.answer.length) return;
    rec.picked.push(Number(b.dataset.pi));
    renderOrder(q, rec, false);
  }));
  updateMain(q, rec);
}

function isReady(q, rec) {
  if (q.type === "form") return rec.choice !== undefined;
  if (q.type === "blanks") return rec.sels.every(v => v);
  return rec.picked.length === q.answer.length;
}

function updateMain(q, rec) {
  document.getElementById("main").disabled = !isReady(q, rec);
}

function judge(q, rec) {
  if (q.type === "form") return rec.options[rec.choice].join(" ") === q.answer.join(" ");
  if (q.type === "blanks") return q.blanks.every((b, i) => rec.sels[i] === b.answer);
  return rec.picked.map(pi => rec.pool[pi]).join(" ") === q.answer.join(" ");
}

function renderFeedback(q, result) {
  const marks = {
    correct: `<p class="mark ok">○ 正解</p>`,
    wrong:   `<p class="mark ng">× 不正解</p>`,
    skipped: `<p class="mark">とばした問題</p>`
  };
  let fb = `<div class="feedback">`;
  fb += marks[result];
  fb += `<p class="answer">${esc(fullAnswer(q))}</p>`;
  if (q.trans) fb += `<p>${esc(q.trans)}</p>`;
  if (q.note) fb += `<p class="note">${esc(q.note).replace(/\n/g, "<br>")}</p>`;
  fb += `</div>`;
  document.getElementById("fb").innerHTML = fb;
}

function onMain() {
  const q = ALL[queue[pos]];
  const rec = records[pos];
  if (isChecked(rec)) { next(); return; }
  rec.result = judge(q, rec) ? "correct" : "wrong";
  sendLog(q, rec);
  renderQuestion();
  document.getElementById("main").focus();
}

function onSkip() {
  records[pos].result = "skipped";
  sendLog(ALL[queue[pos]], records[pos]);
  renderQuestion();
  document.getElementById("main").focus();
}

function next() {
  pos++;
  if (pos < queue.length) renderQuestion();
  else renderResult();
}

// ---------- 画面：結果 ----------
function renderResult() {
  progressEl.textContent = "";
  const score = records.filter(r => r.result === "correct").length;
  const skipped = records.filter(r => r.result === "skipped").length;
  const missed = queue.filter((_, i) => records[i].result !== "correct");

  let html = `<p class="sub">${esc(rangeLabel)}</p>`;
  html += `<p class="result">${score} / ${queue.length} 問正解</p>`;
  if (skipped) html += `<p class="ja">とばした問題：${skipped}問</p>`;
  html += `<div class="actions">`;
  if (missed.length) html += `<button class="primary" id="retryWrong">間違えた・とばした問題（${missed.length}問）</button>`;
  html += `<button id="home">最初の画面にもどる</button></div>`;
  app.innerHTML = html;

  if (missed.length) document.getElementById("retryWrong").addEventListener("click", () => start(missed, `復習${missed.length}問`));
  document.getElementById("home").addEventListener("click", renderHome);
}

document.getElementById("title").textContent = APP_TITLE;
document.title = APP_TITLE;
renderHome();
