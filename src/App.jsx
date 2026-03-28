import { useState, useEffect } from 'react'

const STRIPE_LINK = 'https://buy.stripe.com/test_aFa3cuaukdVe4gM5fO2Ji00'

// ══════════════════════════════════════════
// 四柱推命
// ══════════════════════════════════════════
const STEMS   = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const BRANCHES= ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const ANIMALS = ['ねずみ','うし','とら','うさぎ','たつ','へび','うま','ひつじ','さる','とり','いぬ','いのしし']
const S_ELEM  = ['木','木','火','火','土','土','金','金','水','水']
const S_YIN   = ['陽','陰','陽','陰','陽','陰','陽','陰','陽','陰']

function yearPillar(y){
  const s=((y-4)%10+10)%10, b=((y-4)%12+12)%12
  return {stem:STEMS[s],branch:BRANCHES[b],elem:S_ELEM[s],yin:S_YIN[s],animal:ANIMALS[b]}
}
// 基準日：1900-01-01 = 甲(0)戌(10)
function dayPillar(y,m,d){
  const diff=Math.round((new Date(y,m-1,d)-new Date(1900,0,1))/86400000)
  const s=((diff%10)+10)%10, b=(((diff+10)%12)+12)%12
  return {stem:STEMS[s],branch:BRANCHES[b],elem:S_ELEM[s],yin:S_YIN[s]}
}

// ══════════════════════════════════════════
// 西洋占星術
// ══════════════════════════════════════════
const SIGNS=[
  {name:'山羊座',sym:'♑',elem:'地',key:'堅実と野望',m:1,d:19},
  {name:'水瓶座',sym:'♒',elem:'風',key:'革新と自由',m:2,d:18},
  {name:'魚座',  sym:'♓',elem:'水',key:'共感と夢想',m:3,d:20},
  {name:'牡羊座',sym:'♈',elem:'火',key:'情熱と開拓',m:4,d:19},
  {name:'牡牛座',sym:'♉',elem:'地',key:'安定と美',  m:5,d:20},
  {name:'双子座',sym:'♊',elem:'風',key:'知性と多才',m:6,d:21},
  {name:'蟹座',  sym:'♋',elem:'水',key:'感受と家族',m:7,d:22},
  {name:'獅子座',sym:'♌',elem:'火',key:'創造とカリスマ',m:8,d:22},
  {name:'乙女座',sym:'♍',elem:'地',key:'完璧と奉仕',m:9,d:22},
  {name:'天秤座',sym:'♎',elem:'風',key:'調和と美意識',m:10,d:23},
  {name:'蠍座',  sym:'♏',elem:'水',key:'洞察と変容',m:11,d:21},
  {name:'射手座',sym:'♐',elem:'火',key:'楽観と冒険',m:12,d:21},
  {name:'山羊座',sym:'♑',elem:'地',key:'堅実と野望',m:12,d:31},
]
function sunSign(m,d){
  for(const s of SIGNS) if(m<s.m||(m===s.m&&d<=s.d)) return s
  return SIGNS[0]
}

// ══════════════════════════════════════════
// 今月の運勢
// ══════════════════════════════════════════
const M_ELEM={1:'水',2:'水',3:'木',4:'木',5:'火',6:'火',7:'火',8:'土',9:'金',10:'金',11:'水',12:'水'}
const GEN={木:'火',火:'土',土:'金',金:'水',水:'木'}
const OVER={木:'土',火:'金',土:'水',金:'木',水:'火'}
function getMonthFortune(dayElem, month){
  const me=M_ELEM[month]
  if(GEN[me]===dayElem)  return {stars:'⭐⭐⭐⭐⭐',title:'最強運期',msg:`【今月の動作モード：フル解放】\n\n宇宙があなたに全力で「GO！」を出しています。今月のあなたはまさに神がかり状態。なんとなく始めたことが形になる、なんとなく会った人が重要人物になる、そんな「なんとなく」が大正解になる不思議な月です。\n\n📌 今月やると効果的なこと\n・ずっと気になっていたけど踏み出せなかったこと\n・新しい人に会いに行く・連絡してみる\n・「どうせ私には無理かも」と思っていたチャレンジ\n\n⚡ 今月の注意仕様\nエネルギーが高すぎて空回りすることも。「全部やる！」より「これだけやる」と決める方が結果が出ます。\n\n✨ 今月のあなたへ\n迷ったら動く。考えすぎは今月だけはもったいないです。あなたの直感、今月は大当たりします。`}
  if(GEN[dayElem]===me)  return {stars:'⭐⭐⭐⭐', title:'成長運期',msg:`【今月の動作モード：拡張中】\n\n今月はあなたが動くほどに、まわりがどんどん動き出す「連鎖反応型」の月です。誰かのために動いたことが、なぜか自分に返ってくる不思議な好循環が起きやすい時期。「情けは人のためならず」を体感する月です。\n\n📌 今月やると効果的なこと\n・誰かを手伝う・応援する・紹介する\n・コミュニティや勉強会に参加してみる\n・新しいスキルのインプットを始める\n\n⚡ 今月の注意仕様\n頑張りすぎて自分の充電を忘れがち。人のために動くのは素敵ですが、週に1回は「完全オフデー」を設定してください。\n\n✨ 今月のあなたへ\nあなたが輝くほど、まわりも明るくなります。遠慮せずに前に出ていい月です。`}
  if(me===dayElem)       return {stars:'⭐⭐⭐',   title:'安定運期',msg:`【今月の動作モード：土台構築中】\n\n派手な出来事は少ないけれど、実はこれが一番大事な月かもしれません。今月コツコツ積み上げたものが、来月・再来月に「あの時やっておいてよかった！」と思えるものになります。地味だけど、確実に前進している月です。\n\n📌 今月やると効果的なこと\n・毎日続けられる小さな習慣を始める\n・後回しにしていた整理整頓・見直し作業\n・じっくり考えたかったことを考える時間を作る\n\n⚡ 今月の注意仕様\n「なんか面白いことないかな」と刺激を求めてウロウロしがち（あるある）。でも今月はそれより「深掘り」がキーワードです。\n\n✨ 今月のあなたへ\n地道な今月が、未来のあなたを作っています。目に見えない成長中。信じて続けて。`}
  if(OVER[dayElem]===me) return {stars:'⭐⭐',    title:'充電運期',msg:`【今月の動作モード：充電中🔋】\n\n今月はエネルギーの「貯めどき」です。無理して動こうとすると空回りしやすいので、思い切って「休む・整える・インプットする」に集中しましょう。充電中のスマホを無理やり使おうとするのと同じ、今月はそれはしないで。\n\n📌 今月やると効果的なこと\n・好きな本・映画・音楽をたっぷり楽しむ\n・身体のメンテナンス（マッサージ・早寝など）\n・来月以降の計画を静かに考える\n\n⚡ 今月の注意仕様\n「なんか最近うまくいかない」と感じやすい時期。でもそれはあなたのせいじゃなく、季節のリズムです。自分を責めないこと！\n\n✨ 今月のあなたへ\nしっかり充電した来月のあなたは、今月より確実に強くなっています。今月の「休む」は怠けではなく、戦略です。`}
  return                        {stars:'⭐',      title:'忍耐運期',msg:`【今月の動作モード：試練クリア中💪】\n\n正直に言います。今月はちょっとしんどいかもしれません。でも！これを読んでいるあなたに伝えたいのは、「試練が多い月＝成長が大きい月」だということ。乗り越えた後のあなたは、今より確実に一段上にいます。\n\n📌 今月やると効果的なこと\n・「できないこと」より「できたこと」を毎日1つ記録する\n・信頼できる人に話を聞いてもらう\n・焦って大きな決断をしない（来月に持ち越してOK）\n\n⚡ 今月の注意仕様\n踏ん張っているのに評価されない・空回りする、という経験をしやすい月。でもこれ、あなたの実力不足ではありません。タイミングの問題です。\n\n✨ 今月のあなたへ\n必ず抜けます。今月の「耐えた経験」は、未来のあなたの最大の武器になります。あなたは思っているより、ずっと強い。`}
}

