import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Clapperboard,
  ShoppingBag,
  X,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

import useReels from "../hooks/useReels";
import ReelCard from "../components/reels/ReelCard";
import CreateReelModal from "../components/reels/CreateReelModal";
import useAuth from "../hooks/useAuth";

function ProductSheet({ products, onClose, onProductClick }) {
  if (!products) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Tagged products"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[80dvh] w-full overflow-hidden rounded-t-3xl border border-white/10 bg-[#141414] text-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <h2 className="font-semibold">Shop this reel</h2>
            <p className="mt-1 text-xs text-white/50">
              Products tagged in this video
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close products"
            className="rounded-full p-2 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto p-4">
          {products.length === 0 && (
            <p className="py-8 text-center text-sm text-white/50">
              No tagged products available.
            </p>
          )}

          {products.map((product) => (
            <article
              key={product._id}
              onClick={() => onProductClick(product._id)}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/3 p-3"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/30">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium">
                  {product.name}
                </h3>
                {product.price != null && (
                  <p className="mt-2 text-sm font-bold text-(--brand,#a3e635)">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Reels() {
  const [searchParams] = useSearchParams();
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const navigate = useNavigate();

  const { user: currentUser } = useAuth();

  const { reels, isPending, isError, refetch, isFetching } = useReels({
    page: 1,
    limit: 20,
  });

  const selectedReelId = searchParams.get("reel");

  return (
    <main className="relative h-dvh overflow-hidden bg-black text-white">
      {/* Reels scroll area */}
      <div
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
        style={{ scrollbarWidth: "none" }}
      >
        {isPending ? (
          <div className="flex h-dvh flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Clapperboard size={30} className="text-(--brand,#a3e635)" />
            </div>
            <LoaderCircle
              size={24}
              className="animate-spin text-(--brand,#a3e635)"
            />
            <p className="text-sm text-white/50">Loading reels...</p>
          </div>
        ) : isError ? (
          <div className="flex h-dvh flex-col items-center justify-center px-6 text-center">
            <Clapperboard size={42} className="mb-4 text-white/30" />
            <h2 className="text-lg font-semibold">Couldn't load reels</h2>
            <p className="mt-2 max-w-xs text-sm text-white/50">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--brand,#84cc16) px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : reels.length === 0 ? (
          <div className="flex h-dvh flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
              <Clapperboard size={36} className="text-white/50" />
            </div>
            <h2 className="text-xl font-bold">No reels yet</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
              Be the first to share a video with your community.
            </p>
            <button
              type="button"
              onClick={() => {
                console.log("Create Reel button clicked");
                setIsCreateOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--brand,#84cc16) px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-95"
            >
              <Plus size={18} />
              Create your first reel
            </button>
          </div>
        ) : (
          reels.map((reel) => (
            <div
              key={reel._id}
              id={`reel-${reel._id}`}
              className="relative h-dvh snap-start snap-always"
            >
              <ReelCard
                reel={reel}
                onViewProducts={setSelectedProducts}
                currentUserId={currentUser?._id ?? currentUser?.id}
              />
            </div>
          ))
        )}
      </div>

      {/* Create reel floating action */}
      {!isPending && !isError && reels.length > 0 && (
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          aria-label="Create a reel"
          className="absolute right-4 top-[max(5rem,env(safe-area-inset-top))] z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-xl transition hover:bg-black/70 active:scale-95 sm:right-6"
        >
          <Plus size={19} className="text-(--brand,#a3e635)" />
          <span>Create</span>
        </button>
      )}

      {isFetching && !isPending && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2 rounded-full bg-black/50 p-2">
          <LoaderCircle
            size={18}
            className="animate-spin text-(--brand,#a3e635)"
          />
        </div>
      )}

      {selectedProducts && (
        <ProductSheet
          products={selectedProducts}
          onClose={() => setSelectedProducts(null)}
          onProductClick={(productId) => {
            setSelectedProducts(null);
            navigate(`/products/${productId}`);
          }}
        />
      )}

      {isCreateOpen && (
        <CreateReelModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </main>
  );
}
