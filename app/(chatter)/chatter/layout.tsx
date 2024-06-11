import Sidebar from '@/app/components/Sidebar';
import '../../globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='items-center flex ic justify-center h-screen'>
        <div className='main-container flex h-[80vh] w-[80vw]'>
            <div className=''>
                <Sidebar />
            </div>
            <div className='w-full'>
                {children}
            </div>
        </div>
    </div>
  );
}
