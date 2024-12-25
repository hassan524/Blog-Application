import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import AuthContext from '@/data/context/AuthContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { db } from '@/data/db/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {

    const { OpenUploadBlog, SetOpenUploadBlog, SetIsBlogUpload, checkBlogs } = useContext(AuthContext);

    const data = useSelector((state) => state.data.data);

    const [BlogImage, SetBlogImage] = useState(null);         
    const [BlogTitle, SetBlogTitle] = useState('');       
    const [BlogContent, SetBlogContent] = useState('');   

    const navigate = useNavigate()

    const getUniqueId = () => {
        const userId = data.id;
        return `${userId}_${Date.now().toString(16)}_${Math.random().toString(36).substr(2, 6)}`;
    };

    const HandleBlogImage = async (e) => {
        try {
            const image = e.target.files[0];
            if (image) {
                const imageURL = await uploadImageToImgBB(image);
                SetBlogImage(imageURL);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // upload it to imgbb 
    const uploadImageToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://api.imgbb.com/1/upload?key=adaba9947bd01d4aabea6879dd7e3970', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (result.success) {
            return result.data.url;
        }
        return null;
    };

    const HandleBlogPost = async (e) => {
        e.preventDefault();
    
        const uniquePostId = getUniqueId(); 
    
        if (BlogContent && BlogTitle) { 
            const now = new Date();
            const options = { month: "long", day: "numeric" };
            const formattedDate = new Intl.DateTimeFormat("en-US", options).format(now);
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const period = hours >= 12 ? "pm" : "am";
            const formattedTime = `${hours % 12 || 12}:${minutes}${period}`;
            const blogUploadDate = `${formattedDate} at ${formattedTime}`;
    
            try {
                await setDoc(doc(db, "posts", uniquePostId), {

                    BlogAuthor: data.username,
                    BlogAuthorId: data.id,
                    BlogAuthorImage: data.photo,
                    BlogTitle: BlogTitle,
                    BlogContent: BlogContent,
                    BlogImage: BlogImage || null,  // Set BlogImage to null if not provided
                    BlogUploadDate: blogUploadDate,
                    
                });
    
                console.log("Blog uploaded successfully");
    
                SetOpenUploadBlog(false);
    
                await checkBlogs();

                // Reset the BlogImage state
                SetBlogImage(null);
                SetBlogTitle('');
                SetBlogContent('');
                navigate('/')

                SetIsBlogUpload(true)

                setTimeout(() => {
                    SetIsBlogUpload(false)
                }, 1000);

            } catch (err) {
                console.error("Error uploading blog:", err);
            }
        }
    };
    

    return (
        <div>
            <Dialog open={OpenUploadBlog} onOpenChange={SetOpenUploadBlog}>
                <DialogContent className='bg-white dark:bg-gray-900 sm:w-[400px] w-[90vw] rounded-lg'>
                    <DialogHeader>
                        <DialogTitle>Upload Blog</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={HandleBlogPost} className='flex flex-col gap-4 mt-5'>
                        <div className="flex items-center bg-gray-100 border border-gray-300 dark:border-gray-800 dark:bg-transparent rounded-md p-2 py-1x">
                            <input
                                className='w-[90%] outline-none bg-transparent font-semibold'
                                type="text"
                                placeholder="Title"
                                value={BlogTitle}
                                onChange={(e) => SetBlogTitle(e.target.value)}
                            />
                            <label htmlFor="fileInput" className="w-[10%] flex items-center justify-center cursor-pointer">
                                <img src="/images.png" alt="" />
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={HandleBlogImage}
                            />
                        </div>
                        <textarea
                            className='bg-gray-100 outline-none px-2 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-transparent border dark:text-slate-500'
                            value={BlogContent}
                            onChange={(e) => SetBlogContent(e.target.value)}
                        ></textarea>
                        <button
                            className='bg-gray-100 self-center px-[2.5rem] py-[8px] rounded-md dark:bg-background'
                            type='submit'>Post</button>
                    </form>

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Blogs;
