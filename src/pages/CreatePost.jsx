
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X, Search, Package } from "lucide-react";
import usePosts from "../hooks/usePosts.js";
import useProducts from "../hooks/useProducts.js";

const MAX_IMAGES = 10;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const CreatePost = () => {
  const navigate = useNavigate();

  const {
    createPost,
    isCreatingPost,
    createPostError,
  } = usePosts({ page: 1, limit: 10 });

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [taggedProducts, setTaggedProducts] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const {
    products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts({
    page: 1,
    limit: 50,
    search: productSearch,
  });

  // Create and clean up image preview URLs
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    setImages((previous) => {
      const remaining = MAX_IMAGES - previous.length;
      const nextFiles = files.slice(0, remaining);

      for (const file of nextFiles) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          alert(`${file.name}: JPG, PNG, WebP images mattum allowed.`);
          return previous;
        }

        if (file.size > MAX_SIZE) {
          alert(`${file.name}: Image size 5MB-kulla irukkanum.`);
          return previous;
        }
      }

      return [...previous, ...nextFiles];
    });
  };

  const removeImage = (index) => {
    setImages((previous) => previous.filter((_, i) => i !== index));
  };

  const toggleProduct = (product) => {
    const productId = product._id;

    setTaggedProducts((previous) => {
      const alreadySelected = previous.some(
        (item) => item._id === productId
      );

      if (alreadySelected) {
        return previous.filter((item) => item._id !== productId);
      }

      if (previous.length >= 10) {
        alert("Maximum 10 products tag pannalaam.");
        return previous;
      }

      return [...previous, product];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim() && images.length === 0) {
      alert("Content illa image-aavadhu add pannu bro.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content.trim());
    formData.append(
      "taggedProducts",
      JSON.stringify(taggedProducts.map((product) => product._id))
    );

    images.forEach((file) => formData.append("images", file));

    try {
      await createPost(formData);
      navigate("/");
    } catch (error) {
      console.error("Create post failed:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-5 shadow-sm"
      >
        <h1 className="text-xl font-bold">Create Post</h1>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What's on your mind?"
          maxLength={2000}
          rows={4}
          className="w-full resize-y rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3">
            <ImagePlus size={20} />
            <span>Add images ({images.length}/{MAX_IMAGES})</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={handleImageChange}
              disabled={images.length >= MAX_IMAGES}
            />
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previewUrls.map((url, index) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <section className="space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Package size={20} />
            Tag Products
          </div>

          <p className="text-sm text-gray-500">
            Indha post-kku related products select pannu.
          </p>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {taggedProducts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Selected ({taggedProducts.length}/10)
              </p>

              {taggedProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-lg bg-blue-50 p-2"
                >
                  <span className="text-sm font-medium">
                    {product.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleProduct(product)}
                    className="rounded p-1 text-red-600"
                    aria-label={`Remove ${product.name}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="max-h-72 space-y-2 overflow-y-auto">
            {isProductsLoading && (
              <p className="text-sm text-gray-500">Loading products...</p>
            )}

            {isProductsError && (
              <p className="text-sm text-red-600">
                Products load aagala. Try again.
              </p>
            )}

            {!isProductsLoading &&
              !isProductsError &&
              products.length === 0 && (
                <p className="text-sm text-gray-500">
                  Products edhuvum kidaikkala.
                </p>
              )}

            {products.map((product) => {
              const selected = taggedProducts.some(
                (item) => item._id === product._id
              );

              const image = Array.isArray(product.images)
                ? product.images[0]
                : product.images;

              return (
                <button
                  type="button"
                  key={product._id}
                  onClick={() => toggleProduct(product)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-100">
                      <Package size={22} />
                    </div>
                  )}

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {product.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      ₹{product.price}
                    </span>
                  </span>

                  <span className="text-sm font-medium text-blue-600">
                    {selected ? "Selected ✓" : "Select +"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {createPostError && (
          <p className="text-sm text-red-600">
            {createPostError.message || "Post create panna mudiyala."}
          </p>
        )}

        <button
          type="submit"
          disabled={isCreatingPost}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreatingPost ? "Sharing..." : "Share Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
