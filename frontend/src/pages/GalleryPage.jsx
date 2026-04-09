import { useState, useEffect, useCallback } from 'react';
import useApi from '../hooks/useApi';
import GalleryGrid from '../components/GalleryGrid';

const PAGE_SIZE = 24;

export default function GalleryPage() {
  const { fetchGallery } = useApi();
  const [drawings, setDrawings] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (newOffset = 0, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGallery(PAGE_SIZE, newOffset);
      setDrawings((prev) => (append ? [...prev, ...data.drawings] : data.drawings));
      setTotal(data.total);
      setOffset(newOffset);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchGallery]);

  useEffect(() => {
    load(0);
  }, [load]);

  const hasMore = offset + PAGE_SIZE < total;

  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8 md:px-9">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-[11px] font-bold tracking-[4px] uppercase text-utep-orange mb-2">
          ✦ Drawing Gallery ✦
        </div>
        <h1 className="font-heading text-[clamp(36px,5vw,58px)] tracking-wider leading-none bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-2">
          Festival Creations
        </h1>
        <p className="text-sm text-utep-text-dim">
          {total > 0 ? `${total} drawing${total !== 1 ? 's' : ''} and counting!` : 'Drawings from the festival will appear here.'}
        </p>
      </div>

      {error && (
        <div className="text-center text-red-400 text-sm mb-6">
          😕 {error}
          <button onClick={() => load(0)} className="ml-2 text-utep-orange hover:underline cursor-pointer">
            Retry
          </button>
        </div>
      )}

      <GalleryGrid drawings={drawings} />

      {/* Load more */}
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={() => load(offset + PAGE_SIZE, true)}
            className="px-6 py-3 rounded-xl bg-utep-glass border border-utep-border text-utep-text-dim font-bold text-sm tracking-wide cursor-pointer transition-all hover:bg-utep-orange/8 hover:border-utep-orange/40 hover:text-utep-orange-light"
          >
            Load More
          </button>
        </div>
      )}

      {loading && drawings.length > 0 && (
        <div className="text-center mt-6">
          <div className="inline-block w-6 h-6 border-2 border-utep-orange/20 border-t-utep-orange rounded-full animate-spin" />
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-4 mt-8 text-[11px] text-utep-text-dim tracking-wide border-t border-utep-orange/8">
        Powered by <span className="text-utep-orange">Claude AI</span> · Made with ♥ for <span className="text-utep-orange">UTEP</span> &amp; El Paso
      </footer>
    </main>
  );
}
