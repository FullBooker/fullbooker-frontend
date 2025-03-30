"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { ChevronLeft, ChevronRight, Images, Video } from "lucide-react";
import {
  DeleteProductMediaPayload,
  NewProductPayload,
  ProductMediaPayload,
} from "@/domain/dto/input";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { DeviceType, MediaType } from "@/domain/constants";
import { ProductMedia } from "@/domain/product";
import StepHeader from "./stepHeader";
import useDeviceType from "@/lib/hooks/useDeviceType";
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog } from "@headlessui/react";

type ProductMediaProps = {
  isProcessingRequest: boolean;
  newProduct: NewProductPayload;
  uploadProductMedia: (payload: ProductMediaPayload) => void;
  productMedia: Array<ProductMedia>;
  getProductMedia: (productId: string) => void;
  deleteProductMedia: (payload: DeleteProductMediaPayload) => void;
};

const ProductMediaComponent: FC<ProductMediaProps> = ({
  isProcessingRequest,
  newProduct,
  uploadProductMedia,
  productMedia,
  getProductMedia,
  deleteProductMedia,
}) => {
  interface FormData {
    photos: string[];
    video?: string;
  }

  const schema = yup.object().shape({
    photos: yup
      .array()
      .min(1, "At least one photo is required")
      .required("Photos are required"),
    video: yup.string().optional(),
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const deviceType = useDeviceType();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (currentIndex !== null) {
      setCurrentIndex(
        (prevIndex) => ((prevIndex as number) + 1) % productMedia.length
      );
    }
  };

  const handlePrev = () => {
    if (currentIndex !== null) {
      setCurrentIndex(
        (prevIndex) =>
          ((prevIndex as number) - 1 + productMedia.length) %
          productMedia.length
      );
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      photos: [],
      video: "",
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).map((file) =>
      URL.createObjectURL(file)
    );
    const updatedPhotos = [...photos, ...files];
    const file = event.target.files?.[0];
    if (file) {
      uploadProductMedia({
        product_id: newProduct?.id,
        file: file,
        media_type: MediaType.image,
      } as ProductMediaPayload);
    }
    setPhotos(updatedPhotos);
    setValue("photos", updatedPhotos);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    setVideo(videoUrl);
    setValue("video", videoUrl);

    uploadProductMedia({
      product_id: newProduct?.id,
      file,
      media_type: MediaType.video,
    } as ProductMediaPayload);
  };

  const deletePhoto = (id: string) => {
    deleteProductMedia({
      file_id: id,
      media_type: MediaType.image,
      product_id: newProduct?.id,
    } as DeleteProductMediaPayload);
  };

  const deleteVideo = (id: string) => {
    deleteProductMedia({
      file_id: id,
      media_type: MediaType.video,
      product_id: newProduct?.id,
    } as DeleteProductMediaPayload);
  };

  const onSubmit = (data: FormData) => {};

  useEffect(() => {
    getProductMedia(newProduct?.id as string);
  }, []);

  return (
    <div className="pb-[150px] md:pb-[200px]">
      <StepHeader title="Upload Photos and Videos" />
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="px-0 md:px-5 w-full">
          <div className="col-span-2 grid md:grid-cols-2 gap-4 w-full mb-4">
            <div className="grid grid-cols-1 w-full">
              <div className="bg-white px-6 py-12 rounded shadow-xl text-center w-full">
                <span className="text-center mb-4 md:mb-4 flex justify-center">
                  <Images className="text-center text-primary w-8 h-8 md:h-12 md:w-12" />
                </span>
                <p className="text-gray-700 mb-2 md:mb-4">
                  Drag and drop or browse for photos
                </p>
                <label className="mt-3 inline-block bg-primary text-white px-6 py-2 rounded cursor-pointer">
                  {isProcessingRequest ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Browse"
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>
            <div className="gap-4">
              {productMedia?.filter(
                (media: ProductMedia) => media?.media_type === MediaType.image
              )?.length === 0 ? (
                <div className="flex items-center justify-center h-full py-8 md:py-0 border border-dashed border-gray-500">
                  <p className="font-base text-gray-500">
                    Your photos will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 w-full">
                  <div className="col-span-3 grid grid-flow-col auto-cols-max grid-rows-2 gap-2 overflow-x-auto no-scrollbar w-full min-w-full">
                    {productMedia
                      ?.filter(
                        (media: ProductMedia) =>
                          media?.media_type === MediaType.image
                      )
                      ?.map((photo: ProductMedia, index: number) => (
                        <div key={index} className="relative mb-2">
                          <Image
                            src={photo?.file}
                            alt={`Photo ${index + 1}`}
                            width={deviceType === DeviceType.mobile ? 150 : 150}
                            height={
                              deviceType === DeviceType.mobile ? 150 : 150
                            }
                            className="w-full h-[150px] md:h-[150px] object-cover cursor-pointer"
                            unoptimized={true}
                            onClick={() => setCurrentIndex(index)}
                          />
                          <button
                            type="button"
                            onClick={() => deletePhoto(photo.id)}
                            className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs text-center bg-white"
                          >
                            Delete Photo
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-700">Upload Videos (Optional)</p>
          <div className="col-span-2 grid md:grid-cols-2 gap-4 w-full mb-4">
            <div className="grid grid-cols-1">
              <div className="bg-white px-6 py-12 rounded shadow-xl text-center mt-3">
                <span className="text-center mb-4 md:mb-4 flex justify-center">
                  <Video className="text-center text-primary w-8 h-8 md:h-12 md:w-12" />
                </span>
                <p className="text-gray-700 mb-2 md:mb-4">
                  Drag and drop or browse for Videos
                </p>
                <label className="mt-3 inline-block bg-primary text-white px-6 py-2 rounded cursor-pointer">
                  {isProcessingRequest ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Browse"
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </label>
              </div>
            </div>
            <div className="gap-4 mt-4">
              {productMedia?.filter(
                (media: ProductMedia) => media?.media_type === MediaType.video
              )?.length === 0 && (
                <div className="flex items-center justify-center h-full py-8 md:py-0 border border-dashed border-gray-500">
                  <p className="font-base text-gray-500">
                    Your videos will appear here
                  </p>
                </div>
              )}
               <div className="grid grid-cols-3 gap-1 w-full">
               <div className="col-span-3 grid grid-flow-col auto-cols-max grid-rows-2 gap-2 overflow-x-auto no-scrollbar w-full min-w-full">
              {productMedia
                ?.filter(
                  (media: ProductMedia) => media?.media_type === MediaType.video
                )
                ?.map((video: ProductMedia, index: number) => (
                  <div className="relative" key={index}>
                    <video
                      src={video?.file}
                      width={deviceType === DeviceType.mobile ? 150 : 150}
                      height={
                        deviceType === DeviceType.mobile ? 150 : 150
                      }
                      className="w-full h-[150px] md:h-[150px] object-cover cursor-pointer"
                      controls={false}
                      onClick={() => setCurrentIndex(index)}
                    />
                    <button
                      type="button"
                      onClick={() => deleteVideo(video?.id)}
                      className="absolute bottom-2 left-2 text-white bg-opacity-50 px-2 py-1 rounded text-xs"
                    >
                      Delete Video
                    </button>
                  </div>
                ))}
                </div>
                </div>
            </div>
          </div>
        </div>
          <NavigationButtons isProcessingRequest={isProcessingRequest} />
      </form>
      <Dialog
        open={currentIndex !== null}
        onClose={() => setCurrentIndex(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-3xl w-full bg-transaparent rounded-lg p-4">
            <button
              onClick={() => setCurrentIndex(null)}
              className="absolute top-3 right-3 text-white text-2xl"
            >
              &times;
            </button>

            {/* Navigation Buttons */}
            {currentIndex !== null && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-2 md:left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full"
                >
                  <ChevronLeft className="w-8 h-8 md:h-14 md:w-14" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-2 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full"
                >
                  <ChevronRight className="w-8 h-8 md:h-14 md:w-14" />
                </button>
              </>
            )}

            {/* Image Preview */}
            {currentIndex !== null && (
              <div>
                {productMedia[currentIndex]?.media_type === MediaType.image && (
                  <Image
                    src={productMedia[currentIndex]?.file}
                    alt="Preview"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                )}
                {productMedia[currentIndex]?.media_type === MediaType.video && (
                  <video
                    src={productMedia[currentIndex]?.file}
                    className="w-full h-auto object-contain"
                    controls
                  />
                )}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest = state.loading.effects.vendor.uploadProductMedia;
  const { newProduct, productMedia } = state.vendor;
  return {
    isProcessingRequest,
    newProduct,
    productMedia,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  uploadProductMedia: (payload: ProductMediaPayload) =>
    dispatch.vendor.uploadProductMedia(payload),
  getProductMedia: (productId: string) =>
    dispatch.vendor.getProductMedia(productId),
  deleteProductMedia: (payload: DeleteProductMediaPayload) =>
    dispatch.vendor.deleteProductMedia(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductMediaComponent);
