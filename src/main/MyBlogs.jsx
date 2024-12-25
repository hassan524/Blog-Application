import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import { db } from '@/data/db/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const MyBlogs = () => {
  const [myBlogs, setmyBlogs] = useState([]);
  const userLoginStatus = localStorage.getItem("IsUserLogin") === "true";
  const data = useSelector((state) => state.data.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, "posts");
        const querySnapshot = await getDocs(usersCollection);

        const myBlogArray = [];

        querySnapshot.forEach((doc) => {
          const postData = doc.data();

          if (postData.BlogAuthorId === data.id) {
            myBlogArray.push({
              id: doc.id,
              ...postData,
            });
          }
        });

        setmyBlogs(myBlogArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className="w-full flex justify-center items-center relative gap-5 top-[10vh] sm:px-4 px-2 sm:pt-8 pt-3 pb-3 bg-slate-100 dark:bg-gray-900">
        <div
          className={`w-[90%] flex justify-start py-5 px-3 bg-slate-50 dark:bg-gray-800 ${
            userLoginStatus ? null : "py-5"
          } flex justify-center rounded-md`}
        >
          <div className="flex flex-col gap-8">
            {myBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex lg:w-[50vw] sm:w-[75vw] bg-slate-100 dark:bg-gray-900 p-4 flex-col gap-5 rounded-xl shadow-md"
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
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {blog.BlogContent}
                  </p>
                </div>

                {blog.BlogImage && (
                  <>
                    <div className="rounded overflow-hidden">
                      <img
                        className="lg:w-[30vw] sm:w-[40vw] w-full h-auto object-contain rounded-md"
                        src={blog.BlogImage}
                        alt="Blog"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Sidebar />
    </>
  );
};

export default MyBlogs;
