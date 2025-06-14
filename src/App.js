import React, { useState, useEffect } from 'react';
import { postersData } from './data/postersData';
import { loadData, saveData } from './utils/storage';
import { exportCSV } from './utils/csv';
import './styles/App.css';

const teams = {
  A: '#2196F3',
  B: '#4CAF50',
  C: '#FF9800',
  D: '#9C27B0'
};

function Header({ team, overall }) {
  return (
    <header style={{ background: teams[team] }}>
      <h2>第27回参議院議員通常選挙 ポスター掲示進捗管理</h2>
      <div>チーム: {team}</div>
      <div>全体進捗: {overall}%</div>
    </header>
  );
}

function DistrictCard({ name, done, total, onClick }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div className="district-card" onClick={onClick}>
      <h4>{name}</h4>
      <div>{done}/{total}</div>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#2196F3' }} />
      </div>
    </div>
  );
}

function App() {
  const [team, setTeam] = useState(localStorage.getItem('team') || 'A');
  const [progress, setProgress] = useState(loadData());
  const [selected, setSelected] = useState(null);

  // sync every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(loadData());
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // save on change
  useEffect(() => {
    saveData(progress);
  }, [progress]);

  const handleCheck = (district, loc, checked) => {
    setProgress(prev => ({
      ...prev,
      [district]: { ...(prev[district] || {}), [loc]: checked }
    }));
  };

  const overallPct = (() => {
    const totals = Object.values(postersData).reduce((acc, arr) => acc + arr.length, 0);
    const done = Object.values(progress).reduce((acc, obj) => acc + Object.values(obj).filter(v => v).length, 0);
    return Math.round((done / totals) * 100);
  })();

  if (!team) {
    return (
      <div style={{ padding: 20 }}>
        <h3>チームを選択してください</h3>
        {Object.keys(teams).map(t => (
          <button key={t} onClick={() => { setTeam(t); localStorage.setItem('team', t); }} style={{ marginRight: 8 }}>
            チーム{t}
          </button>
        ))}
      </div>
    );
  }

  if (selected) {
    const locations = postersData[selected];
    const doneLocs = progress[selected] || {};
    return (
      <div>
        <Header team={team} overall={overallPct} />
        <main>
          <h3>{selected}</h3>
          <ul>
            {locations.map(loc => (
              <li key={loc}>
                <label>
                  <input
                    type="checkbox"
                    checked={doneLocs[loc] || false}
                    onChange={e => handleCheck(selected, loc, e.target.checked)}
                  />{' '}
                  {loc}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={() => setSelected(null)}>戻る</button>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header team={team} overall={overallPct} />
      <main>
        <button onClick={() => exportCSV(progress)} style={{ marginBottom: 12 }}>CSV エクスポート</button>
        <div className="district-grid">
          {Object.entries(postersData).map(([district, locs]) => {
            const doneCount = Object.values(progress[district] || {}).filter(v => v).length;
            return (
              <DistrictCard
                key={district}
                name={district}
                total={locs.length}
                done={doneCount}
                onClick={() => setSelected(district)}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
