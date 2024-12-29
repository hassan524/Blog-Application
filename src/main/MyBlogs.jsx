import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import { db } from '@/data/db/firebase';
import { collection, doc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const MyBlogs = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [openUpdateBlog, setOpenUpdateBlog] = useState(false);
  const [DeleteAlertOpen, SetDeleteAlertOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null); // Blog to edit
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedImage, setUpdatedImage] = useState(null);
  const userLoginStatus = localStorage.getItem("IsUserLogin") === "true";
  const data = useSelector((state) => state.data.data);

  const HandleDeleteAlert = () => {
    SetDeleteAlertOpen(!DeleteAlertOpen)
  }


  // Fetch blogs
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const myBlogArray = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((postData) => postData.BlogAuthorId === data.id);
      setMyBlogs(myBlogArray);
    });

    return () => unsubscribe();
  }, [data?.id]);

  // Open Dialog for Updating Blog
  const updateBlog = (blog) => {
    setSelectedBlog(blog);
    setUpdatedTitle(blog.BlogTitle);
    setUpdatedContent(blog.BlogContent);
    setOpenUpdateBlog(true);
  };

  // Handle Image Upload to ImgBB
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=adaba9947bd01d4aabea6879dd7e3970`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  // Handle Blog Update
  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = selectedBlog.BlogImage;

      // Upload new image if selected
      if (updatedImage) {
        imageUrl = await handleImageUpload(updatedImage);
      }

      // Update Firestore document
      const docRef = doc(db, "posts", selectedBlog.id);
      await updateDoc(docRef, {
        BlogTitle: updatedTitle,
        BlogContent: updatedContent,
        BlogImage: imageUrl,
      });

      console.log("Blog updated successfully!");
      setOpenUpdateBlog(false); // Close dialog
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  // Delete Blog Post
  const handleDeletePost = async (id) => {
    try {
      const docRef = doc(db, "posts", id);
      await deleteDoc(docRef);
      console.log("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="w-full flex justify-center relative gap-5 top-[10vh] sm:px-4 px-2 sm:pt-8 pt-3 pb-3 bg-slate-100 dark:bg-gray-900">
        <div
          className={`min-h-[90vh] px-5 py-5 w-full bg-slate-50 dark:bg-gray-800 ${userLoginStatus ? null : "py-5"
            } flex justify-center rounded-md`}
        >
          <div className="flex flex-col gap-14">
            {myBlogs.length > 0 ? (
              myBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex lg:w-[50vw] sm:w-[75vw] w-[90vw] bg-slate-100 dark:bg-gray-900 p-4 flex-col gap-5 rounded-xl shadow-md"
                >
                  <div className="flex justify-between">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                          <i className="bi bi-three-dots-vertical text-gray-600 dark:text-gray-300"></i>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="dark:bg-gray-700 shadow-md w-[120px] mx-3"
                        align="right"
                      >
                        <DropdownMenuItem className="cursor-pointer" onClick={() => updateBlog(blog)}>
                          <span className="font-semibold">Edit</span>
                        </DropdownMenuItem>
                        <Separator className="dark:bg-gray-600" />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={HandleDeleteAlert}
                        >
                          <span className="font-semibold">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {blog.BlogTitle}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {blog.BlogContent}
                    </p>
                  </div>

                  {blog.BlogImage && (
                    <div className="rounded overflow-hidden">
                      <img
                        className="lg:w-[30vw] sm:w-[45vw] w-full h-auto object-contain rounded-md"
                        src={blog.BlogImage}
                        alt="Blog"
                      />
                    </div>
                  )}

                  <AlertDialog onOpenChange={SetDeleteAlertOpen} open={DeleteAlertOpen}>
                    <AlertDialogContent className="sm:w-[80vw] w-[90vw]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your posts
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePost(blog.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

              ))
            ) : (
              <h2 className="text-center text-2xl text-gray-600">No blogs found.</h2>
            )}
          </div>
        </div>

        <Dialog open={openUpdateBlog} onOpenChange={setOpenUpdateBlog}>
          <DialogContent className="bg-white dark:bg-gray-900 sm:w-[400px] w-[90vw] rounded-lg">
            <DialogHeader>
              <DialogTitle>Update Blog</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4 mt-5" onSubmit={handleUpdateBlog}>
              <div className="flex items-center bg-gray-100 border border-gray-300 dark:border-gray-800 dark:bg-transparent rounded-md p-2 py-1x">
                <input
                  className="w-[90%] outline-none bg-transparent font-semibold"
                  type="text"
                  placeholder="Title"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <label htmlFor="fileInput" className="w-[10%] flex items-center justify-center cursor-pointer">
                  <img src="/images.png" alt="" />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={(e) => setUpdatedImage(e.target.files[0])}
                />
              </div>
              <textarea
                className="bg-gray-100 outline-none px-2 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-transparent border dark:text-slate-500"
                placeholder="Content"
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
              ></textarea>
              <button
                className="bg-gray-100 self-center px-[2.5rem] py-[8px] rounded-md dark:bg-background"
                type="submit"
              >
                Update
              </button>
            </form>
          </DialogContent>
        </Dialog>



      </main>
      <Sidebar />
    </>
  );
};

export default MyBlogs;
