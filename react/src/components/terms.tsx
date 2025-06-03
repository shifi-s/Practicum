import { Typography, Container, Paper } from "@mui/material";

export default function Terms() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          תנאי שימוש באתר
        </Typography>

        <Typography variant="body1"  sx={{ mt: 2 }}>
          ברוכים הבאים לאתר המוזיקה שלנו! האתר נועד לספק חוויית האזנה והעלאת שירים עבור הקהל החרדי, תוך שמירה על אווירה נקייה, מכובדת ותורנית.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          כללי התנהגות ותוכן מותר:
        </Typography>
        <ul style={{ paddingInlineStart: "20px" }}>
          <li>
            <Typography variant="body1">❗ חל איסור מוחלט להעלות שירים בביצוע נשים.</Typography>
          </li>
          <li>
            <Typography variant="body1">🔇 אין לפרסם שירים עם מילים שאינן תואמות לרוח חרדית, לשון זולה או תכנים בעייתיים.</Typography>
          </li>
          <li>
            <Typography variant="body1">📛 כל שיר שמועלה עובר בדיקה, והמערכת שומרת לעצמה את הזכות להסירו.</Typography>
          </li>
          <li>
            <Typography variant="body1">⚠️ משתמש שיחרוג מהכללים – עלול להיחסם לצמיתות.</Typography>
          </li>
        </ul>

        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
          שימוש באתר:
        </Typography>
        <Typography variant="body1" >
          השימוש באתר הוא אישי בלבד ואינו מסחרי. אין לעשות שימוש חוזר או הפצה של תכנים מהאתר ללא רשות מפורשת.
        </Typography>

        <Typography variant="body1" >
          תודה על שיתוף הפעולה ושמירה על קדושת האתר 🙏
        </Typography>
      </Paper>
    </Container>
  );
}
