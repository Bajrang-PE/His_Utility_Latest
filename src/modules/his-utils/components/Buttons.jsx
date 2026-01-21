import { useNavigate } from 'react-router-dom';

//eslint-disable-next-line
import { motion, AnimatePresence, easeIn } from 'framer-motion';

function PrimaryButton({ buttonText, handler }) {
  return (
    <motion.button
      className="primaryBtn"
      onClick={handler}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'keyframes', duration: 0.3, ease: easeIn }}
    >
      {buttonText}
    </motion.button>
  );
}

function SecondaryButton({ buttonText, handler }) {
  return (
    <button className="secondaryBtn" onClick={handler}>
      {buttonText}
    </button>
  );
}

function GhostButton({ buttonText, handler }) {
  return (
    <button className="ghostBtn" onClick={handler}>
      {buttonText}
    </button>
  );
}

function BackButton() {
  const navigate = useNavigate();
  return (
    <button className="backButton" onClick={() => navigate(-1)}>
      <img src="/back.png" alt="Back Button" className="backButton-icon" />
    </button>
  );
}

function PlusButton({ handler }) {
  return (
    <button className="addButton" onClick={handler}>
      <img src="/add.png" alt="Add Button" className="addButton-icon" />
    </button>
  );
}

function SubstractButton({ handler }) {
  return (
    <button className="substractButton" onClick={handler}>
      <img
        src="/minus.png"
        alt="Substract Button"
        className="substractButton-icon"
      />
    </button>
  );
}

export {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  BackButton,
  PlusButton,
  SubstractButton,
};
