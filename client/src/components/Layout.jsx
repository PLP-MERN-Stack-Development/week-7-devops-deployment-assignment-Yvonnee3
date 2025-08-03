import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';

export default function Layout({ children }) {
    return(
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 p-4 dark:bg-gray-800 bg-gray-100 text-gray-900 dark:text-gray-100">
                {children}
            </main>
            <Footer />
        </div>
    
    );
}