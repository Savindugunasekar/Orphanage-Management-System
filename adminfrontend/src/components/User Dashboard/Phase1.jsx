import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import PrimaryButton from "../elements/PrimaryButton";
import toast from "react-hot-toast";

const ROLES = {
  User: 1010,
  Head: 1910,
  SocialWorker: 2525,
  Admin: 7788,
};

const Phase1 = ({ caseId, caseDetails }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [documentUrls, setDocumentUrls] = useState([]);
  const [files, setFiles] = useState({
    marriageCertificate: null,
    incomeCertificate: null,
    birthCertificate: null,
  });
  const [filePreviews, setFilePreviews] = useState({
    marriageCertificate: null,
    incomeCertificate: null,
    birthCertificate: null,
  });
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [phase1Loading, setPhase1Loading] = useState(false);

  useEffect(() => {
    const fetchDocumentUrls = async () => {
      try {
        const response = await axiosPrivate.get(
          `/file/caseDocuments?caseId=${caseId}`
        );
        setDocumentUrls(response.data.documents);
      } catch (error) {
        console.error("Failed to fetch document URLs:", error);
      }
    };

    fetchDocumentUrls();
  }, [caseId, axiosPrivate]);

  const phase1Complete = async () => {
    try {
      setPhase1Loading(true);
      const response = await axiosPrivate.put(`case/phase1?caseId=${caseId}`);

      if (response.status === 200) {
        setPhase1Loading(false);
        console.log("succcessfully completed");
        toast.success("Phase 1 completed successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event, docType) => {
    const file = event.target.files[0];
    setFiles((prev) => ({ ...prev, [docType]: file }));

    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews((prev) => ({ ...prev, [docType]: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreviews((prev) => ({ ...prev, [docType]: file.name }));
      }
    } else {
      setFilePreviews((prev) => ({ ...prev, [docType]: null }));
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    if (
      !files.marriageCertificate ||
      !files.incomeCertificate ||
      !files.birthCertificate
    ) {
      setUploadStatus("Please select all documents.");
      return;
    }

    const formData = new FormData();
    formData.append("caseId", caseId);
    formData.append("marriageCertificate", files.marriageCertificate);
    formData.append("incomeCertificate", files.incomeCertificate);
    formData.append("birthCertificate", files.birthCertificate);

    try {
      const response = await axiosPrivate.post(
        "/file/caseDocuments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.status);

      setUploadStatus("Files uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload files:", error);
      setUploadStatus("Files upload failed. Please try again.");
    }

    setIsUploading(false);
  };

  if (!caseDetails) return <div>Loading...</div>;
  return (
    <div>
      {auth.roles == 1010 && (
        <div>
          {/* Document upload section */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Upload Documents
          </h1>

          {caseDetails.phase1 === "Ongoing" ? (
            <div>
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Marriage Certificate */}
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                  <label className="block text-lg font-semibold mb-2">
                    Marriage Certificate:
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "marriageCertificate")}
                    className="block w-full text-sm text-gray-700 mb-4 border border-gray-300 rounded"
                  />
                  <div className="border border-gray-300 p-2 rounded-lg bg-gray-100">
                    <p className="text-lg font-semibold mb-2">Preview:</p>
                    {filePreviews.marriageCertificate ? (
                      filePreviews.marriageCertificate.startsWith(
                        "data:image/"
                      ) ? (
                        <img
                          src={filePreviews.marriageCertificate}
                          alt="Marriage Certificate Preview"
                          className="max-w-full max-h-48 rounded"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {filePreviews.marriageCertificate}
                        </p>
                      )
                    ) : (
                      <p className="text-gray-700">No file selected</p>
                    )}
                  </div>
                </div>

                {/* Income Certificate */}
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                  <label className="block text-lg font-semibold mb-2">
                    Income Certificate:
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "incomeCertificate")}
                    className="block w-full text-sm text-gray-700 mb-4 border border-gray-300 rounded"
                  />
                  <div className="border border-gray-300 p-2 rounded-lg bg-gray-100">
                    <p className="text-lg font-semibold mb-2">Preview:</p>
                    {filePreviews.incomeCertificate ? (
                      filePreviews.incomeCertificate.startsWith(
                        "data:image/"
                      ) ? (
                        <img
                          src={filePreviews.incomeCertificate}
                          alt="Income Certificate Preview"
                          className="max-w-full max-h-48 rounded"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {filePreviews.incomeCertificate}
                        </p>
                      )
                    ) : (
                      <p className="text-gray-700">No file selected</p>
                    )}
                  </div>
                </div>

                {/* Birth Certificate */}
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                  <label className="block text-lg font-semibold mb-2">
                    Birth Certificate:
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "birthCertificate")}
                    className="block w-full text-sm text-gray-700 mb-4 border border-gray-300 rounded"
                  />
                  <div className="border border-gray-300 p-2 rounded-lg bg-gray-100">
                    <p className="text-lg font-semibold mb-2">Preview:</p>
                    {filePreviews.birthCertificate ? (
                      filePreviews.birthCertificate.startsWith(
                        "data:image/"
                      ) ? (
                        <img
                          src={filePreviews.birthCertificate}
                          alt="Birth Certificate Preview"
                          className="max-w-full max-h-48 rounded"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {filePreviews.birthCertificate}
                        </p>
                      )
                    ) : (
                      <p className="text-gray-700">No file selected</p>
                    )}
                  </div>
                </div>
              </div>
              <PrimaryButton
                onClick={handleUpload}
                loading={isUploading}
                text={'Upload Documents'}
                disabled={!files.marriageCertificate ||
                  !files.incomeCertificate ||
                  !files.birthCertificate}
                className={'my-5'} />
              {uploadStatus && (
                <p className="mt-4 text-ld text-green-500">{uploadStatus}</p>
              )}
            </div>
          ) : (
            <div>
              <span className="text-green-500 font-semibold text-xl">
                Documents has been verified
              </span>
            </div>
          )}
        </div>
      )}

      {(auth.roles.includes(ROLES.Head) ||
        auth.roles.includes(ROLES.SocialWorker)) && (
          <div id="display-documents" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {documentUrls.map((doc) => (
                <div
                  key={doc.name}
                  className="bg-white shadow-lg rounded-lg p-6 border border-gray-300"
                >
                  <p className="text-xl font-bold mb-4 capitalize">
                    {doc.name.replace("Certificate", " Certificate")}
                  </p>
                  <div className="mb-4">
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="w-full h-auto max-h-80 object-contain rounded-md shadow-md"
                    />
                  </div>
                  <a
                    href={doc.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary font-semibold underline"
                  >
                    Download {doc.name.replace("Certificate", " Certificate")}
                  </a>
                </div>
              ))}
            </div>

            {caseDetails.phase1 === "Ongoing" && (
              <PrimaryButton
                onClick={phase1Complete}
                text="Approve"
                className="mt-6"
                loading={phase1Loading} />

            )}
          </div>
        )}
    </div>
  );
};

export default Phase1;
