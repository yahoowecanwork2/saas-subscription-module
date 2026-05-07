// generate student id and admin user id use for login
export const generateUserId = (email, name) => {
  // robovation old electronics
  const text = "roelectronics";
  const e = (email || "").slice(0, 2).toLowerCase();
  const i = (text || "").slice(0, 5).toLowerCase();
  const n = (name || "").slice(0, 3).toLowerCase();
  const unique = Math.random().toString(36).substring(2, 5);
  const userId = `${i}${e}${n}${unique}`;

  return userId;
};

export const generateSellerId = (email, name) => {
  const text = "roelectronics";
  const e = (email || "").slice(0, 2).toLowerCase();
  const i = (text || "").slice(0, 2).toLowerCase();
  const o = (name || "").slice(0, 2).toLowerCase();
  const unique = Math.random().toString(36).substring(2, 5);
  const sellerId = `${i}${e}${o}${unique}`;

  return sellerId;
};

export const generateId = () => {
  return Math.floor(10000 + Math.random() * 90000);
};
