import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import { db, storage } from '@/libs/firebase';
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
  const [selectedOptions] = useState<any>(offer.categories);
  const [setSelectedSkills] = useState<any>([]);
  const [setcategorySelectedSkills] = useState<any>([]);
  
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

  useEffect(() => {
    if (offerEdit) {
      setOffer(offerEdit);
    }
  }, [offerEdit]);

  const categoryofferSkillsOptions = [
    {
      category: t('categories.technology'), // Translated category name
      subcategory: [
        { value: 'developing', label: t('skills.developing') },
        { value: 'hardware', label: t('skills.hardware') },
        { value: 'networking', label: t('skills.networking') },
        { value: 'cloudComputing', label: t('skills.cloudComputing') },
      ],
    },
    {
      category: t('categories.videoEditing'),
      subcategory: [
        { value: 'videoEditingSoftware', label: t('skills.videoEditingSoftware') },
        { value: 'motionGraphics', label: t('skills.motionGraphics') },
        { value: 'videoColorGrading', label: t('skills.videoColorGrading') },
        { value: 'soundDesign', label: t('skills.soundDesign') },
      ],
    },
    {
      category: t('categories.graphicDesign'),
      subcategory: [
        { value: 'logoDesign', label: t('skills.logoDesign') },
        { value: 'branding', label: t('skills.branding') },
        { value: 'illustration', label: t('skills.illustration') },
        { value: 'uxUiDesign', label: t('skills.uxUiDesign') },
        { value: 'printDesign', label: t('skills.printDesign') },
      ],
    },
    {
      category: t('categories.digitalMarketing'),
      subcategory: [
        { value: 'seo', label: t('skills.seo') },
        { value: 'socialMediaMarketing', label: t('skills.socialMediaMarketing') },
        { value: 'contentMarketing', label: t('skills.contentMarketing') },
        { value: 'emailMarketing', label: t('skills.emailMarketing') },
        { value: 'ppcAdvertising', label: t('skills.ppcAdvertising') },
      ],
    },
    {
      category: t('categories.gameDevelopment'),
      subcategory: [
        { value: 'gameDesign', label: t('skills.gameDesign') },
        { value: 'gameProgramming', label: t('skills.gameProgramming') },
        { value: '3dModeling', label: t('skills.3dModeling') },
        { value: 'gameArt', label: t('skills.gameArt') },
        { value: 'gameTesting', label: t('skills.gameTesting') },
      ],
    },
    {
      category: t('categories.dataScience'),
      subcategory: [
        { value: 'dataAnalysis', label: t('skills.dataAnalysis') },
        { value: 'machineLearning', label: t('skills.machineLearning') },
        { value: 'dataVisualization', label: t('skills.dataVisualization') },
        { value: 'bigData', label: t('skills.bigData') },
        { value: 'statisticalModeling', label: t('skills.statisticalModeling') },
      ],
    },
    {
      category: t('categories.webDesign'),
      subcategory: [
        { value: 'frontEndDevelopment', label: t('skills.frontEndDevelopment') },
        { value: 'htmlCss', label: t('skills.htmlCss') },
        { value: 'responsiveDesign', label: t('skills.responsiveDesign') },
        { value: 'userInterfaceDesign', label: t('skills.userInterfaceDesign') },
        { value: 'webAnimation', label: t('skills.webAnimation') },
      ],
    },
    {
      category: t('categories.cybersecurity'),
      subcategory: [
        { value: 'networkSecurity', label: t('skills.networkSecurity') },
        { value: 'penetrationTesting', label: t('skills.penetrationTesting') },
        { value: 'cyberThreatIntelligence', label: t('skills.cyberThreatIntelligence') },
        { value: 'incidentResponse', label: t('skills.incidentResponse') },
        { value: 'riskManagement', label: t('skills.riskManagement') },
      ],
    },
    {
      category: t('categories.projectManagement'),
      subcategory: [
        { value: 'agileManagement', label: t('skills.agileManagement') },
        { value: 'scrum', label: t('skills.scrum') },
        { value: 'riskManagement', label: t('skills.riskManagement') },
        { value: 'projectScheduling', label: t('skills.projectScheduling') },
        { value: 'budgeting', label: t('skills.budgeting') },
      ],
    },
    {
      category: t('categories.systemAdministration'),
      subcategory: [
        { value: 'serverManagement', label: t('skills.serverManagement') },
        { value: 'networkAdministration', label: t('skills.networkAdministration') },
        { value: 'cloudInfrastructure', label: t('skills.cloudInfrastructure') },
        { value: 'virtualization', label: t('skills.virtualization') },
        { value: 'backupAndRecovery', label: t('skills.backupAndRecovery') },
      ],
    },
    {
      category: t('categories.programmingLanguages'),
      subcategory: [
        { value: 'javascript', label: t('skills.javascript') },
        { value: 'python', label: t('skills.python') },
        { value: 'java', label: t('skills.java') },
        { value: 'cSharp', label: t('skills.cSharp') },
        { value: 'ruby', label: t('skills.ruby') },
      ],
    },
  ];
  
  const offerSkillsOptions = [
    {
      category: t('categories.technology'), // Translated category name
      skills: [
        { value: 'javascript', label: t('skills.javascript') },
        { value: 'react', label: t('skills.react') },
        { value: 'nodejs', label: t('skills.nodejs') },
        { value: 'typescript', label: t('skills.typescript') },
        { value: 'python', label: t('skills.python') },
        { value: 'django', label: t('skills.django') },
        { value: 'ruby', label: t('skills.ruby') },
        { value: 'php', label: t('skills.php') },
        { value: 'go', label: t('skills.go') },
        { value: 'swift', label: t('skills.swift') },
        { value: 'kotlin', label: t('skills.kotlin') },
        { value: 'elixir', label: t('skills.elixir') },
      ],
    },
    {
      category: t('categories.videoEditing'),
      skills: [
        { value: 'premiere', label: t('skills.premiere') },
        { value: 'davinci', label: t('skills.davinci') },
        { value: 'finalcut', label: t('skills.finalcut') },
        { value: 'aftereffects', label: t('skills.aftereffects') },
        { value: 'audiocity', label: t('skills.audiocity') },
        { value: 'blender', label: t('skills.blender') },
        { value: 'hitfilm', label: t('skills.hitfilm') },
      ],
    },
    {
      category: t('categories.graphicDesign'),
      skills: [
        { value: 'photoshop', label: t('skills.photoshop') },
        { value: 'illustrator', label: t('skills.illustrator') },
        { value: 'figma', label: t('skills.figma') },
        { value: 'indesign', label: t('skills.indesign') },
        { value: 'coreldraw', label: t('skills.coreldraw') },
        { value: 'affinitydesigner', label: t('skills.affinitydesigner') },
        { value: 'canva', label: t('skills.canva') },
        { value: 'gimp', label: t('skills.gimp') },
      ],
    },
    {
      category: t('categories.digitalMarketing'),
      skills: [
        { value: 'seo', label: t('skills.seo') },
        { value: 'ads', label: t('skills.ads') },
        { value: 'facebookads', label: t('skills.facebookads') },
        { value: 'emailmarketing', label: t('skills.emailmarketing') },
        { value: 'contentmarketing', label: t('skills.contentmarketing') },
        { value: 'affiliatemarketing', label: t('skills.affiliatemarketing') },
        { value: 'analytics', label: t('skills.analytics') },
        { value: 'socialmediamarketing', label: t('skills.socialmediamarketing') },
      ],
    },
    {
      category: t('categories.gameDevelopment'),
      skills: [
        { value: 'unity', label: t('skills.unity') },
        { value: 'unreal', label: t('skills.unreal') },
        { value: 'godot', label: t('skills.godot') },
        { value: 'csharp', label: t('skills.csharp') },
        { value: 'cpp', label: t('skills.cpp') },
        { value: 'gametesting', label: t('skills.gametesting') },
        { value: '3dmodeling', label: t('skills.3dmodeling') },
        { value: 'leveldesign', label: t('skills.leveldesign') },
      ],
    },
    {
      category: t('categories.dataScience'),
      skills: [
        { value: 'python', label: t('skills.python') },
        { value: 'r', label: t('skills.r') },
        { value: 'sql', label: t('skills.sql') },
        { value: 'machinelearning', label: t('skills.machinelearning') },
        { value: 'tensorflow', label: t('skills.tensorflow') },
        { value: 'pandas', label: t('skills.pandas') },
        { value: 'numpy', label: t('skills.numpy') },
        { value: 'matplotlib', label: t('skills.matplotlib') },
      ],
    },
    {
      category: t('categories.webDesign'),
      skills: [
        { value: 'html', label: t('skills.html') },
        { value: 'css', label: t('skills.css') },
        { value: 'javascript', label: t('skills.javascript') },
        { value: 'bootstrap', label: t('skills.bootstrap') },
        { value: 'sass', label: t('skills.sass') },
        { value: 'vuejs', label: t('skills.vuejs') },
        { value: 'angular', label: t('skills.angular') },
        { value: 'wordpress', label: t('skills.wordpress') },
        { value: 'responsive', label: t('skills.responsive') },
        { value: 'webflow', label: t('skills.webflow') },
      ],
    },
    {
      category: t('categories.cybersecurity'),
      skills: [
        { value: 'penetrationtesting', label: t('skills.penetrationtesting') },
        { value: 'ethicalhacking', label: t('skills.ethicalhacking') },
        { value: 'firewalls', label: t('skills.firewalls') },
        { value: 'networksecurity', label: t('skills.networksecurity') },
        { value: 'cryptography', label: t('skills.cryptography') },
        { value: 'forensics', label: t('skills.forensics') },
        { value: 'cyberthreat', label: t('skills.cyberthreat') },
      ],
    },
    {
      category: t('categories.projectManagement'),
      skills: [
        { value: 'agile', label: t('skills.agile') },
        { value: 'scrum', label: t('skills.scrum') },
        { value: 'jira', label: t('skills.jira') },
        { value: 'projectmanagement', label: t('skills.projectmanagement') },
        { value: 'trello', label: t('skills.trello') },
        { value: 'microsoftproject', label: t('skills.microsoftproject') },
        { value: 'asana', label: t('skills.asana') },
      ],
    },
    {
      category: t('categories.systemAdministration'),
      skills: [
        { value: 'linux', label: t('skills.linux') },
        { value: 'windowsserver', label: t('skills.windowsserver') },
        { value: 'docker', label: t('skills.docker') },
        { value: 'kubernetes', label: t('skills.kubernetes') },
        { value: 'ansible', label: t('skills.ansible') },
        { value: 'cloudcomputing', label: t('skills.cloudcomputing') },
        { value: 'aws', label: t('skills.aws') },
        { value: 'azure', label: t('skills.azure') },
        { value: 'devops', label: t('skills.devops') },
      ],
    },
    {
      category: t('categories.programmingLanguages'),
      skills: [
        { value: 'java', label: t('skills.java') },
        { value: 'c', label: t('skills.c') },
        { value: 'csharp', label: t('skills.csharp') },
        { value: 'swift', label: t('skills.swift') },
        { value: 'typescript', label: t('skills.typescript') },
        { value: 'python', label: t('skills.python') },
        { value: 'ruby', label: t('skills.ruby') },
        { value: 'go', label: t('skills.go') },
      ],
    }
  ];

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
    if (!offer.durationValue) {
      toast.error(t('error.duration'));
      savedHire(false);
      return;
    }

    try {
      const offerId = uuidv4(); // Generates a unique random ID for the offer

      let fileUrl;
      if (offerFile) {
        const storageRef = ref(
          storage,
          `offers/${user!.uid}/${offerId}/recruiter/${offerFile.name}`,
        );
        await uploadBytes(storageRef, offerFile);
        fileUrl = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
      }

      if (offer.id) {
        await updateDoc(doc(db, 'users', user!.uid, 'offers', offer.id), {
          name: offer.name,
          description: offer.description,
          durationValue: offer.durationValue || null,
          descriptionShort: offer.descriptionShort,
          currency: "€",
          priceHour: offer.priceHour || null,
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
          durationValue: offer.durationValue || null,
          descriptionShort: offer.descriptionShort,
          currency: "€",
          priceHour: offer.priceHour || null,
          categories: selectedOptions || null,
          skillsMin: offer.skillsMin || null,
          createdAt: new Date(),
          fileUrl: fileUrl || offer.fileUrl,
        });

        toast.success(t('success.offerAdded'));
      }

      setOffer({} as Offer);
      setOfferFile(null);
      onFetchOffers(user!.uid);
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setOfferFile(acceptedFiles[0] || null);
    },
    multiple: false,
  });

  const groupedOptions = offerSkillsOptions.map((category) => ({
    label: category.category,
    options: category.skills,
  }));

  const categorygroupedOptions = categoryofferSkillsOptions.map((category) => ({
    label: category.category,
    options: category.subcategory,
  }));

  const handleSkillSelect = (selectedOptions: any) => {
    setSelectedSkills(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };

  const categoryhandleSkillSelect = (selectedOptions: any) => {
    setcategorySelectedSkills(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
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
          />
          <label htmlFor="duration" className="ml-5">
            {t('hire.duration')}:
          </label>
          <input
            id="durationValue"
            type="text"
            value={offer.durationValue}
            onChange={(e) =>
              setOffer({ ...offer, durationValue: parseInt(e.target.value)})
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
                  {t('hire.offerPrice')}:
                </p>
              </div>
              <div className="mb-5 flex px-6">
                <div className="w-6/12">
                  <p>{t('hire.pricePerHour')}: </p>
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
              </div>
            </div>

            <div className="mb-4 ml-5 rounded-md bg-white shadow-md transition-shadow hover:shadow-xl md:w-6/12 xl:w-4/12">
              <div className="rounded-t-md bg-zinc-700 p-3">
                <p className="font-semibold text-white">{t('hire.assignCategories')}:</p>
              </div>
              <div className="p-6">
                <Select
                  isMulti
                  options={categorygroupedOptions}
                  onChange={categoryhandleSkillSelect}
                  getOptionLabel={(e) => `${e.label}`}
                />
              </div>
            </div>

            <div className="mb-4 ml-5 rounded-md bg-white shadow-md transition-shadow hover:shadow-xl md:w-6/12 xl:w-4/12">
              <div className="rounded-t-md bg-zinc-700 p-3">
                <p className="font-semibold text-white">{t('hire.minimumRequirements')}:</p>
              </div>
              <div className="p-6">
                <Select
                  isMulti
                  options={groupedOptions}
                  onChange={handleSkillSelect}
                  getOptionLabel={(e) => `${e.label}`}
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

        <div className="mb-4 w-full rounded-md bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
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
                {t('hire.viewUploadedFile')}
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
