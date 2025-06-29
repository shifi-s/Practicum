# 🎧 Non-Stop Music – פלטפורמת מוזיקה מבוססת AI

**Non-Stop Music** היא אפליקציית מוזיקה אינטראקטיבית עם נגן מובנה, פלייליסטים, תמלול שירים אוטומטי, זיהוי ז'אנרים ויכולות ניהול למשתמשים ולמנהל המערכת.

🔗 **לינק לפרויקט החי:**  
https://non-stop-music.onrender.com

🔗 **קוד מקור ב-GitHub:**  
https://github.com/shifi-s/Practicum

---

## 🚀 תכונות עיקריות

- ✅ הרשמה והתחברות עם JWT
- 🎶 האזנה לשירים מתוך הפלייליסט
- 📁 ניהול פלייליסטים – הוספה, מחיקה
- ⬆️ העלאת שירים ותמונות עטיפה (AWS S3)
- 🧠 תמלול שירים אוטומטי (OpenAI Whisper)
- 🎼 זיהוי ז'אנר על פי התוכן
- 🌟 המלצות שירים מותאמות אישית
- 🧑‍💼 ממשק ניהול למנהל: משתמשים, שירים, דוחות

---

## 🛠 טכנולוגיות

### Backend – .NET 9 Web API
- ASP.NET Core (Minimal APIs)
- Entity Framework Core – DB First
- MySQL
- AWS S3 (Presigned URLs)
- JWT Authentication
- Swagger, Interceptors

### Frontend – React + TypeScript
- React Hooks, Context, Zustand / MobX
- Material UI (MUI)
- react-router-dom
- axios
- music-metadata-browser (ניתוח שירים)

---

## ⚙️ התקנה מקומית

### דרישות מוקדמות:
- Node.js
- .NET 9 SDK
- MySQL
- חשבון AWS S3
- חשבון OpenAI (לתמלול)

### שלבים:

#### 1. Clone
```bash
git clone https://github.com/shifi-s/Practicum.git
cd Practicum
