import React, { useState, useEffect, useMemo } from 'react';
import { votingDistricts } from './data/votingDistricts';
import './styles/App.css';

const STORAGE_KEY = 'checked-districts-v1';

export default function ChecklistApp() {
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });
  const [search, setSearch] = useState('');
  const [sortCompletedTop, setSortCompletedTop] = useState(false);

  // Save to LocalStorage whenever checked changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  // Derived values
  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPct = Math.round((completedCount / votingDistricts.length) * 100);

  const filteredDistricts = useMemo(() => {
    let list = votingDistricts.filter(d => String(d.id).includes(search.trim()))
    if (sortCompletedTop) {
      list = [...list].sort((a, b) => {
        const aDone = checked[a.id] ? 1 : 0;
        const bDone = checked[b.id] ? 1 : 0;
        return bDone - aDone; // 完了を上へ
      });
    }
    return list;
  }, [search, sortCompletedTop, checked]);

  const toggle = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearAll = () => {
    if (window.confirm('すべてのチェックをクリアしますか？')) {
      setChecked({});
    }
  };

  const nowStr = new Date().toLocaleString();

  return (
    <div className="app-container">
      <header className="app-header">
        <h2>横浜市磯子区 選挙ポスター掲示チェックリスト</h2>
        <div className="progress-wrapper">
          <span>完了: {completedCount}/{votingDistricts.length} 投票区 ({progressPct}%)</span>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </header>

      <section className="controls">
        <input
          type="text"
          placeholder="投票区番号で検索"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setSortCompletedTop(prev => !prev)}>
          {sortCompletedTop ? '元の順序' : '完了を上へ'}
        </button>
        <button onClick={clearAll}>すべてクリア</button>
      </section>

      <main className="district-grid">
        {filteredDistricts.map(d => {
          const done = !!checked[d.id];
          return (
            <div
              key={d.id}
              className={`district-card ${done ? 'checked' : ''}`}
              onClick={() => toggle(d.id)}
            >
              <label>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(d.id)}
                  onClick={e => e.stopPropagation()}
                />
                <span className="district-name">{d.name}</span>
              </label>
              <span className="poster-count">掲示場数: {d.posterCount}</span>
            </div>
          );
        })}
      </main>

      <footer className="app-footer">
        <span>最終更新: {nowStr}</span>
        <span style={{ marginLeft: 8 }}>総掲示場数: 260 箇所</span>
      </footer>
    </div>
  );
}
