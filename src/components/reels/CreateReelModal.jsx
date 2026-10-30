import { useEffect, useRef, useState } from "react";
import { X, Upload, Video, Check } from "lucide-react";

import useProducts from "../../hooks/useProducts.js";
import useReels from "../../hooks/useReels.js";

const CreateReelModal = ({ isOpen, onClose }) => {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [videoError, setVideoError] = useState("");

  const fileInputRef = useRef(null);
  const videoUrl = video ? URL.createObjectURL(video) : "";

  const {
    products,
    isPending: isProductsLoading,
    isError: isProductsError,
  } = useProducts({ page: 1, limit: 50 });

  const {
    createReel,
    isCreatingReel,
    createReelError,
  } = useReels();

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (!isOpen) {
      setVideo(null);
      setCaption("");
      setSelectedProducts([]);
      setVideoError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      setVideoError("MP4, WebM, or MOV video select pannu.");
      event.target.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setVideoError("Video size 50 MB-kulla irukkanum.");
      event.target.value = "";
      return;
    }

    setVideoError("");
    setVideo(file);
  };

  const toggleProduct = (productId) => {
    setSelectedProducts((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : current.length >= 20
          ? current
          : [...current, productId],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!video) {
      setVideoError("Video select pannu.");
      return;
    }

    const formData = new FormData();

    formData.append("video", video);
    formData.append("caption", caption.trim());
    formData.append(
      "taggedProducts",
      JSON.stringify(selectedProducts),
    );

    try {
      await createReel(formData);
      onClose();
    } catch {
      // Error useCreateReel hook-la expose aagum.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-reel-title"
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 text-gray-900 sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="create-reel-title"
            className="text-xl font-bold"
          >
            Create Reel
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isCreatingReel}
            aria-label="Close modal"
            className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            placeholder="Select a video"
            onChange={handleVideoChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-gray-500"
          >
            {video ? (
              <Video size={28} />
            ) : (
              <Upload size={28} />
            )}

            <span className="font-medium">
              {video ? video.name : "Select a video"}
            </span>

            <span className="text-xs text-gray-500">
              MP4, WebM or MOV · Max 50 MB
            </span>
          </button>

          {video && (
            <video
              key={video.name + video.size}
              src={URL.createObjectURL(video)}
              controls
              playsInline
              className="mx-auto max-h-64 w-auto max-w-full rounded-xl bg-black"
            />
          )}

          {videoError && (
            <p className="text-sm text-red-600">{videoError}</p>
          )}

          <div>
            <label
              htmlFor="reel-caption"
              className="mb-2 block text-sm font-medium"
            >
              Caption
            </label>

            <textarea
              id="reel-caption"
              value={caption}
              placeholder="Write a caption..."
              onChange={(event) =>
                setCaption(event.target.value.slice(0, 2000))
              }
              maxLength={2000}
              rows={3}
              className="w-full resize-y rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
            />

            <p className="mt-1 text-right text-xs text-gray-500">
              {caption.length}/2000
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Tag products</h3>
              <span className="text-sm text-gray-500">
                {selectedProducts.length}/20 selected
              </span>
            </div>

            {isProductsLoading && (
              <p className="text-sm text-gray-500">
                Loading products...
              </p>
            )}

            {isProductsError && (
              <p className="text-sm text-red-600">
                Products load panna mudiyala. Try again later.
              </p>
            )}

            {!isProductsLoading &&
              !isProductsError &&
              products.length === 0 && (
                <p className="text-sm text-gray-500">
                  Products available illa.
                </p>
              )}

            <div className="max-h-64 space-y-2 overflow-y-auto">
              {products
                .filter((product) => product.isActive !== false)
                .map((product) => {
                  const isSelected = selectedProducts.includes(
                    product._id,
                  );

                  return (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => toggleProduct(product._id)}
                      disabled={
                        !isSelected && selectedProducts.length >= 20
                      }
                      aria-pressed={isSelected}
                     className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-gray-900 ${
  isSelected
    ? "border-black bg-gray-50"
    : "border-gray-200 bg-white"
}`}
                    >
                      <img
                        src={product.images?.[0]}
                        alt=""
                        className="h-14 w-14 rounded-lg bg-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          ₹{product.price}
                        </p>
                      </div>

                      {isSelected && (
                        <Check size={20} />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {createReelError && (
            <p role="alert" className="text-sm text-red-600">
              {createReelError?.response?.data?.message ||
                createReelError?.message ||
                "Reel upload failed. Try again."}
            </p>
          )}

          <button
            type="submit"
            disabled={isCreatingReel || !video}
            className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreatingReel ? "Uploading..." : "Share Reel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReelModal;
