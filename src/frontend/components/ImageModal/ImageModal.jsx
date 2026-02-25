import { createPortal } from 'react-dom';
import { AiOutlineClose, AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, onClose, imageSrc, imageAlt, productName }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
    } else {
      document.body.style.overflow = 'unset';
      setIsZoomed(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.productTitle}>{productName}</h3>
          <div className={styles.controls}>
            <button
              className={styles.zoomButton}
              onClick={toggleZoom}
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <AiOutlineZoomOut /> : <AiOutlineZoomIn />}
            </button>
            <button
              className={styles.closeButton}
              onClick={onClose}
              title="Close"
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className={styles.imageContainer}>
          {!imageLoaded && (
            <div className={styles.imageLoader}>
              <div className={styles.spinner}></div>
              <p>Loading image...</p>
            </div>
          )}
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`${styles.modalImage} ${isZoomed ? styles.zoomed : ''} ${
              imageLoaded ? styles.loaded : ''
            }`}
            onLoad={handleImageLoad}
            onClick={toggleZoom}
          />
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <p className={styles.instruction}>
            Click image to {isZoomed ? 'zoom out' : 'zoom in'} • Press ESC to close
          </p>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ImageModal;