import Sidebar from '@/app/components/Sidebar';
import '../../globals.css'
import { usePathname } from 'next/navigation';
import MobileSidebar from '@/app/components/MobileSidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className='md:items-center items-start p-5 flex justify-center h-screen'>
        <div className='main-container grid grid-cols-10 md:h-[90vh] w-[90vw]'>
            <div className='md:col-span-3 col-span-10 md:block hidden'>
              <Sidebar />
            </div>
            <div className='md:hidden block col-span-10'>
              <MobileSidebar />
            </div>
            <div className='md:col-span-7 col-span-10 '>
              {children}
            </div>
        </div>
    </div>
  );
}
