
import {
  Heart,
  MessageCircle,
  UserRound,
  Bookmark,
  ShoppingBag,
  Tag,
  Share2
} from "lucide-react";
import {useState} from "react"
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateHelper.js";
import PostComments from "./PostComments.jsx";

const PostCard = ({
  post,
  toggleLike,
  isLiking,
  toggleSave,
  isSaving,
}) => {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);

  const postId = post._id;
  const author = post.author;
  const isLiked = post.isLiked ?? false;
  const likesCount = post.likesCount ?? 0;
  const commentsCount = post.commentsCount ?? 0;
  const isSaved = post.isSaved ?? false;


  const taggedProducts = Array.isArray(post.taggedProducts)
    ? post.taggedProducts
    : [];

  const handleLike = async () => {
    try {
      await toggleLike({ postId, liked: isLiked });
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  const handleSave = async () => {
    try {
      await toggleSave({ postId, saved: isSaved });
    } catch (error) {
      console.error("Failed to update saved post:", error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  

const handleShare = async () => {
  if (isSharing) return;

  // Public post URL
  const postUrl = `${window.location.origin}/posts/${postId}`;

  setIsSharing(true);

  try {
    if (typeof navigator.share === "function") {
      await navigator.share({
        title: "Check out this post",
        text: post.content || "Check out this post on SocialShop!",
        url: postUrl,
      });
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(postUrl);
      window.alert("Post link copied!");
      return;
    }

    window.prompt("Copy this post link:", postUrl);
  } catch (error) {
    if (error.name === "AbortError") return;

    console.error("Unable to share post:", error);
    window.prompt("Copy this post link:", postUrl);
  } finally {
    setIsSharing(false);
  }
};


  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Author */}
      <div className="flex items-center gap-3 p-4">
        {author?.avatar ? (
          <img
            src={author.avatar}
            alt={author.name || "Author"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <UserRound size={20} className="text-gray-500" />
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-900">
            {author?.name || "SocialShop User"}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Post images */}
     {post.images?.length > 0 && (
  <div className="relative w-full overflow-hidden">
    <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
      {post.images.map((image, index) => {
        const imageUrl =
          typeof image === "string" ? image : image?.url;

        if (!imageUrl) return null;

        return (
          <div
            key={`${imageUrl}-${index}`}
            className="w-full shrink-0 snap-center"
          >
            <img
              src={imageUrl}
              alt={`Post image ${index + 1}`}
              loading="lazy"
              className="h-100 w-full bg-gray-100 object-contain"
            />
          </div>
        );
      })}
    </div>
  </div>
)}

      {/* Post content */}
      {post.content && (
        <div className="px-4 pt-4">
          <p className="whitespace-pre-wrap wrap-break-word text-gray-800">
            {post.content}
          </p>
        </div>
      )}

      {/* Tagged products */}
      {taggedProducts.length > 0 && (
        <section className="px-4 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Tag size={17} className="text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-800">
              Tagged Products
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {taggedProducts.map((product) => {
              if (!product?._id) return null;

              const productImage = Array.isArray(product.images)
                ? product.images[0]
                : product.images;

              return (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => handleProductClick(product._id)}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50"
                >
                  {productImage ? (
                    <img
                      src={
                        typeof productImage === "string"
                          ? productImage
                          : productImage?.url
                      }
                      alt={product.name || "Product"}
                      loading="lazy"
                      className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <ShoppingBag
                        size={26}
                        className="text-gray-400"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-gray-900">
                      {product.name || "Product"}
                    </p>

                    {product.price != null && (
                      <p className="mt-1 font-bold text-gray-900">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>
                    )}

                    <span className="mt-2 inline-block text-xs font-medium text-indigo-600">
                      View Product →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Like, comments and save */}
      <div className="flex items-center gap-5 p-4">
        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          aria-label={isLiked ? "Unlike post" : "Like post"}
          aria-pressed={isLiked}
          className="inline-flex items-center gap-2 rounded-lg py-2 text-sm transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Heart
            size={21}
            className={
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }
          />
          <span>{likesCount}</span>
        </button>

        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle size={20} />
          <span>{commentsCount}</span>
        </div>
            
<button
  type="button"
  onClick={handleShare}
  disabled={isSharing}
  aria-label="Share post"
  className="inline-flex items-center gap-2 rounded-lg py-2 text-sm text-gray-600 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
>
  <Share2 size={21} />
  <span>{isSharing ? "Sharing..." : "Share"}</span>
</button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          aria-label={isSaved ? "Unsave post" : "Save post"}
          aria-pressed={isSaved}
          className="inline-flex items-center gap-2 rounded-lg py-2 text-sm text-gray-600 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Bookmark
            size={21}
            className={
              isSaved
                ? "fill-indigo-600 text-indigo-600"
                : "text-gray-600"
            }
          />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>

      <PostComments postId={postId} />
    </article>
  );
};

export default PostCard;
