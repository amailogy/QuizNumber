export default function Contact({ onBack }) {
  return (
    <div className="page">
      <button className="page-back" onClick={onBack}>&larr; 戻る</button>
      <h2 className="page-title">お問い合わせ</h2>
      <div className="page-body">
        <p>「何問目クイズ」に関するお問い合わせは、以下のメールアドレスまでご連絡ください。</p>
        <p className="contact-email">
          <a href="mailto:amai6gy@gmail.com">amai6gy@gmail.com</a>
        </p>
        <p>不具合の報告、ご意見・ご要望などお気軽にお寄せください。</p>
      </div>
    </div>
  );
}
