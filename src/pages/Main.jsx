import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/data/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { db } from "@/data/db/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,

} from "firebase/firestore";

const Main = () => {
  const {
    SetOpenUploadBlog,
    checkBlogs,
    IsBlogUpload,
    Users,
    SetUsers,
    IsDarkMode,
    SetIsDarkMode,
    follow,

  } = useContext(AuthContext);

  if (IsDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }


  const [blogs, setBlogs] = useState(null);
  const [activeDialog, setActiveDialog] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({});
  const data = useSelector((state) => state.data.data);
  const userLoginStatus = localStorage.getItem("IsUserLogin") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlogsAndLikes() {
      const fetchedBlogs = await checkBlogs(); // Fetch blogs
      setBlogs(fetchedBlogs);

      // Fetch likes for each blog
      fetchedBlogs.forEach((blog) => {
        fetchLikes(blog.id);
      });
    }
    fetchBlogsAndLikes();
  }, [IsBlogUpload]);

  const fetchLikes = async (postId) => {
    try {
      const likeRef = doc(db, "Likes", postId);
      const docSnapshot = await getDoc(likeRef);
      if (docSnapshot.exists()) {
        const userIds = docSnapshot.data().userIds || [];
        setLikes((prev) => ({
          ...prev,
          [postId]: userIds.length,
        }));
      } else {
        setLikes((prev) => ({
          ...prev,
          [postId]: 0,
        }));
      }
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
    }
  };

  const UploadBlogPopup = () => {
    SetOpenUploadBlog(true);
    navigate("/UploadBlogs");
  };

  const addEmoji = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const addCommentToPost = async (postId, comment, username, photo) => {
    if (!comment.trim()) return; // Ensure comment is not empty

    try {
      const postRef = doc(db, "comments", postId);
      const docSnapshot = await getDoc(postRef);

      if (docSnapshot.exists()) {
        // If the document exists, update the comments field
        await updateDoc(postRef, {
          comments: arrayUnion({
            username: username || "Anonymous",
            comment,
            photo: photo || "NoUser.png",
            timestamp: new Date(),
          }),
        });
      } else {
        // If the document doesn't exist, create a new one with the comments field
        await setDoc(postRef, {
          comments: [
            {
              username: username || "Anonymous",
              comment,
              photo: photo || "NoUser.png",
              timestamp: new Date(),
            },
          ],
        });
      }

      // Re-fetch comments to update the UI
      fetchComments(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  const fetchComments = async (postId) => {
    const postRef = doc(db, "comments", postId);
    try {
      const docSnapshot = await getDoc(postRef);
      setComments(docSnapshot.exists() ? docSnapshot.data().comments || [] : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const LikeHandler = async (postId) => {
    try {
      const likeRef = doc(db, "Likes", postId);
      const docSnapshot = await getDoc(likeRef);
      if (docSnapshot.exists()) {
        const currentLikes = docSnapshot.data().userIds || [];
        if (!currentLikes.includes(data.id)) {
          await updateDoc(likeRef, {
            userIds: arrayUnion(data.id),
          });
        }
      } else {
        await setDoc(likeRef, {
          userIds: [data.id],
        });
      }
      fetchLikes(postId);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const openDialog = (blogId) => {
    setActiveDialog(blogId);
    fetchComments(blogId);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const querySnapshot = await getDocs(usersCollection);

        const usersArray = [];
        querySnapshot.forEach((doc) => {
          usersArray.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        SetUsers(usersArray);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handledarkMode = () => {
    SetIsDarkMode(!IsDarkMode);
  };

  return (
    <main className="w-full relative flex gap-5 top-[10vh] sm:px-4 px-2 sm:pt-8 pt-3 pb-3 bg-slate-100 dark:bg-gray-900">
      <div
        className={`xl:w-[80%] w-full bg-slate-50 dark:bg-gray-800 ${userLoginStatus ? null : "py-5"
          } flex justify-center rounded-md`}
      >
        <div className="w-[85%] flex flex-col gap-10 min-h-[90vh] rounded-md">
          {userLoginStatus && (
            <div className="flex justify-center items-end h-[12vh]">
              <input
                className="lg:w-[90vw] w-full sm:text-lg text-[12px] h-8 rounded-md outline-none px-4 py-6 bg-slate-100 dark:bg-slate-800 dark:border-gray-700 dark:border text-slate-400"
                type="text"
                value={`What's on your mind? ${data?.username || " "}`}
                onClick={UploadBlogPopup}
                readOnly
              />
            </div>
          )}

          <div className="flex flex-col gap-8">
            {blogs?.map((blog) => (
              <>
                <div
                  key={blog.id}
                  className="flex bg-slate-100 dark:bg-gray-900 p-4 flex-col gap-5 rounded-xl shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full h-10 w-10 overflow-hidden">
                      <img
                        src={blog.BlogAuthorImage || "NoUser.png"}
                        alt="User"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-800 dark:text-slate-50 font-semibold">
                        {blog.BlogAuthor}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {blog.BlogUploadDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {blog.BlogTitle}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{blog.BlogContent}</p>
                  </div>

                  {blog.BlogImage && (
                    <>
                      <Separator />
                      <div className="rounded overflow-hidden">
                        <img
                          className="lg:w-[30vw] sm:w-[40vw] w-full h-auto object-contain rounded-md"
                          src={blog?.BlogImage}
                          alt="Blog"
                        />
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-blue-500 transition"
                      onClick={() => LikeHandler(blog.id)}
                    >
                      <i className="bi bi-hand-thumbs-up text-xl"></i>
                      <span className="text-sm font-medium">
                        {likes[blog.id] || 0}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-green-500 transition"
                      onClick={() => openDialog(blog.id)}
                    >
                      <i className="bi bi-chat text-xl"></i>
                      <span className="text-sm font-medium">Comment</span>
                    </div>
                  </div>
                </div>

              </>


            ))}
          </div>
        </div>
      </div>




      <div className="w-[20%] bg-slate-50 dark:bg-slate-800 px-3 min-h-[90vh] pt-5 pb-5 rounded-md xl:flex hidden">
        <div className="flex flex-col gap-8 h-[full] w-full">
          {Users?.filter(user => user.username !== data?.username).map((user) => (
            <div key={user.id} className="flex justify-between gap-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <img src={user.photo || 'NoUser.png'} alt="User Avatar" />
                </div>
                <span className="text-[12px] italic">{user.username}</span>
              </div>

              <button className="bg-slate-200 text-blue-400 dark:text-slate-50 dark:bg-background px-2 text-[10px] rounded-xl"
                onClick={() => follow(user.id)}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={activeDialog !== null}
        onOpenChange={() => setActiveDialog(null)}
      >
        <DialogContent className="sm:w-[400px] flex flex-col w-[90vw] rounded-lg dark:bg-gray-900">
          <DialogHeader className="h-12 italic justify-center items-center">
            <DialogTitle className="text-xl">Comments</DialogTitle>
          </DialogHeader>

          <div className="h-64 bg-slate-50 rounded flex flex-col gap-6 overflow-y-scroll p-2 dark:bg-gray-800">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="p-2 border-b flex flex-col gap-1 border-gray-200"
              >
                <div className="flex gap-2 text-[12px]">
                  <div className="h-5 w-5 rounded-full overflow-hidden">
                    <img src={comment?.photo || "NoUser.png"} alt="" />
                  </div>
                  <strong>{comment.username}</strong>
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            ))}
          </div>

          <DialogFooter>
            <div className="w-full h-12 flex items-center bg-slate-50 rounded relative dark:bg-gray-800">
              <input
                type="text"
                className="sm:w-[80%] w-[78%] h-full border-none bg-transparent outline-none px-4"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex items-center w-[20%]">
                <i
                  className="bi bi-emoji-smile text-xl absolute right-12 cursor-pointer"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                ></i>
                <i
                  className="bi bi-send-fill text-xl text-blue-500 cursor-pointer absolute right-4"
                  onClick={() => {
                    addCommentToPost(activeDialog, newComment, data?.username, data?.photo);
                    setNewComment("");
                  }}
                ></i>
              </div>
              {showEmojiPicker && (
                <div className="absolute bottom-14 right-4 z-50">
                  <EmojiPicker onEmojiClick={addEmoji} />
                </div>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div
        className="w-12 h-12 fixed right-0 bottom-0 bg-slate-200 dark:bg-gray-800 rounded-ss-xl sm:flex hidden justify-center items-center cursor-pointer"
        onClick={handledarkMode}
      >
        <i className="bi dark:hidden bi-moon-stars-fill text-gray-800"></i>
        <i className="bi text-3xl hidden dark:block bi-brightness-low-fill text-gray-50"></i>
      </div>
    </main>
  );
};

export default Main;
