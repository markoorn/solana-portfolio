import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Project } from '../types/Project';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AnchorProvider, Idl, Program } from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';

type Props = {
  program: Program<Idl>;
  provider: AnchorProvider;
  baseAccount: Keypair;
  address: string;
  project?: Project;
  isVisible: boolean;
  onClose: () => void;
  onProjectUpdated: (project: Project) => void;
  onProjectAdded: (project: Project) => void;
  onProjectDeleted: (id: number) => void;
};

const PLACEHOLDER_IMAGE =
  'https://res.cloudinary.com/silverstag/image/upload/v1664966534/ternoa/placeholder_eukgmf.png';

export default function Modal({
  program,
  provider,
  baseAccount,
  address,
  isVisible,
  onClose,
  project,
  onProjectAdded,
  onProjectUpdated,
  onProjectDeleted,
}: Props) {
  const [newOrUpdatedItem, setNewOrUpdatedItem] = useState<Project>();
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        technologies: project.technologies,
      });
      setNewOrUpdatedItem(project);
    }
  }, [project]);

  const handleClose = (e: any) => {
    if (e.target.id === 'wrapper') {
      cleanupAndClose();
    }
  };

  const cleanupAndClose = () => {
    setLoading(false);
    setImagePreview('');
    onClose();
  };

  const uploadImage = async (files: FileList) => {
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'solana-portfolio');

    const result = await axios.post(
      'https://api.cloudinary.com/v1_1/silverstag/image/upload',
      formData,
    );
    return result.data.secure_url;
  };

  const handleImageChange = (e: any) => {
    if (e.target?.files && e.target.files.length > 0) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onDeleteItem = async (e: any) => {
    //todo handle delete
  };

  const onSubmit = async (data: any) => {
    const projectCopy = { ...newOrUpdatedItem };
    projectCopy.title = data.title;
    projectCopy.description = data.description;
    setLoading(true);

    if (data.image && data.image.length > 0) {
      const imageUrl = await uploadImage(data.image);
      projectCopy.imageUrl = imageUrl;
    }

    try {
      await program.rpc.addProject(
        projectCopy.title,
        projectCopy.description,
        projectCopy.imageUrl,
        {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        },
      );
      console.log('project successfully sent to program', projectCopy);
    } catch (error) {
      console.log('Error sending project:', error);
    }

    onProjectAdded(projectCopy);
    setNewOrUpdatedItem(projectCopy);
    cleanupAndClose();
  };

  const renderForm = () => {
    return (
      <form
        className="w-full max-w-sm container mt-20 mx-auto px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full mb-5">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="name"
          >
            Image
          </label>
          <div className="relative h-64 w-full overflow-hidden mb-4 border border-dashed border-gray-500">
            <input
              required={!newOrUpdatedItem?.id}
              disabled={loading}
              {...register('image')}
              onChange={(e) => handleImageChange(e)}
              accept="image/*"
              type="file"
              className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
            />
            {loading && (
              <div className="text-center p-20 absolute top-0 right-0 left-0 m-auto">
                <div
                  className="spinner-border animate-spin inline-block w-20 h-16 border-4 rounded-full"
                  role="status"
                ></div>
                <h4 className="pt-4">Loading...</h4>
              </div>
            )}
            {!loading && !newOrUpdatedItem?.imageUrl && (
              <div className="text-center py-28 absolute top-0 right-0 left-0 m-auto">
                <h4>Drop or select an image to upload</h4>
              </div>
            )}
            {(imagePreview || newOrUpdatedItem?.imageUrl) && (
              <Image
                className="text-center p-10 absolute top-0 right-0 left-0 m-auto"
                src={
                  imagePreview ||
                  newOrUpdatedItem?.imageUrl ||
                  PLACEHOLDER_IMAGE
                }
                layout={'fill'}
                objectFit={'cover'}
                alt=""
              />
            )}
          </div>
        </div>
        <div className="w-full mb-5">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="name"
          >
            Title
          </label>
          <input
            required
            disabled={loading}
            {...register('title')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline"
            type="text"
            placeholder="Enter title"
          />
          {errors.title && (
            <span className="text-red-500 text-xxs px-2">
              title is required
            </span>
          )}
        </div>
        <div className="w-full mb-5">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            required
            disabled={loading}
            {...register('description')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline h-32"
            placeholder="Enter description"
          />
          {errors.description && (
            <span className="text-red-500 text-xxs px-2">
              description is required
            </span>
          )}
        </div>
        <div className="flex text-center items-center justify-between">
          <button
            disabled={loading}
            className=" block items-center mt-5 disabled:bg-gray-400 bg-blue-400 w-full mx-1 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:text-gray-600 focus:shadow-outline"
          >
            {newOrUpdatedItem?.id ? 'Save Item' : 'Add'}
          </button>
          {newOrUpdatedItem?.id && (
            <button
              disabled={loading}
              onClick={(e) => onDeleteItem(e)}
              className="block mt-5 disabled:bg-gray-400 bg-red-400 w-full mx-1 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:text-gray-600 focus:shadow-outline"
            >
              Delete Item
            </button>
          )}
        </div>
        {loading && (
          <div className="items-center text-center p-4 mx-auto">
            <p className="block uppercase tracking-wide animate-pulse text-gray-700 text-xs font-bold mb-2">
              Submitting...
            </p>
          </div>
        )}
      </form>
    );
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{
        x: 1000,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="fixed right-0 bottom-0 left-0 top-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-100"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="fixed right-0 mx-auto flex flex-col bg-white h-full w-1/2  md:w-1/3 sm:w-full justify-center items-center">
        {renderForm()}
      </div>
    </motion.div>
  );
}
