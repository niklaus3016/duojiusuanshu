import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';
import { ReactNode } from 'react';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode;
}

const AgreementModal = ({ isOpen, onClose, title, content }: AgreementModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[110]">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#0F0F1A]/95 backdrop-blur-2xl rounded-[28px] w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/15 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-transform hover:bg-white/10 hover:text-white"
              aria-label="关闭"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto bg-white/[0.02] p-6">
            {content}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default AgreementModal;
