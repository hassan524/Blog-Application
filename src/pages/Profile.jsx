import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
import { db } from '@/data/db/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
    const data = useSelector((state) => state.data.data);
    const [follower, setFollower] = useState(null);
    const [following, setFollowing] = useState(null);

    useEffect(() => {
        const fetchFollows = async () => {
            try {
                const docRef = doc(db, 'Users', data?.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists) {
                    const userData = await docSnap.data();
                    setFollower(userData?.followers || null);
                    setFollowing(userData?.following || null);

                    console.log('Followers:', follower);
                    console.log('Following:', following);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchFollows();
    }, []);

    return (
        <>
            <Header />
            <main className="relative top-[10vh] min-h-[90vh] flex justify-center items-center bg-gray-100 dark:bg-gray-900">
                {/* Profile Card */}
                <div className="w-[90vw] sm:w-[85vw] lg:w-[70vw] min-h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    {/* Header Section */}
                    <div className="flex flex-col items-center">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-300">
                            <img
                                src={data?.photo || '/default-profile.png'}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="mt-4 text-[1.5rem] font-bold text-gray-900 dark:text-white">
                            {data.username || 'John Doe'}
                        </h1>
                        <p className="text-[11px] tracking-wider text-gray-500 dark:text-gray-400">
                            {data.email || 'user@example.com'}
                        </p>
                        <div className="flex items-center sm:gap-16 gap-10 text-sm text-gray-400 mt-12">
                            <div className="flex flex-col justify-center items-center">
                                <span>{follower?.length}</span>
                                <span>Follower</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <span>{following?.length}</span>
                                <span>Follower</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <span>0</span>
                                <span>Posts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Sidebar />
        </>
    );
};

export default Profile;