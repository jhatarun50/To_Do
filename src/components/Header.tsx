import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white py-3 px-4 md:px-6 border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="h-6 w-6 md:h-7 md:w-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rotate-45 mr-2 shadow-sm"></div>
          <span className="text-lg md:text-xl font-semibold text-gray-800 uppercase">TODO</span>
        </Link>
      </div>
    </header>
  );
} 