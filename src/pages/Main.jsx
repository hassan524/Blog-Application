import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '@/data/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Separator } from '@/components/ui/separator';

const Main = () => {

  const { SetOpenUploadBlog, checkBlogs, IsBlogUpload } = useContext(AuthContext);
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      const fetchedBlogs = await checkBlogs();
      setBlogs(fetchedBlogs);
    }
    fetchBlogs();
  }, [IsBlogUpload]);



  const data = useSelector((state) => state.data.data);
  const userLoginStatus = localStorage.getItem('IsUserLogin') === 'true';

  const navigate = useNavigate();

  const UploadBlogPopup = () => {
    SetOpenUploadBlog(true);
    navigate('/UploadBlogs');
  };

  return (
    <main className="w-full relative flex gap-5 top-[10vh] sm:px-4 px-2 sm:pt-8 pt-3 pb-3 bg-slate-100">
      <div className="lg:w-[80%] w-full bg-slate-50 flex justify-center rounded-md">
        <div className="w-[85%] flex flex-col gap-10 min-h-[90vh] rounded-md">
          {userLoginStatus && (
            <div className="flex justify-center items-end h-[12vh]">
              <input
                className="lg:w-[90vw] w-full sm:text-lg text-[12px] h-8 rounded-md outline-none px-4 py-6 bg-slate-100 text-slate-400"
                type="text"
                value={`What's on your mind? ${data?.username || ' '}`}
                onClick={UploadBlogPopup}
                readOnly
              />
            </div>
          )}

          <div className="flex flex-col gap-8">
            {blogs?.map((blog) => (
              <div key={blog.id} className="flex bg-slate-100 p-4 flex-col gap-5 rounded-xl shadow-md">
                {/* Blog Header */}
                <div className="flex items-center gap-3">
                  <div className="rounded-full h-10 w-10 overflow-hidden">
                    <img src={blog.BlogAuthorImage || 'NoUser.png'} alt="User" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-800 font-semibold">{blog.BlogAuthor}</span>
                    <span className="text-[11px] text-slate-400">{blog.BlogUploadDate}</span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-slate-900">{blog.BlogTitle}</span>
                  <p className="text-sm text-gray-600">{blog.BlogContent}</p>
                </div>

                {/* Blog Image */}
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

                {/* Interaction Section */}
                <div className="flex justify-between items-center pt-2">
                  {/* Like Button */}
                  <div className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-blue-500 transition">
                    <i className="bi bi-hand-thumbs-up text-xl"></i>
                    <span className="text-sm font-medium">Like</span>
                  </div>

                  {/* Comment Button */}
                  <div className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-green-500 transition">
                    <i className="bi bi-chat text-xl"></i>
                    <span className="text-sm font-medium">Comment</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="w-[20%] bg-slate-50 min-h-[90vh] rounded-md lg:block hidden"></div>
    </main>
  );
};

export default Main;
