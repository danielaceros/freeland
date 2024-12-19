import React from 'react';

import CertiProfileController, {
  type CertiControllerProps,
} from './CertiProfileController';
import FormEditCerti from './formEditCerti/FormEditCerti';

export interface CertiUserProps {
  id: string;
  certiTitle: string;
  company: string;
  fromDate: {
    seconds: Number;
    nanoseconds: Number;
  };
  toDate: {
    seconds: Number;
    nanoseconds: Number;
  };
  description: string;
}

const CertiProfile = (props: CertiControllerProps) => {
  const {
    certiUser,
    isEditCerti,
    isEdit,
    setEditCerti,
    onDeleteCerti,
    setCertiUser,
    editCerti,
    fromYear,
    toYear,
  } = CertiProfileController(props);

  return (
    <>
      {editCerti && (
        <FormEditCerti
          open={editCerti}
          onChangeOpen={setEditCerti}
          data={certiUser}
          onChangeHistory={setCertiUser}
        />
      )}
      {certiUser && (
        <div className="flex w-full">
          <div className="flex w-2/12 justify-center border-r-2 border-freeland p-6">
            <h5 className="font-bold text-freeland sm:text-sm  xl:text-lg">{`${fromYear?.slice(0, 4)} - ${toYear?.slice(0, 4)}`}</h5>
          </div>
          <div className="mb-4 ml-5 w-10/12 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            {isEdit && (
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={isEditCerti}
                  className="rounded bg-freeland px-2 py-1 text-white hover:bg-green-500"
                >
                  {isEdit ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  ) : null}
                </button>
                <button
                  type="button"
                  onClick={onDeleteCerti}
                  className="ml-2 rounded bg-red-600 px-2 py-1 text-white hover:bg-red-800"
                >
                  {isEdit ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  ) : null}
                </button>
              </div>
            )}
            <h3 className="text-xl font-bold text-freeland">
              {certiUser.certiTitle}
            </h3>
            <h5 className="text-gray-600">{certiUser.company}</h5>
            <div style={{ whiteSpace: 'pre-line' }}>
              {certiUser.description}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertiProfile;
