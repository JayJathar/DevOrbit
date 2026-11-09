import "./Home.css";
import { useEffect, useState } from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import Flares from "../Flares/Flares";

const LIVE_BUILDERS = [
  {
    id: 1,
    name: "Priya",
    initial: "P",
    lang: "React",
    live: true,
  },
  {
    id: 2,
    name: "Marco",
    initial: "M",
    lang: "Go",
    live: true,
  },
  {
    id: 3,
    name: "Ken",
    initial: "TS",
    lang: "TS",
    live: false,
  },
  {
    id: 4,
    name: "Aisha",
    initial: "A",
    lang: "Py",
    live: true,
  },
  {
    id: 5,
    name: "Theo",
    initial: "T",
    lang: "CSS",
    live: false,
  },
  {
    id: 6,
    name: "Nadia",
    initial: "N",
    lang: "Swift",
    live: true,
  },
];

const reactSnippet = [
  [
    { t: "kw", v: "const" },
    { t: "fn", v: " DevOrbit" },
    { t: "pl", v: " = " },
    { t: "fn", v: "createPlatform" },
    { t: "pl", v: "({" },
  ],
  [
    { t: "pl", v: "  community: " },
    { t: "str", v: '"developers"' },
    { t: "pl", v: "," },
  ],
  [
    { t: "pl", v: "  sharing: " },
    { t: "str", v: '"projects"' },
    { t: "pl", v: "," },
  ],
  [
    { t: "pl", v: "  orbit: " },
    { t: "bool", v: "true" },
  ],
  [{ t: "pl", v: "});" }],
];
const FEED = [
  {
    id: "f1",
    type: "project",
    author: "Priya Nair",
    username: "@priyanair",
    initial: "P",
    time: "2h",
    title: "Shipped a cleaner onboarding flow",
    body: "Three fewer taps to get from sign-up to your first project. Small UX changes, but a much better first experience.",
    tags: ["React", "UX", "Frontend"],
    likes: 128,
    comments: 14,
  },
  {
    id: "f2",
    type: "code",
    author: "Ken Osei",
    username: "@kenosei",
    initial: "K",
    time: "4h",
    title: "DevOrbit.tsx",
    lang: "TypeScript",
    code: reactSnippet,
    stars: 342,
    comments: 21,
  },
  {
    id: "f3",
    type: "text",
    author: "Theo Marsh",
    username: "@theomarsh",
    initial: "T",
    time: "5h",
    title: "Performance lesson",
    body: "Cut our bundle size by 38% simply by lazy-loading the chart library. Sometimes the fastest code is the code you don't ship yet.",
    tags: ["Performance", "React"],
    likes: 76,
    comments: 9,
  },
  {
    id: "f4",
    type: "project",
    author: "Marco Vitale",
    username: "@marcov",
    initial: "M",
    time: "7h",
    title: "Analytics dashboard",
    body: "Dark-mode pass is finally complete. Focused on hierarchy, spacing and accessible contrast instead of adding more decoration.",
    tags: ["Design", "Dashboard", "CSS"],
    likes: 203,
    comments: 27,
  },
  {
    id: "f5",
    type: "text",
    author: "Aisha Rahman",
    username: "@aisharahman",
    initial: "A",
    time: "1d",
    title: "What are you building?",
    body: "Looking for interesting side projects from the community. Drop your latest build below. I'd love to see what everyone is working on.",
    tags: ["Community", "Projects"],
    likes: 89,
    comments: 32,
  },
];

const INITIAL_COMMENTS = {
  f1: [
    {
      id: "c1",
      author: "Ken Osei",
      initial: "K",
      text: "The onboarding flow looks much cleaner now.",
      time: "1h",
      mine: false,
    },
    {
      id: "c2",
      author: "Mei Lin",
      initial: "M",
      text: "Three fewer taps makes a huge difference.",
      time: "45m",
      mine: false,
    },
  ],

  f2: [
    {
      id: "c3",
      author: "Priya Nair",
      initial: "P",
      text: "Love the way you structured this.",
      time: "2h",
      mine: false,
    },
  ],

  f3: [
    {
      id: "c4",
      author: "Diego Ruiz",
      initial: "D",
      text: "Lazy loading is such an underrated optimization.",
      time: "3h",
      mine: false,
    },
  ],

  f5: [
    {
      id: "c5",
      author: "Lena Voss",
      initial: "L",
      text: "Currently building a small developer analytics tool.",
      time: "20m",
      mine: false,
    },
  ],
};

