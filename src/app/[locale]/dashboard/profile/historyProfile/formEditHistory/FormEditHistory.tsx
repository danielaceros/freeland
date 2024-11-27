import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

import useFormatDate from '@/hooks/useFormatDate';

import type { HistoryUserProps } from '../HistoryProfile';

interface FormEditHistoryProps {
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  data: HistoryUserProps;
  onChangeHistory: (historyData: HistoryUserProps) => void;
}

const FormEditHistory = (props: FormEditHistoryProps) => {
  const { open, data, onChangeOpen, onChangeHistory } = props;
  const [openPopup, setOpenPopup] = useState<boolean>(open);
  const [historyData, setHistoryData] = useState<HistoryUserProps>(data);

  useEffect(() => {
    onChangeOpen(openPopup);
  }, [openPopup]);

  const generarRandom = (length: number) => {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
        '',
      );
    const caracteresLength = caracteres.length;
    return Array.from(
      { length },
      () => caracteres[Math.floor(Math.random() * caracteresLength)],
    ).join('');
  };

  const onSaveHistory = () => {
    historyData.id = generarRandom(10).toString();
    onChangeHistory(historyData);
    setOpenPopup(false);
  };

  return (
    <Dialog open={openPopup} onClose={setOpenPopup} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <form onSubmit={onSaveHistory}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="">
                  <input
                    type="text"
                    id="rol"
                    value={historyData.rol}
                    className="mb-3 w-full rounded border border-gray-300 p-2"
                    title="Puesto de trabajo"
                    placeholder="Puesto de trabajo"
                    onChange={(e) =>
                      setHistoryData({ ...historyData, rol: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    id="company"
                    value={historyData.company}
                    className="mb-3 w-full rounded border border-gray-300 p-2"
                    title="Empresa"
                    placeholder="Empresa"
                    onChange={(e) =>
                      setHistoryData({
                        ...historyData,
                        company: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="mb-3 flex">
                    <input
                      type="date"
                      id="fromDate"
                      value={useFormatDate(historyData.fromDate)}
                      onChange={(e) =>
                        setHistoryData({
                          ...historyData,
                          fromDate: new Date(e.target.value),
                        })
                      }
                      required
                      className="w-3/6 rounded border border-gray-300 p-2"
                      title="Inicio del puesto"
                    />
                    <input
                      type="date"
                      id="toDate"
                      value={useFormatDate(historyData.toDate)}
                      onChange={(e) =>
                        setHistoryData({
                          ...historyData,
                          toDate: new Date(e.target.value),
                        })
                      }
                      required
                      className="ml-3 w-3/6 rounded border border-gray-300 p-2"
                      title="Fin del puesto"
                    />
                  </div>

                  <textarea
                    id="description"
                    value={historyData.description}
                    className="mb-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    rows={15}
                    onChange={(e) =>
                      setHistoryData({
                        ...historyData,
                        description: e.target.value,
                      })
                    }
                    required
                    title="Descripción del puesto"
                    placeholder="Descripción del puesto"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-freeland px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpenPopup(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default FormEditHistory;