// ══════════════════════════════════════════
// 日主別コンテンツ
// ══════════════════════════════════════════
const CONT={
  木:{
    title:'成長型クリエイター',
    spec:'【製品概要】\nこのモデルの基本動作は「上へ、上へ」。まるで春に芽吹く木のように、どんな環境でもじわじわと成長し続けます。最初はゆっくりに見えても、気づいたらまわりがびっくりするくらい遠くにいる、そんなタイプです。\n\n【基本スペック】\n・好奇心センサー：常時オン（新しいことに自動反応）\n・粘り強さ：業界トップクラス（やめ時がわからないくらい続けられる）\n・共感アンテナ：高感度（相手の可能性をいち早く察知）\n・外見モード：穏やかで落ち着いてる／内部：信念が静かに燃えている\n\n【推奨稼働環境】\n「学ぶ→試す→形にする」のサイクルが回せる場所で最高のパフォーマンスが出ます。褒められると出力が上がる仕様なので、ちゃんと認めてくれる環境を選んでいきましょう。あなたの成長を邪魔する場所にいる必要はないです。',
    keys:['創造力','成長志向','共感力'],
    love:'【恋愛モードの仕様】\nあなたの恋愛の最優先事項は「この人と一緒に成長できるか？」です。好きになった相手のいいところを全力で応援できる、とっても献身的な一面を持っています。相手の夢を自分のことのように喜べる、そんな素敵な人です。\n\nただ、自分の成長を邪魔されると感じると、言葉にせずにそっと距離を置いていきます（別れを告げるより先に心が離れていくタイプ）。\n\n💕 ときめきスイッチが入る言葉\n「あなたのおかげで変われた」「一緒にいると自分のことが好きになれる」→ このひと言でエンジンが全開になります。\n\n⚠️ ちょっと注意してほしいこと\n変化がない・成長を感じられない関係が続くと、じわじわと窒息感を覚えます。停滞よりも一緒にチャレンジできる関係が長続きの秘訣です。\n\n🔑 あなたへの取扱いのコツ\n言葉より「一緒に何かを成し遂げる体験」が絆を深めます。デートよりも一緒にプロジェクトを進める方が燃えるかも（笑）。あなたはそういう人です。それで全然いいです。',
    work:'【仕事モードの仕様】\n教育・クリエイティブ・コーチングなど「誰かの成長に関われる仕事」で本当の実力が発揮されます。スタートダッシュは遅めに見えるかもしれないけれど、3年・5年という単位で見ると周りがびっくりするくらい遠くにいます。\n\n「なぜそうなるのか」を理解してから動くタイプなので、一度覚えたスキルは絶対に消えない。まさに「遅効性・高品質」な仕事人です。\n\n🚀 やる気スイッチ\n「あなたにしかできない」「この仕事、あなたのためにあると思ってた」→ この言葉で別人のように動き出します。覚えておいてください。\n\n⏰ ゴールデンタイム\n午前中の静かな時間帯。ノイズが少ないほど本来のパフォーマンスが出ます。\n\n💡 向いているお仕事\n教育・コンテンツ制作・コーチング・価値観診断・キャリアカウンセリング。人を「育てる」「引き出す」ことに関わる仕事が天職です。',
    relations:'【人間関係モードの仕様】\n最初はゆっくり距離を縮めるタイプ。「なかなか打ち解けないな」と思われることもありますが、これはあなたが相手をちゃんと見極めているからです。ぜんぜんおかしくない、むしろ誠実な証拠です。\n\n心を開いた相手には義理堅く、変化や成長を誰よりも早く気づいてあげられるという特技があります。「そういえば最近元気ないね」と先に気づいて声をかけられる、そんな存在です。\n\n✅ 大切にしたい関係\nお互いに高め合えるライバル兼仲間。同じ目標に向かって走れるコミュニティ。\n\n❌ 消耗しやすい相手\n「どうせ無理」が口癖で変化を嫌う人。あなたの可能性に水を差す人とはそっと距離を置いていいです。あなたの環境はあなたが選んでいい。\n\n💝 あなたへの取扱いのコツ\n「ありがとう」より「あなたのここが好き」という具体的な言葉が一番刺さります。ぜひ周りの人にも教えてあげてください。',
    stress:'【ストレスと回復の仕様】\n成長を邪魔された時・頑張ってるのに評価されない時・意味を感じないルーティン作業が続く時にエネルギーが下がります。\n\nあなたのSOSサインは外から見えにくいのが特徴です。表面は普通に見えても内側ではかなり消耗していることがあるので、自分でも気づかないうちにガス欠になりやすい。\n\n🔋 充電に効くこと\n・自然の中をゆっくり歩く（頭が整理される）\n・新しいことをちょっとだけ学んでみる\n・植物や動物と過ごす（不思議とエネルギーが戻る）\n\n⚠️ こんなサインが出てきたら注意して\n・やる気が全然出ない / 言葉数が減る\n・「どうせ変わらない」が口癖になる\n→ これはあなたが弱いんじゃなくて、充電が必要なサインです。\n\n✨ 回復の処方箋\n小さくてもいい「できた！」を毎日1つ意識的に作ること。完璧じゃなくていい。「あ、今日もちゃんとやった」それだけで十分です。',
    talent:'【才能と使命の仕様】\nあなたの最も輝く才能は「人の可能性を見つけて育てること」です。まだ芽吹いていない才能の種を見つけ、水を与え、光を当てて花開かせることができます。これ、誰でもできることじゃないです。\n\n自分では「たいしたことしてない」と思っていても、あなたが関わった人の人生が確実に豊かになっているはずです。それがあなたの才能の証明です。\n\n🌟 あなたの隠れた天才\n「この人はここが伸びる」と直感でわかる眼力。一般的な人が見落とすものを自然とキャッチできます。\n\n🎯 あなたの人生テーマ\n成長と創造。あなたがいるだけで、まわりが少しずつ前に進んでいく。\n\n💫 一番輝く瞬間\n関わった誰かが「できた！」と喜ぶ瞬間を、一緒に涙が出るくらい喜べた時。そのあなたが一番美しいです。',
  },
  火:{
    title:'情熱の太陽型リーダー',
    spec:'【製品概要】\nこのモデルの基本動作は「場の温度を上げる」。ただいるだけで場が明るくなり、「やってみようかな」という空気を自然に作れる、天性のムードメーカーです。全力で燃えているときのあなたには、誰も追いつけません。\n\n【基本スペック】\n・感情出力：最大級（顔・言葉・行動に全部出る。隠せない）\n・場の巻き込み力：天性のカリスマで自動発動\n・熱量：高い（ただし定期的な燃料補給＝刺激が必要）\n・外見モード：明るく全開／内部：常に燃焼中\n\n【推奨稼働環境】\n「好き・楽しい・意味がある」の3つが揃った環境で本領発揮。注目されて、表現できて、人と関われる場所があなたのホームグラウンドです。',
    keys:['カリスマ','行動力','表現力'],
    love:'【恋愛モードの仕様】\n好きになったら一直線、全力投球の情熱型です。「好き」という感情に正直すぎるので、気持ちが顔にも行動にも全部出てしまいます（隠そうとしてもバレます・笑）。\n\n愛している人のためなら何でもできる強さがある一方、ちょっぴり独占欲も持ち合わせています。それもあなたの愛情表現のひとつです。\n\n💕 ときめきスイッチが入る言葉\n「あなたといると楽しい」「あなたのそういうところが好き」→ ストレートに言ってもらえると、それだけで全エネルギーが解放されます。\n\n⚠️ ちょっと注意してほしいこと\n熱が上がるのも冷めるのも少し早め。長く続く関係には「ときどき新鮮な体験」を意識的に作ることが大切です。マンネリは天敵です（あるある！）。\n\n🔑 あなたへの取扱いのコツ\n回りくどい愛情表現より、ストレートな言葉が一番届きます。「好きだよ」「かっこいい/かわいいと思ってる」これだけで十分です。',
    work:'【仕事モードの仕様】\n人前に出る・表現する・人を巻き込む仕事で圧倒的な輝きを発揮します。「好き」「楽しい」「意味がある」が揃った瞬間、誰も追いつけないスピードで動き出す無敵モードが発動します。\n\n逆に「嫌い」「意味を感じない」仕事ではエネルギーがほぼゼロ（正直すぎる！）。得意・不得意の差が大きい分、自分の「燃えるもの」を早めに見つけることが人生最大の戦略です。\n\n🚀 やる気スイッチ\n注目を浴びる・「すごい！」「さすが！」のリアクションをもらう → 別人のように全力稼働します。\n\n⏰ ゴールデンタイム\n朝一番より「助走をつけた後」。テンションが上がってきた頃合いで本当の実力が出る後半型です。\n\n💡 向いているお仕事\n講師・ブランディング・SNS発信・エンターテイメント・営業・イベントプロデュース。「あなたが前に出る」仕事が向いています。',
    relations:'【人間関係モードの仕様】\n初対面でも5分で仲良くなれる社交性が最大の武器です。その場の空気を読んで自然と盛り上げてしまう才能があります。\n\nただ、本当に心の奥まで開く相手は少数精鋭。「知り合いは多いけど親友は少ない」という感覚、心当たりあるのでは？ それはあなたが「本物の関係」を大切にしているからです。\n\n✅ 大切にしたい関係\n一緒に盛り上がれる仲間。お互いの情熱を認め合えるライバル。\n\n❌ 消耗しやすい相手\nネガティブなエネルギーを撒き散らす人。やる前から「無理」と言う人。あなたのエネルギーは大切なので、そういう場所から離れる勇気も必要です。\n\n💝 あなたへの取扱いのコツ\n「あなたといると元気になる」「あなたがいるだけで場が明るくなる」この一言が最高の褒め言葉です。ぜひ大切な人に伝えてあげてください。',
    stress:'【ストレスと回復の仕様】\n評価されない・注目されない・情熱を出せない環境でエネルギーが下がります。「頑張ってるのに見てもらえない」という状況が、内側からじわじわと自信を削っていきます。\n\n感情を抑え込む場面が続くと、出口を失って爆発するか、突然無気力になるかのどちらかになりやすい。感情を安全に出せる場所が必要不可欠です。\n\n🔋 充電に効くこと\n・好きな音楽を大音量でかける\n・カラオケで全力で歌う（最強）\n・誰かと声を出して笑う\n\n⚠️ こんなサインが出てきたら注意して\n・急に静かになる / 「どうせ私なんか」が増える\n・笑顔が消える\n→ これはSOSです。ひとりで抱え込まないでください。\n\n✨ 回復の処方箋\n「あなたのここが好き」と具体的に言ってもらうこと。それだけで驚くほど回復します。自分でも鏡に向かって言ってみてください。本当に効きます。',
    talent:'【才能と使命の仕様】\nあなたの最も輝く才能は「人に火をつけること」です。くすぶっている人・諦めかけている人・自分の可能性に気づいていない人に、あなたの言葉・存在・情熱で点火することができます。これは本当に希少な才能です。\n\n「それ面白いじゃん！」「すごいじゃん！」あなたのこの一言で人生が動き出した人が、あなたの周りに必ずいるはずです。\n\n🌟 あなたの隠れた天才\n凍りついた空気を一瞬で変える瞬発力。人の心に直接届く言葉を瞬時に選べる直感力。\n\n🎯 あなたの人生テーマ\n情熱と表現。あなたの存在そのものが、誰かへのメッセージになっています。\n\n💫 一番輝く瞬間\n諦めかけていた誰かの目に、あなたのおかげで再び光がともった瞬間。その瞬間のあなたは、本当に太陽みたいです。',
  },
  土:{
    title:'大地の包容型サポーター',
    spec:'【製品概要】\nこのモデルの基本動作は「どっしり、安定して、支え続ける」。争いを好まず、どんな人も受け入れる懐の深さが最大の魅力です。「あの人がいると安心する」と言われるタイプで、信頼されることで本当の力が出てきます。\n\n【基本スペック】\n・安定性：業界最高水準（ちょっとのことじゃ揺れない）\n・包容センサー：全方位（どんなタイプの人も受け入れられる）\n・持続力：非常に高い（コツコツが一番得意）\n・稼働モード：表は控えめ縁の下の力持ち／内部：実は場の中心として機能中\n\n【推奨稼働環境】\n信頼されることが最高のモチベーションです。「あの人がいると安心する」と思ってもらえる環境で本領が発揮されます。あなたの存在価値は、数字では測れないところにあります。',
    keys:['包容力','持続力','調和'],
    love:'【恋愛モードの仕様】\nあなたが恋愛で一番大切にするのは「安心できる居場所があるかどうか」です。派手なデートやサプライズより、毎日のご飯・話を聞いてもらえること・そっと隣にいてくれること、そういう小さな積み重ねに幸せを感じます。\n\n愛情表現は言葉より行動派。ご飯を作る、体調を気にかける、そっと隣にいる。これがあなたの「好き」の伝え方です。すごく素敵な愛し方だと思います。\n\n💕 ときめきスイッチが入る言葉\n「あなたといると落ち着く」「あなたがいるだけでいい」→ 存在を丸ごと肯定してもらえると、深いところで安心感が生まれます。\n\n⚠️ ちょっと注意してほしいこと\n我慢を溜め込みすぎて突然限界を迎える「地震型」になりやすいです。日頃から気持ちを少しずつ言葉にする練習が、関係を長続きさせる秘訣です。言わなくてもわかってほしい、はちょっと難しいかも（あるある！）。\n\n🔑 あなたへの取扱いのコツ\n行動で示される愛が一番響きます。料理・気遣い・そっとそばにいること。あなたが誰かにしてあげていることが、あなたが一番嬉しいことでもあります。',
    work:'【仕事モードの仕様】\nコーディネート・調整・教育・サポート系のお仕事で真価を発揮します。縁の下の力持ちとして組織全体をうまく回す力があり、あなたがいるだけでチームの雰囲気がぐんと良くなります。\n\n目立たないけれど、実はいなくなると困る人。それがあなたです。コツコツの積み上げが得意なので、長く関われば関わるほどあなたの真の価値がわかってもらえます。\n\n🚀 やる気スイッチ\n「あなたがいてくれてよかった」「あなたがいなかったら困ってた」→ この感謝の言葉で出力が最大になります。ちゃんと伝えてもらえると嬉しい。\n\n⏰ ゴールデンタイム\n落ち着いた環境で、信頼できる仲間と、慣れたお仕事をしている時。\n\n💡 向いているお仕事\nコーチング・カウンセリング・教育・コミュニティ運営・調整役・事務局。人を「支える」「整える」「つなぐ」仕事が天職です。',
    relations:'【人間関係モードの仕様】\nどんなタイプの人にも居場所を作れる、天性のコミュニティビルダーです。誰かが孤立しているのを感じたら自然と声をかけてしまう、そんなやさしさが自然に出てくる人です。\n\n頼まれると断れない、という弱点もあるかもしれないけれど、それだけ多くの人から必要とされている証拠でもあります。「NO」と言える練習も、自分を守るために大切です。\n\n✅ 大切にしたい関係\n感謝を示してくれる人・安心して本音を話せる関係・長期的に続く深い縁。\n\n❌ 消耗しやすい相手\n感情で振り回してくる人。一方的に受け取るだけで感謝がない人。あなたは誰でも受け入れられるけど、全員を受け入れる必要はないです。\n\n💝 あなたへの取扱いのコツ\n「ありがとう＋具体的に何が助かったか」のセットで伝えてもらえると、この上なく嬉しい気持ちになります。周りの人に教えてあげてください。',
    stress:'【ストレスと回復の仕様】\n人間関係の摩擦・信頼していた人からの裏切り・頑張ってきたのに認められない、という状況でエネルギーが枯渇します。自分の気持ちを後回しにし続けることも、じわじわと内側から疲れさせる原因になります。\n\nストレスが身体に出やすいのも特徴です。疲れやすい・胃腸の不調・肩こり、そういう身体からのサインをちゃんと受け取ってあげてください。\n\n🔋 充電に効くこと\n・ゆっくり料理をする（手を動かすと心が落ち着く）\n・家を丁寧に整える（環境が整うと気持ちも整う）\n・大切な人と静かな時間を過ごす\n\n⚠️ こんなサインが出てきたら注意して\n・「もういい、どうでもいい」という無関心モードに入る\n・笑顔が作り笑顔になってきた\n→ 身体と心が「そろそろ限界です」と言っています。\n\n✨ 回復の処方箋\n何も生産しない「ただ休むだけのDAY」を意図的に作ること。罪悪感を持たないで。休むことはサボりじゃなくて、あなたを守るための大切なメンテナンスです。',
    talent:'【才能と使命の仕様】\nあなたの最も輝く才能は「安心できる場所を作ること」です。人が鎧を脱いで本来の自分でいられる環境・関係・空間を生み出す力があります。これは努力でどうにかなるものじゃなく、あなたが生まれ持った天性の才能です。\n\nあなたがいるだけで「ここは安全だ」と感じる人がいます。その人はあなたに本音を話し始めます。この力を意識的に使うことで、多くの人の人生に欠かせない存在になれます。\n\n🌟 あなたの隠れた天才\n人の本音を自然に引き出す力。その人が自分のことを好きになれるように、そっと導くやさしさ。\n\n🎯 あなたの人生テーマ\n安心と調和。あなたがいるだけで、争いが減って笑顔が増えていく。\n\n💫 一番輝く瞬間\n「あなたのおかげで救われた」「あなたに話して本当によかった」と言われた時。その言葉、全部本当のことです。',
  },
  金:{
    title:'精鋭の品格型プロフェッショナル',
    spec:'【製品概要】\nこのモデルの基本動作は「本物を追求する」。妥協を嫌い、常に高い基準を自分に課す、本物志向のプロフェッショナルです。正直で筋を通す姿が、時間をかけて周りの深い信頼を集めていきます。\n\n【基本スペック】\n・品質基準：業界最高水準（自分にも他人にも妥協しない）\n・誠実センサー：鋭敏（嘘や不誠実にすぐ気づく）\n・情報処理：表面より本質を自動追求するタイプ\n・接続モード：少数精鋭との深い関係を優先\n\n【推奨稼働環境】\n高い基準が求められる環境ほど力が発揮されます。「本物かどうか」が問われるフィールドで真価が出ます。あなたの基準の高さは武器であり誇りです。',
    keys:['品格','分析力','誠実'],
    love:'【恋愛モードの仕様】\n相手を選ぶ目がとても厳しいので、「この人だ」と決めるまでに時間がかかります。でも一度「この人！」と決めたら、誠実で一途、まったく揺れることのない安定した愛情を注ぎます。\n\n感情を言葉にするのが少し苦手で、愛情は行動・気遣い・誠実さで表現するタイプ。「なんで言ってくれないの」と誤解されることがありますが、それは愛していないんじゃなくて「言葉に責任を感じている」からです。その誠実さ、とても素敵です。\n\n💕 ときめきスイッチが入る言葉\n「あなたの言葉は信頼できる」「あなたがいると安心できる」→ 信頼の言葉が深いところに届きます。\n\n⚠️ ちょっと注意してほしいこと\n「察して」が通じにくい設計なので、言葉にしないと伝わらないことがあります。「伝えること」を少しずつ練習してみてください。\n\n🔑 あなたへの取扱いのコツ\n誠実さと一貫性を行動で示し続けること。小さな約束を守り続けることが、あなたの心を開く一番の近道です。',
    work:'【仕事モードの仕様】\n職人・コンサルタント・専門家など「本物のクオリティ」が問われる仕事で圧倒的な強さを発揮します。「これでいいか」じゃなく「これが最高か」を問い続ける姿勢が、誰も追いつけない専門性を作り上げていきます。\n\n即効性よりじっくりと信頼を積み上げるタイプなので、キャリアの後半になるほど評価が上がります。一度築いたプロとしての評判は、長く大きな資産になります。\n\n🚀 やる気スイッチ\n高い基準を求められる挑戦的な課題。「あなたならできる」より「これができる人があなたしかいない」の方が刺さります。\n\n⏰ ゴールデンタイム\n静かな環境で一人で黙々と集中できる時間帯。ノイズと曖昧な指示が最も苦手です。\n\n💡 向いているお仕事\n専門コンサル・デザイン・高品質コンテンツ制作・プロデュース・鑑定・審査。「本物を見極める」仕事が天職です。',
    relations:'【人間関係モードの仕様】\n友達は少なくても深く長い関係を大切にします。約束を守らない・嘘をつく・表と裏がある、そういう行動に対してのセンサーが非常に鋭敏で、一度「この人は違う」と感じると静かに距離を置いていきます。\n\n完璧主義な一面が人間関係にも出やすく、相手にも高い基準を求めてしまうことがあります。「みんな自分と同じ基準ではない」と意識することが、関係を広げるカギになります。\n\n✅ 大切にしたい関係\n誠実さを大切にする少数精鋭。プロとしてリスペクトし合える関係。\n\n❌ 消耗しやすい相手\n約束を軽く扱う人・嘘をつく人・表面だけ取り繕う人。あなたの直感は正しいです。\n\n💝 あなたへの取扱いのコツ\n小さな約束を守り続けること。これが一番速く、一番確実な信頼構築の方法です。ショートカットはありません（笑）。',
    stress:'【ストレスと回復の仕様】\n不誠実な環境・低品質なものへの妥協を求められる状況・「まあいいじゃない」と流される場面でエネルギーが消耗します。完璧主義が自分に向くと「もっとできたはずなのに」という自己批判ループにはまりやすい。\n\nこれ、あなたの頑張り屋さんな証拠でもあるんですが、たまには「今日の自分、よくやった」と言ってあげてください。\n\n🔋 充電に効くこと\n・完全に一人の静かな時間\n・部屋の整理整頓（環境が整うと心も落ち着く）\n・本物の質に触れる（おいしいもの・芸術・自然）\n\n⚠️ こんなサインが出てきたら注意して\n・周囲への批判が増える / 完璧主義が暴走して手が止まる\n・「どうせわかってもらえない」と感じる\n→ 充電が必要なサインです。自分を責めないで。\n\n✨ 回復の処方箋\n「70点でもOK」「今日のわたし、よくやった」を毎日声に出して言ってみてください。最初は恥ずかしくても、続けると本当に心が変わります。',
    talent:'【才能と使命の仕様】\nあなたの最も輝く才能は「本物の価値を守り、見極め、伝えること」です。偽物が溢れる世界で、本質・品格・真実を見抜き、示し続ける灯台のような存在です。\n\nあなたが「これは本物だ」と言うだけで、人々はそれを信じます。その信頼は一日二日で作れるものじゃなく、長年の誠実な行動の積み重ねで生まれたもの。それがあなたの最大の財産です。\n\n🌟 あなたの隠れた天才\n価値の本質と偽物を瞬時に見極める審美眼。高い基準が生み出す、誰にも真似できない品質。\n\n🎯 あなたの人生テーマ\n品格と誠実。あなたの存在が「本物の基準」になっていく。\n\n💫 一番輝く瞬間\n「あなたが言うなら間違いない」「あなたの評価を信頼している」と言われた時。その信頼は、あなたの誠実さが積み上げた最高の勲章です。',
  },
  水:{
    title:'叡智の流動型インテリジェンス',
    spec:'【製品概要】\nこのモデルの基本動作は「見えないものを見通す」。水のように形を変えてどんな状況にも適応しながら、深い洞察力と磨かれた直感で、人が気づいていないことを自然と察知します。\n\n【基本スペック】\n・洞察処理：深度最大（表面じゃなく本質を自動追求）\n・言語化能力：高精度（複雑な気持ちを一言で言い当てられる）\n・適応性：非常に高い（どんな状況でも自然に溶け込める）\n・外見モード：穏やかで謙虚／内部：静かな確信で常に処理中\n\n【推奨稼働環境】\n「なぜ？」と問い続けられる環境・本質を追求できる場所・一人でじっくり考えられる時間がある場所で最高のパフォーマンスが出ます。あなたの直感は、静かな時間の中でより磨かれていきます。',
    keys:['直感力','知性','適応力'],
    love:'【恋愛モードの仕様】\n相手のことを深く深く理解しようとします。相手が気づいていない感情や本音を先に察知してしまうほど、共感センサーが高精度に動いています。\n\n一方、自分自身の感情を言葉にするのが少し苦手。「伝えなくてもわかってほしい」という思いが、ときに誤解を生んでしまうことがあります（これ、すごくわかる！）。\n\n💕 ときめきスイッチが入る言葉\n「あなたのことをもっと知りたい」「あなたの考え方、面白い」→ 知的好奇心を向けてもらえると、心の深いところが開いていきます。\n\n⚠️ ちょっと注意してほしいこと\n相手の気持ちを先読みして、一人で傷ついて一人で距離を置いてしまうことがあります。思い込みで完結する前に、「あなたはどう思ってる？」と聞いてみてください。\n\n🔑 あなたへの取扱いのコツ\n知的な会話と「わかってもらえた」という体験が、心を開く一番のカギです。',
    work:'【仕事モードの仕様】\n情報・分析・戦略・クリエイティブなど「知識と洞察を使う仕事」で圧倒的な真価を発揮します。表面的な答えじゃなく「なぜそうなのか」という本質を追求する力が、他にはない深みのある成果物を生み出します。\n\n一人でじっくり集中できる時間に最もパワーが出るタイプ。チームの中では全体を俯瞰してみるストラテジスト的な役割が一番フィットします。\n\n🚀 やる気スイッチ\n「なぜ？」という問いに答えられる仕事・誰も解いていない問題に挑戦できる機会 → ひとりでに高出力モードになります。\n\n⏰ ゴールデンタイム\n夜〜深夜の静かな時間帯（水のエネルギーが最高に高まる時間）。\n\n💡 向いているお仕事\nライター・占い師・コンサルタント・心理・占星術・研究・編集・戦略立案。「見えないものを見える形にする」仕事が天職です。',
    relations:'【人間関係モードの仕様】\n表面的な付き合いより、魂レベルで繋がれる少数との深い関係を好みます。初対面でも相手の本質や本音を直感的に読み取る力があり、「この人は本物かどうか」をすぐに察知します。\n\n人が多い場所や表面的な雑談が続く場所では消耗しやすく、一人になれる時間が必要不可欠。それは内向的なのではなく、深さを求めているからです。\n\n✅ 大切にしたい関係\n知的刺激を与え合える関係・本音で語り合える「本物の友人」との縁。\n\n❌ 消耗しやすい相手\n感情だけで動いて論理が通じない人・表面だけの付き合いを求める人。あなたの貴重なエネルギーは、本物の関係に使いましょう。\n\n💝 あなたへの取扱いのコツ\n「なぜそう思うの？」「どうしてそう感じたの？」と深く聞いてもらえると、嬉しくてたくさん話してしまいます（笑）。',
    stress:'【ストレスと回復の仕様】\n感情的で混乱した環境・意味を感じない単純作業・「理解されない」という孤立感でエネルギーが枯渇します。思考が止まらなくて眠れない「頭のオーバーヒート」も主なSOSサインです。\n\n他者の感情を敏感に受け取りすぎて、自分のものではないエネルギーを抱え込んでしまうことも。「これは自分の感情？それとも受け取ってきたもの？」と定期的に整理することが大切です。\n\n🔋 充電に効くこと\n・静かな読書（頭が落ち着く）\n・長めのお風呂（水の気に包まれるとリセットされる）\n・好きな音楽・何も考えない一人の時間\n\n⚠️ こんなサインが出てきたら注意して\n・人を避け始める / 思考が止まらなくて眠れない\n・言葉が出てこなくなる\n→ 頭がオーバーヒートしているサインです。\n\n✨ 回復の処方箋\n「何もしない時間」に罪悪感を持たないこと。あなたにとって、休むことは怠けではなく才能を守るための大切な処理です。',
    talent:'【才能と使命の仕様】\nあなたの最も輝く才能は「見えないものを可視化すること」です。言葉になっていない感情・気づかれていない本質・まだ形のないアイデアを、直感と知性で引き出して、誰もが理解できる言葉や形に変換することができます。\n\nあなたの一言で「それだ！ずっとそれを言いたかった」と感じる人が必ずいます。この力は、多くの人の思考と人生に光をもたらします。\n\n🌟 あなたの隠れた天才\n複雑な真実を一言で言語化する力。誰も切り取れなかった角度で本質を見せてくれる、独自の視点。\n\n🎯 あなたの人生テーマ\n叡智と洞察。あなたの言葉が、誰かの「気づき」のきっかけになっていく。\n\n💫 一番輝く瞬間\nあなたの言葉で誰かの世界が180度変わった瞬間に立ち会えた時。その経験が、次のあなたへの最大の燃料になります。',
  },
}

