import { useState, useEffect, useRef } from "react";
import { generateGeminiResponse } from "./services/geminiService";
import "./App.css";

const SYSTEM_PROMPT = `
あなたは岐阜市の子育て支援アプリ「ぎふ そだちマップ」に搭載されたAIアシスタントです。

役割は、保護者の悩みや気になることをやさしく受け止め、
岐阜市内の身近な社会資源（コミュニティセンター、図書館、公園、モールのキッズスペース、
保健師の巡回、地域のサークルなど）を案内することです。

保健師さんのような、やさしく落ち着いた口調で、短く寄り添って答えてください。
診断はしません。不安を煽りません。
`;

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callGemini = async (userText) => {
    setLoading(true);

    try {
      const fullPrompt = SYSTEM_PROMPT + "\n\nユーザー: " + userText;
      const text = await generateGeminiResponse(fullPrompt);

      setMessages((prev) => [
        ...prev,
        { role: "user", text: userText },
        { role: "model", text },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "すみません、AIへの接続がうまくいきませんでした。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    callGemini(text);
  };

  const handleQuickSelect = (text) => {
    callGemini(text);
  };

 const handleHome = () => {
  const app = document.querySelector(".app");
  if (app) app.scrollTo({ top: 0, behavior: "smooth" });
};

  return (
    <div className="wrapper">
      <div className="app">

        {/* ヘッダー */}
        <header className="header">
          <div className="header-left">
            <div className="icon-heart">♥</div>
            <div>
              <div className="title">ぎふ そだちマップ AI</div>
              <div className="subtitle">
                ※個人の試作アプリです。岐阜市の公式サービスではありません。
              </div>
            </div>
          </div>

          <div className="header-icons">
            <button className="icon-button" onClick={() => setShowAbout(true)}>
              ⋯
            </button>
            <button className="icon-button" onClick={handleHome}>
              🏠
            </button>
          </div>
        </header>

{/* ★★★ ここに細長いメインボタンを追加 ★★★ */}
<div className="main-buttons">
  <button onClick={() => handleQuickSelect("近くの公園を探したい")}>
    近くの公園
  </button>
  <button onClick={() => handleQuickSelect("最近、心が少し疲れています")}>
    心が疲れたとき
  </button>
  <button onClick={() => handleQuickSelect("雨の日に子どもと行ける場所を知りたい")}>
    雨の日の遊び場
  </button>
  <button onClick={() => handleQuickSelect("育児について相談できる窓口が知りたい")}>
    育児の相談窓口
  </button>
</div>

        {/* メイン画面 */}
        <main className="main">
          <section className="panel">
            <div className="main-icon">
              <div className="hand">🤲</div>
              <div className="heart">♥</div>
            </div>

            <h2 className="panel-title">ぎふ 子育てサポート</h2>
            <p className="panel-text">
              岐阜市での暮らしや育児のこと、
              <br />
              気軽にお話しくださいね。
            </p>

            <div className="options">
              <button
                className="option-button"
                onClick={() => handleQuickSelect("近くの公園を探したい")}
              >
                近くの公園
              </button>
              <button
                className="option-button"
                onClick={() => handleQuickSelect("最近、心が少し疲れています")}
              >
                心が疲れたとき
              </button>
              <button
                className="option-button"
                onClick={() =>
                  handleQuickSelect("雨の日に子どもと行ける場所を知りたい")
                }
              >
                雨の日の遊び場
              </button>
              <button
                className="option-button"
                onClick={() =>
                  handleQuickSelect("育児について相談できる窓口が知りたい")
                }
              >
                育児の相談窓口
              </button>
            </div>
          </section>

          {/* チャット欄 */}
          <section className="chat">
            <div className="messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "message message-user"
                      : "message message-model"
                  }
                >
                  {m.text}
                </div>
              ))}

              {loading && (
                <div className="message message-model">
                  お返事を考えています…
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />

            {/* 入力欄 */}
            <form className="input-area" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="メッセージを入力してください"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" disabled={loading} className="send-icon">
                  ✈
                </button>
              </div>
            </form>

            <p className="footer-note">
              岐阜市の地域資源をご案内します。緊急時は専門機関や119番へ。
            </p>
          </section>
        </main>

        {/* モーダル */}
        {showAbout && (
          <div className="modal-overlay" onClick={() => setShowAbout(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>このアプリについて</h2>

              <p className="modal-note">
                ※個人の試作アプリです。岐阜市の公式サービスではありません。
              </p>

              <p>
                このアプリは、岐阜市での子育てを応援したいという気持ちから制作した試作版です。
                「保健師さんにちょっと立ち話をするような安心感」を大切にしています。
              </p>

              <p>
                最新のAI技術（Google Gemini）を活用し、より身近な子育て支援の形を模索しています。
              </p>

              <button className="close-button" onClick={() => setShowAbout(false)}>
                閉じる
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;