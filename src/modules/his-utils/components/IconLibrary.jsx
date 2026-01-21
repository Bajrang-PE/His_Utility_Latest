import React, { useState, useMemo } from 'react';
//eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Filter keys to only actual icons (ignore helper exports)
const iconEntries = Object.entries(solidIcons).filter(
  ([key]) => key.startsWith('fa') && key !== 'fas' && key !== 'prefix'
);

const iconsPerPage = 20;

export default function IconLibrary({ setSelectedIcon }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  //   const [selectedIcon, setSelectedIcon] = useState(null);

  // Filtered icons based on search
  const filteredIcons = useMemo(() => {
    if (!search) return iconEntries;

    return iconEntries.filter(([name]) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Pagination calculations
  const pageCount = Math.ceil(filteredIcons.length / iconsPerPage);
  const paginatedIcons = filteredIcons.slice(
    (page - 1) * iconsPerPage,
    page * iconsPerPage
  );

  const toggleOpen = () => {
    setIsOpen((open) => !open);
  };

  const selectIcon = (iconName) => {
    setSelectedIcon(iconName);
    setIsOpen(false);
  };

  // Reset page when search changes
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <>
      <p
        className="Kpi__container--controls-link"
        onClick={toggleOpen}
        style={{
          cursor: 'pointer',
          marginBottom: '0.5rem',
          userSelect: 'none',
        }}
      >
        Select Icon
      </p>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="Iconlib"
          >
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="Iconlib__search"
              autoFocus
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {paginatedIcons.length === 0 && (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  No icons found
                </p>
              )}

              {paginatedIcons.map(([name, icon]) => (
                <div
                  key={name}
                  onClick={() => selectIcon(name)}
                  className="Iconlib__icon"
                  title={name}
                >
                  <FontAwesomeIcon icon={icon} size="lg" />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="Iconlib__pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                  }}
                  className="Iconlib__pagination-btn"
                >
                  Prev
                </button>
                <span>
                  Page {page} / {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  style={{
                    cursor: page === pageCount ? 'not-allowed' : 'pointer',
                  }}
                  className="Iconlib__pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
