"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { Images, Video } from "lucide-react";
import {
  DeleteProductMediaPayload,
  NewProductPayload,
  ProductMediaPayload,
} from "@/domain/dto/input";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { MediaType } from "@/domain/constants";
import { ProductMedia } from "@/domain/product";

type ProductMediaProps = {
  loading: boolean;
  newProduct: NewProductPayload;
  uploadProductMedia: (payload: ProductMediaPayload) => void;
  productMedia: Array<ProductMedia>;
  getProductMedia: (productId: string) => void;
  deleteProductMedia: (payload: DeleteProductMediaPayload) => void;
};

const ProductMediaComponent: FC<ProductMediaProps> = ({
  loading,
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

  const onSubmit = (data: FormData) => {
  };

  useEffect(() => {
    getProductMedia(newProduct?.id as string);
  }, []);

  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 xl:ml-5">
        Upload Photos and Videos
      </p>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="px-0 md:px-5 w-full">
          <div className="col-span-1 grid md:grid-flow-col gap-4 w-full mb-4">
            <div className="grid grid-cols-1">
              <div className="bg-white px-6 py-12 rounded shadow-xl text-center mt-3">
                <span className="text-center mb-4 md:mb-4 flex justify-center">
                  <Images className="text-center text-primary w-8 h-8 md:h-12 md:w-12" />
                </span>
                <p className="text-gray-700 mb-2 md:mb-4">
                  Drag and drop or browse for photos
                </p>
                <label className="mt-3 inline-block bg-primary text-white px-6 py-2 rounded cursor-pointer">
                  Browse
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
            <div className="gap-4 mt-4 ">
              {productMedia?.filter(
                (media: ProductMedia) => media?.media_type === MediaType.image
              )?.length === 0 ? (
                <div className="flex justify-center">
                  <p className="font-base text-red-500">
                    No photos selected yet!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1">
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
                          className="rounded-lg shadow-lg"
                          width={149}
                          height={164}
                          unoptimized={true}
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
              )}
            </div>
          </div>
          <p className="text-gray-700">Upload Videos (Optional)</p>
          <div className="col-span-1 grid md:grid-flow-col gap-4 w-full">
            <div className="grid grid-cols-1">
              <div className="bg-white px-6 py-12 rounded shadow-xl text-center mt-3">
                <span className="text-center mb-4 md:mb-4 flex justify-center">
                  <Video className="text-center text-primary w-8 h-8 md:h-12 md:w-12" />
                </span>
                <p className="text-gray-700 mb-2 md:mb-4">
                  Drag and drop or browse for Videos
                </p>
                <label className="mt-3 inline-block bg-primary text-white px-6 py-2 rounded cursor-pointer">
                  Browse
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
                <div className="flex justify-center">
                  <p className="font-base text-red-500">
                    No video selected yet!
                  </p>
                </div>
              )}
              {productMedia
                ?.filter(
                  (media: ProductMedia) => media?.media_type === MediaType.video
                )
                ?.map((video: ProductMedia, index: number) => (
                  <div className="relative" key={index}>
                    <video
                      src={video?.file}
                      controls
                      className="w-full h-40 object-cover rounded-lg"
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
        <div className="px-2 md:px-10 mt-4 md:mt-10">
          <NavigationButtons />
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.vendor;
  const { newProduct, productMedia } = state.vendor;
  return {
    loading,
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