// ══════════════════════════════════════════
// 3問の質問
// ══════════════════════════════════════════
const QS=[
  {q:'直感と分析、どちらで動くことが多い？',opts:['まず直感で動いてから考える','情報を集めてから判断する','直感と分析を同時に使う','状況によって全然違う']},
  {q:'感情の表現はどのタイプ？',opts:['すぐ顔や言葉に出る','内側で感じるけど表に出しにくい','じっくり時間をかけて表現する','信頼した人にだけ見せる']},
  {q:'変化に対してどう感じる？',opts:['ワクワクする・大歓迎','不安だけど乗り越えられる','慎重に準備してから動く','できれば安定を保ちたい']},
]

const CATS=[
  {id:'love',label:'❤️ 恋愛'},
  {id:'work',label:'💼 仕事'},
  {id:'relations',label:'👥 人間関係'},
  {id:'stress',label:'🌊 ストレス対処'},
  {id:'talent',label:'🎯 才能と使命'},
  {id:'fortune',label:'📅 今月の運勢'},
]

// ══════════════════════════════════════════
// スタイル
// ══════════════════════════════════════════
const S={
  wrap:{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:"'Hiragino Mincho ProN','Yu Mincho','serif'"},
  card:{background:'#faf8f2',borderRadius:'4px',maxWidth:'540px',width:'100%',boxShadow:'0 0 0 1px #333,0 20px 60px rgba(0,0,0,0.5)',overflow:'hidden'},
  // カバー
  coverTop:{background:'#1a1a2e',color:'#faf8f2',padding:'28px 32px 20px'},
  coverBrand:{fontSize:'10px',letterSpacing:'4px',color:'#c9a84c',marginBottom:'16px'},
  coverTitle:{fontSize:'26px',fontWeight:'bold',letterSpacing:'2px',lineHeight:1.3,marginBottom:'6px'},
  coverSub:{fontSize:'12px',color:'#aaa',letterSpacing:'1px'},
  coverMid:{background:'#c9a84c',padding:'10px 32px',display:'flex',justifyContent:'space-between',alignItems:'center'},
  coverMidText:{fontSize:'11px',color:'#1a1a2e',fontWeight:'bold',letterSpacing:'1px'},
  coverBody:{padding:'28px 32px'},
  // フォーム
  label:{display:'block',fontSize:'11px',letterSpacing:'2px',color:'#555',marginBottom:'6px',fontFamily:'sans-serif'},
  input:{width:'100%',padding:'12px 14px',border:'1px solid #ccc',borderRadius:'2px',fontSize:'15px',background:'#fff',boxSizing:'border-box',marginBottom:'16px',fontFamily:'sans-serif',outline:'none'},
  btn:{width:'100%',padding:'14px',background:'#1a1a2e',color:'#c9a84c',border:'none',borderRadius:'2px',fontSize:'14px',fontWeight:'bold',cursor:'pointer',letterSpacing:'2px',fontFamily:'sans-serif'},
  // 質問
  qStep:{fontSize:'11px',color:'#888',textAlign:'center',marginBottom:'8px',fontFamily:'sans-serif',letterSpacing:'1px'},
  qBar:{height:'3px',background:'#e0d9f5',borderRadius:'2px',marginBottom:'24px'},
  qFill:{height:'3px',background:'#c9a84c',borderRadius:'2px',transition:'width 0.3s'},
  qText:{fontSize:'17px',color:'#1a1a2e',textAlign:'center',marginBottom:'24px',lineHeight:1.5,fontWeight:'bold'},
  optBtn:{display:'block',width:'100%',padding:'13px 16px',marginBottom:'10px',background:'#fff',border:'1px solid #ccc',borderRadius:'2px',fontSize:'14px',cursor:'pointer',textAlign:'left',fontFamily:'sans-serif',transition:'all 0.15s'},
  // カテゴリ選択
  catGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'},
  catBtn:{padding:'14px 10px',border:'2px solid #ddd',borderRadius:'2px',fontSize:'13px',cursor:'pointer',textAlign:'center',background:'#fff',fontFamily:'sans-serif',transition:'all 0.15s'},
  catBtnSel:{border:'2px solid #1a1a2e',background:'#1a1a2e',color:'#c9a84c'},
  // 結果
  resHeader:{background:'#1a1a2e',color:'#faf8f2',padding:'24px 28px'},
  resModel:{fontSize:'10px',letterSpacing:'3px',color:'#c9a84c',marginBottom:'6px'},
  resName:{fontSize:'22px',fontWeight:'bold',letterSpacing:'1px',marginBottom:'4px'},
  resType:{fontSize:'13px',color:'#aaa'},
  resBody:{padding:'20px 28px'},
  specBox:{border:'1px solid #1a1a2e',borderRadius:'2px',marginBottom:'20px',overflow:'hidden'},
  specHead:{background:'#1a1a2e',color:'#c9a84c',padding:'8px 14px',fontSize:'11px',letterSpacing:'2px',fontFamily:'sans-serif',display:'flex',justifyContent:'space-between',alignItems:'center'},
  specBody:{padding:'14px',background:'#fff'},
  specText:{fontSize:'13px',color:'#333',lineHeight:1.7,whiteSpace:'pre-line',fontFamily:'sans-serif'},
  tagRow:{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px'},
  tag:{background:'#f0ede5',border:'1px solid #c9a84c',color:'#1a1a2e',fontSize:'11px',padding:'3px 10px',borderRadius:'20px',fontFamily:'sans-serif'},
  statRow:{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'12px'},
  stat:{fontSize:'12px',color:'#555',fontFamily:'sans-serif'},
  statVal:{fontWeight:'bold',color:'#1a1a2e'},
  divider:{height:'1px',background:'#e0d9f5',margin:'16px 0'},
  sectionTitle:{fontSize:'11px',letterSpacing:'2px',color:'#c9a84c',marginBottom:'10px',fontFamily:'sans-serif',fontWeight:'bold'},
  catSec:{border:'1px solid #ddd',borderRadius:'2px',marginBottom:'14px',overflow:'hidden'},
  catHead:{background:'#f0ede5',padding:'8px 14px',fontSize:'12px',fontWeight:'bold',color:'#1a1a2e',fontFamily:'sans-serif',letterSpacing:'1px'},
  catBody:{padding:'14px',background:'#fff'},
  footer:{background:'#1a1a2e',padding:'14px 28px',display:'flex',justifyContent:'space-between',alignItems:'center'},
  footerText:{fontSize:'10px',color:'#666',letterSpacing:'1px',fontFamily:'sans-serif'},
  barcode:{display:'flex',gap:'2px',alignItems:'flex-end',height:'28px'},
  resetBtn:{background:'transparent',border:'1px solid #c9a84c',color:'#c9a84c',padding:'8px 16px',borderRadius:'2px',fontSize:'11px',cursor:'pointer',letterSpacing:'1px',fontFamily:'sans-serif'},
}

// バーコード（装飾）
function Barcode(){
  const bars=[3,1,2,1,3,1,1,2,1,3,2,1,2,1,3,1,2,1,1,3,1,2,1,3,1,1,2,3,1,2]
  return(
    <div style={S.barcode}>
      {bars.map((w,i)=>(
        <div key={i} style={{width:`${w*2}px`,height:`${60+Math.sin(i)*10}%`,background:'#c9a84c',opacity:0.8}}/>
      ))}
    </div>
  )
}

export default function App(){
  const [step,setStep]=useState('payment')
  const [form,setForm]=useState({name:'',email:'',birthday:''})
  const [answers,setAnswers]=useState([])
  const [qIdx,setQIdx]=useState(0)
  const [selected,setSelected]=useState([])

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    if(params.get('paid')==='true'){
      setStep('form')
      window.history.replaceState({},'','/')
    }
  },[])

  const bd=form.birthday?{
    y:+form.birthday.split('-')[0],
    m:+form.birthday.split('-')[1],
    d:+form.birthday.split('-')[2],
  }:null

  const yp = bd ? yearPillar(bd.y) : null
  const dp = bd ? dayPillar(bd.y, bd.m, bd.d) : null
  const sign = bd ? sunSign(bd.m, bd.d) : null
  const cont = dp ? CONT[dp.elem] : null
  const fortune = dp ? getMonthFortune(dp.elem, new Date().getMonth()+1) : null
  const modelNo = bd ? `MODEL-${String(bd.y).slice(2)}${yp.animal.slice(0,2).toUpperCase()}-${dp.elem}${dp.yin}` : ''

  function handleAnswer(val){
    const next=[...answers,val]
    if(qIdx+1>=QS.length){setAnswers(next);setStep('categories')}
    else{setAnswers(next);setQIdx(qIdx+1)}
  }
  function toggleCat(id){
    if(selected.includes(id)) setSelected(selected.filter(x=>x!==id))
    else if(selected.length<3) setSelected([...selected,id])
  }
  function reset(){setStep('payment');setForm({name:'',email:'',birthday:''});setAnswers([]);setQIdx(0);setSelected([])}

  function getCatContent(id){
    if(!cont||!fortune) return ''
    if(id==='love') return cont.love
    if(id==='work') return cont.work
    if(id==='relations') return cont.relations
    if(id==='stress') return cont.stress
    if(id==='talent') return cont.talent
    if(id==='fortune') return `今月の運勢：${fortune.title}　${fortune.stars}\n\n${fortune.msg}`
    return ''
  }
  function getCatLabel(id){
    return CATS.find(c=>c.id===id)?.label||''
  }

  return(
    <div style={S.wrap}>
      <div style={S.card}>

        {/* ════ 支払いゲート ════ */}
        {step==='payment'&&(
          <>
            {/* 表紙画像 */}
            <div style={{width:'100%',lineHeight:0}}>
              <img src="/cover.png" alt="ジブン取扱説明書" style={{width:'100%',display:'block'}}/>
            </div>
            <div style={S.coverMid}>
              <span style={S.coverMidText}>あなたの「正しい使い方」がわかります</span>
              <Barcode/>
            </div>
            <div style={S.coverBody}>
              <div style={{border:'1px solid #ddd',borderRadius:'2px',padding:'20px',marginBottom:'20px',background:'#fff'}}>
                <div style={{fontSize:'11px',letterSpacing:'2px',color:'#c9a84c',fontWeight:'bold',marginBottom:'12px',fontFamily:'sans-serif'}}>📋 コンテンツ内容</div>
                <div style={{fontSize:'13px',color:'#444',fontFamily:'sans-serif'}}>
                  <div style={{marginBottom:'12px',lineHeight:'1.8'}}>
                    ✅ 基本スペック（四柱推命の日主より算出）<br/>
                    ✅ 西洋占星術による補足分析<br/>
                    ✅ あなた専用のモデルナンバー発行
                  </div>
                  <div style={{borderTop:'1px solid #e0d9c8',paddingTop:'12px'}}>
                    <div style={{fontSize:'11px',letterSpacing:'1px',color:'#c9a84c',fontWeight:'bold',marginBottom:'10px',fontFamily:'sans-serif'}}>
                      ＋ 以下6項目から好きな3つを選んで診断
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                      {[
                        ['❤️','恋愛'],
                        ['💼','仕事'],
                        ['👥','人間関係'],
                        ['🌊','ストレス対処'],
                        ['🎯','才能と使命'],
                        ['📅','今月の運勢'],
                      ].map(([icon,label])=>(
                        <div key={label} style={{
                          background:'#f5f2ea',
                          border:'1px solid #ddd8c8',
                          borderRadius:'4px',
                          padding:'8px 10px',
                          fontSize:'13px',
                          color:'#333',
                          display:'flex',
                          alignItems:'center',
                          gap:'6px',
                        }}>
                          <span>{icon}</span>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{textAlign:'center',marginBottom:'16px'}}>
                <div style={{fontSize:'28px',fontWeight:'bold',color:'#1a1a2e',marginBottom:'4px'}}>¥1,000</div>
                <div style={{fontSize:'12px',color:'#888',fontFamily:'sans-serif'}}>（税込・1回限り）</div>
              </div>
              <a
                href={STRIPE_LINK}
                style={{
                  display:'block',
                  width:'100%',
                  padding:'16px',
                  background:'#1a1a2e',
                  color:'#c9a84c',
                  border:'none',
                  borderRadius:'2px',
                  fontSize:'15px',
                  fontWeight:'bold',
                  cursor:'pointer',
                  letterSpacing:'2px',
                  fontFamily:'sans-serif',
                  textAlign:'center',
                  textDecoration:'none',
                  boxSizing:'border-box',
                }}
              >
                診断を購入する（¥1,000）→
              </a>
              <div style={{fontSize:'11px',color:'#aaa',textAlign:'center',marginTop:'12px',fontFamily:'sans-serif'}}>
                クレジットカード / Apple Pay / Google Pay 対応<br/>
                Stripe社の安全な決済システムを使用しています
              </div>
            </div>
          </>
        )}

        {/* ── カバー（共通ヘッダー） ── */}
        <div style={S.coverTop}>
          <div style={S.coverBrand}>PERSONAL INSTRUCTION MANUAL</div>
          <div style={S.coverTitle}>自分の取扱説明書</div>
          <div style={S.coverSub}>四柱推命 × 西洋占星術 × 性格診断</div>
        </div>
        <div style={S.coverMid}>
          <span style={S.coverMidText}>必ずお読みください</span>
          <span style={{...S.coverMidText,fontSize:'10px'}}>ver.2026</span>
        </div>

        {/* ══ STEP 1：入力フォーム ══ */}
        {step==='form'&&(
          <div style={S.coverBody}>
            <div style={{...S.sectionTitle,marginBottom:'20px'}}>製品登録</div>
            <label style={S.label}>お名前（ニックネームOK）</label>
            <input style={S.input} placeholder="例：さくら" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <label style={S.label}>メールアドレス</label>
            <input style={S.input} type="email" placeholder="例：sakura@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <label style={S.label}>生年月日</label>
            <input style={S.input} type="date" value={form.birthday} onChange={e=>setForm({...form,birthday:e.target.value})}/>
            <button style={S.btn} onClick={()=>{if(form.name&&form.birthday) setStep('questions')}}>
              診断スタート ▶
            </button>
            <p style={{fontSize:'10px',color:'#aaa',textAlign:'center',marginTop:'12px',fontFamily:'sans-serif'}}>
              ご入力いただいた情報は診断のみに使用します
            </p>
          </div>
        )}

        {/* ══ STEP 2：3問の質問 ══ */}
        {step==='questions'&&(
          <div style={S.coverBody}>
            <div style={S.qStep}>QUESTION {qIdx+1} / {QS.length}</div>
            <div style={S.qBar}>
              <div style={{...S.qFill,width:`${((qIdx+1)/QS.length)*100}%`}}/>
            </div>
            <div style={S.qText}>{QS[qIdx].q}</div>
            {QS[qIdx].opts.map((o,i)=>(
              <button key={i} style={S.optBtn}
                onMouseEnter={e=>{e.currentTarget.style.background='#f0ede5';e.currentTarget.style.borderColor='#1a1a2e'}}
                onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor='#ccc'}}
                onClick={()=>handleAnswer(i)}>
                {o}
              </button>
            ))}
          </div>
        )}

        {/* ══ STEP 3：項目選択 ══ */}
        {step==='categories'&&(
          <div style={S.coverBody}>
            <div style={{...S.sectionTitle,marginBottom:'8px'}}>項目を選択</div>
            <p style={{fontSize:'12px',color:'#666',marginBottom:'20px',fontFamily:'sans-serif',lineHeight:1.6}}>
              気になる項目を <strong>3つ</strong> 選んでください
            </p>
            <div style={S.catGrid}>
              {CATS.map(c=>(
                <button key={c.id}
                  style={{...S.catBtn,...(selected.includes(c.id)?S.catBtnSel:{})}}
                  onClick={()=>toggleCat(c.id)}
                  onMouseEnter={e=>{if(!selected.includes(c.id)){e.currentTarget.style.borderColor='#1a1a2e'}}}
                  onMouseLeave={e=>{if(!selected.includes(c.id)){e.currentTarget.style.borderColor='#ddd'}}}>
                  {c.label}
                  {selected.includes(c.id)&&<span style={{display:'block',fontSize:'10px',marginTop:'4px'}}>✓ 選択中</span>}
                </button>
              ))}
            </div>
            <button style={{...S.btn,opacity:selected.length===3?1:0.4}}
              onClick={()=>{if(selected.length===3) setStep('result')}}>
              取扱説明書を生成する ▶
            </button>
            <p style={{fontSize:'11px',color:'#aaa',textAlign:'center',marginTop:'8px',fontFamily:'sans-serif'}}>
              {selected.length}/3 選択中
            </p>
          </div>
        )}

        {/* ══ STEP 4：結果（取扱説明書） ══ */}
        {step==='result'&&cont&&(
          <>
            {/* 製品ヘッダー */}
            <div style={S.resHeader}>
              <div style={S.resModel}>{modelNo}</div>
              <div style={S.resName}>{form.name} さん専用</div>
              <div style={S.resType}>{cont.title}</div>
            </div>

            <div style={S.resBody}>
              {/* 基本スペック */}
              <div style={S.specBox}>
                <div style={S.specHead}>
                  <span>§1　基本スペック</span>
                  <Barcode/>
                </div>
                <div style={S.specBody}>
                  <div style={S.tagRow}>
                    {cont.keys.map(k=><span key={k} style={S.tag}>{k}</span>)}
                  </div>
                  <div style={S.statRow}>
                    <span style={S.stat}>日主：<span style={S.statVal}>{dp.stem}（{dp.elem}・{dp.yin}）</span></span>
                    <span style={S.stat}>年支：<span style={S.statVal}>{yp.branch}（{yp.animal}）</span></span>
                    <span style={S.stat}>星座：<span style={S.statVal}>{sign.sym}{sign.name}</span></span>
                  </div>
                  <div style={S.divider}/>
                  <div style={{...S.specText,marginBottom:'10px'}}>{cont.spec}</div>
                  <div style={{...S.specText,fontSize:'12px',color:'#777'}}>
                    ◆ 西洋占星術：{sign.name}（{sign.elem}のサイン）— {sign.key}
                  </div>
                </div>
              </div>

              {/* 選択された3項目 */}
              <div style={S.sectionTitle}>§2　選択項目</div>
              {selected.map((id,idx)=>(
                <div key={id} style={S.catSec}>
                  <div style={S.catHead}>{getCatLabel(id)}</div>
                  <div style={S.catBody}>
                    <div style={S.specText}>{getCatContent(id)}</div>
                  </div>
                </div>
              ))}

              {/* 注意事項（フッター上） */}
              <div style={{...S.specBox,marginTop:'20px'}}>
                <div style={{...S.specHead,background:'#8b0000'}}>
                  <span>⚠️　使用上の注意</span>
                </div>
                <div style={{...S.specBody}}>
                  <div style={{...S.specText,fontSize:'12px'}}>
                    この取扱説明書は、あなたの可能性を最大化するためのガイドです。書かれている内容はあくまで傾向であり、あなた自身の選択と行動が最も大切です。定期的に読み返してください。
                  </div>
                </div>
              </div>
            </div>

            {/* フッター */}
            <div style={S.footer}>
              <div>
                <div style={S.footerText}>© 自分の取扱説明書 / 四柱推命×西洋占星術</div>
                <div style={{...S.footerText,marginTop:'2px'}}>発行日：{new Date().toLocaleDateString('ja-JP')}</div>
              </div>
              <button style={S.resetBtn} onClick={reset}>新しい取扱説明書を作る</button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
