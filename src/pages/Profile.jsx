import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Grid3X3,
  UserRound,
  Pencil,
  LoaderCircle,
  ImagePlus,
  LogOut
} from "lucide-react";

import {useNavigate, useParams } from "react-router-dom";
import usePosts from "../hooks/usePosts.js";
import useProfile from "../hooks/useProfile.js";
import useFollow from "../hooks/useFollow.js";
import useUserConnections from "../hooks/useUserConnections.js";
import Modal from "../components/common/Modal.jsx";
import ProfilePostModal from "../components/profile/ProfilePostModal.jsx";
import { uploadAvatar } from "../services/profile.service.js";
import useAuth from "../hooks/useAuth.js";

const Profile = () => {
const { user,setUser, logout } = useAuth();
const { userId: profileUserId } = useParams();

const currentUserId = user?._id ?? user?.id;

const isOwnProfile = profileUserId
  ? String(currentUserId) === String(profileUserId)
  : true;

const userId = profileUserId ?? currentUserId;

  const {
    profile,
    isLoading: isProfileLoading,
    isError,
    refetch,
    updateProfile,
    isUpdating,
  } = useProfile(userId);

  const {
  follow,
  unfollow,
  isFollowingLoading,
} = useFollow(userId);



const {
    posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    updatePost,
    deletePost,
} = usePosts({ page: 1, limit: 100 });

const [selectedPost, setSelectedPost] = useState(null);

const [isEditOpen, setIsEditOpen] = useState(false);
const [name, setName] = useState("");
const [bio, setBio] = useState("");
const [formError, setFormError] = useState("");

const [avatarFile, setAvatarFile] = useState(null);
const [avatarPreview, setAvatarPreview] = useState("");
const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
const fileInputRef = useRef(null);
const [uploadProgress, setUploadProgress] = useState(0);

const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

useEffect(() => {
  return () => {
    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
  };
}, [avatarPreview]);

  const isFollowing = Boolean(profile?.isFollowing);
  const currentProfile = isOwnProfile ? (profile ?? user) : profile;

  const navigate = useNavigate();
const [activeConnections, setActiveConnections] = useState(null);

const {
  users: connectionUsers,
  isLoading: isConnectionsLoading,
  isError: isConnectionsError,
  refetch: refetchConnections,
} = useUserConnections(
  userId,
  activeConnections,
  Boolean(activeConnections)
);

const closeConnectionsModal = () => setActiveConnections(null);

const openUserProfile = (person) => {
  const personId = person?._id ?? person?.id;

  if (!personId) return;

  closeConnectionsModal();
  navigate(`/profile/${personId}`);
};

const handleAvatarChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setFormError("Please select a valid image.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setFormError("Image size must be less than 5 MB.");
    return;
  }

  setFormError("");
  setAvatarFile(file);
  setAvatarPreview(URL.createObjectURL(file));
};

  const userPosts = useMemo(() => {
    if (!userId || !Array.isArray(posts)) return [];

    return posts.filter((post) => {
      const authorId = post.author?._id ?? post.author?.id;
      return String(authorId) === String(userId);
    });
  }, [posts, userId]);

  const openEditModal = () => {
    setName(currentProfile?.name ?? "");
    setBio(currentProfile?.bio ?? "");
    setFormError("");
    setIsEditOpen(true);
  };

 const handleUpdatePost = async (postId, payload) => {
  const response = await updatePost({ postId, payload });

  const updatedPost = response?.post ?? response?.data?.post;

  if (updatedPost) {
    setSelectedPost(updatedPost);
  } else {
    setSelectedPost((previous) =>
      previous?._id === postId
        ? {
            ...previous,
            content: payload.content,
            taggedProducts: payload.taggedProducts,
            images: payload.images ?? previous.images,
          }
        : previous
    );
  }
};

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    setSelectedPost(null);
  };


  const handleFollowToggle = async () => {
  try {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }

    await refetch();
  } catch (error) {
    console.error(
      "Follow action failed:",
      error?.response?.data?.message || error.message
    );
  }
};


