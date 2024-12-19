import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import useFormatDate from '@/hooks/useFormatDate';

import type { CertiUserProps } from '../CertiProfile';
import { convertToTimestamp, isValidDate } from '@/utils/utils';

interface FormEditCertiProps {
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  data: CertiUserProps;
  onChangeHistory: (historyData: CertiUserProps) => void;
}

const FormEditCerti = (props: FormEditCertiProps) => {
  const { open, data, onChangeOpen, onChangeHistory } = props;
  const [openPopup, setOpenPopup] = useState<boolean>(open);
  const [historyData, setHistoryData] = useState<CertiUserProps>(data);

  useEffect(() => {
    onChangeOpen(openPopup);
  }, [openPopup]);

  const onSaveHistory = () => {
    historyData.id = uuidv4();
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
                    id="certiTitle"
                    value={historyData.certiTitle}
                    className="mb-3 w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                    title="Nombre de la titulación"
                    placeholder="Nombre de la titulación"
                    onChange={(e) =>
                      setHistoryData({
                        ...historyData,
                        certiTitle: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    id="company"
                    value={historyData.company}
                    className="mb-3 w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                    title="Lugar"
                    placeholder="Lugar"
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
                      onChange={(e) => {
                        const newDate = e.target.value;
                          if(isValidDate(newDate)) {
                            setHistoryData({
                              ...historyData,
                              fromDate: convertToTimestamp(newDate),
                            })
                          }
                        }
                      }
                      required
                      className="w-3/6 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                      title="Inicio del curso"
                    />
                    <input
                      type="date"
                      id="toDate"
                      value={useFormatDate(historyData.toDate)}
                      onChange={(e) => {
                        const newDate = e.target.value;
                          if(isValidDate(newDate)) {
                            setHistoryData({
                              ...historyData,
                              toDate: convertToTimestamp(newDate),
                            })
                          }
                        }
                      }
                      required
                      className="ml-3 w-3/6 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                      title="Fin del curso"
                    />
                  </div>

                  <textarea
                    id="description"
                    value={historyData.description}
                    className="mb-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-freeland focus:ring-freeland sm:text-sm/6"
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

export default FormEditCerti;
