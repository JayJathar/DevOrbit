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
]
export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ No JWT token found");
          setUser(null);
          return;
        }
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        console.log(" HOME USER RESPONSE:", data);
        if (response.ok && data.success) {
          setUser(data.user);
          console.log("HOME MONGODB USER:", data.user);
        } else {
          console.error("Failed to fetch Home user:", data.message);
          setUser(null);
        }
      } catch (error) {
        console.error("Home user fetch error:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchCurrentUser();
  }, []);
  const displayName =
    user?.fullname ||
    user?.fullName ||
    user?.name ||
    user?.displayName ||
    "User";
  const firstName = displayName;
  const userInitial =
    user?.fullname?.charAt(0)?.toUpperCase() ||
    user?.fullName?.charAt(0)?.toUpperCase() ||
    user?.name?.charAt(0)?.toUpperCase() ||
    "U";
  const [liked, setLiked] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [following, setFollowing] = useState(new Set());
  const [openComments, setOpenComments] = useState(new Set());
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [commentText, setCommentText] = useState({});
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
  const toggleLike = toggleSet(setLiked);
  const toggleSave = toggleSet(setSaved);
  const toggleFollow = toggleSet(setFollowing);
  const toggleComments = (postId) => {
    setOpenComments((previous) => {
      const next = new Set(previous);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };
  const handleCommentChange = (postId, value) => {
    setCommentText((previous) => ({
      ...previous,
      [postId]: value,
    }));
  };
  const handleAddComment = (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) {
      return;
    }
    const newComment = {
      id: `comment-${Date.now()}`,
      author: displayName,
      initial: userInitial,
      text,
      time: "now",
      mine: true,
    };
    setComments((previous) => ({
      ...previous,
      [postId]: [...(previous[postId] || []), newComment],
    }));
    setCommentText((previous) => ({
      ...previous,
      [postId]: "",
    }));
    setOpenComments((previous) => {
      const next = new Set(previous);
      next.add(postId);
      return next;
    });
  };
  const handleCommentKeyDown = (event, postId) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment(postId);
    }
  };
  const handleDeleteComment = (postId, commentId) => {
    setComments((previous) => ({
      ...previous,
      [postId]: (previous[postId] || []).filter(
        (comment) => comment.id !== commentId,
      ),
    }));
  };
  const getCommentCount = (item) => {
    const extraComments = comments[item.id]?.length || 0;

    return item.comments + extraComments;
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
            Welcome back, <span>{loadingUser ? "..." : firstName}</span>
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
      <section className="builders-section">
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
      </section>
      <div className="home-layout">
        <section className="feed">
          <div className="feed-heading">
            <div>
              <span className="section-kicker">YOUR ORBIT</span>
              <h2>Latest from the community</h2>
            </div>
            <button type="button" className="filter-button">
              For you
            </button>
          </div>
          <div className="feed-list">
            {FEED.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                liked={liked.has(item.id)}
                saved={saved.has(item.id)}
                comments={comments[item.id] || []}
                commentsOpen={openComments.has(item.id)}
                commentText={commentText[item.id] || ""}
                commentCount={getCommentCount(item)}
                currentUser={user}
                currentUserName={displayName}
                currentUserInitial={userInitial}
                onLike={() => toggleLike(item.id)}
                onSave={() => toggleSave(item.id)}
                onToggleComments={() => toggleComments(item.id)}
                onCommentChange={(value) => handleCommentChange(item.id, value)}
                onAddComment={() => handleAddComment(item.id)}
                onCommentKeyDown={(event) =>
                  handleCommentKeyDown(event, item.id)
                }
                onDeleteComment={(commentId) =>
                  handleDeleteComment(item.id, commentId)
                }
              />
            ))}
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
              {SUGGESTED.map((person) => {
                const isFollowing = following.has(person.id);
                return (
                  <div className="person" key={person.id}>
                    <div className="person-avatar">{person.initial}</div>
                    <div className="person-info">
                      <strong>{person.name}</strong>
                      <small>{person.role}</small>
                    </div>
                    <button
                      type="button"
                      className={`follow-button ${
                        isFollowing ? "following" : ""
                      }`}
                      onClick={() => toggleFollow(person.id)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="challenge-card">
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
          </div>
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
  saved,
  comments,
  commentsOpen,
  commentText,
  commentCount,
  currentUserInitial,
  onLike,
  onSave,
  onToggleComments,
  onCommentChange,
  onAddComment,
  onCommentKeyDown,
  onDeleteComment,
}) {
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
        <h3>{item.title}</h3>
        {item.body && <p>{item.body}</p>}
        {item.type === "project" && (
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
          aria-label={liked ? "Unlike post" : "Like post"}
        >
          {liked ? (
            <FavoriteRoundedIcon fontSize="small" />
          ) : (
            <FavoriteBorderRoundedIcon fontSize="small" />
          )}
          <span>{item.likes + (liked ? 1 : 0)}</span>
        </button>
        <button
          type="button"
          className={`post-action comment-action ${
            commentsOpen ? "active" : ""
          }`}
          onClick={onToggleComments}
          aria-label={commentsOpen ? "Hide comments" : "Show comments"}
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
                onKeyDown={onCommentKeyDown}
                placeholder="Write a comment..."
                maxLength={500}
              />
              <button
                type="button"
                onClick={onAddComment}
                disabled={!commentText.trim()}
                className={
                  commentText.trim()
                    ? "comment-submit active"
                    : "comment-submit"
                }
              >
                Post
              </button>
            </div>
          </div>
          <div className="comments-list">
            {comments.length === 0 ? (
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
                    {comment.mine && (
                      <button
                        type="button"
                        className="delete-comment"
                        onClick={() => onDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
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
