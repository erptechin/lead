"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFetchByLoad } from "@/contexts/useFetchByLoad";
import { useFetch } from "@/contexts/useFetch";
import { usePost } from "@/contexts/usePost";
import { useSearchParams } from 'next/navigation'
import { InputBox, TextareaBox, SelectBox, Buttons } from "@/components/RenderFroms";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import language from "@/contexts/language";


const defaultValue = {
    batimentCategoryId: "",
    title: "",
    description: "",
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    phone: "",
    postalCode: "",
    full_address: ""
}

export default function Page() {
    const params = useSearchParams()
    const name = params.get('name')
    const [step, setStep] = useState<any>(1);
    const [progress, setProgress] = useState<any>(0);
    const [categoryId, setCategoryId] = useState<any>("0");
    const [batimentCategorys, setBatimentCategorys] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [values, setValues] = useState<any>(null);
    let val = 100 / 3
    const { fetch, data: categorys } = useFetchByLoad({ url: "batimentCategorys", query: JSON.stringify({ parentId: categoryId }) });
    const { data: zipcodes } = useFetch({ url: "zipcode", query: JSON.stringify({ showAll: true }) });
    const zipcodeOptions = zipcodes?.data ? zipcodes.data.map((item: any) => {
        return { label: `${item?.name}-${item?.code}`, value: item?.id }
    }) : []

    useEffect(() => {
        fetch()
    }, [categoryId])

    useEffect(() => {
        if (name) {
            setValues({ ...defaultValue, batimentCategoryId: name })
        } else {
            setValues({ ...defaultValue })
        }
    }, [name])

    const { create, data: respond, loading } = usePost();

    const validationSchemaInfo = Yup.object().shape({
        // title: Yup.string().required("Title is required"),
        description: Yup.string().required("Une description est requise"),
    });

    const validationSchemaContact = Yup.object().shape({
        firstName: Yup.string().required("Champ requis"),
        lastName: Yup.string().required("Champ requis"),
        city: Yup.string().required("Champ requise"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Champ requis"),
        phone: Yup.string().required("Champ requis"),
        postalCode: Yup.string().required("Champ requis"),
        full_address: Yup.string().required("Adresse requis"),
    });

    const handlePrevious = () => {
        if (step == 1) {
            setBatimentCategorys(null)
            setCategoryId("0")
            setStep(1)
            setProgress(val)
        } else {
            setStep(step - 1)
            setProgress(val)
        }
    }

    const handleNext = () => {
        if (batimentCategorys) {
            setProgress(val)
            setError(null)
            if (!batimentCategorys?.isParent) {
                setStep(2)
            } else {
                setCategoryId(batimentCategorys?.id)
                setBatimentCategorys(null)
            }
        } else {
            setError('La catégorie est obligatoire')
        }
    }

    const handleUpdate = (value: any) => {
        setProgress(progress == 0 ? val : progress + val)
        if (step == 3) {
            create("batiments", { ...values, ...value, batimentCategoryId: batimentCategorys?.id })
        } else {
            setValues({ ...values, ...value })
            setStep(step + 1)
        }
    }

    useEffect(() => {
        if (respond) {
            toast.success(`Your request added successfully`);
            setValues({})
            setStep(step + 1)
        }
    }, [respond])

    return (
        <>
            <div className="mx-5 mb-10 md:mx-64 md:mb-20">
                {/* stepers start */}
                <div className="relative w-full h-6 my-10 overflow-hidden bg-gray-200 rounded-md">
                    <div className="absolute top-0 left-0 items-center h-full text-sm text-center text-white bg-indigo-600" style={{ width: `${Number(progress).toFixed(0)}%` }}>{`${Number(progress).toFixed(0)}%`}</div>
                </div>
                {/* stepers end */}

                {step == 1 && (<>
                    <div className="mx-3 mb-3 border-b-2 border-indigo-800">
                        <p className="text-sm leading-10 md:text-lg font-Normal text-deep-black">{"Quel est votre problème ? "}</p>
                    </div>
                    <div className="flex flex-wrap justify-normal">
                        {categorys?.data && categorys.data.map((item: any, key: any) => {
                            return <div key={key} className={`flex items-center w-73 md:my-2 my-2 mx-2 ml-2 rounded-[5px] border p-2 cursor-pointer ${batimentCategorys?.id == item.id ? "bg-gray-500" : "border-gray-500"}`}
                                onClick={() => {
                                    setBatimentCategorys(item);
                                }}>
                                {item.icon && (<div className={`flex items-center justify-center rounded-md w-14 h-14 bg-gray-400`}>
                                    <Image
                                        alt=""
                                        width="44"
                                        height="44"
                                        src={item.icon}
                                    />
                                </div>)}
                                <p className="pl-2 text-sm font-normal text-deep-black">{item.name}</p>
                            </div>
                        })}
                    </div>
                    <div>
                        {error && (
                            <div className="mt-1 text-xs-1 text-meta-1">{error}</div>
                        )}
                    </div>
                    <div className="my-4 border-t-2 border-gray-500"></div>
                    <div className="flex justify-center">
                        <Buttons className="p-2 mt-3 mr-2 text-sm font-medium text-indigo-800 border border-indigo-800 rounded-md" value={"Précédent"} onClick={handlePrevious} />
                        <Buttons className="p-2 mt-3 text-sm font-medium text-indigo-800 border border-indigo-800 rounded-md" value={"Suivant"} onClick={handleNext} />
                    </div>
                </>)}

                {step == 2 && (<Formik
                    initialValues={values}
                    validationSchema={validationSchemaInfo}
                    onSubmit={(values: any) => handleUpdate(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                            <div className="mx-3 mb-3 border-b-2 border-indigo-800">
                                <p className="text-sm leading-10 md:text-lg font-Normal text-deep-black md:max-w-2xl">{language.describe}</p>
                            </div>
                            {/* <div className="px-5 mb-2">
                                <InputBox
                                    required={true}
                                    name="title"
                                    label={language.title_label}
                                    placeholder={language.title_placeholder}
                                />
                            </div> */}
                            <div className="px-5">
                                <TextareaBox
                                    required={true}
                                    name="description"
                                    className="w-full p-2 text-xs placeholder-gray-500 border border-gray-500 rounded-xs backdrop:rounded focus:outline-none focus:border-blue-500"
                                    placeholder={language.description_placeholder}
                                />
                            </div>
                            <div className="my-4 border-t-2 border-gray-500"></div>
                            <div className="flex justify-center">
                                <Buttons className="p-2 mt-3 mr-2 text-sm font-medium text-indigo-800 border border-indigo-800 rounded-md" value={"Précédent"} onClick={handlePrevious} />
                                <Buttons className="p-2 mt-3 text-sm font-medium text-indigo-800 border border-indigo-800 rounded-md" value={"Suivant"} onClick={handleSubmit} />
                            </div>
                        </>)}
                </Formik>)}

                {step == 3 && (<Formik
                    initialValues={values}
                    validationSchema={validationSchemaContact}
                    onSubmit={(values: any) => handleUpdate(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                            <div className="mx-3 mb-3 border-b-2 border-indigo-800">
                                <p className="text-sm leading-10 md:text-lg font-Normal text-deep-black md:max-w-2xl">{language.complete_details}</p>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 px-5 py-5">
                                <div className="flex flex-col">
                                    <InputBox
                                        required={true}
                                        name="firstName"
                                        label={language.firstName_label}
                                        placeholder={language.firstName_placeholder}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <InputBox
                                        required={true}
                                        name="lastName"
                                        label={language.lastName_label}
                                        placeholder={language.lastName_placeholder}


                                    />
                                </div>
                                <div className="flex flex-col">
                                    <InputBox
                                        required={true}
                                        name="city"
                                        label={language.city_label}
                                        placeholder={language.city_placeholder}

                                    />
                                </div>
                                <div className="flex flex-col">
                                    <InputBox
                                        required={true}
                                        name="email"
                                        label={language.email_label}
                                        placeholder={language.email_placeholder}

                                    />
                                </div>
                                <div className="flex flex-col">
                                    <InputBox
                                        required={true}
                                        name="phone"
                                        label={language.phone_label}
                                        placeholder={language.phone_placeholder}

                                    />
                                </div>
                                <div className="flex flex-col">
                                    <SelectBox
                                        required={true}
                                        treeCheckable={true}
                                        name="postalCode"
                                        label={language.postal_label}
                                        placeholder={language.postal_placeholder}
                                        options={zipcodeOptions}
                                    />
                                </div>
                            </div>
                            <div className="px-5 mt-4">
                                <InputBox
                                    required={true}
                                    name="full_address"
                                    label={language.address}
                                    className="w-full p-2 text-xs placeholder-gray-500 border border-gray-500 rounded-xs backdrop:rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="my-4 border-t-2 border-gray-500"></div>
                            <div className="flex justify-center">
                                <Buttons className="p-2 mt-3 mr-2 text-sm font-medium text-indigo-800 border border-indigo-800 rounded-md" value={"Précédent"} onClick={handlePrevious} />
                                <Buttons loading={loading} className="p-2 mt-3 text-sm font-medium text-indigo-800 border border-indigo-800 rounded-md" value={"Demander le devis"} onClick={handleSubmit} />
                            </div>
                        </>)}
                </Formik>)}

                {step == 4 && (<>
                    <div className="mb-3 border-b-2 border-indigo-800">
                        <p className="text-sm leading-10 md:text-lg font-Normal text-deep-black md:max-w-2xl">{language.thank_proposal_batiment}</p>
                    </div>
                    {/* <p className="text-sm leading-10 md:text-md font-Normal text-deep-black md:max-w-2xl">{language.confirmation_email}</p> */}
                </>)}
            </div>
        </>
    );
}