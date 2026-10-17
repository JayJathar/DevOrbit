import "./CreatePost.css";
import { useEffect, useState } from "react";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import InsertPhotoRoundedIcon from "@mui/icons-material/InsertPhotoRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

const POST_TYPES = [
  {
    id: "text",
    label: "Post",
    description: "Share an idea, lesson, update, or discovery.",
    icon: ArticleRoundedIcon,
  },
  {
    id: "project",
    label: "Project",
    description: "Show the product, app, or experience you built.",
    icon: RocketLaunchRoundedIcon,
  },
  {
    id: "code",
    label: "Code",
    description: "Share a useful snippet and explain how it works.",
    icon: CodeRoundedIcon,
  },
];

const CODE_LANGS = ["JavaScript", "TypeScript", "Python", "Rust", "Go", "CSS"];

const CreatePost = () => {
  const [postType, setPostType] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [projectUrl, setProjectUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const [projectImage, setProjectImage] = useState(null);
  const [projectVideo, setProjectVideo] = useState(null);
  const [textImage, setTextImage] = useState(null);

  const [codeLang, setCodeLang] = useState("JavaScript");

  const [autosave, setAutosave] = useState("All changes saved");

  const selectedPostType = POST_TYPES.find((type) => type.id === postType);

  const SelectedTypeIcon = selectedPostType?.icon;

  useEffect(() => {
    if (!postType) return;

    setAutosave("Saving...");

    const timer = setTimeout(() => {
      setAutosave("All changes saved");
    }, 700);

    return () => clearTimeout(timer);
  }, [
    postType,
    title,
    content,
    tags,
    projectUrl,
    githubUrl,
    codeLang,
    projectImage,
    projectVideo,
    textImage,
  ]);

  const handleAddTag = (event) => {
    if (event.key !== "Enter" && event.key !== ",") return;

    event.preventDefault();

    const newTag = tagInput.trim().replace(/^#/, "");

    if (!newTag) return;

    if (!tags.includes(newTag) && tags.length < 8) {
      setTags((prev) => [...prev, newTag]);
    }

    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProjectImage({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProjectVideo({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const handleTextImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setTextImage({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const getDomain = (url) => {
    if (!url) return "";

    try {
      return new URL(
        url.startsWith("http") ? url : `https://${url}`,
      ).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setTagInput("");
    setTags([]);
    setProjectUrl("");
    setGithubUrl("");
    setProjectImage(null);
    setProjectVideo(null);
    setTextImage(null);
    setCodeLang("JavaScript");
    setAutosave("All changes saved");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const postData = {
      type: postType,
      title,
      content,
      tags,
      projectUrl,
      githubUrl,
      codeLang,
      image: projectImage?.file || textImage?.file || null,
      video: projectVideo?.file || null,
    };

    console.log("DevOrbit post:", postData);

    clearForm();
  };

  const getTypeDescription = () => {
    if (postType === "text") {
      return "Write something worth sharing.";
    }

    if (postType === "project") {
      return "Show what you built.";
    }

    if (postType === "code") {
      return "Share code worth exploring.";
    }

    return "Choose a format and start creating.";
  };

  if (!postType) {
    return (
      <main className="cp-page">
        <div className="cp-orbit cp-orbit-one" />
        <div className="cp-orbit cp-orbit-two" />

        <div className="cp-shell">
          <header className="cp-page-header">
            <div className="cp-header-copy">
              <span className="cp-eyebrow">
                <span className="cp-eyebrow-dot" />
                CREATE / DEVORBIT
              </span>

              <h1>Create something worth sharing.</h1>

              <p>
                Share what you think, what you built, or the code behind it.
                Choose a format and make it part of the developer orbit.
              </p>
            </div>

            <div className="cp-status-pill">
              <span />
              Ready to create
            </div>
          </header>

          <section className="cp-create-screen">
            <div className="cp-create-heading">
              <span>SELECT FORMAT</span>
              <small>Choose how you want to contribute.</small>
            </div>

            <div className="cp-create-options">
              {POST_TYPES.map(
                ({ id, label, description, icon: Icon }, index) => (
                  <button
                    key={id}
                    type="button"
                    className="cp-create-option"
                    onClick={() => setPostType(id)}
                  >
                    <div className="cp-create-option-index">0{index + 1}</div>

                    <div className="cp-create-option-icon">
                      <span className="cp-create-option-orbit" />
                      <Icon />
                    </div>

                    <div className="cp-create-option-content">
                      <div className="cp-create-option-title">
                        <strong>{label}</strong>

                        <span>
                          {id === "text"
                            ? "DISCUSSION"
                            : id === "project"
                              ? "BUILD"
                              : "SNIPPET"}
                        </span>
                      </div>

                      <p>{description}</p>
                    </div>

                    <div className="cp-create-option-arrow">
                      <ArrowOutwardRoundedIcon />
                    </div>
                  </button>
                ),
              )}
            </div>

            <div className="cp-create-footer-note">
              <PublicRoundedIcon />
              <span>Your post will appear in the DevOrbit community feed.</span>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="cp-page">
      <div className="cp-orbit cp-orbit-one" />
      <div className="cp-orbit cp-orbit-two" />

      <div className="cp-shell">
        <div className="cp-topbar">
          <button
            className="cp-back-button"
            type="button"
            onClick={() => setPostType(null)}
          >
            <ArrowBackRoundedIcon />
            <span>Create</span>
          </button>

          <div className="cp-topbar-center">
            <span className="cp-topbar-type-icon">
              {SelectedTypeIcon && <SelectedTypeIcon />}
            </span>

            <span>{selectedPostType?.label}</span>
          </div>

          <div className="cp-status-pill cp-status-small">
            <span />
            {autosave}
          </div>
        </div>

        <header className="cp-page-header cp-composer-header">
          <div className="cp-header-copy">
            <span className="cp-eyebrow">
              <span className="cp-eyebrow-dot" />
              {selectedPostType?.label.toUpperCase()} / DEVORBIT
            </span>

            <h1>{getTypeDescription()}</h1>

            <p>
              Keep it useful, authentic, and worth another developer's time.
            </p>
          </div>
        </header>

        <div className="cp-workspace">
          <form className="cp-editor-panel" onSubmit={handleSubmit}>
            <div className="cp-panel-top">
              <div>
                <span className="cp-panel-label">EDITOR</span>

                <div className="cp-panel-title">
                  <span className="cp-selected-type-icon">
                    {SelectedTypeIcon && <SelectedTypeIcon />}
                  </span>

                  <strong>{selectedPostType?.label}</strong>
                </div>
              </div>

              <button
                type="button"
                className="cp-change-type"
                onClick={() => setPostType(null)}
              >
                Change type
              </button>
            </div>

            <div className="cp-editor-body">
              {postType === "text" && (
                <>
                  <div className="cp-field-section">
                    <label>YOUR THOUGHT</label>

                    <div className="cp-field-card cp-main-field">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={8}
                      />

                      <div className="cp-field-bottom">
                        <span>{content.length} characters</span>

                        <span className="cp-field-hint">Markdown friendly</span>
                      </div>
                    </div>
                  </div>

                  <div className="cp-field-section">
                    <label>IMAGE</label>

                    {!textImage ? (
                      <label className="cp-media-drop">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTextImageChange}
                        />

                        <span className="cp-media-icon">
                          <InsertPhotoRoundedIcon />
                        </span>

                        <span className="cp-media-copy">
                          <strong>Add an image</strong>
                          <small>JPG, PNG or WEBP</small>
                        </span>

                        <span className="cp-media-add">+</span>
                      </label>
                    ) : (
                      <div className="cp-media-preview">
                        <img src={textImage.url} alt="Post preview" />

                        <button
                          type="button"
                          onClick={() => setTextImage(null)}
                        >
                          <CloseRoundedIcon />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {postType === "project" && (
                <>
                  <div className="cp-field-section">
                    <label>PROJECT TITLE</label>

                    <div className="cp-field-card">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. DevOrbit — Developer Social Platform"
                      />
                    </div>
                  </div>

                  <div className="cp-field-section">
                    <label>DESCRIPTION</label>

                    <div className="cp-field-card cp-main-field">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell developers what you built, why you built it, and what makes it interesting."
                        rows={7}
                      />

                      <div className="cp-field-bottom">
                        <span>{content.length} characters</span>

                        <span className="cp-field-hint">
                          Tell the story behind the build
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="cp-link-grid">
                    <div className="cp-field-section">
                      <label>LIVE PROJECT</label>

                      <div className="cp-field-card cp-input-icon">
                        <LinkRoundedIcon />

                        <input
                          value={projectUrl}
                          onChange={(e) => setProjectUrl(e.target.value)}
                          placeholder="https://your-project.com"
                        />
                      </div>
                    </div>

                    <div className="cp-field-section">
                      <label>GITHUB</label>

                      <div className="cp-field-card cp-input-icon">
                        <GitHubIcon />

                        <input
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="github.com/username/repo"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="cp-field-section">
                    <label>PROJECT MEDIA</label>

                    <div className="cp-upload-grid">
                      {!projectImage ? (
                        <label className="cp-media-drop cp-media-compact">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />

                          <span className="cp-media-icon">
                            <InsertPhotoRoundedIcon />
                          </span>

                          <span className="cp-media-copy">
                            <strong>Cover image</strong>
                            <small>Add project visual</small>
                          </span>

                          <span className="cp-media-add">+</span>
                        </label>
                      ) : (
                        <div className="cp-media-preview">
                          <img src={projectImage.url} alt="Project preview" />

                          <button
                            type="button"
                            onClick={() => setProjectImage(null)}
                          >
                            <CloseRoundedIcon />
                          </button>
                        </div>
                      )}

                      {!projectVideo ? (
                        <label className="cp-media-drop cp-media-compact">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                          />

                          <span className="cp-media-icon">
                            <VideoLibraryRoundedIcon />
                          </span>

                          <span className="cp-media-copy">
                            <strong>Demo video</strong>
                            <small>Show it in motion</small>
                          </span>

                          <span className="cp-media-add">+</span>
                        </label>
                      ) : (
                        <div className="cp-media-preview">
                          <video src={projectVideo.url} controls />

                          <button
                            type="button"
                            onClick={() => setProjectVideo(null)}
                          >
                            <CloseRoundedIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {postType === "code" && (
                <>
                  <div className="cp-field-section">
                    <label>SNIPPET TITLE</label>

                    <div className="cp-field-card">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Debounced React search hook"
                      />
                    </div>
                  </div>

                  <div className="cp-field-section">
                    <label>LANGUAGE</label>

                    <div className="cp-code-language-tabs">
                      {CODE_LANGS.map((language) => (
                        <button
                          key={language}
                          type="button"
                          className={codeLang === language ? "active" : ""}
                          onClick={() => setCodeLang(language)}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cp-field-section">
                    <label>CODE</label>

                    <div className="cp-code-editor">
                      <div className="cp-code-editor-top">
                        <div className="cp-window-dots">
                          <span />
                          <span />
                          <span />
                        </div>

                        <span>{codeLang.toLowerCase()}</span>

                        <span className="cp-code-file">snippet</span>
                      </div>

                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        spellCheck="false"
                        placeholder={`// Share something useful

const example = () => {
  // your code here
};`}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="cp-field-section">
                <label>TAGS</label>

                <div className="cp-field-card cp-tags-field">
                  <div className="cp-tags-list">
                    {tags.map((tag) => (
                      <span key={tag} className="cp-tag">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <CloseRoundedIcon />
                        </button>
                      </span>
                    ))}

                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={
                        tags.length
                          ? "Add another..."
                          : "Type a tag and press Enter"
                      }
                    />
                  </div>

                  <span className="cp-tag-count">{tags.length}/8</span>
                </div>
              </div>
            </div>

            <div className="cp-editor-footer">
              <button
                type="button"
                className="cp-clear-button"
                onClick={clearForm}
              >
                Clear
              </button>

              <button type="submit" className="cp-publish-button">
                <span>Publish {selectedPostType?.label}</span>

                <ArrowOutwardRoundedIcon />
              </button>
            </div>
          </form>

          <aside className="cp-preview-panel">
            <div className="cp-preview-heading">
              <div>
                <span className="cp-panel-label">LIVE PREVIEW</span>

                <strong>Your feed card</strong>
              </div>

              <span className="cp-preview-live">
                <i />
                LIVE
              </span>
            </div>

            <article className="cp-feed-card">
              <div className="cp-feed-card-top">
                <div className="cp-feed-author">
                  <div className="cp-feed-avatar">JJ</div>

                  <div>
                    <strong>Jay Jathar</strong>

                    <span>@jayjathar · just now</span>
                  </div>
                </div>

                <button type="button" className="cp-feed-more">
                  <MoreHorizRoundedIcon />
                </button>
              </div>

              <div className="cp-feed-type">
                {SelectedTypeIcon && <SelectedTypeIcon />}

                <span>{selectedPostType?.label}</span>
              </div>

              {postType === "text" && (
                <>
                  <div className="cp-feed-body">
                    <p>{content || "Your post content will appear here..."}</p>
                  </div>

                  {textImage && (
                    <div className="cp-feed-media">
                      <img src={textImage.url} alt="Post preview" />
                    </div>
                  )}
                </>
              )}

              {postType === "project" && (
                <>
                  <div className="cp-feed-project">
                    <h2>{title || "Your project title"}</h2>

                    <p>
                      {content ||
                        "Your project description will appear here. Explain what you built and why it matters."}
                    </p>
                  </div>

                  {projectImage && (
                    <div className="cp-feed-media">
                      <img src={projectImage.url} alt="Project preview" />
                    </div>
                  )}

                  {projectVideo && (
                    <div className="cp-feed-media">
                      <video src={projectVideo.url} controls />
                    </div>
                  )}

                  {(projectUrl || githubUrl) && (
                    <div className="cp-feed-links">
                      {projectUrl && (
                        <a
                          href={
                            projectUrl.startsWith("http")
                              ? projectUrl
                              : `https://${projectUrl}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LinkRoundedIcon />

                          <span>{getDomain(projectUrl)}</span>

                          <ArrowOutwardRoundedIcon />
                        </a>
                      )}

                      {githubUrl && (
                        <a
                          href={
                            githubUrl.startsWith("http")
                              ? githubUrl
                              : `https://${githubUrl}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GitHubIcon />

                          <span>{getDomain(githubUrl)}</span>

                          <ArrowOutwardRoundedIcon />
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}

              {postType === "code" && (
                <>
                  <div className="cp-feed-code-heading">
                    <h2>{title || "Your code snippet"}</h2>

                    <span>{codeLang}</span>
                  </div>

                  <div className="cp-feed-code">
                    <div className="cp-feed-code-top">
                      <div className="cp-window-dots">
                        <span />
                        <span />
                        <span />
                      </div>

                      <span>{codeLang.toLowerCase()}</span>
                    </div>

                    <pre>
                      <code>
                        {content ||
                          `const example = () => {
  // your code appears here
};`}
                      </code>
                    </pre>
                  </div>
                </>
              )}

              {tags.length > 0 && (
                <div className="cp-feed-tags">
                  {tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}

              <div className="cp-feed-footer">
                <div className="cp-feed-actions">
                  <button type="button">
                    <FavoriteBorderRoundedIcon />
                    <span>0</span>
                  </button>

                  <button type="button">
                    <ChatBubbleOutlineRoundedIcon />
                    <span>0</span>
                  </button>
                </div>

                <button type="button">
                  <BookmarkBorderRoundedIcon />
                </button>
              </div>
            </article>

            <div className="cp-preview-note">
              <span className="cp-preview-note-dot" />

              <p>This is how your content will appear in the DevOrbit feed.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CreatePost;
