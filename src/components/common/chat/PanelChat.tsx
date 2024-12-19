import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { openChat } from '@/store/chatStore';

import InboxChat from './InboxChat';

const PanelChat = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isOpen = useSelector((state: any) => state.chat.data);

  useEffect(() => {
    if (isOpen.open) {
      setOpen(isOpen.open);
    } else {
      setOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!open) {
      dispatch(openChat({ id: '', open: false }));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-30">
      <DialogBackdrop
        transition
        className="fixed inset-0 z-50 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full py-16 pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="relative flex-1">
                  <InboxChat chatId={isOpen.id} />
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PanelChat;