const TRENDING = [
  {
    name: "React.js",
    posts: "2.4k",
    trend: "+18%",
  },
  {
    name: "Next.js",
    posts: "1.9k",
    trend: "+14%",
  },
  {
    name: "TypeScript",
    posts: "1.7k",
    trend: "+11%",
  },
  {
    name: "Node.js",
    posts: "1.3k",
    trend: "+8%",
  },
];

const SUGGESTED = [
  {
    id: "u1",
    name: "Lena Voss",
    username: "@lenavoss",
    initial: "L",
    role: "Systems Engineer",
  },
  {
    id: "u2",
    name: "Diego Ruiz",
    username: "@diegoruiz",
    initial: "D",
    role: "Design Engineer",
  },
  {
    id: "u3",
    name: "Mei Lin",
    username: "@meilin",
    initial: "M",
    role: "ML Researcher",
  },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [liked, setLiked] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [savingLike, setSavingLike] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [following, setFollowing] = useState(new Set());
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [savingFollow, setSavingFollow] = useState(new Set());
  const [openComments, setOpenComments] = useState(new Set());
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState(new Set());
  const [savingComment, setSavingComment] = useState(new Set());
  const [deletingComment, setDeletingComment] = useState(new Set());
  const [commentCounts, setCommentCounts] = useState({});
  const [savingReply, setSavingReply] = useState(new Set());

  const handleAddReply = async (postId, commentId, text) => {
    if (!text.trim() || savingReply.has(commentId)) {
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) return false;

      setSavingReply((previous) => new Set(previous).add(commentId));

      const response = await fetch(
        `http://localhost:5000/api/comments/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            parentComment: commentId,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        return false;
      }

      const newReply = {
        id: data.comment._id,
        author: data.comment.author?.fullname || displayName || "Developer",
        initial: userInitial,
        text: data.comment.text,
        time: "Just now",
        mine: true,
      };

      setComments((previous) => ({
        ...previous,
        [postId]: (previous[postId] || []).map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              }
            : comment,
        ),
      }));

      return true;
    } catch (error) {
      return false;
    } finally {
      setSavingReply((previous) => {
        const next = new Set(previous);
        next.delete(commentId);
        return next;
      });
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setLoadingUser(false);

          return;
        }

        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setUser(null);

          return;
        }

        /*
              Expected backend response:

              {
                success: true,
                user: {
                  _id: "...",
                  fullname: "Jay Jathar",
                  username: "Jay_Jathar",
                  email: "..."
                }
              }
            */

        const currentUser = data.user || data.data?.user || data.data || null;

        if (currentUser) {
          setUser(currentUser);
        } else {
          console.error("User data not found in response");

          setUser(null);
        }
      } catch (error) {
        console.error("HOME USER FETCH ERROR:", error);

        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setPosts([]);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/posts/following",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error("Failed to fetch following posts:", data.message);
          setPosts([]);
          setLikeCounts({});
          setCommentCounts({});
          return;
        }

        const fetchedPosts = data.posts || [];

        setPosts(fetchedPosts);

        const initialLikeCounts = {};

        fetchedPosts.forEach((post) => {
          initialLikeCounts[post._id] = post.likes?.length || 0;
        });

        setLikeCounts(initialLikeCounts);

        const countResults = await Promise.all(
          fetchedPosts.map(async (post) => {
            try {
              const res = await fetch(
                `http://localhost:5000/api/comments/${post._id}/comments`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              const commentData = await res.json();

              return {
                postId: post._id,
                count:
                  res.ok && commentData.success
                    ? (commentData.totalComments ??
                      commentData.comments?.length ??
                      0)
                    : 0,
              };
            } catch (error) {
              console.error("COMMENT COUNT ERROR:", error);
              return { postId: post._id, count: 0 };
            }
          }),
        );

        const counts = {};

        countResults.forEach(({ postId, count }) => {
          counts[postId] = count;
        });

        setCommentCounts(counts);
      } catch (error) {
        console.error("Following posts fetch error:", error);
        setPosts([]);
        setLikeCounts({});
        setCommentCounts({});
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!user?._id || posts.length === 0) {
      return;
    }

    const likedPostIds = new Set();

    posts.forEach((post) => {
      const postLikes = post.likes || [];

      const hasLiked = postLikes.some((like) => {
        const likeId = typeof like === "string" ? like : like?._id;

        return likeId?.toString() === user._id.toString();
      });

      if (hasLiked) {
        likedPostIds.add(post._id);
      }
    });

    setLiked(likedPostIds);
  }, [user, posts]);

  const displayName =
    user?.fullname || user?.fullName || user?.name || user?.displayName || "";

  const firstName = displayName ? displayName.trim().split(/\s+/)[0] : "";

  const userInitial = displayName?.charAt(0)?.toUpperCase() || "U";

  const toggleSet = (setter) => (id) => {
    setter((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const toggleSave = toggleSet(setSaved);

  const toggleComments = async (postId) => {
    if (openComments.has(postId)) {
      setOpenComments((previous) => {
        const next = new Set(previous);
        next.delete(postId);
        return next;
      });
      return;
    }

    setOpenComments((previous) => new Set(previous).add(postId));

    if (Object.prototype.hasOwnProperty.call(comments, postId)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      setLoadingComments((previous) => new Set(previous).add(postId));

      const response = await fetch(
        `http://localhost:5000/api/comments/${postId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(data.message);
        return;
      }

      const formattedComments = data.comments.map((comment) => ({
        id: comment._id,
        author: comment.author?.fullname || "Unknown User",
        initial: comment.author?.fullname?.charAt(0)?.toUpperCase() || "U",
        text: comment.text,
        time: new Date(comment.createdAt).toLocaleString(),
        mine: comment.author?._id === user?._id,

        // Fetch replies
        replies: (comment.replies || []).map((reply) => ({
          id: reply._id,
          author: reply.author?.fullname || "Unknown User",
          initial: reply.author?.fullname?.charAt(0)?.toUpperCase() || "U",
          text: reply.text,
          time: new Date(reply.createdAt).toLocaleString(),
          mine: reply.author?._id === user?._id,
        })),
      }));

      setComments((previous) => ({
        ...previous,
        [postId]: formattedComments,
      }));
    } catch (error) {
      console.error("GET COMMENTS ERROR:", error);
    } finally {
      setLoadingComments((previous) => {
        const next = new Set(previous);
        next.delete(postId);
        return next;
      });
    }
  };

  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No JWT token found");

        return;
      }

      if (savingLike.has(postId)) {
        return;
      }

      setSavingLike((previous) => {
        const next = new Set(previous);

        next.add(postId);

        return next;
      });

      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Like request failed:", data.message);

        return;
      }

      setLiked((previous) => {
        const next = new Set(previous);

        if (data.liked) {
          next.add(postId);
        } else {
          next.delete(postId);
        }

        return next;
      });

      setLikeCounts((previous) => ({
        ...previous,
        [postId]: data.likesCount,
      }));
    } catch (error) {
      console.error("LIKE ERROR:", error);
    } finally {
      setSavingLike((previous) => {
        const next = new Set(previous);

        next.delete(postId);

        return next;
      });
    }
  };

  const toggleFollow = async (targetUserId) => {
    const token = localStorage.getItem("token");

    if (!token || savingFollow.has(targetUserId)) {
      return;
    }

    const isFollowing = following.has(targetUserId);

    // Correct backend route
    const url = `http://localhost:5000/api/follow/${targetUserId}/${
      isFollowing ? "unfollow" : "follow"
    }`;

    setSavingFollow((prev) => new Set(prev).add(targetUserId));

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Follow action failed:", data.message);
        return;
      }

      // Update the button only after the API succeeds
      setFollowing((prev) => {
        const next = new Set(prev);

        if (isFollowing) {
          next.delete(targetUserId);
        } else {
          next.add(targetUserId);
        }

        return next;
      });
    } catch (error) {
      console.error("FOLLOW ERROR:", error);
    } finally {
      setSavingFollow((prev) => {
        const next = new Set(prev);
        next.delete(targetUserId);
        return next;
      });
    }
  };

  // Fetch suggested users
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        setLoadingSuggested(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/users/suggested",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();

        if (response.ok && data.success) {
          setSuggestedUsers(data.users || []);
        }
      } catch (error) {
        console.error("SUGGESTED FETCH ERROR:", error);
      } finally {
        setLoadingSuggested(false);
      }
    };

    fetchSuggested();
  }, []);

  // Initialize following from logged-in user
  useEffect(() => {
    if (!user?.following) return;
    const ids = user.following.map((f) => (typeof f === "string" ? f : f?._id));
    setFollowing(new Set(ids));
  }, [user]);

  const handleCommentChange = (postId, value) => {
    setCommentText((previous) => ({
      ...previous,
      [postId]: value,
    }));
  };
  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();

    if (!text || savingComment.has(postId)) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      setSavingComment((previous) => new Set(previous).add(postId));

      const response = await fetch(
        `http://localhost:5000/api/comments/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(data.message);
        return;
      }

      const newComment = {
        id: data.comment._id,
        author: data.comment.author?.fullname || displayName || "Developer",
        initial: userInitial,
        text: data.comment.text,
        time: "Just now",
        mine: true,
        replies: [],
      };

      setComments((previous) => ({
        ...previous,
        [postId]: [newComment, ...(previous[postId] || [])],
      }));

      // Increase count only once
      setCommentCounts((previous) => ({
        ...previous,
        [postId]: (previous[postId] || 0) + 1,
      }));

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));
    } catch (error) {
      console.error("ADD COMMENT ERROR:", error);
    } finally {
      setSavingComment((previous) => {
        const next = new Set(previous);
        next.delete(postId);
        return next;
      });
    }
  };

  const handleCommentKeyDown = (event, postId) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleAddComment(postId);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token || deletingComment.has(commentId)) return;

      setDeletingComment((previous) => new Set(previous).add(commentId));

      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Failed to delete comment:", data.message);
        return;
      }

      const isParentComment = (comments[postId] || []).some(
        (comment) => comment.id === commentId,
      );

      setComments((previous) => ({
        ...previous,
        [postId]: (previous[postId] || [])
          .filter((comment) => comment.id !== commentId)
          .map((comment) => ({
            ...comment,
            replies: (comment.replies || []).filter(
              (reply) => reply.id !== commentId,
            ),
          })),
      }));
      if (isParentComment) {
        setCommentCounts((previous) => ({
          ...previous,
          [postId]: Math.max((previous[postId] || 0) - 1, 0),
        }));
      }
    } catch (error) {
      console.error("DELETE COMMENT ERROR:", error);
    } finally {
      setDeletingComment((previous) => {
        const next = new Set(previous);
        next.delete(commentId);
        return next;
      });
    }
  };

  const getCommentCount = (item) => {
    return commentCounts[item.id] ?? comments[item.id]?.length ?? 0;
  };

  return (
    <main className="home-page">
      <div className="home-orbit home-orbit--one" />
      <div className="home-orbit home-orbit--two" />
      <header className="home-header">
        <div>
          <div className="home-eyebrow">
            <span className="eyebrow-line" />
            DEVORBIT
          </div>

          <h1>
            Welcome back,{" "}
            <span>{loadingUser ? "..." : firstName || "Developer"}</span>
          </h1>

          <p>
            Discover what developers are building and share what you're working
            on.
          </p>
        </div>

        <div className="home-header-actions">
          <div className="header-mini-stat">
            <CodeRoundedIcon fontSize="small" />

            <span>1,248 builders</span>
          </div>

          <div className="header-mini-stat">
            <span className="online-dot" />

            <span>86 building now</span>
          </div>
        </div>
      </header>

      <Flares displayName={displayName} userInitial={userInitial} />

      {/* ==================================================
              BUILDERS
          ================================================== */}

      {/* <section className="builders-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">ACTIVE NOW</span>

              <h2>Builders in orbit</h2>
            </div>

            <button type="button" className="text-button">
              View all
              <ArrowOutwardRoundedIcon fontSize="inherit" />
            </button>
          </div>

          <div className="builder-list">
            {LIVE_BUILDERS.map((builder) => (
              <div className="builder" key={builder.id}>
                <div className={`builder-avatar ${builder.live ? "live" : ""}`}>
                  <span>{builder.initial}</span>

                  {builder.live && <i />}
                </div>

                <strong>{builder.name}</strong>

                <small>{builder.lang}</small>
              </div>
            ))}
          </div>
        </section> */}

      <div className="home-layout">
        <section className="feed">
          <div className="feed-heading">
            <div>
              <span className="section-kicker">YOUR ORBIT</span>

              <h2>Posts from people you follow</h2>
            </div>

            <button type="button" className="filter-button">
              For you
            </button>
          </div>

          <div className="feed-list">
            {loadingPosts ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p>No posts yet. Be the first to share something!</p>
            ) : (
              posts.map((post) => {
                const item = {
                  id: post._id,
                  type: post.type,
                  author: post.author?.fullname || "Unknown User",

                  username: post.author?.username
                    ? `@${post.author.username}`
                    : "@user",

                  initial:
                    post.author?.fullname?.charAt(0)?.toUpperCase() || "U",

                  time: post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "now",

                  title: post.title || "",

                  body: post.content || "",

                  tags: post.tags || [],

                  image: post.image || "",

                  video: post.video || "",

                  projectUrl: post.projectUrl || "",

                  githubUrl: post.githubUrl || "",

                  lang: post.codeLang || "",

                  code:
                    post.type === "code"
                      ? (post.content || "").split("\n").map((line) => [
                          {
                            t: "pl",
                            v: line,
                          },
                        ])
                      : [],

                  likes: likeCounts[post._id] ?? post.likes?.length ?? 0,

                  comments: 0,
                };

                return (
                  <FeedCard
                    key={item.id}
                    item={item}
                    liked={liked.has(item.id)}
                    likeSaving={savingLike.has(item.id)}
                    onLike={() => toggleLike(item.id)}
                    saved={saved.has(item.id)}
                    onSave={() => toggleSave(item.id)}
                    comments={comments[item.id] || []}
                    commentsOpen={openComments.has(item.id)}
                    commentText={commentText[item.id] || ""}
                    commentCount={getCommentCount(item)}
                    loadingComments={loadingComments.has(item.id)}
                    savingComment={savingComment.has(item.id)}
                    deletingComment={deletingComment}
                    onToggleComments={() => toggleComments(item.id)}
                    onCommentChange={(value) =>
                      handleCommentChange(item.id, value)
                    }
                    onAddComment={() => handleAddComment(item.id)}
                    onCommentKeyDown={(event) =>
                      handleCommentKeyDown(event, item.id)
                    }
                    onDeleteComment={(commentId) =>
                      handleDeleteComment(item.id, commentId)
                    }
                    savingReply={savingReply}
                    onAddReply={(commentId, text) =>
                      handleAddReply(item.id, commentId, text)
                    }
                    currentUserInitial={userInitial}
                  />
                );
              })
            )}
          </div>
        </section>

        <aside className="home-right">
          <div className="side-card">
            <div className="side-card-header">
              <div>
                <span className="section-kicker">DISCOVER</span>

                <h3>Trending</h3>
              </div>

              <ArrowOutwardRoundedIcon fontSize="small" />
            </div>

            <div className="trend-list">
              {TRENDING.map((item, index) => (
                <div className="trend-item" key={item.name}>
                  <span className="trend-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="trend-info">
                    <strong>{item.name}</strong>

                    <small>{item.posts} posts</small>
                  </div>

                  <span className="trend-value">{item.trend}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="side-card">
            <div className="side-card-header">
              <div>
                <span className="section-kicker">PEOPLE</span>

                <h3>Who to follow</h3>
              </div>

              <PeopleOutlineRoundedIcon fontSize="small" />
            </div>

            <div className="people-list">
              {loadingSuggested ? (
                <p>Loading...</p>
              ) : suggestedUsers.length === 0 ? (
                <p>No suggestions right now.</p>
              ) : (
                suggestedUsers.map((person) => {
                  const isFollowing = following.has(person._id);

                  return (
                    <div className="person" key={person._id}>
                      <div className="person-avatar">
                        {person.fullname?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="person-info">
                        <strong>{person.fullname}</strong>
                        <small>@{person.username}</small>
                      </div>

                      <button
                        type="button"
                        className={`follow-button ${isFollowing ? "following" : ""}`}
                        onClick={() => toggleFollow(person._id)}
                        disabled={savingFollow.has(person._id)}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* <div className="challenge-card">
            <div className="challenge-orbit">
              <span />
            </div>

            <span className="section-kicker">WEEKLY CHALLENGE</span>

            <h3>Build something useful.</h3>

            <p>
              Create a keyboard-first command palette and share your solution
              with the community.
            </p>

            <button type="button">
              View challenge
              <ArrowOutwardRoundedIcon fontSize="small" />
            </button>
          </div> */}

          <div className="home-footer">
            <span>DevOrbit</span>

            <span>·</span>

            <span>Built for builders</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FeedCard({
  item,
  liked,
  likeSaving,
  saved,
  comments,
  commentsOpen,
  commentText,
  commentCount,
  currentUserInitial,
  loadingComments,
  savingComment,
  savingReply,
  deletingComment,
  onAddReply,
  onLike,
  onSave,
  onToggleComments,
  onCommentChange,
  onAddComment,
  onCommentKeyDown,
  onDeleteComment,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState({});

  const getMediaUrl = (media) => {
    if (!media) {
      return "";
    }

    if (
      media.startsWith("http://") ||
      media.startsWith("https://") ||
      media.startsWith("blob:")
    ) {
      return media;
    }

    if (media.startsWith("/")) {
      return `http://localhost:5000${media}`;
    }

    return `http://localhost:5000/${media}`;
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-avatar">{item.initial}</div>

        <div className="post-author">
          <strong>{item.author}</strong>

          <span>
            {item.username} · {item.time}
          </span>
        </div>

        <button type="button" className="more-button">
          <MoreHorizRoundedIcon />
        </button>
      </div>

      <div className="post-content">
        {item.title && <h3>{item.title}</h3>}
        {item.body && <p>{item.body}</p>}

        {item.type === "text" && item.image && (
          <div className="post-image-wrapper">
            <img
              src={getMediaUrl(item.image)}
              alt={item.title || "Post image"}
              className="post-image"
              onError={(event) => {
                console.error("IMAGE FAILED TO LOAD:", event.currentTarget.src);
              }}
            />
          </div>
        )}

        {item.type === "project" && (
          <>
            {item.video ? (
              <div className="post-video-wrapper">
                <video
                  src={getMediaUrl(item.video)}
                  className="post-video"
                  controls
                  playsInline
                  onError={() => {
                    console.error("VIDEO FAILED TO LOAD:", item.video);
                  }}
                />
              </div>
            ) : (
              <div className="project-preview">
                <div className="project-preview-top">
                  <span className="project-logo">
                    <span />
                  </span>

                  <span className="project-window-title">project-preview</span>

                  <span className="project-window-dot" />
                </div>

                <div className="project-preview-body">
                  <div className="project-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="project-orbit">
                    <div />
                  </div>
                </div>

                <div className="project-preview-footer">
                  <span>React</span>

                  <span>•</span>

                  <span>Open source</span>
                </div>
              </div>
            )}
          </>
        )}

        {item.type === "code" && (
          <div className="code-card">
            <div className="code-header">
              <div className="window-dots">
                <i />
                <i />
                <i />
              </div>

              <span>
                <TerminalRoundedIcon fontSize="inherit" />

                {item.title}
              </span>

              <small>{item.lang}</small>
            </div>

            <div className="code-body">
              {item.code.map((line, index) => (
                <div className="code-line" key={index}>
                  <span className="line-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <code>
                    {line.map((token, tokenIndex) => (
                      <span
                        key={tokenIndex}
                        className={`token token-${token.t}`}
                      >
                        {token.v}
                      </span>
                    ))}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="post-tags">
          {item.tags?.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={`post-action like-action ${liked ? "liked" : ""}`}
          onClick={onLike}
          disabled={likeSaving}
          aria-label={liked ? "Unlike post" : "Like post"}
        >
          {liked ? (
            <FavoriteRoundedIcon fontSize="small" />
          ) : (
            <FavoriteBorderRoundedIcon fontSize="small" />
          )}

          <span>{item.likes}</span>
        </button>

        <button
          type="button"
          className="post-action comment-action"
          onClick={onToggleComments}
        >
          <ChatBubbleOutlineRoundedIcon fontSize="small" />
          <span>{commentCount}</span>
        </button>

        <button
          type="button"
          className={`post-action save-action ${saved ? "saved" : ""}`}
          onClick={onSave}
          aria-label={saved ? "Unsave post" : "Save post"}
        >
          {saved ? (
            <PushPinRoundedIcon fontSize="small" />
          ) : (
            <BookmarkBorderRoundedIcon fontSize="small" />
          )}

          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {commentsOpen && (
        <div className="comments-section">
          <div className="comment-input-wrapper">
            <div className="comment-user-avatar">{currentUserInitial}</div>

            <div className="comment-input-box">
              <input
                type="text"
                value={commentText}
                onChange={(event) => onCommentChange(event.target.value)}
                onKeyDown={(event) => onCommentKeyDown(event)}
                placeholder="Write a comment..."
                maxLength={500}
              />

              <button
                type="button"
                onClick={onAddComment}
                disabled={!commentText.trim() || savingComment}
                className={
                  commentText.trim()
                    ? "comment-submit active"
                    : "comment-submit"
                }
              >
                {savingComment ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          <div className="comments-list">
            {loadingComments ? (
              <p>Loading comments...</p>
            ) : comments.length === 0 ? (
              <div className="no-comments">
                <ChatBubbleOutlineRoundedIcon />
                <span>No comments yet. Start the conversation.</span>
              </div>
            ) : (
              comments.map((comment) => (
                <div className="comment" key={comment.id}>
                  <div className="comment-avatar">{comment.initial}</div>

                  <div className="comment-content">
                    <div className="comment-meta">
                      <strong>{comment.author}</strong>
                      <span>{comment.time}</span>
                    </div>

                    <p>{comment.text}</p>

                    <div className="comment-actions">
                      <button
                        type="button"
                        className="reply-button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();

                          setReplyingTo((previous) =>
                            previous === comment.id ? null : comment.id,
                          );
                        }}
                      >
                        Reply
                      </button>

                      {comment.mine && (
                        <button
                          type="button"
                          className="delete-comment"
                          disabled={deletingComment.has(comment.id)}
                          onClick={() => onDeleteComment(comment.id)}
                        >
                          {deletingComment.has(comment.id)
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>

                    {replyingTo === comment.id && (
                      <div className="reply-input-wrapper">
                        <input
                          type="text"
                          placeholder={`Reply to ${comment.author}...`}
                          value={replyText[comment.id] || ""}
                          onChange={(event) =>
                            setReplyText((previous) => ({
                              ...previous,
                              [comment.id]: event.target.value,
                            }))
                          }
                          onKeyDown={async (event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();

                              const text = replyText[comment.id] || "";

                              const success = await onAddReply(
                                comment.id,
                                text,
                              );

                              if (success) {
                                setReplyText((previous) => ({
                                  ...previous,
                                  [comment.id]: "",
                                }));
                                setReplyingTo(null);
                              }
                            }
                          }}
                          maxLength={500}
                        />

                        <button
                          type="button"
                          disabled={
                            !replyText[comment.id]?.trim() ||
                            savingReply.has(comment.id)
                          }
                          onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            const text = replyText[comment.id] || "";

                            const success = await onAddReply(comment.id, text);

                            if (success) {
                              setReplyText((previous) => ({
                                ...previous,
                                [comment.id]: "",
                              }));

                              setReplyingTo(null);
                            }
                          }}
                        >
                          {savingReply.has(comment.id) ? "Sending..." : "Reply"}
                        </button>
                      </div>
                    )}

                    {comment.replies?.length > 0 && (
                      <div className="replies-list">
                        {comment.replies.map((reply) => (
                          <div className="reply-item" key={reply.id}>
                            <div className="comment-avatar">
                              {reply.initial}
                            </div>

                            <div className="reply-content">
                              <div className="comment-meta">
                                <strong>{reply.author}</strong>
                                <span>{reply.time}</span>
                              </div>

                              <p>{reply.text}</p>

                              <div className="comment-actions">
                                {reply.mine && (
                                  <button
                                    type="button"
                                    className="delete-comment"
                                    disabled={deletingComment.has(reply.id)}
                                    onClick={() => onDeleteComment(reply.id)}
                                  >
                                    {deletingComment.has(reply.id)
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
}
