import React, { createContext, useState, ReactNode, useContext } from 'react';
import Login from './login';
import Register from './register';

// הגדרת סוגי המודלים האפשריים
export type ModalType = 'none' | 'login' | 'register';

// הגדרת טיפוס הערכים שיועברו בקונטקסט
interface ModalContextType {
  activeModal: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

// יצירת הקונטקסט עם ערכי ברירת מחדל
export const ModalContext = createContext<ModalContextType>({
  activeModal: 'none',
  openModal: () => {},
  closeModal: () => {},
});

// Custom hook לשימוש בקונטקסט
export const useModal = () => useContext(ModalContext);

// פרופס לקומפוננטת הפרוביידר
interface ModalProviderProps {
  children: ReactNode;
}

// קומפוננטת הפרוביידר שמכילה את הלוגיקה והמצב
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // מצב לשמירת המודל הפעיל
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  // פונקציה לפתיחת מודל ספציפי
  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  // פונקציה לסגירת כל מודל פעיל
  const closeModal = () => {
    setActiveModal('none');
  };

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
      
      {/* הצגת המודלים על פי המצב */}
      {activeModal === 'login' && <Login onClose={closeModal} />}
      {activeModal === 'register' && <Register onClose={closeModal} />}
    </ModalContext.Provider>
  );
};

// דוגמה לשימוש בקומפוננטת Header
export const withModalContext = (Component: React.ComponentType) => {
  return (props: any) => (
    <ModalProvider>
      <Component {...props} />
    </ModalProvider>
  );
};
