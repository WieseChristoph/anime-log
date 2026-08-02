import { ChevronsUp } from 'lucide-react';
import { useState, } from 'react';

const BackToTop = () => {
    const [visible, setVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    function toggleVisible() {
        setScrollPosition(window.scrollY);
        if (scrollPosition > 100 && !visible) setVisible(true);
        else if (scrollPosition < 100) setVisible(false);
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    window.addEventListener('scroll', toggleVisible);

    return (
        <button
            type="button"
            className={`${
                visible ? 'block' : 'hidden'
            } fixed right-5 bottom-5 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-orange-400 p-2 text-white shadow-md`}
            onClick={() => scrollToTop()}
            aria-label="Back to top"
        >
            <ChevronsUp className="h-7 w-7" />
        </button>
    );
};

export default BackToTop;
