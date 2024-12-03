import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import { db, storage } from '@/libs/firebase';

import SkillsProfile from '../../profile/skillsProfile/SkillsProfile';
import type { Offer } from '../page';

interface FormNewHireProps {
  user: any;
  onFetchOffers: (updateOffers: string) => void;
  closeNewHire: (close: boolean) => void;
  saveHire: boolean;
  savedHire: (saved: boolean) => void;
  offerEdit: Offer;
}
interface ValidFieldsProps {
  value: string | null | File;
  errorMessage: string;
}
const FormNewHire = (props: FormNewHireProps) => {
  const { user, saveHire, offerEdit, closeNewHire, onFetchOffers, savedHire } =
    props;
  const t = useTranslations(); // Initialize translations
  const [offer, setOffer] = useState<Offer>({ currency: 'euro' } as Offer);
  const [offerFile, setOfferFile] = useState<File | null>(null); // File state

  const [selectedOptions, setSelectedOptions] = useState<any>(offer.categories);

  const validFields: ValidFieldsProps[] = [
    {
      value: offer.name,
      errorMessage: 'El campo "Nombre de la oferta" está vacío',
    },
    {
      value: offer.descriptionShort || null,
      errorMessage: 'El campo "Descripción corta" está vacío',
    },
    {
      value: offer.description,
      errorMessage: 'El campo "Descripción" está vacío',
    },
    { value: offerFile, errorMessage: 'El campo "Prueba de nivel" está vacío' },
  ];
  const errorMessageDuration =
    'El campo "Duración" está vacío cuando se asignó un valor en días/mes/año';

  useEffect(() => {
    setOffer({} as Offer);
  }, []);

  useEffect(() => {
    if (offerEdit) {
      setOffer(offerEdit);
    }
  }, [offerEdit]);

  const handleAddOffer = async () => {
    for (const field of validFields) {
      if (!field.value) {
        if (!(offer.fileUrl && !offerFile)) {
          toast.error(field.errorMessage);
          savedHire(false);
          return;
        }
      }
    }
    if (!offer.duration && offer.durationValue) {
      toast.error(errorMessageDuration);
      savedHire(false);
      return;
    }

    try {
      // Generate a random offer ID
      const offerId = uuidv4(); // Generates a unique random ID for the offer

      // Upload the file to Firebase Storage under the user's UID and offer ID
      let fileUrl;
      if (offerFile) {
        const storageRef = ref(
          storage,
          `offers/${user!.uid}/${offerId}/recruiter/${offerFile.name}`,
        ); // Include the offerId here
        await uploadBytes(storageRef, offerFile);
        fileUrl = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
      }

      if (offer.id) {
        await updateDoc(doc(db, 'users', user!.uid, 'offers', offer.id), {
          name: offer.name,
          description: offer.description,
          duration: offer.duration || null,
          durationValue: offer.durationValue || null,
          descriptionShort: offer.descriptionShort,
          currency: offer.currency,
          priceHour: offer.priceHour || null,
          priceMounth: offer.priceMounth || null,
          priceProyect: offer.priceProyect || null,
          categories: selectedOptions || null,
          skillsMin: offer.skillsMin || null,
          createdAt: new Date(),
          fileUrl: fileUrl || offer.fileUrl,
        });
        toast.success(t('success.offerUpdated'));
      } else {
        await setDoc(doc(db, 'users', user!.uid, 'offers', offerId), {
          name: offer.name,
          description: offer.description,
          duration: offer.duration || null,
          durationValue: offer.durationValue || null,
          descriptionShort: offer.descriptionShort,
          currency: offer.currency,
          priceHour: offer.priceHour || null,
          priceMounth: offer.priceMounth || null,
          priceProyect: offer.priceProyect || null,
          categories: selectedOptions || null,
          skillsMin: offer.skillsMin || null,
          createdAt: new Date(),
          fileUrl: fileUrl || offer.fileUrl,
        });

        toast.success(t('success.offerAdded'));
      }

      // Reset the form and fetch updated offers
      setOffer({} as Offer);
      setOfferFile(null);
      onFetchOffers(user!.uid); // Fetch the updated offers
      closeNewHire(false);
      savedHire(false);
    } catch (error) {
      console.error('Error adding offer:', error);
      toast.error(t('error.addOffer'));
    }
  };

  useEffect(() => {
    if (saveHire) {
      handleAddOffer();
    }
  }, [saveHire]);

  // Handle file drop using react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setOfferFile(acceptedFiles[0] || null); // Set the first file dropped
    },
    multiple: false, // Only accept one file
  });

  const onChangeCategory = (event: any) => {
    const options = Array.from(
      event.target.selectedOptions,
      (option: any) => option.value,
    );
    setSelectedOptions(options);
  };

  const updateSkills = (skills: string[]) => {
    if (skills) {
      setOffer({ ...offer, skillsMin: skills });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap">
        <div className="mb-4 flex w-full items-center rounded-md bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
          <input
            type="text"
            value={offer.name}
            onChange={(e) => setOffer({ ...offer, name: e.target.value })}
            className="w-8/12 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
            required
            placeholder={t('hire.offerName')}
            // maxLength={18}
          />
          <label htmlFor="duration" className="ml-5">
            Duración:{' '}
          </label>
          <select
            id="duration"
            value={offer.duration}
            onChange={(e) => setOffer({ ...offer, duration: e.target.value })}
            className="ml-5 w-2/12 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
          >
            <option value="">Seleciona</option>
            <option value="day">Por día</option>
            <option value="month">Por mes</option>
            <option value="year">Por año</option>
            <option value="infinite">Indefinido</option>
          </select>
          <input
            id="durationValue"
            type="text"
            value={offer.durationValue}
            onChange={(e) =>
              setOffer({ ...offer, durationValue: e.target.value })
            }
            className="ml-5 w-2/12 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
            disabled={offer.duration === 'infinite'}
            placeholder="20"
          />
        </div>
        <div className="flex w-full flex-wrap">
          <div className="flex w-full">
            <div className="mb-4 rounded-md bg-white shadow-md transition-shadow hover:shadow-xl xl:w-4/12">
              <div className="mb-5 rounded-t-md bg-zinc-700 p-3">
                <p className="font-semibold text-white">
                  Precio de la oferta:{' '}
                </p>
              </div>
              <div className="mb-5 flex px-6">
                <div className="w-6/12">
                  <p>Precio/hora: </p>
                  <input
                    id="priceHour"
                    type="number"
                    value={offer.priceHour}
                    onChange={(e) =>
                      setOffer({
                        ...offer,
                        priceHour: Number(e.target.value),
                      })
                    }
                    className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                    placeholder="25"
                  />
                </div>
                <div className="ml-5 w-6/12">
                  <p>Precio/mes: </p>
                  <input
                    id="priceMounth"
                    type="number"
                    value={offer.priceMounth}
                    onChange={(e) =>
                      setOffer({
                        ...offer,
                        priceMounth: Number(e.target.value),
                      })
                    }
                    className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                    placeholder="900"
                  />
                </div>
              </div>
              <div className="flex px-6">
                <div className="w-6/12">
                  <p>Precio/mes: </p>
                  <input
                    id="priceProyect"
                    type="number"
                    value={offer.priceProyect}
                    onChange={(e) =>
                      setOffer({
                        ...offer,
                        priceProyect: Number(e.target.value),
                      })
                    }
                    className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                    placeholder="3000"
                  />
                </div>
                <div className="mb-6 ml-2 w-6/12">
                  <p>Moneda: </p>
                  <select
                    id="currency"
                    value={offer.currency}
                    onChange={(e) =>
                      setOffer({ ...offer, currency: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                  >
                    <option value="euro">€</option>
                    <option value="dolar">$</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-4 ml-5 rounded-md bg-white shadow-md transition-shadow hover:shadow-xl md:w-6/12 xl:w-4/12">
              <div className="rounded-t-md bg-zinc-700 p-3">
                <p className="font-semibold text-white">Asignar categorías: </p>
              </div>
              <div className="p-6">
                <select
                  name="categories"
                  id="categories"
                  multiple
                  onChange={(e) => {
                    onChangeCategory(e);
                  }}
                  className="block min-h-40 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-freeland focus:ring-freeland"
                  value={selectedOptions || offer.categories}
                >
                  <option value="web">Diseño web</option>
                  <option value="graphic">Diseño gráfico</option>
                  <option value="filmmaker">Filmmaker</option>
                  <option value="photo">Fotografía</option>
                  <option value="seo">Posicionamiento SEO</option>
                  <option value="sem">Posicionamiento SEM</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
            </div>

            <div className="mb-4 ml-5 rounded-md bg-white shadow-md transition-shadow hover:shadow-xl md:w-6/12 xl:w-4/12">
              <div className="rounded-t-md bg-zinc-700 p-3">
                <p className="font-semibold text-white">Requisitos mínimos: </p>
              </div>
              <div className="p-6">
                <SkillsProfile
                  isEditing
                  skillsObj={offer.skillsMin || []}
                  onChangeSkills={updateSkills}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 w-full rounded-md bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
          <textarea
            value={offer.descriptionShort}
            onChange={(e) =>
              setOffer({ ...offer, descriptionShort: e.target.value })
            }
            className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
            placeholder={t('hire.descriptionShort')}
          />
        </div>

        <div className="mb-4  w-full rounded-md bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
          <textarea
            value={offer.description}
            onChange={(e) =>
              setOffer({ ...offer, description: e.target.value })
            }
            className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
            rows={10}
            placeholder={t('hire.description')}
          />
        </div>
        <div className="mb-8 w-full rounded-md bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
          <p className="mb-3 block font-semibold text-gray-700 ">
            {t('hire.uploadFile')}
          </p>
          {offer.fileUrl && (
            <p className="mb-5">
              <a
                href={offer.fileUrl}
                target="_blank"
                className=" rounded-md bg-freeland p-3 font-bold text-white"
              >
                Ver archivo subido
              </a>
            </p>
          )}
          <div
            {...getRootProps()}
            className="w-full rounded border-2 border-dashed border-gray-300 px-6 py-16 text-center"
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              {offerFile ? offerFile.name : t('hire.dragAndDrop')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormNewHire;
