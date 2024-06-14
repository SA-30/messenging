import Sidebar from '@/app/components/Sidebar';
import '../../globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='items-center flex ic justify-center h-screen'>
        <div className='main-container grid grid-cols-10 h-[80vh] w-[80vw]'>
            <div className='col-span-3'>
            <Sidebar />
            </div>
            <div className='col-span-7'>
              {children}
            </div>
        </div>
    </div>
  );
}
