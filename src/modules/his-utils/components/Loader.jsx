// components/GlobalLoader.js
import ReactDOM from 'react-dom';
import { Grid } from 'react-loader-spinner';

export default function GlobalLoader({ visible, message = 'Loading...' }) {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="global-loader__overlay">
      <div className="global-loader__spinner-box">
        <Grid height={80} width={80} color="#ff6b2c" />
        <p className="global-loader__message">{message}</p>
      </div>
    </div>,
    document.body
  );
}
