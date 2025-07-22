import React, { useEffect } from 'react';

// ▼ ここにコピペするHTML（説明文・目次など）は必要に応じて省略可（全文可）
const staticHtml = `
<p style="font-size: 80%;">※本ページの数字選択式宝くじ（ミニロト、ロト6、ロト7）の高額当選売り場情報は、<br />公益財団法人日本宝くじ協会が運営する公式サイト「宝くじ チャンスセンター」（https://www.takarakujichance.jp/）の掲載データを基に自動で取得しています。<br />掲載内容は最新の情報を元にしておりますが、売り場の運営状況や当選状況により変更されることがございます。<br />購入の際は公式サイトや売り場にて最新の情報をご確認ください。</p>
`;

export default function WinningOutlet() {
  useEffect(() => {
    // --- ここにブログの<script>タグ内の内容をコピペ ---
    (async () => {
      const url = "https://po-3.github.io/winning_data_for_ranking.json";
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch JSON');
        const data = await res.json();

        // --- カラー設定 ---
        const labelColors = {
          "ミニロト": "#f39800",
          "ロト6": "#167bda",
          "ロト7": "#b00584"
        };

        // --- サイドバー（最新当選）用 ---
        const lotteries = [
          { key: "ミニロト", label: "ミニロト", detailKey: "ミニロト当選詳細", id: "section-miniloto-latest" },
          { key: "ロト6", label: "ロト6", detailKey: "ロト6当選詳細", id: "section-loto6-latest" },
          { key: "ロト7", label: "ロト7", detailKey: "ロト7当選詳細", id: "section-loto7-latest" }
        ];

        let sidebarHtml = "";
        lotteries.forEach(({ key, label, detailKey, id }) => {
          let entries = data
            .filter(entry => Array.isArray(entry[detailKey]) && entry[detailKey].length > 0)
            .map(entry => {
              const latestDetail = entry[detailKey][0];
              return {
                ...entry,
                latestKai: latestDetail?.回号 || "",
                latestAmount: latestDetail?.金額 || "",
                latestGrade: latestDetail?.等級 || ""
              };
            })
            .filter(entry => entry.latestKai && entry.latestAmount);

          entries.sort((a, b) => {
            const getNum = str => Number((str||"").replace(/[^\d]/g, ""));
            return getNum(b.latestKai) - getNum(a.latestKai);
          });

          const showCount = 7;
          sidebarHtml += `<h2 id="${id}" style="font-size:1.9em; font-weight:bold; margin:32px 0 14px 0; border-bottom: 3.5px solid ${labelColors[key]}; letter-spacing:0.01em;">${label} 最新高額当選情報</h2>`;
          entries.slice(0, showCount).forEach(entry => {
            sidebarHtml += `
<div style="margin-bottom:22px; background:#fffdfa; border-radius:18px; border:2.5px solid ${labelColors[key]}; box-shadow:0 4px 18px -2px ${labelColors[key]}22,0 1.5px 8px rgba(40,60,80,0.07); padding:22px 17px 13px 17px; position:relative;">
  <div style="position:absolute; top:-14px; left:15px; background:${labelColors[key]}; color:#fff; padding:3px 14px 3px 14px; border-radius:13px 13px 16px 16px; font-size:1em; font-weight:bold; box-shadow:0 2px 6px ${labelColors[key]}22;">
    ${entry["都道府県名"] || ""}
  </div>
  <div style="margin-top:11px;">
    <span style="font-size:1.08em; font-weight:bold; color:${labelColors[key]};">
      ${entry["詳細URL"] ?
        `<a href="${entry["詳細URL"]}" target="_blank" rel="noopener noreferrer" style="font-weight:bold;color:${labelColors[key]};text-decoration:underline;">${entry["売場名"]}</a>`
        : `${entry["売場名"] || ""}`}
    </span>
  </div>
  <div style="display:flex;gap:13px 26px; margin-top:10px; font-size:1.01em;">
    <div>
      <span style="display:inline-block; min-width:46px; color:#999; font-weight:bold;">開催回</span>
      <span style="color:#222; font-weight:bold;">
        ${entry.latestKai || "-"}<br>
        <span style="font-size:93%; color:#af8500; font-weight:normal; margin-left:-12px;">${entry.latestGrade ? `（${entry.latestGrade}）` : ""}</span>
      </span>
    </div>
    <div style="margin-left:auto;">
      <span style="color:${labelColors[key]}; background:linear-gradient(90deg,${labelColors[key]}11 60%,#fff3 100%); padding:2.5px 1px; border-radius:11px; font-weight:900; font-size:1.08em; letter-spacing:0.03em; box-shadow:0 1px 4px ${labelColors[key]}22;">
        ${entry.latestAmount ? Number(entry.latestAmount).toLocaleString() + "円" : ""}
      </span>
    </div>
  </div>
</div>
`;
          });
        });
        document.getElementById('lottery-sidebar').innerHTML = sidebarHtml;

        // --- ランキング用（当選詳細配列を正規集計） ---
        function sumAmount(details) {
          return Array.isArray(details) ? details.reduce((a, d) => a + (Number(d.金額)||0), 0) : 0;
        }
        function sumCount(details) {
          return Array.isArray(details) ? details.length : 0;
        }
        const normalizedData = data.map(entry => {
          const miniDetails = entry.ミニロト当選詳細 || [];
          const l6Details = entry.ロト6当選詳細 || [];
          const l7Details = entry.ロト7当選詳細 || [];
          return {
            ...entry,
            ミニロト当選金額: sumAmount(miniDetails),
            ロト6当選金額: sumAmount(l6Details),
            ロト7当選金額: sumAmount(l7Details),
            合計当選金額: sumAmount(miniDetails) + sumAmount(l6Details) + sumAmount(l7Details),
            ミニロト回数: sumCount(miniDetails),
            ロト6回数: sumCount(l6Details),
            ロト7回数: sumCount(l7Details)
          }
        });

        // ========== 高額当選売場ランキング ==========
        function shopRankLabel(idx, entry, color) {
          return `<div style="display:flex;align-items:center;position:absolute;top:-18px;left:18px;z-index:2;">
            <div style="
              background:${color};
              color:#fff;
              padding:3px 14px 3px 14px;
              border-radius:13px 13px 16px 16px;
              font-size:1em;
              font-weight:bold;
              box-shadow:0 2px 6px ${color}22;
              letter-spacing:0.04em;
              margin-right:9px;
            ">第${idx + 1}位</div>
    <span style="
      background:#fff;
      color:${color};
      font-weight:900;
      font-size:1.02em;
      border-radius:12px;
      padding:3px 16px 3px 16px;
      box-shadow:0 1px 5px ${color}25;
      display:inline-block;
      position:static;
      border: 2.5px solid ${color};
    ">
      ${entry.都道府県名}
    </span>
          </div>`;
        }

        function shopNameHtml(entry, color) {
          return entry.詳細URL
            ? `<a href="${entry.詳細URL}" target="_blank" rel="noopener noreferrer"
                style="font-weight:bold;color:${color};text-decoration:underline;
                font-size:1.13em;display:inline-block;margin-top:10px;margin-bottom:7px;">
                ${entry.売場名}
              </a>`
            : `<span style="font-weight:bold;color:${color};font-size:1.13em;display:inline-block;margin-top:38px;margin-bottom:7px;">
                ${entry.売場名}
              </span>`;
        }
        const fmt = n => Number(n).toLocaleString();
        const joinKai = arr => (arr && arr.length > 0) ? arr.map(s => s.replace(/^第?/, "第")).join("・") : "-";
        const joinGrade = arr => (arr && arr.length > 0) ? (arr.every(g => g === arr[0]) ? arr[0] : arr.join("・")) : "";
        function renderPrize(entry, label, count, amount, kai, grade, color) {
          if (count > 0) {
            const gradeText = Array.isArray(grade) && grade.length > 0 ? `（${joinGrade(grade)}）` : "";
            return `<span style="font-weight:bold;color:${color};">${label}${gradeText}：</span>${count}回（${fmt(amount)}円 ／ 開催回：${joinKai(kai)})`;
          }
          return '';
        }
        const colorL6 = labelColors["ロト6"], colorL7 = labelColors["ロト7"], colorMini = labelColors["ミニロト"], colorTotal = "#d2691e";

        const totalRanking = [...normalizedData].sort((a, b) => b.合計当選金額 - a.合計当選金額).slice(0, 5);
        const loto6Ranking = normalizedData.filter(e => e.ロト6当選金額 > 0).sort((a, b) => b.ロト6当選金額 - a.ロト6当選金額).slice(0, 5);
        const loto7Ranking = normalizedData.filter(e => e.ロト7当選金額 > 0).sort((a, b) => b.ロト7当選金額 - a.ロト7当選金額).slice(0, 5);
        const miniRanking = normalizedData.filter(e => e.ミニロト当選金額 > 0).sort((a, b) => b.ミニロト当選金額 - a.ミニロト当選金額).slice(0, 5);

        let rankingHtml = "";
        rankingHtml += `<h2 id="section-total-ranking" style="font-size:1.9em; font-weight:bold; margin:46px 0 16px 0; border-bottom: 3.5px solid #d2691e; letter-spacing:0.01em;">総合高額当選 売場ランキング（第5位まで）</h2>`;
        totalRanking.forEach((entry, idx) => {
          let lines = [];
          if(entry.ミニロト回数)  lines.push(renderPrize(entry, "ミニロト", entry.ミニロト回数, entry.ミニロト当選金額, entry.ミニロト当選回, entry["ミニロト等級"], colorMini));
          if(entry.ロト6回数)    lines.push(renderPrize(entry, "ロト6", entry.ロト6回数, entry.ロト6当選金額, entry.ロト6当選回, entry["ロト6等級"], colorL6));
          if(entry.ロト7回数)    lines.push(renderPrize(entry, "ロト7", entry.ロト7回数, entry.ロト7当選金額, entry.ロト7当選回, entry["ロト7等級"], colorL7));
          rankingHtml += `
<div style="margin-top:20px; margin-bottom:22px; background:#f9fafe; border-radius:18px; border:2.5px solid ${colorTotal}; box-shadow:0 4px 18px -2px ${colorTotal}33,0 1.5px 8px rgba(40,60,80,0.07); padding:22px 17px 13px 17px; position:relative;">
  ${shopRankLabel(idx, entry, colorTotal)}
  <div style="margin-top:10px;">
    <span style="font-size:1.13em; font-weight:bold; color:${colorTotal}; vertical-align:middle;">
      ${entry.詳細URL
        ? `<a href="${entry.詳細URL}" target="_blank" rel="noopener noreferrer" style="color:${colorTotal};text-decoration:underline;">${entry.売場名}</a>`
        : entry.売場名}
    </span>
  </div>
  <div style="font-size:1.05em; color:${colorTotal}; font-weight:900; margin-bottom:5px; letter-spacing:0.03em;">
    合計当選金額：${fmt(entry.合計当選金額)}円
  </div>
  <div style="color:#555; font-size:1.00em; line-height:1.7; margin-left:2px;">
    ${lines.join('<br>')}
  </div>
</div>`;
        });

        rankingHtml += `<h2 id="section-loto6-ranking" style="font-size:1.9em; font-weight:bold; margin:36px 0 14px 0; border-bottom: 3.5px solid ${colorL6}; letter-spacing:0.01em;">ロト6 高額当選 売場ランキング（第5位まで）</h2>`;
        loto6Ranking.forEach((entry, idx) => {
          let lines = [];
          lines.push(renderPrize(entry, "ロト6", entry.ロト6回数, entry.ロト6当選金額, entry.ロト6当選回, entry["ロト6等級"], colorL6));
          rankingHtml += `
<div style="margin-top:20px; margin-bottom:22px; background:#f7fbfe; border-radius:18px; border:2.5px solid ${colorL6}; box-shadow:0 4px 18px -2px ${colorL6}33,0 1.5px 8px rgba(22,123,218,0.07); padding:22px 17px 13px 17px; position:relative;">
  <div style="margin-bottom:9px;">${shopRankLabel(idx, entry, colorL6)}${shopNameHtml(entry, colorL6)}</div>
  <div style="color:#555; font-size:1.01em; margin-left:2px;">
    ${lines.join('<br>')}
  </div>
</div>`;
        });

        rankingHtml += `<h2 id="section-loto7-ranking" style="font-size:1.9em; font-weight:bold; margin:36px 0 14px 0; border-bottom: 3.5px solid ${colorL7}; letter-spacing:0.01em;">ロト7 高額当選 売場ランキング（第5位まで）</h2>`;
        loto7Ranking.forEach((entry, idx) => {
          let lines = [];
          lines.push(renderPrize(entry, "ロト7", entry.ロト7回数, entry.ロト7当選金額, entry.ロト7当選回, entry["ロト7等級"], colorL7));
          rankingHtml += `
<div style="margin-top:20px; margin-bottom:22px; background:#fcf7fd; border-radius:18px; border:2.5px solid ${colorL7}; box-shadow:0 4px 18px -2px ${colorL7}33,0 1.5px 8px rgba(176,5,132,0.07); padding:22px 17px 13px 17px; position:relative;">
  <div style="margin-bottom:9px;">${shopRankLabel(idx, entry, colorL7)}${shopNameHtml(entry, colorL7)}</div>
  <div style="color:#555; font-size:1.01em; margin-left:2px;">
    ${lines.join('<br>')}
  </div>
</div>`;
        });

        rankingHtml += `<h2 id="section-miniloto-ranking" style="font-size:1.9em; font-weight:bold; margin:36px 0 14px 0; border-bottom: 3.5px solid ${colorMini}; letter-spacing:0.01em;">ミニロト 高額当選 売場ランキング（第5位まで）</h2>`;
        miniRanking.forEach((entry, idx) => {
          let lines = [];
          lines.push(renderPrize(entry, "ミニロト", entry.ミニロト回数, entry.ミニロト当選金額, entry.ミニロト当選回, entry["ミニロト等級"], colorMini));
          rankingHtml += `
<div style="margin-top:20px; margin-bottom:22px; background:#fffaf7; border-radius:18px; border:2.5px solid ${colorMini}; box-shadow:0 4px 18px -2px ${colorMini}33,0 1.5px 8px rgba(243,152,0,0.07); padding:22px 17px 13px 17px; position:relative;">
  <div style="margin-bottom:9px;">${shopRankLabel(idx, entry, colorMini)}${shopNameHtml(entry, colorMini)}</div>
  <div style="color:#555; font-size:1.01em; margin-left:2px;">
    ${lines.join('<br>')}
  </div>
</div>`;
        });

        document.getElementById('lottery-ranking').innerHTML = rankingHtml;

      } catch (error) {
        document.getElementById('lottery-sidebar').innerHTML = '高額当選情報の取得に失敗しました。';
        document.getElementById('lottery-ranking').innerHTML = 'ランキング情報の取得に失敗しました。';
        console.error(error);
      }
    })();
    // --- ここまで ---
  }, []);

  return (
    <div style={{ padding: '0 0 40px 0', margin: 0 }}>
      <div dangerouslySetInnerHTML={{ __html: staticHtml }} />
    </div>
  );
}