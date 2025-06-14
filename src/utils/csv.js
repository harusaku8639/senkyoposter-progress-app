export const exportCSV = (progress) => {
  const rows = [
    ['投票区', '掲示場', '完了']
  ];
  Object.entries(progress).forEach(([district, locations]) => {
    Object.entries(locations).forEach(([loc, done]) => {
      rows.push([district, loc, done ? '1' : '0']);
    });
  });
  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'progress.csv';
  link.click();
};
