import React from 'react';
import { useSelector } from 'react-redux';
import { Separator } from '@/components/ui/separator';

const Main = () => {
  // Data Of Current User
  const data = useSelector((state) => state.data.data);
  console.log(data);

  return (
    <>
      <main className="w-full relative flex gap-5 top-[10vh] sm:px-4 px-2 sm:pt-8 pt-3 pb-3 min-h-[90vh] bg-slate-100">
        <div className="lg:w-[80%] w-full bg-slate-50 min-h-[90vh] flex justify-center rounded-md">
          <div className="w-[85%]">
            <div className="flex justify-center items-end h-[12vh]">
              <input
                className="lg:w-[40vw] w-[90vw] sm:text-lg text-[12px] h-8 rounded-md outline-none px-4 py-6 bg-slate-100 text-slate-400"
                type="text"
                value={`What's on your mind ${data?.username || ''}?`}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Show All Users Div */}
        <div className="w-[20%] bg-slate-50 h-full min-h-[90vh] rounded-md lg:block hidden"></div>
      </main>
    </>
  );
};

export default Main;
