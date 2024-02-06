"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/contexts/useFetch";
import { usePatch } from "@/contexts/usePatch";
import { InputBox, FileBox, Buttons } from "@/components/RenderFroms";
import { Formik } from "formik";
import * as Yup from "yup";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from 'react-toastify';
import Loader from "@/components/common/Loader";

const initialData = {
    firstName: "",
    lastName: "",
    company: "",
    postalCode: "",
    sponsorCode: "",
    status: "",
    image: "",
}

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [value, setValue] = useState<any>(null)
    const { data } = useFetch({ url: "users", query: JSON.stringify({ id: params.id }) });
    useEffect(() => {
        if (data.data) {
            setValue(data.data[0])
        }
    }, [data.data])

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        company: Yup.string().required("Company is required"),
        postalCode: Yup.string().required("Postal Code is required"),
        sponsorCode: Yup.string().required("Sponsor Code is required"),
        // status: Yup.string().required("Status is required"),
        image: Yup.string().required("Image is required"),
    });


    const { edit, data: respond, loading } = usePatch();
    const handleUpdate = (values: any) => {
        edit("users", { ...values, id: params.id })
    }

    useEffect(() => {
        if (respond) {
            toast.success(`User update successfully`);
            router.push(`/pro/profile`)
        }
    }, [respond])

    return (
        <>
            {!value ? <Loader /> :
                <Formik
                    initialValues={value}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleUpdate(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (<div className="container mx-auto md:px-10">
                        <p className="my-5 text-lg font-bold text-black">Information About My Company</p>
                        <div className="my-4 border-t-2 border-gray-500"></div>
                        <p className="py-2 font-semibold text-gray-600 text-title-xsm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p className="mt-5 text-lg font-bold text-black">My Contact Information</p>
                        <div className="my-4 border-t-2 border-gray-500"></div>



                        {/* start form section */}

                        <div className='grid grid-cols-1 mb-8 font-inter gap-7 md:grid-cols-4'>
                            <div className="flex flex-col">
                                <InputBox
                                    required={true}
                                    name="company"
                                    label="Company name"
                                    placeholder="Enter Company name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <InputBox
                                    required={true}
                                    name="firstName"
                                    label="First name"
                                    placeholder="Enter First name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <InputBox
                                    required={true}
                                    name="lastName"
                                    label="Last name"
                                    placeholder="Enter Last name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <InputBox
                                    required={true}
                                    name="postalCode"
                                    label="Postal Code"
                                    placeholder="Enter Postal Code"
                                />
                            </div>
                            <div className="flex flex-col">
                                <InputBox
                                    required={true}
                                    name="sponsorCode"
                                    label="Sponsor Code"
                                    placeholder="Enter Sponsor Code"
                                />
                            </div>
                        </div>

                        <p className="mt-5 text-lg font-bold text-black">Your Profile Photo</p>
                        <div className="my-4 border-t-2 border-gray-500"></div>
                        <FileBox
                            required={true}
                            name="image"
                            label="Profile"
                            placeholder="Upload Profile"
                        />
                        <p className="py-5 text-indigo-800 text-xs1">Only images in jpg, jpeg and png format are accepted with a minimum size of 112 pixels by 112 pixels.</p>
                        <div className="flex justify-end mt-5 mb-20 md:mb-40">
                            <Buttons className="px-4 py-2 mt-3 text-sm font-medium text-white bg-indigo-800 border border-indigo-800 rounded-md" value="Save" loading={loading} onClick={handleSubmit} />
                        </div>
                    </div>)}
                </Formik>}

            {/* start last page */}
            <div className="container mx-auto md:px-10">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-black md:text-lg">DESCRIPTION OF MY BUSINESS</p>
                    <button className="p-2 font-medium text-indigo-800 border border-indigo-800 rounded-md text-xs1 md:text-sm ">
                        Edit Details
                    </button>
                </div>
                <div className="my-4 border-t-2 border-gray-500"></div>
                <p className="py-2 font-semibold text-gray-600 text-title-xsm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <div className="flex justify-between mt-5 items-cente">
                    <p className="text-sm font-bold text-black md:text-lg">MY OFFICIAL DOCUMENTS</p>
                    <button className="p-2 font-medium text-indigo-800 border border-indigo-800 rounded-md text-xs1 md:text-sm ">
                        Edit Details
                    </button>
                </div>
                <div className="my-4 border-t-2 border-gray-500"></div>
                <p className="py-2 text-gray-600">You must have certain insurance and documents to certify the legality of your business and its skills. Individuals are sensitive to it.</p>

                <div className="flex my-3 justify-between p-2 shadow-[0px_0px_10px_1px_#F2F6FB]">
                    <div className="text-xs font-semibold">KBIS</div>
                    <div className="flex items-center">
                        <p className="text-xs font-semibold"> Missing document</p>
                        <AiOutlinePlusCircle size="20" className="ml-10 text-indigo-800" />
                    </div>
                </div>
                <div className="flex my-3 justify-between p-2 shadow-[0px_0px_10px_1px_#F2F6FB]">
                    <div className="text-xs font-semibold">Assurance</div>
                    <div className="flex items-center">
                        <p className="text-xs font-semibold"> Missing document</p>
                        <AiOutlinePlusCircle size="20" className="ml-10 text-indigo-800" />
                    </div>
                </div>
                <div className="flex justify-between my-3 p-2 shadow-[0px_0px_10px_1px_#F2F6FB]">
                    <div className="text-xs font-semibold">Ten-year guarantee</div>
                    <div className="flex items-center">
                        <p className="text-xs font-semibold"> Missing document</p>
                        <AiOutlinePlusCircle size="20" className="ml-10 text-indigo-800" />
                    </div>
                </div>
                <p className="mt-5 text-sm font-bold text-black md:text-lg">MY QUALITY LABELS</p>
                <div className="my-4 border-t-2 border-gray-500"></div>

                <div className="flex justify-end mt-5 mb-20 md:mb-40">
                    <button className="px-4 py-2 mt-3 text-sm font-medium text-white bg-indigo-800 border border-indigo-800 rounded-md">
                        Add
                    </button>
                </div>
            </div >
            {/* End last page */}


        </>
    );
}