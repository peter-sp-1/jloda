import React from "react"

const Header: React.FC = () => {

  return (
        <header className="sticky inset-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 py-4">
            <div className="relative flex items-center">
                <a href="/">
                    <img  src="https://www.svgrepo.com/show/499831/target.svg" loading="lazy"  width="32" height="32"></img>
                </a>
            </div>
            <ul className="hidden items-center justify-center gap-6 md:flex">
                <li className="pt-1.5 font-dm text-sm font-medium text-slate-700">
                    <a href="#">About</a>
                </li>
                <li className="pt-1.5 font-dm text-sm font-medium text-slate-700">
                    <a href="#">Download</a>
                </li>
                <li className="pt-1.5 font-dm text-sm font-medium text-slate-700">
                    <a href="#">Docs</a>
                </li>
            </ul>
            <div className="flex-grow"></div>
        </nav>
    </header>
  );
};

export default Header;
