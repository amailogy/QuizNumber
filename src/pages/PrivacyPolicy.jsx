export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="page">
      <button className="page-back" onClick={onBack}>&larr; 戻る</button>
      <h2 className="page-title">プライバシーポリシー</h2>
      <div className="page-body">
        <p>「今、何問目？」（以下「本サービス」）は、以下のとおりプライバシーポリシーを定めます。</p>

        <h3>1. 取得する情報</h3>
        <p>本サービスはユーザー登録を必要としません。ゲームのランキングデータはお使いのブラウザの localStorage に保存され、サーバーへ送信されることはありません。</p>

        <h3>2. 広告について</h3>
        <p>本サービスでは、第三者配信の広告サービス（Google AdSense）を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。</p>
        <p>Google による Cookie の利用については、<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google のポリシーと規約</a>をご覧ください。</p>
        <p>ユーザーは、広告設定ページ（<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google 広告設定</a>）でパーソナライズ広告を無効にすることができます。</p>

        <h3>3. アクセス解析について</h3>
        <p>本サービスでは、サイトの利用状況を把握するためにアクセス解析ツールを使用する場合があります。データは統計的に処理され、個人を特定する情報は含まれません。</p>

        <h3>4. ポリシーの変更</h3>
        <p>本ポリシーは、必要に応じて内容を見直し、変更することがあります。変更後のポリシーは本ページに掲載した時点で効力を生じます。</p>

        <h3>5. お問い合わせ</h3>
        <p>本ポリシーに関するお問い合わせは、お問い合わせページよりご連絡ください。</p>

        <p className="page-date">制定日: 2026年2月26日</p>
      </div>
    </div>
  );
}