const handleUpdateProfile = async (event) => {
  event.preventDefault();
  setFormError("");

  if (!name.trim()) {
    setFormError("Name is required.");
    return;
  }

  try {
    let updatedUser = null;

    // Upload avatar first, if selected
    if (avatarFile) {
      setIsUploadingAvatar(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await uploadAvatar(
          formData,
          setUploadProgress
        );

        updatedUser =
          avatarResponse?.user ??
          avatarResponse?.data?.user ??
          avatarResponse?.data?.data?.user ??
          null;
      } finally {
        setIsUploadingAvatar(false);
      }
    }

    // Update name and bio
    const profileResponse = await updateProfile({
      name: name.trim(),
      bio: bio.trim(),
    });

    updatedUser =
      profileResponse?.user ??
      profileResponse?.data?.user ??
      profileResponse?.data?.data?.user ??
      updatedUser;

    // Update local auth user
    if (updatedUser) {
      setUser((previousUser) => ({
        ...previousUser,
        ...updatedUser,
      }));
    } else {
      // Response shape may not include user; update visible fields locally
      setUser((previousUser) => ({
        ...previousUser,
        name: name.trim(),
        bio: bio.trim(),
      }));
    }

    // Close modal after successful save
    setAvatarFile(null);
    setAvatarPreview("");
    setIsEditOpen(false);

    // Refresh profile separately; refresh failure should not undo save success
    try {
      await refetch();
    } catch (refreshError) {
      console.error("Profile refresh failed:", refreshError);
    }
  } catch (error) {
    console.error("Profile update failed:", {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });

    setFormError(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to update your profile. Please try again."
    );
  } finally {
    setIsUploadingAvatar(false);
  }
};


  if (!userId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  if (isProfileLoading && !currentProfile) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="animate-spin text-indigo-600" size={28} />
      </div>
    );
  }

  if (isError && !currentProfile) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Failed to load profile.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Profile header */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex justify-center sm:justify-start">
              {currentProfile?.avatar ? (
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name || "Profile"}
                  className="h-28 w-28 rounded-full border-4 border-indigo-50 object-cover sm:h-32 sm:w-32"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 sm:h-32 sm:w-32">
                  <UserRound size={52} className="text-indigo-400" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">

              
<div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap">
  <h1 className="wrap-break-word text-2xl font-bold text-gray-900">
    {currentProfile?.name || "User"}
  </h1>

  {isOwnProfile ? (
    <>
    <button
      type="button"
      onClick={openEditModal}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <Pencil size={16} />
      Edit Profile
    </button>
    
<button
  type="button"
    onClick={() => setShowLogoutConfirm(true)}
  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
>
  <LogOut size={16} />
  Logout
</button>

      </>
    
  ) : (
    <button
      type="button"
      onClick={handleFollowToggle}
      disabled={isFollowingLoading}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
        isFollowing
          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {isFollowingLoading
        ? "Please wait..."
        : isFollowing
          ? "Following"
          : "Follow"}
    </button>
  )}
</div>


            
<div className="mt-5 flex justify-center gap-7 sm:justify-start sm:gap-10">
  <div>
    <p className="text-lg font-bold text-gray-900">
      {userPosts.length}
    </p>
    <p className="text-sm text-gray-500">Posts</p>
  </div>

  <button
    type="button"
    onClick={() => setActiveConnections("followers")}
    className="text-left transition hover:opacity-70"
  >
    <p className="text-lg font-bold text-gray-900">
      {currentProfile?.followersCount ?? 0}
    </p>
    <p className="text-sm text-gray-500">Followers</p>
  </button>

  <button
    type="button"
    onClick={() => setActiveConnections("following")}
    className="text-left transition hover:opacity-70"
  >
    <p className="text-lg font-bold text-gray-900">
      {currentProfile?.followingCount ?? 0}
    </p>
    <p className="text-sm text-gray-500">Following</p>
  </button>
</div>


              {currentProfile?.bio && (
                <p className="mt-5 whitespace-pre-wrap text-sm text-gray-700">
                  {currentProfile.bio}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Posts section */}
        <section className="mt-8">
          <div className="mb-5 flex items-center gap-2 border-b border-gray-200 pb-3">
            <Grid3X3 size={19} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Your Posts</h2>
          </div>

          {isPostsLoading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading posts...
            </div>
          ) : isPostsError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-600">Failed to load posts.</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <Camera size={34} className="mx-auto text-gray-400" />
              <h3 className="mt-3 font-semibold text-gray-800">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your posts will appear here when you share them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {userPosts.map((post) => {
                const firstImage = post.images?.[0];
                const imageUrl =
                  typeof firstImage === "string" ? firstImage : firstImage?.url;

                return (
                  <button
                    key={post._id ?? post.id}
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    aria-label="Open post"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white text-left"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Post"
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 p-4">
                        <p className="line-clamp-5 text-center text-sm text-gray-700">
                          {post.content || "Post"}
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      <span>♥ {post.likesCount ?? 0}</span>
                      <span>💬 {post.commentsCount ?? 0}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>


      
<Modal
  isOpen={Boolean(activeConnections)}
  onClose={closeConnectionsModal}
  title={
    activeConnections === "followers"
      ? "Followers"
      : "Following"
  }
>
  {isConnectionsLoading ? (
    <div className="flex justify-center py-8">
      <LoaderCircle
        size={26}
        className="animate-spin text-indigo-600"
      />
    </div>
  ) : isConnectionsError ? (
    <div className="py-6 text-center">
      <p className="text-sm text-red-600">
        Failed to load users.
      </p>

      <button
        type="button"
        onClick={() => refetchConnections()}
        className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
      >
        Try again
      </button>
    </div>
  ) : connectionUsers.length === 0 ? (
    <p className="py-8 text-center text-sm text-gray-500">
      {activeConnections === "followers"
        ? "No followers yet."
        : "Not following anyone yet."}
    </p>
  ) : (
    <div className="space-y-3">
      {connectionUsers.map((person) => (
        <button
          key={person._id ?? person.id}
          type="button"
          onClick={() => openUserProfile(person)}
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-gray-50"
        >
          {person.avatar ? (
            <img
              src={person.avatar}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50">
              <UserRound
                size={22}
                className="text-indigo-500"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {person.name || "User"}
            </p>

            {person.bio && (
              <p className="truncate text-xs text-gray-500">
                {person.bio}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  )}
</Modal>


      <ProfilePostModal
        post={selectedPost}
        isOwnProfile={isOwnProfile}
        onClose={() => setSelectedPost(null)}
        onUpdate={handleUpdatePost}
        onDelete={handleDeletePost}
      />

      {/* Edit profile modal */}
      {isOwnProfile && isEditOpen && (
        <Modal
  isOpen={isOwnProfile && isEditOpen}
  onClose={() => {
    if (isUpdating || isUploadingAvatar) return;

    setIsEditOpen(false);
    setAvatarFile(null);
    setAvatarPreview("");
    setFormError("");
  }}
  title="Edit Profile"
>
  <form onSubmit={handleUpdateProfile} className="space-y-5">
    {/* Avatar */}
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {avatarPreview || currentProfile?.avatar ? (
          <img
            src={avatarPreview || currentProfile.avatar}
            alt="Profile preview"
            className="h-24 w-24 rounded-full border-4 border-indigo-50 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
            <UserRound size={40} className="text-indigo-400" />
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-2 text-white shadow hover:bg-indigo-700"
          aria-label="Choose profile photo"
        >
          <Camera size={16} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        <ImagePlus size={16} />
        Change profile photo
      </button>
      {isUploadingAvatar && (
  <div
    className="w-full max-w-xs space-y-2"
    role="status"
    aria-live="polite"
  >
    <div className="flex items-center justify-between text-xs text-gray-600">
      <span>Uploading image...</span>
      <span>{uploadProgress}%</span>
    </div>

    <div
      className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
      role="progressbar"
      aria-label="Image upload progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={uploadProgress}
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-200"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
  </div>
)}

      <p className="text-xs text-gray-500">
        JPG, PNG or other image formats · Max 5 MB
      </p>
    </div>

    {/* Name */}
    <div>
      <label
        htmlFor="profile-name"
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        Name
      </label>

      <input
        id="profile-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={80}
        required
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>

    {/* Bio */}
    <div>
      <label
        htmlFor="profile-bio"
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        Bio
      </label>

      <textarea
        id="profile-bio"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        maxLength={300}
        rows={4}
        placeholder="Tell people about yourself..."
        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      <p className="mt-1 text-right text-xs text-gray-400">
        {bio.length}/300
      </p>
    </div>

    {formError && (
      <p role="alert" className="text-sm text-red-600">
        {formError}
      </p>
    )}

    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={() => setIsEditOpen(false)}
        disabled={isUpdating || isUploadingAvatar}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isUpdating || isUploadingAvatar || !name.trim()}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {(isUpdating || isUploadingAvatar) && (
          <LoaderCircle size={16} className="animate-spin" />
        )}

        {isUploadingAvatar
          ? "Uploading photo..."
          : isUpdating
            ? "Saving..."
            : "Save changes"}
      </button>
    </div>
  </form>
</Modal>
      )}

      {showLogoutConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <LogOut className="text-red-600" size={24} />
      </div>

      <h2 className="text-lg font-semibold text-gray-900">
        Confirm Logout
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Are you sure you want to logout from your account?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(false)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
};

export default Profile;
