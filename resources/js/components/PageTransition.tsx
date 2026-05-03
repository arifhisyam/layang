import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';

interface Props {
    children: React.ReactNode;
}

const variants = {
    initial: { opacity: 0, x: 20, y: 6 },
    animate: { opacity: 1, x: 0,  y: 0 },
    exit:    { opacity: 0, x: -20, y: -6 },
};

export default function PageTransition({ children }: Props) {
    const { url } = usePage();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={url}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}