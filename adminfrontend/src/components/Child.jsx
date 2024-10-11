// Child.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import axios from 'axios';
import ChildEditForm from './ChildEditForm';
import DocumentUploadForm from './DocumentUploadForm';
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';
import LoadingAnimation from './LoadingAnimation';
import AvatarPlaceHolder from '../assets/images/avatar_placeholder.png'
import { PDFView } from './PDFView';
import ImagePreview from './ImagePreview';
import PrimaryButton from './elements/PrimaryButton';
import Loading from './Loading';
import useAuth from "../hooks/useAuth";
import { RiCloseLargeFill } from 'react-icons/ri';

const ROLES = {
  User: 1010,
  Head: 1910,
  Staff: 5528,
  SocialWorker: 2525,
  Admin: 7788,
};

const Child = () => {

  const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (age > 0 && (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))) {
      return age - 1;
    }
    return age;
  }

  const getDob = (dob) => {
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const getBasicInfo = (child) => {
    return {
      'Full Name': child.name,
      'Date of Birth': getDob(child.date_of_birth),
      'Age as of today': getAge(child.date_of_birth),
      'Gender': child.gender,
      'Nationality': child.nationality,
      'Religion': child.religion,
      'Medical Details': child.medicaldetails,
      'Educational Details': child.educationaldetails,
    }
  }

  const { auth } = useAuth();

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate()
  const [child, setChild] = useState({})
  const [editFormVisibility, setEditVisibility] = useState(false);
  const [uploadFormVisibility, setUploadVisibility] = useState(false);
  const { id, childid } = useParams('')
  const [imageURL, setImageURL] = useState('')
  const [basicInfo, setBasicInfo] = useState(getBasicInfo(child))
  const [medicalDocuments, setMedicalDocuments] = useState([])
  const [legalDocuments, setLegalDocuments] = useState([])
  const [educationalDocuments, setEducationalDocuments] = useState([])

  //for document upload
  const [category, setCategory] = useState()
  const [type, setType] = useState()
  const [document, setDocument] = useState()
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [viewDocument, setViewDocument] = useState('')
  const [docVisibility, setDocVisibility] = useState(false)
  const [childDeleteVisibility, setChildDeleteVisibility] = useState(false)
  const [documentDeleteVisibility, setDocumentDeleteVisibility] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  const [imagePreview, setImagePreview] = useState(false)
  const [deleteEnable, setDeleteEnable] = useState(false)
  const [docDeleteEnable, setDocDeleteEnable] = useState(false)

  const getChild = async () => {
    try {
      setPageLoading(true)
      const response = await axiosPrivate.get(`/child/${childid}`);
      setChild(response.data.child)
    } catch (error) {
      console.error("Failed to fetch child:", error);
    }
  }

  const deleteChild = async () => {
    try {
      setDeleteLoading(true)
      setChildDeleteVisibility(false)
      console.log(child)
      await axiosPrivate.post('/request/deleteChild', child)
      toast.success('Delete request logged successfully')
    } catch (error) {
      toast.error(error.response.data)
    } finally {
      setDeleteEnable(false)
      setDeleteLoading(false)
    }
  }

  const getDocuments = async () => {
    try {
      const response = await axiosPrivate.get(`/document/child/${childid}`);
      setMedicalDocuments(response.data.documents.filter(doc => doc.document_type === 'medical'))
      setLegalDocuments(response.data.documents.filter(doc => doc.document_type === 'legal'))
      setEducationalDocuments(response.data.documents.filter(doc => doc.document_type === 'educational'))

    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDocumentLink = async (documentId) => {
    try {
      const response = await axiosPrivate.get(`/file/childDocument/${documentId}`);
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      setViewDocument(response.data.URL)
    } catch (error) {
      console.error('Failed to fetch document:', error.message)
      toast.error('Failed to fetch document:', error.message)
    }
  }

  //upload flow
  const uploadDocument = async (setConfirmVisibility) => {
    try {
      setConfirmVisibility(false)
      if (document.size > 1024 * 1024 * 10) {
        throw new Error('File size should not exceed 10MB')
      }
      //log the request
      setLoading(true)
      // get the signed url
      const urlRequest = await axiosPrivate.get(`/file/childDocumentUpload/${childid}`)
      //upload the file
      await axios.put(urlRequest.data.URL, document)

      const tempId = urlRequest.data.tempId
      //if upload successful log the request
      await axiosPrivate.post('/request/childDocument', {
        childid: childid,
        document_type: category,
        document_name: type,
        tempId: tempId
      })
      setDocument(null)
      setLoading(false)
      setUploadVisibility(false)
      toast.success('File uploaded successfully');

    } catch (error) {
      setDocument(null)
      setLoading(false)
      setConfirmVisibility(false)
      toast.error(error.message)
    }

  }

  const deleteDocument = async () => {
    try {
      console.log(selectedDoc)
      await axiosPrivate.post(`/request/deleteChildDocument`,
        {
          documentId: selectedDoc
        })
      setSelectedDoc(null)
      toast.success('Delete Request Created successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getPhoto = async () => {
    try {
      const response = await axiosPrivate.get(`/file/childPhotoDownload/${childid}`);
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      setImageURL(response.data.URL)
    } catch (error) {
      console.error('Failed to fetch photo:', error)
    }
  }

  const checkProfileDelete = async () => {
    try {
      const response = await axiosPrivate.get(`/application/countByChild/${childid}`);
      const count = await axiosPrivate.get(`/request/byChild/${childid}`)
      if (response.data.count === 0 && count.data.requestCount === 0) setDeleteEnable(true)
      else setDeleteEnable(false)
    } catch (error) {
      toast.error(error)
    }
    setPageLoading(false)
  }

  const checkDocumentDelete = async (documentId) => {
    try {
      const count = await axiosPrivate.get(`/request/byDocument/${documentId}`)
      console.log('count doc', count.data.requestCount === 0)
      if (count.data.requestCount === 0) return true
      return false
    } catch (error) {
      toast.error(error)
      return false
    }
  }

  useEffect(() => {
    console.log('setBasic')
    setBasicInfo(getBasicInfo(child))
  }, [child]);


  useEffect(() => {
    getChild()
    getDocuments()
    getPhoto()
    checkProfileDelete()
  }, []);

  // fix the delete button multiple request bug

  return (
    <div className='mt-20 mx-2 my-5 '>

      {pageLoading ? <Loading /> : <><div className="mx-auto  flex flex-col lg:flex-row mt-2 text-gray-700 bg-gray-50 shadow-md bg-clip-border rounded-xl">
        <button onClick={() => navigate(`/orphanage/${id}?view=child`)} className="m-3 relative justify-start h-fit w-fit bg-transparent hover:bg-orange-600 text-orange-600 font-normal hover:text-white py-2 px-4 border border-orange-600 hover:border-transparent rounded">
          Back
        </button>
        <div className='lg:w-1/3 flex justify-center'>
          <img
            onClick={() => { if (auth.roles.includes(ROLES.Staff)) setImagePreview(true) }}
            className="w-64 h-64 my-auto p-10 rounded-full md:rounded-full max-w-xs transition duration-300 ease-in-out hover:scale-110 drop-shadow" src={imageURL ? imageURL : AvatarPlaceHolder} alt="ERROR" />
        </div>
        <div className="p-6 my-auto text-center lg:text-left lg:w-2/3">
          <h5 className="block mb-2 font-sans text-4xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            {child.name}
          </h5>
          <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-white bg-orange-600 uppercase mb-2">
            Some Orphanage
          </span>
          <p className="block font-sans text-base antialiased font-normal leading-relaxed text-inherit">
            {child.gender} &#183; {getAge(child.date_of_birth)} years old
          </p>
          <div>
            <PrimaryButton onClick={() => setEditVisibility(true)} text={'Edit Profile'} disabled={!auth.roles.includes(ROLES.Staff)} className={'m-3 mt-4 ml-0'} />
            <PrimaryButton onClick={() => setChildDeleteVisibility(true)} text={'Delete Profile'} loading={deleteLoading} disabled={!deleteEnable || !auth.roles.includes(ROLES.Staff)} className={'m-3 mt-4 ml-0'} />
            <PrimaryButton onClick={() => setUploadVisibility(true)} text={'Upload Documents'} disabled={!auth.roles.includes(ROLES.Staff)} className={'m-3 mt-4 ml-0'} />
          </div>
        </div>
      </div>


        <div className="mx-auto relative mt-6 text-black shadow-md bg-clip-border rounded-xl divide-y">

          <div className="p-6 m-auto text-left ">
            <h5 className="block mb-4 font-sans text-4xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Basic Information
            </h5>

            <div className='block font-sans text-m md:text-2xl antialiased font-light leading-relaxed text-inherit ml-5'>
              <table >
                <thead>

                </thead>
                <tbody className='divide-y-0'>
                  {Object.entries(basicInfo).map(([key, value]) => (
                    <tr key={key} className="bg-white">
                      <th scope="row" className="font-light">
                        {key}
                      </th>
                      <td className='pl-5 flex'>
                        : <p className='ml-5'> {value}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div>
            <div className="p-6 m-auto text-left ">
              <h5 className="block mb-4 font-sans text-4xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 disabled:text-black">
                Documents
              </h5>
              <div className='block font-sans text-m md:text-2xl antialiased font-light leading-relaxed text-inherit ml-5'>

                <p className='my-5'>Legal Documents</p>
                <table className="min-w-full font-light text-surface text-center">
                  <tbody >
                    {legalDocuments.map(doc => (
                      <tr key={doc.documentid} className=" border-neutral-200 border-b">
                        <td className="whitespace-nowrap px-6 py-2 w-9/12 text-left">
                          <span
                            onClick={() => {
                              setDocVisibility(true)
                              getDocumentLink(doc.documentid)
                            }}
                            className={`text-blue-400 hover:text-blue-600`}>{doc.document_name}</span></td>

                        <td className="whitespace-nowrap px-6 py-2 w-1/12 ">
                          <button
                            onClick={() => {
                              setSelectedDoc(doc.documentid)
                              setDocumentDeleteVisibility(true)
                            }}
                            disabled={!auth.roles.includes(ROLES.Staff)}
                            className="hover:bg-red-600 rounded bg-red-400 py-1 px-3 font-bold text-red-900 text-xs disabled:bg-slate-400 disabled:text-black  disabled:cursor-not-allowed">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className='my-5'>Medical Documents</p>
                <table className="min-w-full font-light text-surface text-center">
                  <tbody >
                    {medicalDocuments.map(doc => (
                      <tr key={doc.documentid} className=" border-neutral-200 border-b">
                        <td className="whitespace-nowrap px-6 py-2 w-9/12 text-left">
                          <span
                            onClick={() => {
                              setDocVisibility(true)
                              getDocumentLink(doc.documentid)
                            }}
                            className={`text-blue-400 hover:text-blue-600`}>{doc.document_name}</span></td>

                        <td className="whitespace-nowrap px-6 py-2 w-1/12 ">
                          <button

                            onClick={() => {
                              setSelectedDoc(doc.documentid)
                              setDocumentDeleteVisibility(true)
                            }}
                            disabled={!auth.roles.includes(ROLES.Staff)}
                            className="hover:bg-red-600 rounded bg-red-400 py-1 px-3 font-bold text-red-900 text-xs disabled:bg-slate-400 disabled:text-black  disabled:cursor-not-allowed">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className='my-5'>Educational Documents</p>
                <table className="min-w-full font-light text-surface text-center">
                  <tbody >
                    {educationalDocuments.map(doc => (
                      <tr key={doc.documentid} className=" border-neutral-200 border-b">
                        <td className="whitespace-nowrap px-6 py-2 w-9/12 text-left">
                          <span
                            onClick={() => {
                              setDocVisibility(true)
                              getDocumentLink(doc.documentid)
                            }}
                            className={`text-blue-400 hover:text-blue-600`}>{doc.document_name}</span></td>

                        <td className="whitespace-nowrap px-6 py-2 w-1/12 ">
                          <button
                            onClick={() => {
                              setSelectedDoc(doc.documentid)
                              setDocumentDeleteVisibility(true)
                            }}
                            disabled={(!auth.roles.includes(ROLES.Staff))}
                            className="hover:bg-red-600 rounded bg-red-400 py-1 px-3 font-bold text-red-900 text-xs disabled:bg-slate-400 disabled:text-black disabled:cursor-not-allowed">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {uploadFormVisibility ? <DocumentUploadForm loading={loading} setUploadVisibility={setUploadVisibility} category={category} setCategory={setCategory} type={type} setType={setType} document={document} setDocument={setDocument} uploadDocument={uploadDocument} /> : null}
        {editFormVisibility ? <ChildEditForm setEditVisibility={setEditVisibility} child={child} setChild={setChild} imageURL={imageURL} setImageURL={setImageURL} avatarPlaceHolder={AvatarPlaceHolder} /> : null}
        {childDeleteVisibility ? <ConfirmationModal head='Delete Child' body='Are you sure you want to create a delete child request?' handleConfirmation={deleteChild} setVisibility={setChildDeleteVisibility} /> : null}
        {documentDeleteVisibility ? <ConfirmationModal head='Delete Document' body='Are you sure you want to create a delete document request?' handleConfirmation={deleteDocument} setVisibility={setDocumentDeleteVisibility} /> : null}
        {docVisibility &&
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md  py-20 ">
            <section className="px-8 py-4 mx-auto bg-white rounded-md shadow-lg my-5 w-[80vw] border">
              <div className="flex flex-row justify-between">
                <h2 className="m-4 text-2xl font-semibold text-gray-800 flex flex-row">Document</h2>
                {/* close button */}
                <div className='flex flex-row justify-end my-auto ml-5'>
                  <RiCloseLargeFill
                    onClick={() => setDocVisibility(false)}
                    className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
                </div>
              </div>
              <PDFView documentUrl={viewDocument} />
            </section>
          </div>
        }
        {imagePreview && <ImagePreview imageURL={imageURL} setImagePreview={setImagePreview} child={child} setImageURL={setImageURL} />}</>}
    </div>


  );
};

export default Child;
