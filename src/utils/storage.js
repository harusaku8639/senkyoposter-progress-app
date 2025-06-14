export const loadData = () => {
  const raw = localStorage.getItem('posterProgress');
  return raw ? JSON.parse(raw) : {};
};

export const saveData = (data) => {
  localStorage.setItem('posterProgress', JSON.stringify(data));
};
