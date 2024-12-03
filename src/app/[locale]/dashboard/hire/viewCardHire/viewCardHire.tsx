/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useTranslations } from 'next-intl';
import React from 'react';

import type { Offer } from '../page';

interface ViewCardHireProps {
  offer: Offer;
  showEdit?: boolean;
  onOpenConfirmDeleteModal?: (offerId: string) => void;
  onOpenModal: (offer: Offer) => void;
  onEditOffer?: (offer: Offer) => void;
}

const ViewCardHire = (props: ViewCardHireProps) => {
  const {
    offer,
    showEdit,
    onOpenConfirmDeleteModal,
    onOpenModal,
    onEditOffer,
  } = props;
  const t = useTranslations(); // Initialize translations

  const showCurrency = (currency: string) => {
    return currency === 'euro' ? '€' : '$';
  };

  return (
    <div
      key={offer.id}
      className={`${!showEdit && 'cursor-pointer'} w-4/12 p-3`}
    >
      {
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      }
      <div
        className="flex min-h-96 flex-col rounded-lg bg-white p-6  shadow-md transition-shadow hover:shadow-xl"
        onClick={() => (!showEdit ? onOpenModal(offer) : null)}
      >
        <div className="">
          {showEdit && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => onOpenModal(offer)}
                className="rounded"
              >
                {!showEdit ? null : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="blue"
                    className="size-6"
                  >
                    <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
              {onEditOffer && (
                <button
                  type="button"
                  onClick={() => onEditOffer(offer)}
                  className="ml-2 rounded"
                >
                  {!showEdit ? null : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="green"
                      className="size-6"
                    >
                      <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  )}
                </button>
              )}
              {onOpenConfirmDeleteModal && (
                <button
                  type="button"
                  onClick={() => onOpenConfirmDeleteModal(offer.id)}
                  className="ml-2 rounded"
                >
                  {!showEdit ? null : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="red"
                      className="size-6"
                    >
                      <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        <div className=" border-b-2 border-gray-200">
          <h4 className="pb-5 text-lg font-semibold">{offer.name}</h4>
        </div>
        <div className="mb-3 flex border-b-2 border-gray-200 py-5">
          <div className="flex w-6/12 flex-wrap items-center">
            {(offer.priceProyect || offer.priceHour || offer.priceMounth) && (
              <div className="w-auto rounded-md border-2 border-freeland p-2 font-bold text-freeland">
                {offer.priceHour &&
                  `${offer.priceHour}${showCurrency(offer.currency || '')}/hora`}
                {offer.priceMounth &&
                  `${offer.priceMounth}${showCurrency(offer.currency || '')}/día`}
                {offer.priceProyect &&
                  `${offer.priceProyect}${showCurrency(offer.currency || '')}/año`}
              </div>
            )}
          </div>
          <div className="w-6/12 text-right">
            <p className="text-gray-700">
              {t('hire.postedOn')} {offer.createdAt.toLocaleDateString()}
            </p>
            {offer.duration ? (
              <p className="text-gray-700">
                {t('hire.offerDuration')}: {offer.durationValue}{' '}
                {offer.duration}
              </p>
            ) : (
              <p className="min-h-6 text-gray-700" />
            )}
          </div>
        </div>
        <div className="mb-5">
          <p className="text-gray-600">{offer.descriptionShort}</p>
        </div>
        {offer.skillsMin && (
          <div className="mt-auto flex">
            {offer.skillsMin.map((skill: string, i: number) => (
              <div
                key={`${skill}-${i.toString()}`}
                className="mb-2 mr-2 flex items-center rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
              >
                {skill.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCardHire;
