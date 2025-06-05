import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        // אם יש טוקן, לך לרשימת השירים
        if (sessionStorage.getItem("token")) {
            navigate('/songs');
        } else {
            // אם אין טוקן, הראה modal התחברות (או לך לדף התחברות)
            // כאן תצטרכי להוסיף את הלוגיקה לפתיחת modal או ניווט לדף התחברות
            navigate('/songs'); // או לפתוח modal
        }
    };

    const handleMyPlaylists = () => {
        if (sessionStorage.getItem("token")) {
            navigate('/myPlaylists');
        } else {
            // פתח modal התחברות
            navigate('/songs');
        }
    };

    const handleNewSongs = () => {
        navigate('/newSongs');
    };

    return (
        <div 
            style={{
                // Full viewport coverage
                width: '100vw',
                height: '100vh',
                minHeight: '100vh',
                
                // Remove any default margins/padding
                margin: 0,
                padding: 0,
                
                // Position fixed to cover entire screen
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                
                // Dynamic gradient background - matching header colors
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)',
                backgroundSize: '400% 400%',
                
                // Gradient animation
                animation: 'gradientShift 15s ease infinite',
                
                // Fix overflow issue
                overflow: 'hidden',
                zIndex: -1
            }}
        >
            {/* Glassmorphism overlay effect */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    pointerEvents: 'none',
                }}
            />
            
            {/* Floating Music Notes */}
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        fontSize: `${Math.random() * 20 + 15}px`,
                        color: 'rgba(255, 255, 255, 0.2)',
                        left: `${10 + Math.random() * 80}%`, // הגבלת המיקום
                        top: `${10 + Math.random() * 80}%`,
                        animationDelay: `${Math.random() * 8}s`,
                        animation: `floatNote${i % 4} ${6 + Math.random() * 3}s ease-in-out infinite`,
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                >
                    {['♪', '♫', '♬', '🎵', '🎶'][Math.floor(Math.random() * 5)]}
                </div>
            ))}
            
            {/* Content container with proper header spacing */}
            <div 
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem',
                    paddingTop: '120px', // Space for header
                    paddingBottom: '2rem',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    direction: 'rtl',
                    overflow: 'auto'
                }}
            >
                {/* Main Title */}
                <div
                    style={{
                        marginBottom: '2rem',
                        padding: '2rem 3rem',
                        borderRadius: '25px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        animation: 'fadeInUp 1s ease-out',
                        maxWidth: '100%'
                    }}
                >
                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 6vw, 4rem)',
                            fontWeight: 800,
                            color: 'white',
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            margin: '0 0 1rem 0',
                            background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontFamily: "'Inter', 'Rubik', sans-serif"
                        }}
                    >
                        🎵 מוזיקה ללא הפסקה 🎵
                    </h1>
                    
                    <p
                        style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                            color: 'rgba(255, 255, 255, 0.95)',
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            margin: 0,
                            fontWeight: 600,
                            lineHeight: 1.6
                        }}
                    >
                        גלה, השמע וצור את רשימות ההשמעה המושלמות שלך
                    </p>
                </div>

                {/* Navigation Cards - עכשיו הם קישורים אמיתיים */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '1000px',
                        width: '100%',
                        marginBottom: '2rem'
                    }}
                >
                    {/* כל השירים */}
                    <div
                        onClick={() => navigate('/songs')}
                        style={{
                            padding: '2rem',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                            animation: 'fadeInUp 1.2s ease-out',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</div>
                        <h3 style={{ 
                            color: 'white', 
                            fontSize: '1.4rem', 
                            fontWeight: 700, 
                            margin: '0 0 1rem 0',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            כל השירים
                        </h3>
                        <p style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '1rem', 
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            גלה את כל האוסף המוזיקלי שלנו
                        </p>
                    </div>

                    {/* מה חדש */}
                    <div
                        onClick={handleNewSongs}
                        style={{
                            padding: '2rem',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                            animation: 'fadeInUp 1.4s ease-out',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        }}
                    >
                        {/* Badge "חדש" */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: '#ff4757',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                animation: 'pulse 2s infinite'
                            }}
                        >
                            חדש!
                        </div>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                        <h3 style={{ 
                            color: 'white', 
                            fontSize: '1.4rem', 
                            fontWeight: 700, 
                            margin: '0 0 1rem 0',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            מה חדש
                        </h3>
                        <p style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '1rem', 
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            הכי חדש והכי חם שיש לנו
                        </p>
                    </div>

                    {/* השירים שלי */}
                    <div
                        onClick={handleMyPlaylists}
                        style={{
                            padding: '2rem',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                            animation: 'fadeInUp 1.6s ease-out',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                        <h3 style={{ 
                            color: 'white', 
                            fontSize: '1.4rem', 
                            fontWeight: 700, 
                            margin: '0 0 1rem 0',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            השירים שלי
                        </h3>
                        <p style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '1rem', 
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            הפלייליסטים האישיים שלך
                        </p>
                    </div>
                </div>

                {/* Call to Action - מוביל לכל השירים */}
                <div
                    style={{
                        animation: 'fadeInUp 1.8s ease-out'
                    }}
                >
                    <button
                        onClick={handleGetStarted}
                        style={{
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            padding: '1rem 3rem',
                            borderRadius: '25px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            color: '#5a67d8',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            direction: 'rtl',
                            fontFamily: "'Inter', 'Rubik', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        }}
                    >
                        🎵 בואו נתחיל להאזין 🎵
                    </button>
                </div>
            </div>
            
            {/* CSS Keyframes Animation */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Rubik:wght@400;500;600;700;800&display=swap');
                    
                    @keyframes gradientShift {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                    
                    @keyframes fadeInUp {
                        0% {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes pulse {
                        0% { transform: scale(0.9); opacity: 0.8; }
                        50% { transform: scale(1.1); opacity: 1; }
                        100% { transform: scale(0.9); opacity: 0.8; }
                    }
                    
                    @keyframes floatNote0 {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-25px) rotate(10deg);
                        }
                    }
                    
                    @keyframes floatNote1 {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-20px) rotate(-8deg);
                        }
                    }
                    
                    @keyframes floatNote2 {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-30px) rotate(12deg);
                        }
                    }
                    
                    @keyframes floatNote3 {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-18px) rotate(-5deg);
                        }
                    }
                    
                    @media (max-width: 768px) {
                        /* מניעת גלישה במובייל */
                        body {
                            overflow-x: hidden;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Home;