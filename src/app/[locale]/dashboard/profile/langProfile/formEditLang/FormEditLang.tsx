import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { LangUserProps } from '../LangProfile';

interface FormEditCertiProps {
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  data: LangUserProps;
  onChangeLang: (langData: LangUserProps) => void;
}

const FormEditCerti = (props: FormEditCertiProps) => {
  const t = useTranslations();
  const { open, data, onChangeOpen, onChangeLang } = props;
  const [openPopup, setOpenPopup] = useState<boolean>(open);
  const [langData, setLangData] = useState<LangUserProps>(data);

  useEffect(() => {
    onChangeOpen(openPopup);
  }, [openPopup]);

  const onSaveLang = () => {
    langData.id = uuidv4();
    onChangeLang(langData);
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
            <form onSubmit={onSaveLang}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex">
                  <div className="w-6/12 pr-2">
                    <p className="mb-1 text-gray-600">Idioma:</p>
                    <select
                      id="lang"
                      value={langData.lang}
                      onChange={(event) =>
                        setLangData({ ...langData, lang: event.target.value })
                      }
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value="">{t('profile.select')}</option>
                      <option value="es">{t('profile.spanish')}</option>
                      <option value="en">{t('profile.english')}</option>
                      <option value="fr">{t('profile.france')}</option>
                      <option value="it">{t('profile.italian')}</option>
                      <option value="pt">{t('profile.portu')}</option>
                    </select>
                  </div>
                  <div className="w-6/12">
                    <p className="mb-1 text-gray-600">{t('profile.level')}:</p>
                    <select
                      id="level"
                      value={langData.level}
                      onChange={(event) =>
                        setLangData({ ...langData, level: event.target.value })
                      }
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value="">{t('profile.select')}</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>
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
